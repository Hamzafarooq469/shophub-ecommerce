

import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth } from "../../firebase/firebase"
import { useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setUser } from "../../Redux/reducers/userSlice"
import '../AuthPageCSS/SignIn.css'

const SignIn = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSignIn = async (e) => {
        e.preventDefault()
        try {
            const result = await signInWithEmailAndPassword(auth, email, password)
            const user = result.user
            if(user) {
                const idToken = await user.getIdToken()
                console.log("Sending data")
                const res = await axios.post("/user/signIn", {idToken})
                console.log("Logged in successfully")
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    name: res.data.user.name,
                    isAdmin: res.data.user.isAdmin,
                    token: idToken,
                };
                dispatch(setUser(userData))

                navigate("/"); // Adjust this path according to your routing
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    const googleSignIn = async (e) => {
        e.preventDefault()
        try {
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user
            const idToken = await user.getIdToken()

            console.log("working")
            const res = await axios.post("/user/signIn", {idToken})
            console.log("Google login Successful")
            const userData = {
                uid: user.uid,
                email: user.email,
                name: res.data.user.name,
                isAdmin: res.data.user.isAdmin,
                token: idToken,
            };
            dispatch(setUser(userData))
            navigate("/");
        } catch (error) {
            console.log(error.message)
        }
    }

  return (
    <>
      <form action="" onSubmit={handleSignIn} >
        <label htmlFor=""> Email: </label>
        <input type="email" placeholder="Enter name" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor=""> Password: </label>
        <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button> Sign In </button>
      </form>

      <button onClick={googleSignIn}> Sign In with Google</button>
    </>
  )
}

export default SignIn



