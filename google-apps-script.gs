/**
 * Google Apps Script — Backend do Painel de Vendas
 *
 * INSTRUÇÕES DE USO:
 * 1. Abra sua planilha Google Sheets
 * 2. Vá em Extensões → Apps Script
 * 3. Cole todo este código
 * 4. Clique em "Implantar" → "Novo implantação"
 * 5. Tipo: App da Web | Executar como: Eu | Acesso: Qualquer pessoa
 * 6. Copie a URL gerada e cole nas Configurações do Painel
 *
 * ESTRUTURA DA PLANILHA:
 * Aba "Vendas":
 *   A1: Data | B1: Greg | C1: Iruã | D1: Fran | E1: Gustavo | F1: Jessica
 *   A2: 2026-03-25 | B2: 500 | C2: 1200 | D2: 800 | E2: 0 | F2: 1500
 *   (cada linha = um dia de vendas)
 *
 * Aba "Config" (opcional):
 *   A1: meta | B1: 50000
 *   A2: dataInicio | B2: 2026-03-01
 *   A3: dataFim | B3: 2026-03-31
 */

const VENDEDORES = ['Greg', 'Iruã', 'Fran', 'Gustavo', 'Jessica'];

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetVendas = ss.getSheetByName('Vendas');

    if (!sheetVendas) {
      return jsonResponse({ error: 'Aba "Vendas" não encontrada. Crie a aba com o nome exato "Vendas".' });
    }

    const data = sheetVendas.getDataRange().getValues();

    // Inicializa totais
    const totais = {};
    const hoje = {};
    VENDEDORES.forEach(v => {
      totais[v] = 0;
      hoje[v] = 0;
    });

    // Data de hoje formatada
    const tz = Session.getScriptTimeZone();
    const todayStr = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');

    // Identifica índices das colunas pelo cabeçalho (linha 1)
    const header = data[0];
    const colMap = {};
    VENDEDORES.forEach(v => {
      const idx = header.findIndex(h => h.toString().trim() === v);
      if (idx >= 0) colMap[v] = idx;
    });

    // Processa cada linha de dados (pula cabeçalho)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue; // Linha vazia

      let dateStr;
      try {
        dateStr = Utilities.formatDate(new Date(row[0]), tz, 'yyyy-MM-dd');
      } catch (err) {
        dateStr = row[0].toString().split('T')[0];
      }

      VENDEDORES.forEach(v => {
        const col = colMap[v];
        if (col === undefined) return;
        const val = parseFloat(row[col]) || 0;
        totais[v] += val;
        if (dateStr === todayStr) {
          hoje[v] += val;
        }
      });
    }

    // Lê configurações opcionais da aba Config
    let meta = 50000;
    let dataInicio = '';
    let dataFim = '';

    try {
      const sheetConfig = ss.getSheetByName('Config');
      if (sheetConfig) {
        const configData = sheetConfig.getDataRange().getValues();
        configData.forEach(row => {
          const key = row[0].toString().trim().toLowerCase();
          const val = row[1];
          if (key === 'meta') meta = parseFloat(val) || 50000;
          if (key === 'datainicio' || key === 'data_inicio') dataInicio = val.toString();
          if (key === 'datafim' || key === 'data_fim') dataFim = val.toString();
        });
      }
    } catch (err) {
      // Config sheet is optional, ignore errors
    }

    return jsonResponse({
      vendedores: totais,
      hoje: hoje,
      meta: meta,
      dataInicio: dataInicio,
      dataFim: dataFim,
      ultimaAtualizacao: new Date().toISOString()
    });

  } catch (err) {
    return jsonResponse({ error: err.message, stack: err.stack });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Função auxiliar para criar a estrutura inicial da planilha
 * Execute uma vez manualmente se quiser criar as abas automaticamente
 */
function setupPlanilha() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Cria aba Vendas se não existir
  let sheetVendas = ss.getSheetByName('Vendas');
  if (!sheetVendas) {
    sheetVendas = ss.insertSheet('Vendas');
  }

  // Define cabeçalho
  const header = ['Data', 'Greg', 'Iruã', 'Fran', 'Gustavo', 'Jessica'];
  sheetVendas.getRange(1, 1, 1, header.length).setValues([header]);
  sheetVendas.getRange(1, 1, 1, header.length).setFontWeight('bold');
  sheetVendas.setFrozenRows(1);

  // Formata coluna de data
  sheetVendas.getRange('A2:A1000').setNumberFormat('yyyy-MM-dd');

  // Adiciona linha de exemplo
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  sheetVendas.getRange(2, 1, 1, 6).setValues([[today, 0, 0, 0, 0, 0]]);

  // Cria aba Config se não existir
  let sheetConfig = ss.getSheetByName('Config');
  if (!sheetConfig) {
    sheetConfig = ss.insertSheet('Config');
  }

  sheetConfig.getRange('A1:B3').setValues([
    ['meta', 50000],
    ['dataInicio', today],
    ['dataFim', today]
  ]);

  SpreadsheetApp.getUi().alert('Planilha configurada com sucesso! ✅\nPreencha a aba "Vendas" com os dados diários de cada vendedor.');
}
