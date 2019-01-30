//
// File server.test.js
//
const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [
  { _id: new ObjectID(), text: "First test todo" },
  { _id: new ObjectID(), text: "Second test todo", completed: true, completedAt: 333333 },
  { _id: new ObjectID(), text: "Third test todo" },
  { _id: new ObjectID(), text: "Fourth test todo" },
  { _id: new ObjectID(), text: "Fifth test todo" },
  { _id: new ObjectID(), text: "Sixth test todo" },
  { _id: new ObjectID(), text: "Seventh test todo" }
];

// beforeEach((done) => {
//   Todo.remove({}).then(() => {
//     return Todo.insertMany(todos);
//   }).then(() => done());
// });

beforeEach(() => {
//   Todo.remove({}).then(() => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos);
  });
});


describe('POST /todos', () => {
  it('should create a new todo', () => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return (err);
        }

        Todo.find({ text }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
        });
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
          expect(todos.length).toBe(7);
        });
      });
  });
});


describe('GET /todos', () => {
  it('should get all todos', () => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((resp) => {
        // console.log('resp object is:', resp.body);
        expect(resp.body.todo.length).toBe(7);
      });
  });
});


describe('GET /todos/with a valid id', () => {
  it('should return a valid row', () => {
    var id = todos[0]._id.toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        // expect(res.body.text).toBe(text);
        // console.log('Return Message:', res.body.todos[0].text);
        var returnText = res.body.todos[0].text;
        Todo.findById({ _id: id }).then((todo) => {
          if (!todo) {
            return console.log('ERROR 3: Invalid ID');
          }
          // console.log('Todo By Id:', todo);
          expect(res.body.todos[0].text).toBe(todo.text);
        }).catch((e) => { console.log('Invalid ID:', id); });
      })
      .end((err, res) => {
        if (err) {
          return (err);
        }
        // console.log('Make sure this comes till here...');
      });
  });
});




describe('GET /todos/with a valid id, but not found in database', () => {
  it('should return 404 because there is no data for this id', () => {
    var id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return (err);
        }
      });
  });
});



describe('GET /todos/1234567890', () => {
  it('should return 404 because there is no data for this id', (done) => {
    var id = '1234567890';
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});



////////////////////////////////Delete///////////////////////////////////////
describe('DELETE /todos/:id', () => {
  it('should return a valid deleted row', () => {
    var id = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        // console.log('Line 153:', res.body);
        expect(res.body.todos._id).toBe(id);
      })
      .end((err, res) => {
        if (err) {
          return (err);
        }
        // Make usre data is not in the DB
        Todo.findById(id).then((todo) => {
          expect(todo).toNotExist();
        }).catch((e) => { console.log('Unknown Error:', e); });
      });
  });
});


describe('Delete /todos/with a valid id, but not found in database', () => {
  it('should return 404 because there is no data for this id', () => {
    var id = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return (err);
        }
      });
  });
});



describe('DELETE /todos/invalid hex', () => {
  it('should return 404 because there is no data for this id', () => {
    var id = '1234567890';
    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return (err);
        }
        // done();
      });
  });
});


////////////////////////////////Update///////////////////////////////////////
describe('PATCH /todos/:id', () => {
  it('should update the todo', () => {
    // grab id for the first item
    // update text, set completed to true and set completedAt to time stamp
    // assersions:
    // make sure you get status of 200
    // response body text should equal to what you sent, completed is true and completedAt is a number
    // check DB for text, completed = true and completedAt is a number (.toBeANumber in expect)
    var id = todos[0]._id.toHexString();
    var body = { text: "Updated by Test Script", completed: true, completedAt: new Date().getTime() };
    request(app)
      .patch(`/todos/${id}`)
      .send(body)
      .expect(200)
      .expect((resp) => {
        // console.log('Return Message:', resp.body.todo);
        expect(resp.body.todo.completed).toBe(true);
        Todo.findById(id).then((todo) => {
          if (!todo) {
            return console.log('ERROR 3: Invalid ID');
          }
          // console.log('Todo By Id:', todo);
          expect(resp.body.todo.text).toBe(todo.text);
          expect(resp.body.todo.completed).toBe(todo.completed);
          // console.log('What is completedAt:', todo.completedAt);
          expect(todo.completedAt).toBeA('number');
        }).catch((e) => { return console.log('Errored out in catch block:', e); });
      })
      .end((err, res) => {
        if (err) {
          return (err);
        }
        // console.log('Make sure this comes till here...');
        // done();
      });
  });

  it('should clear completedAt when todo  is not completed', () => {
    // grab id of the second item
    // Update text and set completed to false
    // assersions:
    // make sure you get status of 200
    // response body has the changes you made
    // i.e., text is changed, completed is false, completedAt is null (.toNotExists in expect)
    var id = todos[1]._id.toHexString();
    var body = { completed: false, completedAt: null };
    request(app)
      .patch(`/todos/${id}`)
      .send(body)
      .expect(200)
      .expect((resp) => {
        // console.log('Return Message:', resp.body.todo);
        expect(resp.body.todo.completed).toBe(false);
        expect(resp.body.todo.completedAt).toBeNull;
        Todo.findById(id).then((todo) => {
          if (!todo) {
            return console.log('ERROR 3: Invalid ID');
          }
          // console.log('Todo By Id:', todo);
          expect(resp.body.todo.text).toBe(todo.text);
          expect(resp.body.todo.completed).toBe(todo.completed);
          // console.log('What is completedAt:', todo.completedAt);
          expect(todo.completedAt).toBeNull;
        }).catch((e) => { console.log('Errored out in catch block:', e); });
      })
      .end((err, res) => {
        if (err) {
          return (err);
        }
        // console.log('Make sure this comes till here...');
        // done();
      });
  });
});
  
  
