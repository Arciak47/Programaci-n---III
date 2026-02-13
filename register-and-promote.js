const http = require('http');

function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, body });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function setup() {
    try {
        const email = 'final_admin@test.com';
        const password = 'Password123!';
        const username = 'final_admin';

        console.log('1. Registrando usuario...');
        const regRes = await request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { username, email, password });

        console.log('Registro:', regRes.body);

        console.log('\n2. Promoviendo a admin...');
        const promRes = await request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/make-admin',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, { email });

        console.log('Promoción:', promRes.body);

    } catch (error) {
        console.error('Error:', error);
    }
}

setup();
