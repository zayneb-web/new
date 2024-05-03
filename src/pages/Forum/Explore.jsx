import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopBar from '../../components/TopBar';

const Explore = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:5000/forum/tags');
        setTags(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTags();
  }, []);

  const navigateToTopic = async (topic) => {
    try {
      const response = await axios.get(`http://localhost:5000/forum/find/${topic}`);
      // Vous pouvez gérer les données de réponse ici, par exemple, les stocker dans un état
      console.log('Questions basées sur le sujet:', response.data);
      // Naviguez vers la page d'exploration du sujet
      window.location.href = `/explore/${topic.toLowerCase()}`;
    } catch (error) {
      console.error('Erreur lors de la récupération des questions par sujet:', error);
    }
  };

  return (
    <>
      <TopBar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full md:w-[50%] text-center mt-8">
          <h1 className="text-xl text-gray-800 dark:text-white">Select A Topic To Explore</h1>
          <div className="grid grid-cols-3 md:grid-cols-4 mt-3 items-center">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center cursor-pointer gap-2 m-3 text-start"
                onClick={() => navigateToTopic(tag)}
              >
                <div className="h-2 md:w-4 w-2 md:h-4 rounded-full bg-blue-500"></div>
                <h3 className="text-xs">{tag}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Explore;
