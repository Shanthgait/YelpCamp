const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const engine = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/reviews');
const {campgroundSchema} = require('./schemas.js');

//connect to mongo db
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const app = express();

//middleware 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Parse request body when POST is sent
app.use(express.urlencoded({extended: true}));
//PUT and DELETE 
app.use(methodOverride('_method'));
//Templating engine ejs mate
app.engine('ejs', engine);

//validation middleware
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }  
}

//REST API's
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', catchAsync(async(req, res) => {
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', {campgrounds});
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds', validateCampground, catchAsync(async(req, res) => {  
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
}));

app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async(req, res) => {
    const { id }  = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async(req, res) => {
    const { id }  = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { message = 'Something went wrong', statusCode = 500 } = err;
    res.status(statusCode);
    res.render('campgrounds/error', {err});
});

app.post('/campgrounds/:id/reviews', catchAsync(async (req, res) => {
    const { id } = req.params;
    const {body, rating} = req.body.review;
    const review = new Review({body, rating});
    const campground = await Campground.findById(id);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.listen(3000, () => {
    console.log("Yelp Server listening on port 3000");
});


