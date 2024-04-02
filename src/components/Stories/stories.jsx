import React from "react";
import Story from "./Story";
import "./style.css";

const Stories = () => {
  const stories = [
   
  { firstName :"Hadil",
  photo : "https://images.pexels.com/photos/16140935/pexels-photo-16140935/free-photo-of-cafe-tasse-cappuccino-expresso.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  story_photo:"https://images.pexels.com/photos/20405614/pexels-photo-20405614/free-photo-of-ville-mode-amour-gens.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  
},
{ firstName :"Ammar",
photo : "https://images.pexels.com/photos/16140935/pexels-photo-16140935/free-photo-of-cafe-tasse-cappuccino-expresso.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
story_photo:"https://images.pexels.com/photos/18764385/pexels-photo-18764385/free-photo-of-noir-et-blanc-ville-pont-trottoir.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"

},
];

  return (
    <div className="stories">
      <Story type="new" />
      {stories.map((story)=>(
        <Story type="old" data={story}/>
        )) }
    
    </div>
  );
};

export default Stories;