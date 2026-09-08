# Deuda de prestadores turísticos · APN

Tablero interactivo del stock de deuda exigible de prestadores turísticos de la
Administración de Parques Nacionales al **31 de agosto de 2026**.

El tablero es un único archivo `index.html` autocontenido: los datos, los estilos,
el logo y toda la lógica del gráfico están dentro. No usa frameworks, ni build, ni
servidor. La única solicitud externa es la tipografía Archivo desde Google Fonts, y
si no carga el diseño se mantiene con la pila de fuentes del sistema.

Junto al tablero se publica `informe-deudas-31ago26.pdf`, el **Informe de deudas ·
relevamiento general** con el análisis completo: comparabilidad con julio, tablas de
capital e intereses por razón social y por dependencia, prestadores activos,
concesionarios y permisionarios, deudores inactivos, Nahuel Huapi, cartera
judicializada, anticuación y síntesis. Se accede desde el botón de la portada del
tablero y desde el enlace al pie de la nota metodológica. El archivo tiene que
quedar en la misma carpeta que `index.html`, porque el enlace es relativo.

## Publicar en GitHub Pages

1. Crear un repositorio nuevo y subir el contenido de esta carpeta a la raíz de la
   rama `main`: `index.html`, `informe-deudas-31ago26.pdf`, `README.md` y `.nojekyll`.

   ```bash
   git init
   git add .
   git commit -m "Tablero de deuda al 31/08/2026"
   git branch -M main
   git remote add origin https://github.com/USUARIO/REPOSITORIO.git
   git push -u origin main
   ```

2. En el repositorio, ir a **Settings → Pages**.
3. En *Build and deployment*, elegir **Deploy from a branch**.
4. Seleccionar la rama `main` y la carpeta `/ (root)`. Guardar.
5. A los dos o tres minutos el tablero queda publicado en
   `https://USUARIO.github.io/REPOSITORIO/`.

El archivo `.nojekyll` evita que GitHub procese el sitio con Jekyll. No es
imprescindible acá, pero previene sorpresas si más adelante se agregan archivos
o carpetas cuyo nombre empiece con guion bajo.

Para publicar dentro de un repositorio ya existente, alcanza con poner `index.html`
y el PDF en una carpeta `docs/` y elegir esa carpeta en el paso 4.

Si más adelante se reemplaza el informe por una edición posterior, conviene
mantener el nombre del archivo o actualizar los dos enlaces del `index.html`.

## Actualizar los datos

Los datos viven en una única línea del `index.html`, en la constante `DATA`
declarada al comienzo del `<script>`. La estructura es:

```js
{
  years:     ["≤2014", "2015", …, "2025", "ago-26"],   // fechas de corte
  deps:      ["Calilegua", "Chaco", …],                 // dependencias
  deudores:  [[nombre, habilitadoVigente, [documentos]], …],
  facts:     [[deudor, dependencia, gestiónJudicial, primerCorte,
               capitalPorCorte[], interesesPorCorte[],
               pagoACuentaCapital, pagoACuentaIntereses, comprobantes], …],
  usd:       1500
}
```

`capitalPorCorte` e `interesesPorCorte` arrancan en el índice `primerCorte` y
llegan hasta el último; los cortes anteriores valen cero. Los intereses son el
devengo cronológico a cada fecha, calculado con la tasa activa del BNA según la
fórmula de la planilla de origen.

## Uso

- **Vista**: deuda acumulada a cada corte, deuda generada en cada período, o ranking.
- **Apertura**: por dependencia, por deudor, por deudores de una dependencia, por
  habilitación vigente o por gestión judicial.
- **Concepto**: capital, intereses o ambos.
- **Pagos a cuenta**: importes brutos o neteados.
- **Universo**: todos, sólo habilitados, o sólo cartera judicializada.
- **Buscador**: acepta CUIT (con o sin guiones) o razón social.
- Tocar o hacer clic en la leyenda aísla y compara series; el gráfico responde
  igual con mouse que con pantalla táctil.

Los rankings muestran siempre las diez principales unidades más una categoría
residual, de modo que las series suman el total del universo seleccionado.

## Metodología

La nota metodológica completa está al pie del tablero.
