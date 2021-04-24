"use strict";
var cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
var SHA256 = require("crypto-js/sha256");

//change HTTP to HTTPS if you use certificate
const https = require('http');
const fs = require('fs');
const atob = require('atob');


//Add certificate for HTTPS connection

//const privateKey = fs.readFileSync('privkey.pem', 'utf8');
//const certificate = fs.readFileSync('cert.pem', 'utf8');
//const ca = fs.readFileSync('chain.pem', 'utf8');

//const credentials = {
//    key: privateKey,
//    cert: certificate,
//    ca: ca
//};

//Prevent request spam
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500
});

//-----------------
// App setup
//-----------------

const app = express();
app.use(cors());
//  apply to all requests
app.use(limiter);

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const database = new sqlite3.Database("./zillance.db");

const createProjectsTable = () => {
    const sqlQuery = `
        CREATE TABLE IF NOT EXISTS projects (
        id integer PRIMARY KEY,
        title varchar,
        creationDate date,
        description varchar,
        tags varchar,
        bounty integer,
        category varchar,
        privatekey varchar)`;

    return database.run(sqlQuery);
}

const createProject = (user, cb) => {
    return database.run('INSERT INTO projects (title, creationDate, description, tags, bounty, category, privatekey) VALUES (?,?,?,?,?,?,?)', user, (err) => {
        cb(err)
    });
}

createProjectsTable();

router.get('/', (req, res) => {
    res.status(200).send('This is a REST webservice');
});

function getCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    return mm + '/' + dd + '/' + yyyy;
}

function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}

router.get('/createproject', (req, res) => {
    const title = req.headers['title'];
    const description = req.headers['description'];
    const tags = req.headers['tags'];
    const bounty = req.headers['bounty'];
    const category = req.headers['category'];

    const checks = [title, description, tags, bounty, category];
    let issueCounter = 0;

    for (let i = 0; i < checks.length; i++) {
        if (checks[i] == "" || checks[i] == null) {
            issueCounter++;
        }
    }

    if (issueCounter > 0) {
        return res.status(500).send('One or more properties not provided');
    }

    const privkey = makeid(24);

    createProject([title, getCurrentDate(), description, tags, bounty, category, privkey], (err) => {
        if (err) return res.status(500).send("Error, if this keeps happening please contact Zillacracy.");
        res.status(200).json(privkey);
    });
});

app.use(router);

//add credentials to createServer properties for HTTPS
const httpsServer = https.createServer(app);

httpsServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
});

app.get("/projects/all", (req, res, next) => {
    database.all("SELECT id, title, creationDate, description, tags, bounty, category FROM projects", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json(rows);
    });
});

app.get("/projects/:category", (req, res, next) => {
    if (req.params.category == "undefined") {
        return;
    }
    database.all("SELECT id, title, creationDate, description, tags, bounty, category FROM projects WHERE category = ?", [req.params.category], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }

        res.status(200).json(rows);
    });
});

app.get("/delete/:privatekey", (req, res, next) => {
    if (req.params.privatekey == "undefined") {
        return;
    }
    database.all("SELECT * FROM projects WHERE privatekey = ?", [req.params.privatekey], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }

        if (rows.length == 0) {
            res.sendStatus(400);
        } else {
            database.all("DELETE FROM projects WHERE privatekey = ?", [req.params.privatekey], (err, rows) => {
                if (err) {
                    res.status(400).json({ "error": err.message });
                    return;
                }
                res.sendStatus(200);
            });
        }
    });
});

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Preventing crash..");
});