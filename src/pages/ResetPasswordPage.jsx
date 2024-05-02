import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../components/Loading";
import TextInput from "../components/TextInput";
import CustomButton from "../components/CustomButton";
import { resetPassword } from "../utils/api";
import { Link, Navigate} from "react-router-dom";


const ResetPassword = ({ token }) => { // Assuming token is passed to the component
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUrl = window.location.pathname
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const handleResetSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      console.log("data : ",data)
      const res = await resetPassword(token, currentUrl.split('/')[3] || null, data.password);
      if (res?.status === "failed") {
        setErrMsg(res.message);
      } else {
        setIsSubmitting(false);
        // Password reset successfully
        setErrMsg("Password changed successfully");
        setInterval(()=>{
            window.location.replace("/login"); },2000);
      }
    } catch (error) {
      console.log(error);
      setErrMsg("Failed to reset password. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className='w-full h-[100vh] bg-bgColor flex items-center justify-center p-6'>
      <div className='bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg'>
        <p className='text-ascent-1 text-lg font-semibold'>Reset Password</p>

        <form onSubmit={handleSubmit(handleResetSubmit)} className='py-4 flex flex-col gap-5'>
        <div className='w-full flex flex-col lg:flex-row gap-1 md:gap-2'>
              <TextInput
                name='password'
                label='Password'
                placeholder='Password'
                type='password'
                styles='w-full'
                register={register("password", {
                  validate: (value) => {
                    if (value.length < 5) {
                      return "Password length should be greater or equal to 5 characters";
                    }
                  },
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password?.message : ""}
              />

              <TextInput
                label='Confirm Password'
                placeholder='Password'
                type='password'
                styles='w-full'
                register={register("cPassword", {
                  validate: (value) => {
                    const { password } = getValues();

                    if (password != value) {
                      return "Passwords do no match";
                    }
                  },
                })}
                error={
                  errors.cPassword && errors.cPassword.type === "validate"
                    ? errors.cPassword?.message
                    : ""
                }
              />
            </div>
          {errMsg && <span className='text-sm text-[#f64949fe] mt-0.5'>{errMsg}</span>}

          {isSubmitting ? (
            <Loading />
          ) : (<>
            <CustomButton
              type='submit'
              containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
              title='Save'
            />
            <Link
              to='/login'
              className='text-sm text-right text-blue font-semibold'
            >
              ➜ Back to Login
            </Link>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
