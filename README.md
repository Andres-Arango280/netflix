# Clon de Netflix

Interfaz tipo Netflix hecha con React: registro, inicio de sesión y una página principal con sección destacada y carruseles de películas.

## Tecnologías

| Parte | Tecnología |
| --- | --- |
| Interfaz | React 18 (Create React App) |
| Estado de sesión | Context API (`AuthContext`) |
| Peticiones HTTP | Axios |
| Navegación | React Router 6 |

## Funcionalidades

- Registro e inicio de sesión, con cambio entre ambas vistas
- Página principal visible solo con sesión iniciada
- Sección destacada (`HeroSection`) y carruseles de películas (`MovieCarousel`, `MovieCard`)
- Componentes reutilizables de interfaz (`Button`, `Input`, `Header`, `Footer`)

## Estructura

```
src/
├── components/
│   ├── common/   # Header y Footer
│   ├── movie/    # HeroSection, MovieCarousel, MovieCard
│   └── ui/       # Button, Input
├── context/      # AuthContext: estado de la sesión
├── data/         # Catálogo de películas de ejemplo
├── pages/        # HomePage, LoginPage, RegisterPage
└── utils/        # Constantes
```

## Cómo ejecutarlo

Necesitas Node.js 18 o superior.

```bash
git clone https://github.com/Andres-Arango280/netflix.git
cd netflix
npm install
cp .env.example .env
npm start
```

La aplicación abre en `http://localhost:3000`.

## Otra versión

La rama `master` tiene una versión anterior con backend en Node.js, Express y MongoDB (modelos de usuarios y películas, autenticación con JWT) y un frontend en HTML, CSS y JavaScript.

## Autor

Brahian Andrés Osorio Arango — [GitHub](https://github.com/Andres-Arango280)
