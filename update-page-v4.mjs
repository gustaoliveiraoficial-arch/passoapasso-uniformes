import https from 'https';

const NONCE = 'ad8d653930';

const html = `<!-- wp:html -->
<style>
*{box-sizing:border-box;margin:0;padding:0}
.ppuf-wrap{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:620px;margin:0 auto;padding:16px}
.ppuf-kit-header{background:#1a1a1a;color:#fff;border-radius:12px;padding:20px 24px;margin-bottom:24px;border-left:5px solid #e87722}
.ppuf-kit-header h2{font-size:1.4rem;font-weight:700;color:#e87722;margin-bottom:8px}
.ppuf-kit-meta{display:flex;gap:16px;flex-wrap:wrap;font-size:.85rem;color:#ccc}
.ppuf-kit-meta strong{color:#fff}
.ppuf-steps{display:flex;gap:6px;margin-bottom:24px;flex-wrap:wrap}
.ppuf-step-tab{padding:8px 14px;border-radius:20px;font-size:.8rem;font-weight:600;background:#e9ecef;color:#6c757d;cursor:default}
.ppuf-step-tab.done{background:#28a745;color:#fff}
.ppuf-step-tab.active{background:#e87722;color:#fff}
.ppuf-card{background:#fff;border:1px solid #dee2e6;border-radius:12px;padding:24px;margin-bottom:16px}
.ppuf-card h3{font-size:1.1rem;font-weight:700;margin-bottom:6px;color:#212529}
.ppuf-subtitle{font-size:.85rem;color:#e87722;margin-bottom:16px}
.ppuf-info{background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:12px 16px;font-size:.85rem;color:#856404;margin-bottom:16px;line-height:1.5}
.ppuf-info-blue{background:#e7f3ff;border:1px solid #b8daff;border-radius:8px;padding:12px 16px;font-size:.85rem;color:#004085;margin-bottom:16px;line-height:1.5}
.ppuf-field{margin-bottom:16px}
.ppuf-field label{display:block;font-size:.85rem;font-weight:600;margin-bottom:6px;color:#495057}
.ppuf-field input[type=text],.ppuf-field input[type=email],.ppuf-field textarea{width:100%;border:1px solid #ced4da;border-radius:8px;padding:10px 14px;font-size:.95rem;outline:none;transition:border-color .2s}
.ppuf-field input:focus,.ppuf-field textarea:focus{border-color:#e87722;box-shadow:0 0 0 3px rgba(232,119,34,.12)}
.ppuf-hint{font-size:.75rem;color:#6c757d;margin-top:4px}
.ppuf-btns{display:flex;gap:12px;margin-top:20px;flex-wrap:wrap}
.ppuf-btn{padding:11px 24px;border-radius:8px;font-size:.95rem;font-weight:600;cursor:pointer;border:none;transition:all .18s}
.ppuf-btn-primary{background:#e87722;color:#fff}
.ppuf-btn-primary:hover{background:#c9621a}
.ppuf-btn-primary:disabled{background:#ccc;cursor:not-allowed}
.ppuf-btn-secondary{background:#f8f9fa;color:#495057;border:1px solid #dee2e6}
.ppuf-btn-secondary:hover{background:#e9ecef}
.ppuf-btn-green{background:#25d366;color:#fff;width:100%;padding:16px;font-size:1.05rem;border-radius:10px;display:flex;align-items:center;justify-content:center;gap:10px;cursor:pointer;border:none;font-weight:700}
.ppuf-btn-green:hover{background:#1da853}
.ppuf-btn-outline{background:#fff;color:#495057;border:1px solid #dee2e6;width:100%;padding:12px;border-radius:8px;cursor:pointer;font-size:.9rem;font-weight:600;margin-top:8px}
.ppuf-cor-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.ppuf-cor-item{border:2px solid #dee2e6;border-radius:10px;padding:14px 12px;cursor:pointer;display:flex;align-items:center;gap:10px;font-size:.9rem;font-weight:500;transition:all .18s}
.ppuf-cor-item:hover{border-color:#e87722}
.ppuf-cor-item.selected{border-color:#e87722;background:#fff8f3}
.ppuf-cor-dot{width:28px;height:28px;border-radius:50%;flex-shrink:0;border:2px solid rgba(0,0,0,.12)}
.ppuf-counter{background:#1a1a1a;color:#fff;border-radius:10px;padding:14px 20px;margin-bottom:14px}
.ppuf-counter-label{font-size:.8rem;color:#aaa;margin-bottom:2px}
.ppuf-counter-value{font-size:1.6rem;font-weight:700}
.ppuf-counter-ok{font-size:.85rem;color:#25d366;font-weight:700;margin-left:8px}
.ppuf-sz-section{margin-bottom:18px}
.ppuf-sz-section-title{font-size:.8rem;font-weight:700;color:#6c757d;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #dee2e6}
.ppuf-sz-row{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f1f3f5}
.ppuf-sz-row:last-child{border-bottom:none}
.ppuf-sz-label{flex:1;font-size:.9rem;font-weight:500;color:#212529}
.ppuf-sz-plus-label{color:#dc3545;font-size:.75rem;font-weight:600}
.ppuf-qbtn{width:34px;height:34px;border-radius:8px;border:1.5px solid #dee2e6;background:#fff;font-size:1.2rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#495057;transition:all .15s;flex-shrink:0;line-height:1}
.ppuf-qbtn:hover{border-color:#e87722;color:#e87722}
.ppuf-qty-display{min-width:36px;text-align:center;font-size:1.1rem;font-weight:700;color:#212529}
.ppuf-estampa-counter{display:flex;align-items:center;gap:12px;margin-bottom:4px}
.ppuf-estampa-num{font-size:1.3rem;font-weight:700;min-width:32px;text-align:center}
.ppuf-extra-badge{background:#dc3545;color:#fff;font-size:.7rem;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:4px}
.ppuf-file-area{border:2px dashed #dee2e6;border-radius:10px;padding:20px;text-align:center;cursor:pointer;transition:border-color .2s;margin-bottom:8px;background:#fafafa}
.ppuf-file-area:hover{border-color:#e87722;background:#fff8f3}
.ppuf-file-area.has-file{border-color:#28a745;background:#f0fff4}
.ppuf-file-icon{font-size:2rem;margin-bottom:8px}
.ppuf-file-name{font-size:.85rem;color:#28a745;font-weight:600;margin-top:6px}
.ppuf-review-section{margin-bottom:16px}
.ppuf-review-section-title{font-size:.7rem;font-weight:700;color:#6c757d;text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px}
.ppuf-review-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f3f5;font-size:.9rem}
.ppuf-review-row:last-child{border-bottom:none}
.ppuf-review-row span:first-child{color:#6c757d}
.ppuf-review-row span:last-child{font-weight:600;color:#212529;text-align:right;max-width:65%}
.ppuf-modal-bg{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.75);z-index:99999;align-items:center;justify-content:center;padding:16px}
.ppuf-modal-bg.open{display:flex}
.ppuf-modal{background:#fff;border-radius:14px;max-width:700px;width:100%;max-height:90vh;overflow-y:auto;padding:24px}
.ppuf-modal h4{font-size:1.1rem;font-weight:700;margin-bottom:8px;color:#212529}
.ppuf-modal img{width:100%;border-radius:8px;margin-bottom:12px;border:1px solid #dee2e6}
.ppuf-modal-close{float:right;background:none;border:none;font-size:1.5rem;cursor:pointer;color:#6c757d;margin-top:-4px}
.ppuf-step{display:none}.ppuf-step.active{display:block}
@media(max-width:480px){.ppuf-cor-grid{grid-template-columns:1fr}.ppuf-btns{flex-direction:column}}
</style>

<div class="ppuf-wrap" id="ppuf">
  <div class="ppuf-kit-header">
    <h2 id="ppuf-kit-name">Carregando...</h2>
    <div class="ppuf-kit-meta">
      <span><strong id="ppuf-kit-qty">-</strong> pecas</span>
      <span>Prazo: 30-40 dias uteis</span>
      <span>1 estampa inclusa</span>
    </div>
  </div>

  <div class="ppuf-steps">
    <div class="ppuf-step-tab active" id="ppuf-tab-1">1. Dados</div>
    <div class="ppuf-step-tab" id="ppuf-tab-2">2. Cor</div>
    <div class="ppuf-step-tab" id="ppuf-tab-3">3. Tamanhos</div>
    <div class="ppuf-step-tab" id="ppuf-tab-4">4. Estampas</div>
    <div class="ppuf-step-tab" id="ppuf-tab-5">5. Revisao</div>
  </div>

  <!-- STEP 1 -->
  <div class="ppuf-step active" id="ppuf-s1">
    <div class="ppuf-card">
      <h3>Seus Dados</h3>
      <p class="ppuf-subtitle">Nenhum pagamento cobrado agora. Nosso vendedor confirmara os valores pelo WhatsApp.</p>
      <div class="ppuf-info">Preencha o formulario. O vendedor entrara em contato para <strong>confirmar o valor final e fechar o pedido</strong>.</div>
      <div class="ppuf-field"><label>Nome completo *</label><input type="text" id="ppuf-nome" placeholder="Seu nome completo"></div>
      <div class="ppuf-field"><label>WhatsApp / Telefone *</label><input type="text" id="ppuf-tel" placeholder="(00) 00000-0000"></div>
      <div class="ppuf-field"><label>E-mail (opcional)</label><input type="email" id="ppuf-email" placeholder="seuemail@exemplo.com"></div>
      <div class="ppuf-btns"><button class="ppuf-btn ppuf-btn-primary" id="ppuf-btn-1">Proximo</button></div>
    </div>
  </div>

  <!-- STEP 2 -->
  <div class="ppuf-step" id="ppuf-s2">
    <div class="ppuf-card">
      <h3>Cor do Tecido</h3>
      <p class="ppuf-subtitle">Escolha a cor base das camisetas.</p>
      <div class="ppuf-info-blue">Cores-base disponiveis no PV Premium. Para combinacoes entre pecas, fale com nosso vendedor.</div>
      <div class="ppuf-cor-grid" id="ppuf-cores">
        <div class="ppuf-cor-item" data-cor="Preto"><div class="ppuf-cor-dot" style="background:#1a1a1a"></div>Preto</div>
        <div class="ppuf-cor-item" data-cor="Azul Marinho"><div class="ppuf-cor-dot" style="background:#002366"></div>Azul Marinho</div>
        <div class="ppuf-cor-item" data-cor="Cinza Mescla Claro"><div class="ppuf-cor-dot" style="background:#b0b5bb;border-color:#888"></div>Cinza Mescla Claro</div>
        <div class="ppuf-cor-item" data-cor="Cinza Mescla Escuro"><div class="ppuf-cor-dot" style="background:#5a5e63"></div>Cinza Mescla Escuro</div>
      </div>
      <div class="ppuf-btns">
        <button class="ppuf-btn ppuf-btn-secondary" id="ppuf-btn-2b">Voltar</button>
        <button class="ppuf-btn ppuf-btn-primary" id="ppuf-btn-2">Proximo</button>
      </div>
    </div>
  </div>

  <!-- STEP 3 -->
  <div class="ppuf-step" id="ppuf-s3">
    <div class="ppuf-card">
      <h3>Tamanhos</h3>
      <p class="ppuf-subtitle">Distribua as <strong id="ppuf-sz-total">-</strong> pecas entre Unissex e Baby Look. <strong>So avanca ao completar o total.</strong></p>
      <div class="ppuf-counter" id="ppuf-counter-box">
        <div class="ppuf-counter-label">Pecas selecionadas</div>
        <div><span class="ppuf-counter-value" id="ppuf-sz-sel">0</span> / <span id="ppuf-sz-tot2">-</span><span class="ppuf-counter-ok" id="ppuf-sz-ok" style="display:none">OK</span></div>
      </div>
      <div class="ppuf-info"><strong>Plus Size (XG, XXG, XXXG):</strong> +30% por peca - calculado pelo vendedor.<br>Depois de fechar, voce pode <strong>adicionar mais pecas</strong> com o vendedor.</div>
      <button class="ppuf-btn ppuf-btn-secondary" id="ppuf-btn-medidas" style="margin-bottom:16px;padding:8px 16px;font-size:.82rem">Ver Tabela de Medidas</button>
      <div id="ppuf-sz-grid"></div>
      <div class="ppuf-btns">
        <button class="ppuf-btn ppuf-btn-secondary" id="ppuf-btn-3b">Voltar</button>
        <button class="ppuf-btn ppuf-btn-primary" id="ppuf-btn-3" disabled>Proximo</button>
      </div>
    </div>
  </div>

  <!-- STEP 4 -->
  <div class="ppuf-step" id="ppuf-s4">
    <div class="ppuf-card">
      <h3>Estampas e Artes</h3>
      <p class="ppuf-subtitle">Informe a quantidade e detalhes das estampas.</p>
      <div class="ppuf-info">
        <strong>Incluso no kit: 1 estampa</strong> — serigrafia de ate 2 cores <strong>ou</strong> DTF, ambos de ate 10 cm.<br>
        Estampas adicionais tem custo extra e <strong>precisam ser confirmadas com o vendedor quanto a viabilidade</strong>.
      </div>
      <div class="ppuf-field">
        <label>Quantidade de estampas *</label>
        <div class="ppuf-estampa-counter">
          <button class="ppuf-qbtn" id="ppuf-est-m">-</button>
          <span class="ppuf-estampa-num" id="ppuf-est-num">1</span>
          <button class="ppuf-qbtn" id="ppuf-est-p">+</button>
          <span id="ppuf-est-badge" style="display:none"><span class="ppuf-extra-badge" id="ppuf-est-extra"></span></span>
        </div>
        <div class="ppuf-hint" id="ppuf-est-hint">inclusa no kit</div>
      </div>
      <div class="ppuf-field">
        <label>Observacoes sobre as estampas (opcional)</label>
        <textarea id="ppuf-obs" rows="3" placeholder="Ex: Logo na frente centralizado, numero no dorso..." style="width:100%;border:1px solid #ced4da;border-radius:8px;padding:10px 14px;font-size:.95rem;outline:none;resize:vertical"></textarea>
      </div>
      <div class="ppuf-btns">
        <button class="ppuf-btn ppuf-btn-secondary" id="ppuf-btn-4b">Voltar</button>
        <button class="ppuf-btn ppuf-btn-primary" id="ppuf-btn-4">Proximo</button>
      </div>
    </div>
  </div>

  <!-- STEP 5 -->
  <div class="ppuf-step" id="ppuf-s5">
    <div class="ppuf-card">
      <h3>Revisao do Pedido</h3>
      <p class="ppuf-subtitle">Confira tudo antes de enviar ao vendedor.</p>
      <div id="ppuf-review-content"></div>
      <div class="ppuf-info" style="margin-top:16px">Ao clicar em <strong>Finalizar Pedido no WhatsApp</strong> voce sera redirecionado ao atendimento. O vendedor confirmara os valores e fechara o pedido.</div>
      <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:14px 16px;margin-top:12px;font-size:.87rem;color:#856404;line-height:1.6">
        <strong>&#128196; Importante:</strong> Apos enviar a mensagem, <strong>encaminhe o arquivo da sua arte diretamente no chat do WhatsApp</strong>.<br>
        Lembre-se: esta incluso no kit <strong>1 serigrafia de ate 2 cores ou 1 DTF (ambos ate 10 cm)</strong>. Estampas adicionais serao confirmadas e cobradas pelo vendedor.
      </div>
      <div style="margin-top:16px">
        <button class="ppuf-btn ppuf-btn-green" id="ppuf-btn-wa">Finalizar Pedido no WhatsApp</button>
        <button class="ppuf-btn-outline" id="ppuf-btn-5b">Voltar e editar</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Medidas -->
<div class="ppuf-modal-bg" id="ppuf-modal">
  <div class="ppuf-modal">
    <button class="ppuf-modal-close" id="ppuf-modal-close">&times;</button>
    <h4>Tabela de Medidas PV Premium</h4>
    <p style="font-size:.78rem;color:#6c757d;margin-bottom:12px">Medidas em cm: Comprimento x Largura x Manga</p>
    <p style="font-size:.85rem;font-weight:700;margin-bottom:6px">Unissex</p>
    <img src="https://i.imgur.com/JEkgXvt.jpeg" alt="Medidas Unissex">
    <p style="font-size:.85rem;font-weight:700;margin-bottom:6px">Baby Look</p>
    <img src="https://i.imgur.com/yHpHGMD.jpeg" alt="Medidas Baby Look">
    <button class="ppuf-btn ppuf-btn-primary" id="ppuf-modal-ok" style="width:100%;margin-top:8px">Fechar</button>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  var KITS = {
    '5':  {name:'Kit PV Premium - 5 Pecas',  qty:5},
    '10': {name:'Kit PV Premium - 10 Pecas', qty:10},
    '20': {name:'Kit PV Premium - 20 Pecas', qty:20},
    '30': {name:'Kit PV Premium - 30 Pecas', qty:30}
  };
  var params = new URLSearchParams(window.location.search);
  var kitId = params.get('kit') || '10';
  var kit = KITS[kitId] || KITS['10'];

  document.getElementById('ppuf-kit-name').textContent = kit.name;
  document.getElementById('ppuf-kit-qty').textContent = kit.qty;
  document.getElementById('ppuf-sz-total').textContent = kit.qty;
  document.getElementById('ppuf-sz-tot2').textContent = kit.qty;

  var state = {
    nome:'', tel:'', email:'', cor:'',
    szU:{PP:0,P:0,M:0,G:0,GG:0,'XG G1':0,'XXG G2':0,'XXXG G3':0},
    szB:{PP:0,P:0,M:0,G:0,GG:0,'XG G1':0,'XXG G2':0,'XXXG G3':0},
    estQty:1, obs:''
  };

  var SN = ['PP','P','M','G','GG'];
  var SP = ['XG G1','XXG G2','XXXG G3'];
  var SPL = ['XG (G1)','XXG (G2)','XXXG (G3)'];

  function totalSizes() {
    var t = 0;
    SN.concat(SP).forEach(function(s){ t += state.szU[s] + state.szB[s]; });
    return t;
  }

  function updateCounter() {
    var t = totalSizes();
    document.getElementById('ppuf-sz-sel').textContent = t;
    var ok = t === kit.qty;
    document.getElementById('ppuf-sz-ok').style.display = ok ? 'inline' : 'none';
    document.getElementById('ppuf-btn-3').disabled = !ok;
    document.getElementById('ppuf-counter-box').style.background = ok ? '#1a5c30' : '#1a1a1a';
  }

  function updateQtyDisplay(tipo, sz) {
    var val = tipo === 'U' ? state.szU[sz] : state.szB[sz];
    var id = 'ppuf-' + tipo.toLowerCase() + '-' + sz.replace(/ /g, '-');
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function renderSizes() {
    var g = document.getElementById('ppuf-sz-grid');
    var h = '';

    function rows(tipo, sizes, labels) {
      var out = '';
      sizes.forEach(function(s, i) {
        var lbl = labels ? labels[i] : s;
        var plus = labels ? ' <span class="ppuf-sz-plus-label">+30%</span>' : '';
        var id = 'ppuf-' + tipo.toLowerCase() + '-' + s.replace(/ /g, '-');
        out += '<div class="ppuf-sz-row">' +
          '<span class="ppuf-sz-label">' + lbl + plus + '</span>' +
          '<button class="ppuf-qbtn" data-tipo="' + tipo + '" data-sz="' + s + '" data-d="-1">-</button>' +
          '<span class="ppuf-qty-display" id="' + id + '">0</span>' +
          '<button class="ppuf-qbtn" data-tipo="' + tipo + '" data-sz="' + s + '" data-d="1">+</button>' +
          '</div>';
      });
      return out;
    }

    h += '<div class="ppuf-sz-section"><div class="ppuf-sz-section-title">Unissex</div>';
    h += rows('U', SN, null) + rows('U', SP, SPL) + '</div>';
    h += '<div class="ppuf-sz-section"><div class="ppuf-sz-section-title">Baby Look</div>';
    h += rows('B', SN, null) + rows('B', SP, SPL) + '</div>';
    g.innerHTML = h;

    g.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-sz]');
      if (!btn) return;
      var tipo = btn.dataset.tipo;
      var sz = btn.dataset.sz;
      var d = parseInt(btn.dataset.d);
      var obj = tipo === 'U' ? state.szU : state.szB;
      var newVal = (obj[sz] || 0) + d;
      if (newVal < 0) return;
      if (d > 0 && totalSizes() >= kit.qty) return;
      obj[sz] = newVal;
      updateQtyDisplay(tipo, sz);
      updateCounter();
    });
  }

  function showStep(n) {
    for (var i = 1; i <= 5; i++) {
      var s = document.getElementById('ppuf-s' + i);
      var t = document.getElementById('ppuf-tab-' + i);
      if (s) s.classList.toggle('active', i === n);
      if (t) { t.classList.remove('active','done'); if(i===n)t.classList.add('active'); else if(i<n)t.classList.add('done'); }
    }
    window.scrollTo(0, 0);
  }

  // Step 1
  document.getElementById('ppuf-btn-1').addEventListener('click', function() {
    var nome = document.getElementById('ppuf-nome').value.trim();
    var tel = document.getElementById('ppuf-tel').value.trim();
    if (!nome) { alert('Informe seu nome completo.'); return; }
    if (!tel) { alert('Informe seu WhatsApp/Telefone.'); return; }
    state.nome = nome; state.tel = tel;
    state.email = document.getElementById('ppuf-email').value.trim();
    showStep(2);
  });

  // Step 2
  document.getElementById('ppuf-cores').addEventListener('click', function(e) {
    var item = e.target.closest('.ppuf-cor-item');
    if (!item) return;
    document.querySelectorAll('.ppuf-cor-item').forEach(function(el){ el.classList.remove('selected'); });
    item.classList.add('selected');
    state.cor = item.dataset.cor;
  });
  document.getElementById('ppuf-btn-2b').addEventListener('click', function(){ showStep(1); });
  document.getElementById('ppuf-btn-2').addEventListener('click', function() {
    if (!state.cor) { alert('Selecione uma cor de tecido.'); return; }
    showStep(3);
  });

  // Step 3
  renderSizes();
  document.getElementById('ppuf-btn-3b').addEventListener('click', function(){ showStep(2); });
  document.getElementById('ppuf-btn-3').addEventListener('click', function(){ showStep(4); });

  document.getElementById('ppuf-btn-medidas').addEventListener('click', function(){
    document.getElementById('ppuf-modal').classList.add('open');
  });
  document.getElementById('ppuf-modal-close').addEventListener('click', function(){
    document.getElementById('ppuf-modal').classList.remove('open');
  });
  document.getElementById('ppuf-modal-ok').addEventListener('click', function(){
    document.getElementById('ppuf-modal').classList.remove('open');
  });
  document.getElementById('ppuf-modal').addEventListener('click', function(e){
    if(e.target===this) this.classList.remove('open');
  });

  // Step 4
  var estQty = 1;
  function updateEstampa() {
    state.estQty = estQty;
    document.getElementById('ppuf-est-num').textContent = estQty;
    var extra = estQty - 1;
    var badge = document.getElementById('ppuf-est-badge');
    var hint = document.getElementById('ppuf-est-hint');
    if (extra > 0) {
      badge.style.display = 'inline';
      document.getElementById('ppuf-est-extra').textContent = extra + ' adicional' + (extra>1?'is':'') + ' (confirmar com vendedor)';
      hint.textContent = '1 inclusa + ' + extra + ' adicional' + (extra>1?'is':'') + ' com custo extra';
    } else { badge.style.display = 'none'; hint.textContent = 'inclusa no kit'; }
  }
  document.getElementById('ppuf-est-m').addEventListener('click', function(){ if(estQty>1){estQty--;updateEstampa();} });
  document.getElementById('ppuf-est-p').addEventListener('click', function(){ estQty++;updateEstampa(); });

  document.getElementById('ppuf-btn-4b').addEventListener('click', function(){ showStep(3); });
  document.getElementById('ppuf-btn-4').addEventListener('click', function() {
    state.obs = document.getElementById('ppuf-obs').value.trim();
    buildReview();
    showStep(5);
  });

  // Step 5
  function buildReview() {
    var szRows = [];
    SN.concat(SP).forEach(function(s, i) {
      var lbl = i < 5 ? s : SPL[i-5];
      if (state.szU[s] > 0) szRows.push([lbl + ' (Unissex)', state.szU[s] + ' peca' + (state.szU[s]>1?'s':'')]);
      if (state.szB[s] > 0) szRows.push([lbl + ' (Baby Look)', state.szB[s] + ' peca' + (state.szB[s]>1?'s':'')]);
    });

    function row(label, val) {
      return '<div class="ppuf-review-row"><span>' + label + '</span><span>' + val + '</span></div>';
    }
    function section(title, rows) {
      return '<div class="ppuf-review-section"><div class="ppuf-review-section-title">' + title + '</div>' + rows.join('') + '</div>';
    }

    var html =
      section('KIT', [row('Kit', kit.name), row('Pecas', kit.qty)]) +
      section('SEUS DADOS', [row('Nome', state.nome), row('WhatsApp/Tel', state.tel)].concat(state.email?[row('E-mail', state.email)]:[])) +
      section('CAMISETA', [row('Cor', state.cor)]) +
      section('TAMANHOS', szRows.map(function(r){ return row(r[0], r[1]); })) +
      section('ESTAMPAS', [
        row('Qtd', state.estQty + ' estampa' + (state.estQty>1?'s':''))
      ].concat(state.obs ? [row('Obs', state.obs)] : [])) +
      section('PRAZO E PAGAMENTO', [row('Prazo', '30-40 dias apos aprovacao'), row('Pagamento', 'A confirmar com o vendedor')]);

    document.getElementById('ppuf-review-content').innerHTML = html;
  }

  document.getElementById('ppuf-btn-5b').addEventListener('click', function(){ showStep(4); });

  document.getElementById('ppuf-btn-wa').addEventListener('click', function() {
    var LF = String.fromCharCode(10);
    var szLines = [];
    SN.concat(SP).forEach(function(s, i) {
      var lbl = i < 5 ? s : SPL[i-5];
      if (state.szU[s] > 0) szLines.push(lbl + ' Unissex x' + state.szU[s]);
      if (state.szB[s] > 0) szLines.push(lbl + ' Baby Look x' + state.szB[s]);
    });
    var extraEst = state.estQty > 1 ? ' (' + (state.estQty-1) + ' adicional(is) - confirmar com vendedor)' : ' (inclusa no kit)';
    var msg =
      'NOVO PEDIDO - PASSO A PASSO UNIFORMES' + LF + LF +
      'Kit: ' + kit.name + LF +
      'Pecas: ' + kit.qty + LF + LF +
      'DADOS DO CLIENTE' + LF +
      'Nome: ' + state.nome + LF +
      'WhatsApp: ' + state.tel + LF +
      (state.email ? 'E-mail: ' + state.email + LF : '') + LF +
      'CAMISETA' + LF +
      'Cor: ' + state.cor + LF + LF +
      'TAMANHOS' + LF +
      szLines.join(LF) + LF + LF +
      'ESTAMPAS' + LF +
      'Quantidade: ' + state.estQty + extraEst + LF +
      (state.obs ? 'Obs: ' + state.obs + LF : '') + LF +
      'OBS: O arquivo da arte sera enviado em seguida neste chat.' + LF + LF +
      'Prazo producao: 30-40 dias uteis' + LF +
      'Pagamento: a confirmar com o vendedor';

    window.open('https://wa.me/5551985600893?text=' + encodeURIComponent(msg), '_blank');
  });
});
</script>
<!-- /wp:html -->`;

async function updatePage() {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ content: html, status: 'publish' });
    const opts = {
      hostname: 'passoapassouniformes.com',
      path: '/wp-json/wp/v2/pages/86',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': NONCE,
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const j = JSON.parse(data);
          resolve({ status: res.statusCode, id: j.id, link: j.link, code: j.code });
        } catch(e) { resolve({ status: res.statusCode, raw: data.substring(0,300) }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

updatePage().then(r => console.log(JSON.stringify(r))).catch(e => console.error(e.message));
