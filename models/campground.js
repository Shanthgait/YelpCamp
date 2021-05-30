const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
})

const CamgroundSchema = new Schema(
    {
        title: String,
        price: Number,
        images: [ImageSchema],
        description: String,
        location: String,
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
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