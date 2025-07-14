import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddExpense = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    expenseHead: "",
    transactionType: "",
    amount: "",
    quantity: 1,
    rate: 1,
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You need to be logged in to add an expense");
      navigate("/login");
      return;
    }

    try {
      // Convert numeric fields to numbers
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        quantity: parseFloat(formData.quantity),
        rate: parseFloat(formData.rate),
        uploadedBy: "user", // You might want to get this from user data
      };

      // Changed from axios to fetch
      const response = await fetch("https://kapitanlands-8xjj.onrender.com/api/v1/expenses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add expense");
      }

      const responseData = await response.json();
      toast.success("Expense added successfully!");
      navigate("/all-expenses"); // Redirect to expenses list
    } catch (error) {
      console.error("Error adding expense:", error);
      const errorMessage = error.message || "Failed to add expense";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-xl-12 col-lg-12">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Add Expense</h4>
        </div>
        <div className="card-body">
          <div className="basic-form">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label">Expense Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Expense Head"
                    name="expenseHead"
                    value={formData.expenseHead}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label">Choose Debit / Credit</label>
                  <select
                    className="default-select form-control wide"
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select One</option>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </select>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                {/* <div className="mb-3 col-md-6">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label">Rate</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Rate"
                    name="rate"
                    value={formData.rate}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div> */}
                <div className="mb-3 col-md-6">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;