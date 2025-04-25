import { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle null or undefined dates
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/rest/getallusers", {
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret",
          },
        });
        console.log("API Response:", response.data.users);
        setUsers(response.data.users);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-FFFDF7 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-gray-600">Manage all users in the system.</p>
        <div className="w-full h-0.5 bg-black bg-opacity-20 my-4"></div>

        {/* Display loading, error, or table */}
        {loading ? (
          <p className="text-teal-600 mt-4">Loading users...</p>
        ) : error ? (
          <p className="text-red-500 mt-4">{error}</p>
        ) : (
          <table className="w-full bg-white shadow-md rounded-lg mt-6 border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-teal-600 w-1/6">ID</th>
                <th className="px-4 py-2 text-left text-teal-600 w-2/6">Username</th>
                <th className="px-4 py-2 text-left text-teal-600 w-3/6">Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => (window.location.href = `/admin/users/${user.id}`)} // Redirect on row click
                >
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{formatDate(user.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Users;