import React from "react";
import { NothingImagee } from "../../assets";


const NothingHere = () => {
  return (
    <div
      className="flex flex-col items-center justify-center 
        text-red-600 w-full h-full"
    >
      <img src={NothingImagee} alt="" />
      <h1 className="text-inherit">Nothing here!</h1>
    </div>
  );
};

export default NothingHere;