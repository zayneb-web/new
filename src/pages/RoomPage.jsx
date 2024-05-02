import React from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import './RoomPage.css'; // Importer le fichier CSS pour les styles

const RoomPage = () => {
  const { roomId } = useParams();
  console.log("RoomPage rendered with roomId:", roomId);

  const myMeeting = async (element) => {
    const appID = 1652985969;
    const serverSecret = "5121df0be0b700193e6a6413adb7ade1";
    const KitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      "sonia chalouah"
    );

    const zc = ZegoUIKitPrebuilt.create(KitToken);
    zc.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: 'Copy Link',
          url: `http//localhost:/3000/room/${roomId}`,
        }
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: true,
    });
  };

  return (
    <div className="meet">
      <div ref={myMeeting} />
    </div>
  )
};

export default RoomPage;
