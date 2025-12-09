import { useEffect } from "react";
import {useNavigate} from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return(
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome to a Poet's Open Mic</h1>

            <button
        </div>
    )
}