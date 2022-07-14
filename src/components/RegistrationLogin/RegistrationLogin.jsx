import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import style from './RegisterLogin.module.css';
import { RegisterUser,LoginUser } from '../../http';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { validateUser } from '../../authStore/auth';


const RegisterLogin = ({ role, link, btn, linkBtn }) => {
    const history = useHistory();
    const dispatch = useDispatch()
    const [inputs, setinputs] = useState({
        username: "",
        email: "",
        password: ""
    })


    // registeration of user
    const registeration = async () => {
        try {
            if (!inputs.username || !inputs.email || !inputs.password) {
                return window.alert("please fill all the fields first!")
            }
            let response = await RegisterUser({ username: inputs.username, email: inputs.email, password: inputs.password });
            if (response.status === 201) {
                window.alert("Registration successfull!")
                return history.push("/")
            } else {
                return window.alert("Registration Failed!")
            }
        } catch (error) {
            return window.alert(error + "Error: User already exist!")
        }
    }


    // login of user
    const signinUser = async () => {
        if (!inputs.username || !inputs.email || !inputs.password) {
            return window.alert("please fill all the fields first!")
        }
        try {
            const response = await LoginUser({ username: inputs.username, email: inputs.email, password: inputs.password });
            const data = await response.data;
            if (response.status === 200) {
                if (data.findUser) {
                    window.alert("User Login Successfully")
                    dispatch(validateUser(data.findUser))
                    return history.push(`/user`)
                }

                if (data.findAdmin.isRole==="Admin") { 
                    window.alert("Admin Login Successfully")
                    dispatch(validateUser(data.findAdmin))
                    return history.push(`/admin`)
                }else{
                    window.alert(`${data.findAdmin.isRole} Login Successfully`)
                    dispatch(validateUser(data.findAdmin))
                    return history.push(`/user`)
                }

            }else if(response.status!==200){
                return window.alert("Error: Login Field...")
            }
        } catch (error) { 
            console.log(error.status);
            return window.alert(error+ "Error: Invalid Credentials...")
        }
    }




    // handle inputs changes
    const handleInput = (event) => {
        const { name, value } = event.target;
        setinputs((preval) => {
            return {
                ...preval,
                [name]: value
            }
        })
    }
    return (
        <div className={style.RegisterLogin}>
            <div className={style.RegisterLoginCard}>
                <div className={style.Card}>
                    <div className={style.inputField}>
                        <label htmlFor='username'>Username</label>
                        <input type="text" name="username" value={inputs.username} placeholder="Enter Username.." id='username' onChange={handleInput} />
                    </div>
                    <div className={style.inputField}>
                        <label htmlFor='email'>Email</label>
                        <input type="email" name="email" required value={inputs.email} placeholder="Enter Email.." id='email' onChange={handleInput} />
                    </div>
                    <div className={style.inputField}>
                        <label htmlFor='password'>Password</label>
                        <input type="password" name="password" value={inputs.password} placeholder="Enter Password.." id='password' onChange={handleInput} />
                    </div>
                    <div className={style.buttonField}>
                        <button onClick={role === "registrationPage" ? registeration : signinUser}>{btn}</button>
                    </div>
                    <div className={style.buttonFieldForLogin}>
                        <p>{btn === "Registration" ? "Already have an account?" : "Create an Accout"}</p>
                        <Link to={link} >{linkBtn}</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterLogin