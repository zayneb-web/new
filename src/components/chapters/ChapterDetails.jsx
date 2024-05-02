import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const ChapterDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [videos, setVideos] = useState([]);

  // Utilisation de useEffect pour charger les vidéos depuis le localStorage lors du chargement initial du composant
  useEffect(() => {
    const storedVideos = localStorage.getItem("videos");
    if (storedVideos) {
      setVideos(JSON.parse(storedVideos));
    }
  }, []);

  // Fonction pour sauvegarder les vidéos dans le localStorage
  const saveVideosToLocalStorage = (videos) => {
    localStorage.setItem("videos", JSON.stringify(videos));
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const addVideo = (videoData) => {
    const newVideos = [...videos, videoData];
    setVideos(newVideos);
    // Sauvegarder les nouvelles vidéos dans le localStorage
    saveVideosToLocalStorage(newVideos);
  };

  const deleteVideo = (index) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);
    // Sauvegarder les vidéos mises à jour dans le localStorage
    saveVideosToLocalStorage(newVideos);
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="card col-span-9 p-4">
        <h2 className="text-xl font-bold mb-2">Video Title</h2>
        {videos.length > 0 && (
          <iframe
            className="w-full"
            height="315"
            src={`https://www.youtube.com/embed/${videos[0].link}`}
            title={videos[0].title}
            allowFullScreen
          ></iframe>
        )}
        <p className="text-gray-600 mt-2">Video description goes here.</p>
      </div>
      <div className="card col-span-3 p-4">
        <button
          onClick={openModal}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Add Video
        </button>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
              <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                <div className="px-6 py-4">
                  <h1 className="text-lg font-bold mb-2">Add Video</h1>
                  <form>
                    <div className="mb-4">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Video Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                        Video Link
                      </label>
                      <input
                        type="text"
                        id="link"
                        name="link"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Video Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows="3"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                      ></textarea>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        onClick={() => {
                          addVideo({
                            title: document.getElementById("title").value,
                            link: document.getElementById("link").value,
                            description: document.getElementById("description").value
                          });
                          closeModal();
                        }}
                        className="ml-2 bg-green-500 text-white font-bold py-2 px-4 rounded"
                      >
                        Add
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Afficher la liste des vidéos */}
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">List of Videos</h2>
          {videos.map((video, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">{video.title}</h3>
                <button
                  onClick={() => deleteVideo(index)}
                  className="text-red-500 font-bold"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              <p className="text-gray-600">{video.description}</p>
              <iframe
                className="w-full mt-2"
                height="200"
                src={`https://www.youtube.com/embed/${video.link}`}
                title={video.title}
                allowFullScreen
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChapterDetails;
