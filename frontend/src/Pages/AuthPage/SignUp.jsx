import { useState } from "react";
import axios from "axios";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegisterUser = async (e) => {
        e.preventDefault();
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;

            const idToken = await user.getIdToken();
            const userData = {
                uid: user.uid,
                name: name,
                email: user.email,
                isAdmin: false,
            };
            console.log("Sending Data:", userData);
            const res = await axios.post("/user/registerUser", { ...userData, token: idToken });
            console.log(res);
            navigate("/signIn");
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    const googleRegisterUser = async (e) => {
        e.preventDefault();
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken(); // Get Firebase ID token

            const userData = {
                uid: user.uid,
                name: user.displayName || "",
                email: user.email || "",
                isAdmin: true,
            };

            console.log("Google Auth Data:", userData);
            const res = await axios.post("/user/registerUser", { ...userData, token: idToken });
            console.log(res);

            if (res.status === 201) {
                console.log("User registered successfully");
                navigate("/signIn");
            } else {
                console.error("User registration failed");
            }
        } catch (error) {
            console.error("Google registration failed:", error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="mb-4 text-2xl font-bold">Sign Up</h2>
            <form onSubmit={handleRegisterUser} className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="john@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none">Sign Up</button>
            </form>

            <button onClick={googleRegisterUser} className="mt-4 p-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none">
                Sign Up with Google
            </button>
        </div>
    );
};

export default SignUp;
