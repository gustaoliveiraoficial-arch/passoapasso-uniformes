import { chromium } from 'playwright';
import path from 'path';

const USER_DATA_DIR = path.resolve('.playwright-mcp/whatsapp-session');

(async () => {
  console.log('Taking a diagnostic screenshot with custom User Agent...');
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = context.pages()[0] || await context.newPage();
  
  try {
    await page.goto('https://web.whatsapp.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('Navigated. Waiting 15 seconds for WhatsApp Web to load...');
    await page.waitForTimeout(15000);
    await page.screenshot({ path: 'whatsapp-diagnostic.png' });
    console.log('Screenshot saved as whatsapp-diagnostic.png');
  } catch (err) {
    console.error('Error during screenshot:', err.message);
  } finally {
    await context.close();
  }
})();
