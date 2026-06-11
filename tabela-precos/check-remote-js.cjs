const { Client } = require('ssh2');
const fs = require('fs');

const conn = new Client();

conn.on('ready', () => {
  console.log('Conectado via SFTP!');
  conn.sftp((err, sftp) => {
    if (err) {
      console.error(err);
      conn.end();
      return;
    }

    const assetsDir = 'domains/passoapassouniformes.com/public_html/tabeladeprecos/assets';
    
    console.log(`Lendo diretório de assets remoto: ${assetsDir}`);
    sftp.readdir(assetsDir, (err, list) => {
      if (err) {
        console.error('Erro ao ler assets:', err);
        conn.end();
        return;
      }

      const jsFiles = list.filter(item => item.filename.endsWith('.js'));
      if (jsFiles.length === 0) {
        console.log('Nenhum arquivo JS encontrado nos assets remotos!');
        conn.end();
        return;
      }

      console.log(`Arquivos JS remotos encontrados: ${jsFiles.map(f => f.filename).join(', ')}`);

      let completed = 0;
      jsFiles.forEach(fileObj => {
        const remotePath = `${assetsDir}/${fileObj.filename}`;
        const localPath = `./temp-${fileObj.filename}`;
        
        console.log(`Baixando ${fileObj.filename}...`);
        sftp.fastGet(remotePath, localPath, {}, (err) => {
          if (err) {
            console.error(`Erro ao baixar ${fileObj.filename}:`, err);
            completed++;
            if (completed === jsFiles.length) conn.end();
            return;
          }

          const content = fs.readFileSync(localPath, 'utf8');
          console.log(`Analisando ${fileObj.filename}:`);
          
          // Check for Firebase key or config
          const hasApiKey = content.includes('AIzaSy');
          console.log(`  - Contém chave do Firebase ("AIzaSy...")? ${hasApiKey ? 'SIM' : 'NÃO'}`);
          
          if (hasApiKey) {
            const idx = content.indexOf('AIzaSy');
            console.log(`  - Trecho próximo à chave: ...${content.substring(Math.max(0, idx - 20), Math.min(content.length, idx + 100))}...`);
          } else {
            console.log('  - Buscando por "apiKey" ou "authDomain"...');
            const idxApiKey = content.indexOf('apiKey');
            if (idxApiKey !== -1) {
              console.log(`  - Trecho próximo a "apiKey": ...${content.substring(idxApiKey - 30, idxApiKey + 150)}...`);
            }
          }

          // Clean up temp file
          fs.unlinkSync(localPath);
          
          completed++;
          if (completed === jsFiles.length) {
            console.log('\n=== Análise de Assets Concluída ===');
            conn.end();
          }
        });
      });
    });
  });
}).connect({
  host: '82.25.67.70',
  port: 65002,
  username: 'u723199063',
  password: 'Passo26*'
});
