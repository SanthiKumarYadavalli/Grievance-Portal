import { useState } from "react";
import StudentForm from "./StudentForm";
import StaffForm from "./StaffForm";
import Admin from "./Admin";
import { Container, Typography, Tabs, Tab, Box } from "@mui/material";
import Admin from "./Admin";

export default function TabbedForm() {
  const [activeTab, setActiveTab] = useState(0);
  const initialData = {
    body: "",
    staffId: "",
    staffType: "",
    outSourceType: "",
    subject: "",
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" style={{ marginBottom: "3rem" }}>
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
        <Tab label="Admin" />
      </Tabs>
      <Box sx={{ marginTop: 2 }}>
        {activeTab === 0 && <StudentForm initialData={initialData} />}
        {activeTab === 1 && <StaffForm initialData={initialData} />}
        {activeTab === 2 && <Admin />}
      </Box>
    </Container>
  );
}
