import React, { useState, useEffect } from 'react'
import style from "./UpdateAuthority.module.css";
import { getsingleAuthorityInfo, updateAuthorityRole } from '../../../http';
import { useParams,useHistory } from 'react-router-dom'




const UpdateAuthority = () => {
    const [inputsfields, setinputsfields] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [isRole, setisRole] = useState("")

    const params = useParams()
    const history=useHistory();

    const fetchSingleAuthority = async () => {
        const responce = await getsingleAuthorityInfo(Object.values(params).join(""));
        const data = responce.data.user;
        setinputsfields(data)
    }

    useEffect(() => {
        fetchSingleAuthority()
    }, [])


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setinputsfields((preval) => {
            return {
                ...preval,
                [name]: value
            }
        })
    }


    const UpdateRole = async () => {
        const { username, email, password } = inputsfields;
        if (!username || !email || !password || !isRole) {
            return window.alert("please fill all the fields first!")
        }
        const responce = await updateAuthorityRole({ username, email, password, isRole, _id: inputsfields.id });
        // const { data } = responce;
        if (responce.status === 200) {
            window.alert("Updated Successfully..");
            return history.push("/assignRoles")
        } else {
            const { data } = responce;
            return window.alert(data.message) 
        }
    }
    return (
        <div>
            
            <div className={style.Registry_Form}>
                <div className={style.Registry_Form_top}>
                    <h3>Update an Account</h3>
                </div>
                <div className={style.Registry_Form_center}>
                    <div className={style.form_fields}>
                        <label htmlFor="Username">Your Name</label>
                        <input
                            type="text"
                            name="username"
                            id="Username"
                            autoComplete="off"
                            placeholder="enter your username"
                            onChange={handleInputChange}
                            value={inputsfields.username}
                        /><br />
                    </div>
                    <div className={style.form_fields}>
                        <label htmlFor="Useremail">Your Email</label>
                        <input
                            type="email"
                            name="email"
                            id="Useremail"
                            autoComplete="off"
                            placeholder="enter your useremail"
                            onChange={handleInputChange}
                            value={inputsfields.email}
                        /><br />
                    </div>
                    <div className={style.form_fields}>
                        <label htmlFor="UserPass">Your Password</label>
                        <input
                            type="password"
                            name="password"
                            id="UserPass"
                            placeholder="enter your userpassword"
                            onChange={handleInputChange}
                            value={inputsfields.password}
                        /><br />
                    </div>
                    <div className={style.form_fields}>
                        <label htmlFor="Role">Role:</label>
                        <select name="isRole" id="Role" onChange={(e) => { return setisRole(e.target.value) }}>
                            <option value="null">Select Role</option>
                            <option value="Supervisor">Supervisor</option>
                            <option value="Chairperson of the Department">COD</option>
                            <option value="Dean">Dean</option>
                            <option value="Director Graduate Studies">Director Graduate Studies</option>
                        </select>
                        <br />
                    </div>
                    <button onClick={UpdateRole}>Update</button>
                </div>
            </div>
        </div>
    )
}

export default UpdateAuthority