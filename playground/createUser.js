var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('ERROR: Could not connect to MongoDB');
    }

    console.log('Successfully Connected to MongoDB');

    const db = client.db('ToDoApp');

    db.collection('Users').insertOne( {
        name: 'Ravi Kasarla',
        age: 25,
        location: 'Rochester' 
    }, (err, result) => {
        if(err) {
            return console.log('Error inserting data, ERROR:' + err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    client.close();

});