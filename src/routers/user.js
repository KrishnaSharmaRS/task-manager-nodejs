const express = require('express')
const validator = require('validator')
const multer = require('multer')
const sharp = require('sharp')

const Auth = require('../middlewares/authentication')
const User = require('../models/user')

const router = new express.Router()

const verifyRequest = (email, password = '') => {
    if (email && !validator.isEmail(email)) {
        throw new Error("Email is not valid.")
    }
    if (password && password.length > 16) {
        throw new Error("Password Length cannot be more than 16 Characters.")
    }
}

const verifyUser = async (email, username = '') => {
    if (!email) return;
    const checkEmail = new RegExp("^" + email, "i")
    const checkUsername = new RegExp("^" + username, "i")
    const isUserExist = await User.findOne({ email: checkEmail }) || await User.findOne({ username: checkUsername })
    if (isUserExist) {
        throw new Error("Email/Username already Exists.")
    }
}

router.post('/users', async (req, res) => {
    
    try {
        verifyRequest(req.body.email, req.body.password)
        verifyUser(req.body.email, req.body.username)
        const user = new User(req.body)
        await user.save()
        const token = await user.getAuthToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(406).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        verifyRequest(req.body.email, req.body.password)
        const email = new RegExp("^" + req.body.email, "i");
        const user = await User.findByCredentials(email, req.body.password)
        const token = await user.getAuthToken()
        res.send({user, token})
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.post('/users/logout', Auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logout-all', Auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/users/me', Auth, async (req, res) => {
    res.send(req.user)
})

router.patch("/users/me", Auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age', 'username']
    const isOperationValid = updates.every(update => allowedUpdates.includes(update))
    
    if (!isOperationValid) return res.status(400).send({ error: "Invalid Updates!"})
    
    try {
        verifyRequest(req.body.email, req.body.password)
        await verifyUser(req.body.email, req.body.username)
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.delete('/users/me', Auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

const uploadAvatar = multer({
    limits: {
        fileSize: 1048576
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error("Only JPG/JPEG/PNG Files are Supported!"))
        }
        callback(undefined, true)
    }
})

router.post('/users/me/avatar', Auth, uploadAvatar.single('avatar'), async (req, res) => {
    const bufferImage = await sharp(req.file.buffer).resize({ width: 300, height: 300 }).png().toBuffer()

    req.user.avatar = bufferImage;
    await req.user.save()
    res.send({ message: "Uploaded Successfully."})
}, (error, req, res, next ) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', Auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save()
    res.send("Deleted Successfully.")
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) throw new Error()
        res.set("Content-Type", "image/png").send(user.avatar)
    } catch (error) {
        res.status(404).send({ error: error.message })
    }
})

module.exports = router;