const fs = require('fs');
const path = require('path');

const leads = JSON.parse(fs.readFileSync(path.join(__dirname, 'leads_coletados.json'), 'utf8'));

// Ordena: com telefone primeiro, depois por categoria e cidade
leads.sort((a, b) => {
  const ta = a.telefone ? 0 : 1;
  const tb = b.telefone ? 0 : 1;
  if (ta !== tb) return ta - tb;
  if (a.categoria !== b.categoria) return a.categoria.localeCompare(b.categoria);
  return a.cidade.localeCompare(b.cidade);
});

const total = leads.length;
const comTel = leads.filter(l => l.telefone).length;
const hoje = new Date().toLocaleDateString('pt-BR');

// Resumo por categoria
const porCat = {};
leads.forEach(l => { porCat[l.categoria] = (porCat[l.categoria] || 0) + 1; });
const resumoRows = Object.entries(porCat).sort((a,b) => b[1]-a[1])
  .map(([c,n]) => `<tr><td>${c}</td><td style="text-align:center">${n}</td></tr>`).join('');

// Cores por categoria
const cores = {
  'Escola': '#1a56db',
  'Academia / Fitness': '#e02424',
  'Restaurante / Alimentação': '#ff5a1f',
  'Restaurante / Bar': '#ff5a1f',
  'Saúde / Clínica': '#0e9f6e',
  'Segurança Privada': '#6875f5',
  'Construtora / Engenharia': '#c27803',
  'Transportadora / Logística': '#0694a2',
  'Indústria / Fábrica': '#9061f9',
  'Limpeza / Conservação': '#31c48d',
  'Hotel / Pousada': '#f05252',
  'Veterinária / Pet': '#84cc16',
  'Concessionária / Automóveis': '#3f83f8',
  'Supermercado / Atacado': '#e3a008',
  'Clube / Esporte': '#e02424',
  'Empresa': '#6b7280',
};

const leadsRows = leads.map((l, i) => {
  const cor = cores[l.categoria] || '#6b7280';
  const bgAlt = i % 2 === 0 ? '#ffffff' : '#f9fafb';
  const telStyle = l.telefone ? 'color:#065f46;font-weight:600' : 'color:#9ca3af';
  const telTxt = l.telefone || '—';
  return `<tr style="background:${bgAlt}">
    <td style="padding:6px 8px;font-size:11px;color:#6b7280;text-align:center">${i+1}</td>
    <td style="padding:6px 8px;font-size:12px;font-weight:600;color:#111827">${l.nome}</td>
    <td style="padding:6px 8px;font-size:11px">
      <span style="background:${cor}15;color:${cor};padding:2px 7px;border-radius:10px;font-size:10px;font-weight:600;white-space:nowrap">${l.categoria}</span>
    </td>
    <td style="padding:6px 8px;font-size:11px;color:#374151">${l.cidade}</td>
    <td style="padding:6px 8px;font-size:11px;color:#6b7280">${l.endereco || '—'}</td>
    <td style="padding:6px 8px;font-size:12px;${telStyle}">${telTxt}</td>
    <td style="padding:6px 8px;font-size:11px;color:#6b7280"></td>
  </tr>`;
}).join('');

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background:#fff; color:#111; }

  .capa {
    background: linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 60%, #1e3a5f 100%);
    color: white;
    padding: 40px 50px 35px;
    page-break-after: always;
  }
  .capa-logo { font-size: 28px; font-weight: 900; letter-spacing: 1px; margin-bottom: 4px; }
  .capa-sub { font-size: 13px; opacity: 0.8; margin-bottom: 35px; letter-spacing: 2px; text-transform: uppercase; }
  .capa-title { font-size: 38px; font-weight: 800; line-height: 1.2; margin-bottom: 10px; }
  .capa-desc { font-size: 15px; opacity: 0.85; margin-bottom: 40px; }
  .capa-stats { display: flex; gap: 30px; }
  .stat { background: rgba(255,255,255,0.15); border-radius: 12px; padding: 18px 24px; }
  .stat-num { font-size: 36px; font-weight: 900; line-height: 1; }
  .stat-label { font-size: 11px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
  .capa-footer { margin-top: 35px; font-size: 12px; opacity: 0.6; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; }

  .resumo-page { padding: 30px 40px; page-break-after: always; }
  .sec-title { font-size: 18px; font-weight: 700; color: #1e3a5f; border-bottom: 3px solid #1e3a5f; padding-bottom: 8px; margin-bottom: 20px; }
  .resumo-table { width: 100%; border-collapse: collapse; }
  .resumo-table th { background: #1e3a5f; color: white; padding: 10px 14px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
  .resumo-table td { padding: 9px 14px; font-size: 13px; border-bottom: 1px solid #e5e7eb; }
  .resumo-table tr:nth-child(even) td { background: #f9fafb; }

  .leads-page { padding: 20px 30px; }
  .leads-header { margin-bottom: 15px; }
  .leads-header h2 { font-size: 16px; font-weight: 700; color: #1e3a5f; }
  .leads-header p { font-size: 11px; color: #6b7280; margin-top: 3px; }

  table.leads { width: 100%; border-collapse: collapse; font-size: 12px; }
  table.leads thead th {
    background: #1e3a5f; color: white; padding: 8px; text-align: left;
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; position: sticky; top: 0;
  }
  table.leads tbody tr:hover { background: #eff6ff !important; }
  table.leads td { border-bottom: 1px solid #f3f4f6; vertical-align: middle; }

  .obs-col { width: 120px; }

  @media print {
    .capa { page-break-after: always; }
    .resumo-page { page-break-after: always; }
    table.leads { font-size: 11px; }
  }

  @page { margin: 0; size: A4 landscape; }
</style>
</head>
<body>

<!-- CAPA -->
<div class="capa">
  <div class="capa-logo">PASSO A PASSO</div>
  <div class="capa-sub">Uniformes Personalizados</div>
  <div class="capa-title">Lista de Leads B2B<br>Região de Novo Hamburgo</div>
  <div class="capa-desc">Empresas e instituições com potencial de compra de uniformes — Raio ~40km | Rio Grande do Sul</div>
  <div class="capa-stats">
    <div class="stat">
      <div class="stat-num">${total}</div>
      <div class="stat-label">Total de Leads</div>
    </div>
    <div class="stat">
      <div class="stat-num">${comTel}</div>
      <div class="stat-label">Com Telefone</div>
    </div>
    <div class="stat">
      <div class="stat-num">${Object.keys(porCat).length}</div>
      <div class="stat-label">Categorias</div>
    </div>
  </div>
  <div class="capa-footer">Gerado em ${hoje} &nbsp;|&nbsp; Fonte: Google Maps &nbsp;|&nbsp; Uso interno — equipe comercial</div>
</div>

<!-- RESUMO -->
<div class="resumo-page">
  <div class="sec-title">Resumo por Categoria</div>
  <table class="resumo-table">
    <thead><tr><th>Categoria</th><th>Qtd. Leads</th></tr></thead>
    <tbody>${resumoRows}<tr style="font-weight:700;background:#eff6ff"><td>TOTAL</td><td style="text-align:center">${total}</td></tr></tbody>
  </table>
  <br><br>
  <div class="sec-title">Como usar esta planilha</div>
  <p style="font-size:13px;color:#374151;line-height:1.8">
    1. Priorize leads <strong>com telefone</strong> (aparecem primeiro na lista).<br>
    2. Use o <strong>WhatsApp</strong> ou ligue diretamente para o número listado.<br>
    3. Após contato, preencha a coluna <strong>"Status"</strong>: Ex.: <em>Interessado / Retornar / Sem interesse / Venda</em>.<br>
    4. Leads sem telefone: pesquise pelo nome no Google para encontrar o contato atualizado.
  </p>
</div>

<!-- LISTA DE LEADS -->
<div class="leads-page">
  <div class="leads-header">
    <h2>Lista Completa de Leads — Ordenado por Telefone disponível</h2>
    <p>Leads com telefone aparecem primeiro &nbsp;|&nbsp; Coluna "Status" para controle da equipe</p>
  </div>
  <table class="leads">
    <thead>
      <tr>
        <th style="width:30px">#</th>
        <th style="width:200px">Nome / Empresa</th>
        <th style="width:130px">Categoria</th>
        <th style="width:90px">Cidade</th>
        <th>Endereço</th>
        <th style="width:120px">Telefone / WhatsApp</th>
        <th class="obs-col">Status / Obs.</th>
      </tr>
    </thead>
    <tbody>${leadsRows}</tbody>
  </table>
</div>

</body>
</html>`;

const htmlPath = path.join(__dirname, 'leads_preview.html');
fs.writeFileSync(htmlPath, html, 'utf8');
console.log('HTML gerado:', htmlPath);
console.log(`Total: ${total} leads | Com telefone: ${comTel}`);
