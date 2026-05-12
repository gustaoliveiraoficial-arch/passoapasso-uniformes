import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'https://passoapassouniformes2025.kommo.com';
const OUT_DIR = 'C:\\Users\\gusta\\OneDrive\\Área de Trabalho\\PassoaPasso\\kommo-data';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT_DIR, `${name}.png`), fullPage: false });
  console.log(`✅ ${name}.png`);
}

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  const page = pages[0] || await context.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  // === FUNIL COM SCROLL CORRETO ===
  console.log('\n🔁 Funil de vendas...');
  await page.goto(`${BASE_URL}/leads/pipeline`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(5000);

  // Encontrar o container do board e fazer scroll nele
  await page.evaluate(() => {
    const board = document.querySelector('.pipeline-leads__stages')
      || document.querySelector('[class*="stages"]')
      || document.querySelector('[class*="pipeline-board"]')
      || document.querySelector('[class*="kanban"]');
    if (board) {
      console.log('Board encontrado:', board.className);
      board.scrollLeft = 0;
    }
  });
  await sleep(1000);
  await shot(page, 'funil-col-1');

  // Scroll 1500px para direita
  await page.evaluate(() => {
    const board = document.querySelector('.pipeline-leads__stages')
      || document.querySelector('[class*="stages"]')
      || document.querySelector('[class*="pipeline-board"]')
      || document.querySelector('[class*="kanban"]')
      || document.body;
    board.scrollLeft += 1500;
  });
  await sleep(2000);
  await shot(page, 'funil-col-2');

  await page.evaluate(() => {
    const board = document.querySelector('.pipeline-leads__stages')
      || document.querySelector('[class*="stages"]')
      || document.querySelector('[class*="pipeline-board"]')
      || document.querySelector('[class*="kanban"]')
      || document.body;
    board.scrollLeft += 1500;
  });
  await sleep(2000);
  await shot(page, 'funil-col-3');

  await page.evaluate(() => {
    const board = document.querySelector('.pipeline-leads__stages')
      || document.querySelector('[class*="stages"]')
      || document.querySelector('[class*="pipeline-board"]')
      || document.querySelector('[class*="kanban"]')
      || document.body;
    board.scrollLeft += 1500;
  });
  await sleep(2000);
  await shot(page, 'funil-col-4');

  // === INSIGHTS - clicar no menu ===
  console.log('\n📊 Insights...');
  await page.goto(`${BASE_URL}/leads/pipeline`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3000);

  // Clicar em "Insights" no sidebar
  const insightsMenu = await page.$('text=Insights');
  if (insightsMenu) {
    await insightsMenu.click();
    await sleep(2000);
    await shot(page, 'insights-menu-aberto');

    // Tentar clicar em sub-itens
    const subItems = await page.$$('[class*="sidebar"] a, [class*="nav"] a');
    for (const item of subItems) {
      const text = await item.textContent();
      if (text && (text.includes('Insight') || text.includes('Relatório') || text.includes('Resumo') || text.includes('Análise'))) {
        await item.click();
        await sleep(3000);
        await shot(page, `insights-${text.trim().slice(0,20).replace(/\s/g, '-')}`);
      }
    }
  }

  // Tentar URLs de insights conhecidas do Kommo
  const insightUrls = [
    ['insights/summary', 'insights-summary'],
    ['insights/pipeline', 'insights-pipeline'],
    ['insights/team', 'insights-team'],
    ['insights/leads', 'insights-leads'],
    ['insights/loss', 'insights-loss'],
    ['insights/calls', 'insights-calls'],
  ];

  for (const [urlPath, name] of insightUrls) {
    await page.goto(`${BASE_URL}/${urlPath}`, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
    await sleep(3000);
    const url = page.url();
    if (!url.includes('404') && !url.includes('login')) {
      await shot(page, name);
    }
  }

  // === LISTA DE LEADS — pegar o total ===
  console.log('\n📋 Lista de leads...');
  await page.goto(`${BASE_URL}/leads/list`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(4000);
  await shot(page, 'leads-lista-total');

  // Verificar o título/header com total
  const totalText = await page.evaluate(() => {
    const els = [...document.querySelectorAll('*')].filter(el =>
      el.children.length === 0 && el.textContent.match(/\d+\s*lead/i)
    );
    return els.map(e => e.textContent.trim()).slice(0, 10);
  });
  console.log('Totais encontrados:', totalText);

  // === COMUNICAÇÕES — ver total ===
  console.log('\n💬 Comunicações...');
  await page.goto(`${BASE_URL}/chats`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(4000);
  await shot(page, 'comunicacoes-total');

  // Scroll na lista de chats
  await page.evaluate(() => window.scrollBy(0, 800));
  await sleep(1500);
  await shot(page, 'comunicacoes-scroll');

  console.log('\n✅ Capturas concluídas!');
  await page.close();
  await browser.close();
})();
