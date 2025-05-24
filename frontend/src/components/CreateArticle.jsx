import { useEffect, useContext, useState } from "react";
import "../styles/CreateArticleStyles.css";
import { LoggedInContext } from "../App";
import { useNavigate } from "react-router-dom";
import arrowIcon from "../assets/LeftArrow.png";
import Dialog from "./Dialog";

export default function CreateArticle() {
    const [isLoggedIn, setIsLoggedIn] = useContext(LoggedInContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn]);

    const [categoryDropDownIsOpen, setCategoryDropDownIsOpen] = useState(false);
    const [chosenCategory, setChosenCategory] = useState("");
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        fetch("http://localhost:5000/articles/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: sessionStorage.getItem("sessionID")
            },
            body: JSON.stringify({
                title: e.target["0"].value,
                category: chosenCategory,
                content: e.target["2"].value
            })
        }).then(async (res) => ({status: res.status, res: await res.json()}))
        .then(({status, res}) => {
            if (status !== 200) {
                setErrorMessage(res);
                setIsErrorDialogOpen(true);
            }
            else {
                navigate(`/article/${res.id}`);
            }
        })
    }

    return (
        <>
        <Dialog isOpen={isErrorDialogOpen} setIsOpen={setIsErrorDialogOpen} content={errorMessage}/>
        <form className="create-viewport flex-container-column" onSubmit={handleSubmit}>
            <label htmlFor="title">
                Title: 
            </label>
            <input type="text" name="title" id="title" className="create-title-input" />

            <label htmlFor="category">Category:</label>
            <div className="flex-container-column create-category-outer-container">
                <div className="flex-container create-category-container" onClick={() => setCategoryDropDownIsOpen(prev => !prev)}>
                    <img src={arrowIcon} alt="open-dropdown" className="create-category-dropdown-icon" style={categoryDropDownIsOpen ? {transform: "rotateZ(90deg)"} : undefined}/>
                    <input type="text" name="category" id="category" className="create-category-input" readOnly value={chosenCategory}/>
                </div>
                <div className="flex-container-column create-categories-container" style={categoryDropDownIsOpen ? {opacity: "1", pointerEvents: "all"} : undefined} 
                onClick={() => setCategoryDropDownIsOpen(false)}>
                    <label onClick={() => setChosenCategory("Fitness")} className="create-category">Fitness</label>
                    <label onClick={() => setChosenCategory("Games")} className="create-category">Games</label>
                    <label onClick={() => setChosenCategory("Cooking")} className="create-category">Cooking</label>
                    <label onClick={() => setChosenCategory("Movies")} className="create-category">Movies</label>
                    <label onClick={() => setChosenCategory("Art")} className="create-category">Art</label>
                </div>
            </div>

            <label htmlFor="content">Content:</label>
            <textarea name="content" id="content" className="create-content"/>

            <button className="generic-btn" type="submit">Create Article</button>
        </form>
        </>
    )
}