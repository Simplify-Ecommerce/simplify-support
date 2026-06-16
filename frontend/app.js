const app       = document.getElementById('app');
const hero      = document.getElementById('hero');
const heroForm  = document.getElementById('hero-form');
const topForm   = document.getElementById('topbar-form');
const mainInput = document.getElementById('main-input');
const topInput  = document.getElementById('top-input');
const docArticle = document.getElementById('doc-article');

// Placeholder response for development — replace with Worker call
const MOCK_RESPONSE = `
# ¿Cómo configuro mi tienda en Simplify?

Configurar tu tienda en Simplify es un proceso que puedes completar en pocos pasos desde tu panel de administración.

## Paso 1: Información de la tienda

Completa los datos básicos de tu negocio desde **Configuración → Mi tienda**:

- **Nombre**: cómo aparecerá para tus clientes
- **Descripción**: resumen breve de tus productos o servicios
- **Logotipo**: sube un archivo PNG o SVG (recomendado 200 × 60 px)

## Paso 2: Métodos de pago

Activa los métodos disponibles desde **Configuración → Pagos**. Actualmente soportamos:

- Tarjetas de crédito y débito (Visa, Mastercard)
- Transferencia bancaria
- Pago en efectivo mediante punto autorizado

## Paso 3: Envíos y entregas

Define tus zonas de envío desde **Configuración → Envíos**. Puedes crear zonas por ciudad, provincia o zona personalizada.

\`\`\`
Zona Local     →  $3.00
Zona Nacional  →  $8.00
Internacional  →  Consultar con soporte
\`\`\`

## Paso 4: Publica tu tienda

Una vez completada la configuración, haz clic en **Publicar tienda** en el panel principal. Tu tienda estará activa de inmediato.

> Si tienes dudas durante el proceso, puedes abrir un caso de soporte desde el panel y un agente te contactará en menos de 24 horas.
`;

async function ask(question) {
  if (!question.trim()) return;

  app.classList.add('has-response');
  topInput.value = question;

  // Show loading
  docArticle.innerHTML = '<div class="doc-loading"><span></span><span></span><span></span></div>';

  // Collapse hero after fade-out transition completes
  setTimeout(() => app.classList.add('hero-collapsed'), 380);

  // TODO: replace with actual Cloudflare Worker endpoint
  // const res = await fetch('https://<worker>.workers.dev/ask', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ question }),
  // });
  // const { answer } = await res.json();

  await new Promise(r => setTimeout(r, 1100)); // simulate latency
  const answer = MOCK_RESPONSE;

  docArticle.innerHTML = marked.parse(answer);
  revealContent();
}

function revealContent() {
  Array.from(docArticle.children).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = `opacity 0.35s ${i * 0.07}s ease, transform 0.35s ${i * 0.07}s ease`;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      })
    );
  });
}

heroForm.addEventListener('submit', e => {
  e.preventDefault();
  ask(mainInput.value);
});

topForm.addEventListener('submit', e => {
  e.preventDefault();
  ask(topInput.value);
  topInput.value = '';
});
