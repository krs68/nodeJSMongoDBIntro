const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [
  { _id: new ObjectID(), text: "First test todo" },
  { _id: new ObjectID(), text: "Second test todo" },
  { _id: new ObjectID(), text: "Third test todo" },
  { _id: new ObjectID(), text: "Fourth test todo" },
  { _id: new ObjectID(), text: "Fifth test todo" },
  { _id: new ObjectID(), text: "Sixth test todo" },
  { _id: new ObjectID(), text: "Seventh test todo" }
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
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
          return done(err);
        }

        Todo.find({ text }).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(7);
          done();
        }).catch((e) => done(e));
      });
  });
});


describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((resp) => {
        // console.log('resp object is:', resp.body);
        expect(resp.body.todo.length).toBe(7);
      })
      .end(done);
  });
});


describe('GET /todos/with a valid id', () => {
  it('should return a valid row', (done) => {
    var id = todos[0]._id.toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        // expect(res.body.text).toBe(text);
        console.log('Return Message:', res.body.todos[0].text);
        var returnText = res.body.todos[0].text;
        Todo.findById({ _id: id }).then((todo) => {
          if (!todo) {
            return console.log('ERROR 3: Invalid ID');
          }
          console.log('Todo By Id:', todo);
          expect(res.body.todos[0].text).toBe(todo.text);
        }).catch((e) => { console.log('Invalid ID:', id); done();});
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        console.log('Make sure this comes till here...');
        done();
      });
  });
});




describe('GET /todos/with a valid id, but not found in database', () => {
  it('should return 404 because there is no data for this id', (done) => {
    var id = new ObjectID().toHexString();
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
