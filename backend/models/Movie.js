const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    url: { // URL del video (ej. embed de YouTube)
        type: String,
        required: true
        // Puedes agregar validación para que sea una URL válida
    },
    thumbnail: { // URL de la imagen de la miniatura
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Movie', MovieSchema);