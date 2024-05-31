require('dotenv').config();
const { hashPassword, isValidPassword } = require('../utils/hashing');
const { generateToken } = require('../middlewares/jwt.middleware');
const { ObjectId } = require('mongodb');
const { UserDTO } = require('../dto/userToken.dto');
const UserDAO = require('../dao/mongo/daoUsers');
const CartDAO = require('../dao/mongo/daoCarts');
const jwtMiddleware = require('../middlewares/jwt.middleware'); // Asegúrate de que esta ruta es correcta

const UserTokenDTO = require('../dto/userToken.dto'); // Asegúrate de que esta ruta es correcta






class UserRepository {

    daoUser;
    #cartDAO;
    #adminUser;
    #superAdminUser;

    constructor() {
        this.daoUser = new UserDAO();
        this.#cartDAO = new CartDAO();

        this.#adminUser = {
            _id: 'admin',
            firstName: 'Miguel',
            lastName: 'Gonzalez',
            age: 50,
            email: process.env.ADMIN_USER,
            password: process.env.ADMIN_PASS,
            rol: 'admin',
            cart: { _id: new ObjectId(process.env.ADMIN_CART) }
        };

        this.#superAdminUser = {
            _id: 'superAdmin',
            firstName: 'Pablo',
            lastName: 'Garcia',
            age: 54,
            email: process.env.SADMIN_USER,
            password: process.env.SADMIN_PASS,
            rol: 'superAdmin',
            cart: { _id: new ObjectId(process.env.SADMIN_CART) }
        };
    }

    #validateLoginCredentials(email, password) {
        if (!email || !password) {
            throw new Error('Debe ingresar su usuario y contraseña');
        }
    }

    async #generateNewUser(firstName, lastName, age, email, password, cart) {
        this.#validateLoginCredentials(email, password);
        if (age <= 0) {
            throw new Error('La edad debe ser mayor a 1');
        }
        const hashedPassword = hashPassword(password);

        const user = {
            firstName: firstName || 'Usuario',
            lastName: lastName || 'Sin Identificar',
            age: age ? parseInt(age) : "",
            email,
            password: hashedPassword,
            cart
        };

        return user;
    }

    #generateAccessToken(user) {
        return generateToken({
            email: user.email,
            id: user._id,
            rol: user.rol,
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            cart: user.cart,
        });
    }

    async registerUser(firstName, lastName, age, email, password) {
        if (email === this.#adminUser.email || email === this.#superAdminUser.email) {
            throw new Error('Cannot register admin or super admin user this way');
        }

        const existingUser = await this.daoUser.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const cart = await this.#cartDAO.addCart({ products: [] });
        const user = await this.#generateNewUser(firstName, lastName, age, email, password, cart);

        return await this.daoUser.create(user);
    }

    async loginUser(email, password) {
        this.#validateLoginCredentials(email, password);

        let user;

        if (email === this.#adminUser.email && password === this.#adminUser.password) {
            user = this.#adminUser;
        } else if (email === this.#superAdminUser.email && password === this.#superAdminUser.password) {
            user = this.#superAdminUser;
        } else {
            user = await this.daoUser.findByEmail(email);

            if (!user || !isValidPassword(password, user.password)) {
                throw new Error('Invalid credentials');
            }
        }

        const userPayload = new UserDTO(user);

        const accessToken = this.#generateAccessToken(userPayload);

        return { accessToken, userPayload };
    }

    async resetPassword(email, password) {
        this.#validateLoginCredentials(email, password);
        await this.daoUser.updatePassword(email, hashPassword(password));
    }

    async githubLogin(profile) {
        const user = await this.daoUser.findByEmail(profile._json.email);

        if (!user) {
            const fullName = profile._json.name;
            const firstName = fullName.substring(0, fullName.lastIndexOf(' '));
            const lastName = fullName.substring(fullName.lastIndexOf(' ') + 1);
            const age = 18;
            const password = '123';

            const newUser = await this.registerUser(firstName, lastName, age, profile._json.email, password);
            const accessToken = this.#generateAccessToken(newUser);

            return { accessToken, user: newUser };
        }

        const accessToken = this.#generateAccessToken(user);
        return { accessToken, user };
    }

    async deleteUser(email) {
        const user = await this.daoUser.findByEmail(email);
        if (user) {
            await this.#cartDAO.deleteCartById(user.cart);
            await this.daoUser.deleteByEmail(email);
        }
    }

    async getUserById(id) {
        return await this.daoUser.findById(id);
    }
}

module.exports = { UserRepository };