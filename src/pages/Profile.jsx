import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import FriendsCard from "../components/FriendsCard";
import ProfileCard from "../components/ProfileCard";
import PostCard from "../components/PostCard";
import Loading from "../components/Loading";
import { deletePost, fetchPosts, getUserInfo, likePost,getSharedPosts } from "../utils/api";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const [userInfo, setUserInfo] = useState(user);
  const [loading, setLoading] = useState(false);
  const [sharedPosts, setSharedPosts] = useState([]);

  const uri = "posts/get-user-post/" + id;

  const getUser = async () => {
    const res = await getUserInfo(user?.token, id);
    setUserInfo(res);
  };

  const getPosts = async () => {
    try {
      // Récupérer les posts de l'utilisateur
      await fetchPosts(user.token, dispatch, uri);
  
      // Récupérer les posts partagés de l'utilisateur
      const sharedRes = await getSharedPosts(id);
      setSharedPosts(sharedRes);
  
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Gérer l'erreur selon vos besoins
    }
  };
  
  const getShared = async () => {
    try {
      const sharedRes = await getSharedPosts(id);
      setSharedPosts(sharedRes);
    } catch (error) {
      console.error("Error fetching shared posts:", error);
    }
  };

  const handleDelete = async (postId) => {
    await deletePost(postId, user.token);
    await getPosts();
  };

  const handleLikePost = async (uri) => {
    await likePost({ uri: uri, token: user?.token });
    await getPosts();
  };

  useEffect(() => {
    setLoading(true);
    getUser();
    getPosts();
    getShared();
  }, [id]);

  return (
    <>
      <TopBar />
      <div className='min-h-screen w-full px-0 lg:px-10 pb-20 2xl:px-10 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <div className='w-full flex gap-2 lg:gap-4 md:pl-4 pt-5 pb-10 h-full'>
          {/* LEFT */}
          <div className='hidden w-1/3 lg:w-1/4 md:flex flex-col gap-6 overflow-y-auto'>
            <ProfileCard user={userInfo} />
            <div className='block lg:hidden'>
              <FriendsCard friends={userInfo?.friends} />
            </div>
          </div>

          {/* CENTER */}
          <div className='flex-1 h-full bg-primary px-4 flex flex-col gap-6 overflow-y-auto'>
            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  key={post?._id}
                  post={post}
                  user={user}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                />
              ))
            ) : (
              <div className='flex w-full h-full items-center justify-center'>
                <p className='text-lg text-ascent-2'>No Posts Available</p>
              </div>
            )}

            {/* Shared Posts */}
            {sharedPosts?.length > 0 && (
              <div className='mt-4'>
                <h2 className='text-lg font-semibold text-ascent-1 mb-2'>Shared Posts</h2>
                {sharedPosts.map((sharedPost) => (
                  <PostCard
                    key={sharedPost?._id}
                    post={sharedPost}
                    user={user}
                    likePost={handleLikePost} 
                    // {/* Il est probablement inutile de supprimer les posts partagés */}
                                      />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className='hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto'>
            <FriendsCard friends={userInfo?.friends} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
