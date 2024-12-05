import { useState } from "react";
import StudentForm from "./StudentForm";
import StaffForm from "./StaffForm";
import { Container, Typography, Tabs, Tab, Box } from "@mui/material";

export default function TabbedForm() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Grievance Portal
      </Typography>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Student" />
        <Tab label="Staff" />
      </Tabs>
      <Box sx={{ marginTop: 2 }}>
        {activeTab === 0 && <StudentForm />}
        {activeTab === 1 && <StaffForm />}
      </Box>
    </Container>
  );
}
