import "../styles/LoginStyles.css";
import { useState, useContext, useEffect } from "react";
import Dialog from "./Dialog";
import { LoggedInContext } from "../App";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useContext(LoggedInContext);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        if (e.target[1].value !== e.target[2].value) {
            setDialogContent("Password doesn't match");
            setDialogIsOpen(true);
            return;
        }

        fetch("http://localhost:5000/user/register", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email: e.target[0].value,
                password: e.target[1].value
            })
        }).then(async (res) => ({text: await res.text(), status: res.status}))
        .then(({status, text}) => {
            if (status !== 200) {
                setDialogContent(text);
                setDialogIsOpen(true);
            }
            else {
                sessionStorage.setItem("sessionID", text);
                sessionStorage.setItem("email", e.target["0"].value);
                setIsLoggedIn(true);
                navigate("/");
            }
        });
    }

    useEffect(() => {
        if(isLoggedIn) {
            navigate('/');
        }
    })

    return (
        <>
        <Dialog isOpen={dialogIsOpen} setIsOpen={setDialogIsOpen} content={dialogContent}/>
        <form className="login-register-form flex-container-column" 
        onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" id="email" className="login-register-input"/>

            <label htmlFor="password">Password:</label>
            <input type="password" name="password" id="password" className="login-register-input"/>

            <label htmlFor="confirm-password">Confirm Password:</label>
            <input type="password" name="confirm-password" id="confirm-password" className="login-register-input"/>

            <button className="generic-btn" type="submit">Register</button>

            <Link to="/login" className="register-href">Already registered? Login!</Link>
        </form>
        </>
    )
}