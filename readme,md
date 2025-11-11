# Sistema de Autenticación JWT

Sistema básico de autenticación con JSON Web Tokens usando Node.js y Express.

## Instalación

```bash
npm init -y
npm install express jsonwebtoken body-parser
```

## Ejecución

```bash
node server.js
```

Servidor en: `http://localhost:3000`

## Endpoints

| Método | Ruta | Descripción | Requiere Auth |
|--------|------|-------------|---------------|
| GET | `/` | Info del servidor | No |
| POST | `/register` | Registrar usuario | No |
| POST | `/login` | Iniciar sesión | No |
| GET | `/profile` | Ver perfil | Sí |

## Uso con Postman

### 1. Registrar usuario
```
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "pass123"
}
```

### 2. Iniciar sesión
```
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "pass123"
}
```

Respuesta: `{ "token": "eyJhbGc..." }`

### 3. Acceder al perfil
```
GET /profile
Authorization: Bearer TOKEN_AQUI
```

## Códigos de respuesta

- `200` - Operación exitosa
- `201` - Usuario creado
- `400` - Datos inválidos
- `401` - No autorizado
- `403` - Token inválido
- `404` - Usuario no encontrado

## Notas

- Token expira en 1 hora
- Base de datos simulada en memoria