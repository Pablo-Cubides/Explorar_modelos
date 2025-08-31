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

GHCR (imagen pública)
----------------------
La rama `docker` construye y publica automáticamente una imagen Docker en GitHub Container Registry (GHCR) con etiqueta `ghcr.io/Pablo-Cubides/exploramodelo`.

Estado: la imagen está pensada para ser pública. Si ya ves el paquete en GitHub > Packages y aparece como público, cualquier persona puede hacer:

```powershell
docker pull ghcr.io/Pablo-Cubides/exploramodelo:docker
docker run --rm -p 3000:3000 ghcr.io/Pablo-Cubides/exploramodelo:docker
# abrir http://127.0.0.1:3000
```

Qué implica que esté pública (fácil y profesional)
- Accesibilidad: otros desarrolladores y reclutadores pueden reproducir tu demo con un solo `docker pull`.
- Transparencia: muestra tu flujo de CI→CD (Actions → Packages), se ve profesional y listo para producción ligera.
- Seguridad/privacidad: al ser pública, cualquiera puede ejecutar la imagen; si almacenaras secretos o modelos privados, deberías mantenerla privada y usar autenticación para pulls.

Cómo hacerlo público (si aún no lo está)
- UI: GitHub → tu repo → Packages → selecciona el paquete `exploramodelo` → Settings → Change visibility → Public.
- CLI (alternativa):
```powershell
gh auth login
gh api -X PATCH /user/packages/container/exploramodelo/visibility -f visibility=public
```

Nota: no puedo cambiar la visibilidad por ti desde aquí (requiere tu cuenta/permiso), pero estos pasos son todo lo que hay que hacer.

Pequeño texto profesional para usar en CV/Readme (opcional):
"ExploraModelo — frontend educativo en Next.js construido para demostraciones reproducibles. CI automatizado con GitHub Actions publica imágenes Docker en GHCR para despliegue y pruebas locales; despliegue de frontend en Vercel. Ideal para workshops y evaluaciones técnicas."

