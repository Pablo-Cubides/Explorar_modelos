ExploraModelo

Demo educativa (frontend-only) que muestra cómo cambian las salidas al variar parámetros de decodificación (Temperatura, Top‑k, Top‑p, Penalización por repetición). Sin backend ni dependencias de red.

Lo interesante (para usuarios y reclutadores)
- UX enfocada en la respuesta: efecto de tipeo, diseño claro y tema azul.
- Explicaciones dinámicas de parámetros (2–3 líneas por cada T/K/P/R) para aprendizaje.
- Datos embebidos: funciona 100% offline; cero llamadas a red.
- Exportar resultados: PNG (html2canvas) y JSON con los parámetros y variante elegida.
- Next.js 15 (App Router) + React 18 + Tailwind; build y prerender estático.

Estructura y stack
- Frontend: `frontend/` (Next.js + Tailwind + TypeScript).
- Lógica: mapeo determinista de sliders a patrones A–J; casos en `app/page.tsx`.
- Accesibilidad básica: labels/aria en inputs; UI responsive.

Cómo usar en local (Windows PowerShell)
```powershell
cd frontend
npm install
npm run build
npm run start:host  # abre http://127.0.0.1:3000
```
Desarrollo con hot‑reload: `npm run dev:host`.

Ejecutar con Docker (construyendo localmente)
```powershell
cd frontend
docker build -t exploramodelo:local .
docker run --rm -p 3000:3000 exploramodelo:local
```

Imagen en GHCR (CI en rama `docker`)
- Al hacer push a la rama `docker`, GitHub Actions construye y publica una imagen en GHCR: `ghcr.io/<owner>/exploramodelo` con tags por rama y SHA.
- Para hacer pull (si el paquete es público y tienes login a GHCR):
```powershell
docker login ghcr.io
docker pull ghcr.io/Pablo-Cubides/exploramodelo:docker
docker run --rm -p 3000:3000 ghcr.io/Pablo-Cubides/exploramodelo:docker
```
Nota: si no puedes hacer pull, marca el paquete como público en “Packages” del repo/owner.

Despliegue en Vercel (sin vercel.json)
- Crea el proyecto en Vercel y establece Root Directory = `frontend/`.
- Framework: Next.js. Rama sugerida: `vercel` (o `main`).
- La app no necesita variables de entorno ni backend.

Ramas
- main: fuente de verdad del código y contenido.
- vercel: pensada para despliegue directo en Vercel (sin Docker).
- docker: incluye Dockerfile y workflow de CI para GHCR.

Roadmap (corto y útil)
- Tooltips en sliders y atajos de teclado.
- Tests ligeros de UI/funcionalidad y CI básico.
- Demo pública en Vercel lista para compartir en clase.

Rama `vercel`:
- Esta rama contiene la versión lista para publicar en Vercel (sin Docker). Si quieres que publique automáticamente desde GitHub, conecta esta rama en tu proyecto de Vercel.

