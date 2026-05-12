import https from 'https';
import querystring from 'querystring';

function req(opts, body) {
  return new Promise((resolve, reject) => {
    const r = https.request(opts, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}

(async () => {
  // Login
  const pbody = querystring.stringify({
    log: 'passoapassouniformes2025@gmail.com',
    pwd: 'Passo26*',
    wp_submit: 'Log In',
    redirect_to: '/wp-admin/',
    testcookie: '1'
  });
  const lp = await req({
    hostname: 'passoapassouniformes.com', path: '/wp-login.php', method: 'POST',
    headers: { 'User-Agent': 'Mozilla/5.0', 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(pbody), 'Cookie': 'wordpress_test_cookie=WP%20Cookie%20check' }
  }, pbody);
  const cookies = (lp.headers['set-cookie'] || []).map(c => c.split(';')[0]).join('; ');
  console.log('Login:', lp.status, '| logged_in:', cookies.includes('logged_in'));

  // Get fresh nonce from LS page
  const lsPageRes = await req({
    hostname: 'passoapassouniformes.com', path: '/wp-admin/admin.php?page=litespeed-cache',
    method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0', 'Cookie': cookies }
  });
  const ls = lsPageRes.body;

  // Extract the purge nonce
  const purgeNonceMatch = ls.match(/LSCWP_CTRL=purge[^'"]*LSCWP_NONCE=([a-f0-9]{10})/);
  const purgeNonce = purgeNonceMatch ? purgeNonceMatch[1] : null;
  console.log('Purge nonce:', purgeNonce);

  if (!purgeNonce) {
    console.error('No purge nonce found!');
    return;
  }

  // Execute purge all
  const purgeAllUrl = `/wp-admin/admin.php?page=litespeed-cache&LSCWP_CTRL=purge&LSCWP_NONCE=${purgeNonce}&litespeed_type=purge_all`;
  console.log('Executing:', purgeAllUrl);
  const r1 = await req({
    hostname: 'passoapassouniformes.com', path: purgeAllUrl, method: 'GET',
    headers: { 'User-Agent': 'Mozilla/5.0', 'Cookie': cookies, 'Referer': 'https://passoapassouniformes.com/wp-admin/admin.php?page=litespeed-cache' }
  });
  console.log('purge_all status:', r1.status, '| location:', r1.headers.location || '');

  // Check for success message in body
  const successMsg = r1.body.match(/purge|success|notice-success|Limpo|cleared/gi);
  console.log('Success indicators:', successMsg ? [...new Set(successMsg)].join(', ') : 'none found');

  // Also purge LSCache specifically
  const purgeLscacheUrl = `/wp-admin/admin.php?page=litespeed-cache&LSCWP_CTRL=purge&LSCWP_NONCE=${purgeNonce}&litespeed_type=purge_all_lscache`;
  const r2 = await req({
    hostname: 'passoapassouniformes.com', path: purgeLscacheUrl, method: 'GET',
    headers: { 'User-Agent': 'Mozilla/5.0', 'Cookie': cookies, 'Referer': 'https://passoapassouniformes.com/wp-admin/admin.php?page=litespeed-cache' }
  });
  console.log('purge_all_lscache status:', r2.status);
  const successMsg2 = r2.body.match(/purge|success|notice-success|Limpo|cleared/gi);
  console.log('Success indicators:', successMsg2 ? [...new Set(successMsg2)].join(', ') : 'none found');

  // Now verify the /loja/ page no longer has stale cache
  console.log('\nVerifying /loja/ cache...');
  const lojaRes = await req({
    hostname: 'passoapassouniformes.com', path: '/loja/', method: 'GET',
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  console.log('loja status:', lojaRes.status);
  console.log('x-litespeed-cache:', lojaRes.headers['x-litespeed-cache'] || 'not set');
  console.log('Has add_to_cart_button:', lojaRes.body.includes('add_to_cart_button'));
  console.log('Has product_type_external:', lojaRes.body.includes('product_type_external'));
  console.log('Has fazer-pedido:', lojaRes.body.includes('fazer-pedido'));

  // Extract button hrefs
  const btns = [...lojaRes.body.matchAll(/href="([^"]*fazer-pedido[^"]*)"/g)];
  btns.forEach(m => console.log('fazer-pedido link:', m[1]));
})();
