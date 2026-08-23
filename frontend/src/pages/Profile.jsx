import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import API from "../config/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(storedUser);

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${API}/profile`,
        {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          city: user.city,
        }
      );

      toast.success(response.data.message);

      localStorage.setItem("user", JSON.stringify(user));

      setEditing(false);

    } catch (error) {

      console.error(error);

      toast.error("Failed to update profile");

    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar />

      <div className="flex-1 md:ml-64">

        <Navbar />

        <main className="p-5 pb-24 sm:p-8 lg:p-10 md:pb-10">

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-6 sm:p-10">

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">

              <div className="w-28 h-28 rounded-full bg-purple-600 text-white flex items-center justify-center text-5xl font-bold">
                {user.full_name?.charAt(0).toUpperCase()}
              </div>

              <div>

                <h1 className="text-4xl font-bold">
                  {user.full_name}
                </h1>

                <p className="text-gray-500">
                  @{user.username}
                </p>

              </div>

            </div>

            <hr className="my-8" />

            <div className="grid md:grid-cols-2 gap-8">

              <div>

                <label className="font-semibold">
                  Full Name
                </label>

                <input
                  className="w-full border rounded-lg p-3 mt-2"
                  value={user.full_name}
                  disabled={!editing}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      full_name: e.target.value,
                    })
                  }
                />

              </div>

              <div>

                <label className="font-semibold">
                  Email
                </label>

                <input
                  className="w-full border rounded-lg p-3 mt-2"
                  value={user.email}
                  disabled={!editing}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      email: e.target.value,
                    })
                  }
                />

              </div>

              <div>

                <label className="font-semibold">
                  Phone
                </label>

                <input
                  className="w-full border rounded-lg p-3 mt-2"
                  value={user.phone}
                  disabled={!editing}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      phone: e.target.value,
                    })
                  }
                />

              </div>

              <div>

                <label className="font-semibold">
                  City
                </label>

                <input
                  className="w-full border rounded-lg p-3 mt-2"
                  value={user.city}
                  disabled={!editing}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      city: e.target.value,
                    })
                  }
                />

              </div>

              <div>

                <label className="font-semibold">
                  Joined
                </label>

                <input
                  className="w-full border rounded-lg p-3 mt-2 bg-gray-100"
                  value={user.joined}
                  disabled
                />

              </div>

            </div>

            <div className="mt-10 flex gap-4">

              {!editing ? (

                <button
                  onClick={() => setEditing(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl"
                >
                  Edit Profile
                </button>

              ) : (

                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl"
                >
                  Save Changes
                </button>

              )}

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}
