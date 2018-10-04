var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
const express = require('express')
var cors = require('cors')
const uuid = require('uuid/v4')
const session = require('express-session')
var time = require('express-timestamp')

var parseForm = bodyParser.urlencoded({ extended: false });

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(time.init);

let userlist = {user: '', sessioniD: '', token: ''};

app.use(session({
    genid: (req) => {
      console.log('Inside the session middleware')
      console.log(req.sessionID);
      return uuid()
    },
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.post('/login', (req, res) => {
    if(req.body.username == "admin" && req.body.password == "admin") {
        userlist = {
            user: req.body.username,
            sessioniD: req.sessionID,
            token: req.sessionID + req.timestamp
        }
        res.send({sessioniD: userlist.sessioniD});
    }
});

app.get('/gettoken', function (req, res) {
    res.send({csrf: userlist.token});
});

app.post('/transfer', (req, res) => {
    if(req.headers.sid == userlist.sessioniD) {
        if(req.body.token == userlist.token) {
            res.send({result: 'Transacation complete'});
        }
        else {
            res.send({result: 'Invalid Token'});
        }
    }
    else {
        res.send({result: 'Invalid Cookie'});
    }
});

const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listening on port ${port}...`));