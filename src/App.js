import React, { useEffect } from 'react'
import './App.css'
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './pages/Login/Login'
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import Dashboard from './pages/Admin/Home/Dashboard';
import Courses from './pages/Admin/Program/Courses';
import FullCourseCard from './pages/Admin/Program/FullCourseCard/FullCourseCard';
import Form from './pages/Users/Form/Form';
import UpdateCourse from './pages/Admin/UpdateCourse/UpdateCourse';
import AssignRole from './pages/Admin/Roles/AssignRole';
import UpdateAuthority from './pages/Admin/UpdateSingleAuthority/UpdateAuthority';
import UGForm from './pages/Admin/UG_Form/UgForm';
import UserFullCardTrack from './components/UserFullCardTrack/UserFullCardTrack';
import Announcement from './pages/Admin/Announcements/Announcement';
import { useSelector, useDispatch } from 'react-redux';
import { updateFunction } from './authStore/update';
import axios from 'axios';
import { validateUser } from './authStore/auth';

const App = () => {
  const dispatch = useDispatch();
  const AutoLogin = async () => {
    const url = `${process.env.REACT_APP_Api_Url}/api/refresh`;
    const responce = await axios.get(url, { withCredentials: true })
    // console.log(responce);
    const Admin = await responce.data.findAdmin;
    const User = await responce.data.findUser;
    if (Admin) {
      dispatch(validateUser(Admin))
    } else {
      dispatch(validateUser(User))
    }
  }
  useEffect(() => {
    AutoLogin()
  }, [])
  const { isRole } = useSelector((state) => { return state.auth })
  const updateID = localStorage.getItem("id")
  const CourseID = localStorage.getItem("CourseID")
  dispatch(updateFunction(updateID))




  return (
    <div> 
      <Switch>
        <Route path="/register" exact><Register /></Route>


        <Route path="/" exact>
          {isRole === "User" ? <Redirect to="/user"></Redirect> : isRole === "Admin" || isRole === "Supervisor" || isRole === "Chairperson of the Department" || isRole === "Dean" || isRole === "Director Graduate Studies" ? <Redirect to="/admin"></Redirect> : <Login />}
        </Route>


        <Route path="/user" exact>
          {isRole === "User" ? <Form /> : isRole === "Admin" || isRole === "Supervisor" || isRole === "Chairperson of the Department" || isRole === "Dean" || isRole === "Director Graduate Studies" ? <Redirect to="/admin"></Redirect> : <Login />}
        </Route>


        <Route path="/admin" exact>
          {isRole === "Admin" || isRole === "Supervisor" || isRole === "Chairperson of the Department" || isRole === "Dean" || isRole === "Director Graduate Studies" ? <Dashboard /> : isRole === "User" ? <Redirect to="/user"></Redirect> : <Login />}
        </Route>


        <Route path="/Courses" exact>
          {isRole === "Admin" || isRole === "Supervisor" || isRole === "Chairperson of the Department" || isRole === "Dean" || isRole === "Director Graduate Studies" ? <Courses /> : isRole === "User" ? <Redirect to="/user"></Redirect> : <Login />}
        </Route>
        <Route path="/Courses/:id" exact>
        {window.location.href.split("/Courses/").slice(1, 2).join("") === CourseID && (isRole === "Admin" || isRole === "Supervisor" || isRole === "Chairperson of the Department" || isRole === "Dean" || isRole === "Director Graduate Studies") ?
            <FullCourseCard /> :
            isRole === "User" ?
              <Redirect to="/user"></Redirect> :
              <Login />}
        </Route>
        <Route path={`/admin/course/:id`}>
          {window.location.href.split("/admin/course/").slice(1, 2).join("") === updateID && (isRole === "Admin" || isRole === "Supervisor" || isRole === "Chairperson of the Department" || isRole === "Dean" || isRole === "Director Graduate Studies") ?
            <UpdateCourse /> :
            isRole === "User" ?
              <Redirect to="/user"></Redirect> :
              <Login />}
        </Route>


        <Route path="/assignRoles" >
          {isRole === "Admin" ? <AssignRole /> : isRole === "User" ? <Redirect to="/user" ></Redirect> : isRole === "Supervisor" || isRole === "Chairperson of the Department" || isRole === "Dean" || isRole === "Director Graduate Studies" ? <Redirect to="/admin"></Redirect> : <Login />
          }
        </Route>
        <Route path="/admin/updateRole/:id">
          {window.location.href.split("/admin/updateRole/").slice(1, 2).join("") === updateID && isRole === "Admin" ?
            <UpdateAuthority /> :
            isRole === "User" ?
              <Redirect to="/user"></Redirect> :
              isRole === "Supervisor" || isRole === "Chairperson of the Department" || isRole === "Dean" || isRole === "Director Graduate Studies" ? <Redirect to="/admin"></Redirect> :
                <Login />
          }
        </Route>


        <Route path="/UGForms">
          {isRole === "Admin" ||isRole=== "Supervisor" || isRole === "Chairperson of the Department" || isRole === "Dean" || isRole === "Director Graduate Studies" ? <UGForm /> : isRole === "User" ? <Redirect to="/user" ></Redirect>  : <Login />
          }
        </Route> 
        <Route path="/user/UGForm/:id" exact>
          {isRole === "User" ? <UserFullCardTrack /> : isRole === "Admin" || isRole === "Supervisor" || isRole === "Chairperson of the Department" || isRole === "Dean" || isRole === "Director Graduate Studies" ? <Redirect to="/admin"></Redirect> : <Login />}
        </Route>


        <Route path="/Profile" exact>
          {isRole === "User" || isRole === "Admin" || isRole === "Supervisor" || isRole === "Chairperson of the Department" || isRole === "Dean" || isRole === "Director Graduate Studies" ? <Profile/>  : <Login />}
        </Route>

        <Route path="/Announcements">
          {isRole === "Admin" ||isRole=== "Supervisor" || isRole === "Chairperson of the Department" || isRole === "Dean" || isRole === "Director Graduate Studies" ? <Announcement /> : isRole === "User" ? <Redirect to="/user" ></Redirect>  : <Login />
          }
        </Route> 
        <Route path="*" >Not found</Route>
      </Switch>
    </div>
  )
}


export default App