const { MongoClient, ObjectID } = require('mongodb');
// const {ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('ERROR: Could not connect to MongoDB');
    }

    console.log('Successfully Connected to MongoDB');

    const db = client.db('ToDoApp', { useNewUrlParser: true });

    db.collection('Users').findOneAndUpdate({ name: 'Don' },
        { $set: { location: 'Dallas' } },
        { returnOriginal: false }
    ).then((results) => {
        console.log(JSON.stringify(results, undefined, 2));
    }, (err) => {
        return console.log('Error Updating data, ERROR:' + err);
    });

    db.collection('Users').findOneAndUpdate({ _id: new ObjectID("5c448245a2e47400fc3a28bf") },
        { $inc: { age: 1} },
        { returnOriginal: false }
    ).then((results) => {
        console.log(JSON.stringify(results, undefined, 2));
    }, (err) => {
        return console.log('Error Updating data, ERROR:' + err);
    });


    client.close();

});