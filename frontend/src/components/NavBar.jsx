import { Link, useNavigate } from "react-router-dom";
import "../styles/NavBarStyles.css";
import { useContext, useState } from "react";
import { LoggedInContext } from "../App";

export default function NavBar() {
    const [categoriesDropDownIsOpen, setCategoriesDropDownIsOpen] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useContext(LoggedInContext);
    const navigate = useNavigate();
    function handleLoginButton(){
        if(isLoggedIn){
            fetch("http://localhost:5000/removeSession", {
                method: "POST",
                body: sessionStorage.getItem("sessionID")
            })

            sessionStorage.removeItem("sessionID");
            sessionStorage.removeItem("email");
            setIsLoggedIn(false);
        }
        else{
            navigate("/login");
        }
    }

    return (
        <>
        <div className="nav-bar-container flex-container">
            <Link to="/" className="nav-bar-item">Home</Link>
            <div className="drop-down-nav-container nav-bar-item" onMouseEnter={() => setCategoriesDropDownIsOpen(true)}
                onMouseLeave={() => setCategoriesDropDownIsOpen(false)}>
                Category
                <div className="drop-down-nav flex-container-column" style={categoriesDropDownIsOpen ? {opacity: "1", pointerEvents: "auto"} : undefined}>
                    <Link to="/category/fitness" className="drop-down-nav-item">Fitness</Link>
                    <Link to="/category/games" className="drop-down-nav-item">Games</Link>
                    <Link to="/category/cooking" className="drop-down-nav-item">Cooking</Link>
                    <Link to="/category/movies" className="drop-down-nav-item">Movies</Link>
                    <Link to="/category/art" className="drop-down-nav-item">Art</Link>
                </div>
            </div>

            <div className="drop-down-nav-container nav-bar-item flex-container nav-search-container">
                <input type="text" name="search" id="search" className="nav-search-input"/>
            </div>

            <label className="nav-bar-item nav-login" onClick={handleLoginButton}>{isLoggedIn ? "Logout" : "Login"}</label>
        </div>
        </>
    )
}