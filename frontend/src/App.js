import './App.css';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import { createContext, useState } from 'react';
import Article from './components/Article.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import ArticlesByCategory from './components/ArticlesByCategory.jsx';
import CreateArticle from './components/CreateArticle.jsx';
import Register from './components/Register.jsx';

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
        <Route path='/register' element={<Register />} />
        <Route path='/article/:articleID' element={<Article />}/>
        <Route path='/category/:category' element={<ArticlesByCategory />} />
        <Route path='/create' element={<CreateArticle />}/>
        <Route path='*' element={<ErrorPage />}/>
      </Routes>
    </LoggedInContext.Provider>
    </>
  );
}

export default App;
