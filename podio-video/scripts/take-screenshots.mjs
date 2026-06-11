/**
 * Screenshot automático do Pódio de Vendas.
 *
 * 1. Abre Chrome visível na tela de login
 * 2. Você faz login normalmente
 * 3. O script detecta o slug e captura tudo automaticamente
 *
 * Executar: node scripts/take-screenshots.mjs
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer');

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'screenshots');
fs.mkdirSync(OUT_DIR, { recursive: true });

const BASE = 'https://podio-de-vendas.vercel.app';
const wait = ms => new Promise(r => setTimeout(r, ms));

async function shot(page, filename, ms = 2500) {
  await wait(ms);
  await page.screenshot({ path: path.join(OUT_DIR, filename), type: 'png' });
  console.log(`  ✅ ${filename}`);
}

async function main() {
  console.log('\n🚀 Abrindo Chrome para login...\n');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--start-maximized'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Vai para login
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2' });

  console.log('⏳ Faça login no Chrome que abriu...');
  console.log('   Aguardando você ser redirecionado para o dashboard...\n');

  // Espera até a URL conter /dashboard (login completo)
  await page.waitForFunction(
    (base) => window.location.href.includes('/dashboard'),
    { timeout: 120000, polling: 1000 },
    BASE
  );

  await wait(2000);

  // Detecta o slug da URL atual
  const currentUrl = page.url();
  const slugMatch = currentUrl.match(/vercel\.app\/([^/]+)\/dashboard/);
  const slug = slugMatch ? slugMatch[1] : null;

  if (!slug) {
    console.error('❌ Não consegui detectar o slug. URL atual:', currentUrl);
    await browser.close();
    return;
  }

  console.log(`✅ Workspace detectado: "${slug}"\n`);
  console.log('📸 Capturando screenshots...\n');

  const dashUrl = `${BASE}/${slug}/dashboard`;

  // ── Dashboard (pódio no topo) ──────────────────────────
  await page.goto(dashUrl, { waitUntil: 'networkidle2' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, 'dashboard.png', 3000);
  await shot(page, 'podio.png', 500);

  // ── Metas ─────────────────────────────────────────────
  await page.evaluate(() => window.scrollBy(0, 700));
  await shot(page, 'metas.png', 1500);

  // ── Roleta ────────────────────────────────────────────
  await page.evaluate(() => window.scrollBy(0, 900));
  await shot(page, 'roleta.png', 1500);

  // ── Modo TV ───────────────────────────────────────────
  await page.goto(dashUrl, { waitUntil: 'networkidle2' });
  const tvLink = await page.evaluate(() => {
    const a = Array.from(document.querySelectorAll('a')).find(a => a.href.includes('/tv/'));
    return a ? a.href : null;
  });

  if (tvLink) {
    await page.goto(tvLink, { waitUntil: 'networkidle2' });
    await shot(page, 'tv.png', 3000);
    console.log('  📺 Modo TV capturado!');
  } else {
    // Tenta descobrir token via screen_tokens ou URL de botão
    await page.goto(dashUrl, { waitUntil: 'networkidle2' });
    const tvBtn = await page.$('a[href*="tv"], button[data-tv], [href*="/tv"]');
    if (tvBtn) {
      await tvBtn.click();
      await wait(2000);
      await shot(page, 'tv.png', 2000);
    } else {
      await page.evaluate(() => window.scrollTo(0, 0));
      await shot(page, 'tv.png', 1000);
      console.log('  ⚠️  Modo TV não encontrado, usando dashboard como fallback');
    }
  }

  // ── Landing page ───────────────────────────────────────
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await shot(page, 'landing.png', 2000);

  console.log(`\n✅ Capturas concluídas!\n   Salvas em: ${OUT_DIR}\n`);

  // Salva o slug descoberto para uso futuro
  fs.writeFileSync(
    path.join(__dirname, '..', '.env.screenshots'),
    `PODIO_SLUG=${slug}\n`
  );
  console.log(`💾 Slug salvo em .env.screenshots\n`);

  await wait(5000);
  await browser.close();
}

main().catch(err => {
  console.error('\n❌ Erro:', err.message);
  process.exit(1);
});
