# Deuda de prestadores turísticos · APN

Tablero interactivo del stock de deuda exigible de prestadores turísticos de la
Administración de Parques Nacionales al **30 de septiembre de 2026**, publicable
en GitHub Pages e instalable como aplicación en Android y iOS.

El tablero es un único archivo `index.html` autocontenido: los datos, los estilos,
el logo y toda la lógica del gráfico están dentro. No usa frameworks, ni build, ni
servidor. La única solicitud externa es la tipografía Archivo desde Google Fonts, y
si no carga el diseño se mantiene con la pila de fuentes del sistema.

Junto al tablero se publica `informe-deudas-30sep26.pdf`, el **Informe de deudas ·
relevamiento general** con el análisis completo en dieciocho páginas:
comparabilidad con agosto, tablas de capital e intereses por razón social y por
dependencia, prestadores activos, concesionarios y permisionarios, deudores
inactivos, Nahuel Huapi, cartera judicializada, anticuación y síntesis. Se accede
desde el enlace de la portada del tablero y desde el pie de la nota metodológica.

## Publicar en GitHub Pages

1. Subir el contenido de esta carpeta a la raíz de la rama `main`.

   ```bash
   git init
   git add .
   git commit -m "Tablero de deuda al 30/09/2026"
   git branch -M main
   git remote add origin https://github.com/USUARIO/REPOSITORIO.git
   git push -u origin main
   ```

2. En el repositorio, ir a **Settings → Pages**.
3. En *Build and deployment*, elegir **Deploy from a branch**.
4. Seleccionar la rama `main` y la carpeta `/ (root)`. Guardar.
5. A los dos o tres minutos queda publicado en
   `https://USUARIO.github.io/REPOSITORIO/`.

Todos los archivos tienen que quedar juntos y los enlaces son relativos, de modo
que también funciona desde una carpeta `docs/` o desde un subdirectorio del sitio.
El archivo `.nojekyll` evita que GitHub procese el sitio con Jekyll.

## Instalar como aplicación

GitHub Pages sirve el sitio por HTTPS, que es la condición que exigen los
teléfonos para instalar una aplicación web.

- **Android (Chrome):** el navegador ofrece «Instalar aplicación» al entrar; si no
  aparece, está en el menú ⋮ → *Agregar a la pantalla principal*.
- **iOS (Safari):** botón Compartir → *Agregar a pantalla de inicio*. En iPhone y
  iPad la instalación sólo funciona desde Safari, no desde Chrome ni Firefox.

Una vez instalado abre a pantalla completa, sin barra de direcciones, con su
ícono propio, y **funciona sin conexión**: el service worker guarda el tablero y
el informe en el dispositivo la primera vez que se abre.

Cuando se publica una versión nueva, la app la detecta y muestra un aviso
«Actualizar» al pie; al tocarlo recarga con los datos nuevos.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | El tablero completo, con los datos incluidos |
| `informe-deudas-30sep26.pdf` | Informe de dieciocho páginas |
| `manifest.webmanifest` | Nombre, colores e íconos de la aplicación |
| `sw.js` | Service worker: caché, uso sin conexión y avisos de actualización |
| `icon-192.png`, `icon-512.png` | Íconos de la aplicación |
| `icon-maskable-512.png` | Ícono adaptativo de Android |
| `icon-180.png` | Ícono de pantalla de inicio de iOS |
| `favicon.ico` | Ícono de la pestaña del navegador |
| `.nojekyll` | Desactiva el procesamiento Jekyll de GitHub |

## Actualizar al mes siguiente

Al reemplazar los datos hay que **cambiar la constante `VERSION` de `sw.js`**
(por ejemplo a `deuda-apn-2026-10-31`). Es lo que le avisa a los teléfonos que ya
tienen la app instalada que hay contenido nuevo; sin ese cambio seguirían viendo
la versión guardada. Si además cambia el nombre del PDF, hay que actualizarlo en
la lista `ASSETS` de `sw.js` y en los dos enlaces del `index.html`.

Los datos viven en una única línea del `index.html`, en la constante `DATA`
declarada al comienzo del `<script>`:

```js
{
  years:     ["≤2014", "2015", …, "2025", "sep-26"],   // fechas de corte
  deps:      ["Aconquija", "Baritú", …],                // dependencias
  deudores:  [[nombre, habilitadoVigente, [documentos]], …],
  facts:     [[deudor, dependencia, gestiónJudicial, primerCorte,
               capitalPorCorte[], interesesPorCorte[],
               pagoACuentaCapital, pagoACuentaIntereses, comprobantes], …],
  usd:       1550
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

La nota metodológica completa está al pie del tablero y desarrollada en el informe.

Sobre esta edición: el relevamiento de septiembre requirió sucesivas depuraciones
del insumo. Las primeras versiones de la planilla llegaron con el devengamiento de
intereses parcialmente actualizado y con 123 comprobantes dados de alta sin las
fórmulas de cálculo. Subsanadas esas omisiones en el archivo de origen, las cifras
del tablero y del informe reproducen las columnas de la planilla al centavo:
capital $ 1.071.004.891,26, intereses $ 474.891.823,91 y deuda total
$ 1.545.896.715,17.
