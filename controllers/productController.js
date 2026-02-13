const Product = require('../models/Product');

// Crear producto (solo admin)
const createProduct = async (req, res) => {
    try {
        const { name, code, price, description } = req.body;

        // Validar campos requeridos
        if (!name || !code || !price) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, código y precio son requeridos'
            });
        }

        // Verificar si el código ya existe
        const existingProduct = await Product.findOne({ code: code.toUpperCase() });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un producto con ese código'
            });
        }

        // Crear producto
        const product = await Product.create({
            name,
            code: code.toUpperCase(),
            price,
            description,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            product
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear producto'
        });
    }
};

// Obtener todos los productos
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('createdBy', 'username email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos'
        });
    }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('createdBy', 'username email');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener producto'
        });
    }
};

// Actualizar producto (solo admin)
const updateProduct = async (req, res) => {
    try {
        const { name, code, price, description } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        // Actualizar campos
        if (name) product.name = name;
        if (code) product.code = code.toUpperCase();
        if (price !== undefined) product.price = price;
        if (description !== undefined) product.description = description;

        await product.save();

        res.json({
            success: true,
            message: 'Producto actualizado exitosamente',
            product
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar producto'
        });
    }
};

// Eliminar producto (solo admin)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar producto'
        });
    }
};

// Subir imagen de producto (solo admin)
const uploadProductImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No se proporcionó ninguna imagen'
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        // Guardar ruta de la imagen
        product.image = `/uploads/products/${req.file.filename}`;
        await product.save();

        res.json({
            success: true,
            message: 'Imagen subida exitosamente',
            product
        });
    } catch (error) {
        console.error('Error al subir imagen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al subir imagen'
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadProductImage
};
