import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const USER_DATA_DIR = path.resolve('.playwright-mcp/whatsapp-session');
const SCREENSHOT_PATH = path.resolve('whatsapp-state.png');

(async () => {
  console.log(`Launching persistent Chromium context from: ${USER_DATA_DIR}...`);
  
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true, // We can run headless now that we are logged in!
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = context.pages()[0] || await context.newPage();
  
  console.log('Navigating to WhatsApp Web...');
  await page.goto('https://web.whatsapp.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

  console.log('Waiting for chat list to load...');
  try {
    await page.waitForSelector('[data-testid="chat-list"]', { timeout: 30000 });
    console.log('🎉 Chat list loaded successfully!');
    
    // Wait a few seconds for chats and messages to fully render
    await page.waitForTimeout(5000);
    
    // Take a screenshot of the active WhatsApp state
    await page.screenshot({ path: SCREENSHOT_PATH });
    console.log(`Updated screenshot saved to: ${SCREENSHOT_PATH}`);

    // Extract recent chats
    const chats = await page.evaluate(() => {
      const chatElements = document.querySelectorAll('[data-testid="chat-list"] [role="listitem"]');
      const results = [];
      
      chatElements.forEach((el, index) => {
        if (index >= 10) return; // Limit to top 10 chats
        
        try {
          // Extract chat name
          const nameEl = el.querySelector('[title]');
          const name = nameEl ? nameEl.getAttribute('title') : 'Unknown';
          
          // Extract last message text
          const msgEl = el.querySelector('span[dir="ltr"]');
          const lastMessage = msgEl ? msgEl.textContent : '';
          
          // Extract time
          const timeEl = el.querySelector('div[class*="_1077"]'); // fallback search
          const timeText = timeEl ? timeEl.textContent : '';
          
          // Check for unread badge
          const unreadEl = el.querySelector('span[aria-label*="unread"]');
          const unreadCount = unreadEl ? parseInt(unreadEl.textContent) || 1 : 0;
          
          results.push({ name, lastMessage, unreadCount });
        } catch (e) {
          // Ignore individual parsing errors
        }
      });
      
      return results;
    });

    console.log('\n💬 RECENT CHATS:');
    if (chats.length === 0) {
      console.log('No chats found or structure changed.');
    } else {
      chats.forEach((chat, idx) => {
        const badge = chat.unreadCount > 0 ? ` [🔴 ${chat.unreadCount} unread]` : '';
        console.log(`${idx + 1}. ${chat.name}${badge}`);
        if (chat.lastMessage) {
          console.log(`   Message: "${chat.lastMessage}"`);
        }
        console.log('---');
      });
    }

  } catch (err) {
    console.error('❌ Error loading chats:', err.message);
    await page.screenshot({ path: SCREENSHOT_PATH });
    console.log(`Failed state screenshot saved to: ${SCREENSHOT_PATH}`);
  }

  await context.close();
  console.log('Browser closed.');
})();
