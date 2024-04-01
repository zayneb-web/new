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

    //formdata envoyer plusieurs objets au mm temps
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("upload_preset", "BetterCallUs");
    try {
        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/djfdv95aj/upload",
            formData);
            //secure_url : lien web qui permet d'accéder a une image
        return response.data.secure_url; 
    } catch (error) {
        console.log(error);

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
            url: "/posts/" + id,
            token : token,
            method:"DELETE",
        });
        return;
    } catch (error) {
        console.error("An error occurred:", error);
        console.log("Error details:", error.response);
    

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


//--------------------------messegesApi------------------------------------
export const getMessages = (id, token) => apiRequest({ url: `/message/${id}`, token });

export const addMessage = (data, token) => apiRequest({ url: '/message/add', data, method: 'POST', token });
//-------------------------chatapi---------------------

export const createChat = (data, token) => apiRequest({ url: '/chat/', data, method: 'POST', token });

export const getUserChats = async (userId, token) => {
    try {
      const res = await apiRequest({
        url: `/chat/${userId}`, 
        token: token,
        method: "GET"
      });
      return res || [];
    } catch (error) {
      console.log(error);
      return []; 
    }
};


export const findChat = (firstId, secondId, token) =>
  apiRequest({ url: `/chat/find/${firstId}/${secondId}`, token });
  //------------socket ---------------------------



