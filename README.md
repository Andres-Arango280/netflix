# 🎬 Netflix Clon - Aplicación Web Completa

Una aplicación web completa de streaming de películas inspirada en Netflix, construida con tecnologías modernas.

## 🚀 Características

- **Autenticación completa** - Registro e inicio de sesión
- **Roles de usuario** - Administrador y usuario normal
- **Panel de administración** - Para gestionar películas
- **Búsqueda en tiempo real** - Buscar películas por título o descripción
- **Películas populares** - Ordenadas por número de vistas
- **Reproductor de video** - Integración con YouTube, Vimeo y videos directos
- **Diseño responsive** - Adaptado para móviles y escritorio
- **API REST completa** - Backend robusto con Express.js
- **Base de datos MongoDB Atlas** - Almacenamiento en la nube

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con gradientes y animaciones
- **JavaScript (ES6+)** - Funcionalidad interactiva
- **Fetch API** - Comunicación con el backend

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB Atlas** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación con tokens
- **bcryptjs** - Hash de contraseñas
- **CORS** - Manejo de peticiones cross-origin

## 📋 Prerrequisitos

- Node.js 16.0.0 o superior
- npm 8.0.0 o superior
- Cuenta en MongoDB Atlas (gratuita)
- Navegador web moderno

## 🔧 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/netflix-clon.git
cd netflix-clon
```

### 2. Configurar el Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

Edita el archivo `.env` con tus datos de MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://tu_usuario:tu_password@cluster0.xxxxx.mongodb.net/netflix_clon?retryWrites=true&w=majority
JWT_SECRET=tu_jwt_secret_super_seguro_cambialo_en_produccion
PORT=5000
NODE_ENV=development
```

### 3. Configurar MongoDB Atlas

1. Ve a [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (M0 - gratuito)
4. Crea un usuario de base de datos
5. Configura Network Access (permite tu IP o 0.0.0.0/0 para desarrollo)
6. Obtén tu cadena de conexión y úsala en el archivo `.env`

### 4. Poblar la Base de Datos

```bash
# Ejecutar el script de seed para crear datos de ejemplo
npm run seed
```

### 5. Iniciar el Backend

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor estará disponible en: `http://localhost:5000`

### 6. Configurar el Frontend

```bash
# Volver al directorio raíz
cd ..

# La carpeta frontend debe tener esta estructura:
frontend/
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── index.html
├── login.html
├── register.html
├── home.html
├── admin.html
└── movie.html
```

### 7. Servir el Frontend

Puedes usar cualquiera de estos métodos:

**Opción A: Live Server (VS Code)**
- Instala la extensión "Live Server"
- Clic derecho en `index.html` → "Open with Live Server"

**Opción B: Python (si lo tienes instalado)**
```bash
cd frontend
python -m http.server 8000
```

**Opción C: Node.js http-server**
```bash
npm install -g http-server
cd frontend
http-server -p 8080
```

## 🔐 Credenciales de Prueba

Después de ejecutar `npm run seed`, puedes usar estas credenciales:

### Administrador
- **Email:** `admin@netflix.com`
- **Contraseña:** `admin123`
- **Permisos:** Puede añadir, editar y eliminar películas

### Usuario Normal
- **Email:** `user@demo.com`
- **Contraseña:** `user123`
- **Permisos:** Solo puede ver películas

## 📱 Uso de la Aplicación

### Para Usuarios Normales:

1. **Registro/Login:** Crear cuenta o iniciar sesión
2. **Explorar:** Ver películas populares y todas las películas
3. **Buscar:** Usar la barra de búsqueda en tiempo real
4. **Reproducir:** Hacer clic en cualquier película para verla

### Para Administradores:

1. **Login:** Usar credenciales de administrador
2. **Panel Admin:** Clic en el botón "Panel Admin"
3. **Añadir Películas:** Completar el formulario con:
   - Título de la película
   - Descripción
   - URL del video (YouTube embed, Vimeo, video directo)
   - URL de la miniatura/portada
4. **Gestionar:** Ver, editar o eliminar películas existentes

### Ejemplos de URLs para Videos:

**Videos de YouTube:**
```
https://www.youtube.com/embed/dQw4w9WgXcQ
```

**Videos de prueba gratuitos:**
```
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4
```

**Miniaturas de ejemplo:**
```
https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg
https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg
```

## 🌐 API Endpoints

### Autenticación
- `POST /api/register` - Registro de usuario
- `POST /api/login` - Inicio de sesión
- `GET /api/profile` - Perfil del usuario (requiere auth)

### Películas
- `GET /api/movies` - Obtener todas las películas
- `GET /api/movies/popular` - Películas más vistas
- `GET /api/movies/search?q=term` - Buscar películas
- `GET /api/movies/:id` - Obtener película específica
- `POST /api/movies` - Crear película (solo admin)
- `PUT /api/movies/:id` - Actualizar película (solo admin)
- `DELETE /api/movies/:id` - Eliminar película (solo admin)

### Utilidades
- `GET /api/health` - Estado del servidor

## 📁 Estructura del Proyecto

```
netflix-clon/
├── backend/
│   ├── server.js           # Servidor principal
│   ├── seed.js             # Script para poblar BD
│   ├── package.json        # Dependencias backend
│   ├── .env                # Variables de entorno
│   └── README.md           # Documentación backend
├── frontend/
│   ├── css/
│   │   └── styles.css      # Estilos CSS
│   ├── js/
│   │   └── main.js         # JavaScript principal
│   ├── index.html          # Página de inicio/redirección
│   ├── login.html          # Página de login
│   ├── register.html       # Página de registro
│   ├── home.html           # Página principal
│   ├── admin.html          # Panel de administración
│   └── movie.html          # Reproductor de películas
└── README.md               # Documentación principal
```

## 🔒 Seguridad

- **Contraseñas hasheadas** con bcryptjs (12 rounds)
- **JWT tokens** con expiración configurable
- **Validación de datos** en frontend y backend
- **Rate limiting** para prevenir ataques
- **CORS configurado** apropiadamente
- **Sanitización de inputs** para prevenir XSS

## 🎨 Características de Diseño

- **Tema oscuro** inspirado en Netflix
- **Gradientes modernos** y efectos visuales
- **Animaciones suaves** en hover y transiciones
- **Diseño responsive** para móviles y tablets
- **Cards interactivas** para películas
- **Feedback visual** para acciones del usuario

## 🐛 Solución de Problemas

### Error de conexión al backend
- Verifica que el backend esté corriendo en el puerto 5000
- Revisa la consola del navegador para errores de CORS

### Error de MongoDB
- Verifica tu cadena de conexión en `.env`
- Asegúrate de que tu IP esté en la whitelist de MongoDB Atlas
- Confirma que el usuario de BD tenga los permisos correctos

### Películas no cargan
- Verifica que las URLs de video sean embeds válidos
- Para YouTube: usar `/embed/` en lugar de `/watch?v=`
- Asegúrate de estar logueado correctamente

### No aparece el botón "Panel Admin"
- Verifica que el usuario tenga rol "admin"
- Ejecuta `npm run seed` para crear usuarios de prueba
- Revisa la consola del navegador para errores

## 🚀 Despliegue

### Backend (Heroku, Railway, etc.)
1. Configura las variables de entorno en tu plataforma
2. Asegúrate de que `NODE_ENV=production`
3. Usa un JWT_SECRET fuerte y único

### Frontend (Netlify, Vercel, etc.)
1. Actualiza la URL del API en `main.js`
2. Configura redirects para SPA si es necesario

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Roadmap Futuras Funcionalidades

- [ ] Sistema de favoritos
- [ ] Comentarios y reseñas
- [ ] Categorías de películas
- [ ] Subida de archivos para thumbnails
- [ ] Sistema de suscripciones
- [ ] Notificaciones push
- [ ] Lista de reproducción
- [ ] Historial de visualización
- [ ] Calificaciones de usuarios
- [ ] Recomendaciones personalizadas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Tu Nombre** - Desarrollo inicial - [@tu-github](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Inspirado en Netflix
- Icons by [Lucide](https://lucide.dev/)
- Videos de prueba por [Google](https://gstatic.com/gtv-videos-bucket/)
- MongoDB Atlas por el hosting gratuito

## 📞 Soporte

Si tienes preguntas o encuentras bugs:

1. Revisa esta documentación
2. Busca en los [Issues](https://github.com/tu-usuario/netflix-clon/issues)
3. Crea un nuevo issue si no encuentras solución

---

⭐ **¡Si te gusta este proyecto, dale una estrella!** ⭐

**¡Disfruta tu Netflix Clon!** 🎬🍿
