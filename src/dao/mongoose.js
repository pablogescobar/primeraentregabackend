const mongoose = require('mongoose');

// URL de conexión a tu base de datos de MongoDB Atlas
const mongoURI = 'URL_DE_CONEXIÓN';

// Opciones de conexión (opcional)
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Otras opciones de configuración según tu caso
};

// Establecer la conexión a MongoDB Atlas
mongoose.connect(mongoURI, options)
    .then(() => console.log('Conexión establecida con MongoDB Atlas'))
    .catch(err => console.error('Error al conectar con MongoDB Atlas:', err));
