import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.png";

const EditRoomType = () => {
  const { hotel_id, type_id } = useParams(); // Get hotel_id and type_id from the URL
  const navigate = useNavigate();

  const [typeName, setTypeName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchRoomType = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/rest/getroomtypebyid", // REST API endpoint to fetch room type by ID
          {
            params: { type_id },
            headers: {
              "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
            },
          }
        );

        const roomType = response.data.room_types_by_pk;
        setTypeName(roomType.type_name);
        setDescription(roomType.description);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching room type:", err);
        setError("Failed to fetch room type. Please try again.");
        setLoading(false);
      }
    };

    fetchRoomType();
  }, [type_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/rest/updateroomtype", // REST API endpoint to update room type
        {
          type_id: parseInt(type_id),
          type_name: typeName,
          description: description,
        },
        {
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret", // Replace with your actual admin secret
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Room type updated successfully!");
      setError(null);

      // Redirect back to the Hotel Details page after 2 seconds
      setTimeout(() => navigate(`/admin/hotels/${hotel_id}`), 2000);
    } catch (err) {
      console.error("Error updating room type:", err.response?.data || err.message);
      setError("Failed to update room type. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-FFFDF7">
      <button
        onClick={() => navigate(-1)} // Navigate back to the previous page
        className="flex items-center space-x-2 mb-4"
      >
        <img src={backIcon} alt="Back" />
        <span className="hover:underline">Back</span>
      </button>

      <h1 className="text-2xl font-bold text-teal-600 mb-4">Edit Room Type</h1>

      {loading ? (
        <p>Loading room type details...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="typeName" className="block text-sm font-medium text-gray-700">
              Room Type Name
            </label>
            <input
              type="text"
              id="typeName"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default EditRoomType;