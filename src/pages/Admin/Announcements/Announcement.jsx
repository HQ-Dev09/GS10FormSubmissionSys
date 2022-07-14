import React, { useState, useEffect, useRef } from 'react'
import style from './Announcement.module.css'
import { useHistory, NavLink, Link } from 'react-router-dom'
import { CreatingAnnouncement, logoutUser } from '../../../http'
import { useSelector, useDispatch } from 'react-redux';
import { validateUser } from '../../../authStore/auth';
import { updateFunction } from '../../../authStore/update';
//  1hr = 60min
//         1min= 60sec
//         1day= 24hr
//         1sec=1000milisec
//         Time calculation for days sec hours minuts
//         to get days (1000*60*60*24)   //  Math.floor(result / (1000*60*60*24))
//         to get hours for one day means os current din me kitny ghnty baqi hen // let hoursLeft= Math.floor((result % (1000*60*60*24))  /  (1000*60*60))

//         to get minuts for that hour // let minutesLeft= Math.floor((result % (1000*60*24))  /  (1000*60))

//         to get seconds for that hour //let secondsLeft= Math.floor((result % (1000*60))  /  (1000)) 

const Announcement = () => {
  const [inputsfields, setinputsfields] = useState({
    Title: "",
    Description: "",
    StartingDate: "",
    ClosingDate: "",
    Authority: "",
    Semester: "",
    Only_For: ""
  })

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
    localStorage.clear();
    dispatch(validateUser({ isRole: "" }))
    dispatch(updateFunction(""))
    return history.go("/")
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setinputsfields((preval) => {
      return {
        ...preval,
        [name]: value
      }
    })
  }


  const createAnnouncement = async () => {
    const { Title, Description, Authority, StartingDate, ClosingDate, Semester, Only_For } = inputsfields;
    if (!Title || !Description || !Authority || !StartingDate || !ClosingDate || !Semester || !Only_For) {
      return window.alert("please fill all the fields first!")
    }
    const responce = await CreatingAnnouncement({ Title, Description, Authority, StartingDate, ClosingDate, Semester, Only_For })

    const { data } = responce;
    if (responce.status === 200) {
      setinputsfields({
        Title: "",
        Description: "",
        StartingDate: "",
        ClosingDate: "",
        Authority: "",
        Semester: "",
        Only_For: ""
      })
      window.alert("Successfully Created")
      return history.go("/admin")
    } else {
      window.alert(data.message)
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
                <p>Dashboard <b> {'>'} Announcements</b></p>
              </div>
              <div className={style.FeatureRightSide}>
                <button onClick={() => {
                  setToggleProgramCreation(true)
                }}>Create Annonc..</button>
              </div>

              {/* Form window for Program creation */}
              <div className={ToggleProgramCreation ? style.CourseCardContainer : style.CourseCardContainerHide}>
                <div className={style.CourseCard}>
                  <div className={style.CardTop}>
                    <div className={style.CourseleftSide}>
                      <h2>
                        Announcement 💯
                      </h2>
                    </div>
                    <div className={style.CourserightSide}>
                      <img src="/images/cross.png" alt="not found" onClick={() => { setToggleProgramCreation(false) }} />
                    </div>
                  </div>
                  <div className={style.CardBottom}>
                    <div className={style.CourseAlignfields}>
                      <div className={style.CourseCardAlignInput}>
                        <label htmlFor='Title' >Title: </label>
                        <input
                          type="text"
                          name="Title"
                          id="Title"
                          autoComplete="off"
                          placeholder="Title..."
                          onChange={handleInputChange}
                          value={inputsfields.Title}
                        />
                      </div>
                      <div className={style.CourseCardAlignInput}>
                        <label htmlFor='Authority' >Your Role: </label>
                        <select name="Authority" id="Authority" onChange={handleInputChange}>
                          <option value="">Select Role</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Chairperson of the Department">COD</option>
                          <option value="Dean">Dean</option>
                          <option value="Director Graduate Studies">Director Graduate Studies</option>
                        </select>
                      </div>
                    </div>
                    <div className="CourseAlignfields">
                      <div className={style.CourseCardAlignInput}>
                        <label htmlFor='StartingDate' >Start Date: </label>
                        <input
                          type="datetime-local"
                          name="StartingDate"
                          id="StartingDate"
                          placeholder="StrtingDate.."
                          onChange={handleInputChange}
                          value={inputsfields.StartingDate}
                        />
                      </div>
                      <div className={style.CourseCardAlignInput}>
                        <label htmlFor='ClosingDate' >Closing Date: </label>
                        <input
                          type="datetime-local"
                          name="ClosingDate"
                          id="ClosingDate"
                          placeholder="ClosingDate.."
                          onChange={handleInputChange}
                          value={inputsfields.ClosingDate}
                        />
                      </div>
                    </div>
                    <div className="CourseAlignfields">
                      <div className={style.CourseCardAlignInput}>
                        <label htmlFor='Semester' >Semester: </label>
                        <select name="Semester" id="Semester" onChange={handleInputChange}>
                          <option value="1st-semester">1st</option>
                          <option value="2nd-semester">2nd</option>
                          <option value="3rd-semester">3rd</option>
                          <option value="4th-semester">4th</option>
                          <option value="5th-semester">5th</option>
                          <option value="6th-semester">6th</option>
                          <option value="7th-semester">7th</option>
                          <option value="8th-semester">8th</option>
                        </select>
                      </div>
                      <div className={style.CourseCardAlignInput}>
                        <label htmlFor='Only_For' >Only For: </label>
                        <select name="Only_For" id="Only_For" onChange={handleInputChange} required>
                          <option value="">Status</option>
                          <option value="Regular-student">Regular Student</option>
                          <option value="Govt. Employee">Govt. Employee (on leave)</option>
                          <option value="HEC-Nominee">HEC Nominee</option>
                          <option value="Uni-Empl-FullTime">Employee ( Full Time )</option>
                          <option value="Uni-Empl-PartTime">Employee ( Part Time )</option>
                          <option value="Empl-other-organization">Employee to other organization</option>
                          <option value="Extra-Enrollement">Extra Enrollement</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                    </div>
                    <div className="CourseAlignfields">
                      <div className={style.CourseCardAlignInput}>
                        <label htmlFor='Description' >Description: </label>
                        <textarea
                          name="Description"
                          id="Description"
                          cols="30"
                          rows="10"
                          placeholder='Write Few Words...'
                          onChange={handleInputChange}
                          value={inputsfields.Description}>
                        </textarea>
                      </div>
                    </div>
                    <button onClick={createAnnouncement}>Create</button>
                  </div>
                </div>
              </div>

            </div>


            {/* second part programs */}
            <div className="viewAllCourses">

            </div>




            {/* third part of programs */}




          </div>
        </div>
      </div>
    </div>
  )
}

export default Announcement