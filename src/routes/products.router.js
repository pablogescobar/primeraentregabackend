router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, query, sort } = req.query;
        const products = await manager.getProducts();

        //  filtros y orden
        let filteredProducts = products;
        if (query) {
            //  por categoría o disponibilidad             
        }
        if (sort) {
            // Ordenar ascendente o descendente por precio
            //  de ordenamiento aquí
        }

        
        const totalPages = Math.ceil(filteredProducts.length / limit);
        const prevPage = Math.max(page - 1, 1);
        const nextPage = Math.min(page + 1, totalPages);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${prevPage}` : null;
        const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${nextPage}` : null;

        // Obtener los productos de la página actual
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const currentProducts = filteredProducts.slice(startIndex, endIndex);

        res.json({
            status: 'success',
            products: currentProducts,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
