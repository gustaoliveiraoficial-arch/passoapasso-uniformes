import { chromium } from 'playwright';
import fs from 'fs';

const BASE_URL = 'https://passoapassouniformes2025.kommo.com';
const OUT = 'C:\Users\gusta\OneDrive\Área de Trabalho\PassoaPasso\kommo-data\contagem.json';

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  const page = pages[0] || await context.newPage();

  await page.goto(`${BASE_URL}/leads/pipeline`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3000);

  const data = await page.evaluate(async (baseUrl) => {
    const api = async (path) => {
      try {
        const r = await fetch(`${baseUrl}${path}`, { credentials: 'include' });
        if (r.ok) return await r.json();
        return { error: r.status, path };
      } catch(e) { return { error: e.message, path }; }
    };

    const abril_inicio = Math.floor(new Date('2026-04-01T00:00:00').getTime() / 1000);
    const maio_fim = Math.floor(new Date('2026-05-07T23:59:59').getTime() / 1000);

    const USERS = {
      14977039: 'Passo a Passo',
      15013463: 'irua',
      15013503: 'Greg',
      15013531: 'Fran'
    };

    const PIPELINES = {
      13368211: 'Funil de Vendas',
      6608232: 'Linha Empresarial',
      6608234: 'Linha Fitness',
      6608236: 'Linha Formandos',
      6608238: 'Linha Futebol',
      6608240: 'Linha Inverno',
      6608242: 'Menos de 10 Pecas'
    };

    const STAGES_FUNIL = {
      40980049: 'Etapa de Entrada',
      40980051: 'Primeiro Contato',
      40980053: 'Aguardando Info',
      40980055: 'Proposta Enviada',
      40980057: 'Negociacao',
      40980059: 'Pedido Confirmado',
      40980061: 'Em Producao',
      40980063: 'Pronto para Entrega',
      40980065: 'Entregue'
    };

    const results = {
      timestamp: new Date().toISOString(),
      periodo: '01/04/2026 a 07/05/2026',
      resumo: {},
      por_usuario: {},
      por_pipeline: {},
      funil_por_etapa: {},
      leads_periodo_por_usuario: {},
      leads_ganhos_periodo: {},
      tarefas_por_usuario: {}
    };

    const totalLeads = await api('/api/v4/leads?limit=1&page=1');
    results.resumo.total_leads = totalLeads?.['_page']?.total || 0;

    const totalContatos = await api('/api/v4/contacts?limit=1&page=1');
    results.resumo.total_contatos = totalContatos?.['_page']?.total || 0;

    const leadsAbril = await api('/api/v4/leads?limit=1&page=1&filter[created_at][from]=' + abril_inicio + '&filter[created_at][to]=' + maio_fim);
    results.resumo.leads_criados_periodo = leadsAbril?.['_page']?.total || 0;

    const tarefasPend = await api('/api/v4/tasks?filter[is_completed]=0&limit=1&page=1');
    results.resumo.tarefas_pendentes = tarefasPend?.['_page']?.total || 0;

    const tarefasConcl = await api('/api/v4/tasks?filter[is_completed]=1&filter[updated_at][from]=' + abril_inicio + '&filter[updated_at][to]=' + maio_fim + '&limit=1&page=1');
    results.resumo.tarefas_concluidas_periodo = tarefasConcl?.['_page']?.total || 0;

    const ganhos = await api('/api/v4/leads?limit=1&page=1&filter[statuses][0][status_id]=142&filter[closed_at][from]=' + abril_inicio + '&filter[closed_at][to]=' + maio_fim);
    results.resumo.leads_ganhos_periodo = ganhos?.['_page']?.total || 0;

    const perdidos = await api('/api/v4/leads?limit=1&page=1&filter[statuses][0][status_id]=143&filter[closed_at][from]=' + abril_inicio + '&filter[closed_at][to]=' + maio_fim);
    results.resumo.leads_perdidos_periodo = perdidos?.['_page']?.total || 0;

    const eventos = await api('/api/v4/events?limit=1&page=1&filter[created_at][from]=' + abril_inicio + '&filter[created_at][to]=' + maio_fim);
    results.resumo.eventos_periodo = eventos?.['_page']?.total || 0;

    for (const [pid, pname] of Object.entries(PIPELINES)) {
      const r = await api('/api/v4/leads?limit=1&page=1&filter[pipeline_id]=' + pid);
      results.por_pipeline[pname] = r?.['_page']?.total || 0;
    }

    for (const [uid, uname] of Object.entries(USERS)) {
      const r = await api('/api/v4/leads?limit=1&page=1&filter[responsible_user_id]=' + uid);
      results.por_usuario[uname] = r?.['_page']?.total || 0;
    }

    for (const [uid, uname] of Object.entries(USERS)) {
      const r = await api('/api/v4/leads?limit=1&page=1&filter[responsible_user_id]=' + uid + '&filter[created_at][from]=' + abril_inicio + '&filter[created_at][to]=' + maio_fim);
      results.leads_periodo_por_usuario[uname] = r?.['_page']?.total || 0;
    }

    for (const [uid, uname] of Object.entries(USERS)) {
      const r = await api('/api/v4/leads?limit=1&page=1&filter[responsible_user_id]=' + uid + '&filter[statuses][0][status_id]=142&filter[closed_at][from]=' + abril_inicio + '&filter[closed_at][to]=' + maio_fim);
      results.leads_ganhos_periodo[uname] = r?.['_page']?.total || 0;
    }

    for (const [sid, sname] of Object.entries(STAGES_FUNIL)) {
      const r = await api('/api/v4/leads?limit=1&page=1&filter[statuses][0][pipeline_id]=13368211&filter[statuses][0][status_id]=' + sid);
      results.funil_por_etapa[sname] = r?.['_page']?.total || 0;
    }

    for (const [uid, uname] of Object.entries(USERS)) {
      const r = await api('/api/v4/tasks?filter[responsible_user_id]=' + uid + '&filter[is_completed]=0&limit=1&page=1');
      results.tarefas_por_usuario[uname] = r?.['_page']?.total || 0;
    }

    return results;
  }, BASE_URL);

  console.log('\n=== CONTAGEM COMPLETA KOMMO ===');
  console.log(JSON.stringify(data, null, 2));

  if (!fs.existsSync('C:\Users\gusta\OneDrive\Área de Trabalho\PassoaPasso\kommo-data')) {
    fs.mkdirSync('C:\Users\gusta\OneDrive\Área de Trabalho\PassoaPasso\kommo-data', { recursive: true });
  }
  fs.writeFileSync(OUT, JSON.stringify(data, null, 2));
  console.log('\n✅ Salvo em:', OUT);

  await browser.close();
})();
