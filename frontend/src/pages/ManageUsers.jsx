import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../config/api";

export default function ManageUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await axios.get(`${API}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load users.");
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${API}/users/${id}`
      );

      toast.success(response.data.message);

      loadUsers();

    } catch (error) {

      console.error(error);

      toast.error("Unable to delete user.");

    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          Manage Users
        </h1>

        <button
          onClick={() => navigate("/admin")}
          className="bg-indigo-600 text-white px-5 py-3 rounded-lg"
        >
          Back
        </button>

      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">

        <div className="flex justify-between items-center">

          <h2 className="text-2xl font-semibold">
            Total Users : {users.length}
          </h2>

          <input
            type="text"
            placeholder="Search User..."
            className="border rounded-lg p-3 w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">

        <table className="w-full">

          <thead className="bg-indigo-600 text-white">

            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Username</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">City</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Action</th>
            </tr>

          </thead>

          <tbody>

            {filteredUsers.map((user) => (

              <tr
                key={user.id}
                className="border-b hover:bg-gray-100"
              >

                <td className="p-4">{user.id}</td>
                <td className="p-4">{user.full_name}</td>
                <td className="p-4">{user.username}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.phone}</td>
                <td className="p-4">{user.city}</td>
                <td className="p-4">{user.joined}</td>

                <td className="p-4">

                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}