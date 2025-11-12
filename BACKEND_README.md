# Backend - Barbershop Manager

API REST desarrollada con Node.js, Express y MongoDB para la gestión de una plataforma de barbería.

## Requisitos previos

- Node.js v16+
- MongoDB Atlas (base de datos en la nube)

## Instalación

1. Clonar el repositorio:
\`\`\`bash
git clone <tu-repo-backend>
cd barbershop-backend
\`\`\`

2. Instalar dependencias:
\`\`\`bash
npm install
\`\`\`

3. Crear archivo `.env` basado en `.env.example`:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Configurar variables de entorno:
\`\`\`
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/barbershop
JWT_SECRET=tu_secreto_seguro_aqui_minimo_32_caracteres
PORT=5000
\`\`\`

## Ejecución

Modo desarrollo:
\`\`\`bash
npm run dev
\`\`\`

Modo producción:
\`\`\`bash
npm start
\`\`\`

El servidor estará disponible en `http://localhost:5000`

## Endpoints principales

### Autenticación
- `POST /api/auth/register` - Registrar nuevo barbero
- `POST /api/auth/login` - Iniciar sesión

### Clientes
- `GET /api/clients` - Buscar clientes
- `POST /api/clients` - Crear nuevo cliente

### Cortes
- `GET /api/cuts` - Obtener cortes (filtrados por barbero o admin)
- `POST /api/cuts` - Registrar nuevo corte

### Estadísticas (Solo Admin)
- `GET /api/stats` - Obtener estadísticas del día

### Barberos
- `GET /api/barbers` - Listar todos los barberos

## Estructura del proyecto

\`\`\`
barbershop-backend/
├── models/           # Esquemas de MongoDB
├── controllers/      # Lógica de negocio
├── routes/          # Definición de rutas
├── middleware/      # Autenticación y autorización
├── server.js        # Punto de entrada
└── .env.example     # Variables de entorno
\`\`\`

## Modelo de datos

### Usuario (Barbero/Admin)
- name, lastName, email, password, role, createdAt

### Cliente
- name, lastName, email, phone, createdAt

### Corte
- barberId, clientId, clientName, clientLastName, amount, paymentMethod, observations, createdAt

## Seguridad

- Las contraseñas se hashean con bcryptjs
- JWT para autenticación y autorización
- Validación de roles en todos los endpoints protegidos
- Manejo de errores consistente

## Despliegue en Vercel

1. Conectar repositorio a Vercel
2. Agregar variables de entorno en Vercel dashboard
3. Desplegar

Para API con Vercel, considera usar serverless functions o un servicio como Render para Node.js.
