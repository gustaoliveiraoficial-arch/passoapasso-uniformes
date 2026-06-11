import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const USER_DATA_DIR = path.resolve('.playwright-mcp/whatsapp-session');

(async () => {
  console.log('Inspecting WhatsApp Web DOM structure...');
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true, // Headless is fine to inspect DOM
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = context.pages()[0] || await context.newPage();
  
  try {
    await page.goto('https://web.whatsapp.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('Waiting for chat list to load...');
    await page.waitForSelector('[data-testid="chat-list"]', { timeout: 45000 });
    console.log('Loaded!');

    const domInfo = await page.evaluate(() => {
      const results = {};
      
      // 1. Find all contenteditables
      const contentEditables = Array.from(document.querySelectorAll('[contenteditable]'));
      results.contentEditables = contentEditables.map(el => ({
        tag: el.tagName,
        classes: el.className,
        placeholder: el.getAttribute('placeholder'),
        dataTab: el.getAttribute('data-tab'),
        title: el.getAttribute('title'),
        ariaLabel: el.getAttribute('aria-label'),
        id: el.id
      }));

      // 2. Find all input fields
      const inputs = Array.from(document.querySelectorAll('input'));
      results.inputs = inputs.map(el => ({
        type: el.type,
        classes: el.className,
        placeholder: el.getAttribute('placeholder'),
        ariaLabel: el.getAttribute('aria-label'),
        id: el.id
      }));

      // 3. Find any element containing search/pesquisar text
      const searchElements = Array.from(document.querySelectorAll('*'));
      results.searchKeywords = searchElements
        .filter(el => {
          const text = el.textContent || '';
          const testid = el.getAttribute('data-testid') || '';
          return (testid.includes('search') || testid.includes('filter') || text.toLowerCase() === 'pesquisar ou começar uma nova conversa') && el.children.length < 5;
        })
        .map(el => ({
          tag: el.tagName,
          classes: el.className,
          text: el.textContent ? el.textContent.substring(0, 50) : '',
          dataTestid: el.getAttribute('data-testid')
        }));

      return results;
    });

    console.log('DOM Info:', JSON.stringify(domInfo, null, 2));
    fs.writeFileSync('whatsapp-dom-info.json', JSON.stringify(domInfo, null, 2));
    console.log('Saved to whatsapp-dom-info.json');

  } catch (err) {
    console.error('Error inspecting DOM:', err.message);
  } finally {
    await context.close();
  }
})();
