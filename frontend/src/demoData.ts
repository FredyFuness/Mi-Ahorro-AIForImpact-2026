import type { Job, Product } from "./types";

export const demoProducts: Product[] = [
  { id: "rice", name: "Arroz", presentation: "1 libra", category: "Granos", example_price: 0.8, currency: "USD", is_demo: true, source: "Ejemplo demostrativo — sin comercio verificado", observed_at: null },
  { id: "beans", name: "Frijoles", presentation: "1 libra", category: "Granos", example_price: 1.15, currency: "USD", is_demo: true, source: "Ejemplo demostrativo — sin comercio verificado", observed_at: null },
  { id: "eggs", name: "Huevos", presentation: "media docena", category: "Proteínas", example_price: 1.35, currency: "USD", is_demo: true, source: "Ejemplo demostrativo — sin comercio verificado", observed_at: null },
  { id: "milk", name: "Leche", presentation: "1 litro", category: "Lácteos", example_price: 1.2, currency: "USD", is_demo: true, source: "Ejemplo demostrativo — sin comercio verificado", observed_at: null },
  { id: "corn", name: "Maíz", presentation: "1 libra", category: "Granos", example_price: 0.55, currency: "USD", is_demo: true, source: "Ejemplo demostrativo — sin comercio verificado", observed_at: null },
  { id: "oil", name: "Aceite", presentation: "botella pequeña", category: "Cocina", example_price: 1.65, currency: "USD", is_demo: true, source: "Ejemplo demostrativo — sin comercio verificado", observed_at: null },
];

export const demoJobs: Job[] = [
  { id: "demo-support", title: "Asistente de soporte técnico (ejemplo)", company: "Organización de ejemplo", location: "San Miguel", modality: "Híbrido", skills: ["soporte técnico", "atención al cliente", "comunicación"], source_url: "https://example.com/", source_name: "Enlace de demostración", is_demo: true, active_status: "No es una vacante activa" },
  { id: "demo-data", title: "Auxiliar de análisis de datos (ejemplo)", company: "Empresa de ejemplo", location: "Remoto", modality: "Remoto", skills: ["Excel", "Power BI", "análisis", "comunicación"], source_url: "https://example.com/", source_name: "Enlace de demostración", is_demo: true, active_status: "No es una vacante activa" },
  { id: "demo-qa", title: "Probador de software junior (ejemplo)", company: "Compañía de ejemplo", location: "El Salvador", modality: "Remoto", skills: ["pruebas", "Python", "automatización", "comunicación"], source_url: "https://example.com/", source_name: "Enlace de demostración", is_demo: true, active_status: "No es una vacante activa" },
];
