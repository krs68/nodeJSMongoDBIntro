require('./config/config');

const lodash = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, resp) => {
    // console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        resp.send(doc);
    }, (e) => {
        // console.log('Error:', JSON.stringify(e, undefined, 2));
        resp.status(400).send(e);
    });
});

app.get('/todos', (req, resp) => {
    Todo.find().then((todo) => {
        resp.send({todo});
    }, (e) => {
        resp.status(400).send(e);
    });
});

app.get('/todos/:id', (req, resp) => {
    var id = req.params.id;
    // Validate is isValid
    console.log('Validating id:', id);
    if (!ObjectID.isValid(id)) {
        return resp.status(404).send(`ID Passed is not a valid id:${id}`);
    }
    
    // 404 send back empty

    // Find by ID
    Todo.find({ _id: id}).then((todos) => {
        if(todos.length === 0) {
            var retStr = `No Data found for Id: ${id}`;
            return resp.status(404).send(`No Data found for the ID passed, id:${id}`);
        }
        return resp.status(200).send({todos});
    }).catch((e) => {
        return resp.status(404).send(e);
    });
});


app.delete('/todos/:id', (req, resp) => {
    var id = req.params.id;
    // Validate is isValid
    console.log('Validating id:', id);
    if (!ObjectID.isValid(id)) {
        return resp.status(404).send(`ID Passed is not a valid id:${id}`);
    }
    
    // Find by ID
    Todo.findByIdAndDelete(id).then((todos) => {
        if(!todos) {
            var retStr = `No Data found to delete for Id: ${id}`;
            return resp.status(404).send(`No Data found to delete for the ID passed, id:${id}`);
        }
        return resp.status(200).send({todos});
    }).catch((e) => {
        return resp.status(400).send(e);
    });
});

app.patch('/todos/:id', (req, resp) => {
    var id = req.params.id;
    var body = lodash.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        return resp.status(404).send(`ID Passed is not a valid id:${id}`);
    }

    if (lodash.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completedAt = null;
        body.completed = false;
    }
    
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            return resp.status(400).send(); 
        }
        resp.status(200).send({todo});
    }).catch((e) => {
        resp.status(400).send();
    });
});

app.post('/users', (req, resp) => {
    // console.log(req.body);
    var body = lodash.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        resp.header('x-auth', token).send(user);
    }).catch((e) => {
        // console.log('Error:', JSON.stringify(e, undefined, 2));
        resp.status(400).send(e);
    });
});


app.listen(port, () => {
    console.log(`Started Listner on port ${port}...`);
});


module.exports = {app};