import React from 'react'
import { useUser } from '../context/UserContext';


const Logout = () => {
    const {user, logout} = useUser();

  return (
    <div>
        <h1> Are you sure you want to log out? </h1>

        <div style={{color:'grey', 
                fontSize: '0.8rem', 
                cursor:'pointer'}} 
                onClick={logout}>Log out
        </div> 
    </div>
  )
}

export default Logout
