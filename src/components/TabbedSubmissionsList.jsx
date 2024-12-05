import { useState } from "react";
import SubmissionsList from "./SubmissionsList";
import { Tabs, Tab, Box, Badge } from "@mui/material";

export default function TabbedSubmissionsList({ submissions }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const primary = submissions.filter((submission) => !submission.spam);
  const repeated = submissions.filter((submission) => submission.spam);

  return (
    <>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label={<Badge badgeContent={primary.length}>Primary&nbsp;&nbsp;</Badge>} />
        <Tab label={<Badge badgeContent={repeated.length}>Repeated&nbsp;&nbsp;</Badge>}/>
      </Tabs>
      <Box sx={{ marginTop: 2 }}>
        {activeTab === 0 && <SubmissionsList submissions={primary} />}
        {activeTab === 1 && <SubmissionsList submissions={repeated} />}
      </Box>
    </>
  );
}
