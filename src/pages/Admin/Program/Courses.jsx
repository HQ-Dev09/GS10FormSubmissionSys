import React, { useState, useEffect, useRef } from 'react'
import './Courses.css'
import { CreateCourse, GetCourses, CreateDegree, logoutUser } from '../../../http';
import { Link, useHistory, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { validateUser } from '../../../authStore/auth'
import { updateCourses } from '../../../authStore/Courses';









const Courses = () => {
  const history = useHistory()
  const [Togglesidebar, setTogglesidebar] = useState(false)
  const [ToggleProgramCreation, setToggleProgramCreation] = useState(false)
  const [ToggleCourseCreation, setToggleCourseCreation] = useState(false)
  const [Degree, setDegree] = useState("")
  const [handleInputs, sethandleInputs] = useState({
    Course_no: "",
    Course_name: "",
    Credit_hour: "",
    Course_status: "",
  })
  const [Courses, setCourses] = useState([])
  const dispatch = useDispatch();
  const effectRes = useRef(false)




  const toggle = () => {
    setTogglesidebar(!Togglesidebar)
  }


  const { isRole, username, Profile } = useSelector((state) => { return state.auth })
  const { Pageno, TotalPages, NxtPage, Increment } = useSelector((state) => { return state.Courses })

  const logout = async () => {
    console.log(isRole);
    const responce = await logoutUser();
    localStorage.clear();
    dispatch(validateUser({ isRole: "" }))
    return history.go("/")
  }





  useEffect(() => {
    if (effectRes.current === false) {

      const allcourses = async () => {
        try {
          const responce = await GetCourses();
          const { data } = responce;
          if (responce.status === 200) {
            setCourses(data.course)
            dispatch(updateCourses({ PaginationCourses: data.course, TotalCourse: data.course.length, Pageno: 0, TotalPages: Math.floor(data.course.length / 5), Increment: 5, NxtPage: 0 }))
          } else {
            return window.alert(data.message)
          }
        } catch (error) {
          return window.alert(error)
        }
      }
      allcourses()

      return () => {
        effectRes.current = true;
      }
    }

  }, [])



  // create Degree
  const createDegree = async () => {
    if (!Degree) {
      return window.alert("Please fill the field first!")
    } else if (Degree.length <= 3) {
      return window.alert("Program name must be greater than 3 Chrachters.")
    } else {
      const responce = await CreateDegree({ Degree });
      const { data } = responce;
      setDegree("");
      window.alert(data.message)
      return history.go("/admin")
    }
  }


  const handleInputsChange = async (e) => {
    const { name, value } = e.target;
    sethandleInputs((preval) => {
      return {
        ...preval,
        [name]: value
      }
    })
  }


  const submitData = async () => {
    const { Degree, Course_no, Course_name, Credit_hour, Course_status, SelectDegree } = handleInputs;
    const checkDegree = SelectDegree === "other" ? Degree : SelectDegree;
    if (!checkDegree || !Course_no || !Course_name || !Credit_hour || !Course_status) {
      return window.alert("please fill all the fields first");
    }

    try {
      const responce = await CreateCourse({ Degree: SelectDegree === "other" ? Degree : SelectDegree, Course_no, Course_name, Credit_hour, Course_status });
      const { data } = responce;
      if (responce.status === 200) {
        console.log(data);
        window.alert(data.message)
        return history.go("/admin")
      } else if (responce.status === 400 || responce.status === 401) {
        return window.alert("Course already Exist in this degree.")
      }
    } catch (error) {
      return window.alert("Course with this number already exits in this Program...")
    }
  }



  // let count = 1;
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
          <div className="mainDashboardcontent">

            {/* First part */}
            <div className="FeatureContent">
              <div className="FeatureNavigation">
                <h1>Dashboard</h1>
                <p>Dashboard <b> {'>'} Courses</b></p>
              </div>
              <div className="FeatureRightSide">
                <button onClick={() => {
                  setToggleProgramCreation(true)
                }}>Create Program</button>
              </div>

              {/* Form window for Program creation */}
              <div className={ToggleProgramCreation ? "Create_Program" : "Hide_Create_Program"}>
                <div className="ProgramCard">
                  <div className="CardTop">
                    <div className="leftSide">
                      <h2>
                        Program Creation
                      </h2>
                    </div>
                    <div className="rightSide">
                      <img src="/images/cross.png" alt="not found" onClick={() => {
                        setToggleProgramCreation(false)
                      }} />
                    </div>
                  </div>
                  <div className="CardBottom">
                    <div className="ProgramCardAlignInput">
                      <label htmlFor='Degree' >Name: </label>
                      <input type="text"
                        name='Degree'
                        placeholder='Create Degree...'
                        id='Degree'
                        value={Degree}
                        onChange={(event) => { return setDegree(event.target.value) }}
                      />
                    </div>
                    <button onClick={createDegree}>Create</button>
                  </div>
                </div>
              </div>
            </div>


            {/* second part programs */}
            <div className="CourseCreationForm">
              <div className="CreateCourseBtn">
                <button onClick={() => { setToggleCourseCreation(true) }}>Create Course</button>
              </div>
              <div className={ToggleCourseCreation ? "CourseCardContainer" : "CourseCardContainerHide"}>
                <div className="CourseCard">
                  <div className="CardTop">
                    <div className="CourseleftSide">
                      <h2>
                        Course Creation
                      </h2>
                    </div>
                    <div className="CourserightSide">
                      <img src="/images/cross.png" alt="not found" onClick={() => { setToggleCourseCreation(false) }} />
                    </div>
                  </div>
                  <div className="CardBottom">
                    <div className="CourseAlignfields">
                      <div className="CourseCardAlignInput">
                        <label htmlFor='Degree' >Program: </label>
                        <select name="SelectDegree" id="Degree" onChange={handleInputsChange}>
                          <option value="">Select Program... </option>
                          {Courses.map((course) => { return <option value={course.Degree} key={course._id}>{course.Degree} </option> })}
                        </select>
                      </div>
                      <div className="CourseCardAlignInput">
                        <label htmlFor='Courseno' >Course Code: </label>
                        <input type="text"
                          name="Course_no"
                          id="Courseno"
                          placeholder='Course no...'
                          value={handleInputs.Course_no}
                          onChange={handleInputsChange}
                        />
                      </div>
                    </div>
                    <div className="CourseAlignfields">
                      <div className="CourseCardAlignInput">
                        <label htmlFor='C_title' >Course Title: </label>
                        <input type="text"
                          name="Course_name"
                          id="C_title"
                          placeholder='Course name...'
                          value={handleInputs.Course_name}
                          onChange={handleInputsChange}
                        />
                      </div>
                      <div className="CourseCardAlignInput">
                        <label htmlFor='C_Hours' >Credit hours: </label>
                        <input type="number"
                          name="Credit_hour"
                          id="C_Hours"
                          placeholder='Credit hours...'
                          value={handleInputs.Credit_hour}
                          onChange={handleInputsChange}
                        />
                      </div>
                    </div>
                    <div className="CourseAlignfields">
                      <div className="CourseCardAlignInput">
                        <label htmlFor='Status' >Status: </label>
                        <select name="Course_status" id="Status" onChange={handleInputsChange}>
                          <option value="">Select Status</option>
                          <option value="major">major</option>
                          <option value="minor">minor</option>
                          <option value="complusory">complusory</option>
                          <option value="audit">audit</option>
                        </select>
                      </div>
                    </div>
                    <button onClick={submitData}>Submit</button>
                  </div>
                </div>
              </div>
            </div>



            {/* third part of programs */}
            <div className="viewAllCourses">
              <div className="allCours">
                <h1>All Programs</h1>
              </div>
              <div className="viewAllCourseCon">
                <div className="ProgramsCardContainer">

                  {Courses.slice(NxtPage, Increment).map((val, index, arr) => {
                    const date = new Date(val.createdAt);
                    return (
                      <a href={`/Courses/${val._id}`} key={index} className="ProgramDetailCard"
                        onClick={() => {
                          localStorage.setItem("CourseID", val._id);
                        }}
                      >
                        <div className="ProgramDetailCardTop">
                          <h3>{val.Degree}</h3>
                          <div className="img">
                            <img src="/images/course.png" alt="" />
                          </div>
                        </div>
                        <div className="ProgramDetailCardBottom">
                          <div className="content">
                            <b>Date:</b> <span>{`${date.toLocaleDateString()}`}</span>
                          </div>
                          <div className="content">
                            <b>Total Courses:</b> <span>{`0${val.Courses.length}`}</span>
                          </div>
                        </div>
                      </a>
                    )
                  })}



                </div>
                {/* next prev page */}
                <div className="NextPrevBt">
                  <button onClick={() => {
                    let pageNumber = Pageno;
                    let nextPage = NxtPage
                    let IncPage = Increment
                    if (pageNumber <= 0) {
                      pageNumber = 0;
                      nextPage = 0;
                      IncPage = 5;
                    } else {
                      pageNumber = pageNumber - 1
                      nextPage = nextPage - 5
                      IncPage = IncPage - 5
                    }
                    dispatch(updateCourses({ PaginationCourses: Courses, TotalCourse: Courses.length, Pageno: pageNumber, TotalPages: Math.floor(Courses.length / 5), NxtPage: nextPage, Increment: IncPage }))
                  }}>Prev</button>
                  <span>{`${Pageno} of ${TotalPages}`} </span>
                  <button onClick={() => {
                    let pageNumber = Pageno;
                    let nextPage = NxtPage
                    let IncPage = Increment
                    if (pageNumber >= TotalPages) {
                      pageNumber = 0;
                      nextPage = 0;
                      IncPage = 5;

                    } else {
                      pageNumber = pageNumber + 1
                      nextPage = nextPage + 5
                      IncPage = IncPage + 5
                    }
                    dispatch(updateCourses({ PaginationCourses: Courses, TotalCourse: Courses.length, Pageno: pageNumber, TotalPages: Math.floor(Courses.length / 5), NxtPage: nextPage, Increment: IncPage }))
                  }}>Next</button>
                </div>
              </div>
            </div>



          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses

