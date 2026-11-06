from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_health_reports_demo_mode() -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "mode": "demo"}


def test_products_are_explicitly_illustrative() -> None:
    response = client.get("/api/products")
    assert response.status_code == 200
    assert response.json()
    assert all(product["is_demo"] for product in response.json())
    assert all("demostrativo" in product["source"].lower() for product in response.json())


def test_shopping_plan_stays_within_budget() -> None:
    response = client.post(
        "/api/shopping-plan",
        json={"budget": 25, "household_size": 4, "product_ids": ["rice", "beans", "eggs"]},
    )
    assert response.status_code == 200
    plan = response.json()
    assert plan["estimated_total"] <= plan["budget"]
    assert plan["remaining"] == round(plan["budget"] - plan["estimated_total"], 2)
    assert plan["household_size"] == 4
    assert plan["budget_per_person"] == 6.25


def test_shopping_plan_rejects_invalid_budget() -> None:
    response = client.post(
        "/api/shopping-plan",
        json={"budget": -1, "household_size": 2, "product_ids": ["rice"]},
    )
    assert response.status_code == 422


def test_matching_returns_explanation_and_demo_notice() -> None:
    response = client.post(
        "/api/jobs/match", json={"skills": ["Python", "pruebas"], "location": "El Salvador"}
    )
    assert response.status_code == 200
    jobs = response.json()
    assert jobs[0]["match_score"] >= jobs[-1]["match_score"]
    assert all(job["is_demo"] for job in jobs)
    assert all("example.com" in job["source_url"] for job in jobs)


def test_cv_help_discloses_transient_demo_processing() -> None:
    response = client.post(
        "/api/assistant/cv",
        json={"text": "Este es un resumen de experiencia con proyectos, estudios y habilidades profesionales.", "target_role": "QA junior"},
    )
    assert response.status_code == 200
    assert "no se guarda" in response.json()["note"]
    assert response.json()["tips"]
