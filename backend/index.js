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
        articlesToSend.push(articles.find(a => a.id === article));
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

app.listen(5000);