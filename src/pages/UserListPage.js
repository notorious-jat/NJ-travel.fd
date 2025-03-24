// src/pages/UserListPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import LeftMenu from "../components/LeftMenu";

// Styling for the page and the user cards
const UserListWrapper = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const CardListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
`;

const UserCard = styled.div`
  background: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 300px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
  }
`;

const CardTitle = styled.h3`
  font-size: 18px;
  color: #34495e;
`;

const CardContent = styled.p`
  color: #7f8c8d;
  font-size: 14px;
  margin: 5px 0;
`;

const Button = styled.button`
  background-color: #34495e;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #fff;
    color: #34495e;
  }
`;

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          let headers = { authorization: `Bearer ${token}` };
          const response = await axios.get("http://localhost:5001/api/auth/users", { headers });
          setUsers(response.data.data);
        } else {
          toast.error("You must be logged in to view this page.");
          navigate("/login");
        }
      } catch (error) {
        toast(error.response ? error.response.data.message : "Something went wrong");
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Error fetching users:", error);
        }
      }
    };
    fetchUsers();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        let headers = { authorization: `Bearer ${token}` };
        await axios.delete(`http://localhost:5001/api/auth/users/${id}`, { headers });
        setUsers(users.filter((user) => user._id !== id));
        toast.success("User deleted successfully!");
      } else {
        toast("Please login to delete user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      toast(error.response ? error.response.data.message : "Something went wrong");
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <>
      <LeftMenu>
        <UserListWrapper>
          <Title>User List</Title>
          {/* <Button onClick={() => navigate("/users/create")}>Add New User</Button> */}

          {/* Card View for Users */}
          <CardListWrapper>
            {users.map((user) => (
              <UserCard key={user._id}>
                <CardTitle>{user.username}</CardTitle>
                <CardContent>Email: {user.email}</CardContent>
                {/* <CardContent>Status: {user.isActive ? "Active" : "Inactive"}</CardContent> */}
                {/* <div>
                  <Button onClick={() => navigate(`/users/edit/${user._id}`)}>Edit</Button>
                  <Button onClick={() => handleDelete(user._id)} style={{ marginLeft: "10px" }}>
                    Delete
                  </Button>
                </div> */}
              </UserCard>
            ))}
          </CardListWrapper>
        </UserListWrapper>
      </LeftMenu>
    </>
  );
};

export default UserListPage;
