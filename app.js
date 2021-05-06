const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')
const User = require('./models/user');

//connect to mongo db
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const sessionCfg = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const app = express();

//view engine middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Parse request body when POST is sent
app.use(express.urlencoded({extended: true}));
//PUT and DELETE 
app.use(methodOverride('_method'));

app.use(session(sessionCfg));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Templating engine ejs mate
app.engine('ejs', engine);

//Server static assets
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//routers
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

//Error handling middleware
app.use((err, req, res, next) => {
    const { message = 'Something went wrong', statusCode = 500 } = err;
    res.status(statusCode);
    res.render('campgrounds/error', {err});
});

app.listen(3000, () => {
    console.log("Yelp Server listening on port 3000");
});


