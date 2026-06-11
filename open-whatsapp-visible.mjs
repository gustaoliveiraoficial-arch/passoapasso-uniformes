import { chromium } from 'playwright';
import path from 'path';

const USER_DATA_DIR = path.resolve('.playwright-mcp/whatsapp-session');

(async () => {
  console.log(`Launching visible WhatsApp Web browser from: ${USER_DATA_DIR}...`);
  
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false, // Visible to the user!
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
    viewport: null // Uses full screen size
  });

  const page = context.pages()[0] || await context.newPage();
  
  console.log('Navigating to WhatsApp Web...');
  await page.goto('https://web.whatsapp.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

  console.log('Browser is now open on your screen! You can use WhatsApp directly.');
  console.log('Keeping the browser session active. Close the browser window when you are done.');

  // Wait for the browser to be closed by the user
  await new Promise((resolve) => {
    context.on('close', () => {
      console.log('Browser window closed by the user.');
      resolve();
    });
  });
})();
