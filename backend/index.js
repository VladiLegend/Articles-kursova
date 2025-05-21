const express = require("express");
const app = express();
const cors = require("cors");

const users = require("./db/users.js").users;
const sessions = require("./db/sessions.js").sessions;

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

    res.send("Wrong Credentials");
})

app.listen(5000);