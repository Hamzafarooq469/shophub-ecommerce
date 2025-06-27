import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase"; // Adjust the path to your Firebase config
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../Redux/reducers/userSlice"; // Adjust the path to your userSlice

const SignIn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const user = result.user;

            if (user) {
                const idToken = await user.getIdToken();
                console.log("Sending data");
                const res = await axios.post("/user/signIn", { idToken });
                console.log("Logged in successfully");

                const userData = {
                    uid: user.uid,
                    email: user.email,
                    name: res.data.user.name,
                    isAdmin: res.data.user.isAdmin,
                    token: idToken,
                };
                dispatch(setUser(userData));
                navigate("/"); // Adjust this path according to your routing
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const googleSignIn = async (e) => {
        e.preventDefault();
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken();

            console.log("working");
            const res = await axios.post("/user/signIn", { idToken });
            console.log("Google login Successful");

            const userData = {
                uid: user.uid,
                email: user.email,
                name: res.data.user.name,
                isAdmin: res.data.user.isAdmin,
                token: idToken,
            };
            dispatch(setUser(userData));
            navigate("/");
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-700">Sign In</h2>
                <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600" htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600" htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 focus:outline-none"
                    >
                        Sign In
                    </button>
                </form>
                <button
                    onClick={googleSignIn}
                    className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-500 focus:outline-none"
                >
                    Sign In with Google
                </button>
            </div>
        </div>
    );
};

export default SignIn;
