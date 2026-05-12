const { Client } = require('C:/Users/gusta/AppData/Roaming/npm/node_modules/n8n/node_modules/ssh2');
const conn = new Client();

conn.on('ready', () => {
  // Tenta WP-CLI primeiro, senão usa MySQL
  const cmd = `
    cd ~/domains/passoapassouniformes.com/public_html &&
    if command -v wp &>/dev/null; then
      wp option update blogname 'Passo a Passo Uniformes' --allow-root &&
      wp option update blogdescription 'Uniformes Escolares Premium desde 1998' --allow-root &&
      echo "WP-CLI OK"
    else
      echo "WP-CLI not found"
    fi
  `;

  conn.exec(cmd, (err, stream) => {
    if (err) { console.error(err); conn.end(); return; }
    stream.on('data', d => process.stdout.write(d.toString()));
    stream.stderr.on('data', d => process.stderr.write(d.toString()));
    stream.on('close', () => conn.end());
  });
}).connect({ host: '82.25.67.70', port: 65002, username: 'u723199063', password: 'Passo26*' });
