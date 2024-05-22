const { Products } = require('../../models');
const { ProductService } = require('../../services/products.services');

class daoProducts {

    constructor() { }

    async prepare() {
        
        //  chequea
        if (Products.db.readyState !== 1) {
            throw new Error('must connect to mongodb!')
        }
    }

    async getProducts(page, limit, sort, category, availability) {
        try {
            const { query, options } = await new ProductService().validateAndFormatGetProductsParams(page, limit, sort, category, availability);

            const allProducts = await Products.paginate(query, options);

            if (page > allProducts.totalPages) {
                throw new Error('La página no existe');
            }

            const status = allProducts ? 'success' : 'error';
            const prevLink = allProducts.hasPrevPage ? `/products?page=${allProducts.prevPage}` : null;
            const nextLink = allProducts.hasNextPage ? `/products?page=${allProducts.nextPage}` : null;

            const result = {
                status,
                payload: allProducts.docs,
                totalPages: allProducts.totalPages,
                prevPage: allProducts.prevPage,
                nextPage: allProducts.nextPage,
                page: allProducts.page,
                hasPrevPage: allProducts.hasPrevPage,
                hasNextPage: allProducts.hasNextPage,
                prevLink,
                nextLink
            };
            return result;
        } catch (error) {
            throw new Error('Error al obtener los productos');
        }
    }


    async getProductById(id) {
        try {
            // Buscar el producto por su ID utilizando findOne
            const product = await Products.findOne({ _id: id });

            if (product) {
                return product;
            } else {
                throw new Error('Not Found: El ID solicitado no existe.');
            }
        } catch (error) {
            //  error que ocurra durante la consulta
            console.error('Error al obtener el producto por ID:', error);
            throw new Error('Error al obtener el producto por ID');
        }
    }


    // Agregar 1 nuevo producto
    async addProduct(title, description, price, thumbnail, code, status, stock, category) {
        const product = await new ProductService().validateAndFormatAddProduct(title, description, price, thumbnail, code, status, stock, category);

        try {
            const newProduct = await Products.create({
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                code: product.code,
                status: product.status,
                stock: product.stock,
                category: product.category
            });

            console.log('Producto agregado correctamente');
            return newProduct
        } catch (error) {
            console.error('Error al agregar el producto desde DB:', error);
            throw new Error('Error al agregar el producto desde DB');
        }
    }

    async updateProduct(id, fieldsToUpdate) {
        try {
            // Verificar los campos para actualizar
            const areFieldsPresent = Object.keys(fieldsToUpdate).length > 0;

            if (!areFieldsPresent) {
                throw new Error('No se proporcionaron campos para actualizar');
            }

            // Actualizar el producto
            const updatedProduct = await Products.updateOne({ _id: id }, { $set: fieldsToUpdate });

            if (updatedProduct.nModified === 0) {
                throw new Error('No se encontró el producto para actualizar');
            }

            return updatedProduct;
        } catch (error) {
            console.error('Error al actualizar el producto desde DB:', error);
            throw new Error('Error al actualizar el producto desde DB');
        }
    }

    async deleteProduct(productId) {
        try {
            await Products.deleteOne({ _id: productId });
        } catch (error) {
            throw new Error('Error al eliminar el producto en la base de datos');
        }
    }
}

module.exports = daoProducts;