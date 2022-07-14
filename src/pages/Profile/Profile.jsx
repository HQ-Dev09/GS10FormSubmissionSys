import React, { useState } from 'react'
import './Profile.css'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ProfileSetup } from '../../http'
import { validateUser } from '../../authStore/auth'

const Profile = () => {
    const { username, Profile, isRole, Type } = useSelector((state) => { return state.auth })
    const [imageSelct, setimageSelct] = useState("")
    const [updateusername, setupdateusername] = useState(username ? username : "")
    const [SelectUserType, setSelectUserType] = useState("")
    const [changeType, setchangeType] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()

    const handlingImages = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setimageSelct(reader.result)
        }
    }


    const handleUsername = (e) => {
        setupdateusername(e.target.value)
    }
    const handleSelectChange = (e) => {
        setSelectUserType(e.target.value)
    }


    const SubmitData = async () => {
        if (isRole === 'User') {
            if (!username) {
                return window.alert("Please fill all fields to complete your Profile.")
            }
        }
        const responce = await ProfileSetup({ username: updateusername, UserImage: imageSelct, Profile, Type: SelectUserType });

        const Admin = await responce.data.findAdmin;
        const User = await responce.data.findUser;
        if (Admin) {
            dispatch(validateUser(Admin))
            history.push("/admin");
            return window.alert("Profile Updated Successufully!")
        } else {
            dispatch(validateUser(User))
            history.push("/user");
            return window.alert("Profile Updated Successufully!")
        }
    }

    return (
        <div className='ProfilePage'>
            <div className="goBackButton" onClick={() => { return history.goBack() }}>
                <button><img src="/images/goback.png" alt="" /> Go Back</button>
            </div>
            <div className="prfileCard" id={`${isRole === 'User' ? 'forUserExtraField' : ''}`}>
                <div className="ProfileCardLeft">
                    <div className="forProfileImage">
                        <p>Choose an awesome image 🚀</p>
                        <div className="ImageProfile">
                            <img src={imageSelct ? imageSelct : Profile} alt="not found" />
                        </div>
                        <label htmlFor="profileImage">Choose an image</label>
                        <input type="file" name="UGForm_image" accept="image/png, image/jpg, image/jpeg" id="profileImage" onChange={handlingImages} hidden />
                    </div>
                    <div className="forProfileUsername">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" id="username" onChange={handleUsername} placeholder="Username..." value={updateusername} />
                    </div>
                    {changeType === false
                        ?
                        isRole === 'User' ?
                            <div className="forProfileUserType">
                                <label htmlFor='Only_For' >Type: </label>
                                {Type ?
                                    <div className="profiletypechange"><span>{Type}</span> <p onClick={() => {
                                        setchangeType(true)
                                    }}> Change?</p></div> :
                                    <select name="Only_For" id="Only_For" onChange={handleSelectChange} required>
                                        <option value="">Select Type</option>
                                        <option value="Regular-student">Regular Student</option>
                                        <option value="Govt. Employee">Govt. Employee (on leave)</option>
                                        <option value="HEC-Nominee">HEC Nominee</option>
                                        <option value="Uni-Empl-FullTime">Employee ( Full Time )</option>
                                        <option value="Uni-Empl-PartTime">Employee ( Part Time )</option>
                                        <option value="Empl-other-organization">Employee to other organization</option>
                                        <option value="Extra-Enrollement">Extra Enrollement</option>
                                        <option value="Others">Ohters</option>
                                    </select>
                                }
                            </div>
                            : ""
                        : <div className="forProfileUserType">
                            <label htmlFor='Only_For' >Type: </label>
                                <select name="Only_For" id="Only_For" onChange={handleSelectChange} required>
                                    <option value="">Select Type</option>
                                    <option value="Regular-student">Regular Student</option>
                                    <option value="Govt. Employee">Govt. Employee (on leave)</option> 
                                    <option value="HEC-Nominee">HEC Nominee</option>
                                    <option value="Uni-Empl-FullTime">Employee ( Full Time )</option>
                                    <option value="Uni-Empl-PartTime">Employee ( Part Time )</option>
                                    <option value="Empl-other-organization">Employee to other organization</option>
                                    <option value="Extra-Enrollement">Extra Enrollement</option>
                                    <option value="Others">Ohters</option>
                                </select>
                        </div>

                    }
                    <button onClick={SubmitData}>Set Profile</button>
                </div>
                <div className="ProfileCardRightForPreview">
                    <div className="rightsidepreview">
                        <h3>Preview Image</h3>
                        <img src={imageSelct ? imageSelct : "/images/previewImage2.png"} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile