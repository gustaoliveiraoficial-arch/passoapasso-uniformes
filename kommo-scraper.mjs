import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'https://passoapassouniformes2025.kommo.com';
const OUT_DIR = 'C:\\Users\\gusta\\OneDrive\\Área de Trabalho\\PassoaPasso\\kommo-data';

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function shot(page, name) {
  const file = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`✅ ${name}.png`);
}

async function nav(page, url, label, wait = 5000) {
  console.log(`\n➡️  ${label}...`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(wait);
}

(async () => {
  console.log('🔌 Conectando ao Chrome...');
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  const page = pages[0] || await context.newPage();
  await page.setViewportSize({ width: 1400, height: 900 });

  // 1. Funil de vendas — capturar com scroll horizontal
  console.log('\n🔁 Funil de vendas completo...');
  await nav(page, `${BASE_URL}/leads/pipeline`, 'Funil kanban', 5000);
  await shot(page, '1-funil-inicio');

  // Scroll para ver mais colunas
  for (let i = 1; i <= 5; i++) {
    await page.keyboard.press('ArrowRight');
    await page.evaluate(() => {
      const el = document.querySelector('.pipeline-board') || document.querySelector('[class*="pipeline"]') || document.querySelector('[class*="board"]');
      if (el) el.scrollLeft += 1200;
      else window.scrollBy(1200, 0);
    });
    await sleep(1500);
    await shot(page, `1-funil-scroll-${i}`);
  }

  // 2. Lista de todos os leads
  await nav(page, `${BASE_URL}/leads/list`, 'Lista de leads', 4000);
  await shot(page, '2-leads-lista');

  // 3. Insights (analytics do Kommo)
  await nav(page, `${BASE_URL}/insights`, 'Insights/Analytics', 5000);
  await shot(page, '3-insights');

  // Scroll para ver mais dados do Insights
  await page.evaluate(() => window.scrollBy(0, 500));
  await sleep(1500);
  await shot(page, '3-insights-baixo');

  // 4. Comunicações (mensagens)
  await nav(page, `${BASE_URL}/chats`, 'Comunicações/Chats', 4000);
  await shot(page, '4-comunicacoes');

  // 5. Dashboard (início)
  await nav(page, `${BASE_URL}/`, 'Dashboard início', 5000);
  await shot(page, '5-dashboard');

  // Scroll no dashboard
  await page.evaluate(() => window.scrollBy(0, 600));
  await sleep(1500);
  await shot(page, '5-dashboard-baixo');

  // 6. Contatos
  await nav(page, `${BASE_URL}/contacts/list`, 'Contatos', 4000);
  await shot(page, '6-contatos');

  // 7. Calendário / Tarefas
  await nav(page, `${BASE_URL}/calendar`, 'Calendário', 4000);
  await shot(page, '7-calendario');

  // 8. Relatórios (tentar caminhos diferentes)
  await nav(page, `${BASE_URL}/reports`, 'Relatórios', 4000);
  await shot(page, '8-relatorios');

  // 9. Analytics path alternativo
  await nav(page, `${BASE_URL}/analytics`, 'Analytics alt', 4000);
  await shot(page, '9-analytics-alt');

  console.log('\n✅ Tudo salvo em:', OUT_DIR);
  await page.close();
  await browser.close();
})();
