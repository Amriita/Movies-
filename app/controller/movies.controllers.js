const Movie = require('../models/Movies.models');

// Create and Save a new movie
exports.create = (req, res) => {
      //validate user 
      if(!req.body.MovieName){
          return res.status(404).send({
              message : "MovieName Cannot be Empty"
          });
      }
      //create a movie
      const movie = new Movie({
          MovieName : req.body.MovieName,
          leadActor : req.body.leadActor || "Amar Upadhyay",
          actress : req.body.actress,
          yearOfRelease : req.body.yearOfRelease,
          director : req.body.director
      });
      //save a movie
      movie.save()
      .then(movie =>{
          res.send(movie);
        })
      .catch(err => {
          res.status(505).send({
            message: err.message || "Some error occurred while creating the Movie."
          });
      });
};

// Retrieve and return all movies from the database.
exports.findAll = (req, res) => {
    Movie.find()
    .then(movie => {
        res.send(movie);
    })
    .catch(err => {
        res.status(500).send({
            message :  err.message || "Some error occurred while retrieving Movies."
        });
    });
};

// Find a single movie with a movieId
exports.findOne = (req, res) => {
    const movie_id = req.params.moviesId;
    console.log("Helo",movie_id)

    Movie.find({MovieName:movie_id})
    .then(movie => {
        if(!movie){
        return res.status(404).send({
            message: "Movie not found with id " });            
    }
    res.send(movie);
    })
    .catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Movie not found with id " + movie_id });                
        }
        return res.status(500).send({
            message: "Error retrieving movie with id " + movie_id});
    });
};

// Update a movie identified by the movieId in the request
exports.update = (req, res) => {
     // Validate Request
    if(!req.body.MovieName) {
        return res.status(400).send({
            message: "MovieName can not be empty"
        });
    }

    // Find note and update it with the request body
    Movie.findByIdAndUpdate(req.params.moviesId, {
         MovieName : req.body.MovieName,
         leadActor : req.body.leadActor || "Amar Upadhyay",
          actress : req.body.actress,
          yearOfRelease : req.body.yearOfRelease,
          director : req.body.director
    }, {new: true})
    .then(movie => {
        if(!movie) {
            return res.status(404).send({
                message: "Movie not found with id " + req.params.moviesId
            });
        }
        res.send(movie);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Movie not found with id " + req.params.moviesId
            });                
        }
        return res.status(500).send({
            message: "Error updating Moviee with id " + req.params.moviesId
        });
    });
};

// Delete a movie with the specified movieId in the request
exports.delete = (req, res) => {
    Movie.findByIdAndUpdate(req.params.moviesId,{
        isDeleted : 1
    })
    .then(movie => {
        if(!movie) {
            return res.status(404).send({
                message: "Movie not found with id " + req.params.moviesId
            });
        }
        res.send({message: "Movie deleted successfully!"});
   
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Moviee not found with id " + req.params.moviesId
            });                
        }
        return res.status(500).send({
            message: "Could not delete Movie with id " + req.params.moviesId
        });
    });
};