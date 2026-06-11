/**
 * Lead Capture — Passo a Passo Uniformes
 * Fonte: Receita Federal — Dados Abertos CNPJ
 * Gratuito, sem limite de uso, atualizado mensalmente
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const iconv = require('iconv-lite');
const xlsx = require('xlsx');

// ─────────────────────────────────────────────────────────────
// CONFIGURAÇÃO — Cidades-alvo (40km ao redor de Novo Hamburgo)
// ─────────────────────────────────────────────────────────────

// Nomes como aparecem na base da Receita Federal (maiúsculas, sem acento)
const CIDADES_ALVO = new Set([
  'NOVO HAMBURGO',
  'SAO LEOPOLDO',
  'SAPIRANGA',
  'CAMPO BOM',
  'DOIS IRMAOS',
  'ESTANCIA VELHA',
  'CANOAS',
  'ESTEIO',
  'GRAVATAI',
  'CACHOEIRINHA',
  'NOVA HARTZ',
  'ARARICA',
  'PORTAO',
  'IVOTI',
  'PAROBE',
  'TAQUARA',
  'IGREJINHA',
  'MORRO REUTER',
  'PRESIDENTE LUCENA',
  'ROLANTE',
  'SERTAO SANTANA',
]);

// ─────────────────────────────────────────────────────────────
// FILTROS — Concorrentes excluídos automaticamente
// ─────────────────────────────────────────────────────────────

const KEYWORDS_CONCORRENTE = [
  'UNIFORME', 'FARDAMENTO', 'BORDADO', 'BORDADORA',
  'SERIGRAFIA', 'GRAFICA', 'GRAFICO', 'ESTAMPARIA',
  'SILK SCREEN', 'SILKSCREEN', 'SUBLIMACAO',
  'CONFECCAO', 'CONFECCOES', 'MALHARIA',
  'PERSONALIZADO', 'PERSONALIZADOS',
  'PASSO A PASSO',
];

// CNAEs que indicam concorrência direta (código sem pontuação)
const CNAES_CONCORRENTE = new Set([
  '1412601', '1412602', // Confecção roupa profissional
  '1411801', '1411802', // Confecção roupa íntima/vestuário
  '1413401', '1413402', '1413403', // Confecção moda
  '1422300', // Malharia
  '1421500', // Meias
  '1813100', // Impressão material publicitário
  '1811301', '1811302', // Impressão jornais
  '1821100', // Acabamento gráfico
  '1822900', // Encadernação / plastificação
  '4641902', // Comércio atacado tecidos
  '4642701', '4642702', // Comércio atacado vestuário
  '4781400', // Comércio varejista vestuário
  '4755503', // Comércio varejista tecidos
]);

// ─────────────────────────────────────────────────────────────
// CATEGORIAS — Mapeamento de CNAE → nome amigável
// ─────────────────────────────────────────────────────────────

function categorizarCNAE(cnae) {
  if (!cnae) return 'Empresa';
  const c = cnae.substring(0, 4);
  const map = {
    '8511': 'Educação Infantil', '8512': 'Ensino Fundamental', '8513': 'Ensino Médio',
    '8520': 'Educação Profissional', '8531': 'Educação Superior', '8532': 'Educação Superior',
    '8533': 'Educação Superior', '8541': 'Educação Física/Esporte', '8542': 'Educação Física/Esporte',
    '8550': 'Escola / Curso Livre', '8559': 'Escola / Curso Livre',
    '9311': 'Clube Esportivo', '9312': 'Clube Esportivo', '9313': 'Academia / Fitness',
    '9319': 'Esporte / Recreação', '9321': 'Parque / Diversão', '9329': 'Recreação',
    '5611': 'Restaurante / Bar', '5612': 'Restaurante / Bar', '5620': 'Alimentação / Catering',
    '5310': 'Alimentação Coletiva', '5311': 'Alimentação Coletiva',
    '8610': 'Hospital / Clínica', '8621': 'Hospital / Clínica', '8622': 'Hospital / Clínica',
    '8630': 'Hospital / Clínica', '8640': 'Hospital / Clínica', '8650': 'Clínica / Saúde',
    '8660': 'Clínica / Saúde', '8690': 'Saúde', '8711': 'Hospital', '8712': 'Hospital',
    '7500': 'Veterinária',
    '8411': 'Órgão Público', '8412': 'Órgão Público', '8413': 'Órgão Público',
    '8421': 'Órgão Público', '8422': 'Órgão Público', '8423': 'Órgão Público',
    '8424': 'Segurança Pública', '8425': 'Corpo de Bombeiros',
    '4711': 'Supermercado', '4712': 'Supermercado / Mercearia',
    '8011': 'Segurança Privada', '8012': 'Segurança Privada', '8020': 'Monitoramento',
    '4911': 'Transporte / Logística', '4912': 'Transporte', '4921': 'Transporte Rodoviário',
    '4922': 'Transporte Rodoviário', '4923': 'Frete / Carga', '4924': 'Frete / Carga',
    '4929': 'Transporte', '4930': 'Transporte de Carga', '4940': 'Transporte Dutoviário',
    '5211': 'Logística / Armazém', '5212': 'Carga / Logística', '5229': 'Logística',
    '4110': 'Construtora / Imóvel', '4120': 'Construtora', '4211': 'Construtora / Obra',
    '4212': 'Construtora / Obra', '4213': 'Construtora', '4221': 'Infraestrutura',
    '4222': 'Infraestrutura', '4291': 'Construtora', '4292': 'Construtora',
    '4299': 'Construtora / Engenharia',
    '6201': 'Empresa de TI', '6202': 'Empresa de TI', '6203': 'Empresa de TI',
    '6204': 'Empresa de TI', '6209': 'Empresa de TI', '6311': 'Dados / TI',
    '6312': 'Dados / TI', '6319': 'Internet / Tecnologia',
    '5510': 'Hotel / Pousada', '5590': 'Hospedagem',
    '8299': 'Serviços Empresariais', '8211': 'Serviços Administrativos',
    '7810': 'Recursos Humanos / RH', '7820': 'Terceirização / RH', '7830': 'RH / Seleção',
    '4520': 'Concessionária / Oficina', '4521': 'Oficina Mecânica', '4530': 'Autopeças',
    '4541': 'Moto / Bicicleta', '4542': 'Moto / Bicicleta',
    '8591': 'Escola / Música / Arte', '8592': 'Escola / Dança / Arte',
    '8593': 'Escola / Idiomas',
    '6910': 'Escritório de Advocacia', '6920': 'Contabilidade',
    '6630': 'Financeira / Seguradora', '6512': 'Financeira', '6521': 'Financeira',
    '9601': 'Lavanderia',
    '9602': 'Salão de Beleza / Estética', '9603': 'Estética',
  };
  return map[c] || 'Empresa';
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const TEMP_DIR = path.join(__dirname, 'temp');
const MODO_TESTE = process.argv.includes('--teste');

function normalize(str) {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();
}

function isConcorrente(fantasia, razao, cnae) {
  const nome = normalize((fantasia || '') + ' ' + (razao || ''));
  if (KEYWORDS_CONCORRENTE.some(kw => nome.includes(kw))) return true;
  const cnaeNum = (cnae || '').replace(/[^0-9]/g, '');
  if (CNAES_CONCORRENTE.has(cnaeNum)) return true;
  return false;
}

function formatarTelefone(ddd, tel) {
  ddd = (ddd || '').trim();
  tel = (tel || '').trim().replace(/\D/g, '');
  if (!tel || tel === '00000000' || tel === '000000000') return '';
  if (ddd && tel) return `(${ddd}) ${tel.length === 9 ? tel.slice(0, 5) + '-' + tel.slice(5) : tel.slice(0, 4) + '-' + tel.slice(4)}`;
  return tel;
}

function mkdirSafe(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ─────────────────────────────────────────────────────────────
// DOWNLOAD COM PROGRESSO
// ─────────────────────────────────────────────────────────────

function baixarArquivo(url, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath)) {
      const size = fs.statSync(destPath).size;
      if (size > 10000) {
        process.stdout.write(` (cache)\n`);
        return resolve(destPath);
      }
      fs.unlinkSync(destPath);
    }

    const file = fs.createWriteStream(destPath);
    let baixados = 0;
    let total = 0;

    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(destPath);
        return baixarArquivo(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        return reject(new Error(`HTTP ${res.statusCode} para ${url}`));
      }

      total = parseInt(res.headers['content-length'] || '0');

      res.on('data', (chunk) => {
        baixados += chunk.length;
        if (total > 0) {
          const pct = Math.round((baixados / total) * 100);
          const mb = (baixados / 1024 / 1024).toFixed(1);
          const totalMb = (total / 1024 / 1024).toFixed(0);
          process.stdout.write(`\r  ⬇️  ${mb}MB / ${totalMb}MB  (${pct}%)   `);
        } else {
          const mb = (baixados / 1024 / 1024).toFixed(1);
          process.stdout.write(`\r  ⬇️  ${mb}MB baixados...`);
        }
      });

      res.pipe(file);

      file.on('finish', () => {
        file.close();
        process.stdout.write(`\r  ✅ Concluído (${(baixados / 1024 / 1024).toFixed(1)}MB)         \n`);
        resolve(destPath);
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

// ─────────────────────────────────────────────────────────────
// PROCESSAR MUNICIPIOS — Obter códigos RF das nossas cidades
// ─────────────────────────────────────────────────────────────

async function obterCodigosMunicipios(zipPath) {
  const codigosAlvo = new Set();
  const nomesPorCodigo = {};

  return new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Parse())
      .on('entry', (entry) => {
        const chunks = [];
        entry
          .pipe(iconv.decodeStream('latin1'))
          .on('data', d => chunks.push(d))
          .on('end', () => {
            const linhas = chunks.join('').split('\n');
            for (const linha of linhas) {
              const partes = linha.split(';');
              if (partes.length < 2) continue;
              const codigo = partes[0].replace(/"/g, '').trim();
              const nome = normalize(partes[1].replace(/"/g, '').trim());
              if (CIDADES_ALVO.has(nome)) {
                codigosAlvo.add(codigo);
                nomesPorCodigo[codigo] = partes[1].replace(/"/g, '').trim();
              }
            }
            resolve({ codigosAlvo, nomesPorCodigo });
          });
      })
      .on('error', reject);
  });
}

// ─────────────────────────────────────────────────────────────
// PROCESSAR ESTABELECIMENTOS — Filtrar por cidade + status ativo
// ─────────────────────────────────────────────────────────────

async function processarEstabelecimentos(zipPath, codigosMunicipios, nomesPorCodigo, matchMap) {
  return new Promise((resolve, reject) => {
    let count = 0;
    let matched = 0;

    fs.createReadStream(zipPath)
      .pipe(unzipper.Parse())
      .on('entry', (entry) => {
        let buffer = '';

        entry
          .pipe(iconv.decodeStream('latin1'))
          .on('data', (chunk) => {
            buffer += chunk;
            const linhas = buffer.split('\n');
            buffer = linhas.pop(); // guarda linha incompleta

            for (const linha of linhas) {
              if (!linha.trim()) continue;
              count++;

              if (count % 100000 === 0) {
                process.stdout.write(`\r  📋 ${(count / 1000).toFixed(0)}k linhas | ${matched} encontrados`);
              }

              const p = linha.split(';');
              if (p.length < 28) continue;

              const uf = p[19]?.replace(/"/g, '').trim();
              if (uf !== 'RS') continue;

              const situacao = p[5]?.replace(/"/g, '').trim();
              if (situacao !== '2') continue; // apenas ativas

              const codMunicipio = p[20]?.replace(/"/g, '').trim();
              if (!codigosMunicipios.has(codMunicipio)) continue;

              const cnpjBasico = p[0]?.replace(/"/g, '').trim();
              const fantasia = p[4]?.replace(/"/g, '').trim();
              const cnae = p[11]?.replace(/"/g, '').trim();

              if (isConcorrente(fantasia, '', cnae)) continue;

              const tel1 = formatarTelefone(p[21]?.replace(/"/g, ''), p[22]?.replace(/"/g, ''));
              const tel2 = formatarTelefone(p[23]?.replace(/"/g, ''), p[24]?.replace(/"/g, ''));
              const email = (p[27]?.replace(/"/g, '') || '').trim().toLowerCase();
              const cidade = nomesPorCodigo[codMunicipio] || codMunicipio;

              // Monta endereço
              const tipoLog = (p[13]?.replace(/"/g, '') || '').trim();
              const logradouro = (p[14]?.replace(/"/g, '') || '').trim();
              const numero = (p[15]?.replace(/"/g, '') || '').trim();
              const bairro = (p[17]?.replace(/"/g, '') || '').trim();
              const cep = (p[18]?.replace(/"/g, '') || '').trim().replace(/(\d{5})(\d{3})/, '$1-$2');

              const endereco = [
                tipoLog && logradouro ? `${tipoLog} ${logradouro}` : logradouro,
                numero, bairro, cidade, 'RS', cep,
              ].filter(Boolean).join(', ');

              matched++;
              matchMap.set(cnpjBasico, {
                cnpjBasico,
                fantasia,
                razao: '',
                cnae,
                categoria: categorizarCNAE(cnae),
                cidade,
                endereco,
                telefone1: tel1,
                telefone2: tel2,
                email: email.includes('@') ? email : '',
              });
            }
          })
          .on('end', () => {
            if (buffer.trim()) count++;
            resolve(matched);
          })
          .on('error', reject);
      })
      .on('error', reject);
  });
}

// ─────────────────────────────────────────────────────────────
// PROCESSAR EMPRESAS — Buscar razão social pelos CNPJs que já temos
// ─────────────────────────────────────────────────────────────

async function processarEmpresas(zipPath, matchMap) {
  return new Promise((resolve, reject) => {
    let count = 0;
    let enriquecidos = 0;

    fs.createReadStream(zipPath)
      .pipe(unzipper.Parse())
      .on('entry', (entry) => {
        let buffer = '';

        entry
          .pipe(iconv.decodeStream('latin1'))
          .on('data', (chunk) => {
            buffer += chunk;
            const linhas = buffer.split('\n');
            buffer = linhas.pop();

            for (const linha of linhas) {
              if (!linha.trim()) continue;
              count++;

              const p = linha.split(';');
              if (p.length < 2) continue;

              const cnpjBasico = p[0]?.replace(/"/g, '').trim();
              if (!matchMap.has(cnpjBasico)) continue;

              const razao = (p[1]?.replace(/"/g, '') || '').trim();
              const entry_data = matchMap.get(cnpjBasico);

              // Verifica concorrente pelo nome da empresa
              if (isConcorrente(entry_data.fantasia, razao, entry_data.cnae)) {
                matchMap.delete(cnpjBasico);
                continue;
              }

              entry_data.razao = razao;
              enriquecidos++;
            }
          })
          .on('end', () => {
            resolve(enriquecidos);
          })
          .on('error', reject);
      })
      .on('error', reject);
  });
}

// ─────────────────────────────────────────────────────────────
// EXPORTAR EXCEL
// ─────────────────────────────────────────────────────────────

function exportarExcel(matchMap) {
  const timestamp = new Date().toISOString().slice(0, 10);
  const arquivo = path.join(__dirname, `leads-passoapasso-${timestamp}.xlsx`);

  const leads = Array.from(matchMap.values());

  // Ordena: primeiro com telefone, depois por cidade
  leads.sort((a, b) => {
    const temTelA = a.telefone1 ? 1 : 0;
    const temTelB = b.telefone1 ? 1 : 0;
    if (temTelB !== temTelA) return temTelB - temTelA;
    return a.cidade.localeCompare(b.cidade);
  });

  // Nome a exibir
  const nomeLead = (l) => l.fantasia || l.razao || l.cnpjBasico;

  // ── Aba 1: Todos os leads ──
  const dadosTodos = leads.map((l, i) => ({
    '#': i + 1,
    'Nome / Fantasia': nomeLead(l),
    'Razão Social': l.razao,
    'Categoria': l.categoria,
    'Cidade': l.cidade,
    'Endereço': l.endereco,
    'Telefone 1': l.telefone1,
    'Telefone 2': l.telefone2,
    'WhatsApp (testar)': l.telefone1,
    'E-mail': l.email,
    'CNAE': l.cnae,
    'Status Contato': '',
    'Observações': '',
  }));

  const wb = xlsx.utils.book_new();
  const wsTodos = xlsx.utils.json_to_sheet(dadosTodos);
  wsTodos['!cols'] = [
    { wch: 5 }, { wch: 40 }, { wch: 40 }, { wch: 28 }, { wch: 20 },
    { wch: 55 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 35 },
    { wch: 12 }, { wch: 22 }, { wch: 35 },
  ];
  xlsx.utils.book_append_sheet(wb, wsTodos, 'Todos os Leads');

  // ── Aba 2: Só com telefone ──
  const comTel = leads.filter(l => l.telefone1);
  const dadosComTel = comTel.map((l, i) => ({
    '#': i + 1,
    'Nome / Fantasia': nomeLead(l),
    'Razão Social': l.razao,
    'Categoria': l.categoria,
    'Cidade': l.cidade,
    'Telefone 1': l.telefone1,
    'Telefone 2': l.telefone2,
    'WhatsApp (testar)': l.telefone1,
    'E-mail': l.email,
    'Status Contato': '',
    'Observações': '',
  }));
  const wsComTel = xlsx.utils.json_to_sheet(dadosComTel);
  wsComTel['!cols'] = [
    { wch: 5 }, { wch: 40 }, { wch: 40 }, { wch: 28 }, { wch: 20 },
    { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 35 }, { wch: 22 }, { wch: 35 },
  ];
  xlsx.utils.book_append_sheet(wb, wsComTel, 'Com Telefone');

  // ── Aba 3: Só com e-mail ──
  const comEmail = leads.filter(l => l.email);
  if (comEmail.length > 0) {
    const dadosEmail = comEmail.map((l, i) => ({
      '#': i + 1,
      'Nome / Fantasia': nomeLead(l),
      'Razão Social': l.razao,
      'Categoria': l.categoria,
      'Cidade': l.cidade,
      'E-mail': l.email,
      'Telefone 1': l.telefone1,
      'Status Contato': '',
      'Observações': '',
    }));
    const wsEmail = xlsx.utils.json_to_sheet(dadosEmail);
    wsEmail['!cols'] = [
      { wch: 5 }, { wch: 40 }, { wch: 40 }, { wch: 28 }, { wch: 20 },
      { wch: 38 }, { wch: 18 }, { wch: 22 }, { wch: 35 },
    ];
    xlsx.utils.book_append_sheet(wb, wsEmail, 'Com E-mail');
  }

  // ── Aba 4: Resumo por categoria ──
  const porCat = {};
  const telPorCat = {};
  const emailPorCat = {};
  leads.forEach(l => {
    porCat[l.categoria] = (porCat[l.categoria] || 0) + 1;
    if (l.telefone1) telPorCat[l.categoria] = (telPorCat[l.categoria] || 0) + 1;
    if (l.email) emailPorCat[l.categoria] = (emailPorCat[l.categoria] || 0) + 1;
  });

  const resumoCat = Object.entries(porCat)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, total]) => ({
      'Categoria': cat,
      'Total': total,
      'Com Telefone': telPorCat[cat] || 0,
      'Com E-mail': emailPorCat[cat] || 0,
    }));
  resumoCat.push({
    'Categoria': '── TOTAL ──',
    'Total': leads.length,
    'Com Telefone': comTel.length,
    'Com E-mail': comEmail.length,
  });
  const wsResCat = xlsx.utils.json_to_sheet(resumoCat);
  wsResCat['!cols'] = [{ wch: 35 }, { wch: 10 }, { wch: 15 }, { wch: 12 }];
  xlsx.utils.book_append_sheet(wb, wsResCat, 'Por Categoria');

  // ── Aba 5: Resumo por cidade ──
  const porCidade = {};
  leads.forEach(l => {
    porCidade[l.cidade] = (porCidade[l.cidade] || 0) + 1;
  });
  const resumoCidade = Object.entries(porCidade)
    .sort((a, b) => b[1] - a[1])
    .map(([cidade, total]) => ({ 'Cidade': cidade, 'Total Leads': total }));
  const wsResCidade = xlsx.utils.json_to_sheet(resumoCidade);
  wsResCidade['!cols'] = [{ wch: 30 }, { wch: 15 }];
  xlsx.utils.book_append_sheet(wb, wsResCidade, 'Por Cidade');

  xlsx.writeFile(wb, arquivo);
  return { arquivo, total: leads.length, comTelefone: comTel.length, comEmail: comEmail.length };
}

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────

async function main() {
  const inicio = Date.now();
  const BASE_URL = 'https://dadosabertos.rfb.gov.br/CNPJ';

  console.log('\n' + '═'.repeat(60));
  console.log('  🎽 Passo a Passo — Captação de Leads B2B');
  console.log('  📂 Fonte: Receita Federal — Dados Abertos CNPJ');
  console.log('  📍 Região: Novo Hamburgo + 40km | Rio Grande do Sul');
  if (MODO_TESTE) console.log('  ⚡ MODO TESTE — processa apenas 1 arquivo de cada');
  console.log('═'.repeat(60) + '\n');

  mkdirSafe(TEMP_DIR);

  // ── Passo 1: Municípios ──
  console.log('📍 Passo 1/4 — Baixando tabela de municípios...');
  const munZip = path.join(TEMP_DIR, 'Municipios.zip');
  await baixarArquivo(`${BASE_URL}/Municipios.zip`, munZip);

  console.log('🔍 Identificando códigos das cidades-alvo...');
  const { codigosAlvo, nomesPorCodigo } = await obterCodigosMunicipios(munZip);
  console.log(`✅ ${codigosAlvo.size} códigos encontrados\n`);

  if (codigosAlvo.size === 0) {
    console.error('❌ Nenhum município encontrado. Verifique os nomes em CIDADES_ALVO.');
    process.exit(1);
  }

  // ── Passo 2: Estabelecimentos ──
  const qtdArquivos = MODO_TESTE ? 1 : 10;
  const matchMap = new Map();

  console.log(`📋 Passo 2/4 — Processando ${qtdArquivos} arquivo(s) de Estabelecimentos...`);
  console.log('   (arquivos grandes ~400-600MB cada — pode demorar alguns minutos)\n');

  for (let i = 0; i < qtdArquivos; i++) {
    const nome = `Estabelecimentos${i}.zip`;
    console.log(`  🗂️  Arquivo ${i + 1}/${qtdArquivos}: ${nome}`);
    const zipPath = path.join(TEMP_DIR, nome);
    await baixarArquivo(`${BASE_URL}/${nome}`, zipPath);

    process.stdout.write('  📋 Filtrando...\n');
    const encontrados = await processarEstabelecimentos(zipPath, codigosAlvo, nomesPorCodigo, matchMap);
    console.log(`\r  ✅ ${encontrados} matches neste arquivo | Total acumulado: ${matchMap.size}\n`);
  }

  console.log(`\n📊 Total de estabelecimentos encontrados: ${matchMap.size}\n`);

  // ── Passo 3: Empresas (razão social) ──
  console.log(`🏢 Passo 3/4 — Buscando razão social em ${qtdArquivos} arquivo(s) de Empresas...`);

  for (let i = 0; i < qtdArquivos; i++) {
    const nome = `Empresas${i}.zip`;
    console.log(`  🗂️  Arquivo ${i + 1}/${qtdArquivos}: ${nome}`);
    const zipPath = path.join(TEMP_DIR, nome);
    await baixarArquivo(`${BASE_URL}/${nome}`, zipPath);

    process.stdout.write('  🏢 Enriquecendo...\n');
    const enriquecidos = await processarEmpresas(zipPath, matchMap);
    console.log(`\r  ✅ ${enriquecidos} razões sociais adicionadas\n`);
  }

  // ── Passo 4: Exportar ──
  console.log('📊 Passo 4/4 — Gerando planilha Excel...');
  const { arquivo, total, comTelefone, comEmail } = exportarExcel(matchMap);

  const duracao = Math.round((Date.now() - inicio) / 1000);
  const min = Math.floor(duracao / 60);
  const sec = duracao % 60;

  console.log('\n' + '═'.repeat(60));
  console.log(`  ✅ Planilha: ${path.basename(arquivo)}`);
  console.log(`  📊 Total de leads:      ${total.toLocaleString('pt-BR')}`);
  console.log(`  📞 Com telefone:        ${comTelefone.toLocaleString('pt-BR')}`);
  console.log(`  📧 Com e-mail:          ${comEmail.toLocaleString('pt-BR')}`);
  console.log(`  ⏱️  Tempo total:         ${min}m ${sec}s`);
  console.log('═'.repeat(60));
  console.log(`\n  📁 ${arquivo}\n`);

  if (MODO_TESTE) {
    console.log('  ⚡ Modo teste: rode sem --teste para processar todos os 10 arquivos.');
    console.log('     npm run buscar\n');
  }
}

main().catch((err) => {
  console.error('\n❌ Erro:', err.message);
  process.exit(1);
});
