const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Clave secreta para firmar los tokens (en producción debe estar en variables de entorno)
const SECRET_KEY = 'mi_clave_secreta_super_segura';

// Base de datos simulada de usuarios
const usuarios = [];

// Configuración de middleware
app.use(bodyParser.json());

// Ruta de registro
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Validar que se reciban email y password
  if (!email || !password) {
    return res.status(400).json({ 
      mensaje: 'Email y password son requeridos' 
    });
  }

  // Verificar si el usuario ya existe
  const usuarioExistente = usuarios.find(u => u.email === email);
  if (usuarioExistente) {
    return res.status(400).json({ 
      mensaje: 'El usuario ya existe' 
    });
  }

  // Crear nuevo usuario
  const nuevoUsuario = {
    id: usuarios.length + 1,
    email: email,
    password: password
  };

  usuarios.push(nuevoUsuario);

  res.status(201).json({ 
    mensaje: 'Usuario registrado exitosamente',
    usuario: { id: nuevoUsuario.id, email: nuevoUsuario.email }
  });
});

// Ruta de inicio de sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validar que se reciban email y password
  if (!email || !password) {
    return res.status(400).json({ 
      mensaje: 'Email y password son requeridos' 
    });
  }

  // Buscar el usuario
  const usuario = usuarios.find(u => u.email === email);

  // Verificar si el usuario existe
  if (!usuario) {
    return res.status(404).json({ 
      mensaje: 'Usuario no encontrado' 
    });
  }

  // Verificar la contraseña
  if (usuario.password !== password) {
    return res.status(401).json({ 
      mensaje: 'Contraseña incorrecta' 
    });
  }

  // Generar el token JWT
  const token = jwt.sign(
    { 
      userId: usuario.id, 
      email: usuario.email 
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  res.json({ 
    mensaje: 'Inicio de sesión exitoso',
    token: token 
  });
});

// Middleware para verificar JWT
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  // Verificar si existe el header de autorización
  if (!authHeader) {
    return res.status(401).json({ 
      mensaje: 'Token no proporcionado' 
    });
  }

  // Extraer el token (formato: "Bearer TOKEN")
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      mensaje: 'Formato de token inválido' 
    });
  }

  // Verificar el token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          mensaje: 'Token expirado' 
        });
      }
      return res.status(403).json({ 
        mensaje: 'Token inválido' 
      });
    }

    // Guardar la información del usuario en la request
    req.usuario = decoded;
    next();
  });
}

// Ruta protegida
app.get('/profile', authenticateJWT, (req, res) => {
  // Buscar información completa del usuario
  const usuario = usuarios.find(u => u.id === req.usuario.userId);

  if (!usuario) {
    return res.status(404).json({ 
      mensaje: 'Usuario no encontrado' 
    });
  }

  res.json({
    mensaje: 'Acceso autorizado al perfil',
    perfil: {
      id: usuario.id,
      email: usuario.email
    }
  });
});

// Ruta raíz para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'Servidor de autenticación JWT funcionando',
    rutas: {
      registro: 'POST /register',
      login: 'POST /login',
      perfil: 'GET /profile (requiere token)'
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});