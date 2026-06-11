async (page) => {
  const fs = require('fs');
  const path = require('path');
  const htmlContent = fs.readFileSync(
    path.resolve(__dirname, '..', 'index_novo.html'),
    'utf-8'
  );

  const jwt = await page.evaluate(() => localStorage.getItem('jwt'));

  const resp = await page.evaluate(async ([token, body]) => {
    const r = await fetch('/adf1974658183e4f/api/resources/public_html/index.html', {
      method: 'PUT',
      headers: {
        'x-auth': token,
        'Content-Type': 'text/plain; charset=utf-8'
      },
      body: body
    });
    const text = await r.text();
    return { status: r.status, ok: r.ok, response: text.substring(0, 100) };
  }, [jwt, htmlContent]);

  return resp;
}
