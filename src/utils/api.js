import axios from 'axios';
import {SetPosts} from "../redux/postSlice";
import { SetEvents } from '../redux/eventSlice';
import { SetEvent } from '../redux/eventSlice';

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

export const uploadImage = async (uploadFile) => {
    //formdata envoyer plusieurs objets au mm temps
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("upload_preset", "socialMedia");
    try {
        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dbey0zmo6/upload",
            formData);
            //secure_url : lien web qui permet d'accéder a une image
        return response.data.secure_url; 
    } catch (error) {
        console.log(error);
    }
};
export const addEvent = async (token, eventData) => {
    try {
      const response = await API.post("/event/createevent", eventData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding event:", error);
      throw error;
    }
  };
  
  export const fetchEvents = async (token, dispatch, page = 1, uri, data) => {
    try {
      const res = await apiRequest({
        url: uri || `/event/getevents?page=${page}`, // Include page parameter in the URL
        token: token,
        method: "GET",
        data: data || {},
      });
      dispatch(SetEvents(res?.data));
      return res?.data; // Return the response data
    } catch (error) {
      console.log(error);
      throw error; // Throw error to be caught by the caller
    }
  };
 

 /* export const searchEvents = async (searchQuery) => {
    try {
      const response = await apiRequest({
        url: `event/searchevents?searchQuery=${searchQuery}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      console.error("Error searching events:", error);
      throw error;
    }
  };
  */

  //export const getEventBySearch = (searchQuery) =>
   //API.get(`/event/searchevents?searchQuery=${searchQuery}`);
   export const getEvent = async (token, dispatch, id, uri, data) => {
    try {
      const res = await apiRequest({
        url: uri || `/event/getevent/${id}`, // Include page parameter in the URL
        token: token,
        method: "GET",
        data: data || {},
      });
      dispatch(SetEvent(res?.data));
      return res?.data; // Return the response data
    } catch (error) {
      console.log(error);
      throw error; // Throw error to be caught by the caller
    }
  };
  const BASE_URL = "http://localhost:5000";
  export const searchEvents = async (searchQuery, token) => {
    try {
      const response = await axios.get(`${BASE_URL}/event/search?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the user's token for authentication
        },
      });
      return response.data; // Return the data from the response
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to search events"); // Throw an error with the message from the API response
    }
  };




export const deleteEvent = async (token, eventId, dispatch) => {
  try {
    const response = await axios.delete(`${BASE_URL}/event/deleteevent/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // Dispatch action for successful deletion if needed
    dispatch({ type: "DELETE_EVENT_SUCCESS", payload: eventId });
    return response.data; // Return response data if needed
  } catch (error) {
    console.log('Error deleting event:', error);
    throw error; // Throw the error for handling in the component
  }
};



export const updateEvent = async (token, data) => {
  console.log(data);
  try {
    const res = await apiRequest({
      url: '/event/updateevent/' + data._id,
      token: token,
      method: 'PUT',
      data: data,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
