(()=>{var e={};e.id=298,e.ids=[298],e.modules={7849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3122:e=>{"use strict";e.exports=require("undici")},6113:e=>{"use strict";e.exports=require("crypto")},3837:e=>{"use strict";e.exports=require("util")},6082:(e,s,a)=>{"use strict";a.r(s),a.d(s,{GlobalError:()=>l.a,__next_app__:()=>m,originalPathname:()=>x,pages:()=>c,routeModule:()=>h,tree:()=>d}),a(5870),a(2029),a(2523);var t=a(3191),i=a(8716),r=a(7922),l=a.n(r),n=a(5231),o={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>n[e]);a.d(s,o);let d=["",{children:["lista-tamanhos",{children:["[id]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(a.bind(a,5870)),"C:\\Users\\gusta\\OneDrive\\\xc1rea de Trabalho\\PassoaPasso\\pedidos\\src\\app\\lista-tamanhos\\[id]\\page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(a.bind(a,2029)),"C:\\Users\\gusta\\OneDrive\\\xc1rea de Trabalho\\PassoaPasso\\pedidos\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(a.bind(a,2523)),"C:\\Users\\gusta\\OneDrive\\\xc1rea de Trabalho\\PassoaPasso\\pedidos\\src\\app\\not-found.tsx"]}],c=["C:\\Users\\gusta\\OneDrive\\\xc1rea de Trabalho\\PassoaPasso\\pedidos\\src\\app\\lista-tamanhos\\[id]\\page.tsx"],x="/lista-tamanhos/[id]/page",m={require:a,loadChunk:()=>Promise.resolve()},h=new t.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/lista-tamanhos/[id]/page",pathname:"/lista-tamanhos/[id]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},828:(e,s,a)=>{Promise.resolve().then(a.bind(a,6800))},6333:(e,s,a)=>{"use strict";a.d(s,{Z:()=>t});/**
 * @license lucide-react v0.379.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let t=(0,a(2881).Z)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]])},3869:(e,s,a)=>{"use strict";a.d(s,{Z:()=>t});/**
 * @license lucide-react v0.379.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let t=(0,a(2881).Z)("Printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]])},6800:(e,s,a)=>{"use strict";a.d(s,{default:()=>m});var t=a(326),i=a(7577),r=a(5047);a(636);var l=a(3161),n=a(1223),o=a(6333),d=a(3869),c=a(434);let x={unissex:"Unissex",babylook:"Babylook",infantil:"Infantil"};function m(){let{id:e}=(0,r.useParams)(),[s,a]=(0,i.useState)(null),[m,h]=(0,i.useState)(!0);if(m)return t.jsx("div",{className:"min-h-screen flex items-center justify-center text-gray-400",children:"Carregando..."});if(!s)return t.jsx("div",{className:"min-h-screen flex items-center justify-center text-gray-400",children:"Pedido n\xe3o encontrado."});let p="empresa"===s.clienteType?s.clienteEmpresa?.razaoSocial||"—":s.clientePF?.nomeCompleto||"—",g=l.rn[s.modelo]?.label||s.modelo,b=l.rn[s.modelo]?.materiais[s.material]?.label||s.material,j="Personalizada"===s.cor?s.corPersonalizada:s.cor,f=s.modelos&&s.modelos.length>0?s.modelos.flatMap(e=>e.pecas||[]):s.pecas||[],u=f.reduce((e,s)=>e+s.precoUnitario,0),N=f.filter(e=>e.pessoaNome||e.nomeNaCamiseta||e.numeroNaCamiseta),v=N.length>0,y=f.reduce((e,s)=>{let a=`${x[s.categoria]||s.categoria} ${s.tamanho}`;return e[a]=(e[a]||0)+1,e},{});return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"no-print bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between",children:[(0,t.jsxs)(c.default,{href:`/pedido/${e}`,className:"flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-semibold",children:[t.jsx(o.Z,{size:16})," Voltar ao Pedido"]}),(0,t.jsxs)("button",{onClick:()=>window.print(),className:"flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-bold text-sm transition",children:[t.jsx(d.Z,{size:16})," Imprimir / Salvar PDF"]})]}),(0,t.jsxs)("div",{className:"lista-folha bg-white mx-auto my-6 shadow-lg print:shadow-none print:my-0",children:[(0,t.jsxs)("div",{className:"lista-header flex items-center justify-between pb-4 border-b-2 border-orange-500 mb-5",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[t.jsx("img",{src:n.oQ,alt:"Passo a Passo",style:{height:44}}),(0,t.jsxs)("div",{children:[t.jsx("div",{className:"text-xs text-gray-500 font-semibold uppercase tracking-wide",children:"Passo a Passo Uniformes"}),t.jsx("div",{className:"text-xs text-gray-400",children:"Lista de Tamanhos"})]})]}),(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsxs)("div",{className:"text-lg font-bold text-gray-900",children:["Pedido #",s.numeroPedido]}),(0,t.jsxs)("div",{className:"text-xs text-gray-500",children:["Emitido em: ",(0,n.f0)(new Date().toISOString().split("T")[0])]})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-3 gap-4 mb-5",children:[t.jsx("div",{className:"col-span-2",children:(0,t.jsxs)("div",{className:"lista-info-box",children:[t.jsx("p",{className:"lista-info-label",children:"Cliente"}),t.jsx("p",{className:"lista-info-value font-bold",children:p}),"empresa"===s.clienteType&&s.clienteEmpresa?.contato&&(0,t.jsxs)("p",{className:"lista-info-sub",children:["Contato: ",s.clienteEmpresa.contato]})]})}),t.jsx("div",{children:(0,t.jsxs)("div",{className:"lista-info-box",children:[t.jsx("p",{className:"lista-info-label",children:"Vendedor"}),t.jsx("p",{className:"lista-info-value",children:s.nomeVendedor})]})}),t.jsx("div",{children:(0,t.jsxs)("div",{className:"lista-info-box",children:[t.jsx("p",{className:"lista-info-label",children:"Produto"}),t.jsx("p",{className:"lista-info-value font-bold",children:g}),t.jsx("p",{className:"lista-info-sub",children:b})]})}),t.jsx("div",{children:(0,t.jsxs)("div",{className:"lista-info-box",children:[t.jsx("p",{className:"lista-info-label",children:"Cor"}),t.jsx("p",{className:"lista-info-value",children:j})]})}),t.jsx("div",{children:(0,t.jsxs)("div",{className:"lista-info-box",children:[t.jsx("p",{className:"lista-info-label",children:"Entrega Prevista"}),t.jsx("p",{className:"lista-info-value text-red-600 font-bold",children:(0,n.f0)(s.dataEntregaPrevista)})]})}),t.jsx("div",{children:(0,t.jsxs)("div",{className:"lista-info-box",children:[t.jsx("p",{className:"lista-info-label",children:"Qtd. Total"}),(0,t.jsxs)("p",{className:"lista-info-value font-bold",children:[s.quantidadeTotal," pe\xe7as"]})]})}),t.jsx("div",{children:(0,t.jsxs)("div",{className:"lista-info-box",children:[t.jsx("p",{className:"lista-info-label",children:"Pre\xe7o Base Unit."}),t.jsx("p",{className:"lista-info-value font-bold text-orange-600",children:(0,n.gH)(s.precoUnitario)})]})}),t.jsx("div",{children:(0,t.jsxs)("div",{className:"lista-info-box bg-orange-50 border-orange-200",children:[t.jsx("p",{className:"lista-info-label text-orange-700",children:"Total do Pedido"}),t.jsx("p",{className:"lista-info-value text-xl font-bold text-orange-600",children:(0,n.gH)(u)})]})})]}),f.some(e=>["XG","XXG","XXXG"].includes(e.tamanho))&&t.jsx("div",{className:"mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 font-semibold",children:"⚠️ Pe\xe7as nos tamanhos XG, XXG e XXXG t\xeam acr\xe9scimo de 30% no pre\xe7o unit\xe1rio."}),f.some(e=>"infantil"===e.categoria)&&t.jsx("div",{className:"mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800 font-semibold",children:"ℹ️ Pe\xe7as infantis t\xeam desconto de R$5,00 no pre\xe7o unit\xe1rio."}),(0,t.jsxs)("table",{className:"lista-tabela w-full mb-5",children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{className:"bg-orange-500 text-white",children:[t.jsx("th",{className:"lista-th text-center w-10",children:"#"}),t.jsx("th",{className:"lista-th",children:"Nome da Pessoa"}),t.jsx("th",{className:"lista-th",children:"Nome na Pe\xe7a"}),t.jsx("th",{className:"lista-th",children:"N\xba na Pe\xe7a"}),t.jsx("th",{className:"lista-th",children:"Categoria"}),t.jsx("th",{className:"lista-th text-center",children:"Tamanho"}),t.jsx("th",{className:"lista-th text-right",children:"Valor Unit."})]})}),t.jsx("tbody",{children:0===f.length?t.jsx("tr",{children:t.jsx("td",{colSpan:7,className:"text-center py-8 text-gray-400 text-sm",children:"Nenhuma pe\xe7a com tamanho preenchido."})}):f.map((e,s)=>(0,t.jsxs)("tr",{className:s%2==0?"bg-white":"bg-gray-50",children:[t.jsx("td",{className:"lista-td text-center text-gray-500",children:s+1}),t.jsx("td",{className:"lista-td font-medium",children:e.pessoaNome||"—"}),t.jsx("td",{className:"lista-td text-gray-600",children:e.nomeNaCamiseta||"—"}),t.jsx("td",{className:"lista-td text-center text-gray-600",children:e.numeroNaCamiseta||"—"}),t.jsx("td",{className:"lista-td",children:x[e.categoria]||e.categoria}),t.jsx("td",{className:"lista-td text-center font-bold",children:e.tamanho}),t.jsx("td",{className:"lista-td text-right font-semibold text-orange-700",children:(0,n.gH)(e.precoUnitario)})]},e.id))}),t.jsx("tfoot",{children:(0,t.jsxs)("tr",{className:"bg-gray-800 text-white",children:[(0,t.jsxs)("td",{colSpan:5,className:"lista-td font-bold text-right",children:["TOTAL — ",f.length," ",1===f.length?"pe\xe7a":"pe\xe7as"]}),t.jsx("td",{className:"lista-td"}),t.jsx("td",{className:"lista-td text-right font-bold text-lg",children:(0,n.gH)(u)})]})})]}),Object.keys(y).length>0&&(0,t.jsxs)("div",{className:"mb-5",children:[t.jsx("p",{className:"text-xs font-bold text-gray-500 uppercase tracking-widest mb-2",children:"Resumo por Tamanho"}),t.jsx("div",{className:"flex flex-wrap gap-2",children:Object.entries(y).map(([e,s])=>(0,t.jsxs)("div",{className:"px-3 py-1.5 bg-orange-500 text-white rounded text-xs font-bold",children:[e,": ",s," ",1===s?"pe\xe7a":"pe\xe7as"]},e))})]}),(0,t.jsxs)("div",{className:"border-t border-gray-200 pt-4 flex items-end justify-between",children:[(0,t.jsxs)("div",{className:"text-xs text-gray-400",children:[t.jsx("p",{children:"Passo a Passo Uniformes — Sistema de Pedidos"}),(0,t.jsxs)("p",{children:["Documento gerado em: ",new Date().toLocaleString("pt-BR")]})]}),(0,t.jsxs)("div",{className:"text-xs text-gray-400 text-right",children:[(0,t.jsxs)("p",{children:["Pedido #",s.numeroPedido]}),(0,t.jsxs)("p",{children:["Vendedor: ",s.nomeVendedor]})]})]})]}),v&&(0,t.jsxs)("div",{className:"lista-folha-paisagem bg-white print:shadow-none",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between pb-3 border-b-2 border-orange-500 mb-4",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[t.jsx("img",{src:n.oQ,alt:"Passo a Passo",style:{height:36}}),(0,t.jsxs)("div",{children:[t.jsx("div",{className:"text-xs text-gray-500 font-semibold uppercase tracking-wide",children:"Passo a Passo Uniformes"}),t.jsx("div",{className:"text-xs text-gray-400 font-bold text-orange-600",children:"Folha de Personaliza\xe7\xf5es"})]})]}),(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsxs)("div",{className:"text-base font-bold text-gray-900",children:["Pedido #",s.numeroPedido]}),t.jsx("div",{className:"text-xs text-gray-500",children:p}),(0,t.jsxs)("div",{className:"text-xs text-red-600 font-bold",children:["Entrega: ",(0,n.f0)(s.dataEntregaPrevista)]})]})]}),(0,t.jsxs)("table",{className:"lista-tabela w-full mb-4",style:{fontSize:11},children:[t.jsx("thead",{children:(0,t.jsxs)("tr",{className:"bg-orange-500 text-white",children:[t.jsx("th",{className:"lista-th text-center w-8",children:"#"}),t.jsx("th",{className:"lista-th",children:"Quem vai usar"}),t.jsx("th",{className:"lista-th",children:"Nome na pe\xe7a"}),t.jsx("th",{className:"lista-th text-center",children:"N\xba na pe\xe7a"}),t.jsx("th",{className:"lista-th text-center",children:"Tamanho"}),t.jsx("th",{className:"lista-th",children:"Observa\xe7\xe3o da pe\xe7a"}),t.jsx("th",{className:"lista-th text-right",children:"Ajuste (R$)"})]})}),t.jsx("tbody",{children:N.map((e,s)=>{let a=e.ajustePreco??0;return(0,t.jsxs)("tr",{className:s%2==0?"bg-white":"bg-gray-50",children:[t.jsx("td",{className:"lista-td text-center text-gray-500",children:s+1}),t.jsx("td",{className:"lista-td font-semibold",children:e.pessoaNome||"—"}),t.jsx("td",{className:"lista-td font-bold text-orange-700",children:e.nomeNaCamiseta||"—"}),t.jsx("td",{className:"lista-td text-center font-bold",children:e.numeroNaCamiseta||"—"}),(0,t.jsxs)("td",{className:"lista-td text-center font-bold",children:[x[e.categoria]||e.categoria," ",e.tamanho]}),t.jsx("td",{className:"lista-td text-gray-600 text-xs",children:e.infoExtra||"—"}),t.jsx("td",{className:`lista-td text-right font-bold ${a>0?"text-green-700":a<0?"text-red-600":"text-gray-400"}`,children:0===a?"—":a>0?`+R$ ${a.toFixed(2)}`:`-R$ ${Math.abs(a).toFixed(2)}`})]},e.id)})}),t.jsx("tfoot",{children:(0,t.jsxs)("tr",{className:"bg-gray-100",children:[(0,t.jsxs)("td",{colSpan:6,className:"lista-td text-right font-bold text-gray-600",children:["Total de pe\xe7as personalizadas: ",N.length]}),t.jsx("td",{className:"lista-td text-right font-bold text-gray-800",children:(()=>{let e=N.reduce((e,s)=>e+(s.ajustePreco??0),0);return 0===e?"—":e>0?`+R$ ${e.toFixed(2)}`:`-R$ ${Math.abs(e).toFixed(2)}`})()})]})})]}),s.observacao&&(0,t.jsxs)("div",{className:"mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded",children:[t.jsx("p",{className:"text-xs font-bold text-amber-700 uppercase tracking-wide mb-1",children:"Observa\xe7\xf5es do Pedido"}),t.jsx("p",{className:"text-sm text-amber-900 leading-relaxed",children:s.observacao})]}),null!=s.valorNegociacao&&0!==s.valorNegociacao&&(0,t.jsxs)("div",{className:"mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded",children:[t.jsx("p",{className:"text-xs font-bold text-blue-700 uppercase tracking-wide mb-1",children:"Negocia\xe7\xe3o / Ajuste Geral"}),t.jsx("p",{className:"text-sm text-blue-900 font-bold",children:(s.valorNegociacao??0)>0?`Acr\xe9scimo: +R$ ${(s.valorNegociacao??0).toFixed(2)}`:`Desconto: -R$ ${Math.abs(s.valorNegociacao??0).toFixed(2)}`}),s.descricaoNegociacao&&t.jsx("p",{className:"text-xs text-blue-700 mt-1",children:s.descricaoNegociacao})]}),(0,t.jsxs)("div",{className:"border-t border-gray-200 pt-3 flex items-end justify-between mt-auto",children:[(0,t.jsxs)("div",{className:"text-xs text-gray-400",children:[t.jsx("p",{children:"Passo a Passo Uniformes — Folha de Personaliza\xe7\xf5es"}),(0,t.jsxs)("p",{children:["Gerado em: ",new Date().toLocaleString("pt-BR")]})]}),t.jsx("div",{className:"text-xs text-gray-400 text-right",children:(0,t.jsxs)("p",{children:["Pedido #",s.numeroPedido," \xb7 Vendedor: ",s.nomeVendedor]})})]})]}),t.jsx("style",{children:`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; background: white; }
          .lista-folha {
            margin: 0;
            box-shadow: none;
            width: 100%;
            max-width: 100%;
          }
          .lista-folha-paisagem {
            page: paisagem;
            margin: 0;
            box-shadow: none;
            width: 100%;
            max-width: 100%;
            page-break-before: always;
          }
        }

        @page paisagem {
          size: A4 landscape;
          margin: 16mm 18mm;
        }

        .lista-folha {
          max-width: 900px;
          padding: 32px 36px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .lista-folha-paisagem {
          max-width: 1100px;
          padding: 28px 32px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          margin: 24px auto;
          display: flex;
          flex-direction: column;
          min-height: 580px;
        }

        .lista-info-box {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 12px;
          height: 100%;
        }

        .lista-info-label {
          font-size: 10px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 2px;
        }

        .lista-info-value {
          font-size: 13px;
          color: #111827;
        }

        .lista-info-sub {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 2px;
        }

        .lista-tabela {
          border-collapse: collapse;
          font-size: 12px;
        }

        .lista-th {
          padding: 8px 10px;
          font-size: 11px;
          font-weight: 700;
          text-align: left;
          letter-spacing: 0.03em;
        }

        .lista-td {
          padding: 7px 10px;
          font-size: 12px;
          border-bottom: 1px solid #f3f4f6;
          color: #111827;
        }
      `})]})}},5870:(e,s,a)=>{"use strict";a.r(s),a.d(s,{default:()=>n,dynamic:()=>o,generateStaticParams:()=>d});var t=a(8570);let i=(0,t.createProxy)(String.raw`C:\Users\gusta\OneDrive\Área de Trabalho\PassoaPasso\pedidos\src\app\lista-tamanhos\[id]\client.tsx`),{__esModule:r,$$typeof:l}=i;i.default;let n=(0,t.createProxy)(String.raw`C:\Users\gusta\OneDrive\Área de Trabalho\PassoaPasso\pedidos\src\app\lista-tamanhos\[id]\client.tsx#default`),o="force-static";async function d(){return[{id:"__placeholder__"}]}}};var s=require("../../../webpack-runtime.js");s.C(e);var a=e=>s(s.s=e),t=s.X(0,[449,814,434,224],()=>a(6082));module.exports=t})();