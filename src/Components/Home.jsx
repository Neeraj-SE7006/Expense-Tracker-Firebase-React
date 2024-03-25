import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../Context/AuthContext";
import { signOut, getAuth } from "firebase/auth";
import React, { useState, useEffect } from "react";
import "./Home.css";

const Home = () => {
  const { user } = useContext(Context);
  const auth = getAuth();
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [moneySpent, setMoneySpent] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editExpenseId, setEditExpenseId] = useState("");
  const [editMoneySpent, setEditMoneySpent] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchExpenses();
    }
  }, [user]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(
        `https://tracking-e4c01-default-rtdb.asia-southeast1.firebasedatabase.app/expense/${user.uid}.json`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
      const data = await response.json();
      const loadedExpenses = [];
      if (data) {
        for (const key in data) {
          loadedExpenses.push({
            id: key,
            moneySpent: data[key].moneySpent,
            description: data[key].description,
            category: data[key].category,
          });
        }
        setExpenses(loadedExpenses);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editMode) {
        await fetch(
          `https://tracking-e4c01-default-rtdb.asia-southeast1.firebasedatabase.app/expense/${user.uid}/${editExpenseId}.json`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              moneySpent: editMoneySpent,
              description: editDescription,
              category: editCategory,
            }),
          }
        );
        setEditMode(false);
        setEditExpenseId("");
        setEditMoneySpent("");
        setEditDescription("");
        setEditCategory("");
      } else {
        const newExpense = {
          moneySpent,
          description,
          category,
        };

        await fetch(
          `https://tracking-e4c01-default-rtdb.asia-southeast1.firebasedatabase.app/expense/${user.uid}.json`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newExpense),
          }
        );
        setMoneySpent("");
        setDescription("");
        setCategory("");
      }
      alert("Submitted");
      fetchExpenses();
    } catch {
      console.log("Failed to add/update expense");
      alert("Failed to add/update expense");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (expense) => {
    setEditMode(true);
    setEditExpenseId(expense.id);
    setEditMoneySpent(expense.moneySpent);
    setEditDescription(expense.description);
    setEditCategory(expense.category);
  };

  const deleteExpense = async (expenseId) => {
    try {
      const response = await fetch(
        `https://tracking-e4c01-default-rtdb.asia-southeast1.firebasedatabase.app/expense/${user.uid}/${expenseId}.json`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditExpenseId("");
    setEditMoneySpent("");
    setEditDescription("");
    setEditCategory("");
  };

  async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  }

  const isIncompleteProfile = !user.displayName || !user.photoURL;
  return (
    <>
      <div className="containerhome">
        {isIncompleteProfile && (
          <div className="profile-incomplete">
            Your profile is incomplete. Please complete your profile{" "}
            <Link to="/profile-update">here</Link>.
          </div>
        )}
        <h2 className="user">
          Welcome{" "}
          <span>{user.displayName ? user.displayName : user.email}!</span>
        </h2>
        <Link to="/profile-update">
          <button className="profile-update-btn">Edit Profile</button>
        </Link>
        <div className="expense-form">
          <h2
            style={{
              textAlign: "center",
              color: "black",
              border: "2px solid red",
              backgroundColor: "brown",
              width: "97%",
              height: "5vh",
            }}
          >
            Expense Tracker
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Money Spent"
              value={editMode ? editMoneySpent : moneySpent}
              onChange={(e) =>
                editMode
                  ? setEditMoneySpent(e.target.value)
                  : setMoneySpent(e.target.value)
              }
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={editMode ? editDescription : description}
              onChange={(e) =>
                editMode
                  ? setEditDescription(e.target.value)
                  : setDescription(e.target.value)
              }
              required
            />
            <select
              value={editMode ? editCategory : category}
              onChange={(e) =>
                editMode
                  ? setEditCategory(e.target.value)
                  : setCategory(e.target.value)
              }
              required
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Petrol">Petrol</option>
              <option value="Salary">Salary</option>
            </select>
            <button type="submit" disabled={loading}>
              {editMode ? "Update Expense" : "Add Expense"}
            </button>
            {editMode && (
              <button type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </form>
          <h3>Expenses:</h3>
          <ul>
            {expenses.map((expense, index) => (
              <li key={index}>
                <p>Money Spent: {expense.moneySpent}</p>
                <p>Description: {expense.description}</p>
                <p>Category: {expense.category}</p>
                <button onClick={() => handleEditClick(expense)}>Edit</button>
                <button onClick={() => deleteExpense(expense.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="sign-out">
        <Link to="/login">
          {user ? (
            <button onClick={handleSignOut}>Sign Out</button>
          ) : (
            <button>Signin</button>
          )}
        </Link>
      </div>
    </>
  );
};
export default Home;
