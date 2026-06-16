# Simplify Support

Frontend del centro de ayuda con IA para clientes de Simplify. El usuario escribe una pregunta, el sistema consulta un backend RAG en AWS y devuelve la respuesta en formato de documentación.

## Arquitectura

```
Vercel (frontend + BFF)              AWS
─────────────────────────            ─────────────────────
frontend/index.html  ──fetch──▶  api/ask.js (Edge Function)
                                      │
                                      │  x-api-key (env var)
                                      ▼
                               API Gateway ──▶ Lambda / RAG IA
```

- **Frontend:** HTML + CSS + JS estático servido por Vercel Pages
- **BFF (Backend-for-Frontend):** Vercel Edge Function en `api/ask.js` — recibe la pregunta del cliente, adjunta la API Key (variable de entorno) y hace el proxy hacia AWS API Gateway. La API Key nunca queda expuesta en el cliente.
- **Backend:** AWS API Gateway autenticado con API Key → sistema RAG con IA

## Estructura del proyecto

```
simplify-support/
├── frontend/           # Archivos estáticos (Vercel los sirve como raíz)
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── assets/
│       ├── logo.svg
│       ├── logo-horizontal.svg
│       └── favicon.png
├── api/
│   └── ask.js          # Vercel Edge Function — proxy BFF hacia API Gateway
├── vercel.json         # Apunta el output a /frontend y define runtime edge
└── README.md
```

## Variables de entorno

Configurar en el dashboard de Vercel (Settings → Environment Variables):

| Variable | Descripción |
|---|---|
| `API_GATEWAY_URL` | URL del endpoint en AWS API Gateway |
| `API_GATEWAY_KEY` | API Key para autenticar las peticiones |

## Deploy

El proyecto se deploya automáticamente desde GitHub vía Vercel.

1. Conectar el repo `Simplify-Ecommerce/simplify-support` en vercel.com
2. Vercel detecta `vercel.json` y sirve `frontend/` como raíz
3. `api/ask.js` queda disponible en `/api/ask` como Edge Function
4. Agregar las variables de entorno en el dashboard

## Desarrollo local

```bash
# Servidor estático con live reload
npx live-server frontend

# O con Vercel CLI (incluye las Edge Functions)
npx vercel dev
```

## Pendiente

- [ ] Descomentar la llamada real en `frontend/app.js` cuando el API Gateway esté listo
- [ ] Implementar el envío de tickets al formulario de Cecilia
- [ ] Conectar variables de entorno en Vercel dashboard
