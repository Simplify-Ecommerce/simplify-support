async function checkShopifyStatus() {
  const dot  = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  try {
    const res  = await fetch('https://www.shopifystatus.com/api/v2/status.json');
    const data = await res.json();
    const indicator = data.status.indicator; // 'none' | 'minor' | 'major' | 'critical'

    const labels = {
      none:     'Shopify operativo',
      minor:    'Shopify — incidencia menor',
      major:    'Shopify — incidencia mayor',
      critical: 'Shopify — interrupción crítica',
    };

    text.textContent = labels[indicator] ?? data.status.description;
    dot.className = 'status-dot ' + (indicator === 'none' ? 'ok' : indicator === 'minor' ? 'warning' : 'error');
  } catch {
    text.textContent = 'Ver estado de Shopify';
    dot.className = 'status-dot';
  }
}

checkShopifyStatus();

const app        = document.getElementById('app');
const hero       = document.getElementById('hero');
const heroForm   = document.getElementById('hero-form');
const topForm    = document.getElementById('topbar-form');
const mainInput  = document.getElementById('main-input');
const topInput   = document.getElementById('top-input');
const docArticle = document.getElementById('doc-article');
const topbarLogo = document.querySelector('.topbar-logo');

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

  // Show skeleton
  docArticle.innerHTML = `
    <div class="skeleton">
      <div class="sk-line sk-title"></div>
      <div class="sk-line sk-p" style="width:90%"></div>
      <div class="sk-line sk-p" style="width:75%"></div>
      <div class="sk-line sk-p" style="width:83%"></div>
      <div class="sk-line sk-heading" style="margin-top:32px;width:45%"></div>
      <div class="sk-line sk-p" style="width:95%"></div>
      <div class="sk-line sk-p" style="width:88%"></div>
      <div class="sk-line sk-p" style="width:60%"></div>
      <div class="sk-line sk-heading" style="margin-top:32px;width:38%"></div>
      <div class="sk-line sk-p" style="width:92%"></div>
      <div class="sk-line sk-p" style="width:70%"></div>
    </div>
  `;

  // Collapse hero after fade-out transition completes
  setTimeout(() => app.classList.add('hero-collapsed'), 380);

  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (!res.ok) throw new Error('upstream');

    const data = await res.json();
    const answer = data.answer ?? '';

    if (answer.trim() === 'NO_INFO') {
      docArticle.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v4M11 16h.01"/></svg>
          </div>
          <h3 class="no-results-title">No encontramos información sobre esto</h3>
          <p class="no-results-desc">Esta consulta no está cubierta en nuestra base de conocimiento. Podés enviar un ticket y nuestro equipo te responderá.</p>
          <button class="no-results-btn" onclick="document.getElementById('ticket-section').scrollIntoView({ behavior: 'smooth' })">Enviar ticket</button>
        </div>`;
    } else {
      docArticle.innerHTML = marked.parse(answer);
      revealContent();
    }
  } catch {
    docArticle.innerHTML = '<p class="doc-error">Ocurrió un error al procesar tu consulta. Intenta de nuevo.</p>';
  }
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

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    mainInput.value = chip.textContent;
    ask(chip.textContent);
  });
});

function reset() {
  const docContent = document.getElementById('doc-content');

  // Fade out doc content smoothly before collapsing layout
  docContent.style.transition = 'opacity 0.25s ease';
  docContent.style.opacity = '0';
  docContent.style.pointerEvents = 'none';

  // Restore hero height while still invisible — no layout jump
  app.classList.remove('hero-collapsed');

  setTimeout(() => {
    // Trigger topbar slide-out and hero fade-in via CSS transitions
    app.classList.remove('has-response');
    // Clean up inline styles so CSS takes over again
    docContent.style.cssText = '';
    docArticle.innerHTML = '';
    mainInput.value = '';
    topInput.value = '';
  }, 280);
}

topbarLogo.addEventListener('click', reset);

document.getElementById('ticket-form')?.addEventListener('submit', e => {
  e.preventDefault();
  // TODO: enviar datos al Worker → API Gateway → notificar a Cecilia
  document.getElementById('ticket-form').hidden = true;
  document.getElementById('ticket-success').hidden = false;
});

heroForm.addEventListener('submit', e => {
  e.preventDefault();
  ask(mainInput.value);
});

topForm.addEventListener('submit', e => {
  e.preventDefault();
  ask(topInput.value);
  topInput.value = '';
});
