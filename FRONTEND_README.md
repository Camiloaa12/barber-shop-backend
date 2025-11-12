# Frontend - Barbershop Manager

Aplicación React + Vite para la gestión de barbería con dos dashboards: uno para barberos y otro para administradores.

## Requisitos previos

- Node.js v16+
- npm o yarn

## Instalación

1. Clonar el repositorio:
\`\`\`bash
git clone <tu-repo-frontend>
cd barbershop-frontend
\`\`\`

2. Instalar dependencias:
\`\`\`bash
npm install
\`\`\`

3. Crear archivo `.env.local` basado en `.env.example`:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Configurar URL de la API:
\`\`\`
VITE_API_BASE_URL=http://localhost:5000/api
\`\`\`

(Para producción: cambiar a tu URL de producción del backend)

## Ejecución

Modo desarrollo:
\`\`\`bash
npm run dev
\`\`\`

Modo producción (build):
\`\`\`bash
npm run build
\`\`\`

Preview del build:
\`\`\`bash
npm run preview
\`\`\`

## Estructura del proyecto

\`\`\`
barbershop-frontend/
├── src/
│   ├── pages/              # Páginas principales
│   ├── components/         # Componentes reutilizables
│   ├── context/            # Contexto de autenticación
│   ├── hooks/              # Hooks personalizados
│   ├── api/                # Cliente HTTP
│   ├── App.jsx             # Router principal
│   └── index.css           # Estilos globales
├── vite.config.js
└── .env.example
\`\`\`

## Flujo de autenticación

1. Usuario ingresa email y contraseña
2. Frontend envía credenciales a `/api/auth/login`
3. Backend valida y devuelve JWT token
4. Token se almacena en localStorage
5. Interceptor axios agrega token a todas las peticiones
6. Si rol es 'barbero' → Dashboard Barbero
7. Si rol es 'admin' → Dashboard Administrador

## Funcionalidades por rol

### Barbero
- Registrar cortes con cliente, monto, método de pago y observaciones
- Buscar y seleccionar clientes existentes
- Crear nuevos clientes sobre la marcha
- Ver historial de cortes del día
- Filtrar cortes por fecha
- Ver ingresos del día

### Administrador
- Ver estadísticas globales del día
- Ver desempeño de cada barbero
- Filtrar cortes por barbero, método de pago y fechas
- Exportar datos a CSV
- Ver tabla completa de transacciones

## Despliegue en Vercel

1. Conectar repositorio a Vercel
2. Configurar variables de entorno en Vercel dashboard
3. Asegurar que `npm run build` funciona correctamente
4. Desplegar

## Notas de desarrollo

- El token JWT expira en 7 días
- Los estilos usan Tailwind CSS v4
- Las peticiones a la API incluyen manejo de errores
- Se validan todos los campos de los formularios
- Las alertas de éxito/error desaparecen automáticamente
