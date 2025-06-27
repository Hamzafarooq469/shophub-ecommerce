

import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../Redux/reducers/userSlice";
import { auth } from "../../firebase/firebase";
import { persistor } from "../../Redux/store"; // Import persistor
import { useNavigate } from "react-router-dom";


const SignOut = () => {
    const navigate = useNavigate()
    const currentUser = useSelector((state) => state.user.currentUser); // Access the current user from the Redux store
    const dispatch = useDispatch();

    const handleSignOut = async () => {
        try {
            await auth.signOut(); // Sign out from Firebase
            dispatch(clearUser()); // Clear the user from Redux state

            // Purge persisted state from localStorage
            await persistor.purge();
            console.log("Persisted state purged!");
            navigate("/")
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <>
            <h1>SignOut</h1>
            {currentUser ? (
                <div>
                    <p>Name: {currentUser.name}</p>
                    <p>Email: {currentUser.email}</p>
                    <p>UID: {currentUser.uid}</p>
                    <p>Admin: {currentUser.isAdmin ? "Yes" : "No"}</p>
                </div>
            ) : (
                <p>No user is logged in.</p>
            )}
            <button onClick={handleSignOut}>Sign Out</button>
        </>
    );
};

export default SignOut;
