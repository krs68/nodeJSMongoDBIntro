require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

// // Your version -- this did not work -- commenting it out
// // for reference only -- delete later
// app.post('/users/login', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);
//   var email = body.email;
//   var token = body.token;
//   console.log('Body', body);
//   console.log('Body.emil', body.email);
//   console.log('Body.password', body.password);
//   console.log('email', req.body.email);
//   console.log('password', req.body.password);
//   // validate email and password
//   // 1. Get email and token from DB
//   // 2. Make sure email is valid
//   // 3. Using password and token generate newEncryptedPasswd
//   // 4. Make sure both encrypted passwords are same
//   // 5. send back appropriate messages back
//   //
//   // 1. Get email and token from DB
//   User.find(({ email }), (err, result) => {
//     if (err) {
//       return res.status(400).send({ ERROR: 'Invalid Username' });
//     }
//     console.log('Results back from DB:', result);
//     console.log('Results back from DB, what is the token:');
//     console.log(JSON.stringify({result}, undefined, 2));
//     // Not able to figure out how to get token
//     // so initialing toekn with actual value
//     var token1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzUyZmNlNGM5YWYwYzIxMDQwNzExMzIiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTQ4OTQyNTY0fQ.91SqDPxPnMilNjiwm30Jn-oxjYCeq21aNXQg5yTYPkE';
//     var access = 'auth';
//     var id = result._id;
//     var token2 = jwt.sign({_id: id, access}, 'abc123').toString();
//     console.log('New token is:', token2);
//     // token1 and token2 are not the same
//   });


//   res.status(200).send({ body });
// });

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  // res.send(body);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send({ ERROR: 'Not able to login, invalid Username or Password'});
  });
});




module.exports = {app};
