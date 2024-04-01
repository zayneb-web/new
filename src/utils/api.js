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
                method:"POST",
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
  // API Functions for User Search
export const searchUsers = async (query, token) => {
    try {
        const res = await apiRequest({
            url: `/users/search?query=${query}`,
            token: token,
            method: "GET"
        });
        return res || []; // Assuming the response contains an array of users
    } catch (error) {
        console.log(error);
        return []; // Return an empty array in case of error
    }
};
