const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCRIPT_CODE = fs.readFileSync(
  path.join(__dirname, 'painel-vendas-comercial', 'google-apps-script.gs'),
  'utf8'
);
const SPREADSHEET_ID = '1-SLpaeXztHabC58_6a9nZESUKHldTCb0ZwfTf-3odVc';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Sessão logada que está guardada aqui
const SESSION_DIR = 'C:\\Users\\gusta\\AppData\\Local\\chrome-shark-isolated\\Default';

// Novo diretório único para esta execução
const RUN_DIR = path.join(os.tmpdir(), 'chrome-run-' + Date.now());
const RUN_PROFILE = path.join(RUN_DIR, 'Default');

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  let entries;
  try { entries = fs.readdirSync(src, { withFileTypes: true }); }
  catch(e) { return; }
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    try {
      if (entry.isDirectory()) copyDirSync(s, d);
      else fs.copyFileSync(s, d);
    } catch(e) {}
  }
}

(async () => {
  console.log('Copiando sessão logada para diretório novo...');
  fs.mkdirSync(RUN_DIR, { recursive: true });
  copyDirSync(SESSION_DIR, RUN_PROFILE);
  console.log('Sessão copiada para:', RUN_DIR);

  console.log('Iniciando Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    userDataDir: RUN_DIR,
    args: [
      '--profile-directory=Default',
      '--no-first-run',
      '--no-default-browser-check',
      '--start-maximized',
      '--disable-blink-features=AutomationControlled',
      '--disable-infobars',
    ],
    headless: false,
    defaultViewport: null,
    ignoreDefaultArgs: ['--enable-automation'],
  });

  const pages = await browser.pages();
  const page = pages[0] || await browser.newPage();
  page.setDefaultTimeout(60000);

  // ── STEP 1: Abre planilha ──
  console.log('\n[1/8] Abrindo planilha...');
  await page.goto(
    `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`,
    { waitUntil: 'networkidle2', timeout: 40000 }
  );
  await sleep(5000);
  await page.screenshot({ path: 'step1.png' });

  const title = await page.title();
  const isReadOnly = await page.evaluate(() =>
    document.body.innerText.includes('Somente ver') || document.body.innerText.includes('View only')
  );
  console.log('Título:', title);
  console.log('Somente ver:', isReadOnly);

  if (isReadOnly) {
    console.log('❌ Ainda sem permissão de edição. Verifique o login. Veja step1.png');
    await sleep(10000);
    await browser.close();
    try { fs.rmSync(RUN_DIR, { recursive: true }); } catch(e) {}
    return;
  }

  // ── STEP 2: Extensions > Apps Script ──
  console.log('\n[2/8] Abrindo Extensões → Apps Script...');
  await page.waitForSelector('[role="menubar"]', { timeout: 10000 }).catch(() => {});

  await page.evaluate(() => {
    const bar = document.querySelector('[role="menubar"]');
    if (!bar) return;
    for (const item of bar.querySelectorAll('[role="menuitem"]')) {
      if ((item.textContent || '').includes('Exten')) { item.click(); return; }
    }
  });
  await sleep(2000);

  await page.evaluate(() => {
    for (const item of document.querySelectorAll('[role="menuitem"]')) {
      if ((item.textContent || '').includes('Apps Script')) { item.click(); return; }
    }
  });

  await sleep(6000);

  let allPages = await browser.pages();
  console.log('Abas abertas:', allPages.length, allPages.map(p => p.url()));

  let scriptPage = allPages.find(p => p.url().includes('script.google.com') && p !== page);
  if (!scriptPage && allPages.length > 1) scriptPage = allPages[allPages.length - 1];

  if (!scriptPage) {
    console.log('Apps Script não abriu em nova aba. Tentando URL direta...');
    scriptPage = await browser.newPage();
    await scriptPage.goto('https://script.google.com/home', { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(4000);
    await scriptPage.screenshot({ path: 'step2-scripthome.png' });

    const firstProject = await scriptPage.$('a[href*="/d/"]');
    if (firstProject) {
      await firstProject.click();
      await sleep(5000);
    }
  }

  await scriptPage.bringToFront();
  await sleep(5000);
  await scriptPage.screenshot({ path: 'step3.png' });
  const editorUrl = scriptPage.url();
  console.log('URL editor:', editorUrl);

  if (!editorUrl.includes('script.google.com')) {
    console.log('❌ Não é o editor. Veja step3.png');
    await sleep(10000);
    await browser.close();
    try { fs.rmSync(RUN_DIR, { recursive: true }); } catch(e) {}
    return;
  }

  // ── STEP 3: Substitui código ──
  console.log('\n[3/8] Inserindo código...');
  await scriptPage.mouse.click(700, 400);
  await sleep(500);
  await scriptPage.keyboard.down('Control');
  await scriptPage.keyboard.press('a');
  await scriptPage.keyboard.up('Control');
  await sleep(300);
  await scriptPage.keyboard.press('Delete');
  await sleep(300);
  await scriptPage.keyboard.type(SCRIPT_CODE, { delay: 1 });
  await sleep(2000);

  // ── STEP 4: Salva ──
  console.log('[4/8] Salvando...');
  await scriptPage.keyboard.down('Control');
  await scriptPage.keyboard.press('s');
  await scriptPage.keyboard.up('Control');
  await sleep(3000);
  await scriptPage.screenshot({ path: 'step4.png' });

  // ── STEP 5: Menu Implantar ──
  console.log('\n[5/8] Clicando Implantar...');
  await scriptPage.evaluate(() => {
    const btns = [...document.querySelectorAll('button, [role="button"]')];
    const btn = btns.find(b => {
      const t = b.textContent || b.getAttribute('aria-label') || '';
      return t.includes('mplantar') || t.toLowerCase().includes('deploy');
    });
    if (btn) btn.click();
  });
  await sleep(3000);
  await scriptPage.screenshot({ path: 'step5.png' });

  // ── STEP 6: Nova implantação ──
  console.log('[6/8] Nova implantação...');
  await scriptPage.evaluate(() => {
    const items = [...document.querySelectorAll('[role="menuitem"], li, button')];
    const item = items.find(i => {
      const t = i.textContent || '';
      return t.includes('Nova') || t.includes('New deploy');
    });
    if (item) item.click();
  });
  await sleep(5000);
  await scriptPage.screenshot({ path: 'step6.png' });

  // ── STEP 7: Configura Web App ──
  console.log('[7/8] Configurando...');
  await scriptPage.evaluate(() => {
    const opts = [...document.querySelectorAll('[role="option"], option')];
    const opt = opts.find(o => {
      const t = o.textContent || '';
      return t.includes('plicativo da Web') || t.includes('Web app');
    });
    if (opt) opt.click();
  });
  await sleep(1000);

  await scriptPage.evaluate(() => {
    const selects = document.querySelectorAll('select');
    for (const sel of selects) {
      for (const opt of sel.options) {
        if ((opt.text || '').includes('Qualquer') || (opt.text || '').includes('Anyone')) {
          sel.value = opt.value;
          sel.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
    }
  });
  await sleep(1000);
  await scriptPage.screenshot({ path: 'step7.png' });

  // Clica Implantar na dialog
  await scriptPage.evaluate(() => {
    const btns = [...document.querySelectorAll('button')];
    const btn = btns.find(b => {
      const t = b.textContent || '';
      return (t.includes('mplantar') || t.includes('eploy')) && !b.disabled;
    });
    if (btn) btn.click();
  });
  await sleep(10000);
  await scriptPage.screenshot({ path: 'step8.png' });

  // ── STEP 8: Captura URL ──
  console.log('\n[8/8] Capturando URL...');
  const webAppUrl = await scriptPage.evaluate(() => {
    const m = document.body.innerText.match(
      /https:\/\/script\.google\.com\/macros\/s\/[^\s\n"'<>]+\/exec/
    );
    if (m) return m[0];
    for (const inp of document.querySelectorAll('input')) {
      if (inp.value && inp.value.includes('macros/s/')) return inp.value;
    }
    return null;
  });

  console.log('\n=============================================');
  if (webAppUrl) {
    console.log('✅ URL DO WEB APP:');
    console.log(webAppUrl);
    fs.writeFileSync(path.join(__dirname, 'webapp-url.txt'), webAppUrl + '\n');
    console.log('Salvo em webapp-url.txt');
  } else {
    console.log('⚠️  URL não capturada. Veja step8.png');
  }
  console.log('=============================================\n');

  await sleep(15000);
  await browser.close();
  try { fs.rmSync(RUN_DIR, { recursive: true }); } catch(e) {}
  console.log('Concluído!');
})().catch(e => {
  console.error('\n❌ ERRO:', e.message);
  process.exit(1);
});
