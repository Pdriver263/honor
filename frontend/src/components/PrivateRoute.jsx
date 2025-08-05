
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);
// AuthContext থেকে auth স্টেট নিয়ে আসা

// const  isLoggedIn = localStorage.getItem("loggedIn") === "true";


    // ব্যবহারকারী লগইন করা না থাকলে Login পেজে রিডাইরেক্ট করুন
    return auth ? children : <Navigate to="/login"  />;
};

export default PrivateRoute;