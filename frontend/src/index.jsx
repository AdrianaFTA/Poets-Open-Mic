import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
// Import your Home page or main App component
import Home from '../src/Home.jsx'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      {/* You should typically render your main App or Router component here */}
      <Home /> 
    </Router>
  </React.StrictMode>
);