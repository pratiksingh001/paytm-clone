const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const router = express.Router();
const { authMiddleware } = require("../middleware")

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

const updateUserBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})


router.post("/signUp", async (req, res) => {
    console.log("User Hitted");
    const body = req.body;
    const {success} = signupSchema.safeParse(body);

    // This is to check whether all the inputs are correct
    if(!success){
        return res.json({
            message: "Email already taken / Incorrect Inputs"
        })
    }

    // This is to check if the user is a new user or an existing one
    console.log(JSON.stringify(body));
    const user = await User.findOne({
        username: body.username
    });

    console.log(user)
    // return res.send('hey');

    if(user?._id) {
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

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateUserBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

// router.get('/getAllUsers', authMiddleware , (req, res) => {
    
// })

module.exports = router