// admin-products.js
const API_URL = '/api';
let currentProductId = null;

// Verificar autenticación y rol de admin
document.addEventListener('DOMContentLoaded', () => {
    if (!AuthService.isAuthenticated()) {
        window.location.href = '/login.html';
        return;
    }

    const user = AuthService.getUser();
    if (!user || user.role !== 'admin') {
        alert('Acceso denegado. Solo administradores pueden acceder a esta página.');
        window.location.href = '/catalog.html';
        return;
    }

    loadProducts();
    setupImagePreview();
});

// Preview de imagen
function setupImagePreview() {
    const imageInput = document.getElementById('productImage');
    const preview = document.getElementById('imagePreview');

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Cargar productos
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();

        if (data.success) {
            displayProducts(data.products);
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Mostrar productos
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    const countSpan = document.getElementById('productCount');

    if (countSpan) {
        countSpan.textContent = `${products.length} producto(s) en total`;
    }

    if (products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p class="text-muted">No hay productos registrados</p>
            </div>`;
        return;
    }

    grid.innerHTML = products.map(product => `
        <div class="premium-card">
            <div class="card-image-wrapper" style="aspect-ratio: 1; height: 180px;">
                ${product.image ?
            `<img src="${product.image}" alt="${product.name}">` :
            '<span style="font-size: 3rem; opacity: 0.2;">🍾</span>'}
                <div class="card-badge" style="font-size: 0.6rem;">${product.code}</div>
            </div>
            <div class="card-content" style="padding: 1rem;">
                <h3 class="card-title" style="font-size: 1rem; margin-bottom: 0.25rem;">${product.name}</h3>
                <div class="card-price" style="font-size: 1.25rem; margin-top: 0.5rem;">$${product.price.toFixed(2)}</div>
                
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button class="premium-btn premium-btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="editProduct('${product._id}')">
                        Editar
                    </button>
                    <button class="premium-btn premium-btn-danger" style="padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="deleteProduct('${product._id}', '${product.name}')">
                        Borrar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Crear/actualizar producto
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = AuthService.getToken();
    const name = document.getElementById('productName').value;
    const code = document.getElementById('productCode').value;
    const price = document.getElementById('productPrice').value;
    const description = document.getElementById('productDescription').value;
    const imageFile = document.getElementById('productImage').files[0];

    try {
        // Crear o actualizar producto
        const productData = { name, code, price, description };

        let response;
        if (currentProductId) {
            // Actualizar
            response = await fetch(`${API_URL}/products/${currentProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });
        } else {
            // Crear nuevo
            response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });
        }

        const data = await response.json();

        if (data.success) {
            const productId = data.product._id;

            // Si hay imagen, subirla
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                await fetch(`${API_URL}/products/${productId}/upload-image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
            }

            alert(`Producto ${currentProductId ? 'actualizado' : 'creado'} exitosamente`);
            resetForm();
            loadProducts();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar producto');
    }
});

// Editar producto
async function editProduct(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        const data = await response.json();

        if (data.success) {
            const product = data.product;
            currentProductId = id;

            document.getElementById('formTitle').textContent = 'Editar Producto';
            document.getElementById('productName').value = product.name;
            document.getElementById('productCode').value = product.code;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productDescription').value = product.description || '';

            if (product.image) {
                document.getElementById('imagePreview').innerHTML =
                    `<img src="${product.image}" alt="${product.name}">`;
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Eliminar producto
async function deleteProduct(id, name) {
    if (!confirm(`¿Estás seguro de eliminar "${name}"?`)) return;

    const token = AuthService.getToken();

    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            alert('Producto eliminado exitosamente');
            loadProducts();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar producto');
    }
}

// Resetear formulario
function resetForm() {
    currentProductId = null;
    document.getElementById('formTitle').textContent = 'Crear Nuevo Producto';
    document.getElementById('productForm').reset();
    document.getElementById('imagePreview').innerHTML = '<span style="color: #888;">Sin imagen</span>';
}

// Cerrar sesión
function logout() {
    AuthService.logout();
}
