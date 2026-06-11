import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const USER_DATA_DIR = path.resolve('.playwright-mcp/whatsapp-session');
const MEDIA_DIR = path.resolve('.playwright-mcp/whatsapp-media');
const OUTPUT_FILE = path.resolve('treinamento-comercial-raw.json');
const TARGET_GROUP = 'TREINAMENTO COMERCIAL PASSO A PASSO';

(async () => {
  console.log(`Starting WhatsApp extractor for group: "${TARGET_GROUP}"...`);
  
  if (!fs.existsSync(MEDIA_DIR)) {
    fs.mkdirSync(MEDIA_DIR, { recursive: true });
  }

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = context.pages()[0] || await context.newPage();
  
  try {
    console.log('Navigating to WhatsApp Web...');
    await page.goto('https://web.whatsapp.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

    console.log('Waiting 20 seconds for page to fully load...');
    await page.waitForTimeout(20000);

    // 1. Search for the group using the correct input selector
    console.log(`Searching for group: "${TARGET_GROUP}"...`);
    const searchInput = await page.waitForSelector('input[placeholder="Pesquisar ou começar uma nova conversa"]', { timeout: 15000 });
    await searchInput.click();
    await searchInput.fill(TARGET_GROUP);
    await page.waitForTimeout(5000); // Wait for search results to filter

    // 2. Click the group in the search list
    console.log('Locating group in results...');
    const groupElement = await page.waitForSelector(`span[title="${TARGET_GROUP}"]`, { timeout: 15000 });
    await groupElement.click();
    console.log(`🎉 Opened group chat: "${TARGET_GROUP}"!`);
    await page.waitForTimeout(5000);

    // 3. Scroll up to fetch historical messages
    console.log('Scrolling up to load older messages (this may take a minute)...');
    const messagePaneSelector = 'div[data-testid="conversation-panel-messages"]';
    
    // Fallback if data-testid isn't there, let's find the main message container
    const paneFound = await page.evaluate((selector) => {
      return !!document.querySelector(selector) || !!document.querySelector('.x1y1aw1k'); 
    }, messagePaneSelector);

    let activeSelector = messagePaneSelector;
    if (!paneFound) {
      console.log('Custom message panel class fallback...');
      activeSelector = 'div[role="region"]'; // standard WhatsApp Web chat window role
    }

    // Scroll up to get a solid history of chats, classes, and uniform details
    for (let i = 0; i < 40; i++) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel) || document.querySelector('div[role="application"] div[class*="message"]')?.parentElement;
        if (el) {
          el.scrollTop = 0; // Scroll to top to trigger loading older messages
        }
      }, activeSelector);
      console.log(`Scroll ${i + 1}/40 completed`);
      await page.waitForTimeout(2000); // Wait for messages to load
    }

    // Take a screenshot of the group conversation state
    await page.screenshot({ path: 'whatsapp-group-state.png' });
    console.log('Saved WhatsApp group screenshot to: whatsapp-group-state.png');

    // 4. Extract messages and images
    console.log('Extracting messages...');
    const extractedData = await page.evaluate(async () => {
      const messageNodes = document.querySelectorAll('div[data-testid^="msg-"], div[class*="message-"]');
      const messages = [];
      
      for (const node of messageNodes) {
        try {
          // Extract text content
          const textNode = node.querySelector('span[class*="selectable-text"]');
          const text = textNode ? textNode.textContent : '';
          
          // Extract sender & time
          const copyableContainer = node.querySelector('.copyable-text');
          let sender = 'System/Unknown';
          let timestamp = '';
          
          if (copyableContainer) {
            const preData = copyableContainer.getAttribute('data-pre-plain-text');
            if (preData) {
              const match = preData.match(/\[(.*?)\]\s+(.*?):/);
              if (match) {
                timestamp = match[1];
                sender = match[2];
              }
            }
          }
          
          if (!timestamp) {
            const timeNode = node.querySelector('span[class*="time"]');
            if (timeNode) timestamp = timeNode.textContent;
          }

          // Check if message contains an image
          const imgNode = node.querySelector('img[src^="blob:"]');
          let imageBase64 = '';
          
          if (imgNode) {
            try {
              const response = await fetch(imgNode.src);
              const blob = await response.blob();
              imageBase64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              });
            } catch (imgErr) {
              // Ignore image errors
            }
          }
          
          if (text || imageBase64) {
            messages.push({
              sender,
              timestamp,
              text,
              hasImage: !!imageBase64,
              imageBase64
            });
          }
        } catch (e) {
          // Skip
        }
      }
      return messages;
    });

    console.log(`Extracted ${extractedData.length} messages.`);

    // 5. Save images to local files and clean JSON records
    const finalMessages = [];
    let imageCounter = 0;
    
    for (const msg of extractedData) {
      if (msg.hasImage && msg.imageBase64) {
        imageCounter++;
        const filename = `image_${Date.now()}_${imageCounter}.png`;
        const filepath = path.join(MEDIA_DIR, filename);
        const base64Data = msg.imageBase64.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(filepath, base64Data, 'base64');
        
        finalMessages.push({
          sender: msg.sender,
          timestamp: msg.timestamp,
          text: msg.text,
          imagePath: filepath
        });
      } else {
        finalMessages.push({
          sender: msg.sender,
          timestamp: msg.timestamp,
          text: msg.text
        });
      }
    }

    console.log(`Saved ${imageCounter} images to ${MEDIA_DIR}`);

    // Save final raw data
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalMessages, null, 2));
    console.log(`🎉 Raw data successfully saved to: ${OUTPUT_FILE}`);

  } catch (err) {
    console.error('❌ Error during extraction:', err.message);
  } finally {
    await context.close();
    console.log('Browser closed.');
  }
})();
