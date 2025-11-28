# 💈 SoftBarber - Backend API

API REST para la gestión de barbería construida con Node.js, Express y MongoDB.

## 🚀 Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas
- **Nodemailer** - Envío de emails

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar servidor
npm start
```

## 🌐 Despliegue

Esta API está desplegada en **Render**.

**API URL:** [Tu URL de Render aquí]

## 🔗 Repositorios Relacionados

- **Frontend:** [barber-shop-mern](https://github.com/Camiloaa12/barber-shop-mern)

## 📝 Características

- ✅ Autenticación JWT
- ✅ Gestión de usuarios (Admin/Barbero)
- ✅ CRUD de cortes
- ✅ Validación de datos
- ✅ Middleware de autenticación
- ✅ Manejo de errores centralizado
- ✅ CORS configurado

## 🛠️ Configuración

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=5000
MONGODB_URI=tu_mongodb_uri
JWT_SECRET=tu_jwt_secret
EMAIL_USER=tu_email
EMAIL_PASS=tu_password_email
```

## 📡 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Usuarios
- `GET /api/users` - Obtener usuarios (Admin)
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (Admin)

### Cortes
- `GET /api/cuts` - Obtener todos los cortes
- `POST /api/cuts` - Registrar nuevo corte
- `GET /api/cuts/:id` - Obtener corte por ID
- `PUT /api/cuts/:id` - Actualizar corte
- `DELETE /api/cuts/:id` - Eliminar corte

## 🔒 Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación mediante JWT
- Validación de datos en todas las rutas
- CORS configurado para dominios específicos

## 📄 Licencia

Este proyecto es privado y de uso personal.
