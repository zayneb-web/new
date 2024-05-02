import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, getUsers, deleteUser } from '../utils/api';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/admin/Navbar';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import userImg from '../assets/userrr.png'; // Import the image
import Swal from "sweetalert2";


import img2 from '../assets/aaaaa.jpg'; // Import the image

import aaz from '../assets/asa.png'; // Import the image
import mmm from '../assets/mmm.png'; // Import the image
import nnn from '../assets/nnn.png'; // Import the image



const DashboardAdmin = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const users = useSelector((state) => state.user.users);
  const [userInfo, setUserInfo] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await getUserInfo(user?.token, id);
        setUserInfo(userData);
        await fetchUsers(); // No need to pass currentPage anymore
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, id, user?.token]); // Removed currentPage from dependency array

  const fetchUsers = async () => {
    try {
      setLoading(true);
      await getUsers(user?.token, dispatch); // No need to pass page anymore
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteUser(userId, user?.token);
          // Refresh the user list after a user is deleted
          await fetchUsers();
          Swal.fire(
            'Deleted!',
            'Your user has been deleted.',
            'success'
          );
        }
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      Swal.fire(
        'Error!',
        'There was an error deleting the user.',
        'error'
      );
    }
  };
  return (
    <div style={{ backgroundImage: `url(${img2})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
      <Navbar />
      <SideNav style={{ height: '100%', marginRight: '20px' }} onSelect={(selected) => {}}>
        <Toggle />
        <Nav defaultSelected="home">
          <NavItem eventKey="home">
            <NavIcon><i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} /></NavIcon>
            <NavText style={{ fontWeight: 'bold' }}>Home</NavText>
          </NavItem>
          <NavItem eventKey="charts">
            <NavIcon><i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} /></NavIcon>
            <NavText style={{ fontWeight: 'bold' }}>Charts</NavText>
            <NavItem eventKey="charts/linechart">
              <NavText style={{ fontWeight: 'bold' }}>Line Chart</NavText>
            </NavItem>
            <NavItem eventKey="charts/barchart">
              <NavText style={{ fontWeight: 'bold' }}>Bar Chart</NavText>
            </NavItem>
          </NavItem>
        </Nav>
      </SideNav>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img src={aaz} alt="User" style={{ maxWidth: '200px', maxHeight: '100px', marginRight: '20px' }} />
   
  </div>
</div>


      <div className="mx-auto max-w-5xl p-4">
        <h2 className="text-2xl font-bold mb-4" style={{ fontWeight: 'bold' }}>All Users</h2>
        {loading ? (
          <p>Loading users...</p>
        ) : users.length > 0 ? (
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-center text-sm font-light">
                    <thead className="border dark:bg-neutral-900">
                      <tr>
                        <th scope="col" className="px-6 py-4" style={{ fontWeight: 'bold' }}>FirstName</th>
                        <th scope="col" className="px-6 py-4" style={{ fontWeight: 'bold' }}>LastName</th>
                        <th scope="col" className="px-6 py-4" style={{ fontWeight: 'bold' }}>Email</th>
                        <th scope="col" className="px-6 py-4" style={{ fontWeight: 'bold' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {users.map((user) => (
                        <tr key={user._id} className="border-b dark:border-neutral-500">
                          <td className="whitespace-nowrap px-6 py-4">{user.firstName}</td>
                          <td className="whitespace-nowrap px-6 py-4">{user.lastName}</td>
                          <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <button className="bg-customColor hover:bg-red-600 text-white py-1 px-3 rounded" onClick={() => handleDelete(user._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p style={{ fontWeight: 'bold' }}>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardAdmin;
