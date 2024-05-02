import React, { useState } from 'react';
import AudioTimer from './AudioTimer';
import { ReactMic } from 'react-mic';
import ReactPlayer from 'react-player';

const VocalMessage = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [voice, setVoice] = useState(false);
    const [recordBlobLink, setRecordBlobLink] = useState('');

    const onStop = (recordedBlob) => {
        console.log("Blob URL set:", recordedBlob.blobURL);
        setRecordBlobLink(recordedBlob.blobURL);
        setIsRunning(false);
    };

    const startHandle = () => {
        setElapsedTime(0);
        setIsRunning(true);
        setVoice(true);
    };
    
    const stopHandle = () => {
        setIsRunning(false);
        setVoice(false);
    };

    const clearHandle = () => {
        setIsRunning(false);
        setVoice(false);
        setRecordBlobLink('');
        setElapsedTime(0);
    };

    console.log("Record Blob Link:", recordBlobLink);

    return (
        <div>
            <div>
              
            </div>
            <div className="max-w-sm border py-4 px-6 mx-auto">
        
                <AudioTimer
                    isRunning={isRunning}
                    elapsedTime={elapsedTime}
                    setElapsedTime={setElapsedTime}
                />
                <div className="flex items-center">
                    {/* Conditional rendering for start and stop buttons */}
                    {!voice ? (
                        <button onClick={startHandle} className="mr-4 bg-fff text-111 rounded-md py-1 px-3 font-semibold text-16px">Start</button>
                    ) : (
                        <button onClick={stopHandle} className="mr-4 bg-fff text-111 rounded-md py-1 px-3 font-semibold text-16px">Stop</button>
                    )}
                    <div style={{ position: 'relative', borderRadius: '25px', overflow: 'hidden' }}>
                        <ReactMic
                            record={voice}
                            className="w-full"
                            onStop={onStop}
                            strokeColor="#0a0a0a"
                            backgroundColor="#a6a2a2" 
                        />
                    </div>
                </div>
                <div className="">
                    <button onClick={clearHandle} className="text-fff font-medium text-16px">Clear</button>
                </div>
                <div className="mt-2">
                    {recordBlobLink && (
                        <div className="mt-6">
                            <ReactPlayer url={recordBlobLink} controls />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VocalMessage;
