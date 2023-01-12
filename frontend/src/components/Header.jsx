import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/HeaderStyles.css'

const Header = () => {
    let {user, logoutUser} = useContext(AuthContext)
    return ( 
        <div className='headerDiv'>
            {window.location.href==='http://localhost:3000/' ? 
            <div className='homeBtn selected'>
                <Link to='/'>Home</Link>
            </div>:
            <div className='homeBtn'>
                <Link to='/'>Home</Link>
            </div>
            }
            <div className='logoutDiv' >
            {user && <p>Hello, {user.username}</p>}
            {user ? (
                <p className='logoutBtn' onClick={logoutUser}>Logout</p>
            ) : (
                <div className='authDiv'>
                    {window.location.href==='http://localhost:3000/login' ? 
                    <div className='selected' >
                        <Link to='/login'>Login</Link>
                    </div>:
                    <div>
                        <Link to='/login'>Login</Link>
                    </div>
                    }
                    {window.location.href==='http://localhost:3000/register' ? 
                    <div className='selected'>
                    <Link to='/register'>Register</Link>
                    </div>:
                    <div>
                    <Link to='/register'>Register</Link> 
                    </div>
                    }
                </div>
            )}
            </div>
        </div>
     );
}
 
export default Header;