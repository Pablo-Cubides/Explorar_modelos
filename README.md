ExploraModelo

Proyecto educativo (solo frontend) que muestra cómo cambia la sensación de la respuesta al variar parámetros de decodificación, sin depender de red ni backend.

Estado actual:
- Frontend Next.js 15 + TailwindCSS.
- Datos embebidos en `app/page.tsx` (no se usa `public/cases.json`).
- UI enfocada en la respuesta con efecto de tipeo y tema azul.

Cómo probar localmente (Windows PowerShell):
- cd frontend
- npm install
- npm run build
- npm run start:host  # inicia en http://127.0.0.1:3000

Notas:
- No hay dependencias de backend ni llamadas `fetch`.
- Para desarrollo en caliente: `npm run dev:host`.
- Si reintroduces un backend en el futuro, crea la carpeta `backend/` y documenta sus endpoints.

## Documentación
- [Guía de Usuario](./docs/user-guide.md) - Cómo usar la aplicación
- [README Técnico](./README.md) - Detalles técnicos, desarrollo, CI

# ExploraModelo — README técnico

Resumen breve
-------------
Proyecto educativo frontend (Next.js 15, TypeScript, Tailwind) que demuestra cómo cambian las respuestas según parámetros de decodificación. El app es completamente estática en tiempo de ejecución: los datos están embebidos en `frontend/app/page.tsx` y no realiza llamadas de red.

Requisitos
---------
- Node.js >= 18
- npm (o pnpm/yarn según preferencias)

Despliegue recomendado
----------------------
Esta aplicación está pensada para desplegarse en Vercel. Al importar el repositorio en Vercel, ajusta el "Root Directory" a `frontend/` y la plataforma detectará automáticamente la configuración de Next.js.

Estructura relevante
--------------------
- `frontend/` — app Next.js (app-router). Aquí están `package.json`, `app/`, `public/`.
- `backend/` — (vacío/optativo) si en el futuro añades microservicios.
- `.github/workflows/docker-ghcr.yml` — workflow que construye y publica la imagen a GHCR desde la rama `docker`.

# ExploraModelo — Documentación técnica (versión profesional)

Resumen ejecutivo
------------------
ExploraModelo es una aplicación de demostración educativa implementada como un frontend estático con Next.js + TypeScript + Tailwind. Su objetivo es enseñar, de forma demostrable y reproducible, cómo los parámetros de decodificación (Temperatura, Top-k, Top-p, Penalización por repetición) afectan las salidas de un modelo de lenguaje.

Características clave
- Frontend-only: sin llamadas a APIs en tiempo de ejecución — datos y patrones embebidos.
- Determinista: mapeo reproducible de parámetros a patrones de comportamiento.
- Accesibilidad: pruebas automáticas con axe-core + auditoría runtime con Puppeteer.
- Tests: vitest + Testing Library para lógica y UI.

Contenido de este documento
- Requisitos y quickstart
- Estructura del repositorio y decisiones arquitectónicas
- Scripts y flujos de desarrollo
- Testing y QA (incluye axe + puppeteer)
- CI y despliegue (Vercel)
- Contribución, seguridad y troubleshooting

Requisitos mínimos
------------------
- Node.js >= 18
- npm (o pnpm/yarn)

Quickstart (desarrollo)
-----------------------
Desde un terminal (PowerShell recomendado en Windows):

```powershell
cd frontend
npm ci
npm run dev:host   # hot-reload disponible en http://127.0.0.1:3000
```

Build de producción (local)

```powershell
cd frontend
npm run build
npm run start:host  # arranca el servidor de producción en 127.0.0.1:3000
```

Estructura del repositorio (alta abstracción)
--------------------------------------------
Root/
	├─ frontend/                # Next.js app (producción)
	│   ├─ app/                 # rutas y UI principal
	│   ├─ components/          # componentes reutilizables
	│   ├─ data/                # casos / patrones embebidos
	│   ├─ utils/               # mapeo determinista y helpers
	│   ├─ tests/               # vitest + testing-library + axe tests
	│   └─ scripts/             # QA scripts (axe + puppeteer)
	└─ backend/ (opcional)

Decisiones de diseño (motivo y trade-offs)
------------------------------------------
- Datos embebidos: evita depender de infra adicional y facilita reproducibilidad — trade-off: mayor tamaño del bundle, menor flexibilidad.
- Determinismo: facilita teaching/UX y pruebas, pero no busca replicar un modelo real-time.
- Minimal external deps: se prefiere lazy-loading (ej. `html2canvas`) para exports.

Arquitectura lógica (diagrama ASCII)
-----------------------------------

Frontend (UI)                          Deterministic mapping
--------------                          --------------------
	app/page.tsx  <--- user params ---+--> utils/decoding.ts ---+--> patterns (data/cases)
	components/*                      |                         |
	tests/*                           +-- UI render/update -----+

Descripción de módulos
- `frontend/app/page.tsx`: orquestador del flujo (steps, playground, visualización)
- `frontend/components/*`: sliders, selector de casos, lista de ejemplos, badges
- `frontend/data/cases.ts`: fuente de verdad para buckets, patterns y textos precomputados
- `frontend/utils/decoding.ts`: funciones puras: mapToBucketT/K/P/R, choosePattern, nearestIndexForExamples

Scripts y comandos relevantes
-----------------------------
En `frontend/package.json` encontrarás scripts para desarrollo, build y QA. Resumen útil:

- `npm run dev:host` — desarrollo (hosted on 127.0.0.1:3000)
- `npm run build` — build de producción
- `npm run start:host` — iniciar build estático en host local
- `npm run lint` — eslint
- `npm run test` — vitest (unit + ui tests)
- `npm run axe:puppeteer-ext` — auditoría runtime con Puppeteer + axe-core

Testing y calidad
-----------------
Estrategia:
- Unit tests para lógica pura (`utils/decoding.ts`).
- Component tests con Testing Library para interacciones clave.
- Accesibility: dos niveles
	1) Unit/DOM: axe-core integrado en vitest (fast, snapshot-like checks).
	2) Runtime: Puppeteer + axe para validar focus order, keyboard navigation y casos dinámicos.

Ejecutar la batería de tests (local):

```powershell
cd frontend
npm run test -- --run
```

Ejecutar auditoría runtime (requiere Chrome):

```powershell
cd frontend
npm run axe:puppeteer-ext
```

Calidad requerida para PRs
- `npm run lint`: sin errores.
- `npm run test -- --run`: todos los tests deben pasar.
- (Opcional) `npm run axe:puppeteer-ext` localmente para verificar interacciones.

Accesibilidad (resumen)
----------------------
- `aria-live="polite"` para la salida de texto generado.
- Todos los controles de formulario tienen `label[htmlFor]`/`id` asociados.
- Medidas automáticas: axe-core en tests y Puppeteer audit.

CI / GitHub Actions (recomendado)
---------------------------------
Un flujo mínimo para PRs:

1) Install
	- cd frontend
	- npm ci
2) Test
	- npm run test -- --run
3) Build
	- npm run build

Ejemplo abreviado de job (usar en `.github/workflows/ci.yml`):

```yaml
name: frontend-ci
on: [push, pull_request]
jobs:
	test-build:
		runs-on: ubuntu-latest
		steps:
			- uses: actions/checkout@v4
			- uses: actions/setup-node@v4
				with:
					node-version: 20
			- name: Install
				run: |
					cd frontend
					npm ci
			- name: Run tests
				run: |
					cd frontend
					npm run test -- --run
			- name: Build
				run: |
					cd frontend
					npm run build

	# Opcional: ejecutar auditoría axe en un job separado (necesita Chrome)
	# axe-audit:
	#   runs-on: ubuntu-latest
	#   needs: test-build
	#   steps:
	#     - uses: actions/checkout@v4
	#     - uses: actions/setup-node@v4
	#       with: { node-version: 20 }
	#     - run: |
	#         cd frontend
	#         npm ci
	#     - run: |
	#         cd frontend
	#         npm run axe:puppeteer-ext
```

Despliegue
----------
- Plataforma recomendada: Vercel.
- Configuración: en el dashboard de Vercel, apuntar `Root Directory` a `frontend/`. Vercel detectará Next.js y realizará build automáticamente.

Export/artefactos
-----------------
- PNG export: implementado con `html2canvas` (lazy-load). Si falla por CORS/dev env, el app hace fallback a descarga JSON con los parámetros y el texto.

Contribuir
----------
- Flujo sugerido:
	1. Fork -> branch `feature/<short-desc>` o `fix/<id>`.
	2. Añadir tests donde corresponda.
	3. Asegurar `npm run lint` y `npm run test` locales pasan.
	4. Abrir PR con descripción técnica y casos de prueba.

Checklist para PRs
- Cambios bien explicados en el cuerpo del PR.
- Unit tests añadidos/actualizados.
- Lint y tests pasan.
- Si hay cambios UI: capturas y nota de accesibilidad.

Problemas comunes y soluciones rápidas
-----------------------------------
- Error: `npm run build` falla por PostCSS/autoprefixer
	- Solución: instalar `postcss` y `autoprefixer` en devDependencies y ejecutar `npm ci`.
- Error: PNG export falla
	- Solución: verifica CORS en recursos embebidos o usa el fallback JSON.
- Error: axe reporta controles sin label
	- Solución: asegúrate de `label htmlFor` + `id` en inputs/selects.

Seguridad y privacidad
----------------------
- No se almacenan datos de usuario por defecto.
- Si se añade backend en el futuro: proteger endpoints con autenticación y validar inputs estrictamente.

CHANGELOG / Releases
---------------------
- Mantener `CHANGELOG.md` con formato semántico para releases mayores.

Contacto y soporte
------------------
- Owner / Maintainer: Pablo Cubides — revisiones de arquitectura y PRs.
- Para bugs o features: abrir un Issue con la etiqueta `bug` o `enhancement`.

Notas finales
------------
Esta documentación pretende ser la referencia principal para desarrolladores que mantendrán o contribuirán a ExploraModelo. Si quieres, puedo:
- Añadir diagramas Mermaid/PlantUML en `docs/`.
- Generar `CHANGELOG.md` a partir de commits.
- Crear plantillas (ISSUE / PR) y un job opcional para auditoría axe en CI.

---

Si quieres que aplique cualquiera de las tareas sugeridas (por ejemplo: agregar el job de CI para axe o añadir diagramas en `docs/`), dime cuál y lo implemento.


- Build / Start:

```powershell
npm run build
npm run start:host
```

Notas técnicas
-------------
- Si el build reporta errores relacionados con PostCSS/autoprefixer instala las devDependencies necesarias y reintenta: `npm ci`.
- La app está pensada para producción estática y no hace llamadas a APIs en tiempo de ejecución.

Limpieza y CI
-------------
- Se eliminaron referencias a Docker/GHCR del README y la CI está configurada para ejecutar tests y build antes de desplegar.

Contacto
-------
Si quieres que adapte el README a un tono más académico o que incluya instrucciones específicas para Docker/GHCR (si planeas volver a usar esas herramientas), dímelo y lo actualizo.

