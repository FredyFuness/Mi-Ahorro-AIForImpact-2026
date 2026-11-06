# 💚 Mi Ahorro | AI for Impact 2026

**Tecnología con propósito: mejores decisiones de compra y más oportunidades laborales para familias salvadoreñas.**

![Estado](https://img.shields.io/badge/Estado-Prototipo%20MVP-187653) ![NAUFest](https://img.shields.io/badge/NAUFest-2026-24475b) ![Challenge](https://img.shields.io/badge/AIForImpact-Completado-77b255)

Mi Ahorro es un proyecto para ayudar a las personas a organizar compras de productos básicos según un presupuesto y explorar oportunidades para generar ingresos.

## Estado del proyecto

El repositorio ahora incluye un **prototipo navegable** en React + TypeScript y una API de demostración en FastAPI. Permite recorrer los flujos de presupuesto y lista, ejemplos de ofertas, recomendaciones basadas en reglas y preparación de CV/entrevista.

Los precios, cargos y empresas son **datos ilustrativos**. No se conectan a comercios ni a vacantes activas. Las recomendaciones usan reglas transparentes; todavía no hay modelo generativo, cuentas, persistencia, validación con usuarios ni despliegue público.

## Ejecutar localmente

Abre dos terminales desde la raíz del repositorio.

### 1. API

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Interfaz

```bash
cd frontend
npm install
npm run dev
```

Abre el enlace local que muestra Vite (normalmente `http://localhost:5173`). Si la API no está iniciada, la interfaz funciona con ejemplos locales y muestra un aviso.

## Verificación

```bash
cd backend
python -m pip install -r requirements.txt
python -m pytest -q

cd ../frontend
npm install
npm run build
```

GitHub Actions ejecuta las pruebas de API y compila el frontend en cada pull request hacia `main`.

## Documentación

- [Propuesta](docs/PROPUESTA.md) — problema, personas beneficiarias y objetivo.
- [Arquitectura](docs/ARQUITECTURA.md) — componentes y límites técnicos.
- [Hoja de ruta](docs/ROADMAP.md) — avance real y pendientes.
- [Diseño inicial](docs/WIREFRAMES.md) — pantallas y flujo del prototipo.
- [Historias de usuario](docs/HISTORIAS_USUARIO.md) — casos y aceptación.
- [Guía de validación](docs/VALIDACION_USUARIOS.md) — tareas para sesiones futuras.
- [Límites de la demo](docs/LIMITACIONES_DEMO.md) — datos de ejemplo y requisitos antes de producción.
- [Fuentes consultadas](docs/FUENTES.md) — portales oficiales y de empleo que sirven para validar información actual.
- [Publicación](docs/PUBLICACION.md) — pasos para Pages y alojamiento backend.
- [Reconocimiento](docs/RECONOCIMIENTO.md) — información del Challenge #AIForImpact.

El flujo para publicar manualmente la interfaz en GitHub Pages está preparado en Actions. Requiere habilitar GitHub Pages con fuente **GitHub Actions** antes de ejecutarlo. El backend FastAPI necesitará un hosting independiente para tener datos compartidos.

## Reconocimiento

**Fredy Funes** completó satisfactoriamente el **Challenge #AIForImpact de NAUFest 2026**, experiencia cocreada con **HP** y certificada por **Junior Achievement Americas**. La insignia acredita completar el desafío; no indica haber ganado el primer lugar.

## Autor

**Fredy Funes** · [GitHub](https://github.com/FredyFuness)
