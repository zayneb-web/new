import React from "react"
import { FaFontAwesome, FaPlus } from "react-icons/fa"
import "./style.css"
const Story = (props)=>{
    const {type,data} = props
    return(
        <>
        {
            type == "new" ?(
            <div className="story new">
            <FaPlus  className="addIcon"/>    
            <span>Add Story</span>
                </div>
    ):(
            <div className="story old" style={{ backgroundImage:`url(${data.story_photo})`,
            backgroundSize:"cover"}}>
                <div className="user-details">
                    <img src={data.photo}/>
                    </div>
                <h3>{data.firstName}</h3>
               
            </div>
        )}
       
        </>
    )
}
export default Story