

import { useState } from "react"
import axios from "axios"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../../firebase/firebase"
import { useNavigate } from "react-router-dom"


const SignUp = () => {

    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleRegisterUser = async (e) => {
        e.preventDefault()
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password)
            const user = result.user;
    
            const idToken = await user.getIdToken()
            const userData = {
                uid: user.uid,
                name: name,
                email: user.email,
                isAdmin: false 
            };
            console.log('Sending Data:', userData);
            const res = await axios.post("/user/registerUser", { ...userData, token: idToken });
            console.log(res)
            navigate("/signIn")
        } catch (error) {
            console.error("Registration failed:", error);
            
        }
    }

    const googleRegisterUser = async (e) => {
        e.preventDefault();
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken(); // Get Firebase ID token
    
            // Prepare user data
            const userData = {
                uid: user.uid,
                name: user.displayName || "", // Fallback to an empty string if displayName is not available
                email: user.email || "",
                isAdmin: true
            };
    
            console.log('Google Auth Data:', userData);
            // Send user data and ID token to backend
            const res = await axios.post("/user/registerUser", { ...userData, token: idToken });
            console.log(res);
            
            // Handle success or error
            if (res.status === 201) {
                console.log("User registered successfully");
                navigate("/signIn")
            } else {
                console.error("User registration failed");
            }
        } catch (error) {
            console.error("Google registration failed:", error.message);
        }
    };
    



  return (
    <>
      <form action="" onSubmit={handleRegisterUser}>
        <label htmlFor="">Name: </label>
        <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value) } />    

        <label htmlFor=""> Email: </label>
        <input type="email" placeholder=" john@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />     

        <label htmlFor=""> Password: </label>
        <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button> Sign Up </button>
      </form>

        <button onClick={googleRegisterUser}> Sign Up with Google </button>

    </>
  )
}

export default SignUp
