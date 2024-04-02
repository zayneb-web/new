import React from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const RoomPage = () => {
  const { roomId } = useParams();
  console.log("RoomPage rendered with roomId:", roomId);

  const myMeeting = async (element) => {
    const appID= 171747540;
    const serverSecret="a29aefa3248f96ce8425cc995236caa9";
    const KitToken= ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID, 
      serverSecret, 
      roomId, 
      Date.now().toString(), 
      "sonia chalouah");

      const zc = ZegoUIKitPrebuilt.create(KitToken);
      zc.joinRoom({
        container: element,
        sharedLinks:[
          {
            name:'Copy Link',
            url:`http//localhost:/3000/room/${roomId}`,
          }
        ],
        scenario:{
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: true,
      });
    };

  return ( 
   <div>
    <div ref={myMeeting}/>
   </div>
 
  )

  
};

export default RoomPage;