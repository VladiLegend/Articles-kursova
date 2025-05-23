const express = require("express");
const app = express();
const cors = require("cors");

const users = require("./db/users.js").users;
const sessions = require("./db/sessions.js").sessions;
const articles = require("./db/articles.js").articles;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

function createRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?><';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

app.post("/login", (req, res) => {
    let index = req.headers.authorization.indexOf(" ");
    const authWithoutBasic = req.headers.authorization.substring(index + 1);
    index = authWithoutBasic.indexOf(" ");
    const email = authWithoutBasic.substring(0, index);
    const password = authWithoutBasic.substring(index + 1);

    for(const user of users) {
        if (user.email === email && user.password === password) {
            while(true) {
                const sessionID = createRandomString(30);
                if (!sessions[sessionID]) {
                    sessions[sessionID] = user;
                    user.sessionID = sessionID;
                    res.send(sessionID);
                    return;
                }
            }
        }
    }

    res.status(401).send("Wrong Credentials.")
})

app.post("/removeSession", (req, res) => {
    if (sessions[req.body]) {
        sessions[req.body].sessionID = null;
        delete sessions[req.body];
    }
})

app.get("/articles/random", (req, res) => {
    const tempArticles = [...articles];
    const articlesToSend = [];
    while(tempArticles.length) {
        const index = Math.floor(Math.random() * tempArticles.length);
        articlesToSend.push(tempArticles[index]);
        tempArticles.splice(index, 1);
    }

    res.status(200).send(articlesToSend);
})

app.get("/articles/favorites", (req, res) => {
    const articlesToSend = [];
    
    if (!sessions[req.headers.authorization]) {
        res.status(400).send("You need to login");
        return;
    }

    for (const article of sessions[req.headers.authorization].favorites) {
        const foundArticle = articles.find(a => a.id === article);
        if (foundArticle) {
            articlesToSend.push(foundArticle);
        }
    }

    res.send(articlesToSend);
})

app.get("/articles/:category", (req, res) => {
    const articlesToSend = [];

    for(const article of articles) {
        if (article.category === req.params.category.toLowerCase()) {
            articlesToSend.push(article);
        }
    }

    res.status(200).send(articlesToSend);
})

app.get("/article/:id", (req, res) => {
    const article = {...articles.find(a => a.id == req.params.id)};
    if (article.id) {
        if (sessions[req.headers.authorization]) {
            article.isInFavorites = sessions[req.headers.authorization].favorites.includes(article.id);
        }
        else {
            article.isInFavorites = false;
        }

        res.send(article);
        return;
    }

    res.status(400).send("Article not found.");
})

app.patch("/user/removeFromFavourites/:id", (req, res) => {
    if (!sessions[req.headers.authorization]) {
        res.status(400).send("Invalid session.");
        return;
    }
    
    sessions[req.headers.authorization].favorites.splice(sessions[req.headers.authorization].favorites.indexOf(req.params.id), 1);
    articles.find(a => a.id == req.params.id).favourites--;
    res.sendStatus(200);
})

app.patch("/user/addToFavorites/:id", (req, res) => {
    if (!sessions[req.headers.authorization]) {
        res.status(400).send("Invalid session.");
        return;
    }

    const article = articles.find(a => a.id == req.params.id); 
    if (!article) {
        res.status(400).send("Article doesn't exist.");
        return;
    }
    sessions[req.headers.authorization].favorites.push(req.params.id);
    article.favourites++;
    res.sendStatus(200);
})

app.delete("/articles/:id", (req, res) => {
    if (!sessions[req.headers.authorization]) {
        res.status(400).send("Invalid session.");
        return;
    }

    const indexOfArticle = articles.findIndex(a => a.id === req.params.id);
    if (indexOfArticle === -1) {
        res.status(400).send("This article doesn't exist.");
        return;
    }

    if (articles[indexOfArticle].creator !== sessions[req.headers.authorization].email) {
        res.status(400).send("You are not this article's writer.");
        return;
    }

    articles.splice(indexOfArticle, 1);

    res.sendStatus(200);
})

app.post("/search", (req, res) => {
    const articlesToSend = [];

    for (const article of articles) {
        if(article.title.toLowerCase().includes(req.body.title.toLowerCase())) {
            articlesToSend.push(article);
        }

        if (articlesToSend.length > 5) {
            break;
        }
    }

    res.send(articlesToSend);
})

app.get("/checkAuthentication", (req, res) => {
    if(sessions[req.headers.authorization]) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(401);
    }
})

app.post("/articles/create", (req, res) => {
    if (!sessions[req.headers.authorization]) {
        res.status(400).send("Invalid session.");
        return;
    }

    const availableCategories = ["games", "fitness", "cooking", "art", "movies"];
    const errors = [];
    if (!req.body.title) {
        errors.push("Title cannot be empty.\n");
    }
    if (!req.body.category) {
        errors.push("Category cannot be empty.\n");
    }
    else if (!availableCategories.includes(req.body.category.toLowerCase())) {
        errors.push("This category is unavailable.\nAvailable categories are: " + availableCategories.join(",") + ".\n");
    }
    if (!req.body.content) {
        errors.push("Content cannot be empty.\n");
    }

    if (errors.length) {
        res.status(400).send(errors);
        return;
    }

    const newArticle = {
        id: "" + (articles.length + 1),
        title: req.body.title,
        category: req.body.category.toLowerCase(),
        content: req.body.content,
        creator: sessions[req.headers.authorization].email,
        favourites: 0
    };
    articles.push(newArticle);

    res.status(200).send(newArticle);
})

app.post("/user/register", (req, res) => {
    if (!req.body.email) {
        res.status(400).send("Email cannot be empty.");
        return;
    }
    if (!req.body.password) {
        res.status(400).send("Password cannot be empty.");
        return;
    }

    for (const user of users) {
        if (user.email === req.body.email) {
            res.status(400).send("This email is already registered!");
            return;
        }
    }

    const newUser = {
        email: req.body.email,
        password: req.body.password,
        sessionID: null,
        favorites: []
    };

    while(true) {
        const sessionID = createRandomString(30);
        if (!sessions[sessionID]) {
            sessions[sessionID] = newUser;
            newUser.sessionID = sessionID;
            break;
        }
    }
    
    users.push(newUser);
    res.send(newUser.sessionID);
})

app.listen(5000);