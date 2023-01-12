import React, {useContext} from 'react';
import AuthContext from '../context/AuthContext';
import '../styles/RegisterStyles.css'
import { useForm } from "react-hook-form";

const RegisterPage = () => {   
    const { register, handleSubmit, formState: { errors } } = useForm();
    let {registerUser} = useContext(AuthContext)
    return ( 
        <div className='formDiv'>
            <form className='submitForm' onSubmit={handleSubmit(registerUser)}>
                <input 
                    type='text' 
                    name='email' 
                    placeholder='Email'  
                    {...register("email", 
                            { 
                                required: true,  
                                pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
                            })}/>
                {errors.email && <p>Wrong email format</p>}
                <input 
                    type='text' 
                    name='username' 
                    placeholder='Username' 
                    {...register("username", { required: true})}
                />
                {errors.username && <p>Please enter the username</p>}
                <input 
                    type='password' 
                    name='password' 
                    placeholder='Password'
                    {...register("password", { required: true})} 
                />
                {errors.password && <p>Please enter the password</p>}
                <input 
                    className='submitButton' 
                    type='submit' 
                />
            </form>
        </div>
     );
}
 
export default RegisterPage;