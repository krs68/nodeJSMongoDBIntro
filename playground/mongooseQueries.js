const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = "5c479bbc0315e900e4ab054b"; // Todo
var id = "5c45e5395557821098cc6f64"; // User

if (!ObjectID.isValid(id)) {
    return console.log('ID is invalid:', id);
}

Todo.find({ _id: id}).then((todos) => {
    if(todos.length === 0) {
        return console.log('ERROR 1: Invalid ID');
    }
    console.log('Todos:', todos);
});

Todo.findOne({ _id: id}).then((todo) => {
    if(!todo) {
        return console.log('ERROR 2: Invalid ID');
    }
    console.log('False Todo:', todo);
});

Todo.findById({ _id: id}).then((todo) => {
    if(!todo) {
        return console.log('ERROR 3: Invalid ID');
    }
    console.log('Todo By Id:', todo);
}).catch((e) => { console.log('Invalid ID:', id);});

/////////////////////////////////////////////////////////////////////
// Users
////////////////////////////////////////////////////////////////////
User.find({ _id: id}).then((user) => {
    if(user.length === 0) {
        return console.log('ERROR 1: Invalid ID');
    }
    console.log('User:', user);
});

User.findOne({ _id: id}).then((user) => {
    if(!user) {
        return console.log('ERROR 2: Invalid ID');
    }
    console.log('User:', user);
});

User.findById({ _id: id}).then((user) => {
    if(!user) {
        return console.log('ERROR 3: Invalid ID');
    }
    console.log('User By Id:', user);
}).catch((e) => { console.log('Invalid ID:', id);});
