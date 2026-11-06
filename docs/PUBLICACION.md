# Publicación de la demo

## GitHub Pages (frontend)

1. Integra el cambio en `main`.
2. En GitHub, abre **Settings → Pages** y selecciona **GitHub Actions** como fuente.
3. En **Actions**, ejecuta **Publicar demo en GitHub Pages** desde `main`.
4. Comprueba las cuatro secciones en móvil y escritorio. En Pages se usa el modo sin backend y los datos continúan identificados como ejemplos.

## API

GitHub Pages no ejecuta FastAPI. Para conectar una API desplegada:

1. Publica `backend/` en un servicio Python compatible con ASGI.
2. Configura `CORS_ORIGINS` con el dominio exacto de Pages.
3. Añade `VITE_API_BASE_URL` al build del frontend y cambia el cliente para usar la URL HTTPS del backend.
4. No publiques claves ni datos personales en GitHub. Revisa autenticación, límites y privacidad antes de ofrecer persistencia.

La demo frontend funciona con datos de ejemplo si no encuentra la API.
