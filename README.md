# Raíces Frescas - Frutas y Verduras de Calidad 🥦🍎

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Plataforma de comercio electrónico diseñada para la gestión y venta de productos agrícolas frescos. Este proyecto implementa una arquitectura robusta de **Node.js + Express** con seguridad basada en **JWT** y persistencia en **MongoDB Atlas**.

---

## 📌 Tabla de Contenidos
1. [Instalación y Configuración](#-instalación-y-configuración)
2. [Hitos del Proyecto (Evaluaciones)](#-hitos-del-proyecto-evaluaciones)
3. [Guía de Pruebas](#-guía-de-pruebas)
4. [Seguridad y Tecnologías](#-seguridad-y-tecnologías)

---

## � Instalación y Configuración

### 1. Requisitos Previos
- Node.js v16+ instalado.
- Cuenta en MongoDB Atlas con una base de datos creada.

### 2. Pasos de Instalación
```bash
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
cd auth-system
npm install
```

### 3. Variables de Envorno (.env)
Crea un archivo `.env` en la raíz con el siguiente formato:
```env
PORT=3000
MONGODB_URI=tu_cadena_de_conexion_mongo_atlas
JWT_SECRET=tu_clave_secreta_privada
JWT_EXPIRES_IN=24h
```

---

## � Hitos del Proyecto (Evaluaciones)

El repositorio utiliza **Git Tags** para facilitar la revisión histórica de cada entrega:

| Evaluación | Tag | Descripción Principal |
| :--- | :--- | :--- |
| **E2: Autenticación** | `v2.0-auth` | Sistema de login seguro, registros y encriptación de claves. |
| **E3: CRUD** | `v3.0-products` | Gestión de inventario, roles (Admin/User) y carga de imágenes. |
| **E4: Carrito** | `v4.0-complete` | Carrito de compras persistente y flujo de checkout final. |

---

## 🧪 Guía de Pruebas

### Evaluación 2: Login y Seguridad
- **Registro**: Acceder a `/register.html`. Las contraseñas se almacenan usando **Bcryptjs**.
- **Autenticación**: Acceder a `/login.html`. Tras el éxito, se genera un **JWT** almacenado en `LocalStorage`.
- **Protección**: Las rutas de la API bajo `/api/auth/profile` requieren el token en los headers.

### Evaluación 3: Productos e Inventario
- **Roles**: 
  - `Admin`: Puede acceder a `/admin-products.html` para crear, editar y eliminar.
  - `User`: Acceso solo al `/catalog.html` para visualización.
- **Imagen**: Soporte para subida de imágenes locales o enlaces (ver `/uploads`).

### Evaluación 4: Carrito y Operaciones
- **Persistencia**: El carrito se guarda en `LocalStorage` vinculado al ID único del usuario.
- **Operaciones**: Botones de `+`, `–` y `Vaciar Carrito` con recálculo automático del total.
- **Simulación de Pago**: Botón de finalizar compra con feedback visual (Toasts).

---

## 💻 Seguridad y Tecnologías

- **Capa de Seguridad**: Helmet.js (HTTP headers), Express-Rate-Limit, CORS.
- **Middleware**: Validación de esquemas con Mongoose.
- **Frontend**: Vanilla JS (ES6) con arquitectura de componentes moderna y diseño **Premium Dark Mode**.

---

**Desarrollado por:** [Tu Nombre] - 2026
