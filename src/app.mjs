import express from 'express';
import dotenv from 'dotenv';
import { UserRepository } from './repository/user.repository.mjs';

dotenv.config();

const app = express();
const userRepository = new UserRepository();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, age, email, password } = req.body;
        const user = await userRepository.registerUser(firstName, lastName, age, email, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { accessToken, userPayload } = await userRepository.loginUser(email, password);
        res.status(200).json({ accessToken, user: userPayload });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/reset-password', async (req, res) => {
    try {
        const { email } = req.body;
        const handlerPassToken = await userRepository.sendMailToResetPassword(email);
        res.status(200).json({ handlerPassToken });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/update-password', async (req, res) => {
    try {
        const { urlToken, token, newPassword, confirmPassword } = req.body;
        const updatedUser = await userRepository.resetPassword(urlToken, token, newPassword, confirmPassword);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
