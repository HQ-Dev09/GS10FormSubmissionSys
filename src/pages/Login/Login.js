import React from 'react'
import RegisterLogin from '../../components/RegistrationLogin/RegistrationLogin'


const Login = () => {

    return (
        <RegisterLogin role={"loginPage"} link={"/register"} btn={"Login"} linkBtn={"Registration"}/>
    )
}

export default Login