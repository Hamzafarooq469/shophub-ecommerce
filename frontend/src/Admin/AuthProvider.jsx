
// import React, { useEffect } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { useDispatch } from "react-redux";
// import { setUser, clearUser } from "../Redux/reducers/userSlice"; // Adjust path as needed
// import { auth } from "../firebase/firebase"; // Firebase config

// const AuthProvider = ({ children }) => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           // Firebase automatically refreshes the token if necessary
//           const token = await user.getIdToken();
//           const userData = {
//             uid: user.uid,
//             email: user.email,
//             name: user.displayName || "User", // Fallback if displayName isn't set
//             token, // Firebase token
//           };
//           dispatch(setUser(userData));
//         } catch (error) {
//           console.error("Failed to get Firebase token", error);
//         }
//       } else {
//         dispatch(clearUser()); // Clear user when not authenticated
//       }
//     });

//     // Cleanup listener on component unmount
//     return () => unsubscribe();
//   }, [dispatch]);

//   return <>{children}</>;
// };

// export default AuthProvider;
