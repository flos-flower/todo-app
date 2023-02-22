import React from 'react'
import { Navigate }from 'react-router-dom';
import { useContext } from 'react';
import Context from '../context/Context';

const PrivateRoute = ({Component}) => {
    let {user} = useContext(Context)
    return(
        !user ? <Navigate to="/login" /> : <Component />
    )
}

export default PrivateRoute