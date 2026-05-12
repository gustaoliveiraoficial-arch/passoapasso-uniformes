import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const Client = (await import('C:/Users/gusta/AppData/Roaming/npm/node_modules/n8n/node_modules/ssh2/lib/index.js')).Client;

const LOCAL_DIR = 'C:/Users/gusta/OneDrive/Área de Trabalho/PassoaPasso/site-ecommerce';
const REMOTE_DIR = 'domains/passoapassouniformes.com/public_html';

// Files to upload (skip preview images and DESIGN.md - they're internal)
const SKIP = ['DESIGN.md', 'code.html'];

const conn = new Client();

conn.on('ready', () => {
  console.log('Conectado via SSH');
  conn.sftp(async (err, sftp) => {
    if (err) { console.error(err); conn.end(); return; }

    const files = readdirSync(LOCAL_DIR).filter(f => !SKIP.includes(f));
    console.log(`Enviando ${files.length} arquivos...`);

    for (const file of files) {
      const localPath = join(LOCAL_DIR, file);
      const remotePath = `${REMOTE_DIR}/${file}`;
      await new Promise((resolve, reject) => {
        sftp.fastPut(localPath, remotePath, {}, (err) => {
          if (err) { console.error(`✗ ${file}:`, err.message); resolve(); }
          else { console.log(`✓ ${file}`); resolve(); }
        });
      });
    }

    console.log('\n=== DONE ===');
    conn.end();
  });
}).connect({
  host: '82.25.67.70',
  port: 65002,
  username: 'u723199063',
  password: 'Passo26*'
});
