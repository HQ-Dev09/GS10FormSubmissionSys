import axios from 'axios';

const api = axios.create({
    baseURL: "https://gs10formhq.herokuapp.com/",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    },
    withCredentials: true
});


export const LoginUser = (data) => { return api.post("/login", data) };
export const RegisterUser = (data) => { return api.post("/register", data) };
export const logoutUser = () => { return api.get("/logout") }
export const ProfileSetup = (data) => { return api.post("/update/Profile", data) }
export const getAuthoritesInfo = () => { return api.get("/getAuthoritesInfo") }
export const getsingleAuthorityInfo = (data) => { return api.get(`/admin/updateRole/${data}`) }
export const CreateRole = (data) => { return api.post("/CreateRole", data) }
export const updateAuthorityRole = (data) => { return api.post("/admin/updateRole/update", data) }
export const CreateDegree = (data) => { return api.post("/CreateDegree", data) };
export const CreateCourse = (data) => { return api.post("/createcourse", data) };
export const GetCourses = () => { return api.get("/allcourses") };
export const GetSingleProgramCourse = (data) => { return api.post("/SingleProgram/Courses", data) };
export const GetSingleCourse = (data) => { return api.get(`/admin/course/${data}`) };
export const UpdateSingleCourse = (data) => { return api.post(`/admin/course/update`, data) };
export const GetSpecificProgram = (data) => { return api.post(`/SpecificPrograms`, data) }
export const UG_Form_Submit = (data) => { return api.post(`/UG_Form/Submit`, data) };
export const Get_UG_Forms = () => { return api.get(`/user/UGForms`) };
export const Get_All_UG_Forms_FAdmin = () => { return api.get(`/admin/AllUGForms`) };
export const Get_Specific_UG_Form = (data) => { return api.get(`/user/UGForm/${data}`) };
export const Get_UG_Forms_For_Authority = (data) => { return api.get(`/admin/UGForm`, data) };
export const getSpecificUser = (data) => { return api.post(`/GetSpecificUser`, data) };
export const getTotalUsers = () => { return api.get(`/totalusers`) };
export const CreatingAnnouncement = (data) => { return api.post(`/Announcement/New`, data) };


export default api;