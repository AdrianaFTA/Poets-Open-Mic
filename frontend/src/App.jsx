import React from "react";
import {Routes, Route} from 'react-router-dom';
import './App.css' ;
import Header from "./components/Header.jsx";

//import page components
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';
import Editor from './pages/Editor.jsx';
import Register from './pages/Register.jsx';

function App(){
  return(
    <>
      <Header /> {/*header/navigation bar */}

      <main className="App-content">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} /> 
          <Route path ="/editor" element={<Editor />} />
          <Route path ="/register" element={<Register />} />
          <Route path ="/main" element={<Main />} />
        </Routes>
      </main>
      
      <Footer /> {/*consistent footer */}
    </>
  );
}
export default App;