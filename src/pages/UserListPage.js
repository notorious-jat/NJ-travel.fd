import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import LeftMenu from "../components/LeftMenu";

// Styling for the page
const UserListWrapper = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const FilterWrapper = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TabWrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => (props.active ? "#34495e" : "#ecf0f1")};
  color: ${(props) => (props.active ? "white" : "#34495e")};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #34495e;
    color: white;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background-color: #34495e;
  color: white;
  padding: 10px;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f2f2f2;
  }
`;

const Button = styled.button`
  background-color: #34495e;
  color: white;
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
  const [searchName, setSearchName] = useState(""); // Filter for username
  const [searchEmail, setSearchEmail] = useState(""); // Filter for email
  const [roleFilter, setRoleFilter] = useState("user"); // Default to 'user' role
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

  // Memoized filter for optimized performance
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesName = user.username.toLowerCase().includes(searchName.toLowerCase());
      const matchesEmail = user.email.toLowerCase().includes(searchEmail.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      
      return matchesName && matchesEmail && matchesRole;
    });
  }, [users, searchName, searchEmail, roleFilter]);

  return (
    <>
      <LeftMenu>
        <UserListWrapper>
          <Title>User List</Title>

          {/* Search Filters */}
          <FilterWrapper>
            <Input
              type="text"
              placeholder="Search by Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Search by Email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </FilterWrapper>

          {/* Role Filters (Tabs) */}
          <TabWrapper>
            <TabButton active={roleFilter === "all"} onClick={() => setRoleFilter("all")}>
              All
            </TabButton>
            <TabButton active={roleFilter === "user"} onClick={() => setRoleFilter("user")}>
              User
            </TabButton>
            <TabButton active={roleFilter === "vendor"} onClick={() => setRoleFilter("vendor")}>
              Vendor
            </TabButton>
            <TabButton active={roleFilter === "admin"} onClick={() => setRoleFilter("admin")}>
              Admin
            </TabButton>
          </TabWrapper>

          {/* Table View for Users */}
          <Table>
            <thead>
              <tr>
                <TableHeader>Username</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Created At</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  {/* <TableCell>
                    <Button onClick={() => navigate(`/users/edit/${user._id}`)}>Edit</Button>
                    <Button
                      onClick={() => {
                        // Handle delete functionality here
                        // handleDelete(user._id);
                      }}
                      style={{ marginLeft: "10px" }}
                    >
                      Delete
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </tbody>
          </Table>
        </UserListWrapper>
      </LeftMenu>
    </>
  );
};

export default UserListPage;
