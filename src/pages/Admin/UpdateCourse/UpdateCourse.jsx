import React, { useEffect, useState } from 'react'
import style from './UpdateCourse.module.css'
import { GetSingleCourse, UpdateSingleCourse } from '../../../http'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'

const UpdateCourse = () => {
    const history = useHistory()
    const [handleInputs, sethandleInputs] = useState({
        Course_no: "",
        Course_name: "",
        Credit_hour: "",
    });
    const [Course_status, setCourse_status] = useState("")
    const [course, setcourse] = useState([]);
    const params = useParams()


    useEffect(() => {
        const singleCourse = async () => {
            // console.log(courseIdURL);
            const responce = await GetSingleCourse(Object.values(params).join(""));
            const { data } = await responce;
            setcourse(data.course.Courses[0])
            const { Course_no, Course_name, Credit_hour } = data.course.Courses[0];
            // setCourse_status(Course_status)
            sethandleInputs({ Course_no, Course_name, Credit_hour })
        }
        singleCourse()
    }, [])


    const submitUpdatedRecord = async () => {
        const { Course_no, Course_name, Credit_hour } = handleInputs;
        if (!Course_status || !Course_no || !Course_name || !Credit_hour) {
            return window.alert("please fill all the fields first");
        }
        try {
            const responce = await UpdateSingleCourse({ Course_no, Course_name, Credit_hour, Course_status: Course_status, _id: course._id });
            if (responce.status === 200) {
                history.goBack()
                return window.alert("Course updated Successfully..")
            } else {
                const { data } = responce;
                return window.alert(data.message)
            }
        } catch (error) {
            return window.alert(error)
        }
    }
    return (
        <div>
            {/* go back button */}
            <div className={style.goBackButton} onClick={() => { return history.goBack() }}>
                <button><img src="/images/goback.png" alt="" /> Go Back</button>
            </div>
            <div className={style.CourseCardContainer} >
                <div className={style.CourseCard}>
                    <div className={style.CardTop}>
                        <div className={style.CourseleftSide}>
                            <h2>
                                Update Course
                            </h2>
                        </div>
                        <div className={style.CourserightSide}>

                        </div>
                    </div>
                    <div className={style.CardBottom}>
                        <div className={style.CourseAlignfields}>
                            <div className={style.CourseCardAlignInput}>
                                <label htmlFor='Course_no' >Course_no: </label>
                                <input type="text"
                                    name="Course_no"
                                    id="Course_no"
                                    placeholder='Course no...'
                                    value={handleInputs.Course_no}
                                    onChange={(e) => { const { name, value } = e.target; sethandleInputs((preval) => { return { ...preval, [name]: value } }) }}
                                />
                            </div>
                            <div className={style.CourseCardAlignInput}>
                                <label htmlFor='Course_status' >Course_status: </label>
                                <select name="Course_status" id="Course_status" onChange={(e) => { return setCourse_status(e.target.value) }}>
                                    <option value="null">Select Status</option>
                                    <option value="major">major</option>
                                    <option value="minor">minor</option>
                                    <option value="complusory">complusory</option>
                                    <option value="audit">audit</option>
                                </select>
                            </div>
                        </div>
                        <div className={style.CourseAlignfields}>
                            <div className={style.CourseCardAlignInput}>
                                <label htmlFor='Course_name' >Course_name: </label>
                                <input type="text"
                                    name="Course_name"
                                    id="Course_name"
                                    placeholder='Course name...'
                                    value={handleInputs.Course_name}
                                    onChange={(e) => { const { name, value } = e.target; sethandleInputs((preval) => { return { ...preval, [name]: value } }) }}
                                />
                            </div>
                            <div className={style.CourseCardAlignInput}>
                                <label htmlFor='Credit_hour' >Credit hours: </label>
                                <input type="number"
                                    name="Credit_hour"
                                    id="Credit_hour"
                                    placeholder='Credit hours...'
                                    value={handleInputs.Credit_hour}
                                    onChange={(e) => { const { name, value } = e.target; sethandleInputs((preval) => { return { ...preval, [name]: value } }) }}
                                />
                            </div>
                        </div>
                        <button onClick={submitUpdatedRecord}>Update</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default UpdateCourse