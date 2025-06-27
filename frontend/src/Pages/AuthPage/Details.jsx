
import { useSelector } from "react-redux";

const Details = () => {
    const currentUser = useSelector((state) => state.user.currentUser); // Access the current user from the Redux store

    return (
        <div>
            <h1>User Details</h1>
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
        </div>
    );
};

export default Details;
