import { useState, useEffect } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getAllGreivances } from "../utils/firebaseFunctions";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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
      const formattedData = data.map((item) => {
        const createdDate = new Date(item.createdTime?.seconds * 1000);
        const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
        return { ...item, createdTime: timeAgo };
      });
      console.log(formattedData);
      setSubmissions(formattedData);
      setFilteredSubmissions(formattedData);
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

  const handleListItemClick = (submission) => {
    setSelectedSubmission(submission);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSubmission(null);
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
              <ListItem
                key={submission.id}
                button
                onClick={() => handleListItemClick(submission)}
              >
                <ListItemText
                  primary={submission.subject}
                  secondary={`From: ${submission.from}, Staff Type: ${submission.staffType}, Created: ${submission.createdTime}`}
                />
              </ListItem>
            ))}
          </List>
          {selectedSubmission && (
            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth>
              <DialogTitle>
                {selectedSubmission.subject}
                <IconButton
                  aria-label="close"
                  onClick={handleCloseDialog}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                <Typography variant="body1" gutterBottom>
                  <strong>Body:</strong> {selectedSubmission.body}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>From:</strong> {selectedSubmission.from}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Staff Type:</strong> {selectedSubmission.staffType}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Created:</strong> {selectedSubmission.createdTime}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Box>
      )}
    </Box>
  );
}
