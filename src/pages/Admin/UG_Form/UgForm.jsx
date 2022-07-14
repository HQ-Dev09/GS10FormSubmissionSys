import React, { useState, useEffect, useRef } from 'react'
import style from './UGForm.module.css'
import { Get_UG_Forms_For_Authority, logoutUser } from '../../../http'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, NavLink, Link } from 'react-router-dom'
import { validateUser } from '../../../authStore/auth';
import axios from 'axios'

const UgForm = () => {
  const [UGForms, setUGForms] = useState([])
  const [Togglesidebar, setTogglesidebar] = useState(false)
  const [ToggleRegStud, setToggleRegStud] = useState(false)
  const [ToggleExtraEnrolledStud, setToggleExtraEnrolledStud] = useState(false)
  const [ToggleUpdateForm, setToggleUpdateForm] = useState(false)
  const [SingleUPdateFormData, setSingleUPdateFormData] = useState([])
  const [searchingQuery, setsearchingQuery] = useState(false)
  // const [searchedRecord, setsearchedRecord] = useState([])
  const [handleInput, sethandleInput] = useState({
    SearchForm: "",
    category: "",
    Semester: ""

  })
  let UGFormStatus;
  const history = useHistory();
  const dispatch = useDispatch();
  const effectRes = useRef(false)


  const { isRole, username, Profile } = useSelector((state) => { return state.auth })
  const getForms = async () => {
    const responce = await Get_UG_Forms_For_Authority({ isRole });
    const { data } = responce;
    setUGForms(data.UGForms)
  }
  useEffect(() => {
    if (effectRes.current === false) {
      getForms()


      return () => {
        effectRes.current = true;
      }
    }
  }, [])



  const toggle = () => {
    setTogglesidebar(!Togglesidebar)
  }

  const logout = async () => {
    console.log(isRole);
    await logoutUser();
    dispatch(validateUser({ isRole: "" }))
    localStorage.clear();
    return history.go("/")
  }




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    sethandleInput((preval) => {
      return {
        ...preval,
        [name]: value
      }
    })
  }





  // const settingfields = () => {
  //   setsearchingQuery(true)
  // }




  const GS10FormRow = (val, index) => {
    return (
      <tr key={index} >
        <td>{val.Registry_No}</td>
        <td>{val.Student_Name}</td>
        <td>{val.Father_Name}</td>
        <td>{val.Program}</td>
        <td><select id="" className={style.approvedBy}>
          {val.Courses.map((val, index, arr) => {
            return <option value="" key={index}>{val}</option>
          })}
        </select></td>
        <td>{val.Semester}</td>
        <td>{val.Status}</td>
        <td>{val.FeePaid}</td>
        <td><select id="" className={style.approvedBy}>
          {val.AuthoritiesApproval.length <= 0 ? <option>Null</option> :
            val.AuthoritiesApproval.map((val, index, arr) => {
              return <option value="" key={index}>{val.Authority} 👉 {val.Status}</option>
            })
          }
        </select></td>
        {val.AuthoritiesApproval.map((val, index, arr) => {
          UGFormStatus = val.Status;
          return val.Authority
        }).includes(isRole) ? <td>{UGFormStatus}</td> :
          <td>
            <button onClick={async () => {
              try {
                await axios.get(`${process.env.REACT_APP_Api_Url}/admin/updateUGForm/${val._id}/${isRole}/${"Approved"}`);
                history.goBack();
                return window.alert("Approved!")
              } catch (error) {
                console.log(error);
              }
            }}>Approved</button> <br />
            <button onClick={async () => {
              try {
                await axios.get(`${process.env.REACT_APP_Api_Url}/admin/updateUGForm/${val._id}/${isRole}/${"Rejected"}`);
                history.goBack();
                return window.alert("Rejected")
              } catch (error) {
                console.log(error);
              }
            }}>Rejected</button>

          </td>
        }
      </tr >

    )
  }


  const GS10approvedRejectFormsallandSearchFunc = (val, index) => {
    if (searchingQuery === false) {
      return (
        <tr key={index + 1} >
          <td>{val.Registry_No}</td>
          <td>{val.Student_Name}</td>
          <td>{val.Father_Name}</td>
          <td>{val.Program}</td>
          <td><select id="" className={style.approvedBy}>
            {val.Courses.map((val, index, arr) => {
              return <option value="" key={index}>{val}</option>
            })}
          </select></td>
          <td>{val.Semester}</td>
          <td>{val.Status}</td>
          <td>{val.FeePaid}</td>
          <td><select id="" className={style.approvedBy}>
            {val.AuthoritiesApproval.length <= 0 ? <option>Null</option> :
              val.AuthoritiesApproval.map((val, index, arr) => {
                return <option value="" key={index}>{val.Authority} 👉 {val.Status}</option>
              })
            }
          </select></td>
          <td>
            {val.AuthoritiesApproval.map((val, index, arr) => {
              return val.Authority
            }).includes(isRole) ?
              <button onClick={async () => {
                try {
                  const responce = await axios.get(`${process.env.REACT_APP_Api_Url}/admin/single/updateUGForm/${val._id}`);
                  // history.goForward("/UGForms");
                  // history.goBack();
                  setToggleUpdateForm(true)
                  setSingleUPdateFormData(responce.data.SingleUGForm)
                } catch (error) {
                  console.log(error);
                }
              }}>Update</button>
              :
              "Not set"
            }

          </td>
        </tr >

      )
    } else if (searchingQuery === true) {
      if (val.Registry_No === handleInput.SearchForm.split(" ").join("") && val.Status === handleInput.category && val.Semester === handleInput.Semester) {
        return (
          <tr key={index + 1} >
            <td>{val.Registry_No}</td>
            <td>{val.Student_Name}</td>
            <td>{val.Father_Name}</td>
            <td>{val.Program}</td>
            <td><select id="" className={style.approvedBy}>
              {val.Courses.map((val, index, arr) => {
                return <option value="" key={index}>{val}</option>
              })}
            </select></td>
            <td>{val.Semester}</td>
            <td>{val.Status}</td>
            <td>{val.FeePaid}</td>
            <td><select id="" className={style.approvedBy}>
              {val.AuthoritiesApproval.length <= 0 ? <option>Null</option> :
                val.AuthoritiesApproval.map((val, index, arr) => {
                  return <option value="" key={index}>{val.Authority} 👉 {val.Status}</option>
                })
              }
            </select></td>
            <td>
              {val.AuthoritiesApproval.map((val, index, arr) => {
                return val.Authority
              }).includes(isRole) ?
                <button onClick={async () => {
                  try {
                    const responce = await axios.get(`${process.env.REACT_APP_Api_Url}/admin/single/updateUGForm/${val._id}`);
                    // history.goForward("/UGForms");
                    // history.goBack();
                    setSingleUPdateFormData(responce.data.SingleUGForm)
                    // setSingleUPdateFormData
                    setToggleUpdateForm(true)
                  } catch (error) {
                    console.log(error);
                  }
                }}>Update</button>
                :
                "Not set"
              }

            </td>
          </tr >

        )
      }
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
                <p>Dashboard <b> {'>'} GS10-Form</b></p>
              </div>
            </div>







            {/* second part programs */}
            <div className={style.approvalFormsGS10}>
              <div className={style.CardForRegularStudents}>
                <div className={style.CardRegular} onClick={() => {
                  setToggleRegStud(true)
                }}>
                  <h1>Regular Students</h1>
                  <p>View Requests & Approved or Reject</p>
                </div>

                <div className={ToggleRegStud ? style.RegularStudentsTable : style.hideTable}>
                  <div className={style.Table}>
                    <div className={style.TableTop}>
                      <h3>Regular Students</h3>
                      <img src="/images/cross.png" alt="not found" onClick={() => {
                        setToggleRegStud(false)
                      }} />
                    </div>
                    <div className={style.TableBottm}>
                      <table>
                        <thead>
                          <tr>
                            <th>
                              Reg no
                            </th>
                            <th>
                              S_Name
                            </th>
                            <th>
                              F_Name
                            </th>
                            <th>
                              Program
                            </th>
                            <th>
                              Courses
                            </th>
                            <th>
                              Semester
                            </th>
                            <th>
                              Submission
                            </th>
                            <th>
                              FeePaid
                            </th>
                            <th>
                              AuthoritiesApproval
                            </th>
                            <th>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {UGForms.map((val, index, array) => {
                            return (
                              val.Status === "Regular-student" ?
                                val.AuthoritiesApproval.length === 0 && isRole === "Supervisor" ?
                                  GS10FormRow(val, index)
                                  : isRole === "Dean" && val.AuthoritiesApproval.map((val, index, arr) => val.Authority).includes("Supervisor") && val.AuthoritiesApproval.map((val, index, arr) => val.Status).includes("Approved") && val.AuthoritiesApproval.length < 2 ?
                                    GS10FormRow(val, index)
                                    : isRole === "Chairperson of the Department" && val.AuthoritiesApproval.map((val, index, arr) => val.Authority).includes("Dean") && val.AuthoritiesApproval.map((val, index, arr) => val.Status).includes("Approved") && val.AuthoritiesApproval.length < 3 ?
                                      GS10FormRow(val, index)
                                      : isRole === "Director Graduate Studies" && val.AuthoritiesApproval.map((val, index, arr) => val.Authority).includes("Chairperson of the Department") && val.AuthoritiesApproval.map((val, index, arr) => val.Status).includes("Approved") && val.AuthoritiesApproval.length < 4 ?
                                        GS10FormRow(val, index) : ""
                                : val.Status === "Extra-Enrollement" ? "" :
                                  <tr>
                                    <td>NAN</td>
                                    <td>NAN</td>
                                    <td>NAN</td>
                                    <td>NAN</td>
                                    <td>NAN</td>
                                    <td>NAN</td>
                                    <td>NAN</td>
                                    <td>NAN</td>
                                    <td>NAN</td>
                                    <td>NAN</td>
                                  </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.CardForExtraEnrolledStudents}>
                <div className={style.CardExtra} onClick={() => {
                  return setToggleExtraEnrolledStud(true)
                }}>
                  <h1>Extra Enrolled</h1>
                  <p>View Requests & Approved or Reject</p>
                </div>


                <div className={ToggleExtraEnrolledStud ? style.ExtraEnrolledrStudentsTable : style.hideTableExtraEnrolled}>
                  <div className={style.ExtraEnrolledTable}>
                    <div className={style.ExtraEnrolledTableTop}>
                      <h3>Extra Enrolled Students</h3>
                      <img src="/images/cross.png" alt="not found" onClick={() => {
                        setToggleExtraEnrolledStud(false)
                      }} />
                    </div>
                    <div className={style.ExtraEnrolledTableBottm}>
                      <table>
                        <thead>
                          <tr>
                            <th>
                              Reg no
                            </th>
                            <th>
                              S_Name
                            </th>
                            <th>
                              F_Name
                            </th>
                            <th>
                              Program
                            </th>
                            <th>
                              Courses
                            </th>
                            <th>
                              Semester
                            </th>
                            <th>
                              Submission
                            </th>
                            <th>
                              FeePaid
                            </th>
                            <th>
                              AuthoritiesApproval
                            </th>
                            <th>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {UGForms.map((val, index, array) => {
                            // Extra-Enrollement
                            return (
                              val.Status === "Extra-Enrollement" ?
                                val.AuthoritiesApproval.length === 0 && isRole === "Supervisor" ?
                                  GS10FormRow(val, index)
                                  : isRole === "Dean" && val.AuthoritiesApproval.map((val, index, arr) => val.Authority).includes("Supervisor") && val.AuthoritiesApproval.map((val, index, arr) => val.Status).includes("Approved") && val.AuthoritiesApproval.length < 2 ?
                                    GS10FormRow(val, index)
                                    : isRole === "Chairperson of the Department" && val.AuthoritiesApproval.map((val, index, arr) => val.Authority).includes("Dean") && val.AuthoritiesApproval.map((val, index, arr) => val.Status).includes("Approved") && val.AuthoritiesApproval.length < 3 ?
                                      GS10FormRow(val, index)
                                      : isRole === "Director Graduate Studies" && val.AuthoritiesApproval.map((val, index, arr) => val.Authority).includes("Chairperson of the Department") && val.AuthoritiesApproval.map((val, index, arr) => val.Status).includes("Approved") && val.AuthoritiesApproval.length < 4 ?
                                        GS10FormRow(val, index) : ""
                                : val.Status === "Regular-student" ? "" :
                                  <tr>
                                    <td>NAN</td>
                                    <td>NAN</td>
                                    <td>NAN</td>
                                    <td>NAN</td>
                                    <td>NAN</td>
                                    <td>NAN</td>
                                    <td>NAN</td>
                                    <td>NAN</td>
                                    <td>NAN</td>
                                    <td>NAN</td>
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





            {/* third part of programs */}
            {/* making GS10 Form update system */}
            <div className={style.FormUpdateSys}>
              {/* search system */}
              <div className={style.FormSearchSy}>
                <input type="search" name="SearchForm" value={handleInput.SearchForm} placeholder='2019-uam-2189' onChange={handleInputChange} />
                <select name="category" onClick={handleInputChange}>
                  <option value="">Select</option>
                  <option value="Regular-student">Regular-student</option>
                  <option value="Extra-Enrollement">Extra-Enrollement</option>
                </select>
                <select name="Semester" onClick={handleInputChange}>
                  <option value="">Select</option>
                  <option value="1st-semester">1st semester</option>
                  <option value="2nd-semester">2nd semester</option>
                  <option value="3rd-semester">3rd semester</option>
                  <option value="4th-semester">4th semester</option>
                  <option value="5th-semester">5th semester</option>
                  <option value="6th-semester">6th semester</option>
                  <option value="7th-semester">7th semester</option>
                  <option value="8th-semester">8th semester</option>
                </select>
                <button onClick={() => { !handleInput.SearchForm ? alert("empty search") : handleInput.SearchForm.length < 13 || handleInput.SearchForm.split(" ").join("").length < 13 ? alert("registration number is not valid") : !handleInput.category ? alert("Category not selected!") : !handleInput.Semester ? alert("Semester not Defined!") : setsearchingQuery(true) }}>Search</button>
              </div>


              {/* get all Forms in a table regular or extra enrolled*/}
              <div className={style.RegularExtraEnrolledStudentTableContainer}>
                <table border="1">
                  <thead>
                    <tr>
                      <th>
                        Reg no
                      </th>
                      <th>
                        S_Name
                      </th>
                      <th>
                        F_Name
                      </th>
                      <th>
                        Program
                      </th>
                      <th>
                        Courses
                      </th>
                      <th>
                        Semester
                      </th>
                      <th>
                        Submission
                      </th>
                      <th>
                        FeePaid
                      </th>
                      <th>
                        AuthoritiesApproval
                      </th>
                      <th>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {UGForms.length > 0 ?
                      UGForms.map((val, index, array) => {
                        return (
                          GS10approvedRejectFormsallandSearchFunc(val, index)
                        )
                      })

                      :
                      <tr>
                        <td>NAN</td>
                        <td>NAN</td>
                        <td>NAN</td>
                        <td>NAN</td>
                        <td>NAN</td>
                        <td>NAN</td>
                        <td>NAN</td>
                        <td>NAN</td>
                        <td>NAN</td>
                        <td>NAN</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>







            {/* forth part for updation the form */}
            <div className={ToggleUpdateForm ? style.PageforUpdate : style.PageforUpdateHide}>
              <div className={style.PageforUpdateCard}>
                <div className={style.PageforUpdateCardTop}>
                  <h1>Update GS10 Status</h1>
                  <img src="/images/cross.png" alt="not found" onClick={() => setToggleUpdateForm(false)} />
                </div>
                <div className={style.PageforUpdateCardContent}>
                  <div className={style.PageforUpdateCardContentmanage}>
                    <b>FormID:</b> <p>{SingleUPdateFormData._id}</p>
                  </div>
                  <div className={style.PageforUpdateCardContentmanage}>
                    <b>Name:</b> <p>{SingleUPdateFormData.Student_Name}</p>
                  </div>
                  <div className={style.PageforUpdateCardContentmanage}>
                    <b>Regno:</b> <p>{SingleUPdateFormData.Registry_No}</p>
                  </div>
                  <div className={style.PageforUpdateCardContentmanage}>
                    <b>Semester:</b> <p>{SingleUPdateFormData.Semester}</p>
                  </div>
                  <div className={style.PageforUpdateCardButtons}>
                    <button
                      onClick={async () => {
                        const responce = await axios.post(`${process.env.REACT_APP_Api_Url}/admin/single/updateUGForm/${SingleUPdateFormData._id}/${isRole}/${'Approved'}`);
                        window.alert(responce.data.message)
                        return history.goBack();
                      }}
                    >Approved</button>
                    <button
                      onClick={async () => {
                        const responce = await axios.post(`${process.env.REACT_APP_Api_Url}/admin/single/updateUGForm/${SingleUPdateFormData._id}/${isRole}/${'Rejected'}`);
                        window.alert(responce.data.message)
                        return history.goBack();
                      }}>Reject</button>
                  </div>
                </div>
              </div>
            </div>



          </div>
        </div>
      </div>
    </div>
  )
}

export default UgForm