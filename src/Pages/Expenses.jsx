import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You need to be logged in to view expenses");
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5001/api/v1/expenses", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setExpenses(data.data); // Assuming your API returns { success: true, data: [...] }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setError(error.message);
        setLoading(false);
        toast.error("Failed to load expenses");
      }
    };

    fetchExpenses();
  }, [navigate]);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-body text-center text-danger">
          <p>Error loading expenses: {error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">All Expenses</h4>
        <a href="/add-expense" type="button" className="btn btn-primary mb-2">
          Add Expense
        </a>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-responsive-md">
            <thead>
              <tr>
                <th><strong>Created At</strong></th>
                <th><strong>Expense Head</strong></th>
                <th><strong>Type</strong></th>
               
                <th><strong>Amount</strong></th>
              </tr>
            </thead>
            <tbody>
              {expenses.length > 0 ? (
                expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{formatDate(expense.createdAt)}</td>
                    <td>{expense.expenseHead}</td>
                    <td>
                      <span className={`badge ${
                        expense.transactionType === 'credit' 
                          ? 'badge-success' 
                          : 'badge-danger'
                      }`}>
                        {expense.transactionType}
                      </span>
                    </td>
                    {/* <td>{expense.quantity}</td>
                    <td>{formatCurrency(expense.rate)}</td> */}
                    <td>{formatCurrency(expense.amount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No expenses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Expenses;