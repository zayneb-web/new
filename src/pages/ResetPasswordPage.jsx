import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "../components/CustomButton"
import TextInput from "../components/TextInput"
import Loading from "../components/Loading";
import { resetPassword } from "../utils/api";
const ResetPassword = ({ userId, token }) => {
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const handleResetSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const { password, confirmPassword } = data;
      if (password !== confirmPassword) {
        setErrMsg("Passwords do not match");
        setIsSubmitting(false);
        return;
      }

      const res = await resetPassword(userId, token, password);
      if (res?.status === "failed") {
        setErrMsg(res.message);
      } else {
        // Password reset successfully
        setErrMsg("Password changed successfully");
      }

      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      setErrMsg("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className='w-full h-[100vh] bg-bgColor flex items-center justify-center p-6'>
      <div className='bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg'>
        <p className='text-ascent-1 text-lg font-semibold'>Reset Password</p>

        <form onSubmit={handleSubmit(handleResetSubmit)} className='py-4 flex flex-col gap-5'>
          <TextInput
            name='password'
            placeholder='New Password'
            type='password'
            register={register("password", {
              required: "New Password is required!",
            })}
            styles='w-full rounded-lg'
            labelStyle='ml-2'
            error={errors.password ? errors.password.message : ""}
          />
          <TextInput
            name='confirmPassword'
            placeholder='Confirm Password'
            type='password'
            register={register("confirmPassword", {
              required: "Confirm Password is required!",
            })}
            styles='w-full rounded-lg'
            labelStyle='ml-2'
            error={errors.confirmPassword ? errors.confirmPassword.message : ""}
          />
          {errMsg && <span className='text-sm text-[#f64949fe] mt-0.5'>{errMsg}</span>}

          {isSubmitting ? (
            <Loading />
          ) : (
            <CustomButton
              type='submit'
              containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
              title='Save'
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;