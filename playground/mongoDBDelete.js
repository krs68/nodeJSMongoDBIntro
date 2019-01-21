const {MongoClient, ObjectID} = require('mongodb');
// const {ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('ERROR: Could not connect to MongoDB');
    }

    console.log('Successfully Connected to MongoDB');

    const db = client.db('ToDoApp', { useNewUrlParser: true });

    // db.collection('Users').deleteMany({name: 'Sam'}).then((results) => {
    //     console.log(JSON.stringify(results, undefined, 2));
    // }, (err) => {
    //     return console.log('Error deleting data, ERROR:' + err);
    // });

    // var _id = new objectID('5c448245a2e47400fc3a28bf');
    db.collection('Users').findOneAndDelete({_id: new ObjectID('5c450cd3461df85ff1d5a19b')}).then((results) => {
        console.log(JSON.stringify(results, undefined, 2));
    }, (err) => {
        return console.log('Error deleting data, ERROR:' + err);
    });

    client.close();

});