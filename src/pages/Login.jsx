import React, {useState} from "react";
import TextInput from "../components/TextInput"
import {useForm} from "react-hook-form";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {BsShare} from "react-icons/bs";
import {AiOutlineInteraction} from "react-icons/ai";
import {ImConnection} from "react-icons/im";
import CustomButton from "../components/CustomButton"
import GoogleButtom from "../components/GoogleButtom.jsx"
import {BgImage, logo} from "../assets";
import {handleLogin, handleLoginPicture, loginByUserID} from "../utils/api";
import {UserLogin} from "../redux/userSlice";
import Loading from "../components/Loading";
import Webcam from "react-webcam";


const Login = () => {
  
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [faceID, setFaceID] = useState(false);
    const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = (data) => {
      setErrMsg("")
    setIsSubmitting(true);
        handleLogin(data).then((res) => {
            if(res?.data?.success){
                setIsSubmitting(false);
                const newData= {token: res?.data?.token, ...res?.data?.user};
                dispatch(UserLogin(newData));
                window.location.replace("/")
            }else{
                setIsSubmitting(false);
                setErrMsg(res?.data?.message)
            }
        }).catch(err => {
            setIsSubmitting(false);
            setErrMsg("Failed to login! Please try again.")
        })

  };
    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/auth/google"; // Redirects to Google authentication route
  };
    const convertBase64ToBlob = (base64String) => {
        const base64WithoutPrefix = base64String.split(',')[1];
        const byteCharacters = atob(base64WithoutPrefix);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: 'image/jpeg' }); // Change type according to your base64 data
    }
  const loginWithFaceID = async (image) => {
        setErrMsg("")
        setIsSubmitting(true)
      const formData = new FormData();
      const blob = convertBase64ToBlob(image);
      const file = new File([blob], 'image.jpg', {type: 'image/jpeg'});
      formData.append("photo", file);
      handleLoginPicture(formData).then((res) => {
          setIsSubmitting(false)
          if(res?.data?.success){
              loginByUserID(res?.data?.name).then((res) => {
                  if(res.data.success){
                      const newData= {token: res?.data?.token, ...res?.data?.user};
                      dispatch(UserLogin(newData));
                      window.location.replace("/")
                  }else{
                      setErrMsg(res?.data?.message)
                  }
              })
          }else{
              setErrMsg("FaceID not recognized! Please try again.")
          }
      }).catch(err => {
          setErrMsg("FaceID not recognized! Please try again.")
          setIsSubmitting(false)
      })
  }
  return (
    <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
      <div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl'>
        {/* LEFT */}
        <div className='w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center '>
          <div className='w-full flex gap-2 items-center mb-6'>
          <div className='p-1 md:p-2  rounded text-white'>
        <img
              src={logo}
              alt='Bg Image'
              className='w-14 h-14 object-cover rounded'
            />
        </div>
            <span className='text-2xl text-[#D00000] font-semibold'>
              Esprit
            </span>
          </div>

          <p className='text-ascent-1 text-base font-semibold'>
            Log in to your account
          </p>
          <span className='text-sm mt-2 text-ascent-2'>Welcome back</span>

            {faceID ? <><Webcam
                audio={false}
                height={720}
                screenshotFormat="image/jpeg"
                width={1280}
                videoConstraints={videoConstraints}
            >
                {({getScreenshot}) => (
                    !isSubmitting && <CustomButton
                        onClick={() => {
                            const imageSrc = getScreenshot()
                            loginWithFaceID(imageSrc)
                            // setImage(imageSrc)
                        }}
                        containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                        title='Login with FaceID'
                    />

                )}
            </Webcam>
                {!isSubmitting && <CustomButton
                    onClick={() => {
                        setFaceID(false)
                    }}
                    containerStyles={` mt-3 inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                    title='Back to Login Fields'
                />}</> : <><form
                className='py-8 flex flex-col gap-5='
                onSubmit={handleSubmit(onSubmit)}
            >
                <TextInput
                    name='email'
                    placeholder='email@example.com'
                    label='Email Address'
                    type='email'
                    register={register("email", {
                        required: "Email Address is required",
                    })}
                    styles='w-full rounded-full'
                    labelStyle='ml-2'
                    error={errors.email ? errors.email.message : ""}
                />

                <TextInput
                    name='password'
                    label='Password'
                    placeholder='Password'
                    type='password'
                    styles='w-full rounded-full'
                    labelStyle='ml-2'
                    register={register("password", {
                        required: "Password is required!",
                    })}
                    error={errors.password ? errors.password?.message : ""}
                />

                <Link
                    to='/reset-password'
                    className='text-sm text-right text-blue font-semibold'
                >
                    Forgot Password ?
                </Link>

                {!isSubmitting &&
                    <CustomButton
                        type='submit'
                        containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                        title='Login'
                    />
                }
                {/* New Google authentication button */}</form>
            {!isSubmitting && <>
                <GoogleButtom
                    type='submit'
                    containerStyles={`inline-flex justify-center rounded-md googleColor px-8 py-3 text-sm font-medium text-white outline-none`}
                    onClick={handleGoogleLogin}

                    title=' Login with Google'
                />
                <CustomButton
                    type='submit'
                    containerStyles={`inline-flex justify-center rounded-md faceIDColor px-8 py-3 text-sm font-medium text-white outline-none mt-4`}
                    onClick={() => setFaceID(true)}

                    title=' Login with FaceID'
                />
            </>}</>}


            {isSubmitting ? <Loading/> : null}
            {errMsg && errMsg.length !== 0 && (
                <span
                    className={`text-sm text-[#f64949fe] mt-0.5`}
                >
                {errMsg}
              </span>
            )}
            <p className='text-ascent-2 text-sm text-center'>
                Don't have an account?
                <Link
                    to='/register'
                    className='text-[#D00000] font-semibold ml-2 cursor-pointer'
                >
                    Create Account
                </Link>
            </p>
        </div>
          {/* RIGHT */}
          <div className='hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-customColor'>
              <div className='relative w-full flex items-center justify-center'>
                  <img
                      src={BgImage}
                      alt='Bg Image'
                      className='w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover'
                  />

                  <div className='absolute flex items-center gap-1 bg-white right-10 top-10 py-2 px-5 rounded-full'>
                      <BsShare size={14}/>
                      <span className='text-xs font-medium'>Share</span>
                  </div>

                  <div className='absolute flex items-center gap-1 bg-white left-10 top-6 py-2 px-5 rounded-full'>
                      <ImConnection/>
                      <span className='text-xs font-medium'>Connect</span>
                  </div>

                  <div className='absolute flex items-center gap-1 bg-white left-12 bottom-6 py-2 px-5 rounded-full'>
                  <AiOutlineInteraction />
              <span className='text-xs font-medium'>Interact</span>
            </div>
          </div>

          <div className='mt-16 text-center'>
            <p className='text-white text-base'>
              Connect with friedns & have share for fun
            </p>
            <span className='text-sm text-white/80'>
              Share memories with friends and the world.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;