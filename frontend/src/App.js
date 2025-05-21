import './App.css';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Login from './components/Login.jsx';

function App() {
  return (
    <>
    <NavBar />
    <Routes>
      <Route path='/' element={<Login />}/>
    </Routes>
    </>
  );
}

export default App;
