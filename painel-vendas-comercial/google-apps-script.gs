/**
 * SalesBoard Pro — Google Apps Script
 * =====================================================
 * Cole este código no Apps Script da sua planilha Google.
 *
 * FORMATO DA PLANILHA:
 * Aba: "Vendas"
 * Linha 1 (cabeçalho): data | Vendedor1 | Vendedor2 | ...
 * Linhas seguintes:    11/04/2026 | 1500 | 2300 | ...
 *
 * Aceita datas nos formatos:
 *   - DD/MM/AAAA  (ex: 11/04/2026)  ← padrão brasileiro
 *   - AAAA-MM-DD  (ex: 2026-04-11)
 *   - Objeto Date do Google Sheets
 *
 * COMO PUBLICAR:
 * 1. Abra Extensões → Apps Script
 * 2. Cole este código
 * 3. Clique em Implantar → Nova implantação
 * 4. Tipo: Aplicativo da Web
 * 5. Executar como: Eu
 * 6. Acesso: Qualquer pessoa
 * 7. Clique em Implantar e copie a URL gerada
 * =====================================================
 */

function doGet(e) {
  try {
    var result = getDashboardData(e);
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ erro: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function parseDate(rawDate) {
  // Já é um objeto Date (Google Sheets retorna assim para células formatadas como data)
  if (rawDate instanceof Date) {
    if (!isNaN(rawDate.getTime())) return rawDate;
  }

  var str = String(rawDate).trim();
  if (!str || str === '' || str === 'data') return null;

  // Formato DD/MM/AAAA (brasileiro)
  var brMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brMatch) {
    return new Date(
      parseInt(brMatch[3]),   // ano
      parseInt(brMatch[2]) - 1, // mês (0-indexed)
      parseInt(brMatch[1])    // dia
    );
  }

  // Formato AAAA-MM-DD (ISO)
  var isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return new Date(
      parseInt(isoMatch[1]),
      parseInt(isoMatch[2]) - 1,
      parseInt(isoMatch[3])
    );
  }

  // Tentativa genérica
  var d = new Date(str);
  if (!isNaN(d.getTime())) return d;

  return null;
}

function formatDateStr(date) {
  var y = date.getFullYear();
  var m = String(date.getMonth() + 1).padStart('2', '0');
  var d = String(date.getDate()).padStart('2', '0');
  return y + '-' + m + '-' + d;
}

var SPREADSHEET_ID = '1-SLpaeXztHabC58_6a9nZESUKHldTCb0ZwfTf-3odVc'; // vendas castel

function getDashboardData(e) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('Vendas');

  if (!sheet) throw new Error('Aba "Vendas" não encontrada na planilha.');

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) throw new Error('Planilha sem dados (apenas cabeçalho ou vazia).');

  // Cabeçalhos: ignora a primeira coluna (data), pega os demais como vendedores
  var headers = data[0];
  var sellerNames = [];
  for (var h = 1; h < headers.length; h++) {
    var name = String(headers[h]).trim();
    if (name !== '') sellerNames.push(name);
  }

  if (sellerNames.length === 0) throw new Error('Nenhum vendedor encontrado no cabeçalho da planilha.');

  // Parâmetros opcionais via query string
  var params = e ? e.parameter : {};

  // Período: mês atual por padrão
  var now = new Date();
  var y = now.getFullYear();
  var m = now.getMonth();

  var dataInicio = params.inicio || formatDateStr(new Date(y, m, 1));
  var dataFim    = params.fim    || formatDateStr(new Date(y, m + 1, 0));
  var meta       = params.meta   ? parseFloat(params.meta) : null;

  var startDate = new Date(y, m, 1);
  startDate.setHours(0, 0, 0, 0);

  var endDate = new Date(y, m + 1, 0);
  endDate.setHours(23, 59, 59, 999);

  // Se params passados, usa eles
  if (params.inicio) {
    var pi = params.inicio.split('-');
    startDate = new Date(parseInt(pi[0]), parseInt(pi[1]) - 1, parseInt(pi[2]));
    startDate.setHours(0, 0, 0, 0);
  }
  if (params.fim) {
    var pf = params.fim.split('-');
    endDate = new Date(parseInt(pf[0]), parseInt(pf[1]) - 1, parseInt(pf[2]));
    endDate.setHours(23, 59, 59, 999);
  }

  var todayStr = formatDateStr(now);

  // Inicializa totais
  var totals = {};
  var hoje   = {};
  for (var i = 0; i < sellerNames.length; i++) {
    totals[sellerNames[i]] = 0;
    hoje[sellerNames[i]]   = 0;
  }

  // Percorre linhas de dados
  for (var row = 1; row < data.length; row++) {
    var rowData = data[row];
    var rawDate = rowData[0];

    if (!rawDate || String(rawDate).trim() === '') continue;

    var rowDate = parseDate(rawDate);
    if (!rowDate) continue;
    rowDate.setHours(0, 0, 0, 0);

    if (rowDate < startDate || rowDate > endDate) continue;

    var rowDateStr = formatDateStr(rowDate);

    for (var s = 0; s < sellerNames.length; s++) {
      var val = parseFloat(rowData[s + 1]) || 0;
      totals[sellerNames[s]] += val;
      if (rowDateStr === todayStr) {
        hoje[sellerNames[s]] += val;
      }
    }
  }

  return {
    vendedores: totals,
    hoje: hoje,
    meta: meta,
    dataInicio: dataInicio,
    dataFim: dataFim,
    ultimaAtualizacao: new Date().toISOString(),
    _debug: {
      totalLinhas: data.length - 1,
      vendedores: sellerNames,
      periodo: dataInicio + ' a ' + dataFim
    }
  };
}
