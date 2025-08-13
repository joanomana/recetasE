require('dotenv').config();
const mongoose = require('mongoose');

const conectarDB = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Recetario'; 
    try {
        await mongoose.connect(uri);

        console.log(`✅ Conectado a MongoDB: ${uri.includes('localhost') ? 'Local' : 'Atlas'}`);
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = conectarDB;