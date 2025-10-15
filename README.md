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

Scripts útiles (desde `frontend/`)
--------------------------------
- Instalación:

```powershell
cd frontend
npm ci
```

- Desarrollo (hot-reload, host local):

```powershell
npm run dev:host   # expone en 127.0.0.1 y puerto configurable
```

- Build y arranque de producción:

```powershell
npm run build
npm run start:host  # arranca Next.js en 127.0.0.1:3000
```

Notas técnicas de build
----------------------
- El build está probado en Windows PowerShell; si hay errores CSS relacionados con PostCSS/autoprefixer, instala las dependencias dev (`postcss`, `autoprefixer`) y vuelve a `npm ci`.
- La app está diseñada para prerenderizar páginas estáticas y no depende de APIs en tiempo de ejecución.

docker run --rm -d -p 127.0.0.1:3000:3000 --name exploramodelo $img
Ramas y despliegue
------------------
# ExploraModelo

Proyecto educativo (solo frontend) que muestra cómo cambia la sensación de la respuesta al variar parámetros de decodificación, sin depender de red ni backend.

Estado actual
------------
- Frontend: Next.js 15 + TypeScript + Tailwind CSS.
- Datos embebidos en `frontend/app/page.tsx` (demo determinista, sin fetch).
- UI con tema oscuro/azul, efecto de tipeo y controles interactivos para Temperatura, Top-k, Top-p y Penalización por repetición.

Requisitos
---------
- Node.js >= 18
- npm (o pnpm/yarn)

Desarrollo local (Windows PowerShell)
-----------------------------------
Abre PowerShell y ejecuta:

```powershell
cd frontend
npm ci
npm run dev:host   # desarrollo con hot-reload
```

Build y ejecución de producción (local)
--------------------------------------
En el directorio `frontend/`:

```powershell
npm run build
npm run start:host  # arranca en http://127.0.0.1:3000
```

Despliegue recomendado
----------------------
Se recomienda desplegar en Vercel. Al crear el proyecto en Vercel, configura el "Root Directory" en `frontend/` (Vercel detectará automáticamente Next.js y realizará el build).

Estructura importante
---------------------
- `frontend/` — código de la app (app-router). Contiene `package.json`, `app/`, `components/`, `data/` y `tests/`.
- `backend/` — opcional; actualmente no se usa.

Scripts útiles (en `frontend/`)
----------------------------
- Instalación:

```powershell
npm ci
```

- Desarrollo:

```powershell
npm run dev:host
```

- Tests (Vitest):

```powershell
npm run test -- --run
```

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

