const { Client } = require('C:/Users/gusta/AppData/Roaming/npm/node_modules/n8n/node_modules/ssh2');

const conn = new Client();

conn.on('ready', () => {
  console.log('Conectado!');
  conn.sftp((err, sftp) => {
    if (err) { console.error(err); conn.end(); return; }

    const localPath = 'C:/Users/gusta/OneDrive/Área de Trabalho/PassoaPasso/pap-update.php';
    const remotePath = 'domains/passoapassouniformes.com/public_html/pap-update.php';

    sftp.fastPut(localPath, remotePath, {}, (err) => {
      if (err) {
        console.error('ERRO ao enviar:', err.message);
      } else {
        console.log('✓ pap-update.php enviado com sucesso!');
        console.log('Execute: https://passoapassouniformes.com/pap-update.php?run=pap2025');
      }
      conn.end();
    });
  });
}).connect({
  host: '82.25.67.70',
  port: 65002,
  username: 'u723199063',
  password: 'Passo26*'
});
