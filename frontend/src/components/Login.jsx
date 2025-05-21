import { Link } from "react-router-dom";
import "../styles/LoginStyles.css";
import { useState } from "react";
import Dialog from "./Dialog";

export default function Login() {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {"Content-type": "application/json",
                "Authorization": `Basic ${e.target["0"].value} ${e.target["1"].value}`
            }
        }).then(res => ({text: res.text(), status: res.status}));

        if (res.status === 200) {
            sessionStorage.setItem("sessionID", res);
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

            <Link className="register-href">Don't have an account? Register!</Link>
        </form>
        </>
    )
}