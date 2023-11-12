let express = require('express');
let app = express();
const bP = require('body-parser');
const session = require('express-session');
let csurf = require('csurf');
const cP = require('cookie-parser');
const search = require("fs");

const port = process.env.PORT || 3000;
var guard = csurf({ cookie: true })
app.set('views', __dirname + '/views');
app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true,
}));

app.use(cP());
app.use(express.static("styles"));
app.use(express.urlencoded({ extended: true }));
app.use(bP.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.get('/brokenAccessControl', (req, res) => {
    res.render('brokenAccessControl',{user: req.session.user});
});

app.get('/',guard, (req, res) => {
    const currentUser = req.session.user 
    res.render('index', {currentUser});
});

app.get('/users', (req, res) => {
    const options = req.query.options;
    const data = search.readFileSync('userslist.json', 'utf8');
    var userData = JSON.parse(data);

    res.render('users', {options, userData});
});

app.post('/users', guard, (req, res) => {
    const data = search.readFileSync('userslist.json', 'utf8');
    const options = req.query.options;
    const userData = JSON.parse(data);

    res.render('users', {options, userData});
});


app.get('/message',guard,  (req, res) => {
    var message = req.query.message;
    const options = req.query.options;
      
    res.render('message', {message, options });
});

app.post('/message',guard,  (req, res) => {

    const message = req.body.message;
    const options = req.body.options;

    res.render('message', { message, options });
});


app.listen(port,  (req, res) => {
    console.log(`Listening on port ${port}!`);
});
