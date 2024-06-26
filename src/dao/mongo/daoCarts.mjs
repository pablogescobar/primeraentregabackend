// daoCarts.mjs

import { CustomError } from '../../utils/errors/customErrors.mjs';

class DaoCarts {
    #carts;

    constructor() {
        this.#carts = [];
    }

    async addCart(cart) {
        try {
            this.#carts.push(cart);
            return cart;
        } catch (error) {
            throw CustomError.createError({
                name: 'Error al crear el carrito',
                cause: 'Ocurrió un error al intentar crear el carrito en la base de datos',
                message: 'No se pudo crear el carrito',
                code: ErrorCodes.CART_CREATE_ERROR,
                otherProblems: error
            });
        }
    }
}

export { DaoCarts };
