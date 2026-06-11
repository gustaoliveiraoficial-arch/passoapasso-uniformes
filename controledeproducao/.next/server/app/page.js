(()=>{var e={};e.id=931,e.ids=[931],e.modules={7849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3824:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>a.a,__next_app__:()=>h,originalPathname:()=>d,pages:()=>c,routeModule:()=>f,tree:()=>u}),r(5480),r(2029),r(5866);var n=r(3191),i=r(8716),s=r(7922),a=r.n(s),o=r(5231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);r.d(t,l);let u=["",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,5480)),"C:\\Users\\gusta\\OneDrive\\\xc1rea de Trabalho\\PassoaPasso\\controledeproducao\\src\\app\\page.tsx"]}]},{layout:[()=>Promise.resolve().then(r.bind(r,2029)),"C:\\Users\\gusta\\OneDrive\\\xc1rea de Trabalho\\PassoaPasso\\controledeproducao\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,5866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\gusta\\OneDrive\\\xc1rea de Trabalho\\PassoaPasso\\controledeproducao\\src\\app\\page.tsx"],d="/page",h={require:r,loadChunk:()=>Promise.resolve()},f=new n.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/page",pathname:"/",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:u}})},6780:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,2994,23)),Promise.resolve().then(r.t.bind(r,6114,23)),Promise.resolve().then(r.t.bind(r,9727,23)),Promise.resolve().then(r.t.bind(r,9671,23)),Promise.resolve().then(r.t.bind(r,1868,23)),Promise.resolve().then(r.t.bind(r,4759,23))},5343:()=>{},709:(e,t,r)=>{Promise.resolve().then(r.bind(r,3721))},3721:(e,t,r)=>{"use strict";let n,i,s;r.r(t),r.d(t,{default:()=>iJ});var a,o,l,u=r(326),c=r(7577);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let d=function(e){let t=[],r=0;for(let n=0;n<e.length;n++){let i=e.charCodeAt(n);i<128?t[r++]=i:(i<2048?t[r++]=i>>6|192:((64512&i)==55296&&n+1<e.length&&(64512&e.charCodeAt(n+1))==56320?(i=65536+((1023&i)<<10)+(1023&e.charCodeAt(++n)),t[r++]=i>>18|240,t[r++]=i>>12&63|128):t[r++]=i>>12|224,t[r++]=i>>6&63|128),t[r++]=63&i|128)}return t},h=function(e){let t=[],r=0,n=0;for(;r<e.length;){let i=e[r++];if(i<128)t[n++]=String.fromCharCode(i);else if(i>191&&i<224){let s=e[r++];t[n++]=String.fromCharCode((31&i)<<6|63&s)}else if(i>239&&i<365){let s=((7&i)<<18|(63&e[r++])<<12|(63&e[r++])<<6|63&e[r++])-65536;t[n++]=String.fromCharCode(55296+(s>>10)),t[n++]=String.fromCharCode(56320+(1023&s))}else{let s=e[r++],a=e[r++];t[n++]=String.fromCharCode((15&i)<<12|(63&s)<<6|63&a)}}return t.join("")},f={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();let r=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let t=0;t<e.length;t+=3){let i=e[t],s=t+1<e.length,a=s?e[t+1]:0,o=t+2<e.length,l=o?e[t+2]:0,u=i>>2,c=(3&i)<<4|a>>4,d=(15&a)<<2|l>>6,h=63&l;o||(h=64,s||(d=64)),n.push(r[u],r[c],r[d],r[h])}return n.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(d(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):h(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();let r=t?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let t=0;t<e.length;){let i=r[e.charAt(t++)],s=t<e.length?r[e.charAt(t)]:0,a=++t<e.length?r[e.charAt(t)]:64,o=++t<e.length?r[e.charAt(t)]:64;if(++t,null==i||null==s||null==a||null==o)throw new p;let l=i<<2|s>>4;if(n.push(l),64!==a){let e=s<<4&240|a>>2;if(n.push(e),64!==o){let e=a<<6&192|o;n.push(e)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class p extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}let m=function(e){let t=d(e);return f.encodeByteArray(t,!0)},g=function(e){return m(e).replace(/\./g,"")},y=function(e){try{return f.decodeString(e,!0)}catch(e){console.error("base64Decode failed: ",e)}return null},b=()=>/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw Error("Unable to locate global object.")})().__FIREBASE_DEFAULTS__,v=()=>{if("undefined"==typeof process||void 0===process.env)return;let e=process.env.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},x=()=>{let e;if("undefined"==typeof document)return;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(e){return}let t=e&&y(e[1]);return t&&JSON.parse(t)},w=()=>{try{return b()||v()||x()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},_=e=>{var t,r;return null===(r=null===(t=w())||void 0===t?void 0:t.emulatorHosts)||void 0===r?void 0:r[e]},E=e=>{let t=_(e);if(!t)return;let r=t.lastIndexOf(":");if(r<=0||r+1===t.length)throw Error(`Invalid host ${t} with no separate hostname and port!`);let n=parseInt(t.substring(r+1),10);return"["===t[0]?[t.substring(1,r-1),n]:[t.substring(0,r),n]},N=()=>{var e;return null===(e=w())||void 0===e?void 0:e.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class I{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,r))}}}class A extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name="FirebaseError",Object.setPrototypeOf(this,A.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,T.prototype.create)}}class T{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){let r=t[0]||{},n=`${this.service}/${e}`,i=this.errors[e],s=i?i.replace(S,(e,t)=>{let n=r[t];return null!=n?String(n):`<${t}?>`}):"Error",a=`${this.serviceName}: ${s} (${n}).`;return new A(n,a,r)}}let S=/\{\$([^}]+)}/g;function D(e,t){if(e===t)return!0;let r=Object.keys(e),n=Object.keys(t);for(let i of r){if(!n.includes(i))return!1;let r=e[i],s=t[i];if(k(r)&&k(s)){if(!D(r,s))return!1}else if(r!==s)return!1}for(let e of n)if(!r.includes(e))return!1;return!0}function k(e){return null!==e&&"object"==typeof e}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function P(e){return e&&e._delegate?e._delegate:e}class C{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let j="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let e=new I;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{let r=this.getOrInitializeService({instanceIdentifier:t});r&&e.resolve(r)}catch(e){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;let r=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),n=null!==(t=null==e?void 0:e.optional)&&void 0!==t&&t;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(e){if(n)return null;throw e}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if("EAGER"===e.instantiationMode)try{this.getOrInitializeService({instanceIdentifier:j})}catch(e){}for(let[e,t]of this.instancesDeferred.entries()){let r=this.normalizeInstanceIdentifier(e);try{let e=this.getOrInitializeService({instanceIdentifier:r});t.resolve(e)}catch(e){}}}}clearInstance(e=j){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=j){return this.instances.has(e)}getOptions(e=j){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let n=this.getOrInitializeService({instanceIdentifier:r,options:t});for(let[e,t]of this.instancesDeferred.entries())r===this.normalizeInstanceIdentifier(e)&&t.resolve(n);return n}onInit(e,t){var r;let n=this.normalizeInstanceIdentifier(t),i=null!==(r=this.onInitCallbacks.get(n))&&void 0!==r?r:new Set;i.add(e),this.onInitCallbacks.set(n,i);let s=this.instances.get(n);return s&&e(s,n),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){let r=this.onInitCallbacks.get(t);if(r)for(let n of r)try{n(e,t)}catch(e){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:e===j?void 0:e,options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch(e){}return r||null}normalizeInstanceIdentifier(e=j){return this.component?this.component.multipleInstances?e:j:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class R{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new V(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let O=[];!function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"}(o||(o={}));let L={debug:o.DEBUG,verbose:o.VERBOSE,info:o.INFO,warn:o.WARN,error:o.ERROR,silent:o.SILENT},F=o.INFO,M={[o.DEBUG]:"log",[o.VERBOSE]:"log",[o.INFO]:"info",[o.WARN]:"warn",[o.ERROR]:"error"},U=(e,t,...r)=>{if(t<e.logLevel)return;let n=new Date().toISOString(),i=M[t];if(i)console[i](`[${n}]  ${e.name}:`,...r);else throw Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class ${constructor(e){this.name=e,this._logLevel=F,this._logHandler=U,this._userLogHandler=null,O.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in o))throw TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?L[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,o.DEBUG,...e),this._logHandler(this,o.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,o.VERBOSE,...e),this._logHandler(this,o.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,o.INFO,...e),this._logHandler(this,o.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,o.WARN,...e),this._logHandler(this,o.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,o.ERROR,...e),this._logHandler(this,o.ERROR,...e)}}let B=(e,t)=>t.some(t=>e instanceof t),z=new WeakMap,q=new WeakMap,G=new WeakMap,H=new WeakMap,K=new WeakMap,W={get(e,t,r){if(e instanceof IDBTransaction){if("done"===t)return q.get(e);if("objectStoreNames"===t)return e.objectStoreNames||G.get(e);if("store"===t)return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return Q(e[t])},set:(e,t,r)=>(e[t]=r,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function Q(e){var t;if(e instanceof IDBRequest)return function(e){let t=new Promise((t,r)=>{let n=()=>{e.removeEventListener("success",i),e.removeEventListener("error",s)},i=()=>{t(Q(e.result)),n()},s=()=>{r(e.error),n()};e.addEventListener("success",i),e.addEventListener("error",s)});return t.then(t=>{t instanceof IDBCursor&&z.set(t,e)}).catch(()=>{}),K.set(t,e),t}(e);if(H.has(e))return H.get(e);let r="function"==typeof(t=e)?t!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(i||(i=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(t)?function(...e){return t.apply(Y(this),e),Q(z.get(this))}:function(...e){return Q(t.apply(Y(this),e))}:function(e,...r){let n=t.call(Y(this),e,...r);return G.set(n,e.sort?e.sort():[e]),Q(n)}:(t instanceof IDBTransaction&&function(e){if(q.has(e))return;let t=new Promise((t,r)=>{let n=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",s),e.removeEventListener("abort",s)},i=()=>{t(),n()},s=()=>{r(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",i),e.addEventListener("error",s),e.addEventListener("abort",s)});q.set(e,t)}(t),B(t,n||(n=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])))?new Proxy(t,W):t;return r!==e&&(H.set(e,r),K.set(r,e)),r}let Y=e=>K.get(e),J=["get","getKey","getAll","getAllKeys","count"],X=["put","add","delete","clear"],Z=new Map;function ee(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&"string"==typeof t))return;if(Z.get(t))return Z.get(t);let r=t.replace(/FromIndex$/,""),n=t!==r,i=X.includes(r);if(!(r in(n?IDBIndex:IDBObjectStore).prototype)||!(i||J.includes(r)))return;let s=async function(e,...t){let s=this.transaction(e,i?"readwrite":"readonly"),a=s.store;return n&&(a=a.index(t.shift())),(await Promise.all([a[r](...t),i&&s.done]))[0]};return Z.set(t,s),s}W={...s=W,get:(e,t,r)=>ee(e,t)||s.get(e,t,r),has:(e,t)=>!!ee(e,t)||s.has(e,t)};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(!function(e){let t=e.getComponent();return(null==t?void 0:t.type)==="VERSION"}(e))return null;{let t=e.getImmediate();return`${t.library}/${t.version}`}}).filter(e=>e).join(" ")}}let er="@firebase/app",en="0.10.13",ei=new $("@firebase/app"),es="[DEFAULT]",ea={[er]:"fire-core","@firebase/app-compat":"fire-core-compat","@firebase/analytics":"fire-analytics","@firebase/analytics-compat":"fire-analytics-compat","@firebase/app-check":"fire-app-check","@firebase/app-check-compat":"fire-app-check-compat","@firebase/auth":"fire-auth","@firebase/auth-compat":"fire-auth-compat","@firebase/database":"fire-rtdb","@firebase/data-connect":"fire-data-connect","@firebase/database-compat":"fire-rtdb-compat","@firebase/functions":"fire-fn","@firebase/functions-compat":"fire-fn-compat","@firebase/installations":"fire-iid","@firebase/installations-compat":"fire-iid-compat","@firebase/messaging":"fire-fcm","@firebase/messaging-compat":"fire-fcm-compat","@firebase/performance":"fire-perf","@firebase/performance-compat":"fire-perf-compat","@firebase/remote-config":"fire-rc","@firebase/remote-config-compat":"fire-rc-compat","@firebase/storage":"fire-gcs","@firebase/storage-compat":"fire-gcs-compat","@firebase/firestore":"fire-fst","@firebase/firestore-compat":"fire-fst-compat","@firebase/vertexai-preview":"fire-vertex","fire-js":"fire-js",firebase:"fire-js-all"},eo=new Map,el=new Map,eu=new Map;function ec(e,t){try{e.container.addComponent(t)}catch(r){ei.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,r)}}function ed(e){let t=e.name;if(eu.has(t))return ei.debug(`There were multiple attempts to register component ${t}.`),!1;for(let r of(eu.set(t,e),eo.values()))ec(r,e);for(let t of el.values())ec(t,e);return!0}let eh=new T("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ef{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new C("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw eh.create("app-deleted",{appName:this._name})}}function ep(e,t={}){let r=e;"object"!=typeof t&&(t={name:t});let n=Object.assign({name:es,automaticDataCollectionEnabled:!1},t),i=n.name;if("string"!=typeof i||!i)throw eh.create("bad-app-name",{appName:String(i)});if(r||(r=N()),!r)throw eh.create("no-options");let s=eo.get(i);if(s){if(D(r,s.options)&&D(n,s.config))return s;throw eh.create("duplicate-app",{appName:i})}let a=new R(i);for(let e of eu.values())a.addComponent(e);let o=new ef(r,n,a);return eo.set(i,o),o}function em(){return Array.from(eo.values())}function eg(e,t,r){var n;let i=null!==(n=ea[e])&&void 0!==n?n:e;r&&(i+=`-${r}`);let s=i.match(/\s|\//),a=t.match(/\s|\//);if(s||a){let e=[`Unable to register library "${i}" with version "${t}":`];s&&e.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&a&&e.push("and"),a&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),ei.warn(e.join(" "));return}ed(new C(`${i}-version`,()=>({library:i,version:t}),"VERSION"))}let ey="firebase-heartbeat-store",eb=null;function ev(){return eb||(eb=(function(e,t,{blocked:r,upgrade:n,blocking:i,terminated:s}={}){let a=indexedDB.open(e,1),o=Q(a);return n&&a.addEventListener("upgradeneeded",e=>{n(Q(a.result),e.oldVersion,e.newVersion,Q(a.transaction),e)}),r&&a.addEventListener("blocked",e=>r(e.oldVersion,e.newVersion,e)),o.then(e=>{s&&e.addEventListener("close",()=>s()),i&&e.addEventListener("versionchange",e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),o})("firebase-heartbeat-database",0,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore(ey)}catch(e){console.warn(e)}}}).catch(e=>{throw eh.create("idb-open",{originalErrorMessage:e.message})})),eb}async function ex(e){try{let t=(await ev()).transaction(ey),r=await t.objectStore(ey).get(e_(e));return await t.done,r}catch(e){if(e instanceof A)ei.warn(e.message);else{let t=eh.create("idb-get",{originalErrorMessage:null==e?void 0:e.message});ei.warn(t.message)}}}async function ew(e,t){try{let r=(await ev()).transaction(ey,"readwrite"),n=r.objectStore(ey);await n.put(t,e_(e)),await r.done}catch(e){if(e instanceof A)ei.warn(e.message);else{let t=eh.create("idb-set",{originalErrorMessage:null==e?void 0:e.message});ei.warn(t.message)}}}function e_(e){return`${e.name}!${e.options.appId}`}class eE{constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider("app").getImmediate();this._storage=new eI(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){var e,t;try{let r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),n=eN();if((null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,(null===(t=this._heartbeatsCache)||void 0===t?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===n||this._heartbeatsCache.heartbeats.some(e=>e.date===n))return;return this._heartbeatsCache.heartbeats.push({date:n,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(e=>{let t=new Date(e.date).valueOf();return Date.now()-t<=2592e6}),this._storage.overwrite(this._heartbeatsCache)}catch(e){ei.warn(e)}}async getHeartbeatsHeader(){var e;try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)==null||0===this._heartbeatsCache.heartbeats.length)return"";let t=eN(),{heartbeatsToSend:r,unsentEntries:n}=function(e,t=1024){let r=[],n=e.slice();for(let i of e){let e=r.find(e=>e.agent===i.agent);if(e){if(e.dates.push(i.date),eA(r)>t){e.dates.pop();break}}else if(r.push({agent:i.agent,dates:[i.date]}),eA(r)>t){r.pop();break}n=n.slice(1)}return{heartbeatsToSend:r,unsentEntries:n}}(this._heartbeatsCache.heartbeats),i=g(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,n.length>0?(this._heartbeatsCache.heartbeats=n,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(e){return ei.warn(e),""}}}function eN(){return new Date().toISOString().substring(0,10)}class eI{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!function(){try{return"object"==typeof indexedDB}catch(e){return!1}}()&&new Promise((e,t)=>{try{let r=!0,n="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(n);i.onsuccess=()=>{i.result.close(),r||self.indexedDB.deleteDatabase(n),e(!0)},i.onupgradeneeded=()=>{r=!1},i.onerror=()=>{var e;t((null===(e=i.error)||void 0===e?void 0:e.message)||"")}}catch(e){t(e)}}).then(()=>!0).catch(()=>!1)}async read(){if(!await this._canUseIndexedDBPromise)return{heartbeats:[]};{let e=await ex(this.app);return(null==e?void 0:e.heartbeats)?e:{heartbeats:[]}}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){let r=await this.read();return ew(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;if(await this._canUseIndexedDBPromise){let r=await this.read();return ew(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}}}function eA(e){return g(JSON.stringify({version:2,heartbeats:e})).length}ed(new C("platform-logger",e=>new et(e),"PRIVATE")),ed(new C("heartbeat",e=>new eE(e),"PRIVATE")),eg(er,en,""),eg(er,en,"esm2017"),eg("fire-js",""),/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */eg("firebase","10.14.1","app");let eT=require("util"),eS=require("undici"),eD=require("crypto"),ek="4.7.3";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eP{constructor(e){this.uid=e}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}eP.UNAUTHENTICATED=new eP(null),eP.GOOGLE_CREDENTIALS=new eP("google-credentials-uid"),eP.FIRST_PARTY=new eP("first-party-uid"),eP.MOCK_USER=new eP("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eC="10.14.0",ej=new $("@firebase/firestore");function eV(e,...t){if(ej.logLevel<=o.DEBUG){let r=t.map(eL);ej.debug(`Firestore (${eC}): ${e}`,...r)}}function eR(e,...t){if(ej.logLevel<=o.ERROR){let r=t.map(eL);ej.error(`Firestore (${eC}): ${e}`,...r)}}function eO(e,...t){if(ej.logLevel<=o.WARN){let r=t.map(eL);ej.warn(`Firestore (${eC}): ${e}`,...r)}}function eL(e){if("string"==typeof e)return e;try{return(0,eT.inspect)(e,{depth:100})}catch(t){return e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eF(e="Unexpected state"){let t=`FIRESTORE (${eC}) INTERNAL ASSERTION FAILED: `+e;throw eR(t),Error(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eM={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable"};class eU extends A{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e${constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eB{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class ez{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(eP.UNAUTHENTICATED))}shutdown(){}}class eq{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class eG{constructor(e){this.auth=null,e.onInit(e=>{this.auth=e})}getToken(){return this.auth?this.auth.getToken().then(e=>e?("string"==typeof e.accessToken||eF(),new eB(e.accessToken,new eP(this.auth.getUid()))):null):Promise.resolve(null)}invalidateToken(){}start(e,t){}shutdown(){}}class eH{constructor(e,t,r){this.sessionIndex=e,this.iamToken=t,this.authTokenFactory=r,this.type="FirstParty",this.user=eP.FIRST_PARTY,this._headers=new Map}getAuthToken(){return this.authTokenFactory?this.authTokenFactory():null}get headers(){this._headers.set("X-Goog-AuthUser",this.sessionIndex);let e=this.getAuthToken();return e&&this._headers.set("Authorization",e),this.iamToken&&this._headers.set("X-Goog-Iam-Authorization-Token",this.iamToken),this._headers}}class eK{constructor(e,t,r){this.sessionIndex=e,this.iamToken=t,this.authTokenFactory=r}getToken(){return Promise.resolve(new eH(this.sessionIndex,this.iamToken,this.authTokenFactory))}start(e,t){e.enqueueRetryable(()=>t(eP.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class eW{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class eQ{constructor(e){this.appCheckProvider=e,this.appCheck=null,e.onInit(e=>{this.appCheck=e})}getToken(){return this.appCheck?this.appCheck.getToken().then(e=>e?("string"==typeof e.token||eF(),new eW(e.token)):null):Promise.resolve(null)}invalidateToken(){}start(e,t){}shutdown(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eY{constructor(e,t,r,n,i,s,a,o,l){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=n,this.ssl=i,this.forceLongPolling=s,this.autoDetectLongPolling=a,this.longPollingOptions=o,this.useFetchStreams=l}}let eJ="(default)";class eX{constructor(e,t){this.projectId=e,this.database=t||eJ}static empty(){return new eX("","")}get isDefaultDatabase(){return this.database===eJ}isEqual(e){return e instanceof eX&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eZ="__name__";class e0{constructor(e,t,r){void 0===t?t=0:t>e.length&&eF(),void 0===r?r=e.length-t:r>e.length-t&&eF(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return 0===e0.comparator(this,e)}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof e0?e.forEach(e=>{t.push(e)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let r=Math.min(e.length,t.length);for(let n=0;n<r;n++){let r=e.get(n),i=t.get(n);if(r<i)return -1;if(r>i)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class e1 extends e0{construct(e,t,r){return new e1(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){let t=[];for(let r of e){if(r.indexOf("//")>=0)throw new eU(eM.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(e=>e.length>0))}return new e1(t)}static emptyPath(){return new e1([])}}let e2=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class e4 extends e0{construct(e,t,r){return new e4(e,t,r)}static isValidIdentifier(e){return e2.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),e4.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&this.get(0)===eZ}static keyField(){return new e4([eZ])}static fromServerFormat(e){let t=[],r="",n=0,i=()=>{if(0===r.length)throw new eU(eM.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""},s=!1;for(;n<e.length;){let t=e[n];if("\\"===t){if(n+1===e.length)throw new eU(eM.INVALID_ARGUMENT,"Path has trailing escape character: "+e);let t=e[n+1];if(!("\\"===t||"."===t||"`"===t))throw new eU(eM.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=t,n+=2}else"`"===t?s=!s:"."!==t||s?r+=t:i(),n++}if(i(),s)throw new eU(eM.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new e4(t)}static emptyPath(){return new e4([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e3{constructor(e){this.path=e}static fromPath(e){return new e3(e1.fromString(e))}static fromName(e){return new e3(e1.fromString(e).popFirst(5))}static empty(){return new e3(e1.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===e1.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return e1.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new e3(new e1(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function e5(e,t,r){if(!r)throw new eU(eM.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function e6(e){if(!e3.isDocumentKey(e))throw new eU(eM.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function e9(e){if(e3.isDocumentKey(e))throw new eU(eM.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function e8(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{var t;let r=(t=e).constructor?t.constructor.name:null;return r?`a custom ${r} object`:"an object"}}if("function"==typeof e)return"a function";return eF()}function e7(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new eU(eM.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let r=e8(e);throw new eU(eM.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${r}`)}}return e}function te(e){let t={};return void 0!==e.timeoutSeconds&&(t.timeoutSeconds=e.timeoutSeconds),t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tt=null,tr="RestConnection",tn={};tn.BatchGetDocuments="batchGet",tn.Commit="commit",tn.RunQuery="runQuery",tn.RunAggregationQuery="runAggregationQuery";class ti{constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),n=encodeURIComponent(this.databaseId.database);this.baseUrl=t+"://"+e.host,this.databasePath=`projects/${r}/databases/${n}`,this.requestParams=this.databaseId.database===eJ?`project_id=${r}`:`project_id=${r}&database_id=${n}`}get shouldResourcePathBeIncludedInRequest(){return!1}invokeRPC(e,t,r,n,i){let s=(null===tt?tt=268435456+Math.round(2147483648*Math.random()):tt++,"0x"+tt.toString(16)),a=this.makeUrl(e,t.toUriEncodedString());eV(tr,`Sending RPC '${e}' ${s}:`,a,r);let o={"google-cloud-resource-prefix":this.databasePath,"x-goog-request-params":this.requestParams};return this.modifyHeadersForRequest(o,n,i),this.performRPCRequest(e,a,o,r).then(t=>(eV(tr,`Received RPC '${e}' ${s}: `,t),t),t=>{throw eO(tr,`RPC '${e}' ${s} failed with error: `,t,"url: ",a,"request:",r),t})}invokeStreamingRPC(e,t,r,n,i,s){return this.invokeRPC(e,t,r,n,i)}modifyHeadersForRequest(e,t,r){e["X-Goog-Api-Client"]="gl-js/ fire/"+eC,e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((t,r)=>e[r]=t),r&&r.headers.forEach((t,r)=>e[r]=t)}makeUrl(e,t){let r=tn[e];return`${this.baseUrl}/v1/${t}:${r}`}terminate(){}}function ts(e){if(void 0===e)return eR("RPC_ERROR","HTTP error has no status"),eM.UNKNOWN;switch(e){case 200:return eM.OK;case 400:return eM.FAILED_PRECONDITION;case 401:return eM.UNAUTHENTICATED;case 403:return eM.PERMISSION_DENIED;case 404:return eM.NOT_FOUND;case 409:return eM.ABORTED;case 416:return eM.OUT_OF_RANGE;case 429:return eM.RESOURCE_EXHAUSTED;case 499:return eM.CANCELLED;case 500:return eM.UNKNOWN;case 501:return eM.UNIMPLEMENTED;case 503:return eM.UNAVAILABLE;case 504:return eM.DEADLINE_EXCEEDED;default:if(e>=200&&e<300)return eM.OK;if(e>=400&&e<500)return eM.FAILED_PRECONDITION;if(e>=500&&e<600)return eM.INTERNAL;return eM.UNKNOWN}}!function(e){e[e.OK=0]="OK",e[e.CANCELLED=1]="CANCELLED",e[e.UNKNOWN=2]="UNKNOWN",e[e.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",e[e.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",e[e.NOT_FOUND=5]="NOT_FOUND",e[e.ALREADY_EXISTS=6]="ALREADY_EXISTS",e[e.PERMISSION_DENIED=7]="PERMISSION_DENIED",e[e.UNAUTHENTICATED=16]="UNAUTHENTICATED",e[e.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",e[e.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",e[e.ABORTED=10]="ABORTED",e[e.OUT_OF_RANGE=11]="OUT_OF_RANGE",e[e.UNIMPLEMENTED=12]="UNIMPLEMENTED",e[e.INTERNAL=13]="INTERNAL",e[e.UNAVAILABLE=14]="UNAVAILABLE",e[e.DATA_LOSS=15]="DATA_LOSS"}(l||(l={}));/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ta extends ti{constructor(e,t){super(e),this.fetchImpl=t}openStream(e,t){throw Error("Not supported by FetchConnection")}async performRPCRequest(e,t,r,n){var i;let s;let a=JSON.stringify(n);try{s=await this.fetchImpl(t,{method:"POST",headers:r,body:a})}catch(e){throw new eU(ts(e.status),"Request failed with error: "+e.statusText)}if(!s.ok){let e=await s.json();Array.isArray(e)&&(e=e[0]);let t=null===(i=null==e?void 0:e.error)||void 0===i?void 0:i.message;throw new eU(ts(s.status),`Request failed with error: ${null!=t?t:s.statusText}`)}return s.json()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class to{static newId(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length,r="";for(;r.length<20;){let n=(0,eD.randomBytes)(40);for(let i=0;i<n.length;++i)r.length<20&&n[i]<t&&(r+=e.charAt(n[i]%e.length))}return r}}function tl(e,t){return e<t?-1:e>t?1:0}function tu(e,t,r){return e.length===t.length&&e.every((e,n)=>r(e,t[n]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tc(e){let t=0;for(let r in e)Object.prototype.hasOwnProperty.call(e,r)&&t++;return t}function td(e,t){for(let r in e)Object.prototype.hasOwnProperty.call(e,r)&&t(r,e[r])}function th(e){return 0===e&&1/e==-1/0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tf{constructor(e){this.binaryString=e}static fromBase64String(e){return new tf(Buffer.from(e,"base64").toString("binary"))}static fromUint8Array(e){return new tf(function(e){let t="";for(let r=0;r<e.length;++r)t+=String.fromCharCode(e[r]);return t}(e))}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){var e;return e=this.binaryString,Buffer.from(e,"binary").toString("base64")}toUint8Array(){return function(e){let t=new Uint8Array(e.length);for(let r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return tl(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}tf.EMPTY_BYTE_STRING=new tf("");/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tp=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function tm(e){if(e||eF(),"string"==typeof e){let t=0,r=tp.exec(e);if(r||eF(),r[1]){let e=r[1];t=Number(e=(e+"000000000").substr(0,9))}return{seconds:Math.floor(new Date(e).getTime()/1e3),nanos:t}}return{seconds:tg(e.seconds),nanos:tg(e.nanos)}}function tg(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}function ty(e){return"string"==typeof e?tf.fromBase64String(e):tf.fromUint8Array(e)}class tb{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0||t>=1e9)throw new eU(eM.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800||e>=253402300800)throw new eU(eM.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return tb.fromMillis(Date.now())}static fromDate(e){return tb.fromMillis(e.getTime())}static fromMillis(e){let t=Math.floor(e/1e3);return new tb(t,Math.floor((e-1e3*t)*1e6))}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?tl(this.nanoseconds,e.nanoseconds):tl(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){return String(this.seconds- -62135596800).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}function tv(e){var t,r;return(null===(r=((null===(t=null==e?void 0:e.mapValue)||void 0===t?void 0:t.fields)||{}).__type__)||void 0===r?void 0:r.stringValue)==="server_timestamp"}function tx(e){let t=tm(e.mapValue.fields.__local_write_time__.timestampValue);return new tb(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tw="__type__",t_="__max__",tE={mapValue:{fields:{__type__:{stringValue:t_}}}},tN="__vector__",tI="value";function tA(e){var t,r;return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?tv(e)?4:(((e.mapValue||{}).fields||{}).__type__||{}).stringValue===t_?9007199254740991:(null===(r=((null===(t=null==e?void 0:e.mapValue)||void 0===t?void 0:t.fields)||{})[tw])||void 0===r?void 0:r.stringValue)===tN?10:11:eF()}function tT(e,t){if(e===t)return!0;let r=tA(e);if(r!==tA(t))return!1;switch(r){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return tx(e).isEqual(tx(t));case 3:return function(e,t){if("string"==typeof e.timestampValue&&"string"==typeof t.timestampValue&&e.timestampValue.length===t.timestampValue.length)return e.timestampValue===t.timestampValue;let r=tm(e.timestampValue),n=tm(t.timestampValue);return r.seconds===n.seconds&&r.nanos===n.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return ty(e.bytesValue).isEqual(ty(t.bytesValue));case 7:return e.referenceValue===t.referenceValue;case 8:return tg(e.geoPointValue.latitude)===tg(t.geoPointValue.latitude)&&tg(e.geoPointValue.longitude)===tg(t.geoPointValue.longitude);case 2:return function(e,t){if("integerValue"in e&&"integerValue"in t)return tg(e.integerValue)===tg(t.integerValue);if("doubleValue"in e&&"doubleValue"in t){let r=tg(e.doubleValue),n=tg(t.doubleValue);return r===n?th(r)===th(n):isNaN(r)&&isNaN(n)}return!1}(e,t);case 9:return tu(e.arrayValue.values||[],t.arrayValue.values||[],tT);case 10:case 11:return function(e,t){let r=e.mapValue.fields||{},n=t.mapValue.fields||{};if(tc(r)!==tc(n))return!1;for(let e in r)if(r.hasOwnProperty(e)&&(void 0===n[e]||!tT(r[e],n[e])))return!1;return!0}(e,t);default:return eF()}}function tS(e,t){return void 0!==(e.values||[]).find(e=>tT(e,t))}function tD(e,t){if(e===t)return 0;let r=tA(e),n=tA(t);if(r!==n)return tl(r,n);switch(r){case 0:case 9007199254740991:return 0;case 1:return tl(e.booleanValue,t.booleanValue);case 2:return function(e,t){let r=tg(e.integerValue||e.doubleValue),n=tg(t.integerValue||t.doubleValue);return r<n?-1:r>n?1:r===n?0:isNaN(r)?isNaN(n)?0:-1:1}(e,t);case 3:return tk(e.timestampValue,t.timestampValue);case 4:return tk(tx(e),tx(t));case 5:return tl(e.stringValue,t.stringValue);case 6:return function(e,t){let r=ty(e),n=ty(t);return r.compareTo(n)}(e.bytesValue,t.bytesValue);case 7:return function(e,t){let r=e.split("/"),n=t.split("/");for(let e=0;e<r.length&&e<n.length;e++){let t=tl(r[e],n[e]);if(0!==t)return t}return tl(r.length,n.length)}(e.referenceValue,t.referenceValue);case 8:return function(e,t){let r=tl(tg(e.latitude),tg(t.latitude));return 0!==r?r:tl(tg(e.longitude),tg(t.longitude))}(e.geoPointValue,t.geoPointValue);case 9:return tP(e.arrayValue,t.arrayValue);case 10:return function(e,t){var r,n,i,s;let a=e.fields||{},o=t.fields||{},l=null===(r=a[tI])||void 0===r?void 0:r.arrayValue,u=null===(n=o[tI])||void 0===n?void 0:n.arrayValue,c=tl((null===(i=null==l?void 0:l.values)||void 0===i?void 0:i.length)||0,(null===(s=null==u?void 0:u.values)||void 0===s?void 0:s.length)||0);return 0!==c?c:tP(l,u)}(e.mapValue,t.mapValue);case 11:return function(e,t){if(e===tE.mapValue&&t===tE.mapValue)return 0;if(e===tE.mapValue)return 1;if(t===tE.mapValue)return -1;let r=e.fields||{},n=Object.keys(r),i=t.fields||{},s=Object.keys(i);n.sort(),s.sort();for(let e=0;e<n.length&&e<s.length;++e){let t=tl(n[e],s[e]);if(0!==t)return t;let a=tD(r[n[e]],i[s[e]]);if(0!==a)return a}return tl(n.length,s.length)}(e.mapValue,t.mapValue);default:throw eF()}}function tk(e,t){if("string"==typeof e&&"string"==typeof t&&e.length===t.length)return tl(e,t);let r=tm(e),n=tm(t),i=tl(r.seconds,n.seconds);return 0!==i?i:tl(r.nanos,n.nanos)}function tP(e,t){let r=e.values||[],n=t.values||[];for(let e=0;e<r.length&&e<n.length;++e){let t=tD(r[e],n[e]);if(t)return t}return tl(r.length,n.length)}function tC(e,t){return{referenceValue:`projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`}}function tj(e){return!!e&&"arrayValue"in e}function tV(e){return!!e&&"nullValue"in e}function tR(e){return!!e&&"doubleValue"in e&&isNaN(Number(e.doubleValue))}function tO(e){return!!e&&"mapValue"in e}function tL(e){if(e.geoPointValue)return{geoPointValue:Object.assign({},e.geoPointValue)};if(e.timestampValue&&"object"==typeof e.timestampValue)return{timestampValue:Object.assign({},e.timestampValue)};if(e.mapValue){let t={mapValue:{fields:{}}};return td(e.mapValue.fields,(e,r)=>t.mapValue.fields[e]=tL(r)),t}{if(!e.arrayValue)return Object.assign({},e);let t={arrayValue:{values:[]}};for(let r=0;r<(e.arrayValue.values||[]).length;++r)t.arrayValue.values[r]=tL(e.arrayValue.values[r]);return t}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tF{constructor(e,t){this.position=e,this.inclusive=t}}function tM(e,t){if(null===e)return null===t;if(null===t||e.inclusive!==t.inclusive||e.position.length!==t.position.length)return!1;for(let r=0;r<e.position.length;r++)if(!tT(e.position[r],t.position[r]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tU{}class t$ extends tU{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?"in"===t||"not-in"===t?this.createKeyFieldInFilter(e,t,r):new tz(e,t,r):"array-contains"===t?new tK(e,r):"in"===t?new tW(e,r):"not-in"===t?new tQ(e,r):"array-contains-any"===t?new tY(e,r):new t$(e,t,r)}static createKeyFieldInFilter(e,t,r){return"in"===t?new tq(e,r):new tG(e,r)}matches(e){let t=e.data.field(this.field);return"!="===this.op?null!==t&&this.matchesComparison(tD(t,this.value)):null!==t&&tA(this.value)===tA(t)&&this.matchesComparison(tD(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return 0===e;case"!=":return 0!==e;case">":return e>0;case">=":return e>=0;default:return eF()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class tB extends tU{constructor(e,t){super(),this.filters=e,this.op=t,this.memoizedFlattenedFilters=null}static create(e,t){return new tB(e,t)}matches(e){return"and"===this.op?void 0===this.filters.find(t=>!t.matches(e)):void 0!==this.filters.find(t=>t.matches(e))}getFlattenedFilters(){return null!==this.memoizedFlattenedFilters||(this.memoizedFlattenedFilters=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.memoizedFlattenedFilters}getFilters(){return Object.assign([],this.filters)}}class tz extends t${constructor(e,t,r){super(e,t,r),this.key=e3.fromName(r.referenceValue)}matches(e){let t=e3.comparator(e.key,this.key);return this.matchesComparison(t)}}class tq extends t${constructor(e,t){super(e,"in",t),this.keys=tH("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class tG extends t${constructor(e,t){super(e,"not-in",t),this.keys=tH("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function tH(e,t){var r;return((null===(r=t.arrayValue)||void 0===r?void 0:r.values)||[]).map(e=>e3.fromName(e.referenceValue))}class tK extends t${constructor(e,t){super(e,"array-contains",t)}matches(e){let t=e.data.field(this.field);return tj(t)&&tS(t.arrayValue,this.value)}}class tW extends t${constructor(e,t){super(e,"in",t)}matches(e){let t=e.data.field(this.field);return null!==t&&tS(this.value.arrayValue,t)}}class tQ extends t${constructor(e,t){super(e,"not-in",t)}matches(e){if(tS(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;let t=e.data.field(this.field);return null!==t&&!tS(this.value.arrayValue,t)}}class tY extends t${constructor(e,t){super(e,"array-contains-any",t)}matches(e){let t=e.data.field(this.field);return!!tj(t)&&!!t.arrayValue.values&&t.arrayValue.values.some(e=>tS(this.value.arrayValue,e))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tJ{constructor(e,t="asc"){this.field=e,this.dir=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tX{constructor(e){this.timestamp=e}static fromTimestamp(e){return new tX(e)}static min(){return new tX(new tb(0,0))}static max(){return new tX(new tb(253402300799,1e9-1))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tZ{constructor(e,t){this.comparator=e,this.root=t||t1.EMPTY}insert(e,t){return new tZ(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,t1.BLACK,null,null))}remove(e){return new tZ(this.comparator,this.root.remove(e,this.comparator).copy(null,null,t1.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let r=this.comparator(e,t.key);if(0===r)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){let n=this.comparator(e,r.key);if(0===n)return t+r.left.size;n<0?r=r.left:(t+=r.left.size+1,r=r.right)}return -1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){let e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new t0(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new t0(this.root,e,this.comparator,!1)}getReverseIterator(){return new t0(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new t0(this.root,e,this.comparator,!0)}}class t0{constructor(e,t,r,n){this.isReverse=n,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&n&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else if(0===i){this.nodeStack.push(e);break}else this.nodeStack.push(e),e=this.isReverse?e.right:e.left}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class t1{constructor(e,t,r,n,i){this.key=e,this.value=t,this.color=null!=r?r:t1.RED,this.left=null!=n?n:t1.EMPTY,this.right=null!=i?i:t1.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,n,i){return new t1(null!=e?e:this.key,null!=t?t:this.value,null!=r?r:this.color,null!=n?n:this.left,null!=i?i:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let n=this,i=r(e,n.key);return(n=i<0?n.copy(null,null,null,n.left.insert(e,t,r),null):0===i?n.copy(null,t,null,null,null):n.copy(null,null,null,null,n.right.insert(e,t,r))).fixUp()}removeMin(){if(this.left.isEmpty())return t1.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),(e=e.copy(null,null,null,e.left.removeMin(),null)).fixUp()}remove(e,t){let r;let n=this;if(0>t(e,n.key))n.left.isEmpty()||n.left.isRed()||n.left.left.isRed()||(n=n.moveRedLeft()),n=n.copy(null,null,null,n.left.remove(e,t),null);else{if(n.left.isRed()&&(n=n.rotateRight()),n.right.isEmpty()||n.right.isRed()||n.right.left.isRed()||(n=n.moveRedRight()),0===t(e,n.key)){if(n.right.isEmpty())return t1.EMPTY;r=n.right.min(),n=n.copy(r.key,r.value,null,null,n.right.removeMin())}n=n.copy(null,null,null,null,n.right.remove(e,t))}return n.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=(e=(e=e.copy(null,null,null,null,e.right.rotateRight())).rotateLeft()).colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=(e=e.rotateRight()).colorFlip()),e}rotateLeft(){let e=this.copy(null,null,t1.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,t1.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){return Math.pow(2,this.check())<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw eF();let e=this.left.check();if(e===this.right.check())return e+(this.isRed()?0:1);throw eF()}}t1.EMPTY=null,t1.RED=!0,t1.BLACK=!1;class t2{constructor(){this.size=0}get key(){throw eF()}get value(){throw eF()}get color(){throw eF()}get left(){throw eF()}get right(){throw eF()}copy(e,t,r,n,i){return this}insert(e,t,r){return new t1(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}}t1.EMPTY=new t2;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t4{constructor(e){this.comparator=e,this.data=new tZ(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){let r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){let n=r.getNext();if(this.comparator(n.key,e[1])>=0)return;t(n.key)}}forEachWhile(e,t){let r;for(r=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new t3(this.data.getIterator())}getIteratorFrom(e){return new t3(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(e=>{t=t.add(e)}),t}isEqual(e){if(!(e instanceof t4)||this.size!==e.size)return!1;let t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){let e=t.getNext().key,n=r.getNext().key;if(0!==this.comparator(e,n))return!1}return!0}toArray(){let e=[];return this.forEach(t=>{e.push(t)}),e}toString(){let e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){let t=new t4(this.comparator);return t.data=e,t}}class t3{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t5{constructor(e){this.fields=e,e.sort(e4.comparator)}static empty(){return new t5([])}unionWith(e){let t=new t4(e4.comparator);for(let e of this.fields)t=t.add(e);for(let r of e)t=t.add(r);return new t5(t.toArray())}covers(e){for(let t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return tu(this.fields,e.fields,(e,t)=>e.isEqual(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t6{constructor(e){this.value=e}static empty(){return new t6({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(!tO(t=(t.mapValue.fields||{})[e.get(r)]))return null;return(t=(t.mapValue.fields||{})[e.lastSegment()])||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=tL(t)}setAll(e){let t=e4.emptyPath(),r={},n=[];e.forEach((e,i)=>{if(!t.isImmediateParentOf(i)){let e=this.getFieldsMap(t);this.applyChanges(e,r,n),r={},n=[],t=i.popLast()}e?r[i.lastSegment()]=tL(e):n.push(i.lastSegment())});let i=this.getFieldsMap(t);this.applyChanges(i,r,n)}delete(e){let t=this.field(e.popLast());tO(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return tT(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let n=t.mapValue.fields[e.get(r)];tO(n)&&n.mapValue.fields||(n={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=n),t=n}return t.mapValue.fields}applyChanges(e,t,r){for(let n of(td(t,(t,r)=>e[t]=r),r))delete e[n]}clone(){return new t6(tL(this.value))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t9{constructor(e,t,r,n,i,s,a){this.key=e,this.documentType=t,this.version=r,this.readTime=n,this.createTime=i,this.data=s,this.documentState=a}static newInvalidDocument(e){return new t9(e,0,tX.min(),tX.min(),tX.min(),t6.empty(),0)}static newFoundDocument(e,t,r,n){return new t9(e,1,t,tX.min(),r,n,0)}static newNoDocument(e,t){return new t9(e,2,t,tX.min(),tX.min(),t6.empty(),0)}static newUnknownDocument(e,t){return new t9(e,3,t,tX.min(),tX.min(),t6.empty(),2)}convertToFoundDocument(e,t){return this.createTime.isEqual(tX.min())&&(2===this.documentType||0===this.documentType)&&(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=t6.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=t6.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=tX.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(e){return e instanceof t9&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new t9(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t8{constructor(e,t=null,r=[],n=[],i=null,s=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=n,this.limit=i,this.startAt=s,this.endAt=a,this.memoizedCanonicalId=null}}function t7(e,t=null,r=[],n=[],i=null,s=null,a=null){return new t8(e,t,r,n,i,s,a)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(e,t=null,r=[],n=[],i=null,s="F",a=null,o=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=n,this.limit=i,this.limitType=s,this.startAt=a,this.endAt=o,this.memoizedNormalizedOrderBy=null,this.memoizedTarget=null,this.memoizedAggregateTarget=null,this.startAt,this.endAt}}function rt(e){return null!==e.collectionGroup}function rr(e){if(null===e.memoizedNormalizedOrderBy){let t;e.memoizedNormalizedOrderBy=[];let r=new Set;for(let t of e.explicitOrderBy)e.memoizedNormalizedOrderBy.push(t),r.add(t.field.canonicalString());let n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(t=new t4(e4.comparator),e.filters.forEach(e=>{e.getFlattenedFilters().forEach(e=>{e.isInequality()&&(t=t.add(e.field))})}),t).forEach(t=>{r.has(t.canonicalString())||t.isKeyField()||e.memoizedNormalizedOrderBy.push(new tJ(t,n))}),r.has(e4.keyField().canonicalString())||e.memoizedNormalizedOrderBy.push(new tJ(e4.keyField(),n))}return e.memoizedNormalizedOrderBy}function rn(e){return e.memoizedTarget||(e.memoizedTarget=function(e,t){if("F"===e.limitType)return t7(e.path,e.collectionGroup,t,e.filters,e.limit,e.startAt,e.endAt);{t=t.map(e=>{let t="desc"===e.dir?"asc":"desc";return new tJ(e.field,t)});let r=e.endAt?new tF(e.endAt.position,e.endAt.inclusive):null,n=e.startAt?new tF(e.startAt.position,e.startAt.inclusive):null;return t7(e.path,e.collectionGroup,t,e.filters,e.limit,r,n)}}(e,rr(e))),e.memoizedTarget}function ri(e,t){let r=e.filters.concat([t]);return new re(e.path,e.collectionGroup,e.explicitOrderBy.slice(),r,e.limit,e.limitType,e.startAt,e.endAt)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rs(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:th(t)?"-0":t}}function ra(e,t){return"number"==typeof t&&Number.isInteger(t)&&!th(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER?{integerValue:""+t}:rs(e,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ro{constructor(){this._=void 0}}class rl extends ro{}class ru extends ro{constructor(e){super(),this.elements=e}}class rc extends ro{constructor(e){super(),this.elements=e}}class rd extends ro{constructor(e,t){super(),this.serializer=e,this.operand=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rh{constructor(e,t){this.field=e,this.transform=t}}class rf{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new rf}static exists(e){return new rf(void 0,e)}static updateTime(e){return new rf(e)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}class rp{}class rm extends rp{constructor(e,t,r,n=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=n,this.type=0}getFieldMask(){return null}}class rg extends rp{constructor(e,t,r,n,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=n,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}class ry extends rp{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class rb extends rp{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rv=(()=>{let e={};return e.asc="ASCENDING",e.desc="DESCENDING",e})(),rx=(()=>{let e={};return e["<"]="LESS_THAN",e["<="]="LESS_THAN_OR_EQUAL",e[">"]="GREATER_THAN",e[">="]="GREATER_THAN_OR_EQUAL",e["=="]="EQUAL",e["!="]="NOT_EQUAL",e["array-contains"]="ARRAY_CONTAINS",e.in="IN",e["not-in"]="NOT_IN",e["array-contains-any"]="ARRAY_CONTAINS_ANY",e})(),rw=(()=>{let e={};return e.and="AND",e.or="OR",e})();class r_{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function rE(e,t){if(!e.useProto3Json)return{seconds:""+t.seconds,nanos:t.nanoseconds};{let e=new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z",""),r=("000000000"+t.nanoseconds).slice(-9);return`${e}.${r}Z`}}function rN(e){return e||eF(),tX.fromTimestamp(function(e){let t=tm(e);return new tb(t.seconds,t.nanos)}(e))}function rI(e,t){return rA(e,t).canonicalString()}function rA(e,t){let r=new e1(["projects",e.projectId,"databases",e.database]).child("documents");return void 0===t?r:r.child(t)}function rT(e,t){return rI(e.databaseId,t.path)}function rS(e,t){let r=function(e){let t=e1.fromString(e);return rP(t)||eF(),t}(t);if(r.get(1)!==e.databaseId.projectId)throw new eU(eM.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+r.get(1)+" vs "+e.databaseId.projectId);if(r.get(3)!==e.databaseId.database)throw new eU(eM.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+r.get(3)+" vs "+e.databaseId.database);return new e3((r.length>4&&"documents"===r.get(4)||eF(),r.popFirst(5)))}function rD(e,t,r){return{name:rT(e,t),fields:r.value.mapValue.fields}}function rk(e){return{fieldPath:e.canonicalString()}}function rP(e){return e.length>=4&&"projects"===e.get(0)&&"databases"===e.get(2)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rC(e){return new r_(e,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rj{}class rV extends rj{constructor(e,t,r,n){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=n,this.terminated=!1}verifyInitialized(){if(this.terminated)throw new eU(eM.FAILED_PRECONDITION,"The client has already been terminated.")}invokeRPC(e,t,r,n){return this.verifyInitialized(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,s])=>this.connection.invokeRPC(e,rA(t,r),n,i,s)).catch(e=>{if("FirebaseError"===e.name)throw e.code===eM.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e;throw new eU(eM.UNKNOWN,e.toString())})}invokeStreamingRPC(e,t,r,n,i){return this.verifyInitialized(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,a])=>this.connection.invokeStreamingRPC(e,rA(t,r),n,s,a,i)).catch(e=>{if("FirebaseError"===e.name)throw e.code===eM.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e;throw new eU(eM.UNKNOWN,e.toString())})}terminate(){this.terminated=!0,this.connection.terminate()}}async function rR(e,t){let r={writes:t.map(t=>(function(e,t){var r;let n;if(t instanceof rm)n={update:rD(e,t.key,t.value)};else if(t instanceof ry)n={delete:rT(e,t.key)};else if(t instanceof rg)n={update:rD(e,t.key,t.data),updateMask:function(e){let t=[];return e.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}(t.fieldMask)};else{if(!(t instanceof rb))return eF();n={verify:rT(e,t.key)}}return t.fieldTransforms.length>0&&(n.updateTransforms=t.fieldTransforms.map(e=>(function(e,t){let r=t.transform;if(r instanceof rl)return{fieldPath:t.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(r instanceof ru)return{fieldPath:t.field.canonicalString(),appendMissingElements:{values:r.elements}};if(r instanceof rc)return{fieldPath:t.field.canonicalString(),removeAllFromArray:{values:r.elements}};if(r instanceof rd)return{fieldPath:t.field.canonicalString(),increment:r.operand};throw eF()})(0,e))),t.precondition.isNone||(n.currentDocument=void 0!==(r=t.precondition).updateTime?{updateTime:rE(e,r.updateTime.toTimestamp())}:void 0!==r.exists?{exists:r.exists}:eF()),n})(e.serializer,t))};await e.invokeRPC("Commit",e.serializer.databaseId,e1.emptyPath(),r)}async function rO(e,t){let r={documents:t.map(t=>rT(e.serializer,t))},n=await e.invokeStreamingRPC("BatchGetDocuments",e.serializer.databaseId,e1.emptyPath(),r,t.length),i=new Map;n.forEach(t=>{var r;let n=(r=e.serializer,"found"in t?function(e,t){t.found||eF(),t.found.name,t.found.updateTime;let r=rS(e,t.found.name),n=rN(t.found.updateTime),i=t.found.createTime?rN(t.found.createTime):tX.min(),s=new t6({mapValue:{fields:t.found.fields}});return t9.newFoundDocument(r,n,i,s)}(r,t):"missing"in t?function(e,t){t.missing||eF(),t.readTime||eF();let r=rS(e,t.missing),n=rN(t.readTime);return t9.newNoDocument(r,n)}(r,t):eF());i.set(n.key.toString(),n)});let s=[];return t.forEach(e=>{let t=i.get(e.toString());t||eF(),s.push(t)}),s}async function rL(e,t){let{queryTarget:r,parent:n}=function(e,t){var r,n,i,s;let a;let o={structuredQuery:{}},l=t.path;null!==t.collectionGroup?(a=l,o.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(a=l.popLast(),o.structuredQuery.from=[{collectionId:l.lastSegment()}]),o.parent=(r=a,rI(e.databaseId,r));let u=function(e){if(0!==e.length)return function e(t){return t instanceof t$?function(e){if("=="===e.op){if(tR(e.value))return{unaryFilter:{field:rk(e.field),op:"IS_NAN"}};if(tV(e.value))return{unaryFilter:{field:rk(e.field),op:"IS_NULL"}}}else if("!="===e.op){if(tR(e.value))return{unaryFilter:{field:rk(e.field),op:"IS_NOT_NAN"}};if(tV(e.value))return{unaryFilter:{field:rk(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:rk(e.field),op:rx[e.op],value:e.value}}}(t):t instanceof tB?function(t){let r=t.getFilters().map(t=>e(t));return 1===r.length?r[0]:{compositeFilter:{op:rw[t.op],filters:r}}}(t):eF()}(tB.create(e,"and"))}(t.filters);u&&(o.structuredQuery.where=u);let c=function(e){if(0!==e.length)return e.map(e=>({field:rk(e.field),direction:rv[e.dir]}))}(t.orderBy);c&&(o.structuredQuery.orderBy=c);let d=(n=t.limit,e.useProto3Json||null==n?n:{value:n});return null!==d&&(o.structuredQuery.limit=d),t.startAt&&(o.structuredQuery.startAt={before:(i=t.startAt).inclusive,values:i.position}),t.endAt&&(o.structuredQuery.endAt={before:!(s=t.endAt).inclusive,values:s.position}),{queryTarget:o,parent:a}}(e.serializer,rn(t));return(await e.invokeStreamingRPC("RunQuery",e.serializer.databaseId,n,{structuredQuery:r.structuredQuery})).filter(e=>!!e.document).map(t=>(function(e,t,r){let n=rS(e,t.name),i=rN(t.updateTime),s=t.createTime?rN(t.createTime):tX.min(),a=new t6({mapValue:{fields:t.fields}}),o=t9.newFoundDocument(n,i,s,a);return r&&o.setHasCommittedMutations(),r?o.setHasCommittedMutations():o})(e.serializer,t.document,void 0))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rF="ComponentProvider",rM=new Map;function rU(e){if(e._terminated)throw new eU(eM.FAILED_PRECONDITION,"The client has already been terminated.");if(!rM.has(e)){var t,r,n;eV(rF,"Initializing Datastore");let i=new ta((t=e._databaseId,r=e.app.options.appId||"",new eY(t,r,e._persistenceKey,(n=e._freezeSettings()).host,n.ssl,n.experimentalForceLongPolling,n.experimentalAutoDetectLongPolling,te(n.experimentalLongPollingOptions),n.useFetchStreams)),eS.fetch),s=rC(e._databaseId),a=new rV(e._authCredentials,e._appCheckCredentials,i,s);rM.set(e,a)}return rM.get(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let r$="firestore.googleapis.com";class rB{constructor(e){var t,r;if(void 0===e.host){if(void 0!==e.ssl)throw new eU(eM.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=r$,this.ssl=!0}else this.host=e.host,this.ssl=null===(t=e.ssl)||void 0===t||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=41943040;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<1048576)throw new eU(eM.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}(function(e,t,r,n){if(!0===t&&!0===n)throw new eU(eM.INVALID_ARGUMENT,`${e} and ${r} cannot be used together.`)})("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=te(null!==(r=e.experimentalLongPollingOptions)&&void 0!==r?r:{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new eU(eM.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new eU(eM.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new eU(eM.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){var t,r;return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(t=this.experimentalLongPollingOptions,r=e.experimentalLongPollingOptions,t.timeoutSeconds===r.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rz{constructor(e,t,r,n){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=n,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new rB({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new eU(eM.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return"notTerminated"!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new eU(eM.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new rB(e),void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new ez;switch(e.type){case"firstParty":return new eK(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new eU(eM.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return"notTerminated"===this._terminateTask&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){"notTerminated"===this._terminateTask?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){let t=rM.get(e);t&&(eV(rF,"Removing Datastore"),rM.delete(e),t.terminate())}(this),Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rq{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new rq(this.firestore,e,this._query)}}class rG{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new rH(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new rG(this.firestore,e,this._key)}}class rH extends rq{constructor(e,t,r){super(e,t,new re(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new rG(this.firestore,null,new e3(e))}withConverter(e){return new rH(this.firestore,e,this._path)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rK{constructor(e){this._byteString=e}static fromBase64String(e){try{return new rK(tf.fromBase64String(e))}catch(e){throw new eU(eM.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(e){return new rK(tf.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rW{constructor(...e){for(let t=0;t<e.length;++t)if(0===e[t].length)throw new eU(eM.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new e4(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rQ{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rY{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new eU(eM.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new eU(eM.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return tl(this._lat,e._lat)||tl(this._long,e._long)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rJ{constructor(e){this._values=(e||[]).map(e=>e)}toArray(){return this._values.map(e=>e)}isEqual(e){return(/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e,t){if(e.length!==t.length)return!1;for(let r=0;r<e.length;++r)if(e[r]!==t[r])return!1;return!0}(this._values,e._values))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rX=/^__.*__$/;class rZ{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return null!==this.fieldMask?new rg(e,this.data,this.fieldMask,t,this.fieldTransforms):new rm(e,this.data,t,this.fieldTransforms)}}class r0{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new rg(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function r1(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw eF()}}class r2{constructor(e,t,r,n,i,s){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=n,void 0===i&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=s||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new r2(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){var t;let r=null===(t=this.path)||void 0===t?void 0:t.child(e),n=this.contextWith({path:r,arrayElement:!1});return n.validatePathSegment(e),n}childContextForFieldPath(e){var t;let r=null===(t=this.path)||void 0===t?void 0:t.child(e),n=this.contextWith({path:r,arrayElement:!1});return n.validatePath(),n}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return nu(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return void 0!==this.fieldMask.find(t=>e.isPrefixOf(t))||void 0!==this.fieldTransforms.find(t=>e.isPrefixOf(t.field))}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(0===e.length)throw this.createError("Document fields must not be empty");if(r1(this.dataSource)&&rX.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class r4{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||rC(e)}createContext(e,t,r,n=!1){return new r2({dataSource:e,methodName:t,targetDoc:r,path:e4.emptyPath(),arrayElement:!1,hasConverter:n},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function r3(e){let t=e._freezeSettings(),r=rC(e._databaseId);return new r4(e._databaseId,!!t.ignoreUndefinedProperties,r)}class r5 extends rQ{_toFieldTransform(e){if(2===e.dataSource)e.fieldMask.push(e.path);else if(1===e.dataSource)throw e.createError(`${this._methodName}() can only appear at the top level of your update data`);else throw e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return null}isEqual(e){return e instanceof r5}}function r6(e,t,r){return new r2({dataSource:3,targetDoc:t.settings.targetDoc,methodName:e._methodName,arrayElement:r},t.databaseId,t.serializer,t.ignoreUndefinedProperties)}class r9 extends null{_toFieldTransform(e){return new rh(e.path,new rl)}isEqual(e){return e instanceof r9}}class r8 extends rQ{constructor(e,t){super(e),this._elements=t}_toFieldTransform(e){let t=r6(this,e,!0),r=new ru(this._elements.map(e=>nr(e,t)));return new rh(e.path,r)}isEqual(e){return e instanceof r8&&D(this._elements,e._elements)}}class r7 extends rQ{constructor(e,t){super(e),this._elements=t}_toFieldTransform(e){let t=r6(this,e,!0),r=new rc(this._elements.map(e=>nr(e,t)));return new rh(e.path,r)}isEqual(e){return e instanceof r7&&D(this._elements,e._elements)}}class ne extends rQ{constructor(e,t){super(e),this._operand=t}_toFieldTransform(e){let t=new rd(e.serializer,ra(e.serializer,this._operand));return new rh(e.path,t)}isEqual(e){return e instanceof ne&&this._operand===e._operand}}function nt(e,t,r,n=!1){return nr(r,e.createContext(n?4:3,t))}function nr(e,t){if(ni(e=P(e)))return ns("Unsupported field value:",t,e),nn(e,t);if(e instanceof rQ)return function(e,t){if(!r1(t.dataSource))throw t.createError(`${e._methodName}() can only be used with update() and set()`);if(!t.path)throw t.createError(`${e._methodName}() is not currently supported inside arrays`);let r=e._toFieldTransform(t);r&&t.fieldTransforms.push(r)}(e,t),null;if(void 0===e&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),!(e instanceof Array))return function(e,t){var r,n;if(null===(e=P(e)))return{nullValue:"NULL_VALUE"};if("number"==typeof e)return ra(t.serializer,e);if("boolean"==typeof e)return{booleanValue:e};if("string"==typeof e)return{stringValue:e};if(e instanceof Date){let r=tb.fromDate(e);return{timestampValue:rE(t.serializer,r)}}if(e instanceof tb){let r=new tb(e.seconds,1e3*Math.floor(e.nanoseconds/1e3));return{timestampValue:rE(t.serializer,r)}}if(e instanceof rY)return{geoPointValue:{latitude:e.latitude,longitude:e.longitude}};else if(e instanceof rK)return{bytesValue:(r=t.serializer,n=e._byteString,r.useProto3Json?n.toBase64():n.toUint8Array())};else if(e instanceof rG){let r=t.databaseId,n=e.firestore._databaseId;if(!n.isEqual(r))throw t.createError(`Document reference is for database ${n.projectId}/${n.database} but should be for database ${r.projectId}/${r.database}`);return{referenceValue:rI(e.firestore._databaseId||t.databaseId,e._key.path)}}else if(e instanceof rJ)return{mapValue:{fields:{[tw]:{stringValue:tN},[tI]:{arrayValue:{values:e.toArray().map(e=>{if("number"!=typeof e)throw t.createError("VectorValues must only contain numeric values.");return rs(t.serializer,e)})}}}}};else throw t.createError(`Unsupported field value: ${e8(e)}`)}(e,t);if(t.settings.arrayElement&&4!==t.dataSource)throw t.createError("Nested arrays are not supported");return function(e,t){let r=[],n=0;for(let i of e){let e=nr(i,t.childContextForArray(n));null==e&&(e={nullValue:"NULL_VALUE"}),r.push(e),n++}return{arrayValue:{values:r}}}(e,t)}function nn(e,t){let r={};return function(e){for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}(e)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):td(e,(e,n)=>{let i=nr(n,t.childContextForField(e));null!=i&&(r[e]=i)}),{mapValue:{fields:r}}}function ni(e){return"object"==typeof e&&null!==e&&!(e instanceof Array)&&!(e instanceof Date)&&!(e instanceof tb)&&!(e instanceof rY)&&!(e instanceof rK)&&!(e instanceof rG)&&!(e instanceof rQ)&&!(e instanceof rJ)}function ns(e,t,r){if(!ni(r)||!("object"==typeof r&&null!==r&&(Object.getPrototypeOf(r)===Object.prototype||null===Object.getPrototypeOf(r)))){let n=e8(r);if("an object"===n)throw t.createError(e+" a custom object");throw t.createError(e+" "+n)}}function na(e,t,r){if((t=P(t))instanceof rW)return t._internalPath;if("string"==typeof t)return nl(e,t);throw nu("Field path arguments must be of type string or ",e,!1,void 0,r)}let no=RegExp("[~\\*/\\[\\]]");function nl(e,t,r){if(t.search(no)>=0)throw nu(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,r);try{return new rW(...t.split("."))._internalPath}catch(n){throw nu(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,r)}}function nu(e,t,r,n,i){let s=n&&!n.isEmpty(),a=void 0!==i,o=`Function ${t}() called with invalid data`;r&&(o+=" (via `toFirestore()`)"),o+=". ";let l="";return(s||a)&&(l+=" (found",s&&(l+=` in field ${n}`),a&&(l+=` in document ${i}`),l+=")"),new eU(eM.INVALID_ARGUMENT,o+e+l)}function nc(e,t){return e.some(e=>e.isEqual(t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nd{constructor(e,t,r,n,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=n,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new rG(this._firestore,this._converter,this._key)}exists(){return null!==this._document}data(){if(this._document){if(!this._converter)return this._userDataWriter.convertValue(this._document.data.value);{let e=new nh(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}}}get(e){if(this._document){let t=this._document.data.field(nm("DocumentSnapshot.get",e));if(null!==t)return this._userDataWriter.convertValue(t)}}}class nh extends nd{data(){return super.data()}}class nf{constructor(e,t){this._docs=t,this.query=e}get docs(){return[...this._docs]}get size(){return this.docs.length}get empty(){return 0===this.docs.length}forEach(e,t){this._docs.forEach(e,t)}}function np(e,t){return(e=getModularInstance(e),t=getModularInstance(t),e instanceof nd&&t instanceof nd)?e._firestore===t._firestore&&e._key.isEqual(t._key)&&(null===e._document?null===t._document:e._document.isEqual(t._document))&&e._converter===t._converter:e instanceof nf&&t instanceof nf&&function(e,t){if(e=getModularInstance(e),t=getModularInstance(t),e instanceof rq&&t instanceof rq){var r,n;return e.firestore===t.firestore&&(r=e._query,n=t._query,function(e,t){if(e.limit!==t.limit||e.orderBy.length!==t.orderBy.length)return!1;for(let i=0;i<e.orderBy.length;i++){var r,n;if(r=e.orderBy[i],n=t.orderBy[i],!(r.dir===n.dir&&r.field.isEqual(n.field)))return!1}if(e.filters.length!==t.filters.length)return!1;for(let r=0;r<e.filters.length;r++)if(!function e(t,r){return t instanceof t$?r instanceof t$&&t.op===r.op&&t.field.isEqual(r.field)&&tT(t.value,r.value):t instanceof tB?r instanceof tB&&t.op===r.op&&t.filters.length===r.filters.length&&t.filters.reduce((t,n,i)=>t&&e(n,r.filters[i]),!0):void eF()}(e.filters[r],t.filters[r]))return!1;return!!(e.collectionGroup===t.collectionGroup&&e.path.isEqual(t.path)&&tM(e.startAt,t.startAt))&&tM(e.endAt,t.endAt)}(rn(r),rn(n))&&r.limitType===n.limitType)&&e.converter===t.converter}return!1}(e.query,t.query)&&tu(e.docs,t.docs,np)}function nm(e,t){return"string"==typeof t?nl(e,t):t instanceof rW?t._internalPath:t._delegate._internalPath}class ng{}class ny extends ng{}class nb extends ny{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new nb(e,t,r)}_apply(e){let t=this._parse(e);return nT(e._query,t),new rq(e.firestore,e.converter,ri(e._query,t))}_parse(e){let t=r3(e.firestore);return function(e,t,r,n,i,s,a){let o;if(i.isKeyField()){if("array-contains"===s||"array-contains-any"===s)throw new eU(eM.INVALID_ARGUMENT,`Invalid Query. You can't perform '${s}' queries on documentId().`);if("in"===s||"not-in"===s){nA(a,s);let t=[];for(let r of a)t.push(nI(n,e,r));o={arrayValue:{values:t}}}else o=nI(n,e,a)}else("in"===s||"not-in"===s||"array-contains-any"===s)&&nA(a,s),o=nt(r,t,a,"in"===s||"not-in"===s);return t$.create(i,s,o)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}class nv extends ng{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new nv(e,t)}_parse(e){let t=this._queryConstraints.map(t=>t._parse(e)).filter(e=>e.getFilters().length>0);return 1===t.length?t[0]:tB.create(t,this._getOperator())}_apply(e){let t=this._parse(e);return 0===t.getFilters().length?e:(function(e,t){let r=e;for(let e of t.getFlattenedFilters())nT(r,e),r=ri(r,e)}(e._query,t),new rq(e.firestore,e.converter,ri(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return"and"===this.type?"and":"or"}}class nx extends ny{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new nx(e,t)}_apply(e){let t=function(e,t,r){if(null!==e.startAt)throw new eU(eM.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(null!==e.endAt)throw new eU(eM.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new tJ(t,r)}(e._query,this._field,this._direction);return new rq(e.firestore,e.converter,function(e,t){let r=e.explicitOrderBy.concat([t]);return new re(e.path,e.collectionGroup,r,e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)}(e._query,t))}}class nw extends ny{constructor(e,t,r){super(),this.type=e,this._limit=t,this._limitType=r}static _create(e,t,r){return new nw(e,t,r)}_apply(e){var t,r,n;return new rq(e.firestore,e.converter,(t=e._query,r=this._limit,n=this._limitType,new re(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),r,n,t.startAt,t.endAt)))}}class n_ extends ny{constructor(e,t,r){super(),this.type=e,this._docOrFields=t,this._inclusive=r}static _create(e,t,r){return new n_(e,t,r)}_apply(e){var t;let r=nN(e,this.type,this._docOrFields,this._inclusive);return new rq(e.firestore,e.converter,new re((t=e._query).path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),t.limit,t.limitType,r,t.endAt))}}class nE extends ny{constructor(e,t,r){super(),this.type=e,this._docOrFields=t,this._inclusive=r}static _create(e,t,r){return new nE(e,t,r)}_apply(e){var t;let r=nN(e,this.type,this._docOrFields,this._inclusive);return new rq(e.firestore,e.converter,new re((t=e._query).path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),t.limit,t.limitType,t.startAt,r))}}function nN(e,t,r,n){if(r[0]=P(r[0]),r[0]instanceof nd)return function(e,t,r,n,i){if(!n)throw new eU(eM.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${r}().`);let s=[];for(let r of rr(e))if(r.field.isKeyField())s.push(tC(t,n.key));else{let e=n.data.field(r.field);if(tv(e))throw new eU(eM.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+r.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(null!==e)s.push(e);else{let e=r.field.canonicalString();throw new eU(eM.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${e}' (used as the orderBy) does not exist.`)}}return new tF(s,i)}(e._query,e.firestore._databaseId,t,r[0]._document,n);{let i=r3(e.firestore);return function(e,t,r,n,i,s){let a=e.explicitOrderBy;if(i.length>a.length)throw new eU(eM.INVALID_ARGUMENT,`Too many arguments provided to ${n}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);let o=[];for(let s=0;s<i.length;s++){let l=i[s];if(a[s].field.isKeyField()){if("string"!=typeof l)throw new eU(eM.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${n}(), but got a ${typeof l}`);if(!rt(e)&&-1!==l.indexOf("/"))throw new eU(eM.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${n}() must be a plain document ID, but '${l}' contains a slash.`);let r=e.path.child(e1.fromString(l));if(!e3.isDocumentKey(r))throw new eU(eM.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${n}() must result in a valid document path, but '${r}' is not because it contains an odd number of segments.`);let i=new e3(r);o.push(tC(t,i))}else{let e=nt(r,n,l);o.push(e)}}return new tF(o,s)}(e._query,e.firestore._databaseId,i,t,r,n)}}function nI(e,t,r){if("string"==typeof(r=P(r))){if(""===r)throw new eU(eM.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!rt(t)&&-1!==r.indexOf("/"))throw new eU(eM.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${r}' contains a '/' character.`);let n=t.path.child(e1.fromString(r));if(!e3.isDocumentKey(n))throw new eU(eM.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return tC(e,new e3(n))}if(r instanceof rG)return tC(e,r._key);throw new eU(eM.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${e8(r)}.`)}function nA(e,t){if(!Array.isArray(e)||0===e.length)throw new eU(eM.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function nT(e,t){let r=function(e,t){for(let r of e)for(let e of r.getFlattenedFilters())if(t.indexOf(e.op)>=0)return e.op;return null}(e.filters,function(e){switch(e){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(null!==r){if(r===t.op)throw new eU(eM.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`);throw new eU(eM.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${r.toString()}' filters.`)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nS{convertValue(e,t="none"){switch(tA(e)){case 0:return null;case 1:return e.booleanValue;case 2:return tg(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(ty(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw eF()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){let r={};return td(e,(e,n)=>{r[e]=this.convertValue(n,t)}),r}convertVectorValue(e){var t,r,n;return new rJ(null===(n=null===(r=null===(t=e.fields)||void 0===t?void 0:t[tI].arrayValue)||void 0===r?void 0:r.values)||void 0===n?void 0:n.map(e=>tg(e.doubleValue)))}convertGeoPoint(e){return new rY(tg(e.latitude),tg(e.longitude))}convertArray(e,t){return(e.values||[]).map(e=>this.convertValue(e,t))}convertServerTimestamp(e,t){switch(t){case"previous":let r=function e(t){let r=t.mapValue.fields.__previous_value__;return tv(r)?e(r):r}(e);if(null==r)return null;return this.convertValue(r,t);case"estimate":return this.convertTimestamp(tx(e));default:return null}}convertTimestamp(e){let t=tm(e);return new tb(t.seconds,t.nanos)}convertDocumentKey(e,t){let r=e1.fromString(e);rP(r)||eF();let n=new eX(r.get(1),r.get(3)),i=new e3(r.popFirst(5));return n.isEqual(t)||eR(`Document ${i} contains a document reference within a different database (${n.projectId}/${n.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}class nD extends nS{constructor(e){super(),this.firestore=e}convertBytes(e){return new rK(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new rG(this.firestore,null,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nk{constructor(e,t,r,n,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=n,this.removalCallback=i,this.deferred=new e$,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(e=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,n,i){let s=new nk(e,t,Date.now()+r,n,i);return s.start(r),s}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new eU(eM.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}eC="10.14.1_lite",ed(new C("firestore/lite",(e,{instanceIdentifier:t,options:r})=>{let n=e.getProvider("app").getImmediate(),i=new rz(new eG(e.getProvider("auth-internal")),new eQ(e.getProvider("app-check-internal")),function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new eU(eM.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new eX(e.options.projectId,t)}(n,t),n);return r&&i._setSettings(r),i},"PUBLIC").setMultipleInstances(!0)),eg("firestore-lite",ek,"node"),eg("firestore-lite",ek,"esm2017");let nP=function(e,t){let r=(function(e,t){let r=e.container.getProvider("heartbeat").getImmediate({optional:!0});return r&&r.triggerHeartbeat(),e.container.getProvider(t)})("object"==typeof e?e:function(e=es){let t=eo.get(e);if(!t&&e===es&&N())return ep();if(!t)throw eh.create("no-app",{appName:e});return t}(),"firestore/lite").getImmediate({identifier:"string"==typeof e?e:"(default)"});if(!r._initialized){let e=E("firestore");e&&function(e,t,r,n={}){var i;let s=(e=e7(e,rz))._getSettings(),a=`${t}:${r}`;if(s.host!==r$&&s.host!==a&&eO("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),e._setSettings(Object.assign(Object.assign({},s),{host:a,ssl:!1})),n.mockUserToken){let t,r;if("string"==typeof n.mockUserToken)t=n.mockUserToken,r=eP.MOCK_USER;else{t=/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e,t){if(e.uid)throw Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let r=t||"demo-project",n=e.iat||0,i=e.sub||e.user_id;if(!i)throw Error("mockUserToken must contain 'sub' or 'user_id' field!");let s=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:n,exp:n+3600,auth_time:n,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},e);return[g(JSON.stringify({alg:"none",type:"JWT"})),g(JSON.stringify(s)),""].join(".")}(n.mockUserToken,null===(i=e._app)||void 0===i?void 0:i.options.projectId);let s=n.mockUserToken.sub||n.mockUserToken.user_id;if(!s)throw new eU(eM.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");r=new eP(s)}e._authCredentials=new eq(new eB(t,r))}}(r,...e)}return r}(0===em().length?ep({apiKey:"AIzaSyA8EiDjTF2cP7qSR2I2yfCpQPJCbgKRS9U",authDomain:"pap-pedidos.firebaseapp.com",projectId:"pap-pedidos",storageBucket:"pap-pedidos.firebasestorage.app",messagingSenderId:"679874242664",appId:"1:679874242664:web:962988e7960053ad43f3dd"}):em()[0]);async function nC(){let e=function(e,t,...r){let n=[];for(let i of(t instanceof ng&&n.push(t),function(e){let t=e.filter(e=>e instanceof nv).length,r=e.filter(e=>e instanceof nb).length;if(t>1||t>0&&r>0)throw new eU(eM.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(n=n.concat(r)),n))e=i._apply(e);return e}(function(e,t,...r){if(e=P(e),e5("collection","path",t),e instanceof rz){let n=e1.fromString(t,...r);return e9(n),new rH(e,null,n)}{if(!(e instanceof rG)&&!(e instanceof rH))throw new eU(eM.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let n=e._path.child(e1.fromString(t,...r));return e9(n),new rH(e.firestore,null,n)}}(nP,"pedidos"),function(e,t="asc"){let r=nm("orderBy",e);return nx._create(r,t)}("createdAt","desc"));return(await function(e){!/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){if("L"===e.limitType&&0===e.explicitOrderBy.length)throw new eU(eM.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}((e=e7(e,rq))._query);let t=rU(e.firestore),r=new nD(e.firestore);return rL(t,e._query).then(t=>{let n=t.map(t=>new nh(e.firestore,r,t.key,t,e.converter));return"L"===e._query.limitType&&n.reverse(),new nf(e,n)})}(e)).docs.map(e=>({id:e.id,...e.data()})).filter(e=>("em_producao"===e.statusProducao||"em_atraso"===e.statusProducao||"pronto"===e.statusProducao)&&"retirada"!==e.status)}async function nj(e,t){let r=function(e,t,...r){if(e=P(e),1==arguments.length&&(t=to.newId()),e5("doc","path",t),e instanceof rz){let n=e1.fromString(t,...r);return e6(n),new rG(e,null,new e3(n))}{if(!(e instanceof rG)&&!(e instanceof rH))throw new eU(eM.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let n=e._path.child(e1.fromString(t,...r));return e6(n),new rG(e.firestore,e instanceof rH?e.converter:null,new e3(n))}}(nP,"pedidos",e),n=e=>Array.isArray(e)?e.map(n):null!==e&&"object"==typeof e?Object.fromEntries(Object.entries(e).filter(([,e])=>void 0!==e).map(([e,t])=>[e,n(t)])):e;await function(e,t,r,...n){let i;let s=r3((e=e7(e,rG)).firestore);return i="string"==typeof(t=P(t))||t instanceof rW?function(e,t,r,n,i,s){let a=e.createContext(1,t,r),o=[na(t,n,r)],l=[i];if(s.length%2!=0)throw new eU(eM.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let e=0;e<s.length;e+=2)o.push(na(t,s[e])),l.push(s[e+1]);let u=[],c=t6.empty();for(let e=o.length-1;e>=0;--e)if(!nc(u,o[e])){let t=o[e],r=l[e];r=P(r);let n=a.childContextForFieldPath(t);if(r instanceof r5)u.push(t);else{let e=nr(r,n);null!=e&&(u.push(t),c.set(t,e))}}return new r0(c,new t5(u),a.fieldTransforms)}(s,"updateDoc",e._key,t,void 0,n):function(e,t,r,n){let i=e.createContext(1,t,r);ns("Data must be an object, but it was:",i,n);let s=[],a=t6.empty();return td(n,(e,n)=>{let o=nl(t,e,r);n=P(n);let l=i.childContextForFieldPath(o);if(n instanceof r5)s.push(o);else{let e=nr(n,l);null!=e&&(s.push(o),a.set(o,e))}}),new r0(a,new t5(s),i.fieldTransforms)}(s,"updateDoc",e._key,t),rR(rU(e.firestore),[i.toMutation(e._key,rf.exists(!0))])}(r,n({...t,updatedAt:new Date().toISOString()}))}async function nV(e,t,r){await nj(e,{statusProducao:"em_atraso",dataEntregaNovaProducao:t,motivoAtraso:r})}async function nR(e){await nj(e,{statusProducao:"pronto"})}async function nO(e){await nj(e,{statusProducao:"em_producao",dataEntregaNovaProducao:void 0,motivoAtraso:void 0})}/**
 * @license lucide-react v0.379.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let nL=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),nF=(...e)=>e.filter((e,t,r)=>!!e&&r.indexOf(e)===t).join(" ");/**
 * @license lucide-react v0.379.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var nM={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.379.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let nU=(0,c.forwardRef)(({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:n,className:i="",children:s,iconNode:a,...o},l)=>(0,c.createElement)("svg",{ref:l,...nM,width:t,height:t,stroke:e,strokeWidth:n?24*Number(r)/Number(t):r,className:nF("lucide",i),...o},[...a.map(([e,t])=>(0,c.createElement)(e,t)),...Array.isArray(s)?s:[s]])),n$=(e,t)=>{let r=(0,c.forwardRef)(({className:r,...n},i)=>(0,c.createElement)(nU,{ref:i,iconNode:t,className:nF(`lucide-${nL(e)}`,r),...n}));return r.displayName=`${e}`,r},nB=n$("Package",[["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]]),nz=n$("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]),nq=n$("CircleCheckBig",[["path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14",key:"g774vq"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]),nG=n$("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]),nH=n$("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),nK=n$("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]),nW=n$("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]),nQ=n$("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]),nY=n$("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]),nJ={data:""},nX=e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||nJ},nZ=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,n0=/\/\*[^]*?\*\/|  +/g,n1=/\n+/g,n2=(e,t)=>{let r="",n="",i="";for(let s in e){let a=e[s];"@"==s[0]?"i"==s[1]?r=s+" "+a+";":n+="f"==s[1]?n2(a,s):s+"{"+n2(a,"k"==s[1]?"":t)+"}":"object"==typeof a?n+=n2(a,t?t.replace(/([^,])+/g,e=>s.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):s):null!=a&&(s="-"==s[1]?s:s.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=n2.p?n2.p(s,a):s+":"+a+";")}return r+(t&&i?t+"{"+i+"}":i)+n},n4={},n3=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+n3(e[r]);return t}return e},n5=(e,t,r,n,i)=>{let s=n3(e),a=n4[s]||(n4[s]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(s));if(!n4[a]){let t=s!==e?e:(e=>{let t,r,n=[{}];for(;t=nZ.exec(e.replace(n0,""));)t[4]?n.shift():t[3]?(r=t[3].replace(n1," ").trim(),n.unshift(n[0][r]=n[0][r]||{})):n[0][t[1]]=t[2].replace(n1," ").trim();return n[0]})(e);n4[a]=n2(i?{["@keyframes "+a]:t}:t,r?"":"."+a)}let o=r&&n4.g;return r&&(n4.g=n4[a]),((e,t,r,n)=>{n?t.data=t.data.replace(n,e):-1===t.data.indexOf(e)&&(t.data=r?e+t.data:t.data+e)})(n4[a],t,n,o),a},n6=(e,t,r)=>e.reduce((e,n,i)=>{let s=t[i];if(s&&s.call){let e=s(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;s=t?"."+t:e&&"object"==typeof e?e.props?"":n2(e,""):!1===e?"":e}return e+n+(null==s?"":s)},"");function n9(e){let t=this||{},r=e.call?e(t.p):e;return n5(r.unshift?r.raw?n6(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,nX(t.target),t.g,t.o,t.k)}n9.bind({g:1});let n8,n7,ie,it=n9.bind({k:1});function ir(e,t){let r=this||{};return function(){let n=arguments;function i(s,a){let o=Object.assign({},s),l=o.className||i.className;r.p=Object.assign({theme:n7&&n7()},o),r.o=/go\d/.test(l),o.className=n9.apply(r,n)+(l?" "+l:""),t&&(o.ref=a);let u=e;return e[0]&&(u=o.as||e,delete o.as),ie&&u[0]&&ie(o),n8(u,o)}return t?t(i):i}}var ii=e=>"function"==typeof e,is=(e,t)=>ii(e)?e(t):e,ia=(()=>{let e=0;return()=>(++e).toString()})(),io=(()=>{let e;return()=>e})(),il="default",iu=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:n}=t;return iu(e,{type:e.toasts.find(e=>e.id===n.id)?1:0,toast:n});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||void 0===i?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let s=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+s}))}}},ic=[],id={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},ih={},ip=(e,t=il)=>{ih[t]=iu(ih[t]||id,e),ic.forEach(([e,r])=>{e===t&&r(ih[t])})},im=e=>Object.keys(ih).forEach(t=>ip(e,t)),ig=e=>Object.keys(ih).find(t=>ih[t].toasts.some(t=>t.id===e)),iy=(e=il)=>t=>{ip(t,e)},ib={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},iv=(e={},t=il)=>{let[r,n]=(0,c.useState)(ih[t]||id),i=(0,c.useRef)(ih[t]);(0,c.useEffect)(()=>(i.current!==ih[t]&&n(ih[t]),ic.push([t,n]),()=>{let e=ic.findIndex(([e])=>e===t);e>-1&&ic.splice(e,1)}),[t]);let s=r.toasts.map(t=>{var r,n,i;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(n=e[t.type])?void 0:n.duration)||(null==e?void 0:e.duration)||ib[t.type],style:{...e.style,...null==(i=e[t.type])?void 0:i.style,...t.style}}});return{...r,toasts:s}},ix=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||ia()}),iw=e=>(t,r)=>{let n=ix(t,e,r);return iy(n.toasterId||ig(n.id))({type:2,toast:n}),n.id},i_=(e,t)=>iw("blank")(e,t);i_.error=iw("error"),i_.success=iw("success"),i_.loading=iw("loading"),i_.custom=iw("custom"),i_.dismiss=(e,t)=>{let r={type:3,toastId:e};t?iy(t)(r):im(r)},i_.dismissAll=e=>i_.dismiss(void 0,e),i_.remove=(e,t)=>{let r={type:4,toastId:e};t?iy(t)(r):im(r)},i_.removeAll=e=>i_.remove(void 0,e),i_.promise=(e,t,r)=>{let n=i_.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let i=t.success?is(t.success,e):void 0;return i?i_.success(i,{id:n,...r,...null==r?void 0:r.success}):i_.dismiss(n),e}).catch(e=>{let i=t.error?is(t.error,e):void 0;i?i_.error(i,{id:n,...r,...null==r?void 0:r.error}):i_.dismiss(n)}),e};var iE=1e3,iN=(e,t="default")=>{let{toasts:r,pausedAt:n}=iv(e,t),i=(0,c.useRef)(new Map).current,s=(0,c.useCallback)((e,t=iE)=>{if(i.has(e))return;let r=setTimeout(()=>{i.delete(e),a({type:4,toastId:e})},t);i.set(e,r)},[]);(0,c.useEffect)(()=>{if(n)return;let e=Date.now(),i=r.map(r=>{if(r.duration===1/0)return;let n=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(n<0){r.visible&&i_.dismiss(r.id);return}return setTimeout(()=>i_.dismiss(r.id,t),n)});return()=>{i.forEach(e=>e&&clearTimeout(e))}},[r,n,t]);let a=(0,c.useCallback)(iy(t),[t]),o=(0,c.useCallback)(()=>{a({type:5,time:Date.now()})},[a]),l=(0,c.useCallback)((e,t)=>{a({type:1,toast:{id:e,height:t}})},[a]),u=(0,c.useCallback)(()=>{n&&a({type:6,time:Date.now()})},[n,a]),d=(0,c.useCallback)((e,t)=>{let{reverseOrder:n=!1,gutter:i=8,defaultPosition:s}=t||{},a=r.filter(t=>(t.position||s)===(e.position||s)&&t.height),o=a.findIndex(t=>t.id===e.id),l=a.filter((e,t)=>t<o&&e.visible).length;return a.filter(e=>e.visible).slice(...n?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+i,0)},[r]);return(0,c.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)s(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[r,s]),{toasts:r,handlers:{updateHeight:l,startPause:o,endPause:u,calculateOffset:d}}},iI=it`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,iA=it`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,iT=it`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,iS=ir("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${iI} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${iA} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${iT} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,iD=it`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,ik=ir("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${iD} 1s linear infinite;
`,iP=it`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,iC=it`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,ij=ir("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${iP} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${iC} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,iV=ir("div")`
  position: absolute;
`,iR=ir("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,iO=it`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,iL=ir("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${iO} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,iF=({toast:e})=>{let{icon:t,type:r,iconTheme:n}=e;return void 0!==t?"string"==typeof t?c.createElement(iL,null,t):t:"blank"===r?null:c.createElement(iR,null,c.createElement(ik,{...n}),"loading"!==r&&c.createElement(iV,null,"error"===r?c.createElement(iS,{...n}):c.createElement(ij,{...n})))},iM=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,iU=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,i$=ir("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,iB=ir("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,iz=(e,t)=>{let r=e.includes("top")?1:-1,[n,i]=io()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[iM(r),iU(r)];return{animation:t?`${it(n)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${it(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},iq=c.memo(({toast:e,position:t,style:r,children:n})=>{let i=e.height?iz(e.position||t||"top-center",e.visible):{opacity:0},s=c.createElement(iF,{toast:e}),a=c.createElement(iB,{...e.ariaProps},is(e.message,e));return c.createElement(i$,{className:e.className,style:{...i,...r,...e.style}},"function"==typeof n?n({icon:s,message:a}):c.createElement(c.Fragment,null,s,a))});a=c.createElement,n2.p=void 0,n8=a,n7=void 0,ie=void 0;var iG=({id:e,className:t,style:r,onHeightUpdate:n,children:i})=>{let s=c.useCallback(t=>{if(t){let r=()=>{n(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,n]);return c.createElement("div",{ref:s,className:t,style:r},i)},iH=(e,t)=>{let r=e.includes("top"),n=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:io()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...r?{top:0}:{bottom:0},...n}},iK=n9`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,iW=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:n,children:i,toasterId:s,containerStyle:a,containerClassName:o})=>{let{toasts:l,handlers:u}=iN(r,s);return c.createElement("div",{"data-rht-toaster":s||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...a},className:o,onMouseEnter:u.startPause,onMouseLeave:u.endPause},l.map(r=>{let s=r.position||t,a=iH(s,u.calculateOffset(r,{reverseOrder:e,gutter:n,defaultPosition:t}));return c.createElement(iG,{id:r.id,key:r.id,onHeightUpdate:u.updateHeight,className:r.visible?iK:"",style:a},"custom"===r.type?is(r.message,r):i?i(r):c.createElement(iq,{toast:r,position:s}))}))};let iQ="https://passoapassouniformes.com/formalizarpedido",iY=[{key:"em_producao",label:"Em Produ\xe7\xe3o",headerBg:"bg-blue-100",headerText:"text-blue-800",dot:"bg-blue-500",icon:u.jsx(nB,{size:15})},{key:"em_atraso",label:"Em Atraso",headerBg:"bg-red-100",headerText:"text-red-800",dot:"bg-red-500",icon:u.jsx(nz,{size:15})},{key:"pronto",label:"Pedido Pronto",headerBg:"bg-emerald-100",headerText:"text-emerald-800",dot:"bg-emerald-500",icon:u.jsx(nq,{size:15})}];function iJ(){let[e,t]=(0,c.useState)([]),[r,n]=(0,c.useState)(!0),[i,s]=(0,c.useState)(null),[a,o]=(0,c.useState)(null),[l,d]=(0,c.useState)(""),[h,f]=(0,c.useState)(""),[p,m]=(0,c.useState)(!1),[g,y]=(0,c.useState)(null),[b,v]=(0,c.useState)("");async function x(){n(!0);try{t(await nC())}catch{i_.error("Erro ao carregar pedidos")}finally{n(!1)}}function w(e){return"empresa"===e.clienteType?e.clienteEmpresa?.razaoSocial||"—":e.clientePF?.nomeCompleto||"—"}function _(e){if(!e)return"—";let[t,r,n]=e.split("-");return`${n}/${r}/${t}`}function E(e){let t="em_atraso"===e.statusProducao&&e.dataEntregaNovaProducao?e.dataEntregaNovaProducao:e.dataEntregaPrevista;if(!t)return 999;let r=new Date(t);r.setHours(0,0,0,0);let n=new Date;return n.setHours(0,0,0,0),Math.floor((r.getTime()-n.getTime())/864e5)}async function N(e){s(e.id);try{await nO(e.id),t(t=>t.map(t=>t.id===e.id?{...t,statusProducao:"em_producao",dataEntregaNovaProducao:void 0,motivoAtraso:void 0}:t)),i_.success("Movido para Em Produ\xe7\xe3o")}catch{i_.error("Erro ao mover")}finally{s(null)}}async function I(t){let r=e.find(e=>e.id===t);d(r?.dataEntregaNovaProducao||r?.dataEntregaPrevista||""),f(r?.motivoAtraso||""),o(t)}async function A(){if(!a||!l.trim()){i_.error("Informe a nova data de entrega");return}m(!0);try{await nV(a,l,h),t(e=>e.map(e=>e.id===a?{...e,statusProducao:"em_atraso",dataEntregaNovaProducao:l,motivoAtraso:h}:e)),o(null),i_.success("Pedido marcado como Em Atraso")}catch{i_.error("Erro ao salvar")}finally{m(!1)}}async function T(e){s(e.id);try{await nR(e.id),t(t=>t.map(t=>t.id===e.id?{...t,statusProducao:"pronto"}:t)),i_.success("Pedido marcado como Pronto!")}catch{i_.error("Erro ao mover")}finally{s(null)}}let S=iY.map(t=>({...t,cards:[...function(e){if(!b.trim())return e;let t=b.toLowerCase();return e.filter(e=>w(e).toLowerCase().includes(t)||(e.numeroPedido||"").toLowerCase().includes(t)||(e.numeroPedidoSistema||"").toLowerCase().includes(t))}(e.filter(e=>e.statusProducao===t.key))].sort((e,t)=>E(e)-E(t)),total:e.filter(e=>e.statusProducao===t.key).length}));return(0,u.jsxs)("div",{className:"min-h-screen bg-gray-100 flex flex-col",children:[u.jsx(iW,{position:"top-right"}),u.jsx("header",{className:"bg-white border-b border-gray-200 shadow-sm flex-shrink-0",children:(0,u.jsxs)("div",{className:"px-4 py-3 flex items-center justify-between gap-3",children:[(0,u.jsxs)("div",{className:"flex items-center gap-3 flex-shrink-0",children:[u.jsx("img",{src:"/controledeproducao/logo-pap.png",alt:"Passo a Passo",className:"h-9 w-auto"}),(0,u.jsxs)("div",{children:[u.jsx("h1",{className:"text-base font-bold text-gray-900",children:"Passo a Passo Uniformes"}),u.jsx("p",{className:"text-xs text-gray-500",children:"Controle de Produ\xe7\xe3o"})]})]}),(0,u.jsxs)("div",{className:"flex items-center gap-3",children:[(0,u.jsxs)("div",{className:"relative",children:[u.jsx(nG,{size:13,className:"absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"}),u.jsx("input",{type:"text",value:b,onChange:e=>v(e.target.value),placeholder:"Buscar pedido, cliente ou n\xba sistema...",className:"pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-64 bg-white"}),b&&u.jsx("button",{onClick:()=>v(""),className:"absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",children:u.jsx(nH,{size:12})})]}),(0,u.jsxs)("div",{className:"flex items-center gap-4 text-xs text-gray-500",children:[(0,u.jsxs)("span",{className:"flex items-center gap-1",children:[u.jsx("span",{className:"w-2 h-2 rounded-full bg-blue-500 inline-block"}),S[0].total," em produ\xe7\xe3o"]}),(0,u.jsxs)("span",{className:"flex items-center gap-1",children:[u.jsx("span",{className:"w-2 h-2 rounded-full bg-red-500 inline-block"}),S[1].total," em atraso"]}),(0,u.jsxs)("span",{className:"flex items-center gap-1",children:[u.jsx("span",{className:"w-2 h-2 rounded-full bg-emerald-500 inline-block"}),S[2].total," prontos"]})]}),(0,u.jsxs)("a",{href:iQ+"/",target:"_blank",rel:"noopener noreferrer",className:"flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition",children:[u.jsx(nK,{size:12}),"Formaliza\xe7\xe3o"]}),(0,u.jsxs)("button",{onClick:x,className:"flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition",children:[u.jsx(nW,{size:13,className:r?"animate-spin":""}),"Atualizar"]})]})]})}),u.jsx("div",{className:"flex-1 overflow-x-auto p-4",children:r?u.jsx("div",{className:"flex items-center justify-center h-64 text-gray-400 text-sm",children:"Carregando pedidos..."}):u.jsx("div",{className:"flex gap-4 items-start min-w-[900px]",children:S.map(e=>(0,u.jsxs)("div",{className:"flex-1 min-w-[280px] flex flex-col gap-2",children:[(0,u.jsxs)("div",{className:`${e.headerBg} rounded-xl px-4 py-3 flex items-center justify-between`,children:[(0,u.jsxs)("div",{className:`flex items-center gap-2 font-bold text-sm ${e.headerText}`,children:[e.icon,e.label]}),u.jsx("span",{className:`${e.headerBg} border ${"em_producao"===e.key?"border-blue-300":"em_atraso"===e.key?"border-red-300":"border-emerald-300"} text-xs font-bold px-2 py-0.5 rounded-full ${e.headerText}`,children:b?`${e.cards.length}/${e.total}`:e.total})]}),(0,u.jsxs)("div",{className:"flex flex-col gap-2",children:[0===e.cards.length&&u.jsx("div",{className:"bg-white rounded-xl border border-dashed border-gray-200 p-6 text-center text-gray-400 text-xs",children:"Nenhum pedido aqui"}),e.cards.map(t=>{let r=function(e){let t=new Date(e.dataEntradaProducao||e.createdAt);t.setHours(0,0,0,0);let r=new Date;return r.setHours(0,0,0,0),Math.max(0,Math.floor((r.getTime()-t.getTime())/864e5))}(t),n="pronto"!==e.key&&r>=5,s=t.modelos&&t.modelos.length>0?t.modelos.reduce((e,t)=>e+(t.quantidadeTotal||t.pecas?.length||0),0):t.quantidadeTotal||t.pecas?.length||0,a="em_atraso"===e.key&&t.dataEntregaNovaProducao?t.dataEntregaNovaProducao:t.dataEntregaPrevista,o=E(t),l=o<0,c=0===o,d=o>0&&o<=3;return(0,u.jsxs)("div",{className:`bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-3 relative transition hover:shadow-md
                          ${"em_atraso"===e.key?"border-red-200 bg-red-50/20":""}
                          ${"pronto"===e.key?"border-emerald-200":""}`,children:[(0,u.jsxs)("span",{className:`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full
                          ${n?"bg-red-500 text-white animate-pulse":r>=3?"bg-orange-400 text-white":"bg-gray-100 text-gray-500"}`,children:[n&&"⚠ ",r,"d"]}),(0,u.jsxs)("div",{children:[u.jsx("div",{className:"font-bold text-gray-900 text-sm pr-12 leading-tight",children:w(t)}),(0,u.jsxs)("div",{className:"text-xs text-gray-400 mt-0.5",children:["N\xba ",t.numeroPedido,t.numeroPedidoSistema&&(0,u.jsxs)("span",{className:"ml-1 text-blue-600 font-semibold",children:["\xb7 Sis: ",t.numeroPedidoSistema]})]})]}),(0,u.jsxs)("div",{className:"grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-600",children:[(0,u.jsxs)("div",{children:[u.jsx("span",{className:"text-gray-400",children:"Vendedor:"})," ",u.jsx("span",{className:"font-medium",children:t.nomeVendedor})]}),(0,u.jsxs)("div",{children:[u.jsx("span",{className:"text-gray-400",children:"Qtd:"})," ",(0,u.jsxs)("span",{className:"font-bold text-gray-800",children:[s," p\xe7"]})]}),(0,u.jsxs)("div",{children:[u.jsx("span",{className:"text-gray-400",children:"Pedido em:"})," ",u.jsx("span",{className:"font-medium",children:_(t.dataPedido)})]}),(0,u.jsxs)("div",{children:[u.jsx("span",{className:"text-gray-400",children:"em_atraso"===e.key?"Nova entrega:":"Entrega:"})," ",u.jsx("span",{className:`font-bold ${"em_atraso"===e.key||l?"text-red-600":d?"text-orange-600":"text-gray-800"}`,children:_(a)}),u.jsx("div",{className:`text-xs font-semibold mt-0.5 ${l?"text-red-600":c?"text-orange-600":d?"text-orange-500":"text-gray-400"}`,children:l?`⚠ ${Math.abs(o)}d atrasado`:c?"\uD83D\uDD34 Entrega hoje!":999===o?"—":`${o}d para entregar`})]})]}),"em_atraso"===e.key&&t.motivoAtraso&&(0,u.jsxs)("div",{className:"bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-xs text-red-700",children:[u.jsx("span",{className:"font-semibold",children:"Motivo: "}),t.motivoAtraso]}),u.jsx("button",{onClick:()=>y(t),className:"text-xs text-blue-500 hover:text-blue-700 text-left -mt-1 underline underline-offset-2",children:"Ver detalhes"}),(0,u.jsxs)("div",{className:"flex flex-col gap-2 pt-1 border-t border-gray-100",children:["em_producao"===e.key&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)("button",{onClick:()=>I(t.id),disabled:i===t.id,className:"w-full py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition",children:[u.jsx(nz,{size:11,className:"inline mr-1"}),"Marcar Em Atraso"]}),(0,u.jsxs)("button",{onClick:()=>T(t),disabled:i===t.id,className:"w-full py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition",children:[u.jsx(nq,{size:11,className:"inline mr-1"}),"Marcar Pronto"]})]}),"em_atraso"===e.key&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)("button",{onClick:()=>N(t),disabled:i===t.id,className:"w-full py-1.5 rounded-lg text-xs font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition",children:[u.jsx(nQ,{size:11,className:"inline mr-1"}),"Voltar p/ Em Produ\xe7\xe3o"]}),(0,u.jsxs)("button",{onClick:()=>I(t.id),disabled:i===t.id,className:"w-full py-1.5 rounded-lg text-xs font-semibold border border-orange-200 text-orange-600 hover:bg-orange-50 transition",children:[u.jsx(nY,{size:11,className:"inline mr-1"}),"Editar Atraso"]}),(0,u.jsxs)("button",{onClick:()=>T(t),disabled:i===t.id,className:"w-full py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition",children:[u.jsx(nq,{size:11,className:"inline mr-1"}),"Marcar Pronto"]})]}),"pronto"===e.key&&(0,u.jsxs)("button",{onClick:()=>N(t),disabled:i===t.id,className:"w-full py-1.5 rounded-lg text-xs font-semibold border border-blue-200 text-blue-600 hover:bg-blue-50 transition",children:[u.jsx(nQ,{size:11,className:"inline mr-1"}),"Voltar p/ Em Produ\xe7\xe3o"]})]})]},t.id)})]})]},e.key))})}),a&&u.jsx("div",{className:"fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4",children:(0,u.jsxs)("div",{className:"bg-white rounded-2xl shadow-2xl w-full max-w-md p-6",children:[(0,u.jsxs)("div",{className:"flex items-center justify-between mb-5",children:[(0,u.jsxs)("div",{className:"flex items-center gap-2",children:[u.jsx("div",{className:"w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center",children:u.jsx(nz,{size:18,className:"text-red-600"})}),(0,u.jsxs)("div",{children:[u.jsx("h2",{className:"font-bold text-gray-900",children:"Marcar Em Atraso"}),u.jsx("p",{className:"text-xs text-gray-500",children:"Informe a nova data e o motivo"})]})]}),u.jsx("button",{onClick:()=>o(null),className:"text-gray-400 hover:text-gray-600",children:u.jsx(nH,{size:18})})]}),(0,u.jsxs)("div",{className:"flex flex-col gap-4",children:[(0,u.jsxs)("div",{children:[(0,u.jsxs)("label",{className:"block text-sm font-semibold text-gray-700 mb-1",children:["Nova Data de Entrega Prevista ",u.jsx("span",{className:"text-red-500",children:"*"})]}),u.jsx("input",{type:"date",value:l,onChange:e=>d(e.target.value),className:"input-base"})]}),(0,u.jsxs)("div",{children:[u.jsx("label",{className:"block text-sm font-semibold text-gray-700 mb-1",children:"Motivo do Atraso"}),u.jsx("textarea",{value:h,onChange:e=>f(e.target.value),placeholder:"Ex: aguardando tecido, problema no fornecedor...",rows:3,className:"input-base resize-none"})]})]}),(0,u.jsxs)("div",{className:"flex gap-3 mt-6",children:[u.jsx("button",{onClick:()=>o(null),className:"flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition",children:"Cancelar"}),u.jsx("button",{onClick:A,disabled:p||!l,className:"flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-bold transition",children:p?"Salvando...":"Confirmar Atraso"})]})]})}),g&&u.jsx("div",{className:"fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4",children:(0,u.jsxs)("div",{className:"bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto",children:[(0,u.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,u.jsxs)("h2",{className:"font-bold text-gray-900 text-lg",children:["Pedido ",g.numeroPedido]}),u.jsx("button",{onClick:()=>y(null),className:"text-gray-400 hover:text-gray-600",children:u.jsx(nH,{size:18})})]}),(0,u.jsxs)("div",{className:"flex flex-col gap-4",children:[(0,u.jsxs)("div",{className:"bg-gray-50 rounded-xl p-4",children:[u.jsx("p",{className:"text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2",children:"Cliente"}),u.jsx("p",{className:"font-bold text-gray-900",children:w(g)}),"empresa"===g.clienteType&&g.clienteEmpresa&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)("p",{className:"text-xs text-gray-500 mt-0.5",children:["CNPJ: ",g.clienteEmpresa.cnpj]}),(0,u.jsxs)("p",{className:"text-xs text-gray-500",children:[g.clienteEmpresa.telefone," \xb7 ",g.clienteEmpresa.email]}),(0,u.jsxs)("p",{className:"text-xs text-gray-500",children:[g.clienteEmpresa.cidade,"/",g.clienteEmpresa.estado]})]}),"pessoa_fisica"===g.clienteType&&g.clientePF&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)("p",{className:"text-xs text-gray-500 mt-0.5",children:[g.clientePF.telefone," \xb7 ",g.clientePF.email]}),(0,u.jsxs)("p",{className:"text-xs text-gray-500",children:[g.clientePF.cidade,"/",g.clientePF.estado]})]})]}),(0,u.jsxs)("div",{className:"grid grid-cols-2 gap-3 text-sm",children:[(0,u.jsxs)("div",{className:"bg-gray-50 rounded-xl p-3",children:[u.jsx("p",{className:"text-xs text-gray-400 mb-1",children:"Vendedor"}),u.jsx("p",{className:"font-semibold text-gray-800",children:g.nomeVendedor})]}),(0,u.jsxs)("div",{className:"bg-gray-50 rounded-xl p-3",children:[u.jsx("p",{className:"text-xs text-gray-400 mb-1",children:"N\xba Sistema"}),u.jsx("p",{className:"font-semibold text-gray-800",children:g.numeroPedidoSistema||"—"})]}),(0,u.jsxs)("div",{className:"bg-gray-50 rounded-xl p-3",children:[u.jsx("p",{className:"text-xs text-gray-400 mb-1",children:"Data do Pedido"}),u.jsx("p",{className:"font-semibold text-gray-800",children:_(g.dataPedido)})]}),(0,u.jsxs)("div",{className:"bg-gray-50 rounded-xl p-3",children:[u.jsx("p",{className:"text-xs text-gray-400 mb-1",children:"Entrega Prevista"}),u.jsx("p",{className:"font-semibold text-gray-800",children:_(g.dataEntregaPrevista)})]}),"em_atraso"===g.statusProducao&&g.dataEntregaNovaProducao&&(0,u.jsxs)("div",{className:"bg-red-50 border border-red-100 rounded-xl p-3 col-span-2",children:[u.jsx("p",{className:"text-xs text-red-400 mb-1",children:"Nova Data de Entrega"}),u.jsx("p",{className:"font-bold text-red-700",children:_(g.dataEntregaNovaProducao)}),g.motivoAtraso&&(0,u.jsxs)("p",{className:"text-xs text-red-600 mt-1",children:[u.jsx("strong",{children:"Motivo:"})," ",g.motivoAtraso]})]})]}),g.modelos&&g.modelos.length>0&&(0,u.jsxs)("div",{children:[u.jsx("p",{className:"text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2",children:"Modelos"}),u.jsx("div",{className:"flex flex-col gap-2",children:g.modelos.map((e,t)=>(0,u.jsxs)("div",{className:"bg-gray-50 rounded-xl p-3",children:[(0,u.jsxs)("p",{className:"font-semibold text-gray-800 text-sm",children:["Modelo ",t+1,": ",e.modelo]}),(0,u.jsxs)("p",{className:"text-xs text-gray-500",children:["Cor: ",e.cor," \xb7 ",e.quantidadeTotal||e.pecas?.length||0," pe\xe7as"]})]},e.id))})]}),void 0!==g.valorNegociacao&&(0,u.jsxs)("div",{className:"bg-blue-50 border border-blue-100 rounded-xl p-4",children:[u.jsx("p",{className:"text-xs text-blue-400 font-semibold uppercase tracking-wide mb-1",children:"Negocia\xe7\xe3o"}),(0,u.jsxs)("p",{className:"font-bold text-blue-800 text-sm",children:[g.valorNegociacao>=0?"+ R$":"- R$"," ",Math.abs(g.valorNegociacao).toFixed(2)]}),g.descricaoNegociacao&&u.jsx("p",{className:"text-xs text-blue-600 mt-1",children:g.descricaoNegociacao})]}),(0,u.jsxs)("a",{href:`${iQ}/pedido/${g.id}/`,target:"_blank",rel:"noopener noreferrer",className:"flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-200 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition",children:[u.jsx(nK,{size:14}),"Abrir ficha completa do pedido"]})]})]})})]})}},2029:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s,metadata:()=>i});var n=r(9510);r(5023);let i={title:"Passo a Passo — Controle de Produ\xe7\xe3o",description:"Sistema de Controle de Produ\xe7\xe3o"};function s({children:e}){return n.jsx("html",{lang:"pt-BR",children:n.jsx("body",{children:e})})}},5480:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>a,__esModule:()=>s,default:()=>o});var n=r(8570);let i=(0,n.createProxy)(String.raw`C:\Users\gusta\OneDrive\Área de Trabalho\PassoaPasso\controledeproducao\src\app\page.tsx`),{__esModule:s,$$typeof:a}=i;i.default;let o=(0,n.createProxy)(String.raw`C:\Users\gusta\OneDrive\Área de Trabalho\PassoaPasso\controledeproducao\src\app\page.tsx#default`)},5023:()=>{}};var t=require("../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[819],()=>r(3824));module.exports=n})();