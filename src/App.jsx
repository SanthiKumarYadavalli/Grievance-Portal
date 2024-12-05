import './App.css'
import StudentForm from './components/StudentForm'
import { Container, Typography } from '@mui/material'

function App() {
  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Grievance
      </Typography>
      <StudentForm />
    </Container>
  )
}

export default App
