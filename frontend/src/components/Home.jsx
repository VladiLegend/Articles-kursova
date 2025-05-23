import "../styles/HomeStyles.css";
import { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { LoggedInContext } from "../App";

export default function Home(){
    const [isLoggedIn, setIsLoggedIn] = useContext(LoggedInContext);

    const randomArticleTitlesRef = useRef([]);
    const randomArticleContainersRef = useRef([]);
    const [randomArticleTitlesOverflow, setRandomArticleTitlesOverflow] = useState([]);
    const [randomArticleContainersOverflow, setRandomArticleContainersOverflow] = useState([]);
    const [randomArticles, setRandomArticles] = useState();

    const [randomCategory, setRandomCategory] = useState("Random Category");

    const categoryArticleTitlesRef = useRef([]);
    const categoryArticleContainersRef = useRef([]);
    const [categoryArticleTitlesOverflow, setCategoryArticleTitlesOverflow] = useState([]);
    const [categoryArticleContainersOverflow, setCategoryArticleContainersOverflow] = useState([]);
    const [categoryArticles, setCategoryArticles] = useState([]);

    const favoriteArticleTitlesRef = useRef([]);
    const favoriteArticleContainersRef = useRef([]);
    const [favoriteArticleTitlesOverflow, setFavoriteArticleTitlesOverflow] = useState([]);
    const [favoriteArticleContainersOverflow, setFavoriteArticleContainersOverflow] = useState([]);
    const [favoriteArticles, setFavoriteArticles] = useState([]);

    useEffect(() => {
        async function fetchArticles() {
            setRandomArticles(await fetch("http://localhost:5000/articles/random")
            .then(res => res.json()));

            const categories = ["Fitness", "Games", "Movies", "Art", "Cooking"];
            const category = Math.floor(Math.random() * 5);
            setRandomCategory(categories[category]);
            setCategoryArticles(await fetch(`http://localhost:5000/articles/${categories[category]}`)
            .then(async (res) => await res.json()));

            if (isLoggedIn) {
                setFavoriteArticles(await fetch("http://localhost:5000/articles/favorites", {
                    method: "GET",
                    headers: {
                        "Authorization": sessionStorage.getItem("sessionID")
                    }
                })
                .then(async (res) => await res.json()));
            }
        }

        fetchArticles();
    }, []);

    function calculateOverflowingArticles(titlesRef, contentsRef, setTitles, setContents) {
        if (!titlesRef.current || !titlesRef.current[0]) {return;}
        const overflowingTitles = [];
        for(const ref of titlesRef.current) {
            if (!ref) {continue;}
            console.log(titlesRef, titlesRef.current[0], ref)
            overflowingTitles.push(ref.scrollWidth > ref.clientWidth);
        }
        setTitles(overflowingTitles);

        const overflowingContents = [];
        for(const ref of contentsRef.current) {
            if (!ref) {continue;}
            overflowingContents.push(ref.scrollHeight > ref.clientHeight);
        }
        setContents(overflowingContents);
    }

    useEffect(() => 
        calculateOverflowingArticles(randomArticleTitlesRef, randomArticleContainersRef, setRandomArticleTitlesOverflow, setRandomArticleContainersOverflow),
    [randomArticles]);

    useEffect(() => 
        calculateOverflowingArticles(categoryArticleTitlesRef, categoryArticleContainersRef, setCategoryArticleTitlesOverflow, setCategoryArticleContainersOverflow),
    [categoryArticles]);

    useEffect(() => 
        calculateOverflowingArticles(favoriteArticleTitlesRef, favoriteArticleContainersRef, setFavoriteArticleTitlesOverflow, setFavoriteArticleContainersOverflow),
    [favoriteArticles]);

    return(
        <div className="flex-container home-wrapper">
            <div className="flex-container-column home-section-container">
                <label className="home-section-title">Random Feed</label>
                {
                    randomArticles?.map((article, index) => {
                        return (
                            <Link to={`/article/${article.id}`} key={`r${index}`}
                            className="home-article-container flex-container-column">
                                <label className="home-article-title" ref={e => randomArticleTitlesRef.current[index] = e}
                                title={randomArticleTitlesOverflow[index] ? article.title : undefined}>
                                    {article.title}
                                </label>
                                <p className="home-article-content-preview" ref={e => randomArticleContainersRef.current[index] = e}>
                                    {article.content}
                                </p>
                                {randomArticleContainersOverflow[index] && <read-full-message>Click To Read Full Article</read-full-message>}
                            </Link>
                        )
                    })
                }
            </div>

            <div className="flex-container-column home-section-container">
                <label className="home-section-title">{randomCategory}</label>
                 {
                    categoryArticles?.map((article, index) => {
                        return (
                            <Link to={`/article/${article.id}`} key={`c${index}`}
                            className="home-article-container flex-container-column">
                                <label className="home-article-title" ref={e => categoryArticleTitlesRef.current[index] = e}
                                title={categoryArticleTitlesOverflow[index] ? article.title : undefined}>
                                    {article.title}
                                </label>
                                <p className="home-article-content-preview" ref={e => categoryArticleContainersRef.current[index] = e}>
                                    {article.content}
                                </p>
                                {categoryArticleContainersOverflow[index] && <read-full-message>Click To Read Full Article</read-full-message>}
                            </Link>
                        )
                    })
                }
            </div>

            <div className="flex-container-column home-section-container">
                <label className="home-section-title">Favourites</label>
                {
                    favoriteArticles && favoriteArticles.length ? favoriteArticles.map((article, index) => {
                        return (
                            <Link to={`/article/${article.id}`} key={`f${index}`}
                            className="home-article-container flex-container-column">
                                <label className="home-article-title" ref={e => favoriteArticleTitlesRef.current[index] = e}
                                title={favoriteArticleTitlesOverflow[index] ? article.title : undefined}>
                                    {article.title}
                                </label>
                                <p className="home-article-content-preview" ref={e => favoriteArticleContainersRef.current[index] = e}>
                                    {article.content}
                                </p>
                                {favoriteArticleContainersOverflow[index] && <read-full-message>Click To Read Full Article</read-full-message>}
                            </Link>
                        )
                    })

                    : isLoggedIn ? "You don't have any articles in favorites." : "You need to login to use this feature."
                }
            </div>
        </div>
    )
}