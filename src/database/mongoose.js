const mongoose = require('mongoose')

const databaseUrl = process.env.MONGODB_URL;

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