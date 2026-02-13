const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const emailToMakeAdmin = 'yoghercc@gmail.com';

async function setAdmin() {
    try {
        console.log('Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado exitosamente.');

        const user = await User.findOne({ email: emailToMakeAdmin });

        if (!user) {
            console.error(`Usuario con email ${emailToMakeAdmin} no encontrado.`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`¡Éxito! El usuario ${user.username} (${user.email}) ahora es administrador.`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

setAdmin();
