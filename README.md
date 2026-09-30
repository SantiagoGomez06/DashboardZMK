# ZMK Logística 360

Dashboard interactivo de exposición para **ZMK DISEÑO S.A.S** (Planta Sabaneta). Cuenta el problema logístico de hoy (cada cliente trae y recoge), la propuesta **Milk-Run** y cómo se controlaría con geocercas, app del conductor y un agente de avisos.

Autora del trabajo académico: **Sindy Tatiana Velez Gallego**, Ingeniería de Productividad y Calidad, Politécnico Colombiano Jaime Isaza Cadavid.

Este programa es un **storytelling de aula**. No es un sistema de despacho real ni se conecta a GPS ni a WhatsApp.

## Cómo abrir el entregable (sin instalar Node)

### A) Ejecutable Windows (principal)

1. Copie `release/ZMK-Logistica-360.exe` a cualquier PC con Windows 10/11 de 64 bits.
2. Dé **doble clic**. No pide administrador ni internet.
3. La primera vez tarda unos segundos: el portable se descomprime en una carpeta temporal.

**SmartScreen (“Windows protegió su PC”)**  
El `.exe` no está firmado digitalmente. Eso no significa que sea un virus; Windows marca los programas sin certificado.

1. Clic en **Más información**.
2. Clic en **Ejecutar de todas formas**.

Si el antivirus lo pone en cuarentena, use el HTML de respaldo (opción B) o el ZIP (opción C).

### B) HTML único (respaldo)

Abra `release/ZMK-Dashboard.html` con **doble clic** en Microsoft Edge, Chrome o Firefox. Funciona con `file://` y **sin internet**.

### C) Carpeta desempaquetada

Descomprima `release/ZMK-Logistica-360-win.zip` (o el ZIP que genere electron-builder) y ejecute el `.exe` de esa carpeta.

## Cómo usar en la exposición

- **Modo presentación:** botón en la barra, o tecla `P`. Avance con `←` `→`. `F11` pantalla completa. `Esc` sale del modo presentación.
- **Modo explorar:** navegue por los 9 módulos en la barra superior.
- **Imprimir / PDF:** botón de la barra; use “Guardar como PDF” del sistema.
- **Tema claro/oscuro:** se guarda en el navegador si `localStorage` está permitido; si falla, queda en memoria.

### Guion sugerido (≈5 minutos por módulo)

0. **Portada (5 min).** Tres tarjetas: problema → Milk-Run → resultado aún no medido. Botón “Comenzar recorrido”.
1. **AS-IS (5 min).** Muestre que 960 min de bodega aplastan el VSM. Dona %VA/%NVA. “¿Por qué pasa?”: no hay Heijunka de llegadas + viajes sueltos.
2. **Canal (5 min).** Slider Antes/Después. Chips: canal directo (nivel cero) y distribución selectiva. Tres beneficios (consolidar, JIT, menos viajes del cliente).
3. **Simulador TO-BE (5 min).** Deje claro el recuadro amarillo: **no son resultados medidos**. Mueva espera y transportes 2 y 17.
4. **Torre (5 min).** Play del camión. Dispare congestión (E0, ETA 10:45 en el texto de fuente), desvío y detenido (alerta silenciosa), falla (E3), ausente (E5). Explique 1 km vs 2 km.
5. **Chat / IA (5 min).** Recorra E0–E5. Cambie nombre y hora en vivo. Abra “Así se le instruye al agente”.
6. **Tecnologías (5 min).** Voltee tarjetas. Apague GPS, app o IA y lea qué se pierde. Esquema híbrido.
7. **Costos (5 min).** CAPEX vs OPEX con palabras de la fuente. Calcule payback **con los números de ejemplo** y recuerde que ZMK debe poner los reales.
8. **Cierre (5 min).** Tres frases, tabla cualitativa, glosario y notas de la fuente (1210 vs 1205).

## Cómo compilar (equipo de desarrollo)

Requisitos: Windows 10/11, Node.js 20+, npm.

```bat
npm install
npm test
npm run dev
```

`npm run dev` abre Vite. `npm run dev:desktop` abre también la ventana Electron.

```bat
npm run build:all
```

Genera tests + `release/ZMK-Logistica-360.exe` + ZIP de Windows + `release/ZMK-Dashboard.html`.

Otros scripts: `build:desktop:win`, `build:single`, `build:icon`.

Si electron-builder falla por **symlinks** o **winCodeSign**, ya está `win.signAndEditExecutable: false`. Si aún falla, active el **Modo de desarrollador** de Windows (Configuración → Sistema → Para desarrolladores).

## Cómo editar los datos

Fuente de verdad en `src/data/`:

| Archivo | Contenido |
| --- | --- |
| `vsm.ts` | Etapas AS-IS (minutos) |
| `whatsapp.ts` | Textos E0–E5 (no “corregir” redacción) |
| `geofences.ts` | Triggers y clientes ficticios A/B/C |
| `technologies.ts` | Matriz de impacto |
| `costs.ts` | Textos CAPEX/OPEX y valores de ejemplo de la calculadora |
| `glossary.ts` | Glosario |
| `company.ts` | Empresa, autora, notas de fuente |

Los totales del VSM **no se escriben a mano**: `src/lib/vsm.ts` los suma. Los tests en `src/lib/*.test.ts` cubren CT/VA/NVA, ROI/payback, ETA simulado y textos de WhatsApp.

## Supuestos (no están en la fuente)

- Calculadora de ROI: liquidez por DSO ≈ `((DSO antes − DSO después) / 30) × facturación mensual`, más notas crédito y fletes en falso evitados, menos OPEX. Payback = CAPEX / neto mensual. Los COP de ejemplo son ilustrativos.
- Simulador TO-BE: solo se editan minutos de pasos 4, 2 y 17; el resto de la tabla AS-IS se mantiene.
- Mapa SVG, ETAs de animación, demoras por evento (congestión +25 min, etc.) y clientes A/B/C son **ilustrativos**.
- En E0 el texto de la fuente ya incluye **10:45 AM**; el panel de torre muestra esa hora cuando se inyecta congestión.
- Enlaces de mapa y ePOD se reemplazan por anclas locales `#mapa-ilustrativo` y `#epod-ilustrativo` (no hay web real).
- Preferencia de tema en `localStorage` clave `zmk-theme`, con try/catch.
- React 19 + Vite 8 (el brief pedía React 18; se usa la plantilla actual, compatible). Linter: Oxlint + Prettier (en lugar de ESLint clásico).

## Arquitectura breve

SPA en React + TypeScript + Tailwind + Zustand. Navegación por estado (no `BrowserRouter`). Electron carga `dist/index.html` con `loadFile`, `base: './'`, sin Node en el renderer, sin red en producción. HTML único con `vite-plugin-singlefile`.

## Licencia de uso

Material académico de exposición. No incluye marcas oficiales de WhatsApp/Meta.
