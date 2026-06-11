import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const USER_DATA_DIR = path.resolve('.playwright-mcp/whatsapp-session');
const SCREENSHOT_PATH = path.resolve('whatsapp-state.png');

(async () => {
  console.log(`Starting Chromium with persistent context in: ${USER_DATA_DIR}...`);
  
  if (!fs.existsSync('.playwright-mcp')) {
    fs.mkdirSync('.playwright-mcp', { recursive: true });
  }

  // Launch Chromium with the persistent session
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false, // Must be visible so the user can scan the QR code if needed
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = context.pages()[0] || await context.newPage();
  
  console.log('Navigating to WhatsApp Web...');
  await page.goto('https://web.whatsapp.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

  console.log('Waiting for WhatsApp Web to load...');
  await page.waitForTimeout(5000);

  // Check if we are logged in or need to scan QR
  const isLoggedIn = await Promise.race([
    page.waitForSelector('canvas', { timeout: 15000 }).then(() => false), // QR code canvas
    page.waitForSelector('[data-testid="chat-list"]', { timeout: 15000 }).then(() => true), // Chat list (logged in)
    page.waitForSelector('#pane-side', { timeout: 15000 }).then(() => true) // Alternative chat list selector
  ]).catch(() => null);

  if (isLoggedIn === true) {
    console.log('🎉 WhatsApp is LOGGED IN!');
    await page.waitForTimeout(5000); // Wait a bit to let messages load
    await page.screenshot({ path: SCREENSHOT_PATH });
    console.log(`Screenshot saved to: ${SCREENSHOT_PATH}`);
  } else if (isLoggedIn === false) {
    console.log('📱 WhatsApp requires login. QR code is displayed on your screen!');
    console.log('Please scan the QR code with your phone.');
    
    // Take a screenshot of the QR code area so the user can see it if the browser is hidden
    await page.screenshot({ path: SCREENSHOT_PATH });
    console.log(`Screenshot of QR code page saved to: ${SCREENSHOT_PATH}`);
    
    console.log('Waiting up to 2 minutes for you to scan the QR code...');
    try {
      await page.waitForSelector('[data-testid="chat-list"]', { timeout: 120000 });
      console.log('🎉 Login SUCCESSFUL! WhatsApp is now connected.');
      await page.waitForTimeout(5000);
      await page.screenshot({ path: SCREENSHOT_PATH });
      console.log(`Updated screenshot saved to: ${SCREENSHOT_PATH}`);
    } catch (err) {
      console.log('⏰ Timeout waiting for QR scan. Closing browser.');
    }
  } else {
    console.log('❓ Could not determine WhatsApp state. Taking screenshot anyway.');
    await page.screenshot({ path: SCREENSHOT_PATH });
    console.log(`Screenshot saved to: ${SCREENSHOT_PATH}`);
  }

  // Keep browser open for a few seconds to finish any state saving, then close
  await page.waitForTimeout(5000);
  await context.close();
  console.log('Browser closed successfully.');
})();
