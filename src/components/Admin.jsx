import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { getAllGreivances } from "../utils/firebaseFunctions";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("isAdminAuthenticated");
    if (adminLoggedIn === "true") {
      setIsAuthenticated(true);
      fetchSubmissions();
    }
  }, []);

  const handlePasswordSubmit = () => {
    if (password === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem("isAdminAuthenticated", "true");
      fetchSubmissions();
    } else {
      alert("Invalid password");
    }
  };

  const fetchSubmissions = async () => {
    try {
      const data = await getAllGreivances();
      setSubmissions(data);
      setFilteredSubmissions(data);
    } catch (error) {
      console.error("Error fetching grievances:", error);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearch(value);
    const filtered = submissions.filter(
      (submission) =>
        submission.subject.toLowerCase().includes(value) ||
        submission.body.toLowerCase().includes(value) ||
        submission.from.toLowerCase().includes(value) ||
        submission.staffType.toLowerCase().includes(value)
    );
    setFilteredSubmissions(filtered);
  };

  return (
    <Box>
      {!isAuthenticated ? (
        <Box>
          <TextField
            label="Admin Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handlePasswordSubmit}
          >
            Submit
          </Button>
        </Box>
      ) : (
        <Box>
          <TextField
            label="Search Submissions"
            fullWidth
            value={search}
            onChange={handleSearchChange}
            sx={{ marginBottom: 2 }}
          />
          <List>
            {filteredSubmissions.map((submission) => (
              <ListItem key={submission.id}>
                <ListItemText
                  primary={submission.subject}
                  secondary={`From: ${submission.from}, Staff Type: ${submission.staffType}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}
