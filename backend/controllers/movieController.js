const Movie = require('../models/movie');


// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 }); // Las más nuevas primero
        res.json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// @desc    Get popular movies (e.g., by views)
// @route   GET /api/movies/popular
// @access  Public
exports.getPopularMovies = async (req, res) => {
    try {
        // En una app real, podrías tener un algoritmo más sofisticado.
        // Aquí, simplemente ordenamos por 'views' de forma descendente.
        const popularMovies = await Movie.find().sort({ views: -1 }).limit(10); // Top 10
        res.json(popularMovies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// @desc    Get a single movie by ID
// @route   GET /api/movies/:id
// @access  Public
exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Película no encontrada' });
        }
        // Incrementa las vistas cada vez que se accede a la película
        movie.views += 1;
        await movie.save();
        res.json(movie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// @desc    Add a new movie
// @route   POST /api/movies
// @access  Private (Admin only)
exports.addMovie = async (req, res) => {
    const { title, description, url, thumbnail } = req.body;

    // Puedes obtener el ID del usuario que sube la película desde el token JWT
    // Esto se hará en el middleware de autenticación y se adjuntará a req.user
    const uploadedBy = req.user.id; 

    try {
        const newMovie = new Movie({
            title,
            description,
            url,
            thumbnail,
            uploadedBy
        });

        const movie = await newMovie.save();
        res.status(201).json(movie);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// @desc    Search movies by title
// @route   GET /api/movies/search?q=query
// @access  Public
exports.searchMovies = async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ message: 'Parámetro de búsqueda "q" requerido' });
    }
    try {
        const movies = await Movie.find({
            title: { $regex: query, $options: 'i' } // Búsqueda insensible a mayúsculas/minúsculas
        }).sort({ createdAt: -1 });
        res.json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};