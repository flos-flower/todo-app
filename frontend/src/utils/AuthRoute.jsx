import React from 'react'
import { Navigate }from 'react-router-dom';
import { useContext } from 'react';
import Context from '../context/Context';

const AuthRoute = ({Component}) => {
    let {user} = useContext(Context)
    return(
        user ? <Navigate to="/" /> : <Component />
    )
}

export default AuthRoute