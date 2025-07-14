import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState("");
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

        const response = await fetch("https://kapitanlands-8xjj.onrender.com/api/v1/expenses", {
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
        setExpenses(data.data);
        setFilteredExpenses(data.data); // Initialize filtered expenses with all data
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

  const handleDateFilterChange = (e) => {
    setFilterDate(e.target.value);
  };

  const applyDateFilter = () => {
    if (!filterDate) {
      toast.warning("Please select a date");
      return;
    }

    const filtered = expenses.filter(expense => {
      const expenseDate = new Date(expense.createdAt).toISOString().split('T')[0];
      return expenseDate === filterDate;
    });

    setFilteredExpenses(filtered);
  };

  const resetDateFilter = () => {
    setFilterDate("");
    setFilteredExpenses(expenses);
  };

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
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="card-title mb-0">All Expenses</h4>
        <a href="/add-expense" type="button" className="btn btn-primary">
          Add Expense
        </a>
      </div>
      <div className="card-body">
        {/* Single Date Filter Section */}
        <div className="row mb-4">
          <div className="col-md-4">
            <label className="form-label">Filter by Date</label>
            <input
              type="date"
              className="form-control"
              value={filterDate}
              onChange={handleDateFilterChange}
            />
          </div>
          <div className="col-md-8 d-flex align-items-end">
            <button 
              className="btn btn-primary me-2"
              onClick={applyDateFilter}
            >
              Filter
            </button>
            <button 
              className="btn btn-secondary"
              onClick={resetDateFilter}
            >
              Show All
            </button>
          </div>
        </div>

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
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
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
                    <td>{formatCurrency(expense.amount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    {expenses.length === 0 ? "No expenses found" : "No expenses for selected date"}
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