var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('ERROR: Could not connect to MongoDB');
    }

    console.log('Successfully Connected to MongoDB');

    const db = client.db('ToDoApp');

    db.collection('ToDos').insertOne( {
        test: 'Something to do 3',
        completed: false
    }, (err, result) => {
        if(err) {
            return console.log('Error inserting data, ERROR:' + err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    client.close();

});