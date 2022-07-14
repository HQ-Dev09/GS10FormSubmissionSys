import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import { logoutUser, Get_UG_Forms_For_Authority, getAuthoritesInfo, getTotalUsers, Get_All_UG_Forms_FAdmin, GetCourses } from '../../../http';
import { Link, useHistory, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { validateUser } from '../../../authStore/auth'

const Dashboard = () => {
    const [Togglesidebar, setTogglesidebar] = useState(false)
    const [completedUGForms, setcompletedUGForms] = useState([]);
    const [AdminsInfo, setAdminsInfo] = useState([]);
    const [TotalUsers, setTotalUsers] = useState([]);
    const [AllUGForms, setAllUGForms] = useState([]);
    const [AllPrograms, setAllPrograms] = useState([]);
    const dispatch = useDispatch();
    const history = useHistory();



    const toggle = () => {
        setTogglesidebar(!Togglesidebar)
    }


    const { isRole, username, Profile } = useSelector((state) => { return state.auth })
    const logout = async () => {
        console.log(isRole);
        const responce = await logoutUser();
        localStorage.clear();
        dispatch(validateUser({ isRole: "" }))
        return history.go("/")
    }



    const getCompletedUGForms = async () => {
        const responceOne = await Get_UG_Forms_For_Authority();
        const responceTwo = await getAuthoritesInfo();
        const responceThree = await getTotalUsers();
        const responceFour = await Get_All_UG_Forms_FAdmin();
        const responceFive = await GetCourses();
        setcompletedUGForms(responceOne.data.UGForms)
        setAdminsInfo(responceTwo.data.record)
        setTotalUsers(responceThree.data.Users)
        setAllUGForms(responceFour.data.UGForms)
        setAllPrograms(responceFive.data.course)
        // console.log(responceThree.data.Users);
    }
    useEffect(() => {
        getCompletedUGForms()
    }, [])
    // const date = new Date(completedUGForms.Date_of_First_Submission);
    // console.log(AllPrograms);



    return (
        <div className='DasboardSidebar'>
            <div className={Togglesidebar ? "sidebarHide" : "sidebar"}>
                <div className="sidebarLogo">
                    <img src="/images/hz_logo.png" alt="" />
                    <h2>{username}.</h2>
                </div>
                <div className="lists1">
                    <ul className="lists1list">
                        <li className='active'>

                            <NavLink to="/admin">
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
                    <div className="mainDashboardcontent">


                        <div className="FeatureContent">
                            <div className="FeatureNavigation">
                                <h1>Dashboard</h1>
                                <p>Dashboard <b> {'>'} Home</b></p>
                            </div>
                            <div className="FeatureRightSide">
                                <button>Download PDF</button>
                            </div>
                        </div>


                        <div className="boxes">
                            <div className="box">
                                <div className="boxLeftSide">
                                    <img src="/images/course.png" alt="" />
                                </div>
                                <div className="boxRightSide">
                                    <h3>{AllPrograms ? AllPrograms.length : 0}</h3>
                                    <b>Program</b>
                                </div>
                            </div>
                            <div className="box">
                                <div className="boxLeftSide">
                                    <img src="/images/form.png" alt="" />
                                </div>
                                <div className="boxRightSide">
                                    <h3>{AllUGForms ? AllUGForms.length : 0}</h3>
                                    <b>Total Forms</b>
                                </div>
                            </div>
                            <div className="box">
                                <div className="boxLeftSide">
                                    <img src="/images/announcements.png" alt="" />
                                </div>
                                <div className="boxRightSide">
                                    <h3>2</h3>
                                    <b>Announcements</b>
                                </div>
                            </div>
                            <div className="box">
                                <div className="boxLeftSide">
                                    <img src="/images/users.png" alt="" />
                                </div>
                                <div className="boxRightSide">
                                    <h3>{TotalUsers ? TotalUsers.length : 0}</h3>
                                    <b>Total Users</b>
                                </div>
                            </div>
                        </div>


                        <div className="lastPartmaniDashbord">
                            <div className="recentFormactions">
                                <div className="tableLefttop">
                                    <h3>Recent Approved Forms</h3>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>
                                                    User
                                                </th>
                                                <th>
                                                    Submission Date
                                                </th>
                                                <th>
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        {/* incomplete */}
                                        <tbody>
                                            {completedUGForms.map((val, index, arr) => {
                                                let date = new Date(val.Date_of_First_Submission)
                                                if (val.FormStatus === "Complete") {
                                                    return (
                                                        <tr key={index + 1}>
                                                            <td className='align' >
                                                                <div className="userProfilePic">
                                                                    <img src="/images/users.png" alt="" />
                                                                </div>
                                                                <span>{val.Student_Name}</span>
                                                            </td>
                                                            <td>
                                                                {date.toLocaleDateString()}
                                                            </td>
                                                            <td className='approved'>
                                                                <span>Approved</span>
                                                            </td>
                                                        </tr>
                                                    )
                                                } else {
                                                    return (
                                                        <tr key={index + 1}>
                                                            <td className='align' >
                                                                <div className="userprofilenot">
                                                                    <span>NAN</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                NAN
                                                            </td>
                                                            <td className='reject'>
                                                                <span>NAN</span>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="CheckstatusOfAuthorites">
                                <div className="rightsideTableDes">
                                    <h3>
                                        Online Status
                                    </h3>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>
                                                    User
                                                </th>
                                                <th>
                                                    Stauts
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {AdminsInfo.map((val, index, array) => {
                                                return (
                                                    <tr key={index + 1}>
                                                        <td className='align'>
                                                            <div className="userProfilePic">
                                                                <img src={val.UserImage} alt="" />
                                                            </div>
                                                            <span>{val.username} ({val.isRole === "Chairperson of the Department" ? "COD" : val.isRole === "Director Graduate Studies" ? "DGS" : val.isRole})</span>
                                                        </td>
                                                        {val.status ?
                                                            <td className='approved'><span>Online</span></td> :
                                                            <td className='reject'><span>Offline</span></td>
                                                        }

                                                    </tr>
                                                )
                                            })}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard