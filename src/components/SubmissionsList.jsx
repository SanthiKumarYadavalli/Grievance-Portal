/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from "@mui/material";


export default function SubmissionsList({submissions}) {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleListItemClick = (article) => {
    setSelectedSubmission(article);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSubmission(null);
  };

  return (
    <Box>
      <List>
        {submissions.map((submission) => (
          <ListItem
            key={submission.id}
            button
            onClick={() => handleListItemClick(submission)}
            style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}
          >
            <ListItemText
              primary={submission.subject}
              secondary={
                <div>
                  <p>
                    {submission.body.length > 100
                      ? `${submission.body.substring(0, 70)}...`
                      : submission.body}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      fontStyle: "italic",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{submission.from}</span>
                    <span>{submission.createdTime}</span>
                  </div>
                </div>
              }
            />
          </ListItem>
        ))}
      </List>
      {/* Dialog for displaying the full article */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedSubmission?.subject}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" style={{ marginBottom: "10px" }}>
            {selectedSubmission?.body}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {selectedSubmission?.createdTime} | {selectedSubmission?.from}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
