import React, { useState, useEffect, useRef } from 'react'
import './FullCourseCard.css'
import { useHistory, useParams } from 'react-router-dom'
import { updateFunction } from '../../../../authStore/update'
import { GetSingleProgramCourse } from '../../../../http'
import { useDispatch } from 'react-redux'
import axios from 'axios'


const FullCourseCard = () => {
  const [Courses, setCourses] = useState([])
  const history = useHistory();
  const dispatch = useDispatch();
  const effectRun = useRef(false);
  const params = useParams()
const date=new Date(Courses[0]?Courses[0].createdAt:"")



  useEffect(() => {
    if (effectRun.current === false) {
      const allcourses = async () => {
        try {
          const responce = await GetSingleProgramCourse({ id: params.id });
          const { data } = responce;
          if (responce.status === 200) {
            setCourses([data.course])
          } else {
            return window.alert(data.message)
          }
        } catch (error) {
          return window.alert(error)
        }
      }
      allcourses()

      return () => {
        effectRun.current = true;
      }
    }
  }, [])




  return (
    <div className="mainContainer">
      {/* go back button */}
      <div className="goBackButton" onClick={() => { return history.goBack() }}>
        <button><img src="/images/goback.png" alt="" /> Go Back</button>
      </div>


      <div className="mainContainerCard">
        <div className="maincontainerCardTop">
          <img src="/images/courseOne.jpg" alt="not found" />
          <div className="details">
            <div className="ProgramDetails">
              <b>Program:</b> <span>{Courses[0]?Courses[0].Degree:""}</span>
            </div>
            <div className="ProgramDetails">
              <b>Creation Date:</b> <span>{date.toLocaleDateString()}</span>
            </div>
          </div>
          <h1>List of All Available Courses</h1>
        </div>

        <div className="maincontainerCardBottom">
          <div className="viewAllCourses">
            <table >
              <thead>
                <tr>
                  <th>
                    S_id
                  </th>
                  <th>
                    Course name
                  </th>
                  <th>
                    Course no.
                  </th>
                  <th>
                    Credit hr.
                  </th>
                  <th>
                    Status
                  </th>
                  <th>
                    Degree
                  </th>
                  <th>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Courses[0] ?
                  Courses.map((course, index, array) => {
                    if (course.Courses.length > 0) {
                      return course.Courses.map((data, index, array) => {
                        return (
                          <tr key={data._id}>
                            <td>{index + 1}</td>
                            <td>{data.Course_name}</td>
                            <td>{data.Course_no}</td>
                            <td>{data.Credit_hour}</td>
                            <td>{data.Course_status}</td>
                            <td>{course.Degree}</td>
                            <td>
                              <a href={`/admin/course/${data._id}`} className="button" onClick={() => {
                                localStorage.setItem("id", data._id);
                                dispatch(updateFunction(data._id))
                              }}>Edit</a>
                              <button className="button" onClick={async () => {
                                try {
                                  const deleteCourse = await axios.get(`${process.env.REACT_APP_Api_Url}/delete/course/${data._id}`);
                                  console.log(deleteCourse);
                                  history.push(`/Courses`);
                                  return window.alert("Course Deleted..")
                                } catch (error) {
                                  console.log(error);
                                }
                              }}>Delete</button>
                            </td>
                          </tr>
                        )
                      })
                    } else {
                      return (
                        <tr key={index}>
                          <td>NAN</td>
                          <td>NAN</td>
                          <td>NAN</td>
                          <td>NAN</td>
                          <td>NAN</td>
                          <td>NAN</td>
                          <td>NAN</td>
                        </tr>
                      )
                    }

                  })
                  :
                  <tr >
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
      </div>

    </div>
  )
}

export default FullCourseCard