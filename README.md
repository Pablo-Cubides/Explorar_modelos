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
- Docker (opcional, para ejecutar la imagen GHCR)

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

Docker / GHCR
-------------
- Imagen publicada (workflow en rama `docker`):

	ghcr.io/pablo-cubides/exploramodelo:docker

- Pull y ejecución (PowerShell):

```powershell
$img = 'ghcr.io/pablo-cubides/exploramodelo:docker'
docker pull $img
docker run --rm -d -p 127.0.0.1:3000:3000 --name exploramodelo $img
# abrir http://127.0.0.1:3000
```

- Cómo funciona el CI: el workflow `.github/workflows/docker-ghcr.yml` detecta pushes a la rama `docker`, ejecuta un build multi-stage y hace push a GHCR con tag `docker` y SHA.

Ramas y despliegue
------------------
- `main` — código fuente principal.
- `vercel` — preparada para desplegar en Vercel; al crear el proyecto en Vercel, establece Root Directory = `frontend/`.
- `docker` — contiene Dockerfile y el workflow que publica la imagen en GHCR.

Seguridad y visibilidad de la imagen
-----------------------------------
- Si la imagen está marcada como pública en GitHub Packages, cualquier persona puede hacer `docker pull` sin autenticación.
- Para hacerlo público desde la interfaz: GitHub → Repo → Packages → seleccionar paquete → Settings → Change visibility → Public.
- CLI (requiere `gh` auth):

```powershell
gh auth login
gh api -X PATCH /user/packages/container/exploramodelo/visibility -f visibility=public
```

Verificación rápida (chequeos que hicimos)
----------------------------------------
- `npm run build` (en `frontend/`) → build completado.
- `docker pull` + `docker run` → contenedor arrancó y respondió en 127.0.0.1:3000.

Problemas comunes y soluciones
------------------------------
- Puerto 3000 ocupado: `netstat -ano | findstr :3000` y termina proceso si es necesario.
- Errores de CSS/PostCSS: instala `postcss` y `autoprefixer` en devDependencies y re-run `npm ci`.
- Errores de permisos GHCR: asegúrate de un PAT con scope `read:packages`/`write:packages` para pulls privados o pushes.

Contacto/uso en CV
------------------
Texto sugerido (una línea):

"ExploraModelo — demo educativa en Next.js con CI que publica imágenes Docker en GHCR para despliegue y pruebas locales."

Si quieres, adapto el tono (más académico, técnico o comercial) y actualizo este `README.md`.

