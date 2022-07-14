import React, { useState, useEffect, useRef } from 'react'
import style from './AssignRole.module.css'
import { CreateRole, getAuthoritesInfo, logoutUser } from '../../../http'
import { useSelector, useDispatch } from 'react-redux';
import { validateUser } from '../../../authStore/auth';
import axios from 'axios'
import { useHistory, NavLink, Link } from 'react-router-dom'
import { updateFunction } from '../../../authStore/update'














const AssignRole = () => {
    const [inputsfields, setinputsfields] = useState({
        username: "",
        email: "",
        password: "",
        isRole: ""
    })
    const [record, setrecord] = useState([])
    const [Togglesidebar, setTogglesidebar] = useState(false)
    const [ToggleProgramCreation, setToggleProgramCreation] = useState(false)
    const { isRole, username, Profile } = useSelector((state) => { return state.auth })
    const history = useHistory();
    const dispatch = useDispatch();
    const effectRes = useRef(false)



    const toggle = () => {
        setTogglesidebar(!Togglesidebar)
    }

    const logout = async () => {
        console.log(isRole);
        const responce = await logoutUser();
        dispatch(validateUser({ isRole: "" }))
        localStorage.clear();
        return history.go("/")
    }



    const getAdminsRecord = async () => {
        const responce = await getAuthoritesInfo();
        const { data } = responce;
        setrecord(data.record)
    }
    useEffect(() => {
        if (effectRes.current === false) {
            getAdminsRecord()

            return () => {
                effectRes.current = true;
            }
        }

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



    const createRole = async () => {
        const { username, email, password, isRole } = inputsfields;
        if (!username || !email || !password || !isRole) {
            return window.alert("please fill all the fields first!")
        }
        const responce = await CreateRole({ username, email, password, isRole });
        const { data } = responce;
        if (responce.status === 200) {
            setinputsfields({
                username: "",
                email: "",
                password: "",
                isRole: ""
            })
            window.alert(data.message)
            return history.go("/assignRoles")
        }
    }




    return (
        <div className='DasboardSidebar'>
            <div className={Togglesidebar ? "sidebarHide" : "sidebar"}>
                <div className="sidebarLogo">
                    <img src="/images/hz_logo.png" alt="" />
                    <h2>{username}.</h2>
                </div>
                <div className="lists1">
                    <ul className="lists1list">
                        <li>

                            <NavLink to="/admin" >
                                <img src="/images/dashboard.png" alt="" />
                                <span>Home</span></NavLink >
                        </li>
                        <li>

                            <NavLink to="/Courses">
                                <img src="/images/course.png" alt="" />
                                <span>Programs</span></NavLink>
                        </li>
                        {isRole === "Admin" ?
                            <li>
                                <NavLink to="/assignRoles">
                                    <img src="/images/rolesA.png" alt="" />
                                    <span>Roles</span></NavLink>
                            </li>
                            :
                            ""
                        }
                        <li>
                            <NavLink to="/UGForms">
                                <img src="/images/form.png" alt="" />
                                <span>UG Forms</span></NavLink>
                        </li>
                        <li>
                            <NavLink to="/Announcements">
                                <img src="/images/announcements.png" alt="" />
                                <span>Announcements</span></NavLink>
                        </li>
                    </ul>
                </div>
                <div className="lists2">
                    <ul className="lists2list">
                        <li>
                            <Link to="">
                                <img src="/images/settings.png" alt="" />
                                <span>Settings</span></Link>
                        </li>
                        <li>
                        <a href={`${process.env.REACT_APP_Api_Url}/logout`} onClick={logout}>
                                <img src="/images/signout.png" alt="" />
                                <span>Logout</span></a>
                        </li>
                    </ul>
                </div>
            </div>



            <div className={Togglesidebar ? "mainPortionToggle" : "mainPortion"}>

                {/* main featurn dashboard */}
                <div className="mainDashboardFeatureSide">
                    {/* navigation dashboard */}
                    <div className="mainPortionNavbar">
                        <div className="navbarleftside">
                            <img src="/images/menubar.png" alt="" onClick={toggle} />
                            <span>Dashboard</span>
                        </div>
                        <div className="navbarrightside">
                            <div className="rightsidenavbaritem">
                                <img src="/images/message.png" alt="" />
                            </div>
                            <div className="rightsidenavbaritemforProfile">
                                <a href="/Profile" className='profileanchor'>
                                    <img src={Profile} alt="not found" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className={style.mainDashboardcontent}>

                        {/* First part */}
                        <div className={style.FeatureContent}>
                            <div className={style.FeatureNavigation}>
                                <h1>Dashboard</h1>
                                <p>Dashboard <b> {'>'} Roles</b></p>
                            </div>
                            <div className={style.FeatureRightSide}>
                                <button onClick={() => {
                                    setToggleProgramCreation(true)
                                }}>Create Role</button>
                            </div>

                            {/* Form window for Program creation */}
                            <div className={ToggleProgramCreation ? style.CourseCardContainer : style.CourseCardContainerHide}>
                                <div className={style.CourseCard}>
                                    <div className={style.CardTop}>
                                        <div className={style.CourseleftSide}>
                                            <h2>
                                                Role Creation
                                            </h2>
                                        </div>
                                        <div className={style.CourserightSide}>
                                            <img src="/images/cross.png" alt="not found" onClick={() => { setToggleProgramCreation(false) }} />
                                        </div>
                                    </div>
                                    <div className={style.CardBottom}>
                                        <div className={style.CourseAlignfields}>
                                            <div className={style.CourseCardAlignInput}>
                                                <label htmlFor='Username' >Username: </label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    id="Username"
                                                    autoComplete="off"
                                                    placeholder="Username..."
                                                    onChange={handleInputChange}
                                                    value={inputsfields.username}
                                                />
                                            </div>
                                            <div className={style.CourseCardAlignInput}>
                                                <label htmlFor='Useremail' >Email: </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="Useremail"
                                                    autoComplete="off"
                                                    placeholder="Useremail..."
                                                    onChange={handleInputChange}
                                                    value={inputsfields.email}
                                                />
                                            </div>
                                        </div>
                                        <div className="CourseAlignfields">
                                            <div className={style.CourseCardAlignInput}>
                                                <label htmlFor='UserPass' >Password: </label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    id="UserPass"
                                                    placeholder="password.."
                                                    onChange={handleInputChange}
                                                    value={inputsfields.password}
                                                />
                                            </div>
                                            <div className={style.CourseCardAlignInput}>
                                                <label htmlFor='Role' >User Role: </label>
                                                <select name="isRole" id="Role" onChange={handleInputChange}>
                                                    <option value="null">Select Role</option>
                                                    <option value="Supervisor">Supervisor</option>
                                                    <option value="Chairperson of the Department">COD</option>
                                                    <option value="Dean">Dean</option>
                                                    <option value="Director Graduate Studies">Director Graduate Studies</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button onClick={createRole}>Create</button>
                                    </div>
                                </div>
                            </div>

                        </div>


                        {/* second part programs */}
                        <div className="viewAllCourses">
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>
                                            R_id
                                        </th>
                                        <th>
                                            User name
                                        </th>
                                        <th>
                                            Email
                                        </th>
                                        <th>
                                            Password
                                        </th>
                                        <th>
                                            Role
                                        </th>
                                        <th>
                                            Status
                                        </th>
                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {record.map((val, index, array) => {
                                        if (val.isRole !== isRole) {
                                            return (
                                                <tr key={index}>
                                                    <td>{index}</td>
                                                    <td>{val.username}</td>
                                                    <td>{val.email}</td>
                                                    <td>{val.password}</td>
                                                    <td>{val.isRole}</td>
                                                    <td>{val.status === true ? "Online" : "Offline"}</td>
                                                    <td>
                                                        <a href={`/admin/updateRole/${val._id}`} onClick={() => {
                                                            dispatch(updateFunction(val._id))
                                                            localStorage.setItem("id", val._id)
                                                            console.log(val._id);
                                                        }}  >Edit</a>

                                                        <button onClick={async () => {
                                                            try {
                                                                const deleteAdminAuthorityAndUser = await axios.get(`${process.env.REACT_APP_Api_Url}/delete/adminRole/${val._id}`);
                                                                console.log(deleteAdminAuthorityAndUser);
                                                                window.alert("User Deleted..")
                                                                return history.go("/assignRoles");
                                                            } catch (error) {
                                                                console.log(error);
                                                            }
                                                        }}>Delete</button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    })}
                                </tbody>
                            </table>
                        </div>




                        {/* third part of programs */}




                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssignRole