const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

// Load Seed Data
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', () => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return (err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          // done();
        }).catch((e) => {});
      });
  });

  it('should not create todo with invalid body data', () => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return (err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          // done();
        }).catch((e) => {});
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', () => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end();
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', () => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end();
  });

  it('should return 404 if todo not found', () => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end();
  });

  it('should return 404 for non-object ids', () => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .catch((e) => {})
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', () => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return (err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          // done();
        }).catch((e) => {});
      });
  });

  it('should return 404 if todo not found', () => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end();
  });

  it('should return 404 if object id is invalid', () => {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .catch((e) => {})
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', () => {
    var hexId = todos[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end();
  });

  it('should clear completedAt when todo is not completed', () => {
    var hexId = todos[1]._id.toHexString();
    var text = 'This should be the new text!!';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end();
  });
});
