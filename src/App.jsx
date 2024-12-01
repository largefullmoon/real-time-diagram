import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './auth/SingIn';
import Dashboard from './Dashboard';
import NotFound from './Notfound';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './AuthContext'; // Adjust the import path as necessary

function App() {
  return (
    <AuthProvider>
        <Router>
          <ToastContainer />
          <Routes>
            <Route path="/rabbitmq-app/signin" element={<SignIn />} />
            <Route path="/rabbitmq-app/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Router >
    </AuthProvider>
  )
}

export default App