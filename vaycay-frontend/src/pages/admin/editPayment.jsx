import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.png";

const EditPayment = () => {
  const { hotel_id, payment_id } = useParams();
  const navigate = useNavigate();

  const [paymentData, setPaymentData] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/rest/getpaymentbyid", {
          params: { payment_id },
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret",
          },
        });
  
        console.log("Payment data fetched:", response.data);
  
        const payment = response.data.payments_by_pk; // Access the correct object
  
        if (!payment) {
          setError("Payment data not found.");
          return;
        }
  
        setPaymentData(payment);
        setAmount(payment.amount);
        setPaymentStatus(payment.payment_status);
        setPaymentMethod(payment.payment_method);
      } catch (err) {
        console.error("Error fetching payment data:", err.response?.data || err.message);
        setError("Failed to load payment data. Please try again later.");
      }
    };
  
    fetchPaymentData();
  }, [payment_id]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/rest/updatepayment",
        {
          payment_id,
          amount,
          payment_status: paymentStatus,
          payment_method: paymentMethod,
        },
        {
          headers: {
            "x-hasura-admin-secret": "supersecureadminsecret",
            "Content-Type": "application/json",
          },
        }
      );

      alert("Payment updated successfully.");
      navigate(`/admin/hotels/${hotel_id}`);
    } catch (err) {
      console.error("Error updating payment:", err.response?.data || err.message);
      alert("Failed to update payment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-FFFDF7">
      <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 mb-4"
            >
              <img src={backIcon} alt="Back" />
              <span className="hover:underline">Back</span>
            </button>
      <h1 className="text-2xl font-bold text-teal-600 mb-4">Edit Payment</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : paymentData ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">
              Payment Status
            </label>
            <input
              type="text"
              id="paymentStatus"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <input
              type="text"
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <p>Loading payment data...</p>
      )}
    </div>
  );
};

export default EditPayment;