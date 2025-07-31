const API_URL = 'http://localhost:5000/api'; // Asegúrate de que coincida con tu puerto del backend

document.addEventListener('DOMContentLoaded', () => {
    // General UI elements
    const messageDiv = document.getElementById('message');
    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole'); // Limpiar también el rol
            window.location.href = 'login.html';
        });
    }

    // Function to display messages
    function showMessage(msg, type = 'error') {
        if (messageDiv) {
            messageDiv.textContent = msg;
            messageDiv.className = `message ${type}`;
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'message';
            }, 3000);
        }
    }

    // --- Authentication (Login/Register) ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            try {
                const res = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userRole', data.user.role); // Guardar el rol del usuario
                    window.location.href = 'home.html';
                } else {
                    showMessage(data.message, 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showMessage('Error al conectar con el servidor', 'error');
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = registerForm.name.value;
            const email = registerForm.email.value;
            const password = registerForm.password.value;

            try {
                const res = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();

                if (res.ok) {
                    showMessage('Registro exitoso. ¡Ahora puedes iniciar sesión!', 'success');
                    registerForm.reset();
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showMessage(data.message, 'error');
                }
            } catch (error) {
                console.error('Register error:', error);
                showMessage('Error al conectar con el servidor', 'error');
            }
        });
    }

    // --- Home Page Logic ---
    const popularMoviesContainer = document.getElementById('popularMovies');
    const allMoviesContainer = document.getElementById('allMovies');
    const searchInput = document.getElementById('searchMovie');
    const adminPanelBtn = document.getElementById('adminPanelBtn');

    if (popularMoviesContainer && allMoviesContainer) {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');

        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // Mostrar el botón de Admin si el usuario es admin
        if (adminPanelBtn && userRole === 'admin') {
            adminPanelBtn.style.display = 'block';
            adminPanelBtn.addEventListener('click', () => {
                window.location.href = 'admin.html';
            });
        }

        async function fetchMovies(url, container, isSearch = false) {
            try {
                const res = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const movies = await res.json();

                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('userRole');
                        window.location.href = 'login.html';
                    }
                    throw new Error(movies.message || 'Error al cargar películas');
                }

                displayMovies(movies, container);

            } catch (error) {
                console.error(`Error fetching movies from ${url}:`, error);
                // Si es una búsqueda, no mostrar un error grande, solo vaciar
                if (!isSearch) showMessage(`Error: ${error.message}`, 'error');
                if (container) container.innerHTML = '<p>No se pudieron cargar las películas.</p>';
            }
        }

        function displayMovies(movies, container) {
            if (!container) return; // Asegúrate de que el contenedor exista
            container.innerHTML = ''; // Limpiar antes de añadir
            if (movies.length === 0) {
                container.innerHTML = '<p>No hay películas disponibles.</p>';
                return;
            }
            movies.forEach(movie => {
                const movieCard = document.createElement('a'); // Usar 'a' para que sea clickeable
                movieCard.href = `movie.html?id=${movie._id}`;
                movieCard.classList.add('movie-card');
                movieCard.innerHTML = `
                    <img src="${movie.thumbnail || 'https://via.placeholder.com/200x150?text=No+Image'}" alt="${movie.title}">
                    <div class="movie-card-info">
                        <h3>${movie.title}</h3>
                        <p>${movie.description}</p>
                    </div>
                `;
                container.appendChild(movieCard);
            });
        }

        // Cargar películas al iniciar la página
        fetchMovies(`${API_URL}/movies/popular`, popularMoviesContainer);
        fetchMovies(`${API_URL}/movies`, allMoviesContainer);

        // Búsqueda en tiempo real
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('keyup', () => {
                clearTimeout(searchTimeout);
                const query = searchInput.value.trim();
                if (query.length > 2) { // Buscar solo si hay al menos 3 caracteres
                    searchTimeout = setTimeout(() => {
                        fetchMovies(`${API_URL}/movies/search?q=${encodeURIComponent(query)}`, allMoviesContainer, true);
                    }, 500); // Pequeño retardo para no sobrecargar el servidor
                } else if (query.length === 0) {
                    fetchMovies(`${API_URL}/movies`, allMoviesContainer, true); // Mostrar todas si se borra la búsqueda
                }
            });
        }
    }

    // --- Movie Page Logic ---
    const moviePlayer = document.getElementById('moviePlayer');
    const movieTitleElem = document.getElementById('movieTitle');
    const movieTitlePageElem = document.getElementById('movieTitlePage');
    const movieDescriptionElem = document.getElementById('movieDescription');

    if (moviePlayer && movieTitleElem && movieDescriptionElem) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');

        if (movieId) {
            fetchMovie(movieId, token);
        } else {
            console.error('No movie ID found in URL.');
            showMessage('No se encontró ID de película.', 'error');
            setTimeout(() => window.location.href = 'home.html', 2000);
        }

        async function fetchMovie(id, token) {
            try {
                const res = await fetch(`${API_URL}/movies/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const movie = await res.json();

                if (res.ok) {
                    movieTitlePageElem.textContent = movie.title;
                    movieTitleElem.textContent = movie.title;
                    movieDescriptionElem.textContent = movie.description;
                    moviePlayer.src = movie.url; // Asigna la URL del video
                } else {
                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem('token');
                        localStorage.removeUser('userRole');
                        window.location.href = 'login.html';
                    }
                    showMessage(movie.message || 'Error al cargar la película', 'error');
                    setTimeout(() => window.location.href = 'home.html', 2000);
                }
            } catch (error) {
                console.error('Error fetching movie:', error);
                showMessage('Error al conectar con el servidor para obtener la película', 'error');
                setTimeout(() => window.location.href = 'home.html', 2000);
            }
        }
    }

    // --- Admin Panel Logic ---
    const addMovieForm = document.getElementById('addMovieForm');
    const adminMoviesList = document.getElementById('adminMoviesList');

    if (addMovieForm && adminMoviesList) {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');

        if (!token || userRole !== 'admin') {
            alert('Acceso denegado. Solo administradores.');
            window.location.href = 'home.html';
            return;
        }

        // Function to load movies in admin panel
        async function loadAdminMovies() {
            try {
                const res = await fetch(`${API_URL}/movies`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const movies = await res.json();

                if (res.ok) {
                    adminMoviesList.innerHTML = '';
                    movies.forEach(movie => {
                        const li = document.createElement('li');
                        li.style.cssText = 'margin-bottom: 10px; padding: 10px; border: 1px solid #333; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;';
                        li.innerHTML = `
                            <div>
                                <strong>${movie.title}</strong>
                                <p style="margin: 5px 0; color: #ccc; font-size: 0.9em;">${movie.description.substring(0, 100)}...</p>
                                <small style="color: #999;">Vistas: ${movie.views}</small>
                            </div>
                            <div>
                                <button onclick="viewMovie('${movie._id}')" style="margin-right: 5px; padding: 5px 10px; background: #e50914; color: white; border: none; border-radius: 3px; cursor: pointer;">Ver</button>
                                <button onclick="deleteMovie('${movie._id}')" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">Eliminar</button>
                            </div>
                        `;
                        adminMoviesList.appendChild(li);
                    });
                } else {
                    showMessage(movies.message || 'Error al cargar películas de admin', 'error');
                }
            } catch (error) {
                console.error('Error loading admin movies:', error);
                showMessage('Error al conectar con el servidor para películas de admin', 'error');
            }
        }

        // Función global para ver película
        window.viewMovie = function(movieId) {
            window.open(`movie.html?id=${movieId}`, '_blank');
        };

        // Función global para eliminar película
        window.deleteMovie = async function(movieId) {
            if (confirm('¿Estás seguro de que quieres eliminar esta película?')) {
                try {
                    const res = await fetch(`${API_URL}/movies/${movieId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();

                    if (res.ok) {
                        showMessage('Película eliminada con éxito', 'success');
                        loadAdminMovies(); // Recargar la lista
                    } else {
                        showMessage(data.message || 'Error al eliminar película', 'error');
                    }
                } catch (error) {
                    console.error('Delete movie error:', error);
                    showMessage('Error al conectar con el servidor', 'error');
                }
            }
        };

        // Add movie form submission - CORREGIDO: usar IDs correctos
        addMovieForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('movieTitle').value;
            const description = document.getElementById('movieDescription').value;
            const url = document.getElementById('movieUrl').value;
            const thumbnail = document.getElementById('movieThumbnail').value;

            try {
                const res = await fetch(`${API_URL}/movies`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ title, description, url, thumbnail })
                });
                const data = await res.json();

                if (res.ok) {
                    showMessage('Película añadida con éxito', 'success');
                    addMovieForm.reset();
                    loadAdminMovies(); // Recargar la lista de películas
                } else {
                    showMessage(data.message || 'Error al añadir película', 'error');
                }
            } catch (error) {
                console.error('Add movie error:', error);
                showMessage('Error al conectar con el servidor', 'error');
            }
        });

        loadAdminMovies(); // Load movies when admin panel is accessed
    }
});