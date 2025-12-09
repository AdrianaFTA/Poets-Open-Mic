import React, { useState } from "react";
import { loginUser } from "../services/authService"; 
import { useNavigate } from "react-router-dom";

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {error, setError} = useState("");
    const[loading,setLoading] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try{
            const result = await loginUser({email, password});

            if(result.token){
                localStorage.setItem("token", result.token);
                navigate("/"); // home page
            }else{
                setError(result.message || " login failed, Please try again.");
            }
            }catch(err){
                console.error(err);
                setError("An error occured during login.");
            }finally{
                setLoading(false);
            }
        };

        return(
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <form 
                onSubmit={handleLogin}
                className="bg-white p-6 rounded-2cl shadow-md w-full max-w-md"
                >
                <h2 className="text-2xl font-bold mb-4 text-center"></h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <label className="block mb-2 text-gray-700">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full rounded mb-4"
                    placeholder="Enter your Email"
                    required
                    />

                <label className="block mb-2 text-grey-700">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 w-full rounded mb-4"
                    placeholder="Enter your password"
                    required
                    />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full p-2 rounded"
                    >
                        {loading ? "loggin in...": "login"}
                    </button>

                <p className="text-center text-sm mt-4">
                    Dont have an account{""}
                    <a href="/register" className="text-blue-500 hover:underline">
                    Register
                    </a>
                    </p>
                    </form>
            </div>

        );
    }