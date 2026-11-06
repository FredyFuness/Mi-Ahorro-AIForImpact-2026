# Fuentes consultadas para la siguiente etapa

Consulta documental: **5 de noviembre de 2026**. Estos enlaces ayudan a revisar información vigente fuera de la demo. El repositorio no descarga, copia ni sincroniza los datos de esos portales.

| Necesidad | Fuente | Qué ofrece | Límite para Mi Ahorro |
| --- | --- | --- | --- |
| Comparar precios de supermercado | [PRECOMPRA — Defensoría del Consumidor](https://precompra.defensoria.gob.sv/) | Consulta precios y ofertas de supermercados; la persona elige distrito y sucursal. | Requiere consultar la plataforma; no se integró una API ni se importaron valores. Los precios de la demo siguen siendo ficticios. |
| Consultar mercados y mayoristas | [Sondeos de precios — Defensoría del Consumidor](https://www.defensoria.gob.sv/servicios/sondeos-de-precios/) | Publica sondeos semanales con datos nacionales y regionales, incluida la zona oriental. | En la página revisada, los registros más recientes visibles estaban fechados en 2025. No deben mostrarse como precios actuales sin revisar cada fecha. |
| Buscar empleos QA | [Tecoloco — búsqueda QA](https://www.tecoloco.com.sv/empleo/qa) | Página dinámica con ofertas encontradas para QA en El Salvador y fechas de expiración publicadas. | Es una búsqueda, no un feed/API; cada vacante debe enlazar a su anuncio individual y confirmarse antes de mostrarla. |
| Buscar empleos QA | [LinkedIn — búsqueda QA](https://sv.linkedin.com/jobs/qa-empleos) | Búsqueda dinámica con filtros por fecha, ubicación y nivel de experiencia. | Los resultados pueden pedir inicio de sesión y cambiar. Verificar cada anuncio y enlazar su publicación original. |

PRECOMPRA explica que permite cotizar y comparar productos eligiendo distrito y sucursal. Por eso la interfaz ofrece un enlace directo a la fuente oficial en lugar de presentar sus cifras como si estuvieran sincronizadas.

## Requisitos para una integración

1. Confirmar permisos, términos de uso y disponibilidad técnica antes de automatizar consultas.
2. Registrar la fuente, comercio o portal, zona, producto y presentación, valor, moneda y fecha/hora de consulta.
3. Mostrar antigüedad y estado de actualización, y retirar o etiquetar datos vencidos.
4. En empleos, conservar el enlace individual, empleador, fecha de consulta y fecha de cierre si la publicación la incluye.
5. Cuando no haya fuente actual, decirlo con claridad y enlazar al portal para que la persona lo verifique.
