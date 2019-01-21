var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/ToDoApp', { useNewUrlParser: true }, (err, db) => {
    if (err) {
        return console.log('ERROR: Could not connect to MongoDB');
    }

    console.log('Successfully Connected to MongoDB');

    db.collection('ToDos').insertOne( {
        test: 'Something to do2',
        completed: false
    }, (err, result) => {
        if(err) {
            return console.log('Error inserting data, ERROR:' + err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.close();

});