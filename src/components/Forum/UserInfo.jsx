import React from "react";
import Comment from "../../icons/Comment";
import moment from "moment";
import { NoProfile } from "../../assets";

const UserInfo = ({ openId, index, setOpenId, question, answer }) => {

  const currentUser = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="w-full flex items-center justify-between">
      <div className="w-[48%] md:max-w-screen-md posted-by flex items-center gap-2 md:gap-3">
      
        <h2 className="text-gray-300 text-xs " style={{ fontWeight: 'bold', marginBottom: '3px' }}>
          {answer ? "answered by\n" : "posted by "}{" "}
          <span className="text-red-800 font-bold md:text-sm">
            {question
              ? question?.author?.firstName === currentUser?.firstName
                ? question?.author?.firstName + " (You)"
                : question?.author?.firstName
              : answer
              ? answer?.author?.firstName === currentUser?.firstName
                ? answer?.author?.firstName + " (You)"
                : answer?.author?.firstName
              : ""}
          </span>
        </h2>
      </div>
      <div className="posted-on mx-auto">
        <h2 className="text-gray-300 text-xs">
          {question
            ? moment(question?.createdAt).fromNow()
            : moment(answer?.createdAt).fromNow()}
        </h2>
      </div>
      {openId && (
        <div
          className="comment flex gap-2 ml-auto cursor-pointer"
          onClick={() => {
            if (!openId.find((ele) => ele === index)) {
              console.log("hello");
              setOpenId([...openId, index]);
            }
            if (openId.find((ele) => ele === index)) {
              setOpenId(openId.filter((ele) => ele !== index));
            }
          }}
        >
          <Comment />
          <span className="text-gray-300 text-xs">
            {question?.replies?.length || "No replies"}
          </span>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
