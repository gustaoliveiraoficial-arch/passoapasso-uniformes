const { Client } = require('C:/Users/gusta/AppData/Roaming/npm/node_modules/n8n/node_modules/ssh2');
const { readdirSync, statSync } = require('fs');
const { join } = require('path');

const LOCAL_DIR = 'C:/Users/gusta/OneDrive/\u00c1rea de Trabalho/PassoaPasso/site-ecommerce';
const REMOTE_DIR = 'domains/passoapassouniformes.com/public_html';
const SKIP = ['DESIGN.md', 'code.html'];

const conn = new Client();

conn.on('ready', () => {
  console.log('Conectado!');
  conn.sftp((err, sftp) => {
    if (err) { console.error(err); conn.end(); return; }

    const files = readdirSync(LOCAL_DIR).filter(f => !SKIP.includes(f));
    console.log('Enviando ' + files.length + ' arquivos...');

    let i = 0;
    function next() {
      if (i >= files.length) {
        console.log('\n=== DONE ===');
        conn.end();
        return;
      }
      const file = files[i++];
      const localPath = join(LOCAL_DIR, file);
      const remotePath = REMOTE_DIR + '/' + file;
      sftp.fastPut(localPath, remotePath, {}, (err) => {
        if (err) console.error('x ' + file + ': ' + err.message);
        else console.log('v ' + file);
        next();
      });
    }
    next();
  });
}).connect({
  host: '82.25.67.70',
  port: 65002,
  username: 'u723199063',
  password: 'Passo26*'
});
