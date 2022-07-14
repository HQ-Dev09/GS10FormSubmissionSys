import React, { useState, useEffect } from 'react'
import style from './UserUGCards.module.css'
import { Get_UG_Forms } from '../../http'

const UserUGCards = () => {
    const [UGForms, setUGForms] = useState([])


    const getForms = async () => {
        const responce = await Get_UG_Forms();
        const { data } = responce;
        setUGForms(data.UGForms.UGForm)
        // console.log(data.UGForms.UGForm);
    }
    useEffect(() => {
        getForms()
    }, [])

    return (
        <div className={style.container}>
            <div className={style.cards}>
                {UGForms.map((val, index, array) => {
                    return (
                        <div className={style.card} key={index + 1}>
                            <div className={style.circle}>
                                <h2>0{val.Semester === "1st-semester" ? 1 : val.Semester === "2nd-semester" ? 2 : val.Semester === "3rd-semester" ? 3 : val.Semester==="4th-semester"?4:val.Semester==="5th-semester"?5:val.Semester==="6th-semester"?6:val.Semester==="7th-semester"?7:val.Semester==="8th-semester"?8:0}</h2>
                            </div>
                            <div className={style.content}>
                                <div className={style.contentMange}>
                                    <b>Name: </b> <p>{val.Student_Name}</p>
                                </div>
                                <div className={style.contentMange}>
                                    <b>Submitted: </b> <p>{val.Status}</p>
                                </div>
                                <div className={style.contentMange}>
                                    <b>Program: </b> <p>{val.Program}</p>
                                </div>
                                <div className={style.contentMange}>
                                    <b>Status: </b> <p>{val.FormStatus}</p>
                                </div>
                                <a href={`/user/UGForm/${val._id}`}>Track Activity</a>
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default UserUGCards