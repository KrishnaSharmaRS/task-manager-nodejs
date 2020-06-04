const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Task = require('./task')
// const defaultAvatar = new Buffer.alloc(1, "", "base64");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: Buffer,
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        default: function() {
            return this.email
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            // The Below Line means verifying the provided email is already done in User-Routers
            // if (!validator.isEmail(value)) throw new Error('Email is not Valid.')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            if (value.toLowerCase().includes("password")) throw new Error("Password Field can't contain the word 'PASSWORD'")
        }
    },
    age: {
        type: Number,
        default: 14,
        validate(value) {
            if (value < 0) throw new Error("Age must be a positive Number.")
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

// Send Public Profile of the User every-time:-
userSchema.methods.toJSON = function() {
    const publicUser = this.toObject();
    delete publicUser.tokens;
    delete publicUser.__v;
    delete publicUser.password;
    delete publicUser.avatar;

    return publicUser;
}

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// Get Authentication Token for the User:-
userSchema.methods.getAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "KrishnaSharmaRS")

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token;
}

// Find the User by provided credentials.
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('No User Found with the given E-mail.')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Password is not correct!')
    }

    return user
}

// Hash the User Password before saving to the Database.
userSchema.pre('save', async function (next) {
    const user = this;
    
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 6)
    }

    next()
})

userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({ owner: user._id})

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User;