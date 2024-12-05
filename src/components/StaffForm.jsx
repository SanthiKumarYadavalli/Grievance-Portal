import { useRef, useState } from 'react';
import { createGreivance } from '../utils/firebaseFunctions';
import { Toaster, toast } from 'react-hot-toast';
import {
  Container,
  TextField,
  Button,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';

// eslint-disable-next-line react/prop-types
export default function StaffForm({ initialData }) {
  const [formData, setFormData] = useState({
    ...initialData,
    from: 'staff'
  });
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const idRef = useRef(null);

  const sendForm = async () => {
    setLoading(true);
    try {
      const docId = await createGreivance(formData);
      toast.success("Form submitted successfully!");
      console.log(`Document written with ID: ${docId}`);
    } catch (e) {
      console.error('Error adding document: ', e);
      toast.error('Failed to submit form. Please try again.');
    }
    setLoading(false);
  }

  const handleDialogClose = (submitAnonymously) => {
    if (submitAnonymously) {
      sendForm();
    } else {
      console.log(idRef.current);
      idRef.current.focus();
    }
    setShowDialog(false);
  }

  const handleInputChange = (inputName, inputValue) => {
    setFormData({ ...formData, [inputName]: inputValue });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.StaffId === '') {
      setShowDialog(true);
      return;
    }
    sendForm();
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Toaster toastOptions={{ style: {fontFamily: "Roboto, system-ui"} }}/>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        {/* Staff Type Dropdown */}
        <FormControl fullWidth required>
          <InputLabel id="staff-type-label">Staff Type</InputLabel>
          <Select
            labelId="staff-type-label"
            value={formData.staffType}
            onChange={(e) => handleInputChange('staffType', e.target.value)}
            label="Staff Type"
          >
            <MenuItem value="Regular">Regular</MenuItem>
            <MenuItem value="Contrast">Contract</MenuItem>
            <MenuItem value="Out Source">Out Source</MenuItem>
          </Select>
        </FormControl>

        {/* Out Source Type Dropdown (Conditional) */}
        {formData.staffType === 'Out Source' && (
          <FormControl fullWidth required>
            <InputLabel id="out-source-type-label">Out Source Type</InputLabel>
            <Select
              labelId="out-source-type-label"
              value={formData.outSourceType}
              onChange={(e) => handleInputChange('outSourceType', e.target.value)}
              label="Out Source Type"
            >
              <MenuItem value="Man Power">Man Power</MenuItem>
              <MenuItem value="House Keeping">House Keeping</MenuItem>
              <MenuItem value="Security">Security</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* ID Field */}
        <TextField
          ref={idRef}
          label="ID"
          value={formData.staffId}
          variant="outlined"
          onChange={(e) => handleInputChange('staffId', e.target.value)}
          fullWidth
        />

        {/* Subject Field */}
        <TextField
          label="Subject"
          variant="outlined"
          value={formData.subject}
          onChange={(e) => handleInputChange('subject', e.target.value)}
          fullWidth
          required
        />

        {/* Body Field (Text Area) */}
        <TextField
          label="Body"
          multiline
          rows={4}
          value={formData.body}
          onChange={(e) => handleInputChange('body', e.target.value)}
          variant="outlined"
          fullWidth
          required
        />

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" onSubmit={handleSubmit} disabled={loading}>
          Submit
        </Button>
      </Box>
      <Dialog open={showDialog} onClose={() => handleDialogClose(false)}>
        <DialogTitle>Submit Form Anonymously?</DialogTitle>
        <DialogContent>
          <Typography>
            Do you want to proceed without entering your ID? Choosing No will let you enter your ID.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            No
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
