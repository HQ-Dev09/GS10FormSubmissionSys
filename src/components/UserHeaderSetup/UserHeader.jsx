import React, { useState, useEffect, useRef } from 'react'
import style from './UserHeader.module.css'
import { Link } from 'react-router-dom'
import { GetCourses, GetSpecificProgram, UG_Form_Submit, Get_UG_Forms, getSpecificUser } from '../../http'
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';



const UserHeader = ({ page }) => {
    const [Programs, setPrograms] = useState([])
    const [Courses, setCourses] = useState([])
    const [AllCourses, setAllCourses] = useState([])
    const [handleInput, sethandleInpt] = useState({
        Student_Name: "",
        Father_Name: "",
        Registry_No: "",
        Date_of_First_Submission: "",
        Semester: "",
        Status: "",
        FeePaid: "",
    })
    const [imageSelct, setimageSelct] = useState("")
    const [UGFormToggle, setUGFormToggle] = useState(false)
    const [SingleUser, setSingleUser] = useState({})


    const [ProgramCourse, setProgramCourse] = useState({
        Program: "",
    });
    const [handleUGFormStatus, sethandleUGFormStatus] = useState('');
    const history = useHistory();
    const { _id,Type } = useSelector((state) => { return state.auth })
    const effectRes = useRef(false)




    const getPrograms = async () => {
        const responce = await GetCourses();
        const { data } = responce;
        setPrograms(data.course);
    }
    const getUser = async () => {
        const fetchUser = await getSpecificUser({ _id });
        const { data } = fetchUser;
        sethandleUGFormStatus(data.user.UGFormSubmissionStatus);
        setSingleUser(data.user)
    }
    useEffect(() => {
        if (effectRes.current === false) {
            getPrograms()
            getUser()


            return () => {
                effectRes.current = true;
            }
        }
    }, [])



    const getSpecificCourse = async (Program) => {
        if (Program) {
            const responce = await GetSpecificProgram({ Program });
            const { data } = responce;
            if (data) {
                setProgramCourse({ Program: Program })
                setCourses([data.SingleProgram])
            }
        }
    }
    const ProgramInputHandle = (event) => {
        const SingleProgram = event.target.value;
        getSpecificCourse(SingleProgram);
    }




    const CourseInputHandle = (event) => {
        const SingleCourse = event.target.value;
        if (SingleCourse !== "" && AllCourses.includes(SingleCourse) !== true && AllCourses.length<=5) {
            setAllCourses([...AllCourses, SingleCourse])
        }else if(AllCourses.length>5){
            return alert("you cannot submit more than 6 courses in one Form")
        }
    }
    const handleCourseRemove = (index) => {
        const list = [...AllCourses];
        list.splice(index, 1);
        setAllCourses(list)
    }


    const SubmitUGForm = async () => {
        const { Student_Name, Father_Name, Registry_No, Date_of_First_Submission, Semester, Status, FeePaid } = handleInput;
        if (!Student_Name || !Father_Name || !Registry_No || !Date_of_First_Submission || !Semester || !Status || !FeePaid || !ProgramCourse.Program || AllCourses.length < 1) {
            return window.alert("Please fill all the fields first!")
        }
        if (FeePaid.length < 5) {
            return window.alert("The Submission fee is not valid!")
        }
        if (imageSelct === "") {
            return window.alert("Please choose the Bank Challan Form Picture...")
        }
        const responce = await UG_Form_Submit({ Student_Name, Father_Name, Registry_No, Date_of_First_Submission, Semester, Status, FeePaid, Program: ProgramCourse.Program, Courses: AllCourses, _id, imageSelct });
        // const {data}=responce;
        if (responce.status === 200) {
            window.alert("Submitted Successfully!")
            return history.push("/");
        }else if(responce.status===202){
            window.alert("GS10 Form with this data already exist!")
            return history.push("/");
        }

    }



    const handlingInputs = (e) => {
        const { name, value } = e.target;
        sethandleInpt((preval) => {
            return {
                ...preval,
                [name]: value
            }
        })
    }

    const handlingImages = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setimageSelct(reader.result)
        }
    }


    const showUGForm = () => {
        if (SingleUser.Type) {
            setUGFormToggle(true);
        } else {
            window.alert("First Specify your Type. Update your Profile ✏️")
        }
    }



    return (
        <>
            <div className={style.userHeader}>
                <div className={style.userHeaderManage}>
                    <div className={style.leftSideHeader}>
                        <h4>UG Form</h4>
                    </div>
                    <div className={style.MidSideHeader}>
                        <Link to="#" className={page === "FormPage" ? style.current : ""}>All Forms</Link>
                        <Link to="#">Updates</Link>
                    </div>
                    {handleUGFormStatus === 'false' ?
                        <div className={style.rightSideHeader}>
                            <button onClick={() => showUGForm()}>Create Form <span>+</span></button>
                        </div>
                        :
                        ""
                    }
                </div>
            </div>



            {handleUGFormStatus === 'false' ?
                <div className={UGFormToggle ? style.userUGFormCreation : style.userUGFormCreationHide}>
                    <div className={style.UGForm} >


                        {/* UGForm code here */}
                        <div className={style.formcontainer}>
                            <div className={style.aligninputsfield}>
                                <div className={style.inputs}>
                                    <label htmlFor="S_name" className="S_name">Name: </label>
                                    <input type="text" name="Student_Name" value={handleInput.Student_Name} id="S_name" placeholder='Name...' onChange={handlingInputs} />
                                </div>
                                <div className={style.inputs}>
                                    <label htmlFor="F_name" className="F_name">Father name: </label>
                                    <input type="text" name="Father_Name" value={handleInput.Father_Name} id="F_name" placeholder='Fathername...' onChange={handlingInputs} />
                                </div>
                            </div>
                            <div className={style.aligninputsfield}>
                                <div className={style.inputs}>
                                    <label htmlFor="R_no" className="R_no">Registry no: </label>
                                    <input type="text" name="Registry_No" value={handleInput.Registry_No} id="R_no" placeholder='Registration no.' onChange={handlingInputs} />
                                </div>
                                <div className={style.inputs}>
                                    <label htmlFor="Semester" className="Semester">Semester: </label>
                                    <select name="Semester" id="Semester" onChange={handlingInputs}>
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
                            </div>
                            <div className={style.aligninputsfield}>
                                <div className={style.inputs}>
                                    <label htmlFor="DOFS" className="DOFS">First submission: </label>
                                    <input type="datetime-local" value={handleInput.Date_of_First_Submission} name="Date_of_First_Submission" id="DOFS" onChange={handlingInputs} />
                                </div>
                                <div className={style.inputs}>
                                    <label htmlFor="Status" className="Semester">Status: </label>
                                    <select name="Status" id="Status" onChange={handlingInputs}>
                                        <option value="">Status</option>
                                        <option value={Type}>{Type}</option>
                                        {/* <option value="Regular-student">Regular Student</option>
                                        <option value="Govt. Employee">Govt. Employee (on leave)</option>
                                        <option value="HEC-Nominee">HEC Nominee</option>
                                        <option value="Uni-Empl-FullTime">Employee ( Full Time )</option>
                                        <option value="Uni-Empl-PartTime">Employee ( Part Time )</option>
                                        <option value="Empl-other-organization">Employee to other organization</option>
                                        <option value="Extra-Enrollement">Extra Enrollement</option>
                                        <option value="Others">Others</option> */}
                                    </select>
                                </div>
                            </div>
                            <div className={style.aligninputsfield}>
                                <div className={style.inputs}>
                                    <label htmlFor="Program" className="Program">Program: </label>
                                    <select name="Program" value={handleInput.Program} id="Program" onChange={ProgramInputHandle}>
                                        <option value="" >Select Program</option>
                                        {Programs ? Programs.map((val, index, array) => {
                                            return (
                                                <option value={`${val.Degree}`} key={index}>{val.Degree}</option>
                                            )
                                        }) : ""}
                                    </select>
                                </div>
                                {Courses.length > 0 ?
                                    <div className={style.inputs}>
                                        <label htmlFor="Status" className="Semester">Status: </label>
                                        <select name="Courses" value={handleInput.Courses} id="" onChange={CourseInputHandle}>
                                            <option value="" >Select Course</option>
                                            {Courses.map((val, index, arr) => {
                                                return val.Courses.map((val, index, arr) => {
                                                    return (
                                                        <option value={`${val.Course_name}`} key={index}>{val.Course_name}</option>
                                                    )
                                                })
                                            })}
                                        </select>
                                    </div>
                                    : ""}
                            </div>

                            <div className={style.aligninputsfield}>
                                <div className={style.inputs}>
                                    <label htmlFor="Fpaid" className="Fpaid">Fee Paid: </label>
                                    <input type="number" name="FeePaid" value={handleInput.FeePaid} id="Fpaid" placeholder='32000' onChange={handlingInputs} />
                                </div>
                                <div className={style.inputs}>
                                    <label htmlFor="image" className={style.image}>Choose an image </label>
                                    <input type="file" name="UGForm_image" accept="image/png, image/jpg, image/jpeg" id="image" onChange={handlingImages} hidden />
                                </div>
                            </div>
                            <div className="selectedCourses">
                                {AllCourses.length > 0 ?
                                    <div className={style.selectedCourses}>
                                        {AllCourses.map((val, index, arr) => {
                                            return (
                                                <div className={style.Course} key={index}>
                                                    <div className={style.CourseName}>{val}</div>
                                                    <div className={style.CourseCancelBtn} onClick={() => handleCourseRemove(index)}>X</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    : ""}
                            </div>


                            <button className={style.btnSubmit} onClick={SubmitUGForm}>Submit</button>
                        </div>

                        {/* image preview code here */}
                        <div className={style.imagePreview}>
                            {imageSelct ? <h5>Image Selected</h5> : <h5>No Image Selected</h5>}
                            {imageSelct ? <img src={imageSelct} alt="not found" /> : <img src="./images/previewImage2.png" alt="not found" />}

                        </div>

                        {/* form cancel button here */}
                        <div className={style.FormCancelBtn}>
                            <img src="./images/cross.png" alt="not found" onClick={() => setUGFormToggle(false)} />
                        </div>
                    </div>
                </div>
                : <div className={style.formSubmitted}>
                    <div className={style.message}>
                        <h1>UG Form Submitted</h1>
                        <p>Track the activity below. So, later you can download once it is Approved from Authorities.</p>
                    </div>
                </div>
            }
        </>
    )
}

export default UserHeader