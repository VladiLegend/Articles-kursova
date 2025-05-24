import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/ArticlesByCategory.css";

export default function ArticlesByCategory() {
    const { category } = useParams();

    const articleTitlesRef = useRef([]);
    const articleContainersRef = useRef([]);
    const [articleTitlesOverflow, setArticleTitlesOverflow] = useState([]);
    const [articleContainersOverflow, setArticleContainersOverflow] = useState([]);
    const [articles, setArticles] = useState();

    useEffect(() => {
        async function fetchArticles() {
            setArticles(await fetch(`http://localhost:5000/articles/${category}`)
            .then(res => res.json()));
        }
        fetchArticles();
    }, [category]);

    function calculateOverflowingArticles() {
        if (!articleTitlesRef.current || !articleTitlesRef.current[0]) {return;}
        const overflowingTitles = [];
        for(const ref of articleTitlesRef.current) {
            if (!ref) {continue;}
            overflowingTitles.push(ref.scrollWidth > ref.clientWidth);
        }
        setArticleTitlesOverflow(overflowingTitles);

        const overflowingContents = [];
        for(const ref of articleContainersRef.current) {
            if (!ref) {continue;}
            overflowingContents.push(ref.scrollHeight > ref.clientHeight);
        }
        setArticleContainersOverflow(overflowingContents);
    }

    useEffect(calculateOverflowingArticles, [articles]);

    return (
        <div className="flex-container articles-by-category-wrapper">
            {
                articles?.map((article, index) => {
                    return (
                        <Link to={`/article/${article.id}`} key={`a${index}`}
                        className="home-article-container flex-container-column category-articles-container">
                            <label className="home-article-title" ref={e => articleTitlesRef.current[index] = e}
                            title={articleTitlesOverflow[index] ? article.title : undefined}>
                                {article.title}
                            </label>
                            <p className="home-article-content-preview" ref={e => articleContainersRef.current[index] = e}>
                                {article.content}
                            </p>
                            {articleContainersOverflow[index] && <read-full-message>Click To Read Full Article</read-full-message>}
                        </Link>
                    )
                })
            }
        </div>
    )
} 