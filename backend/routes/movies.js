const express = require('express');
const router = express.Router();
const { getMovies, getPopularMovies, getMovieById, addMovie, searchMovies } = require('../controllers/movieController');
const { protect, authorizeAdmin } = require('../../middleware/authMiddleware');

router.get('/', getMovies);
router.get('/popular', getPopularMovies);
router.get('/search', searchMovies); // Debe ir antes de /:id para evitar conflicto de rutas
router.get('/:id', getMovieById);
router.post('/', protect, authorizeAdmin, addMovie); // Solo admin puede añadir películas

module.exports = router;