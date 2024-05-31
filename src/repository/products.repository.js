const ProductDAO = require('../dao/mongo/products.dao');
const { ProductDTO } = require('../dto/product.dto');

class ProductRepository {
    constructor() {
        this.productDAO = new ProductDAO();
    }

    #validateAndFormatGetProductsParams(page, limit, sort, category, availability) {
        const query = {
            ...(category && { category }),
            ...(availability && { status: availability === 'true' })
        };

        const options = {
            limit: limit ? parseInt(limit) : 10,
            page: parseInt(page),
            sort: sort ? { price: sort } : undefined,
            lean: true
        };

        if (isNaN(page)) {
            throw new Error('Número de página no válido');
        }

        return { query, options };
    }

    #validateAndFormatAddProductsParams(title, description, price, thumbnail, code, status, stock, category) {
        try {
            const invalidOptions = isNaN(+price) || +price <= 0 || isNaN(+stock) || +stock < 0;

            if (!title || !description || !code || !category || invalidOptions) {
                throw new Error('Error al validar los datos');
            };

            const finalThumbnail = thumbnail ? thumbnail : 'Sin Imagen';

            if (typeof status === 'undefined' || status === true || status === 'true') {
                status = true;
            } else {
                status = false;
            }

            const newProduct = {
                title,
                description,
                price,
                thumbnail: finalThumbnail,
                code,
                status,
                stock,
                category
            }

            return newProduct;
        } catch (e) {
            console.error('Error al agregar un producto en el servicio.', e);
            throw new Error('Error al agregar un producto en el servicio.');
        }
    }

    async getProducts(page, limit, sort, category, availability) {
        const { query, options } = this.#validateAndFormatGetProductsParams(page, limit, sort, category, availability);
        const products = await this.productDAO.getProducts(query, options);
        return products.docs.map(product => new ProductDTO(product));
    }

    async getProductById(id) {
        const product = await this.productDAO.getProductById(id);
        return new ProductDTO(product);
    }

    async addProduct(productData) {
        const { title, description, price, thumbnail, code, status, stock, category } = productData
        const productHandler = this.#validateAndFormatAddProductsParams(title, description, price, thumbnail, code, status, stock, category)
        const product = await this.productDAO.addProduct(productHandler);
        return new ProductDTO(product);
    }

    async updateProduct(id, productData) {
        const updatedProduct = await this.productDAO.updateProduct(id, productData);
        return new ProductDTO(updatedProduct);
    }

    async deleteProduct(id) {
        return await this.productDAO.deleteProduct(id);
    }
}

module.exports = { ProductRepository };