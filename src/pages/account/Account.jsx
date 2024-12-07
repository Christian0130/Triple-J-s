import React, { useState, useEffect } from "react";
import "./account.css";
import Modal from '../../components/Modal';

const Account = () => {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const response = await fetch(`http://localhost:8081/api/users/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setUserData(data);
        } else {
          console.error("Error fetching user data:", data);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleEditButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSaveChanges = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch(`http://localhost:8081/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData); // Update user data state
        setIsModalOpen(false); // Close modal
        window.alert('Account Information Updated Successfully');
      } else {
        console.error("Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (!userData) {
    return <p className="load-data">Loading user data...</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.avatar}>{userData.name.charAt(0)}</div>
          <h1 style={styles.name}>{userData.name}</h1>
          <p style={styles.email}>{userData.email}</p>
        </div>
        <div style={styles.details}>
          <p>
            <strong>Username:</strong> {userData.username}
          </p>
          <p>
            <strong>Address:</strong> {userData.userAddress}
          </p>
        </div>
        <button style={styles.button} onClick={handleEditButtonClick}>
          Edit Account
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
            <h2>Edit Account</h2>
            <form onSubmit={handleSaveChanges} className="editAccount-form">
              <input
                type="text"
                placeholder="Name"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email Address"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Username"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
              />                            
              <input
                type="text"
                placeholder="Address"
                value={userData.userAddress}
                onChange={(e) =>
                  setUserData({ ...userData, userAddress: e.target.value })
                }
              />
              <button type="submit">Save Changes</button>
            </form>
        </Modal>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
  },
  card: {
    maxWidth: "400px",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    textAlign: "center",
  },
  header: {
    marginBottom: "20px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "2rem",
    margin: "0 auto 15px",
  },
  name: {
    margin: "0",
    fontSize: "1.8rem",
    color: "#333",
  },
  email: {
    margin: "5px 0",
    fontSize: "1rem",
    color: "#666",
  },
  details: {
    textAlign: "left",
    marginTop: "20px",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "300px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
  },
  input: {
    marginBottom: "10px",
    padding: "8px",
    width: "100%",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "space-between",
  },
};

export default Account;
