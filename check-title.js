const { Client } = require('C:/Users/gusta/AppData/Roaming/npm/node_modules/n8n/node_modules/ssh2');
const conn = new Client();
conn.on('ready', () => {
  conn.exec(
    `cd ~/domains/passoapassouniformes.com/public_html && wp option get blogname --allow-root && wp option get blogdescription --allow-root && wp option get siteurl --allow-root`,
    (err, stream) => {
      if (err) { console.error(err); conn.end(); return; }
      stream.on('data', d => process.stdout.write(d.toString()));
      stream.stderr.on('data', d => process.stderr.write(d.toString()));
      stream.on('close', () => conn.end());
    }
  );
}).connect({ host: '82.25.67.70', port: 65002, username: 'u723199063', password: 'Passo26*' });
