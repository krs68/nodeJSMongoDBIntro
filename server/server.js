var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();

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


app.listen(3000, () => {
    console.log('Started Listner on port 3000...');
});


module.exports = {app};