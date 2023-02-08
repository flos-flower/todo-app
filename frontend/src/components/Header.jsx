import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import s from '../styles/HeaderStyles.module.css'

const Header = () => {
    let {user, logoutUser} = useContext(AuthContext)
    return ( 
        <div className={s.headerDiv}>
            {window.location.href==='http://localhost:3000/' ? 
            <div className={`${s.homeBtn} ${s.selected}`}>
                <Link to='/'>Home</Link>
            </div>:
            <div className={s.homeBtn}>
                <Link to='/'>Home</Link>
            </div>
            }
            <div className={s.logoutDiv} >
            {user && <p>Hello, {user.username}</p>}
            {user ? (
                <p className={s.logoutBtn} onClick={logoutUser}>Logout</p>
            ) : (
                <div className={s.authDiv}>
                    {window.location.href==='http://localhost:3000/login' ? 
                    <div className={s.selected} >
                        <Link to='/login'>Login</Link>
                    </div>:
                    <div>
                        <Link to='/login'>Login</Link>
                    </div>
                    }
                    {window.location.href==='http://localhost:3000/register' ? 
                    <div className={s.selected}>
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