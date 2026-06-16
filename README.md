# Simplify Support

Prototipo de frontend para un sistema de soporte con servicios de IA en AWS.

## Arquitectura

```
Cloudflare Pages          Cloudflare Worker         AWS
(HTML/CSS/JS)   →  fetch  (guarda API Key)  →  API Gateway → IA
```

- **Frontend:** HTML + CSS estático, hosteado en Cloudflare Pages (deploy desde GitHub)
- **BFF (Backend-for-Frontend):** Cloudflare Worker — actúa como proxy, guarda la API Key en variables de entorno para que nunca quede expuesta en el cliente
- **Backend:** AWS API Gateway autenticado con API Key → servicios de IA

## Estructura del proyecto

```
simplify-support/
├── frontend/       # HTML, CSS, JS estático
└── worker/         # Cloudflare Worker (BFF)
```

## Por qué Cloudflare Worker como BFF

El frontend no puede guardar la API Key de AWS sin exponerla. El Worker actúa como intermediario: recibe las peticiones del frontend, adjunta la API Key (guardada como variable de entorno en Cloudflare) y las reenvía al API Gateway de AWS.
