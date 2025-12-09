import {useState} from "react";
import { registerUser } from "./services/authService";

export default function Register(){
    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const [username, setUsername]= useState("");
    const [message, setMessage]= useState("");

    const handleRegister = async () => {
        const result = await registerUser({email, password, username});
        if (result.error){
            setMessage(result.error);
        }else{
            setMessage("Registration successful! you can now log in.");
    }
};

return (
    <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl mb-4 font-bold">Register</h2>

        <input
        className="border p-2 w-full mb-2"
        placeholder="Username"
        value={username}
        onChange={(e)=> setUsername(e.target.value)}
        />

        <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={email}
        onChange={(e)=> setEmail(e.target.value)}
        />
        <input
        className="border p-2 w-full mb-2"
        placeholder="Password"
        value={password}
        onChange={(e)=> setPassword(e.target.value)}
        />

        <button
        onClick={handleRegister}
        className="bg-green-600 text-white p-2 w-full"
        >
            Register
        </button>

        {message && <p className="mt-3 test-center test-sm">{message}</p>}

    </div>

)}