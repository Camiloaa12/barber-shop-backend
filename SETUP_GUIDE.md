# Guía completa de configuración

## Paso 1: Preparar MongoDB Atlas

1. Crear cuenta en [mongodb.com](https://www.mongodb.com)
2. Crear un cluster gratuito
3. Crear un usuario de base de datos
4. Agregar tu IP a la whitelist
5. Obtener connection string (se verá algo como):
   \`\`\`
   mongodb+srv://username:password@cluster.mongodb.net/barbershop
   \`\`\`

## Paso 2: Configurar Backend

1. Clonar repositorio del backend
2. Instalar dependencias: `npm install`
3. Copiar `.env.example` a `.env`
4. Llenar variables de entorno:
   - `MONGO_URI`: Tu connection string de MongoDB
   - `JWT_SECRET`: Generar token seguro (min 32 caracteres)
   - `PORT`: 5000 (o el que prefieras)

5. Probar conexión:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Verificar que el servidor inicia correctamente

## Paso 3: Crear cuenta Admin

1. Con el backend corriendo, hacer POST a `/api/auth/register`:
   \`\`\`json
   {
     "name": "Admin",
     "lastName": "Manager",
     "email": "admin@barbershop.com",
     "password": "password123",
     "role": "admin"
   }
   \`\`\`

2. Puedes usar Postman, Thunder Client o curl

## Paso 4: Configurar Frontend

1. Clonar repositorio del frontend
2. Instalar dependencias: `npm install`
3. Crear `.env.local` con:
   \`\`\`
   VITE_API_BASE_URL=http://localhost:5000/api
   \`\`\`

4. Iniciar frontend:
   \`\`\`bash
   npm run dev
   \`\`\`

## Paso 5: Pruebas locales

1. Abrir `http://localhost:3000` en el navegador
2. Crear cuenta de barbero (botón Registrarse)
3. O iniciar sesión con admin:
   - Email: `admin@barbershop.com`
   - Password: `password123`

4. Probar las funcionalidades

## Paso 6: Despliegue en Vercel

### Backend
1. Opción 1: Usar Render.com (servicio específico para Node.js)
   - Conectar repositorio
   - Agregar variables de entorno
   - Desplegar

2. Opción 2: Usar Vercel con serverless functions
   - Estructura como serverless
   - Conectar a Vercel

### Frontend
1. Conectar repositorio a Vercel
2. Variables de entorno:
   \`\`\`
   VITE_API_BASE_URL=https://tu-backend.onrender.com/api
   \`\`\`
3. Desplegar

## Solución de problemas

### "Cannot connect to MongoDB"
- Verificar connection string en `.env`
- Verificar IP en whitelist de MongoDB Atlas
- Verificar que MongoDB Atlas está en línea

### "Token inválido"
- Limpiar localStorage en el navegador
- Cambiar JWT_SECRET requiere re-login
- Verificar que no haya espacios en blanco en JWT_SECRET

### "CORS error"
- Backend debe tener CORS habilitado (ya está en el código)
- Verificar que la URL del frontend en `.env` del frontend es correcta

### "API call fails"
- Verificar que backend está corriendo
- Verificar VITE_API_BASE_URL en `.env.local`
- Revisar la consola del navegador para ver el error completo
