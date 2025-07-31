const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000', 
        'http://127.0.0.1:3000', 
        'http://localhost:5500',
        'http://localhost:8080',
        'http://127.0.0.1:5500',
        'http://127.0.0.1:8080',
        'null' // Para archivos abiertos directamente en el navegador
    ],
    credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requests por IP cada 15 minutos
});
app.use('/api/', limiter);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://tu_usuario:tu_password@cluster0.mongodb.net/netflix_clon?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'tu_jwt_secret_super_seguro_cambialo';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

// User Schema
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Movie Schema
const movieSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true,
        maxlength: 200
    },
    description: { 
        type: String, 
        required: true,
        maxlength: 1000
    },
    url: { 
        type: String, 
        required: true,
        match: [/^https?:\/\/.+/, 'URL inválida']
    },
    thumbnail: { 
        type: String, 
        required: true,
        match: [/^https?:\/\/.+/, 'URL de miniatura inválida']
    },
    views: { 
        type: Number, 
        default: 0 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const User = mongoose.model('User', userSchema);
const Movie = mongoose.model('Movie', movieSchema);

// JWT Middleware
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token de acceso requerido' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
    }
};

// Admin Middleware
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
    next();
};

// Routes

// Registro de usuario
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validaciones
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hash de la contraseña
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear usuario
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ 
            message: 'Usuario creado exitosamente',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Login de usuario
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos' });
        }

        // Buscar usuario
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener todas las películas
app.get('/api/movies', authenticateToken, async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.json(movies);
    } catch (error) {
        console.error('Get movies error:', error);
        res.status(500).json({ message: 'Error al obtener películas' });
    }
});

// Obtener películas populares (más vistas)
app.get('/api/movies/popular', authenticateToken, async (req, res) => {
    try {
        const movies = await Movie.find().sort({ views: -1 }).limit(10);
        res.json(movies);
    } catch (error) {
        console.error('Get popular movies error:', error);
        res.status(500).json({ message: 'Error al obtener películas populares' });
    }
});

// Buscar películas
app.get('/api/movies/search', authenticateToken, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length === 0) {
            return res.status(400).json({ message: 'Término de búsqueda requerido' });
        }

        const movies = await Movie.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        res.json(movies);
    } catch (error) {
        console.error('Search movies error:', error);
        res.status(500).json({ message: 'Error al buscar películas' });
    }
});

// Obtener una película específica
app.get('/api/movies/:id', authenticateToken, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Película no encontrada' });
        }

        // Incrementar vistas
        movie.views += 1;
        await movie.save();

        res.json(movie);
    } catch (error) {
        console.error('Get movie error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID de película inválido' });
        }
        res.status(500).json({ message: 'Error al obtener la película' });
    }
});

// Crear nueva película (solo admins)
app.post('/api/movies', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { title, description, url, thumbnail } = req.body;

        if (!title || !description || !url || !thumbnail) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const movie = new Movie({
            title,
            description,
            url,
            thumbnail,
            createdBy: req.user._id
        });

        await movie.save();

        res.status(201).json({ 
            message: 'Película creada exitosamente',
            movie 
        });
    } catch (error) {
        console.error('Create movie error:', error);
        res.status(500).json({ message: 'Error al crear la película' });
    }
});

// Actualizar película (solo admins)
app.put('/api/movies/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { title, description, url, thumbnail } = req.body;
        
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            { title, description, url, thumbnail },
            { new: true, runValidators: true }
        );

        if (!movie) {
            return res.status(404).json({ message: 'Película no encontrada' });
        }

        res.json({ 
            message: 'Película actualizada exitosamente',
            movie 
        });
    } catch (error) {
        console.error('Update movie error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID de película inválido' });
        }
        res.status(500).json({ message: 'Error al actualizar la película' });
    }
});

// Eliminar película (solo admins)
app.delete('/api/movies/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);

        if (!movie) {
            return res.status(404).json({ message: 'Película no encontrada' });
        }

        res.json({ message: 'Película eliminada exitosamente' });
    } catch (error) {
        console.error('Delete movie error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID de película inválido' });
        }
        res.status(500).json({ message: 'Error al eliminar la película' });
    }
});

// Obtener perfil del usuario
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                createdAt: req.user.createdAt
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Error al obtener el perfil' });
    }
});

// Ruta de health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Netflix Clon API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Middleware para rutas no encontradas
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware de manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📍 API disponible en: http://localhost:${PORT}/api`);
    console.log(`💾 Base de datos: MongoDB Atlas`);
});