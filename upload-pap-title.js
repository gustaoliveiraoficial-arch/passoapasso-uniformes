const { Client } = require('C:/Users/gusta/AppData/Roaming/npm/node_modules/n8n/node_modules/ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.sftp((err, sftp) => {
    if (err) { console.error(err); conn.end(); return; }
    sftp.fastPut(
      'C:/Users/gusta/OneDrive/Área de Trabalho/PassoaPasso/pap-title.php',
      'domains/passoapassouniformes.com/public_html/pap-title.php',
      {}, (err) => {
        if (err) console.error(err.message);
        else console.log('✓ enviado');
        conn.end();
      }
    );
  });
}).connect({ host: '82.25.67.70', port: 65002, username: 'u723199063', password: 'Passo26*' });
