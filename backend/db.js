const mongoose = require('mongoose');
const MONGO_URL = 'mongodb+srv://pratik:password8376@cluster0.xjpikdj.mongodb.net/paytm-clone'

mongoose.connect(MONGO_URL);
// async function connectDB() {
//     await mongoose.connect(MONGO_URL);
//     console.log("DB Connected");
    
// }

// const userSchema = mongoose.Schema({
//     userName: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,         // will understand later
//         lowercase: true,
//         minLength: 3,
//         maxLength: 30
//     },
//     password: { 
//         type: String,
//         required: true,
//         minLength: 3
//     },
//     firstName: {
//         type: String,
//         required: true,
//         trim: true,
//         maxLength: 50,
//     },
//     lastName:{
//         type: String,
//         required: true,
//         trim: true,
//         maxLength: 50,
//     }
// })
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const User = mongoose.model("User", userSchema)
const Account = mongoose.model("Account", accountSchema)

module.exports = {
    User,
    Account
};