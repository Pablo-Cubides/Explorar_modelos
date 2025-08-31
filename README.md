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

Ramas de despliegue
- main: fuente de verdad del código.
- vercel: preparada para despliegue directo en Vercel (sin Docker). Vercel puede apuntar a esta rama.
- docker (opcional, futura): con Dockerfile/compose para ejecución local o despliegue en hosts de contenedores.

Vercel
- Se incluye `vercel.json` en la raíz para indicar que la app vive en `frontend/`.
- Pasos: conecta el repo en Vercel y selecciona la rama `vercel` (o `main`), framework Next.js, y despliega.

Rama `vercel`:
- Esta rama contiene la versión lista para publicar en Vercel (sin Docker). Si quieres que publique automáticamente desde GitHub, conecta esta rama en tu proyecto de Vercel.

