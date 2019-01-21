var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('ERROR: Could not connect to MongoDB');
    }

    console.log('Successfully Connected to MongoDB');

    const db = client.db('ToDoApp');

    db.collection('ToDos').find({completed: false}).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        return console.log('Error fetching data, ERROR:' + err);
    });

    db.collection('ToDos').find().count().then((count) => {
        console.log(`ToDos Count is:${count}`);
    }, (err) => {
        return console.log('Error fetching data, ERROR:' + err);
    });

    db.collection('Users').find({name: 'Gopal'}).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        return console.log('Error fetching data, ERROR:' + err);
    });

    client.close();

});