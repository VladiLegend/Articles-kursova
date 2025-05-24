import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/NavBarStyles.css";
import { useContext, useState, useRef, useEffect } from "react";
import { LoggedInContext } from "../App";

export default function NavBar() {
    const [isSearchDropDownOpen, setIsSearchDropDownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useContext(LoggedInContext);
    const location = useLocation();

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

    const [foundArticles, setFoundArticles] = useState([]);
    const searchResultRef = useRef([]);
    const [searchResultOverflows, setSearchResultOverflows] = useState([]);

    async function handleSearch(e) {
        if(!e.target.value) {
            setFoundArticles([]);
            return;
        }

        setFoundArticles(await fetch("http://localhost:5000/search", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                title: e.target.value
            })
        }).then(res => res.json()));

        setIsSearchDropDownOpen(true);
    }

    useEffect(() => {
        if (!searchResultRef.current || !searchResultRef.current[0]) {return;}
        const overflowingTitles = [];
        for(const ref of searchResultRef.current) {
            if (!ref) {continue;}
            overflowingTitles.push(ref.scrollWidth > ref.clientWidth);
        }
        setSearchResultOverflows(overflowingTitles);
    }, [foundArticles]);

    useEffect(() => {
        async function userIsAuthenticated() {
            setIsLoggedIn(await fetch("http://localhost:5000/checkAuthentication", {
                method: "GET",
                headers: {Authorization: sessionStorage.getItem("sessionID")}
            }).then(res => res.status === 200));
        }
        userIsAuthenticated();
    }, [location])

    return (
        <>
        <div className="nav-bar-container flex-container">
            <Link to="/" className="nav-bar-item">Home</Link>
            <div className="drop-down-nav-container nav-bar-item">
                Category
                <div className="drop-down-nav flex-container-column">
                    <Link to="/category/fitness" className="drop-down-nav-item">Fitness</Link>
                    <Link to="/category/games" className="drop-down-nav-item">Games</Link>
                    <Link to="/category/cooking" className="drop-down-nav-item">Cooking</Link>
                    <Link to="/category/movies" className="drop-down-nav-item">Movies</Link>
                    <Link to="/category/art" className="drop-down-nav-item">Art</Link>
                </div>
            </div>

            <div className="drop-down-nav-container nav-bar-item flex-container nav-search-container">
                <input type="text" name="search" id="search" className="nav-search-input" placeholder="Search" onBlur={() => setIsSearchDropDownOpen(false)}
                onInput={handleSearch}/>
                <div className="drop-down-nav flex-container-column" style={isSearchDropDownOpen ? {opacity: "1", pointerEvents: "all", maxWidth: "17rem"} : {maxWidth: "17rem"}}>
                    {
                        foundArticles.map((article, index) => {
                            return (
                                <Link to={`/article/${article.id}`} className="nav-search-result-item"
                                key={index} onClick={() => setIsSearchDropDownOpen(false)}
                                ref={e => searchResultRef.current[index] = e}
                                title={searchResultOverflows[index] ? article.title : undefined}>
                                    {article.title}
                                </Link>
                            )
                        })
                    }
                </div>
            </div>

            <label className="nav-bar-item nav-login" onClick={handleLoginButton}>{isLoggedIn ? "Logout" : "Login"}</label>
        </div>
        </>
    )
}