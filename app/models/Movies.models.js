const mongoose = require('mongoose');
const movieSchema = mongoose.Schema(
    {
        MovieName : String,
        leadActor : String,
        actress :String,
        yearOfRelease: Number,
        director : String
},{
    timestamp : true
}
);
const Movie = mongoose.model('movie', movieSchema);
module.exports = Movie;