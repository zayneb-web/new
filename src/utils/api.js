import axios from 'axios';
import {SetPosts} from "../redux/postSlice";

const API_URL = "http://localhost:5000";

export const API= axios.create ({

    baseURL: API_URL,
    responseType: "json",
})
export const apiRequest = async({url , token , data , method})=>{

    try {
        const result= await API(url , {
            method: method || "GET",
            data : data,
            headers: {
                "Content-Type":"application/json",
                Authorization: token? `Bearer ${token}`: "",
            },
        } );
        return result?.data;
    }catch(error){
        const err=error.response.data;
        console.log(err);
        return {status: err.success, message : err.message}
    }
}
export const handleFileUpload = async (uploadFile) => {
    try {
        const formData = new FormData();
        formData.append("file", uploadFile);
        const response = await API.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.url; // Assuming the server responds with the file URL
    } catch (error) {
        console.error("File upload failed:", error);
        throw error;
    }
};

export const fetchPosts = async (token, dispatch, uri, data) => {
    try {
        const res = await apiRequest({
            url : uri || "/posts",
            token : token,
            method:"GET",
            data: data || {}
        });
        dispatch(SetPosts(res?.data));
        return;
    } catch (error) {
        console.log(error)
    }
};
export const likePost = async({uri,token})=>{
    try{
        const res = await apiRequest({
            url : uri,
            token:token,
            method : "POST"
        });
        return res;
    }catch(error){
        console.log(error);
    }
};
export const deletePost=async(id,token)=>{
    try {
        const res = await apiRequest({
            url:"posts" + id,
            token : token,
            method:"DELETE",
        })
    } catch (error) {
        console.log(error);
    }
};
export const getUserInfo = async(token, id) => {

    try {
        const uri= id===undefined? "/users/get-user":"/users/get-user/"+id;

        const res = await apiRequest({

            url:uri,
            token: token,
            method: "POST"
        });
        if(res?.message==="Authentication failed"){

            localStorage.removeItem("user");
            window.alert("user  session expired.  Login again");

            window.location.replace("/login");

            
        }
        return res?.user;

    }catch(error){
        console.log(error)
    }
}

export const sendFriendRequest = async(token , id)=> {

    try {

        const res= await apiRequest({

            url:"/users/friend-request",
            token : token,
            method:"POST",
            data : {requestTo: id},
        });
     return ;
   }catch(error){
        console.log(error)
    }
}

export const viewUserProfile = async (token , id)=>{

    try {

        const res= await apiRequest({
            url:"/users/profile-view",
            token : token,
            method:"POST",
            data :  {id},

        });
        return;
    }catch(error){
        console.log(error)
    }
}

export const addcourse = async (token, data) => {
    try {
      const res = await apiRequest({
        url: '/course/createcourse',
        token: token,
        method: 'POST',
        data: data,
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const getCourseById = async (token, id) => {
    try {
      const res = await apiRequest({
        url: '/course/getcourse/' + id,
        token: token,
        method: 'GET',
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const updateCourse = async (token, data) => {
    console.log(data);
    try {
      const res = await apiRequest({
        url: '/course/updatecourse/' + data._id,
        token: token,
        method: 'PUT',
        data: data,
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  };
  
  export const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await API.post('/course/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data.url;
    } catch (error) {
      console.log(error);
    }
  };
