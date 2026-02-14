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
    const tableBody = document.getElementById('productsTableBody');
    const countSpan = document.getElementById('productCount');

    if (countSpan) {
        countSpan.textContent = `Total: ${products.length} productos`;
    }

    if (products.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 3rem; color: #888;">
                    No hay productos registrados
                </td>
            </tr>`;
        return;
    }

    tableBody.innerHTML = products.map(product => `
        <tr>
            <td>
                <div class="table-product-info">
                    <img src="${product.image || '/assets/placeholder-produce.png'}" alt="${product.name}" class="table-product-img">
                    <div>
                        <div style="font-weight: 700; color: var(--text-primary);">${product.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${product.description ? product.description.substring(0, 40) + '...' : 'Fruta/Verdura fresca'}</div>
                    </div>
                </div>
            </td>
            <td style="color: var(--text-muted); font-family: monospace;">${product.code}</td>
            <td style="font-weight: 700; color: var(--text-primary);">$${product.price.toFixed(2)}</td>
            <td><span style="background: rgba(46, 204, 113, 0.1); color: var(--primary); padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; border: 1px solid rgba(46, 204, 113, 0.2);">${product.category || 'Verdura'}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon btn-edit" onclick="editProduct('${product._id}')">
                        <span style="font-size: 1rem;">✏️</span> Editar
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteProduct('${product._id}', '${product.name}')">
                        <span style="font-size: 1rem;">🗑️</span> Eliminar
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}


// Crear/actualizar producto
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = AuthService.getToken();
    const name = document.getElementById('productName').value;
    const code = document.getElementById('productCode').value;
    const price = document.getElementById('productPrice').value;
    const category = document.getElementById('productCategory').value;
    const description = document.getElementById('productDescription').value;

    const imageFile = document.getElementById('productImage').files[0];

    try {
        // Crear o actualizar producto
        const productData = { name, code, price, description, category };


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
            document.getElementById('productCategory').value = product.category || 'Verdura';
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
