import React, { useEffect, useState , useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import CustomButton from "../components/CustomButton";
import TextInput from "../components/TextInput";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { BsFiletypeGif, BsPersonFillAdd } from "react-icons/bs";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { useForm } from "react-hook-form";
import ProfileCard from "../components/ProfileCard";
import TopBar from "../components/TopBar";
import FriendsCard from "../components/FriendsCard";
import PostCard from "../components/PostCard";
import EditProfile from "../components/EditProfile";
import { apiRequest, fetchPosts, handleFileUpload, sendFriendRequest ,getUserInfo, likePost, deletePost,updatePost,deleteComment,updateComment,sharePost} from "../utils/api";
import { UserLogin } from "../redux/userSlice";
import {io} from 'socket.io-client';
import { addNotification } from "../redux/notificationsSlice";
import InputEmoji from "react-input-emoji";


//
const socket = io('/',{
  reconnection:true
})
//useSelector d'extraire des données du magasin Redux.
const Home = () => {
    const isNonMobileScreens = true;
    const { user,edit } = useSelector((state) => state.user);
    const {posts} = useSelector((state )=> state.posts);
    const [friendRequest, setFriendRequest] = useState([]);
    const [suggestedFriends, setSuggestedFriends] = useState([]);
    const [errMsg, setErrMsg] = useState("");
    const [file, setFile] = useState(null);
    const [video,setVideo]= useState(null);
    const [posting, setPosting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [onlineUsers,setOnlineUsers]=useState([])
    const socketRef = useRef();
    const [notifications, setNotifications] = useState([]);


      
    useEffect(() => {
        socketRef.current = io('http://localhost:5000');
        console.log('Emitting new-user-add event with userId:', user._id);
        socketRef.current.emit('new-user-add', user._id);
        socketRef.current.on('get-users', (users) => {
        setOnlineUsers(users);
        console.log('Received get-users event with users:', users);
        });
        
        return () => {
            socketRef.current.disconnect();
            console.log('Socket disconnected');
        };
    }, [user]);

    
const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const handleUpdatePost = async (postId, postData) => {
        try {
          await updatePost(postId, user.token, postData);
          await fetchPost();
        } catch (error) {
          console.log(error);
        }
      };
      const handleDeleteComment = async (commentId) => {
        try {
          await deleteComment(commentId, user.token);
          await fetchPost();
        } catch (error) {
          console.log(error);
        }
      };
      const handleUpdateComment = async (commentId, commentData) => {
        try {
          await updateComment(commentId, user.token, commentData);
          await fetchPost();
        } catch (error) {
          console.log(error);
        }
      };
    const handlePostSubmit = async (data) => {
        setPosting(true);
        setErrMsg("");
        try {
            console.log('File:', file);
            console.log('Video:', video);
            const imageUri = file && (await handleFileUpload(file, 'image')); 
            const videoUri = video && (await handleFileUpload(video, 'video'));   
            const newData = {
                ...data,
                image: imageUri,
                video: videoUri, 
            };
            const res = await apiRequest({
                url : "/posts/create-post",
                data: newData,
                token: user?.token,
                method: "POST",
            });
        if (res?.status === "failed"){
            setErrMsg(res);
        }else{
            reset({
                description: "",
            });
            
            setFile(null);
            setVideo(null);
            setErrMsg("");
            await fetchPost();
        }
        setPosting(false);     
        } catch (error) {
            console.log('Error:', error);
            setErrMsg("An error occurred during video upload.");
            setPosting(false);  
        }
    };

    const fetchPost = async()=>{
        await fetchPosts(user?.token,dispatch);
        setLoading(false);
    };

    const handlelikePost = async (uri, friendId) => {
        try {
            await likePost({ uri: uri, token: user?.token });
            await fetchPost();
            // Émettre un événement socket pour informer le backend du like sur le post
            socketRef.current.emit('post-liked', { postId: uri, userId: user._id, friendUserId: friendId });
            console.log('Emitted post-liked event with postId:', uri, 'and userId:', user._id, 'by friendId:', friendId);
            dispatch(addNotification({ type: "info", message: "You liked a post!" }));
        } catch (error) {
            console.log(error);
        }
    };
    
    
    
    const handledelete = async (id) => {
            await deletePost(id, user.token);
            await fetchPosts();
    };
    
    
    const fetchFriendRequest = async()=>{
        try{
            const res = await apiRequest({
                url:"/users/get-friend-request",
                token: user?.token,
                method:"POST",
            });

            setFriendRequest(res?.data);
        }catch(error){
            console.log(error);
        }
    };
    const fetchSuggestedFriends = async () => {
        try {
            const res = await apiRequest({
                url: "/users/suggested-friends",
                token: user?.token,
                method: "POST",
            });

            if (res?.data) {
                const filteredSuggestions = filterSuggestedFriends(res?.data, user?.friends);
                setSuggestedFriends(filteredSuggestions);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const filterSuggestedFriends = (suggestions, userFriends) => {
        return suggestions.filter((friend) => {
            // Vérifie si l'ID de l'ami n'est pas dans la liste des amis de l'utilisateur
            return !userFriends.some((userFriend) => userFriend._id === friend._id);
        });
    };
    
    const handleFriendRequest = async (friendId) => {
        try {
            const res = await sendFriendRequest(user.token, friendId);
            await fetchSuggestedFriends(); // Met à jour la liste des amis suggérés
            socketRef.current.emit('Send-friend-request', { userId: user._id, friendId });
    
            // Supprime l'ami de la liste des suggestions
            setSuggestedFriends(suggestedFriends.filter((friend) => friend._id !== friendId));
    
            console.log('Sent friend request to userId:', friendId);
        } catch (error) {
            console.log(error);
        }
    };
    
    
    const acceptFriendRequest = async(id,status)=>{
        try{
            const res = await apiRequest({
                url:"/users/accept-request",
                token:user?.token,
                method:"POST",
                data: {rid:id,status},
            });
            setFriendRequest(res?.data);
            socketRef.current.emit('friend-request', { userId: user._id, friendId: id ,status });
            console.log('Emitted friend-request event with userId:', user._id, 'friendId:', id, 'and status:', status);
        }catch (error){
            console.log(error);
        }
    };
    const getUser = async()=>{
        const res = await getUserInfo(user?.token);
        const newData = {token: user?.token, ...res};
        dispatch(UserLogin(newData));
    };

    const handleSharePost = async (postId, shareWithUserId) => {
        try {
          const res = await apiRequest({
            url: "posts/share",
            token: user.token,
            method: 'POST',
            data: {
              postId: postId,
              shareWith: shareWithUserId,
            },
          });
          console.log('Post shared successfully:', res);
          await fetchPosts(user?.token, dispatch);
        } catch (error) {
          console.error('Error sharing post:', error);
          throw error;
        }
      };


    useEffect(()=>{
        setLoading(true);
        getUser();
        fetchPost();
        fetchFriendRequest();
        fetchSuggestedFriends();
    },[]);
    return (
        <>
                        <TopBar />

            <div className='min-h-screen w-full px-0 lg:px-10 pb-20 2xl:px-10 bg-bgColor lg:rounded-lg h-screen overflow-hidden  '>
                
                <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
                    {/* LEFT */}
                    <div className='hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
                        <ProfileCard user={user} />
                        <FriendsCard friends={user?.friends} />
                    </div>

                    {/* CENTER */}
                    <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>
                    <div className='bg-primary px-4 rounded-lg'>
            </div>
                        <form
                            onSubmit={handleSubmit(handlePostSubmit)}
                            className='bg-primary px-4 rounded-lg'
                        >
                            <div className='w-full flex items-center gap-2 py-4 border-b border-[#E4DEBE]'>
                                <img
                                    src={user?.profileUrl ?? NoProfile}
                                    alt='User Image'
                                    className='w-14 h-14 rounded-full object-cover'
                                />
                                <TextInput
                                    styles='w-full rounded-full py-5'
                                    placeholder="What's on your mind...."
                                    name='description'
                                    register={register("description", {
                                        required: "Write something about post",
                                    })}
                                    error={errors.description ? errors.description.message : ""}
                                    
                                />
                            </div>
                            {errMsg?.message && (
                                <span
                                    role='alert'
                                    className={`text-sm ${errMsg?.status === "failed"
                                            ? "text-[#f64949fe]"
                                            : "text-[#2ba150fe]"
                                        } mt-0.5`}
                                >
                                    {errMsg?.message}
                                </span>
                            )}

                            <div className='flex items-center justify-between py-4'>
                                <label
                                    htmlFor='imgUpload'
                                    className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                                >
                                    <input
                                        type='file'
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className='hidden'
                                        id='imgUpload'
                                        data-max-size='5120'
                                        accept='.jpg, .png, .jpeg'
                                       
                                    />
                                    <BiImages />
                                    <span>Image</span>
                                </label>

                                <label
                                    className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                                    htmlFor='videoUpload'
                                >
                                    <input
                                        type='file'
                                        data-max-size='5120'
                                        onChange={(e) => setVideo(e.target.files[0])}
                                        className='hidden'
                                        id='videoUpload'
                                        accept='.mp4, .wav'
                                    />
                                    <BiSolidVideo />
                                    <span>Video</span>
                                </label>
                                {file && (
    <div className='flex items-center gap-2 mt-2'>
        <BsFiletypeGif size={30} className='text-green-600' />
        <span>{file.name}</span>
    </div>
)}

{video && (
    <div className='flex items-center gap-2 mt-2'>
        <BiImages size={30} className='text-green-600' />
        <span>{video.name}</span>
    </div>
)}

                                

                                <div>
                                    {posting ? (
                                        <Loading />
                                    ) : (
                                        <CustomButton
                                            type='submit'
                                            title='Post'
                                            containerStyles='bg-[#D00000] text-white py-1 px-6 rounded-full font-semibold text-sm'
                                        />
                                    )}
                                </div>
                            </div>
                        </form>
               
          
                        {loading ? (
                            <Loading />
                        ) : posts?.length > 0 ? (
                            posts?.map((post) => (
                                <PostCard
                                    key={post?._id}
                                    post={post}
                                    user={user}
                                    deletePost={handledelete}
                                    likePost={handlelikePost}
                                    updatePost={handleUpdatePost} 
                                    deleteComment={handleDeleteComment} 
                                    updateComment={handleUpdateComment} 
                                    sharePost={handleSharePost}
                                />
                            ))
                        ) : (
                            <div className='flex w-full h-full items-center justify-center'>
                                <p className='text-lg text-ascent-2'>No Post Available</p>
                            </div>
                        )}
                    </div>

                    {/* RIGJT */}
                    <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
                        {/* FRIEND REQUEST */}
                        <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
                            <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                                <span> Friend Request</span>
                                <span>{friendRequest?.length}</span>
                            </div>

                            <div className='w-full flex flex-col gap-4 pt-4'>
                                {friendRequest?.map(({ _id, requestFrom: from }) => (
                                    <div key={_id} className='flex items-center justify-between'>
                                        <Link
                                            to={"/profile/" + from?._id}
                                            className='w-full flex gap-4 items-center cursor-pointer'
                                        >
                                            <img
                                                src={from?.profileUrl ?? NoProfile}
                                                alt={from?.firstName}
                                                className='w-10 h-10 object-cover rounded-full'
                                            />
                                            <div className='flex-1'>
                                                <p className='text-base font-medium text-ascent-1'>
                                                    {from?.firstName} {from?.lastName}
                                                </p>
                                                <span className='text-sm text-ascent-2'>
                                                    {from?.profession ?? "No Profession"}
                                                </span>
                                            </div>
                                        </Link>

                                        <div className='flex gap-1'>
                                            <CustomButton
                                                title='Accept'
                                                onClick={() => acceptFriendRequest(_id,"Accepted")}
                                                containerStyles='bg-[#D00000] text-xs text-white px-1.5 py-1 rounded-full'
                                            />
                                            <CustomButton
                                                title='Deny'
                                                onClick={() => acceptFriendRequest(_id,"Denied")}
                                                containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SUGGESTED FRIENDS */}
                        <div className='w-full bg-primary shadow-sm rounded-lg px-5 py-5'>
                            <div className='flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
                                <span>Friend Suggestion</span>
                            </div>
                            <div className='w-full flex flex-col gap-4 pt-4'>
                                {suggestedFriends?.map((friend) => (
                                    <div
                                        className='flex items-center justify-between'
                                        key={friend._id}
                                    >
                                        <Link
                                            to={"/profile/" + friend?._id}
                                            key={friend?._id}
                                            className='w-full flex gap-4 items-center cursor-pointer'
                                        >
                                            <img
                                                src={friend?.profileUrl ?? NoProfile}
                                                alt={friend?.firstName}
                                                className='w-10 h-10 object-cover rounded-full'
                                            />
                                            <div className='flex-1 '>
                                                <p className='text-base font-medium text-ascent-1'>
                                                    {friend?.firstName} {friend?.lastName}
                                                </p>
                                                <span className='text-sm text-ascent-2'>
                                                    {friend?.profession ?? "No Profession"}
                                                </span>
                                            </div>
                                        </Link>

                                        <div className='flex gap-1'>
                                            <button
                                                className='bg-[rgba(4,68,164,0.19)] text-sm text-white p-1 rounded'
                                                onClick={() => {handleFriendRequest(friend?._id)}}
                                            >
                                                <BsPersonFillAdd size={20} className='text-[#D00000]' />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

           
            {edit && <EditProfile />}
             <div className="fixed bottom-10 right-10">
  {user?.role === 0 ? null : (
    <Link to={`/dashboard?token=${user?.token}`}>
      <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
        Go to Admin Dashboard
      </button>
    </Link>
  )}
</div>
        </>
    );
};

export default Home;