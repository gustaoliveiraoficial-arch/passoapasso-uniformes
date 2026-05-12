(()=>{var e={};e.id=298,e.ids=[298],e.modules={7849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3122:e=>{"use strict";e.exports=require("undici")},6113:e=>{"use strict";e.exports=require("crypto")},3837:e=>{"use strict";e.exports=require("util")},7620:(e,s,t)=>{"use strict";t.r(s),t.d(s,{GlobalError:()=>l.a,__next_app__:()=>m,originalPathname:()=>x,pages:()=>c,routeModule:()=>h,tree:()=>d}),t(721),t(2029),t(5866);var a=t(3191),i=t(8716),r=t(7922),l=t.n(r),n=t(5231),o={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>n[e]);t.d(s,o);let d=["",{children:["lista-tamanhos",{children:["[id]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,721)),"C:\\Users\\gusta\\OneDrive\\\xc1rea de Trabalho\\PassoaPasso\\pedidos\\src\\app\\lista-tamanhos\\[id]\\page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(t.bind(t,2029)),"C:\\Users\\gusta\\OneDrive\\\xc1rea de Trabalho\\PassoaPasso\\pedidos\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(t.t.bind(t,5866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\gusta\\OneDrive\\\xc1rea de Trabalho\\PassoaPasso\\pedidos\\src\\app\\lista-tamanhos\\[id]\\page.tsx"],x="/lista-tamanhos/[id]/page",m={require:t,loadChunk:()=>Promise.resolve()},h=new a.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/lista-tamanhos/[id]/page",pathname:"/lista-tamanhos/[id]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},8035:(e,s,t)=>{Promise.resolve().then(t.bind(t,7219))},6333:(e,s,t)=>{"use strict";t.d(s,{Z:()=>a});/**
 * @license lucide-react v0.379.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,t(2881).Z)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]])},3869:(e,s,t)=>{"use strict";t.d(s,{Z:()=>a});/**
 * @license lucide-react v0.379.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,t(2881).Z)("Printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]])},7219:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>m});var a=t(326),i=t(7577),r=t(5047);t(636);var l=t(3161),n=t(1223),o=t(6333),d=t(3869),c=t(434);let x={unissex:"Unissex",babylook:"Babylook",infantil:"Infantil"};function m(){let{id:e}=(0,r.useParams)(),[s,t]=(0,i.useState)(null),[m,h]=(0,i.useState)(!0);if(m)return a.jsx("div",{className:"min-h-screen flex items-center justify-center text-gray-400",children:"Carregando..."});if(!s)return a.jsx("div",{className:"min-h-screen flex items-center justify-center text-gray-400",children:"Pedido n\xe3o encontrado."});let p="empresa"===s.clienteType?s.clienteEmpresa?.razaoSocial||"—":s.clientePF?.nomeCompleto||"—",g=l.r[s.modelo]?.label||s.modelo,b=l.r[s.modelo]?.materiais[s.material]?.label||s.material,u="Personalizada"===s.cor?s.corPersonalizada:s.cor,f=s.pecas||[],j=f.reduce((e,s)=>e+s.precoUnitario,0),N=f.reduce((e,s)=>{let t=`${x[s.categoria]||s.categoria} ${s.tamanho}`;return e[t]=(e[t]||0)+1,e},{});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("div",{className:"no-print bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between",children:[(0,a.jsxs)(c.default,{href:`/pedido/${e}`,className:"flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-semibold",children:[a.jsx(o.Z,{size:16})," Voltar ao Pedido"]}),(0,a.jsxs)("button",{onClick:()=>window.print(),className:"flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-bold text-sm transition",children:[a.jsx(d.Z,{size:16})," Imprimir / Salvar PDF"]})]}),(0,a.jsxs)("div",{className:"lista-folha bg-white mx-auto my-6 shadow-lg print:shadow-none print:my-0",children:[(0,a.jsxs)("div",{className:"lista-header flex items-center justify-between pb-4 border-b-2 border-orange-500 mb-5",children:[(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[a.jsx("img",{src:"/logo-pap.png",alt:"Passo a Passo",style:{height:44}}),(0,a.jsxs)("div",{children:[a.jsx("div",{className:"text-xs text-gray-500 font-semibold uppercase tracking-wide",children:"Passo a Passo Uniformes"}),a.jsx("div",{className:"text-xs text-gray-400",children:"Lista de Tamanhos"})]})]}),(0,a.jsxs)("div",{className:"text-right",children:[(0,a.jsxs)("div",{className:"text-lg font-bold text-gray-900",children:["Pedido #",s.numeroPedido]}),(0,a.jsxs)("div",{className:"text-xs text-gray-500",children:["Emitido em: ",(0,n.f0)(new Date().toISOString().split("T")[0])]})]})]}),(0,a.jsxs)("div",{className:"grid grid-cols-3 gap-4 mb-5",children:[a.jsx("div",{className:"col-span-2",children:(0,a.jsxs)("div",{className:"lista-info-box",children:[a.jsx("p",{className:"lista-info-label",children:"Cliente"}),a.jsx("p",{className:"lista-info-value font-bold",children:p}),"empresa"===s.clienteType&&s.clienteEmpresa?.contato&&(0,a.jsxs)("p",{className:"lista-info-sub",children:["Contato: ",s.clienteEmpresa.contato]})]})}),a.jsx("div",{children:(0,a.jsxs)("div",{className:"lista-info-box",children:[a.jsx("p",{className:"lista-info-label",children:"Vendedor"}),a.jsx("p",{className:"lista-info-value",children:s.nomeVendedor})]})}),a.jsx("div",{children:(0,a.jsxs)("div",{className:"lista-info-box",children:[a.jsx("p",{className:"lista-info-label",children:"Produto"}),a.jsx("p",{className:"lista-info-value font-bold",children:g}),a.jsx("p",{className:"lista-info-sub",children:b})]})}),a.jsx("div",{children:(0,a.jsxs)("div",{className:"lista-info-box",children:[a.jsx("p",{className:"lista-info-label",children:"Cor"}),a.jsx("p",{className:"lista-info-value",children:u})]})}),a.jsx("div",{children:(0,a.jsxs)("div",{className:"lista-info-box",children:[a.jsx("p",{className:"lista-info-label",children:"Entrega Prevista"}),a.jsx("p",{className:"lista-info-value text-red-600 font-bold",children:(0,n.f0)(s.dataEntregaPrevista)})]})}),a.jsx("div",{children:(0,a.jsxs)("div",{className:"lista-info-box",children:[a.jsx("p",{className:"lista-info-label",children:"Qtd. Total"}),(0,a.jsxs)("p",{className:"lista-info-value font-bold",children:[s.quantidadeTotal," pe\xe7as"]})]})}),a.jsx("div",{children:(0,a.jsxs)("div",{className:"lista-info-box",children:[a.jsx("p",{className:"lista-info-label",children:"Pre\xe7o Base Unit."}),a.jsx("p",{className:"lista-info-value font-bold text-orange-600",children:(0,n.gH)(s.precoUnitario)})]})}),a.jsx("div",{children:(0,a.jsxs)("div",{className:"lista-info-box bg-orange-50 border-orange-200",children:[a.jsx("p",{className:"lista-info-label text-orange-700",children:"Total do Pedido"}),a.jsx("p",{className:"lista-info-value text-xl font-bold text-orange-600",children:(0,n.gH)(j)})]})})]}),f.some(e=>["XG","XXG","XXXG"].includes(e.tamanho))&&a.jsx("div",{className:"mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 font-semibold",children:"⚠️ Pe\xe7as nos tamanhos XG, XXG e XXXG t\xeam acr\xe9scimo de 30% no pre\xe7o unit\xe1rio."}),f.some(e=>"infantil"===e.categoria)&&a.jsx("div",{className:"mb-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800 font-semibold",children:"ℹ️ Pe\xe7as infantis t\xeam desconto de R$5,00 no pre\xe7o unit\xe1rio."}),(0,a.jsxs)("table",{className:"lista-tabela w-full mb-5",children:[a.jsx("thead",{children:(0,a.jsxs)("tr",{className:"bg-orange-500 text-white",children:[a.jsx("th",{className:"lista-th text-center w-10",children:"#"}),a.jsx("th",{className:"lista-th",children:"Nome da Pessoa"}),a.jsx("th",{className:"lista-th",children:"Nome na Pe\xe7a"}),a.jsx("th",{className:"lista-th",children:"N\xba na Pe\xe7a"}),a.jsx("th",{className:"lista-th",children:"Categoria"}),a.jsx("th",{className:"lista-th text-center",children:"Tamanho"}),a.jsx("th",{className:"lista-th text-right",children:"Valor Unit."})]})}),a.jsx("tbody",{children:0===f.length?a.jsx("tr",{children:a.jsx("td",{colSpan:7,className:"text-center py-8 text-gray-400 text-sm",children:"Nenhuma pe\xe7a com tamanho preenchido."})}):f.map((e,s)=>(0,a.jsxs)("tr",{className:s%2==0?"bg-white":"bg-gray-50",children:[a.jsx("td",{className:"lista-td text-center text-gray-500",children:s+1}),a.jsx("td",{className:"lista-td font-medium",children:e.pessoaNome||"—"}),a.jsx("td",{className:"lista-td text-gray-600",children:e.nomeNaCamiseta||"—"}),a.jsx("td",{className:"lista-td text-center text-gray-600",children:e.numeroNaCamiseta||"—"}),a.jsx("td",{className:"lista-td",children:x[e.categoria]||e.categoria}),a.jsx("td",{className:"lista-td text-center font-bold",children:e.tamanho}),a.jsx("td",{className:"lista-td text-right font-semibold text-orange-700",children:(0,n.gH)(e.precoUnitario)})]},e.id))}),a.jsx("tfoot",{children:(0,a.jsxs)("tr",{className:"bg-gray-800 text-white",children:[(0,a.jsxs)("td",{colSpan:5,className:"lista-td font-bold text-right",children:["TOTAL — ",f.length," ",1===f.length?"pe\xe7a":"pe\xe7as"]}),a.jsx("td",{className:"lista-td"}),a.jsx("td",{className:"lista-td text-right font-bold text-lg",children:(0,n.gH)(j)})]})})]}),Object.keys(N).length>0&&(0,a.jsxs)("div",{className:"mb-5",children:[a.jsx("p",{className:"text-xs font-bold text-gray-500 uppercase tracking-widest mb-2",children:"Resumo por Tamanho"}),a.jsx("div",{className:"flex flex-wrap gap-2",children:Object.entries(N).map(([e,s])=>(0,a.jsxs)("div",{className:"px-3 py-1.5 bg-orange-500 text-white rounded text-xs font-bold",children:[e,": ",s," ",1===s?"pe\xe7a":"pe\xe7as"]},e))})]}),(0,a.jsxs)("div",{className:"border-t border-gray-200 pt-4 flex items-end justify-between",children:[(0,a.jsxs)("div",{className:"text-xs text-gray-400",children:[a.jsx("p",{children:"Passo a Passo Uniformes — Sistema de Pedidos"}),(0,a.jsxs)("p",{children:["Documento gerado em: ",new Date().toLocaleString("pt-BR")]})]}),(0,a.jsxs)("div",{className:"text-xs text-gray-400 text-right",children:[(0,a.jsxs)("p",{children:["Pedido #",s.numeroPedido]}),(0,a.jsxs)("p",{children:["Vendedor: ",s.nomeVendedor]})]})]})]}),a.jsx("style",{children:`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; background: white; }
          .lista-folha {
            margin: 0;
            box-shadow: none;
            width: 100%;
            max-width: 100%;
          }
        }

        .lista-folha {
          max-width: 900px;
          padding: 32px 36px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
      `})]})}},721:(e,s,t)=>{"use strict";t.r(s),t.d(s,{$$typeof:()=>l,__esModule:()=>r,default:()=>n});var a=t(8570);let i=(0,a.createProxy)(String.raw`C:\Users\gusta\OneDrive\Área de Trabalho\PassoaPasso\pedidos\src\app\lista-tamanhos\[id]\page.tsx`),{__esModule:r,$$typeof:l}=i;i.default;let n=(0,a.createProxy)(String.raw`C:\Users\gusta\OneDrive\Área de Trabalho\PassoaPasso\pedidos\src\app\lista-tamanhos\[id]\page.tsx#default`)}};var s=require("../../../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),a=s.X(0,[44,630,434,539],()=>t(7620));module.exports=a})();