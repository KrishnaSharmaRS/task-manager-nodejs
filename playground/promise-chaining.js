require('../src/database/mongoose')
const Task = require('../src/models/task')

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    console.log(task)
    const count = await Task.countDocuments({ completed: false })

    return count;
}

deleteTaskAndCount("5ed191c17b59b81c9819cfe0").then(count => {
    console.log(count)
}).catch(console.log)

// Task.findByIdAndDelete("5ecfd10a7fa5821778ff742c").then(task => {
//     console.log("Deleted Task: " + task.description);
//     return Task.countDocuments({ completed: false })
// }).then(count => {
//     console.log(count)
// }).catch(error => {
//     console.log(error)
// })