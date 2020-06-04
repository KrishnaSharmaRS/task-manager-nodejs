const express = require('express')

const Auth = require('../middlewares/authentication')
const Task = require('../models/task')

const router = express.Router()

router.post('/tasks', Auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(406).send(error)
    }
})

router.get('/tasks', Auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed) match.completed = req.query.completed === 'true'
    if(req.query.sortBy) {
        const partsArray = req.query.sortBy.split('_')
        sort[partsArray[0]] = partsArray[1] === 'desc' ? -1 : 1
    }

    try {
        // This is the Normal way to Fetch the Data:-
        // const tasks = await Task.find({ owner: req.user._id })
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(400).send({error: "Something went wrong!"})
    }
})

router.get('/tasks/:id', Auth, async (req, res) => {
    const _id = req.params.id
    
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if(!task) return res.status(404).send({error: "No Task Found!"})
        res.send(task)
    } catch (error) {
        res.status(500).send({error: "Something went Wrong!"})
    }
})

router.patch('/tasks/:id', Auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isOperationValid = updates.every(update => allowedUpdates.includes(update))

    if (!isOperationValid) return res.status(400).send({ error: "Invalid Updates!"})

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if (!task) return res.status(404).send({ error: "No Task Found to be Updated!"})

        updates.forEach(update => task[update] = req.body[update])

        await task.save()

        res.send(task)

    } catch(error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', Auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if(!task) return res.status(404).send({ error: "No Task found to be Deleted!"})
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router;