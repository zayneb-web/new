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

export const handleFileUpload = async (uploadFile,fileType) => {

    //formdata envoyer plusieurs objets au mm temps
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("upload_preset", "BetterCallUs");
    formData.append("resource_type", fileType);
    try {
        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/djfdv95aj/upload",
            formData);
        return response.data.secure_url; 
    } catch (error) {
        console.log(error);

    }
};

export const addStory = async (token, storyData) => {
    try {
      const imageUrl = await handleFileUpload(storyData.image, "image");
  
      const res = await apiRequest({
        url: "/stories/add",
        token: token,
        method: "POST",
        data: {
          userId: storyData.userId,
          storyData: {
            firstName: storyData.firstName,
            photo: imageUrl,
            story_photo: storyData.story_photo,
          },
        },
      });
      return res;
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

//--------------------------messegesApi------------------------------------
export const getMessages = (id, token) => apiRequest({ url: `/message/${id}`, token });

export const addMessage = (data, token) => apiRequest({ url: '/message/add', data, method: 'POST', token });
//-------------------------chatapi---------------------
// In api.js

export const fetchUsers = async (token) => {
  try {
    const response = await apiRequest({
      url: "/users/all-users",
      token: token,
      method: "GET",
    });
    console.log("Response data:", response.data); 
    // Check if the response is successful and contains the expected data format
    if (response && response.data && Array.isArray(response.data)) {
      // Return the response data directly since it's already an array of users
      return response.data;
    } else {
      // Throw an error if the response data is not in the expected format
      throw new Error("Response data is not in the expected format");
    }
  } catch (error) {
    // Handle any errors that occur during the fetch request
    console.error("Error fetching users:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};


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



