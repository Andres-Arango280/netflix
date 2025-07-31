const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Importar modelos
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://tu_usuario:tu_password@cluster0.mongodb.net/netflix_clon?retryWrites=true&w=majority';

// Esquemas (copiados del server.js)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    url: { type: String, required: true },
    thumbnail: { type: String, required: true },
    views: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Movie = mongoose.model('Movie', movieSchema);

// Datos de ejemplo
const sampleUsers = [
    {
        name: 'Administrador',
        email: 'admin@netflix.com',
        password: 'admin123',
        role: 'admin'
    },
    {
        name: 'Usuario Demo',
        email: 'user@demo.com',
        password: 'user123',
        role: 'user'
    }
];

const sampleMovies = [
    {
        title: 'Inception',
        description: 'Un ladrón que roba secretos corporativos a través del uso de tecnología de sueños compartidos se le da la tarea inversa de plantar una idea en la mente de un CEO.',
        url: 'https://www.youtube.com/embed/YoHD9XEInc0',
        thumbnail: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
        views: 150
    },
    {
        title: 'The Matrix',
        description: 'Un hacker informático aprende de misteriosos rebeldes sobre la verdadera naturaleza de su realidad y su papel en la guerra contra sus controladores.',
        url: 'https://www.youtube.com/embed/vKQi3bBA1y8',
        thumbnail: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
        views: 200
    },
    {
        title: 'Interstellar',
        description: 'Un equipo de exploradores viaja a través de un agujero de gusano en el espacio en un intento de asegurar la supervivencia de la humanidad.',
        url: 'https://www.youtube.com/embed/zSWdZVtXT7E',
        thumbnail: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
        views: 180
    },
    {
        title: 'The Dark Knight',
        description: 'Cuando el Guasón emerge para crear estragos y caos en la gente de Gotham, Batman debe aceptar una de las pruebas psicológicas y físicas más grandes.',
        url: 'https://www.youtube.com/embed/EXeTwQWrcwY',
        thumbnail: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
        views: 250
    },
    {
        title: 'Pulp Fiction',
        description: 'Las vidas de dos sicarios de la mafia, un boxeador, la esposa de un gángster y un par de bandidos se entrelazan en cuatro historias de violencia y redención.',
        url: 'https://www.youtube.com/embed/s7EdQ4FqbhY',
        thumbnail: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
        views: 120
    },
    {
        title: 'Forrest Gump',
        description: 'Las presidencias de Kennedy y Johnson, los eventos de Vietnam, Watergate y otros eventos históricos se desarrollan desde la perspectiva de un hombre de Alabama.',
        url: 'https://www.youtube.com/embed/bLvqoHBptjg',
        thumbnail: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQ1MjEwNDA@._V1_.jpg',
        views: 300
    },
    {
        title: 'Avatar',
        description: 'Un ex-marine parapléjico es enviado a la luna Pandora en una misión única, pero se encuentra dividido entre seguir órdenes y proteger el mundo que siente como su hogar.',
        url: 'https://www.youtube.com/embed/5PSNL1qE6VY',
        thumbnail: 'https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_.jpg',
        views: 280
    },
    {
        title: 'Titanic',
        description: 'Un aristócrata de diecisiete años se enamora de un amable pero pobre artista a bordo del lujoso y desafortunado R.M.S. Titanic.',
        url: 'https://www.youtube.com/embed/2e-eXJ6HgkQ',
        thumbnail: 'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg',
        views: 350
    }
];

async function seedDatabase() {
    try {
        console.log('🔄 Conectando a MongoDB Atlas...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Conectado a MongoDB Atlas');

        // Limpiar base de datos existente
        console.log('🧹 Limpiando base de datos...');
        await User.deleteMany({});
        await Movie.deleteMany({});

        // Crear usuarios
        console.log('👥 Creando usuarios...');
        const createdUsers = [];
        
        for (const userData of sampleUsers) {
            const hashedPassword = await bcrypt.hash(userData.password, 12);
            const user = new User({
                ...userData,
                password: hashedPassword
            });
            const savedUser = await user.save();
            createdUsers.push(savedUser);
            console.log(`✅ Usuario creado: ${userData.email} (${userData.role})`);
        }

        // Buscar el admin para asignar como creador de las películas
        const adminUser = createdUsers.find(user => user.role === 'admin');

        // Crear películas
        console.log('🎬 Creando películas...');
        for (const movieData of sampleMovies) {
            const movie = new Movie({
                ...movieData,
                createdBy: adminUser._id
            });
            await movie.save();
            console.log(`✅ Película creada: ${movieData.title}`);
        }

        console.log('\n🎉 ¡Base de datos poblada exitosamente!');
        console.log('\n📊 Resumen:');
        console.log(`👥 Usuarios creados: ${createdUsers.length}`);
        console.log(`🎬 Películas creadas: ${sampleMovies.length}`);
        
        console.log('\n🔐 Credenciales de prueba:');
        console.log('👤 Administrador:');
        console.log('   Email: admin@netflix.com');
        console.log('   Password: admin123');
        console.log('👤 Usuario normal:');
        console.log('   Email: user@demo.com');
        console.log('   Password: user123');

    } catch (error) {
        console.error('❌ Error poblando la base de datos:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔐 Conexión a base de datos cerrada');
        process.exit(0);
    }
}

// Ejecutar el seed
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase };