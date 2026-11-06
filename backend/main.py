"""Mi Ahorro demo API.

All seeded prices and opportunities in this module are illustrative placeholders.
They are not live quotes or active job advertisements.
"""

from __future__ import annotations

import os
import re
from typing import Annotated

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(
    title="Mi Ahorro API",
    description="API de demostración; precios y vacantes son datos ilustrativos.",
    version="0.1.0",
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class Product(BaseModel):
    id: str
    name: str
    presentation: str
    category: str
    example_price: float = Field(gt=0)
    currency: str = "USD"
    is_demo: bool = True
    source: str = "Ejemplo demostrativo — sin comercio verificado"
    observed_at: str | None = None


class ShoppingPlanRequest(BaseModel):
    budget: float = Field(gt=0, le=1500)
    household_size: int = Field(ge=1, le=20)
    product_ids: list[str] = Field(min_length=1, max_length=12)


class PlannedItem(BaseModel):
    product_id: str
    name: str
    presentation: str
    quantity: int
    unit_price: float
    subtotal: float
    source: str
    observed_at: str | None
    is_demo: bool


class ShoppingPlanResponse(BaseModel):
    budget: float
    budget_per_person: float
    estimated_total: float
    remaining: float
    household_size: int
    items: list[PlannedItem]
    note: str


class MatchRequest(BaseModel):
    skills: list[Annotated[str, Field(min_length=1, max_length=40)]] = Field(
        default_factory=list, max_length=20
    )
    location: str = Field(default="", max_length=80)


class CVHelpRequest(BaseModel):
    text: str = Field(min_length=10, max_length=5000)
    target_role: str = Field(default="", max_length=100)


class InterviewHelpRequest(BaseModel):
    target_role: str = Field(min_length=2, max_length=100)


PRODUCTS: list[Product] = [
    Product(id="rice", name="Arroz", presentation="1 libra", category="Granos", example_price=0.80),
    Product(id="beans", name="Frijoles", presentation="1 libra", category="Granos", example_price=1.15),
    Product(id="eggs", name="Huevos", presentation="media docena", category="Proteínas", example_price=1.35),
    Product(id="milk", name="Leche", presentation="1 litro", category="Lácteos", example_price=1.20),
    Product(id="corn", name="Maíz", presentation="1 libra", category="Granos", example_price=0.55),
    Product(id="oil", name="Aceite", presentation="botella pequeña", category="Cocina", example_price=1.65),
]

JOBS = [
    {
        "id": "demo-support",
        "title": "Asistente de soporte técnico (ejemplo)",
        "company": "Organización de ejemplo",
        "location": "San Miguel",
        "modality": "Híbrido",
        "skills": ["soporte técnico", "atención al cliente", "comunicación"],
        "source_url": "https://example.com/",
        "source_name": "Enlace de demostración",
        "is_demo": True,
        "active_status": "No es una vacante activa",
    },
    {
        "id": "demo-data",
        "title": "Auxiliar de análisis de datos (ejemplo)",
        "company": "Empresa de ejemplo",
        "location": "Remoto",
        "modality": "Remoto",
        "skills": ["Excel", "Power BI", "análisis", "comunicación"],
        "source_url": "https://example.com/",
        "source_name": "Enlace de demostración",
        "is_demo": True,
        "active_status": "No es una vacante activa",
    },
    {
        "id": "demo-qa",
        "title": "Probador de software junior (ejemplo)",
        "company": "Compañía de ejemplo",
        "location": "El Salvador",
        "modality": "Remoto",
        "skills": ["pruebas", "Python", "automatización", "comunicación"],
        "source_url": "https://example.com/",
        "source_name": "Enlace de demostración",
        "is_demo": True,
        "active_status": "No es una vacante activa",
    },
]


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "mode": "demo"}


@app.get("/api/products", response_model=list[Product])
def list_products() -> list[Product]:
    return PRODUCTS


@app.post("/api/shopping-plan", response_model=ShoppingPlanResponse)
def create_shopping_plan(request: ShoppingPlanRequest) -> ShoppingPlanResponse:
    by_id = {product.id: product for product in PRODUCTS}
    selected: list[Product] = []
    seen: set[str] = set()
    for product_id in request.product_ids:
        if product_id not in by_id:
            continue
        if product_id not in seen:
            selected.append(by_id[product_id])
            seen.add(product_id)
    if not selected:
        # Keep the response useful if every submitted ID is unknown.
        selected = PRODUCTS[:3]

    share = request.budget / len(selected)
    items: list[PlannedItem] = []
    for product in selected:
        quantity = int(share // product.example_price)
        subtotal = round(quantity * product.example_price, 2)
        items.append(
            PlannedItem(
                product_id=product.id,
                name=product.name,
                presentation=product.presentation,
                quantity=quantity,
                unit_price=product.example_price,
                subtotal=subtotal,
                source=product.source,
                observed_at=product.observed_at,
                is_demo=product.is_demo,
            )
        )
    total = round(sum(item.subtotal for item in items), 2)
    return ShoppingPlanResponse(
        budget=request.budget,
        budget_per_person=round(request.budget / request.household_size, 2),
        estimated_total=total,
        remaining=round(max(request.budget - total, 0), 2),
        household_size=request.household_size,
        items=items,
        note=(
            "Cálculo ilustrativo con precios ficticios; verifica precios, presentación "
            "y disponibilidad antes de comprar."
        ),
    )


def _normalized(value: str) -> str:
    return re.sub(r"\s+", " ", value.strip().lower())


@app.get("/api/jobs")
def list_jobs() -> list[dict[str, object]]:
    return JOBS


@app.post("/api/jobs/match")
def match_jobs(request: MatchRequest) -> list[dict[str, object]]:
    skills = {_normalized(skill) for skill in request.skills if skill.strip()}
    location = _normalized(request.location)
    results = []
    for job in JOBS:
        overlap = sorted(
            skill for skill in skills if any(skill in _normalized(j) or _normalized(j) in skill for j in job["skills"])
        )
        location_match = not location or location in _normalized(str(job["location"])) or "el salvador" in _normalized(str(job["location"]))
        score = min(100, round((len(overlap) / max(len(skills), 1)) * 80 + (20 if location_match else 0)))
        results.append({**job, "match_score": score, "matching_skills": overlap})
    return sorted(results, key=lambda item: int(item["match_score"]), reverse=True)


@app.post("/api/assistant/cv")
def help_with_cv(request: CVHelpRequest) -> dict[str, object]:
    text = request.text.strip()
    tips = [
        "Adapta el resumen y las habilidades a la vacante a la que aplicarás.",
        "Describe tus aportes con verbos de acción y resultados concretos cuando los tengas.",
        "Revisa ortografía, fechas y datos de contacto antes de compartir el documento.",
    ]
    if len(text.split()) < 35:
        tips.insert(0, "Agrega más contexto sobre proyectos, estudios o experiencia relevante.")
    if request.target_role.strip():
        tips.append(f"Usa términos reales de la descripción de {request.target_role.strip()}, sin atribuirte experiencia que no tienes.")
    return {
        "tips": tips,
        "note": "Asistencia con reglas de demostración. El texto se procesa en memoria y no se guarda.",
        "provided_characters": len(text),
    }


@app.post("/api/assistant/interview")
def interview_questions(request: InterviewHelpRequest) -> dict[str, object]:
    role = request.target_role.strip()
    return {
        "questions": [
            f"¿Qué te interesa del puesto de {role}?",
            "Cuéntame sobre un problema que resolviste y cómo verificaste el resultado.",
            "¿Qué habilidad estás desarrollando actualmente y cómo la practicas?",
        ],
        "note": "Preguntas sugeridas para practicar; no predicen una entrevista real.",
    }
