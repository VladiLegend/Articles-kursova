import { Link, useNavigate } from "react-router-dom";
import "../styles/LoginStyles.css";
import { useState, useContext } from "react";
import Dialog from "./Dialog";
import { LoggedInContext } from "../App";

export default function Login({returnTo}) {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useContext(LoggedInContext);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {"Content-type": "application/json",
                "Authorization": `Basic ${e.target["0"].value} ${e.target["1"].value}`
            }
        }).then(async (res) => ({text: await res.text(), status: res.status}));

        if (res.status === 200) {
            sessionStorage.setItem("sessionID", res.text);
            console.log(res.text);
            sessionStorage.setItem("email", e.target["0"].value);
            setIsLoggedIn(true);
            navigate(returnTo ? returnTo : "/");
        }
        else {
            setDialogContent(res.text);
            setDialogIsOpen(true);
        }
    }

    return (
        <>
        <Dialog isOpen={dialogIsOpen} setIsOpen={setDialogIsOpen} content={dialogContent}/>
        <form className="login-register-form flex-container-column" 
        onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" id="email" className="login-register-input"/>

            <label htmlFor="password">Password:</label>
            <input type="password" name="password" id="password" className="login-register-input"/>

            <button className="generic-btn" type="submit">Login</button>

            <Link to="/register" className="register-href">Don't have an account? Register!</Link>
        </form>
        </>
    )
}