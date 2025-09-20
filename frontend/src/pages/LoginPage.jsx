import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    // This is how Vite securely reads the .env variable
    const ADMIN_EMAILS = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];

    const handleLoginSuccess = (credentialResponse) => {
        const decodedToken = jwtDecode(credentialResponse.credential);
        
        // Check if the logged-in user's email matches any of the admin emails
        const isAdmin = ADMIN_EMAILS.includes(decodedToken.email);
        
        // Create a user object that includes the isAdmin flag
        const userPayload = {
            ...decodedToken,
            isAdmin: isAdmin
        };

        login(userPayload);
        
        // If they are an admin, send them straight to the product list!
        if (isAdmin) {
            navigate('/admin/productlist');
        } else {
            navigate('/'); 
        }
    };

    const handleLoginFailure = () => {
        console.log('Login Failed');
        alert('Login failed. Please try again.');
    };

    return (
        <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
            <div className="bg-white p-10 rounded-lg shadow-lg text-center border">
                <h1 className="text-3xl font-bold mb-6 font-playfair text-gray-800">Sign In</h1>
                <p className="text-gray-600 mb-8">Sign in to your account to continue.</p>
                <div className="flex justify-center">
                  <GoogleLogin
                      onSuccess={handleLoginSuccess}
                      onError={handleLoginFailure}
                  />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;