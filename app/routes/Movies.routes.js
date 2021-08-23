module.exports = (app) => {
    const movies = require('../controller/movies.controllers');

    // Create a new movie
    app.post('/movies', movies.create);

    // Retrieve all movie
    app.get('/movies', movies.findAll);

    // Retrieve a single movie with movieeId
    app.get('/movies/:moviesId', movies.findOne);

    // Update a  moviee with movieeId
    app.put('/movies/:moviesId', movies.update);

    // Delete a Note with noteId
    app.delete('/movies/:moviesId', movies.delete);
};