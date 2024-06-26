import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Esquema de usuario de Mongoose
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Middleware para hashear la contraseña antes de guardarla
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Modelo de usuario de Mongoose
const User = mongoose.model('User', userSchema);

export class DaoUsers {
    constructor() {
        // Conexión a la base de datos
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    // Registrar un nuevo usuario
    async registerUser(firstName, lastName, age, email, password) {
        const user = new User({ firstName, lastName, age, email, password });
        await user.save();
        return user;
    }

    // Iniciar sesión de usuario
    async loginUser(email, password) {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Usuario no encontrado');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Contraseña incorrecta');

        const accessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { accessToken, userPayload: { firstName: user.firstName, lastName: user.lastName, email: user.email } };
    }

    // Enviar correo para restablecer la contraseña
    async sendMailToResetPassword(email) {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Usuario no encontrado');

        // Aquí iría el código para enviar el correo con el token
        const handlerPassToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        return handlerPassToken;
    }

    // Restablecer contraseña
    async resetPassword(urlToken, token, newPassword, confirmPassword) {
        if (newPassword !== confirmPassword) throw new Error('Las contraseñas no coinciden');

        const decoded = jwt.verify(urlToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) throw new Error('Usuario no encontrado');

        const isTokenValid = jwt.verify(token, process.env.JWT_SECRET);
        if (!isTokenValid) throw new Error('Token inválido');

        user.password = newPassword;
        await user.save();
        return user;
    }
}
