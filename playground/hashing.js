const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'Ravi1234';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(`Hash value for password ${password} is ${hash}`);

        // Test your hash
        bcrypt.compare(password, hash, (error, result) => {
            console.log(result);
        });
    });
});



// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash:${hash}`);

// var data = {
//     id: 10
// };

// var token = jwt.sign(data, 'abc123');
// console.log(`Token: ${token}`);

// var decoded = jwt.verify(token, 'abc123');
// console.log('Decoded: ', decoded);

