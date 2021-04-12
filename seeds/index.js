const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')

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

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random180 = Math.floor(Math.random()*180);
        const price = Math.floor(Math.random()*500)+1000;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            price,
            image: 'https://source.unsplash.com/collection/429524/800x600',
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia, iusto, enim voluptatibus qui maiores nesciunt vel delectus repudiandae modi quaerat cum error harum quidem culpa, veritatis fugiat minus excepturi corrupti.',
            location: `${cities[random180].city}, ${cities[random180].admin_name}`,
        })
        await camp.save();
    }
}

seedDB();
