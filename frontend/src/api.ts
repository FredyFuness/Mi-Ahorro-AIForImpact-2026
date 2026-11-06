import { demoJobs, demoProducts } from "./demoData";
import type { Job, Product, ShoppingPlan } from "./types";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!response.ok) throw new Error(`La API respondió ${response.status}`);
  return response.json() as Promise<T>;
}

export async function loadProducts(): Promise<{ data: Product[]; offline: boolean }> {
  try {
    return { data: await request<Product[]>("/api/products"), offline: false };
  } catch {
    return { data: demoProducts, offline: true };
  }
}

export async function loadJobs(): Promise<{ data: Job[]; offline: boolean }> {
  try {
    return { data: await request<Job[]>("/api/jobs"), offline: false };
  } catch {
    return { data: demoJobs, offline: true };
  }
}

export async function createPlan(budget: number, householdSize: number, productIds: string[]): Promise<ShoppingPlan> {
  try {
    return await request<ShoppingPlan>("/api/shopping-plan", {
      method: "POST",
      body: JSON.stringify({ budget, household_size: householdSize, product_ids: productIds }),
    });
  } catch {
    const selected = demoProducts.filter((product) => productIds.includes(product.id));
    const share = selected.length ? budget / selected.length : 0;
    const items = selected.map((product) => {
      const quantity = Math.floor(share / product.example_price);
      return {
        product_id: product.id,
        name: product.name,
        presentation: product.presentation,
        quantity,
        unit_price: product.example_price,
        subtotal: Math.round(quantity * product.example_price * 100) / 100,
        source: product.source,
        observed_at: product.observed_at,
        is_demo: true,
      };
    });
    const total = Math.round(items.reduce((sum, item) => sum + item.subtotal, 0) * 100) / 100;
    return {
      budget,
      budget_per_person: Math.round((budget / householdSize) * 100) / 100,
      estimated_total: total,
      remaining: Math.round((budget - total) * 100) / 100,
      household_size: householdSize,
      items,
      note: "Cálculo ilustrativo sin conexión al backend; verifica precios y disponibilidad.",
    };
  }
}

export async function matchJobs(skills: string[], location: string): Promise<Job[]> {
  try {
    return await request<Job[]>("/api/jobs/match", {
      method: "POST",
      body: JSON.stringify({ skills, location }),
    });
  } catch {
    const normalized = skills.map((skill) => skill.trim().toLowerCase()).filter(Boolean);
    return demoJobs
      .map((job) => {
        const matchingSkills = normalized.filter((skill) => job.skills.some((jobSkill) => jobSkill.toLowerCase().includes(skill) || skill.includes(jobSkill.toLowerCase())));
        const locationMatch = !location.trim() || job.location.toLowerCase().includes(location.trim().toLowerCase()) || job.location.toLowerCase() === "el salvador";
        const matchScore = Math.min(100, Math.round((matchingSkills.length / Math.max(normalized.length, 1)) * 80 + (locationMatch ? 20 : 0)));
        return { ...job, match_score: matchScore, matching_skills: matchingSkills };
      })
      .sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0));
  }
}

export async function requestCVTips(text: string, targetRole: string): Promise<{ tips: string[]; note: string }> {
  try {
    return await request("/api/assistant/cv", { method: "POST", body: JSON.stringify({ text, target_role: targetRole }) });
  } catch {
    return {
      tips: ["Adapta el resumen y las habilidades a la vacante.", "Describe tus aportes con verbos de acción y ejemplos concretos.", "Revisa ortografía, fechas y datos antes de compartir tu CV."],
      note: "Consejos demostrativos calculados en este navegador; no se envían ni se guardan.",
    };
  }
}

export async function requestInterviewQuestions(targetRole: string): Promise<{ questions: string[]; note: string }> {
  try {
    return await request("/api/assistant/interview", { method: "POST", body: JSON.stringify({ target_role: targetRole }) });
  } catch {
    return {
      questions: [`¿Qué te interesa del puesto de ${targetRole}?`, "Cuéntame de un problema que resolviste y cómo revisaste el resultado.", "¿Qué habilidad estás desarrollando actualmente?"],
      note: "Preguntas sugeridas para practicar; no predicen una entrevista real.",
    };
  }
}
