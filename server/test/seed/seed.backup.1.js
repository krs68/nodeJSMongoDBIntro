const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
var tokenStr = jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString();

const users = [{ _id: userOneId, email: 'andrew@example.com', password: 'UserOnePass', 
                 tokens: [{access: 'auth', token: tokenStr }] },
               { _id: userTwoId, email: 'jen@example.com', password: 'UserTwoPass'}]

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];


const populateTodos = () => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => { });
};


const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        
        return Promise.all([userOne, userTwo])
    }).then(() => done());
};


module.exports = {todos, populateTodos, users, populateUsers};