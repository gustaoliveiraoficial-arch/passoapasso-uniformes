import { chromium } from 'playwright';
import fs from 'fs';

const BASE_URL = 'https://passoapassouniformes2025.kommo.com';
const OUT = 'C:\\Users\\gusta\\OneDrive\\Área de Trabalho\\PassoaPasso\\kommo-data\\api-data.json';

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  const page = pages[0] || await context.newPage();

  // Navegar ao funil para garantir que a sessão está ativa
  await page.goto(`${BASE_URL}/leads/pipeline`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(4000);

  // Extrair token dos cookies
  const cookies = await context.cookies();
  const sessionCookie = cookies.find(c => c.name === 'session_id' || c.name.includes('auth') || c.name.includes('token'));
  console.log('Cookies encontrados:', cookies.map(c => c.name).join(', '));

  // Usar fetch via browser para fazer as chamadas da API com a sessão atual
  const data = await page.evaluate(async (baseUrl) => {
    const results = {};

    // Helper para fetch com credenciais
    const api = async (path) => {
      try {
        const r = await fetch(`${baseUrl}${path}`, { credentials: 'include' });
        if (r.ok) return await r.json();
        return { error: r.status, url: path };
      } catch(e) {
        return { error: e.message, url: path };
      }
    };

    // 1. Total de leads ativos
    const leadsAtivos = await api('/api/v4/leads?filter[statuses][0][pipeline_id]=13368211&limit=1&page=1');
    results.total_leads_meta = leadsAtivos?._page?.total || leadsAtivos?.['_page']?.total || 'erro';

    // 2. Leads no funil — contar por página
    const leads1 = await api('/api/v4/leads?limit=1&page=1');
    results.leads_total = leads1?.['_page']?.total;

    // 3. Contatos total
    const contacts = await api('/api/v4/contacts?limit=1&page=1');
    results.contacts_total = contacts?.['_page']?.total;

    // 4. Usuários (vendedores)
    const users = await api('/api/v4/users?limit=50');
    results.users = (users?.['_embedded']?.users || []).map(u => ({
      id: u.id, name: u.name, email: u.email, role: u.role
    }));

    // 5. Pipelines (funis)
    const pipelines = await api('/api/v4/leads/pipelines');
    results.pipelines = (pipelines?.['_embedded']?.pipelines || []).map(p => ({
      id: p.id, name: p.name,
      statuses: (p._embedded?.statuses || []).map(s => ({ id: s.id, name: s.name, color: s.color }))
    }));

    // 6. Leads por etapa — pegar contagem
    const leadsAll = await api('/api/v4/leads?limit=250&page=1&with=contacts');
    results.leads_page1_count = leadsAll?.['_embedded']?.leads?.length || 0;
    results.leads_page1_total = leadsAll?.['_page']?.total || 0;
    results.leads_current_page = leadsAll?.['_page']?.current || 1;
    results.leads_last_page = leadsAll?.['_page']?.last_page || 1;

    // 7. Leads criados em abril (01/04 a hoje)
    const abril_inicio = Math.floor(new Date('2026-04-01').getTime() / 1000);
    const hoje_fim = Math.floor(new Date('2026-05-07T23:59:59').getTime() / 1000);
    const leadsAbril = await api(`/api/v4/leads?limit=1&page=1&filter[created_at][from]=${abril_inicio}&filter[created_at][to]=${hoje_fim}`);
    results.leads_abril_total = leadsAbril?.['_page']?.total || 0;

    // 8. Tarefas pendentes
    const tasks = await api('/api/v4/tasks?filter[is_completed]=0&limit=1&page=1');
    results.tasks_pending = tasks?.['_page']?.total || 0;

    // 9. Eventos recentes (atividades)
    const events = await api('/api/v4/events?limit=50&filter[created_at][from]=' + abril_inicio);
    results.events_abril = events?.['_page']?.total || 0;
    results.events_types = {};
    (events?.['_embedded']?.events || []).forEach(e => {
      results.events_types[e.type] = (results.events_types[e.type] || 0) + 1;
    });

    // 10. Conversas (chats) abertas
    const chats = await api('/api/v4/chats?limit=1&page=1');
    results.chats_total = chats?.['_page']?.total || chats?.total || 'n/a';

    return results;
  }, BASE_URL);

  console.log('\n📊 DADOS DA API:');
  console.log(JSON.stringify(data, null, 2));
  fs.writeFileSync(OUT, JSON.stringify(data, null, 2));
  console.log('\n✅ Dados salvos em:', OUT);

  await page.close();
  await browser.close();
})();
