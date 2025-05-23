import './App.css';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import { createContext, useState } from 'react';

export const LoggedInContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("sessionID"));
  return (
    <>
    <LoggedInContext.Provider value={[isLoggedIn, setIsLoggedIn]}>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
      </Routes>
    </LoggedInContext.Provider>
    </>
  );
}

export default App;
