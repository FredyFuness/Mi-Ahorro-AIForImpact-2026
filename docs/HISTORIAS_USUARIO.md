# Casos de uso e historias de usuario

## Personas y alcance

El MVP se orienta a personas y familias de El Salvador que administran un presupuesto limitado y a quienes exploran opciones de empleo. Esta primera versión solo demuestra el flujo; no tiene cuentas, datos de tiendas ni vacantes reales.

## Historias

### Compras

1. **Como persona que prepara una compra**, quiero ingresar un presupuesto y el tamaño del hogar para ver una lista ajustada a un monto.
   - Aceptación: rechaza valores fuera del rango; presenta tamaño del hogar, monto por persona, cantidad, presentación, estimado y saldo; avisa que los precios son ficticios. La regla de cantidades sigue siendo ilustrativa y no estima necesidades nutricionales.
2. **Como persona que compara precios**, quiero conocer la fuente y fecha de cada precio para valorar si me sirve.
   - Aceptación para producción: cada observación requiere comercio o fuente, lugar, fecha de consulta y unidad comparable. Los registros sin estos datos no se presentan como precios verificados.
3. **Como persona con poco tiempo**, quiero elegir los productos que necesito para revisar alternativas de compra.
   - Aceptación: puedo seleccionar y quitar productos antes de generar la lista.

### Empleo

4. **Como persona que busca empleo**, quiero indicar habilidades y ubicación para ordenar oportunidades relevantes.
   - Aceptación: se muestran coincidencias y términos compartidos; se explica que el porcentaje es orientativo.
5. **Como candidata o candidato**, quiero abrir la publicación original para comprobar vigencia y postularme en el sitio fuente.
   - Aceptación para producción: cada oferta exige URL original, fecha de consulta, ubicación y estado de verificación. La demo solo usa enlaces `example.com`.

### Preparación y privacidad

6. **Como persona que prepara su CV**, quiero recibir ideas generales sin que el sistema publique o comparta mi contenido.
   - Aceptación: se informa qué se procesa; no se persiste el texto ni se envía a terceros en esta demo.
7. **Como persona que se prepara para una entrevista**, quiero practicar preguntas comunes para el puesto que me interesa.
   - Aceptación: se generan ejemplos orientativos y se aclara que no predicen el contenido de una entrevista.

## Fuera del MVP actual

- Precios actualizados de comercios, recepción comunitaria de precios y lectura de recibos.
- Vacantes activas, postulación dentro de la aplicación y verificación automática de empleadores.
- Cuentas, base de datos, historial, almacenamiento de CV o perfiles.
- Un modelo generativo o proveedor de IA externo.
- Promesas de ahorro, exactitud de precios, disponibilidad o contratación.
