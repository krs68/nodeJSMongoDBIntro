var express = require('express');
var bodyParser = require('body-parser');



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

app.listen(3000, () => {
    console.log('Started Listner on port 3000...');
});


module.exports = {app};