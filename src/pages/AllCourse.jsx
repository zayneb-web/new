import React, { useEffect, useState } from 'react';
import Sidebar from '../components/courses/sidebar';
import TopBar from '../components/TopBar';
import { MdClose, MdDownload, MdEventAvailable, MdPayment } from 'react-icons/md';
import CourseCard from '../components/courses/CourseCard';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import axios from 'axios';
import Swal from 'sweetalert2';

const AllCourse = () => {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseImageUrl, setSelectedCourseImageUrl] = useState(null);
  const [searchedCourse, setSearchedCourse] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (selectedCourse) {
      fetchImage(selectedCourse.image).then(setSelectedCourseImageUrl);
    }
  }, [selectedCourse]);

  const checkout = () => {
    setIsPaid(true);
    fetch("http://localhost:5000/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify({
        items: [
          { id: 1, quantity: 40, price: selectedCourse.price, name: "shopping Cours" }
        ]
      })
    })
      .then(res => {
        if (res.ok) return res.json();
        return res.json().then(json => Promise.reject(json));
      })
      .then(({ url }) => {
        window.open(url, '_blank');
      })
      .catch(e => {
        console.log(e.error);
      });
  };
  
  const fetchImage = async (imageName) => {
    const response = await axios.get(
      `http://localhost:5000/uploads/${imageName}`,
      {
        responseType: 'blob',
      }
    );
    const blob = response.data;
    const objectUrl = URL.createObjectURL(blob);
    return objectUrl;
  };

  useEffect(() => {
    fetch('http://localhost:5000/course/getcourses')
      .then((response) => response.json())
      .then(async (data) => {
        const dataWithImages = await Promise.all(
          data.map(async (course) => {
            const image = await fetchImage(course.image);
            return {
              ...course,
              imageUrl: image,
            };
          })
        );
        setCourses(dataWithImages);
        setFilteredCourses(dataWithImages);
      })
      .catch((error) => console.error('Error fetching courses:', error));
  }, []);

  const selectCourse = (course) => {
    setSelectedCourse(course);
    openDialog();
  };

  const handleDownloadCourse = async (file) => {
    if (!isPaid) {
      // Show an alert if the user hasn't paid yet
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'You need to pay first to download the course!',
      });
      return;
    }
    const response = await axios.get(
      `http://localhost:5000/course/download/${file}`,
      {
        responseType: 'blob',
      }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file);
    document.body.appendChild(link);
    link.click();
  };

  const searchCourse = (search) => {
    setFilteredCourses(
      courses.filter((course) =>
        course.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  useEffect(() => {
    searchCourse(searchedCourse);
  }, [searchedCourse]);

  return (
    <>
      <TopBar />
      <div className="w-full min-h-screen bg-bgColor lg:rounded-lg overflow-hidden">   
        <div className="w-full flex gap-2 lg:gap-4 pt-2 h-full">
          <div className="hidden bg-white w-1/3 lg:w-1/4  md:flex flex-col  overflow-y-auto h-screen ">
            <Sidebar setSearchedCourse={setSearchedCourse} />
          </div>
          <div className="h-full">
            <ScrollArea className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" auto>
              {courses?.length === 0 ? (
                <div className="flex items-center justify-center h-[200px]">
                  <div className="bg-white p-8 rounded-lg flex flex-col items-center">
                    <p className="text-center text-gray text-lg mb-4">
                      No courses available at the moment. Check back later!
                    </p>
                    <MdEventAvailable className="text-4xl text-gray" />
                  </div>
                </div>
              ) : (
                filteredCourses?.map((course, index) => {
                  return (
                    <CourseCard
                      key={index}
                      course={course}
                      selectCourse={selectCourse}
                    />
                  );
                })
              )}
            </ScrollArea>
          </div>
        </div>
        {open && selectedCourse && (
          <div className="fixed inset-0 flex justify-center items-center bg-[#e5e7eb] bg-opacity-50 z-50 ">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <div className="mb-4 ">
                <h2 className="text-xl font-semibold">{selectedCourse.title}</h2>
                <img
                  src={selectedCourseImageUrl}
                  alt={selectedCourse.title}
                  className="mt-2 rounded-lg shadow-md  h-[250px] w-full object-cover"
                />
                <p className="text-[#6b7280] mt-2">
                  {selectedCourse.description}
                </p>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#6b7280]">Price:</span>
                <span className="text-lg font-semibold text-[#2563eb]">
                  ${selectedCourse.price}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCourse.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm bg-[#e5e7eb] text-[#374151] rounded-full px-2 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between">
                <button
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2 px-4 rounded transition-colors duration-300 flex justify-center items-center gap-2"
                  onClick={() => handleDownloadCourse(selectedCourse.file)}
                >
                  <MdDownload />
                  Download
                </button>
                <button
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2 px-4 rounded transition-colors duration-300 flex justify-center items-center gap-2"
                  onClick={checkout}
                >
                  <MdPayment />
                  Pay
                </button>
                <button
                  className="bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold py-2 px-4 rounded transition-colors duration-300 flex justify-center items-center gap-2"
                  onClick={closeDialog}
                >
                  <MdClose />
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllCourse;
