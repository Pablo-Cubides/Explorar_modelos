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
- vercel: rama pensada para desplegar en Vercel (sin Docker).
- docker (opcional, futura): con Dockerfile/compose para ejecución local o despliegue en hosts de contenedores.

Vercel (sin vercel.json)
- Al crear el proyecto en Vercel, selecciona Monorepo/Project Settings y establece Root Directory en `frontend/`.
- Framework: Next.js. Los scripts de `package.json` ya están listos.
- Despliegue automático al hacer push en la rama `vercel` (o `main` si la eliges).

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

