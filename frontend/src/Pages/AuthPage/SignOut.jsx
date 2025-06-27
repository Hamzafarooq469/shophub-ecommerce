import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../Redux/reducers/userSlice";
import { auth } from "../../firebase/firebase";
import { persistor } from "../../Redux/store"; // Import persistor
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../Redux/reducers/guestCartSlice";
import { clearShipping } from "../../Redux/reducers/guestShippingSlice";
import { clearOrder } from "../../Redux/reducers/guestOrderSlice";

const SignOut = () => {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.currentUser); // Access the current user from the Redux store
    const dispatch = useDispatch();

    const handleSignOut = async () => {
        try {
            await auth.signOut(); // Sign out from Firebase
            dispatch(clearUser()); // Clear the user from Redux state
            dispatch(clearCart())
            dispatch(clearShipping())
            dispatch(clearOrder())

            // Purge persisted state from localStorage
            await persistor.purge();
            console.log("Persisted state purged!");
            navigate("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            {currentUser ? (
                <div className="flex items-center">
                    <span className="text-sm">Hello, {currentUser.name}</span>
                    <button
                        onClick={handleSignOut}
                        className="ml-2 bg-red-500 text-white text-xs py-1 px-2 rounded hover:bg-red-600 transition"
                    >
                        Sign Out
                    </button>
                </div>
            ) : (
                <p className="text-sm">No user is logged in.</p>
            )}
        </div>
    );
};

export default SignOut;
