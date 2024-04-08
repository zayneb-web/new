import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo,getUsers,deleteUser } from '../utils/api';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../components/TopBar';
import { SetUsers } from '../redux/userSlice';

const DashbordAdmin = () => {
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
      await deleteUser(userId, user?.token);
      // Refresh the user list after a user is deleted
      await fetchUsers();
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <TopBar />

      <div className="mx-auto max-w-5xl p-4">
        <h2 className="text-2xl font-bold mb-4">All Users</h2>
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
                        <th scope="col" className="px-6 py-4">FirstName</th>
                        <th scope="col" className="px-6 py-4">LastName</th>
                        <th scope="col" className="px-6 py-4">Email</th>
                        <th scope="col" className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {users.map((user, index) => (
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
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default DashbordAdmin;