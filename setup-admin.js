const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const setupAdmin = async () => {
    try {
        console.log('Intentando conectar a MongoDB...');
        // Usar las mismas opciones que la app principal si es necesario
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✓ Conectado a MongoDB');

        const email = 'admin@test.com';
        const password = 'Password123!';
        const username = 'admin_user';

        // Eliminar si existe para empezar limpio
        await User.deleteOne({ email });
        console.log('Usuario anterior eliminado (si existía)');

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear admin
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        console.log('✓ Usuario admin creado/restaurado:', user.email);
        console.log('✓ Rol:', user.role);

        await mongoose.connection.close();
        console.log('Conexión cerrada');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

setupAdmin();
