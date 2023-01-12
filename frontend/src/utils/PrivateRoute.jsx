import React from 'react'
import { Navigate }from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({Component}) => {
    let {user} = useContext(AuthContext)
    return(
        !user ? <Navigate to="/login" /> : <Component />
    )
}

export default PrivateRoute