import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ArticleStyles.css";
import Dialog from "./Dialog";

export default function Article(){
    const { articleID } = useParams();

    const navigate = useNavigate();

    const [articleInfo, setArticleInfo] = useState();
    const [isInFavorites, setIsInFavorites] = useState(false);
    const [articleFavorites, setArticleFavorites] = useState(0);

    const [isDeleteArticleDialogOpen, setIsDeleteArticleDialogOpen] = useState(false);
    const defaultDeleteDialogContent = "Are you sure you want to delete this article? You cannot revert this action!";
    const [deleteDialogContent, setDeleteDialogContent] = useState(defaultDeleteDialogContent);

    useEffect(() => {
        async function fetchArticle() {
            setArticleInfo(await fetch(`http://localhost:5000/article/${articleID}`, {
                method: "GET",
                headers: {Authorization: sessionStorage.getItem("sessionID")}
            }).then(res => res.json()));
        }
        fetchArticle();
    }, [])

    useEffect(() => {
        console.log(articleInfo);
        if (!articleInfo) {return;}
        setIsInFavorites(articleInfo.isInFavorites);
        setArticleFavorites(articleInfo.favourites);
    }, [articleInfo]);

    function AddOrRemoveFavorite() {
        if (!sessionStorage.getItem("sessionID")) {
            navigate("/login");
        }
        if (isInFavorites) {
            fetch(`http://localhost:5000/user/removeFromFavourites/${articleID}`, {
                method: "PATCH",
                headers: {Authorization: sessionStorage.getItem("sessionID")}
            });
            setIsInFavorites(false);
            setArticleFavorites(prev => prev - 1);
        }
        else {
            fetch(`http://localhost:5000/user/addToFavorites/${articleID}`, {
                method: "PATCH",
                headers: {Authorization: sessionStorage.getItem("sessionID")}
            });
            setIsInFavorites(true);
            setArticleFavorites(prev => prev + 1);
        }
    }

    function handleArticleDeletion() {
        fetch(`http://localhost:5000/articles/${articleID}`, {
            method: "DELETE",
            headers: {Authorization: sessionStorage.getItem("sessionID")}
        }).then(async (res) => {
            if (res.status === 200) {
                navigate("/");
            }
            else {
                setDeleteDialogContent(`An error occurred: ${await res.text()}`);
                setIsDeleteArticleDialogOpen(true);
            }
        })
    }

    useEffect(() => {
        if (!isDeleteArticleDialogOpen) {
            setDeleteDialogContent(defaultDeleteDialogContent);
        }
    }, [isDeleteArticleDialogOpen]);

    return (
        <>
        <Dialog isOpen={isDeleteArticleDialogOpen} setIsOpen={setIsDeleteArticleDialogOpen}
        content={deleteDialogContent}
        onOk={deleteDialogContent.startsWith("Are") ? handleArticleDeletion : undefined}/>
        {
            articleInfo ? <div className="article-viewport flex-container-column">
                <div className="flex-container-column article-header-area">
                    <h1>{articleInfo.title}</h1>
                    <div className="flex-container" style={{justifyContent: "space-between", alignItems: "center"}}>
                        <label className="article-category">Category: {articleInfo.category[0].toUpperCase() + articleInfo.category.substring(1)}</label>
                        <div className="flex-container">
                            <label className="article-favorites">Favorites: {articleFavorites}</label>
                            <button className="generic-btn" onClick={AddOrRemoveFavorite}>{isInFavorites ? "Remove From Favorites" : "Add To Favorites"}</button>
                            {
                                articleInfo.creator === sessionStorage.getItem("email") &&
                                <button className="article-delete-btn" onClick={() => setIsDeleteArticleDialogOpen(true)}>Delete</button>
                            }
                        </div>
                    </div>
                </div>
                <p className="article-content">{articleInfo.content}</p>
            </div>

            : <h1>Such article does not exist!</h1>
        }
        </>
        
    )
}