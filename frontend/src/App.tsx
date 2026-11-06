import { useEffect, useState } from "react";
import { createPlan, loadJobs, loadProducts, matchJobs, requestCVTips, requestInterviewQuestions } from "./api";
import { demoJobs, demoProducts } from "./demoData";
import type { Job, NavPage, Product, ShoppingPlan } from "./types";

const currency = new Intl.NumberFormat("es-SV", { style: "currency", currency: "USD" });
const navigation: { id: NavPage; label: string; icon: string }[] = [
  { id: "home", label: "Resumen", icon: "⌂" },
  { id: "shopping", label: "Mis compras", icon: "▤" },
  { id: "jobs", label: "Oportunidades", icon: "↗" },
  { id: "profile", label: "Mi perfil", icon: "◎" },
];
const todayLabel = new Intl.DateTimeFormat("es-SV", { weekday: "long", day: "numeric", month: "long" })
  .format(new Date()).toLocaleUpperCase("es-SV");

function App() {
  const [page, setPage] = useState<NavPage>("home");
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [jobResults, setJobResults] = useState<Job[]>(demoJobs);
  const [apiOffline, setApiOffline] = useState(false);
  const [budget, setBudget] = useState("25");
  const [householdSize, setHouseholdSize] = useState("4");
  const [selectedIds, setSelectedIds] = useState<string[]>(["rice", "beans", "eggs", "milk"]);
  const [plan, setPlan] = useState<ShoppingPlan | null>(null);
  const [planError, setPlanError] = useState("");
  const [skillsInput, setSkillsInput] = useState("Python, pruebas, comunicación");
  const [location, setLocation] = useState("El Salvador");
  const [cvText, setCvText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [cvTips, setCvTips] = useState<string[]>([]);
  const [cvNote, setCvNote] = useState("");
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [interviewNote, setInterviewNote] = useState("");
  const [assistantError, setAssistantError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([loadProducts(), loadJobs()]).then(([productResult, jobResult]) => {
      if (!active) return;
      setProducts(productResult.data);
      setJobResults(jobResult.data);
      setApiOffline(productResult.offline || jobResult.offline);
    });
    return () => { active = false; };
  }, []);

  function toggleProduct(id: string) {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  async function makePlan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPlanError("");
    const parsedBudget = Number(budget);
    const parsedHousehold = Number(householdSize);
    if (!Number.isFinite(parsedBudget) || parsedBudget <= 0 || parsedBudget > 1500) {
      setPlanError("Ingresa un presupuesto mayor que $0 y hasta $1,500.");
      return;
    }
    if (!Number.isInteger(parsedHousehold) || parsedHousehold < 1 || parsedHousehold > 20) {
      setPlanError("El tamaño del hogar debe ser de 1 a 20 personas.");
      return;
    }
    if (selectedIds.length === 0) {
      setPlanError("Elige al menos un producto para preparar la lista.");
      return;
    }
    setPlan(await createPlan(parsedBudget, parsedHousehold, selectedIds));
  }

  async function findMatches(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const skills = skillsInput.split(",").map((skill) => skill.trim()).filter(Boolean);
    setJobResults(await matchJobs(skills, location));
  }

  async function getCVHelp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAssistantError("");
    if (cvText.trim().length < 10) {
      setAssistantError("Escribe al menos 10 caracteres para recibir sugerencias.");
      return;
    }
    const result = await requestCVTips(cvText, targetRole);
    setCvTips(result.tips);
    setCvNote(result.note);
  }

  async function getInterviewPractice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAssistantError("");
    if (targetRole.trim().length < 2) {
      setAssistantError("Escribe el puesto que quieres practicar.");
      return;
    }
    const result = await requestInterviewQuestions(targetRole);
    setInterviewQuestions(result.questions);
    setInterviewNote(result.note);
  }

  const currentLabel = navigation.find((item) => item.id === page)?.label ?? "Resumen";

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <aside className="sidebar" aria-label="Navegación principal">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">m</div>
          <div><span className="brand-name">mi ahorro</span><span className="brand-tag">PASO A PASO, MEJOR</span></div>
        </div>
        <p className="nav-caption">TU ESPACIO</p>
        <nav className="main-nav">
          {navigation.map((item) => (
            <button key={item.id} type="button" className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)} aria-label={item.label} aria-current={page === item.id ? "page" : undefined}>
              <span className="nav-icon" aria-hidden="true">{item.icon}</span><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><span className="help-spark" aria-hidden="true">✳</span><p>Pequeños pasos también cuentan.</p><span>Organiza. Compara. Decide.</span></div>
          <div className="user-chip"><div className="avatar" aria-hidden="true">M</div><div><strong>Mi espacio</strong><span>Modo de demostración</span></div><span className="more" aria-hidden="true">···</span></div>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark" aria-hidden="true">m</span><span>mi ahorro</span></div>
          <div className="breadcrumb"><span>Mi Ahorro</span><span className="crumb-separator">/</span><strong>{currentLabel}</strong></div>
          <div className="topbar-actions"><span className="demo-pill"><i aria-hidden="true" /> Demo</span><button className="avatar avatar-small" type="button" aria-label="Perfil de demostración">M</button></div>
        </header>

        {apiOffline && <div className="offline-notice" role="status">API no conectada: la demo funciona con datos ilustrativos en este navegador.</div>}

        <main id="main-content" className="content-area">
          {page === "home" && <HomePage onNavigate={setPage} plan={plan} />}
          {page === "shopping" && (
            <ShoppingPage
              budget={budget} setBudget={setBudget}
              householdSize={householdSize} setHouseholdSize={setHouseholdSize}
              products={products} selectedIds={selectedIds}
              onToggle={toggleProduct} onSubmit={makePlan} plan={plan} error={planError}
            />
          )}
          {page === "jobs" && <JobsPage results={jobResults} skillsInput={skillsInput} setSkillsInput={setSkillsInput} location={location} setLocation={setLocation} onSubmit={findMatches} />}
          {page === "profile" && (
            <ProfilePage
              targetRole={targetRole} setTargetRole={setTargetRole}
              cvText={cvText} setCvText={setCvText} cvTips={cvTips} cvNote={cvNote}
              interviewQuestions={interviewQuestions} interviewNote={interviewNote}
              error={assistantError} onCVSubmit={getCVHelp} onInterviewSubmit={getInterviewPractice}
            />
          )}
        </main>

        <footer className="site-footer"><span>Mi Ahorro · Prototipo de evaluación</span><span>Información demostrativa · Revisa los datos antes de decidir.</span></footer>
      </div>
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-description">{description}</p></div>{action}</div>;
}

function HomePage({ onNavigate, plan }: { onNavigate: (page: NavPage) => void; plan: ShoppingPlan | null }) {
  return (
    <>
      <div className="welcome-row"><div><p className="eyebrow">{todayLabel}</p><h1>Un poco más de claridad<br /><span>para tus decisiones.</span></h1><p className="welcome-copy">Organiza tus compras y descubre opciones para dar tu siguiente paso.</p></div><div className="welcome-art" aria-hidden="true"><span className="art-sun" /><span className="art-card"><i>●</i><b>+</b></span><span className="art-leaf">✳</span></div></div>
      <div className="demo-banner"><span className="banner-icon" aria-hidden="true">ⓘ</span><p><strong>Estás viendo una demostración.</strong> Los precios y ofertas que aparecen son ejemplos; no corresponden a datos actuales.</p></div>
      <section className="section-block" aria-labelledby="start-title">
        <div className="section-title-row"><div><p className="eyebrow">TU SIGUIENTE PASO</p><h2 id="start-title">¿Qué quieres organizar hoy?</h2></div><span className="soft-label">2 herramientas para empezar</span></div>
        <div className="action-grid">
          <button className="action-card shopping-card" type="button" onClick={() => onNavigate("shopping")}><span className="card-topline"><span className="action-icon cart-icon" aria-hidden="true">▤</span><span className="round-arrow" aria-hidden="true">↗</span></span><span className="card-label">COMPRAS Y PRESUPUESTO</span><strong>Arma una lista<br />a tu medida</strong><span className="card-detail">Define un monto y prioriza lo que necesitas.</span><span className="card-link">Planificar mis compras <b aria-hidden="true">→</b></span></button>
          <button className="action-card jobs-card" type="button" onClick={() => onNavigate("jobs")}><span className="card-topline"><span className="action-icon jobs-icon" aria-hidden="true">↗</span><span className="round-arrow" aria-hidden="true">↗</span></span><span className="card-label">OPORTUNIDADES</span><strong>Encuentra caminos<br />para avanzar</strong><span className="card-detail">Explora ejemplos según tus habilidades.</span><span className="card-link">Ver oportunidades <b aria-hidden="true">→</b></span></button>
        </div>
      </section>
      <section className="section-block next-step-row" aria-label="Resumen de actividad">
        <div className="mini-summary"><span className="summary-icon" aria-hidden="true">▧</span><div><p className="eyebrow">TU LISTA MÁS RECIENTE</p><strong>{plan ? `Presupuesto de ${currency.format(plan.budget)}` : "Todavía no tienes una lista"}</strong><span>{plan ? `${plan.items.length} productos en tu plan de ejemplo` : "Crea una lista para empezar a organizarte."}</span></div><button className="text-arrow" type="button" onClick={() => onNavigate("shopping")} aria-label="Ir a mis compras">→</button></div>
        <div className="mini-summary privacy-summary"><span className="summary-icon lock-icon" aria-hidden="true">⌑</span><div><p className="eyebrow">TU INFORMACIÓN</p><strong>Controlas lo que compartes</strong><span>Esta demo no crea una cuenta ni guarda tu perfil.</span></div><button className="text-arrow" type="button" onClick={() => onNavigate("profile")} aria-label="Ver privacidad del perfil">→</button></div>
      </section>
      <section className="quote-strip"><span aria-hidden="true">✳</span><p>Una decisión informada empieza por tener opciones claras.</p><span>Mi Ahorro</span></section>
    </>
  );
}

function ShoppingPage({ budget, setBudget, householdSize, setHouseholdSize, products, selectedIds, onToggle, onSubmit, plan, error }: {
  budget: string; setBudget: (value: string) => void; householdSize: string; setHouseholdSize: (value: string) => void;
  products: Product[]; selectedIds: string[]; onToggle: (id: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; plan: ShoppingPlan | null; error: string;
}) {
  return (
    <>
      <PageHeading eyebrow="COMPRAS Y PRESUPUESTO" title="Haz que tu lista tenga sentido para ti." description="Cuéntanos cuánto quieres gastar y cuáles productos necesitas. La sugerencia solo usa valores de muestra." />
      <div className="demo-banner compact"><span className="banner-icon" aria-hidden="true">ⓘ</span><p>Los precios son ficticios, no están ligados a una tienda ni están vigentes.</p></div>
      <div className="planner-layout">
        <form className="panel planner-form" onSubmit={onSubmit}>
          <div className="panel-heading"><span className="step-dot">1</span><div><h2>Define tus prioridades</h2><p>Empieza con lo que tienes disponible.</p></div></div>
          <label className="field-label" htmlFor="budget">Presupuesto para esta compra</label>
          <div className="money-field"><span aria-hidden="true">$</span><input id="budget" type="number" min="0.01" max="1500" step="0.01" value={budget} onChange={(event) => setBudget(event.target.value)} required /><span className="currency-code">USD</span></div>
          <label className="field-label" htmlFor="household">¿Para cuántas personas?</label>
          <input className="text-field" id="household" type="number" min="1" max="20" step="1" value={householdSize} onChange={(event) => setHouseholdSize(event.target.value)} required />
          <div className="product-title-row"><div><label className="field-label">¿Qué necesitas incluir?</label><p className="muted-small">Selecciona uno o más productos.</p></div><span className="selection-count">{selectedIds.length} elegidos</span></div>
          <div className="product-list">
            {products.map((product) => <button key={product.id} type="button" className={`product-option ${selectedIds.includes(product.id) ? "selected" : ""}`} onClick={() => onToggle(product.id)} aria-pressed={selectedIds.includes(product.id)}><span className={`product-emoji emoji-${product.id}`} aria-hidden="true">{product.id === "rice" ? "◒" : product.id === "beans" ? "●" : product.id === "eggs" ? "◉" : product.id === "milk" ? "▱" : product.id === "corn" ? "✳" : "◍"}</span><span className="product-name">{product.name}<small>{product.presentation}</small></span><span className="product-price">{currency.format(product.example_price)}<small>ejemplo</small></span><span className="check-mark" aria-hidden="true">{selectedIds.includes(product.id) ? "✓" : "+"}</span></button>)}
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button full-button" type="submit">Preparar mi lista <span aria-hidden="true">→</span></button>
        </form>
        <div className="plan-column">
          <section className="panel plan-panel" aria-live="polite">
            <div className="panel-heading"><span className="step-dot green">2</span><div><h2>Tu lista de ejemplo</h2><p>Una distribución sencilla para revisar.</p></div></div>
            {!plan ? <div className="empty-plan"><div className="empty-illustration" aria-hidden="true"><span>▤</span><i>✳</i></div><strong>Tu lista aparecerá aquí</strong><span>Elige productos y genera una distribución orientativa.</span></div> : <>
              <div className="budget-meter"><div className="meter-copy"><span>Presupuesto disponible · {plan.household_size} personas</span><strong>{currency.format(plan.budget)}</strong></div><div className="meter-track"><span style={{ width: `${Math.min(100, plan.budget ? (plan.estimated_total / plan.budget) * 100 : 0)}%` }} /></div><div className="meter-foot"><span>{currency.format(plan.budget_per_person)} por persona</span><span>Restante: {currency.format(plan.remaining)}</span></div></div>
              <div className="plan-items">{plan.items.map((item) => <div className="plan-item" key={item.product_id}><div className="plan-item-info"><strong>{item.name}</strong><span>{item.quantity} × {item.presentation}</span><span>Fuente: {item.source}{item.observed_at ? ` · ${item.observed_at}` : " · sin fecha verificada"}</span></div><strong>{currency.format(item.subtotal)}</strong></div>)}</div>
              <p className="plan-disclaimer">{plan.note}</p>
            </>}
          </section>
          <div className="tip-box"><span aria-hidden="true">✳</span><p><strong>Una idea útil</strong> Revisa qué productos ya tienes en casa antes de completar tu compra.</p></div>
        </div>
      </div>
    </>
  );
}

function JobsPage({ results, skillsInput, setSkillsInput, location, setLocation, onSubmit }: {
  results: Job[]; skillsInput: string; setSkillsInput: (value: string) => void; location: string; setLocation: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <>
      <PageHeading eyebrow="OPORTUNIDADES" title="Explora posibilidades para tu siguiente paso." description="Indica algunas habilidades y una ubicación para ordenar los ejemplos que aparecen en esta demo." />
      <div className="demo-banner compact"><span className="banner-icon" aria-hidden="true">ⓘ</span><p>No se muestran vacantes activas. Los cargos y enlaces son ilustrativos, no anuncios de empleo.</p></div>
      <div className="job-layout">
        <form className="panel match-form" onSubmit={onSubmit}>
          <span className="form-icon" aria-hidden="true">✳</span><h2>¿Qué sabes hacer?</h2><p>Agrega habilidades separadas por comas.</p>
          <label className="field-label" htmlFor="skills">Tus habilidades</label><textarea id="skills" className="text-field text-area" rows={3} value={skillsInput} onChange={(event) => setSkillsInput(event.target.value)} placeholder="Ej. Excel, ventas, Python" />
          <label className="field-label" htmlFor="location">Ubicación de interés</label><input id="location" className="text-field" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Ej. San Miguel o remoto" />
          <button className="primary-button full-button" type="submit">Ver coincidencias <span aria-hidden="true">→</span></button>
          <div className="match-note"><span aria-hidden="true">ⓘ</span><span>El porcentaje es una comparación simple por palabras; no predice si una empresa te seleccionará.</span></div>
        </form>
        <section className="job-results" aria-labelledby="job-results-title">
          <div className="results-heading"><div><p className="eyebrow">EJEMPLOS PARA EXPLORAR</p><h2 id="job-results-title">{results.length} opciones de muestra</h2></div><span className="soft-label">No activas</span></div>
          {results.map((job) => <article className="job-card" key={job.id}><div className="job-logo" aria-hidden="true">{job.company.slice(0, 1)}</div><div className="job-info"><div className="job-card-top"><div><span className="demo-job-label">EJEMPLO · NO ACTIVO</span><h3>{job.title}</h3></div>{job.match_score !== undefined && <span className="match-badge">{job.match_score}%<small>coincidencia</small></span>}</div><p className="job-company">{job.company} <span>·</span> {job.location} <span>·</span> {job.modality}</p><div className="skill-tags">{job.skills.slice(0, 4).map((skill) => <span key={skill}>{skill}</span>)}</div><div className="job-card-footer"><span>{job.active_status}</span><a href={job.source_url} target="_blank" rel="noreferrer">{job.source_name} ↗</a></div></div></article>)}
          <p className="job-data-note">Para publicar ofertas reales se necesitará conservar el enlace original, la fecha de consulta y verificar que el anuncio siga disponible.</p>
        </section>
      </div>
    </>
  );
}

function ProfilePage({ targetRole, setTargetRole, cvText, setCvText, cvTips, cvNote, interviewQuestions, interviewNote, error, onCVSubmit, onInterviewSubmit }: {
  targetRole: string; setTargetRole: (value: string) => void; cvText: string; setCvText: (value: string) => void; cvTips: string[]; cvNote: string;
  interviewQuestions: string[]; interviewNote: string; error: string;
  onCVSubmit: (event: React.FormEvent<HTMLFormElement>) => void; onInterviewSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <>
      <PageHeading eyebrow="MI PERFIL" title="Prepara tu próximo paso con confianza." description="Practica una entrevista o revisa ideas para organizar tu CV. No necesitas crear un perfil para probar." />
      <div className="privacy-banner"><span className="privacy-icon" aria-hidden="true">⌑</span><p><strong>Tu información es tuya.</strong> El texto de esta demo se procesa solo para mostrar sugerencias y no se guarda como perfil.</p><span className="privacy-check" aria-hidden="true">✓</span></div>
      <div className="assistant-grid">
        <form className="panel assistant-card" onSubmit={onCVSubmit}>
          <div className="assistant-heading"><span className="assistant-icon cv-icon" aria-hidden="true">▤</span><div><p className="eyebrow">ASISTENTE DE CV</p><h2>Ordena tus ideas</h2></div></div>
          <p className="assistant-description">Pega un resumen breve y recibe recomendaciones generales para revisarlo.</p>
          <label className="field-label" htmlFor="target-role-cv">Puesto que te interesa <span>(opcional)</span></label><input id="target-role-cv" className="text-field" value={targetRole} onChange={(event) => setTargetRole(event.target.value)} placeholder="Ej. Asistente de soporte" />
          <label className="field-label" htmlFor="cv-text">Resumen de tu experiencia o proyectos</label><textarea id="cv-text" className="text-field text-area" rows={5} maxLength={5000} value={cvText} onChange={(event) => setCvText(event.target.value)} placeholder="Escribe un texto de ejemplo. No incluyas información sensible en esta demo." /><div className="char-count">{cvText.length}/5000</div>
          <button className="secondary-button full-button" type="submit">Dame sugerencias <span aria-hidden="true">→</span></button>
          {cvTips.length > 0 && <div className="assistant-output" aria-live="polite"><strong>Ideas para revisar</strong><ul>{cvTips.map((tip) => <li key={tip}>{tip}</li>)}</ul><p>{cvNote}</p></div>}
        </form>
        <form className="panel assistant-card interview-card" onSubmit={onInterviewSubmit}>
          <div className="assistant-heading"><span className="assistant-icon interview-icon" aria-hidden="true">◌</span><div><p className="eyebrow">PRÁCTICA DE ENTREVISTA</p><h2>Ensaya a tu ritmo</h2></div></div>
          <p className="assistant-description">Genera preguntas comunes para pensar cómo contar tu experiencia.</p>
          <label className="field-label" htmlFor="target-role-interview">Puesto que quieres practicar</label><input id="target-role-interview" className="text-field" value={targetRole} onChange={(event) => setTargetRole(event.target.value)} placeholder="Ej. QA junior" />
          <button className="secondary-button full-button" type="submit">Preparar preguntas <span aria-hidden="true">→</span></button>
          {interviewQuestions.length > 0 ? <div className="assistant-output" aria-live="polite"><strong>Preguntas para practicar</strong><ol>{interviewQuestions.map((question) => <li key={question}>{question}</li>)}</ol><p>{interviewNote}</p></div> : <div className="practice-prompt"><span aria-hidden="true">✳</span><p>Piensa en una situación concreta, qué hiciste y qué aprendiste.</p></div>}
        </form>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <p className="assistant-limits">Las sugerencias siguen reglas sencillas de demostración. No se usa un modelo generativo ni se garantiza que una empresa utilice estos criterios.</p>
    </>
  );
}

export default App;
