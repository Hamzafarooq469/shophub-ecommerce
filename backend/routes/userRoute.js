
const express = require("express")
const { RegisterUser, SignInUser, } = require("../controllers/userController")

const router = express.Router()

router.post("/registerUser", RegisterUser)
router.post("/signIn",  SignInUser)

module.exports = router