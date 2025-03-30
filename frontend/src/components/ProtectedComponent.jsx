import { useUser } from "../context/UserContext";
import { useLocation } from "react-router";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

export default function({children}){
    const {user, loading} = useUser();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(()=>{
        console.log("check is protected", user, loading);
        
        if (!user && !loading && location.pathname != "/login") {
            console.log("url",location.pathname)
            navigate('/login');
        }
    },[user,loading])

    return children
}