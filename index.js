const cookieParser = require('cookie-parser');
const express = require('express');
const envpath=require('dotenv').config({path:__dirname+'/.env'})
const env = require('./config/enviroment');
const app = express();
const port = 8000;
const db = require('./config/mongoose');
//set up session-cookie
const session = require('express-session');
const passport = require('passport');
const passportJWT = require('./config/passport-jwt-strategy');
const passportLocal = require('./config/passport-local-strategy');
//for flash messages
const flash = require('connect-flash');
//for google login
const passportGoogle = require('./config/passport-google-oauth2-strategy');
//use for storing cookie in db
const MongoStore = require('connect-mongo')(session);
//set up sass
const sassMiddleware = require('node-sass-middleware');
//using middleware we made
const customMware = require('./config/middleware');


//setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listen on port 5000')
const path = require('path');
console.log(env.name)
if (env.name == 'development') {
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}
//setting up layouts
const expressLayouts = require('express-ejs-layouts');

app.use(expressLayouts);
// accesing the request
app.use(express.urlencoded({ extended: true }));
// setting the static files
app.use(express.static(env.asset_path));
//make the uploads path available
app.use('/uploads', express.static(__dirname + '/uploads'));
//exctracting link tag and script tag
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
// set up cookie-parser
app.use(cookieParser());




// setting up for view engine
app.set("view engine", 'ejs');
app.set('views', './views');
// mongo store is used to store the session cokkie in the db
app.use(session({
    name: 'codieal',
    //change before deployment
    secret: env.session_cookie_key,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: "disabled"
    }, function(err) {
        console.log(err || 'çonnect-mongo setup ok');
    })
}));
app.use(passport.initialize());

app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
// use express router
app.use('/', require('./routes'));

app.listen(port, function(err) {
    if (err) {
        console.log(`Error in running the server:${err}`);
    }
    console.log(`server is running on port:${port}`);
});