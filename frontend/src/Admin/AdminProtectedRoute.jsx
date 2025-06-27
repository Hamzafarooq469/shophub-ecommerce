
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRoute = ({ children }) => {
  const currentUser = useSelector((state) => state.user.currentUser);

  // Check if the user is logged in and is an admin
  if (!currentUser || !currentUser.isAdmin) {
    // return <Navigate to="/signIn" />;
    console.log("This user is not allowed admin access")
    return <Navigate to="/not-authorized" />; 
  }

  return children; // Render children only if the user is an admin
};

export default AdminProtectedRoute;
