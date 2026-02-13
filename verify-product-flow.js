const http = require('http');

// Función helper para hacer requests
function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        body: JSON.parse(body)
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        body: body
                    });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function verifyFlow() {
    try {
        console.log('1. Iniciando sesión como admin...');
        const loginRes = await request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            email: 'final_admin@test.com',
            password: 'Password123!'
        });

        if (!loginRes.body.success) {
            throw new Error(`Login falló: ${loginRes.body.message}`);
        }

        const token = loginRes.body.token;
        console.log('✓ Login exitoso. Rol:', loginRes.body.user.role);

        console.log('\n2. Creando producto de prueba...');
        const productRes = await request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/products',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }, {
            name: 'Ron Añejo Especial',
            code: 'RON001',
            price: 45.50,
            description: 'Ron añejo de 7 años, sabor suave y dulce.'
        });

        if (productRes.statusCode === 201) {
            console.log('✓ Producto creado exitosamente:', productRes.body.product.name);
        } else {
            console.log('⚠ Respuesta al crear producto:', productRes.body);
        }

        console.log('\n3. Verificando catálogo público...');
        const catalogRes = await request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/products',
            method: 'GET'
        });

        if (catalogRes.body.success) {
            console.log(`✓ Catálogo obtenido. Total productos: ${catalogRes.body.count}`);
            const product = catalogRes.body.products.find(p => p.code === 'RON001');
            if (product) {
                console.log('✓ Producto encontrado en catálogo:', product.name);
            } else {
                console.error('❌ El producto creado no aparece en el catálogo');
            }
        }

    } catch (error) {
        console.error('❌ Error en verificación:', error.message);
    }
}

verifyFlow();
