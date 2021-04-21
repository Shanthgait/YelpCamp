const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');

const CamgroundSchema = new Schema(
    {
        title: String,
        price: Number,
        image: String,
        description: String,
        location: String,
        time : { type : Date, default: Date.now },
        reviews: [{
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }],
    }
);

CamgroundSchema.post('findOneAndDelete', async (doc) => {
    if(doc){
        await Review.remove({
            _id: doc.reviews
        })
    }
});

module.exports = mongoose.model('Campground', CamgroundSchema);