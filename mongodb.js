// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient

const { MongoClient, ObjectID } = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager-api'

MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    console.log("Checking DataBase Connection!")
    if (error) {
        return console.log("Unable to connect to Database!")
    }

    // TEST CONNNECTION TO THE DATABASE:-
    console.log("DataBase Connection Success!")

    const db = client.db(databaseName)
    const usersCollection = db.collection('users')
    const tasksCollection = db.collection('tasks')

    // db.collection('users').findOne({ _id: ObjectID("5ecfc0eadb1eaa165c1e70c0") }).then(user => {
    //     if (!user) return console.log("Not Found!")
    //     console.log(user)
    // }).catch(console.log)

    // TESTING:-
    // db.collection('users').deleteOne({ name: "Shivam Sharma"}).then(console.log).catch(console.log)

    // DELETE-MANY METHOD:-

    // db.collection('users').deleteMany({ age: 22 }).then(console.log).catch(console.log)

    // DELETE-ONE METHOD:-

    // db.collection('tasks').deleteOne({ description: "Go to Office"}).then(console.log).catch(console.log)

    // UPDATE-ONE METHOD:-

    // db.collection('users').updateOne({ name: "Shivam"}, { $set: {
    //     name: "Krishna"
    // }}).then((result) => {
    //     console.log("Updated Successfully!")
    // }).catch(error => {
    //     console.log(error)
    // })

    // UPDATE-MANY METHOD:-

    // db.collection('tasks').updateMany({ completed: false }, { 
    //     $set: { completed: true }
    // }).then(result => console.log("Updated Succussfully!"))
    // .catch(console.log)

    // FIND-ONE METHED:-

    // db.collection('users').findOne({name: 'Abhishek'}, (error, result) => {
    //     if (error) return console.log("Unable to Fetch the User.")
    //     console.log(result)
    // })

    //FIND METHOD:-

    // db.collection('users').find({age: 22}).toArray((error, users) => {
    //     console.log(users)
    // })

    // INSERT ONE DOCUMENT IN USERS COLLECTION:-

    // db.collection('users').insertOne({
    //     name: "Krishna",
    //     age: 21
    // })

    // INSERT MANY DOCUMENTS IN USERS COLLECTION:-

    // db.collection('users').insertMany([
    //     {
    //         name: 'Abhishek',
    //         age: 22
    //     }, {
    //         name: 'Shivam',
    //         age: 22
    //     }, {
    //         name: 'Amit',
    //         age: 23
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log("Unable to insert Documents!")
    //     }

    //     console.log(result.ops)
    // })

    // FIND-ONE METHOD TO FETCH A TASK BY ID:-

    // db.collection('tasks').findOne({ _id: new ObjectID("5ecd65d6225d69222c1ff7d7")}, (error, task) => {
    //     if (error) return console.log("Unable to Fetch the Task.")
    //     console.log(task)
    // })

    // FIND METHOD TO FETCH ALL THE TASKS WITH A SPECIFIC CONDITION:-

    // db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
    //     if (error) return console.log('Unable to Fetch the Tasks.')
    //     console.log(tasks)
    // })

    // INSERT MANY DOCUMENTS IN TASKS COLLECTION:-

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Drink Water',
    //         completed: true
    //     }, {
    //         description: 'Complete Home-Work',
    //         completed: false
    //     }, {
    //         description: 'Take Rest',
    //         completed: true
    //     }
    // ], (error, result) => {
    //     if (error) return console.log('Unable to insert the Documents.')

    //     console.log(result.ops)
    // })
})