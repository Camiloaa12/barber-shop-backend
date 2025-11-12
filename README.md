# Barber Shop Backend

Backend API para el sistema de gestión de barbería. Desarrollado con Express.js y MongoDB.

## Características

- Autenticación con JWT
- Gestión de usuarios (Barberos y Administradores)
- CRUD de clientes
- Registro y seguimiento de cortes
- Estadísticas de ingresos diarios
- Control de acceso basado en roles

## Requisitos

- Node.js v18+
- MongoDB Atlas (o MongoDB local)

## Instalación

1. Clona el repositorio
\`\`\`bash
git clone https://github.com/tu-usuario/barber-shop-backend.git
cd barber-shop-backend
\`\`\`

2. Instala las dependencias
\`\`\`bash
npm install
\`\`\`

3. Configura las variables de entorno
\`\`\`bash
cp .env.example .env
\`\`\`

4. Edita `.env` con tus credenciales de MongoDB y JWT_SECRET

## Variables de Entorno

\`\`\`
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/barbershop
JWT_SECRET=tu_clave_secreta_jwt
PORT=5000
\`\`\`

## Ejecución

### Desarrollo
\`\`\`bash
npm run dev
\`\`\`

### Producción
\`\`\`bash
npm start
\`\`\`

El servidor correrá en `http://localhost:5000`

## Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Clientes
- `GET /api/clients` - Obtener clientes (con búsqueda)
- `POST /api/clients` - Crear nuevo cliente

### Cortes
- `GET /api/cuts` - Obtener cortes
- `POST /api/cuts` - Registrar nuevo corte

### Estadísticas (Admin)
- `GET /api/stats` - Obtener estadísticas del día

### Barberos
- `GET /api/barbers` - Obtener lista de barberos

## Autenticación

Todos los endpoints (excepto login y register) requieren un token JWT en el header:
\`\`\`
Authorization: Bearer <tu_token_jwt>
\`\`\`

## Roles

- **barbero**: Puede registrar cortes y ver sus propias estadísticas
- **admin**: Acceso total a todas las operaciones

## Licencia

MIT
