const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function debug() {
    try {
        console.log('CON_START');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('CON_OK');

        const count = await Product.countDocuments();
        console.log('COUNT:' + count);

        const products = await Product.find().limit(5).lean();
        console.log('PRODUCTS:' + JSON.stringify(products));

    } catch (err) {
        console.log('ERR:' + err.message);
    } finally {
        await mongoose.disconnect();
        console.log('FINISH');
        process.exit(0);
    }
}

debug();
