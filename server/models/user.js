var mongoose= require('mongoose');

var User = mongoose.model('Users', {
    email: { type: String, required: true, minlength: 5, trim: true},
    password: { type: String, default: null}
});


// var newUser = new User({
//     email: "ravi@example.com",
// });

// newUser.save().then((doc) => {
//     console.log('Saved todo:', JSON.stringify(doc, undefined, 2));
// }, (e) => {
//     console.log('Error Saving:', e);
// });

module.exports = {User};
