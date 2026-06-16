export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { question } = await req.json();

  if (!question?.trim()) {
    return new Response(JSON.stringify({ error: 'question is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = process.env.API_GATEWAY_URL;
  const key = process.env.API_GATEWAY_KEY;

  console.log('[ask] URL:', url);
  console.log('[ask] Key defined:', !!key);

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
      },
      body: JSON.stringify({ question }),
    });
  } catch (fetchErr) {
    console.error('[ask] fetch failed:', fetchErr.message);
    return new Response(JSON.stringify({ error: 'fetch failed', detail: fetchErr.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log('[ask] upstream status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[ask] upstream error:', errorText);
    return new Response(JSON.stringify({ error: 'upstream error', status: response.status, detail: errorText }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
