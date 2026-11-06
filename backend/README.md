# API de Mi Ahorro

API FastAPI para la demo local. Los datos de precios y empleos incluidos son ilustrativos y no son vigentes.

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

La documentación interactiva queda disponible en `http://localhost:8000/docs`.

## Endpoints

- `GET /api/health`
- `GET /api/products`
- `POST /api/shopping-plan`
- `GET /api/jobs`
- `POST /api/jobs/match`
- `POST /api/assistant/cv`
- `POST /api/assistant/interview`

Configura `CORS_ORIGINS` con una lista de orígenes separados por coma al desplegar. No envíes datos personales reales a esta demo.
