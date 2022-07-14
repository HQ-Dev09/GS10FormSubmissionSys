import React, { useState, useEffect } from 'react'
import style from './UserFullCardTrack.module.css'
import { useParams } from 'react-router-dom'
import { Get_Specific_UG_Form } from '../../http'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import jsPDF from 'jspdf'

const UserFullCardTrack = () => {
    const [UGForm, setUGForm] = useState([])
    const [AuthorityCheck, setAuthorityCheck] = useState([])
    const [showGS10Form, setshowGS10Form] = useState(false)
    const params = useParams();
    const history = useHistory();
    const { Profile } = useSelector((state) => { return state.auth })


    const getForm = async () => {
        const responce = await Get_Specific_UG_Form(params.id);
        const { data } = responce;
        setUGForm(data.UGForm)
        setAuthorityCheck(data.UGForm.AuthoritiesApproval.map((val, index, arr) => { return { Authority: val.Authority, Status: val.Status } }))
    }
    useEffect(() => {
        getForm()
    }, [])

    const date = new Date(UGForm.Date_of_First_Submission);
    // console.log(AuthorityCheck.length );

    const generatePDF = async () => {
        let doc = new jsPDF("p", "pt", "a4");
        doc.html((document.getElementById("htmlFormGS10")), {
            callback: function (pdf) {
                pdf.save("GS10Form.pdf")
            }
        })
    }

    return (

        <div className={style.FullUGFormTrackContainer} >
            {/* go back button */}
            <div className={style.goBackButton} onClick={() => { return history.goBack() }}>
                <button><img src="/images/goback.png" alt="" /> Go Back</button>
            </div>

            {/* download button */}
            {UGForm.FormStatus === "Complete" ? <div className={style.generatePDF} onClick={() => {
                // generatePDF()
                setshowGS10Form(true)
            }} >
                <button ><img src="/images/pdf.png" alt="" />Generate</button>
            </div> : ""}

            {UGForm ?
                <div className={style.Container} >
                    <div className={style.BlogCard}>
                        <div className={style.blogCardImage}>
                            <img src={Profile} alt="not found" />
                        </div>
                        <div className={style.blogCardInfo}>
                            <div className={style.blogCardContent}>
                                <b className={style.name}>Name:</b> <p className={style.name}>{UGForm.Student_Name}</p>
                            </div>
                            <div className={style.blogCardContent}>
                                <b>Registry no: </b> <p>{UGForm.Registry_No}</p>
                            </div>
                            <div className={style.blogCardContent}>
                                <b>Program: </b> <p>{UGForm.Program}</p>
                            </div>
                            <div className={style.blogCardContent}>
                                <b>Submitted:</b> <p>{UGForm.Status}</p>
                            </div>
                            <div className={style.blogCardContent}>
                                <b>Semester:</b> <p>{UGForm.Semester}</p>
                            </div>
                            <div className={style.blogCardContent}>
                                <b>First Submission:</b> <p>{`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}</p>
                            </div>
                            <div className={style.blogCardContent}>
                                <b>Fee Paid:</b> <p>{UGForm.FeePaid}</p>
                            </div>
                            <div className={style.blogCardContent}>
                                <b>Status: </b> <p>{UGForm.FormStatus}</p>
                            </div>
                        </div>
                    </div>




                    <div className={style.UGFormTrack}>
                        <div className={style.details}>
                            <div className={style.order}>
                                <h1>ID: <span>{params.id}</span></h1>
                            </div>
                            <div className={style.date}>
                                <p>Submission Date</p>
                                <p>{`${date.toLocaleDateString()}`}</p>
                            </div>
                        </div>

                        <div className={style.track}>
                            <ul id={style.products} className={style.text_center}>
                                <li id={
                                    AuthorityCheck.length > 0 ? AuthorityCheck[0].Authority.includes("Supervisor") && AuthorityCheck[0].Status.includes("Approved") === true ? style.active : "" : ""}></li>
                                <li id={
                                    AuthorityCheck.length > 1 ? AuthorityCheck[1].Authority.includes("Dean") && AuthorityCheck[1].Status.includes("Approved") === true ? style.active : "" : ""}></li>
                                <li id={
                                    AuthorityCheck.length > 2 ? AuthorityCheck[2].Authority.includes("Chairperson of the Department") && AuthorityCheck[2].Status.includes("Approved") === true ? style.active : "" : ""
                                } ></li>
                                <li id={
                                    AuthorityCheck.length > 3 ? AuthorityCheck[3].Authority.includes("Director Graduate Studies") && AuthorityCheck[3].Status.includes("Approved") === true ? style.active : "" : ""
                                }></li>
                            </ul>
                        </div>

                        <div className={style.lists}>
                            <div className={style.list} id={AuthorityCheck.length > 0 ? AuthorityCheck[0].Status.includes("Approved") ? style.listactive : "" : ""}>
                                <img src="/images/supervisor.png" alt="not found" />
                                <b>Supervisor</b>
                            </div>
                            <div className={style.list} id={AuthorityCheck.length > 1 ? AuthorityCheck[1].Status.includes("Approved") ? style.listactive : "" : ""}>
                                <img src="/images/Dean.png" alt="not found" />
                                <b>Dean</b>
                            </div>
                            <div className={style.list} id={AuthorityCheck.length > 2 ? AuthorityCheck[2].Status.includes("Approved") ? style.listactive : "" : ""}>
                                <img src="/images/Cod.png" alt="not found" />
                                <b>COD</b>
                            </div>
                            <div className={style.list} id={AuthorityCheck.length > 3 ? AuthorityCheck[3].Status.includes("Approved") ? style.listactive : "" : ""}>
                                <img src="/images/DGS.png" alt="not found" />
                                <b>DGS</b>
                            </div>
                        </div>
                    </div>
                </div>
                : ""
            }







            {/* GS10Form Design here */}
            {showGS10Form ?
                <div className={style.GS10FormDownload}>
                    <div className={style.GS10FormDownloadContainer}  id="htmlFormGS10">
                       <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Temporibus voluptatum beatae distinctio amet esse deleniti iste ad aliquid asperiores, pariatur corporis quasi ipsum eligendi officia hic ab possimus, ex optio quas atque illum animi similique perspiciatis reiciendis. Repudiandae enim dolorum voluptatibus quis perferendis amet, doloribus obcaecati officia porro esse provident cum est? Distinctio quibusdam voluptatibus dolor nostrum unde reprehenderit. Fugit, optio magni delectus deleniti animi nobis dolorum corrupti, neque harum ab magnam veritatis esse qui quibusdam dolorem! Molestiae dolorum laboriosam veniam id, cumque placeat natus a cupiditate totam quia? Odio quia a error, ducimus necessitatibus veniam hic provident repellat illum totam sit blanditiis impedit ipsam assumenda perspiciatis fuga earum? Eligendi ratione quidem at ex, minus dolor explicabo maiores sunt harum adipisci exercitationem, sed quas praesentium? Quisquam placeat nemo magni? Necessitatibus tenetur mollitia, placeat cumque, error fuga inventore eius sint eaque perspiciatis quam aspernatur ipsum a ipsa optio hic odit praesentium veniam. Excepturi accusantium, explicabo repudiandae earum, fugiat odio ex nihil quidem, eum corrupti quas deleniti hic impedit. Illo eligendi nulla accusantium architecto voluptate atque molestias enim autem cupiditate saepe, aliquam similique fugiat vel? Ducimus neque mollitia illo officiis blanditiis ratione veniam adipisci. Cumque ea a distinctio cum earum. Dignissimos, illo?</p>
                        <div className={style.downloadButton} onClick={() => {
                            generatePDF()
                            // setshowGS10Form(true)
                        }} >
                            <button ><img src="/images/download.png" alt="" /></button>
                        </div>
                        <div className={style.closeGS10Form} onClick={() => { return setshowGS10Form(false) }} >
                            <button ><img src="/images/cross.png" alt="" /></button>
                        </div>
                    </div>
                </div>
                : ""
            }


        </div>
    )
}

export default UserFullCardTrack