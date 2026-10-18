export async function onRequestPost(context: { request: Request }) {
  try {
    const { request } = context;
    const body: any = await request.json();
    const token = body?.token;

    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'Token missing' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = new FormData();
    formData.append('secret', '0x4AAAAAAAz-_rIRuLnz1dlLkqdGOO_CXZ4');
    formData.append('response', token);

    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const result = await fetch(url, {
      body: formData,
      method: 'POST',
    });

    const outcome: any = await result.json();
    if (outcome.success) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ success: false }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
