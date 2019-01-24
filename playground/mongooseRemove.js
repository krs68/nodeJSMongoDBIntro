const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

Todo.findOneAndDelete({_id: '5c48c4a1d2343432385de3bc'}).then((result) => {
    console.log(result);
});

// Todo.findByIdAndDelete('5c499165996f0b0cf4b73438').then((result) => {
//     console.log(result);
// });