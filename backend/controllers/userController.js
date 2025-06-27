
const User = require("../models/userModel")
const admin = require("../firebase/firebaseAdmin")

const RegisterUser = async (req, res) => {
    console.log(req.body)
    const { name, email, uid, isAdmin } = req.body
    try {
        if(!name || !email || !uid ) {
            return res.status(401).json({ message: "Please enter all the fields" })
        }
        const existingUserByEmail = await User.findOne({ email });
        const existingUserByUID = await User.findOne({ uid });

        if (existingUserByEmail || existingUserByUID) {
            return res.status(400).json({ message: "User with this email or UID already exists" });
        }

        const user = new User({
            name, email, uid, isAdmin: isAdmin || false
        })
        await user.save();
        const customToken = await admin.auth().createCustomToken(uid);
        res.status(201).json({
            message: "User registered successfully",    
            user: {
                name: user.name,
                email: user.email,
                uid: user.uid,
                isAdmin: user.isAdmin
            },
            token: customToken // Send the token back for session management
        });
    } catch (error) {
        console.log(error)  
    }
}

const SignInUser = async (req, res) => {
    const { idToken } = req.body; // Extracting the `idToken` from the request body
    console.log(req.body); // Logging the request body for debugging purposes

    try {
        if(!idToken) { // Check if `idToken` is provided, if not, respond with an error
            return res.status(401).json({message: "Token is required"});
        }

        const decodeToken = await admin.auth().verifyIdToken(idToken); // Verifying the Firebase ID token to make sure it's valid
        const {uid, email} = decodeToken; // Extracting `uid` and `email` from the decoded token, which Firebase provides after verification

        let user = await User.findOne({email}); // Looking for a user in the MongoDB database with the email extracted from the token

        if(!user) { // If the user is not found in the database, respond with an error
            return res.status(401).json({message: "User not found"});
        }

        res.status(200).json({
            message: "Login Successful", 
            user: { name: user.name,   email: user.email,  uid: user.uid,  isAdmin: user.isAdmin,  
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


module.exports = {
    RegisterUser,
    SignInUser,
}