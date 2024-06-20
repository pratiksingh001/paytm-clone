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
            message: "User already present / Incorrect Inputs"
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

router.put("/:userId", async (req, res) => {
    const { success } = updateUserBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(
      { _id: req.params.userId }, // Assuming _id is the field for user ID
      req.body
    );
    
    console.log(req.body)

    res.json({
        message: req.params.userId 
    })
})

router.get('/getAllUsers', async (req, res) => {
    try {
      const allUsers = await User.find({});
  
      if (allUsers.length === 0) {
        return res.json({ message: "No users found" });
      }
  
      res.json({ message: `Found ${allUsers.length} users`, data: allUsers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

module.exports = router