const mongoose = require('mongoose')

const databaseUrl = "mongodb://127.0.0.1:27017/task-manager-api";

mongoose.connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

// SOME EXAMPLES:-
// User({
//     name: 'Krishna',
//     email: 'Krishna@example.com',
//     password: 'MyNameIsUnKnown'
// }).save().then(console.log).catch(error => console.log(error))

// Task({
//     description: "  Eat Lunch.  "
// }).save().then(console.log).catch(console.log)