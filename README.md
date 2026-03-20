# LOL Mind Frontend

Aplicacion frontend construida con React 19 + TypeScript + Vite.

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Variables de entorno

Copiar `.env.example` a `.env` y configurar al menos:

```bash
VITE_API_BASE_URL="https://tu-backend.com"
```

Tambien se soporta `VITE_BACKEND_URL` como alternativa.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build de produccion

```bash
npm run build
npm run preview
```

## Despliegue en Vercel

El proyecto ya incluye `vercel.json` para:

- usar el framework `vite`
- compilar con `npm run build`
- publicar `dist`
- resolver rutas SPA (React Router) con rewrite a `index.html`

### Opcion 1: Desde dashboard

1. Importa el repositorio en Vercel.
2. Verifica estos valores:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. En Settings -> Environment Variables agrega:
   - `VITE_API_BASE_URL`
   - (opcional) `VITE_BACKEND_URL`
4. Deploy.

### Opcion 2: Con Vercel CLI

```bash
npm i -g vercel
vercel
vercel --prod
```
