import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Box, TextField, Button } from "@mui/material";
import { getAllGreivances } from "../utils/firebaseFunctions";
import { Toaster, toast } from "react-hot-toast";
import TabbedSubmissionsList from "./TabbedSubmissionsList";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("isAdminAuthenticated");
    if (adminLoggedIn === "true") {
      setIsAuthenticated(true);
      fetchSubmissions();
    }
  }, []);

  const handlePasswordSubmit = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("isAdminAuthenticated", "true");
      fetchSubmissions();
      toast.success("Logged in successfully!");
    } else {
      toast.error("Invalid password");
    }
  };

  const changeFrom = (item) => {
    if (item.from !== "student") {
      item.from += " (" + item.staffType;
      if (item.staffType === "Out Source") {
        item.from += " - " + item.outSourceType;
      }
      item.from += ")";
      if (item.staffId) {
        item.from += " - " + item.staffId;
      }
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getAllGreivances();
      const formattedData = data.map((item) => {
        const createdDate = new Date(item.createdTime?.seconds * 1000);
        const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
        changeFrom(item);
        return { ...item, createdTime: timeAgo };
      });
      console.log(formattedData);
      setSubmissions(formattedData);
      setFilteredSubmissions(formattedData);
    } catch (error) {
      console.error("Error fetching grievances:", error);
    }
    setLoading(false);
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

  if (loading) {
    return <p style={{ fontfamily: "Roboto, sans-serif", textAlign: "center", margin: "30px" }}>Loading...</p>;
  }

  return (
    <Box>
      <Toaster toastOptions={{ style: { fontFamily: "Roboto, system-ui" } }} />
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
        <>
        <TextField
          label="Search Submissions"
          fullWidth
          value={search}
          onChange={handleSearchChange}
          sx={{ marginBottom: 2 }}
        />
        <TabbedSubmissionsList submissions={filteredSubmissions} />
        </>
      )}
    </Box>
  );
}
