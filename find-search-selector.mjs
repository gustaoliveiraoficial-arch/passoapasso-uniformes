import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const USER_DATA_DIR = path.resolve('.playwright-mcp/whatsapp-session');

(async () => {
  console.log('Finding correct selectors on WhatsApp Web...');
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = context.pages()[0] || await context.newPage();
  
  try {
    await page.goto('https://web.whatsapp.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('Navigated. Waiting 20 seconds for page to fully load...');
    await page.waitForTimeout(20000);

    const elementsInfo = await page.evaluate(() => {
      const info = [];
      
      // Dump all contenteditable divs
      const editables = document.querySelectorAll('[contenteditable]');
      editables.forEach((el, idx) => {
        info.push({
          type: 'contenteditable',
          tagName: el.tagName,
          className: el.className,
          placeholder: el.getAttribute('placeholder'),
          ariaLabel: el.getAttribute('aria-label'),
          html: el.outerHTML.substring(0, 300)
        });
      });

      // Dump all elements containing "Pesquisar" in text or placeholder
      const allEls = document.querySelectorAll('*');
      allEls.forEach(el => {
        const text = el.textContent || '';
        const placeholder = el.getAttribute('placeholder') || '';
        const ariaLabel = el.getAttribute('aria-label') || '';
        const testid = el.getAttribute('data-testid') || '';
        
        if (
          (placeholder.includes('Pesquisar') || 
           ariaLabel.includes('pesquisa') || 
           testid.includes('search')) && 
          el.children.length === 0
        ) {
          info.push({
            type: 'search-candidate',
            tagName: el.tagName,
            className: el.className,
            placeholder,
            ariaLabel,
            testid,
            html: el.outerHTML.substring(0, 300)
          });
        }
      });

      return info;
    });

    console.log('Found Elements:', JSON.stringify(elementsInfo, null, 2));
    fs.writeFileSync('whatsapp-selectors.json', JSON.stringify(elementsInfo, null, 2));
    console.log('Saved to whatsapp-selectors.json');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await context.close();
  }
})();
