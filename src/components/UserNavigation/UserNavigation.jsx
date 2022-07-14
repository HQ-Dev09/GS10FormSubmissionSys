import React, { useState } from 'react'
import style from './UserNavigation.module.css';
import { logoutUser } from '../../http';
import {  useHistory,Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { validateUser } from '../../authStore/auth';



const UserNavigation = () => {
    const [toggleProfileMange, settoggleProfileMange] = useState(false)
    const dispatch = useDispatch();
    const history = useHistory();

    const { isRole,Profile,username } = useSelector((state) => { return state.auth })
    const logout = async () => {
        console.log(isRole);
        const responce = await logoutUser();
        console.log("callig");
        console.log(responce);
        const { data } = responce;
        console.log(data);
        dispatch(validateUser({ isRole: "" }))
        return history.go("/")
    }


    const toggleProfile = () => {
        settoggleProfileMange(!toggleProfileMange);
    }
    return (
        <div className={style.Navigation}>
            <div className={style.leftSide}>
                <div className={style.logo}>
                    <img src="./images/hz_logo.png" alt="not found" />
                    <span>HQ.</span>
                </div>
            </div>
            <div className={style.rightSide}>
                <div className={style.rightSideuserManage}>
                    <span className={style.username}>{username}</span>
                    <div className={style.profileCircle}>
                        <img src={Profile} alt="not found" />
                    </div>
                    <div className={style.profileLogoutUpdateFeature} onClick={toggleProfile}>
                        <img src="./images/dropdown.png" alt="not found" />
                    </div>
                </div>
                <div className={toggleProfileMange ? style.rightSideProfile : style.rightSideProfileHide}>
                    <div className={style.listsItem}>
                        <img src="./images/profile.png" alt="not found" />
                        <a href="/Profile">Profile</a>
                        {/* <span onClick={()=>{return <Redirect to="/Profile"></Redirect>}}>Profile</span> */}
                    </div>
                    <div className={style.listsItem}>
                        <img src="./images/logout.png" alt="not found" />
                        <span onClick={logout}>Logout</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserNavigation