const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const router = express.Router();

const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

const signinSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
})

router.push("/signUp", async (req, res) => {
    const body = req.body;
    const {success} = signupSchema.safeParse(body);

    // This is to check whether all the inputs are correct
    if(!success){
        return res.json({
            message: "Email already taken / Incorrect Inputs"
        })
    }

    // This is to check if the user is a new user or an existing one
    const user = User.findOne({
        username: body.username
    })

    if(user._id){
        return res.json({
            message: "Email already taken / Incorrect Inputs"
        })  
    }

    // After checking that inputs are correct and the user is a new user, then we will create/add that in our db
    const dbUser = await User.create(body);

    // This is the method to create the jwtToken
    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET)

    res.json({
        message: "User created successfully",
        token: token
    })
})

router.post("/signIn", async (req, res) => {
    const body = req.body;

    const {success} = signinSchema.safeParse(body);

    if(!success){
        return res.json({
            message: "Invalid Inputs"
        })
    }

    const dbUser = await User.findOne({
        username: body.username
    });

    if(dbUser){
        const token = jwt.sign({
            userId : dbUser._id
        }, JWT_SECRET)

        res.status(200).json({
            message: "User Signed in successfully",
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Something went wrong while login"
    })

})

module.exports = router