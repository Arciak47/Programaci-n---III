const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Crear directorio de base de datos si no existe
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Inicializar base de datos
const dbPath = path.join(__dirname, 'users.db');
const db = new Database(dbPath);

// Crear tabla de usuarios si no existe
const createUsersTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.exec(sql);
  console.log('✓ Tabla de usuarios creada/verificada');
};

// Inicializar base de datos
createUsersTable();

// Funciones de base de datos
const dbFunctions = {
  // Crear usuario
  createUser: (username, email, hashedPassword) => {
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `);
    
    try {
      const result = stmt.run(username, email, hashedPassword);
      return { id: result.lastInsertRowid, username, email };
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new Error('El usuario o email ya existe');
      }
      throw error;
    }
  },

  // Buscar usuario por email
  findUserByEmail: (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  // Buscar usuario por username
  findUserByUsername: (username) => {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  },

  // Buscar usuario por ID
  findUserById: (id) => {
    const stmt = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  },

  // Obtener todos los usuarios (sin passwords)
  getAllUsers: () => {
    const stmt = db.prepare('SELECT id, username, email, created_at FROM users');
    return stmt.all();
  }
};

module.exports = dbFunctions;
