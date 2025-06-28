import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../Redux/reducers/userSlice";
import { auth } from "../../firebase/firebase";
import { persistor } from "../../Redux/store";
import { useNavigate, Link } from "react-router-dom";
import { clearCart } from "../../Redux/reducers/guestCartSlice";
import { clearShipping } from "../../Redux/reducers/guestShippingSlice";
import { clearOrder } from "../../Redux/reducers/guestOrderSlice";
import { useState } from "react";

const SignOut = () => {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            await auth.signOut();
            dispatch(clearUser());
            dispatch(clearCart());
            dispatch(clearShipping());
            dispatch(clearOrder());

            await persistor.purge();
            console.log("Persisted state purged!");
            navigate("/");
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Not Signed In
                        </h1>
                        <p className="text-gray-600">You need to be signed in to sign out</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <p className="text-gray-600">No user is currently signed in</p>
                        </div>

                        <Link
                            to="/signIn"
                            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Sign Out
                    </h1>
                    <p className="text-gray-600">Are you sure you want to sign out?</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-white">
                                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                            </span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Hello, {currentUser.name}!
                        </h2>
                        <p className="text-gray-600">{currentUser.email}</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleSignOut}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Signing Out...
                                </div>
                            ) : (
                                "Sign Out"
                            )}
                        </button>

                        <Link
                            to="/"
                            className="block w-full bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-center"
                        >
                            Cancel
                        </Link>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 text-center">
                            Signing out will clear your cart and session data
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignOut;
