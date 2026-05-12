"use strict";exports.id=630,exports.ids=[630],exports.modules={2881:(e,t,r)=>{r.d(t,{Z:()=>l});var n=r(7577);/**
 * @license lucide-react v0.379.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),s=(...e)=>e.filter((e,t,r)=>!!e&&r.indexOf(e)===t).join(" ");/**
 * @license lucide-react v0.379.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var a={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.379.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=(0,n.forwardRef)(({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:i,className:o="",children:l,iconNode:u,...c},h)=>(0,n.createElement)("svg",{ref:h,...a,width:t,height:t,stroke:e,strokeWidth:i?24*Number(r)/Number(t):r,className:s("lucide",o),...c},[...u.map(([e,t])=>(0,n.createElement)(e,t)),...Array.isArray(l)?l:[l]])),l=(e,t)=>{let r=(0,n.forwardRef)(({className:r,...a},l)=>(0,n.createElement)(o,{ref:l,iconNode:t,className:s(`lucide-${i(e)}`,r),...a}));return r.displayName=`${e}`,r}},5047:(e,t,r)=>{var n=r(7389);r.o(n,"useParams")&&r.d(t,{useParams:function(){return n.useParams}}),r.o(n,"useRouter")&&r.d(t,{useRouter:function(){return n.useRouter}})},7463:(e,t,r)=>{r.d(t,{Z:()=>u});var n=r(6113),i=r.n(n);let s={randomUUID:i().randomUUID},a=new Uint8Array(256),o=a.length,l=[];for(let e=0;e<256;++e)l.push((e+256).toString(16).slice(1));let u=function(e,t,r){if(s.randomUUID&&!t&&!e)return s.randomUUID();let n=(e=e||{}).random||(e.rng||function(){return o>a.length-16&&(i().randomFillSync(a),o=0),a.slice(o,o+=16)})();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,t){r=r||0;for(let e=0;e<16;++e)t[r+e]=n[e];return t}return function(e,t=0){return l[e[t+0]]+l[e[t+1]]+l[e[t+2]]+l[e[t+3]]+"-"+l[e[t+4]]+l[e[t+5]]+"-"+l[e[t+6]]+l[e[t+7]]+"-"+l[e[t+8]]+l[e[t+9]]+"-"+l[e[t+10]]+l[e[t+11]]+l[e[t+12]]+l[e[t+13]]+l[e[t+14]]+l[e[t+15]]}(n)}},3497:(e,t,r)=>{let n,i,s;r.d(t,{Jn:()=>F,qX:()=>L,Xd:()=>C,Mq:()=>U,C6:()=>M,ZF:()=>x,KN:()=>B});var a=r(7752),o=r(5036),l=r(2377);let u=(e,t)=>t.some(t=>e instanceof t),c=new WeakMap,h=new WeakMap,d=new WeakMap,f=new WeakMap,p=new WeakMap,m={get(e,t,r){if(e instanceof IDBTransaction){if("done"===t)return h.get(e);if("objectStoreNames"===t)return e.objectStoreNames||d.get(e);if("store"===t)return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return g(e[t])},set:(e,t,r)=>(e[t]=r,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function g(e){var t;if(e instanceof IDBRequest)return function(e){let t=new Promise((t,r)=>{let n=()=>{e.removeEventListener("success",i),e.removeEventListener("error",s)},i=()=>{t(g(e.result)),n()},s=()=>{r(e.error),n()};e.addEventListener("success",i),e.addEventListener("error",s)});return t.then(t=>{t instanceof IDBCursor&&c.set(t,e)}).catch(()=>{}),p.set(t,e),t}(e);if(f.has(e))return f.get(e);let r="function"==typeof(t=e)?t!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(i||(i=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(t)?function(...e){return t.apply(y(this),e),g(c.get(this))}:function(...e){return g(t.apply(y(this),e))}:function(e,...r){let n=t.call(y(this),e,...r);return d.set(n,e.sort?e.sort():[e]),g(n)}:(t instanceof IDBTransaction&&function(e){if(h.has(e))return;let t=new Promise((t,r)=>{let n=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",s),e.removeEventListener("abort",s)},i=()=>{t(),n()},s=()=>{r(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",i),e.addEventListener("error",s),e.addEventListener("abort",s)});h.set(e,t)}(t),u(t,n||(n=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])))?new Proxy(t,m):t;return r!==e&&(f.set(e,r),p.set(r,e)),r}let y=e=>p.get(e),v=["get","getKey","getAll","getAllKeys","count"],_=["put","add","delete","clear"],w=new Map;function E(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&"string"==typeof t))return;if(w.get(t))return w.get(t);let r=t.replace(/FromIndex$/,""),n=t!==r,i=_.includes(r);if(!(r in(n?IDBIndex:IDBObjectStore).prototype)||!(i||v.includes(r)))return;let s=async function(e,...t){let s=this.transaction(e,i?"readwrite":"readonly"),a=s.store;return n&&(a=a.index(t.shift())),(await Promise.all([a[r](...t),i&&s.done]))[0]};return w.set(t,s),s}m={...s=m,get:(e,t,r)=>E(e,t)||s.get(e,t,r),has:(e,t)=>!!E(e,t)||s.has(e,t)};/**
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
 */class b{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(!function(e){let t=e.getComponent();return(null==t?void 0:t.type)==="VERSION"}(e))return null;{let t=e.getImmediate();return`${t.library}/${t.version}`}}).filter(e=>e).join(" ")}}let I="@firebase/app",T="0.10.13",A=new o.Yd("@firebase/app"),N="[DEFAULT]",S={[I]:"fire-core","@firebase/app-compat":"fire-core-compat","@firebase/analytics":"fire-analytics","@firebase/analytics-compat":"fire-analytics-compat","@firebase/app-check":"fire-app-check","@firebase/app-check-compat":"fire-app-check-compat","@firebase/auth":"fire-auth","@firebase/auth-compat":"fire-auth-compat","@firebase/database":"fire-rtdb","@firebase/data-connect":"fire-data-connect","@firebase/database-compat":"fire-rtdb-compat","@firebase/functions":"fire-fn","@firebase/functions-compat":"fire-fn-compat","@firebase/installations":"fire-iid","@firebase/installations-compat":"fire-iid-compat","@firebase/messaging":"fire-fcm","@firebase/messaging-compat":"fire-fcm-compat","@firebase/performance":"fire-perf","@firebase/performance-compat":"fire-perf-compat","@firebase/remote-config":"fire-rc","@firebase/remote-config-compat":"fire-rc-compat","@firebase/storage":"fire-gcs","@firebase/storage-compat":"fire-gcs-compat","@firebase/firestore":"fire-fst","@firebase/firestore-compat":"fire-fst-compat","@firebase/vertexai-preview":"fire-vertex","fire-js":"fire-js",firebase:"fire-js-all"},D=new Map,V=new Map,k=new Map;function R(e,t){try{e.container.addComponent(t)}catch(r){A.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,r)}}function C(e){let t=e.name;if(k.has(t))return A.debug(`There were multiple attempts to register component ${t}.`),!1;for(let r of(k.set(t,e),D.values()))R(r,e);for(let t of V.values())R(t,e);return!0}function L(e,t){let r=e.container.getProvider("heartbeat").getImmediate({optional:!0});return r&&r.triggerHeartbeat(),e.container.getProvider(t)}let O=new l.LL("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});/**
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
 */class P{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new a.wA("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw O.create("app-deleted",{appName:this._name})}}/**
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
 */let F="10.14.1";function x(e,t={}){let r=e;"object"!=typeof t&&(t={name:t});let n=Object.assign({name:N,automaticDataCollectionEnabled:!1},t),i=n.name;if("string"!=typeof i||!i)throw O.create("bad-app-name",{appName:String(i)});if(r||(r=(0,l.aH)()),!r)throw O.create("no-options");let s=D.get(i);if(s){if((0,l.vZ)(r,s.options)&&(0,l.vZ)(n,s.config))return s;throw O.create("duplicate-app",{appName:i})}let o=new a.H0(i);for(let e of k.values())o.addComponent(e);let u=new P(r,n,o);return D.set(i,u),u}function U(e=N){let t=D.get(e);if(!t&&e===N&&(0,l.aH)())return x();if(!t)throw O.create("no-app",{appName:e});return t}function M(){return Array.from(D.values())}function B(e,t,r){var n;let i=null!==(n=S[e])&&void 0!==n?n:e;r&&(i+=`-${r}`);let s=i.match(/\s|\//),o=t.match(/\s|\//);if(s||o){let e=[`Unable to register library "${i}" with version "${t}":`];s&&e.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&e.push("and"),o&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),A.warn(e.join(" "));return}C(new a.wA(`${i}-version`,()=>({library:i,version:t}),"VERSION"))}let $="firebase-heartbeat-store",q=null;function z(){return q||(q=(function(e,t,{blocked:r,upgrade:n,blocking:i,terminated:s}={}){let a=indexedDB.open(e,1),o=g(a);return n&&a.addEventListener("upgradeneeded",e=>{n(g(a.result),e.oldVersion,e.newVersion,g(a.transaction),e)}),r&&a.addEventListener("blocked",e=>r(e.oldVersion,e.newVersion,e)),o.then(e=>{s&&e.addEventListener("close",()=>s()),i&&e.addEventListener("versionchange",e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),o})("firebase-heartbeat-database",0,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore($)}catch(e){console.warn(e)}}}).catch(e=>{throw O.create("idb-open",{originalErrorMessage:e.message})})),q}async function j(e){try{let t=(await z()).transaction($),r=await t.objectStore($).get(H(e));return await t.done,r}catch(e){if(e instanceof l.ZR)A.warn(e.message);else{let t=O.create("idb-get",{originalErrorMessage:null==e?void 0:e.message});A.warn(t.message)}}}async function G(e,t){try{let r=(await z()).transaction($,"readwrite"),n=r.objectStore($);await n.put(t,H(e)),await r.done}catch(e){if(e instanceof l.ZR)A.warn(e.message);else{let t=O.create("idb-set",{originalErrorMessage:null==e?void 0:e.message});A.warn(t.message)}}}function H(e){return`${e.name}!${e.options.appId}`}class K{constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider("app").getImmediate();this._storage=new Y(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){var e,t;try{let r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),n=W();if((null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,(null===(t=this._heartbeatsCache)||void 0===t?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===n||this._heartbeatsCache.heartbeats.some(e=>e.date===n))return;return this._heartbeatsCache.heartbeats.push({date:n,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(e=>{let t=new Date(e.date).valueOf();return Date.now()-t<=2592e6}),this._storage.overwrite(this._heartbeatsCache)}catch(e){A.warn(e)}}async getHeartbeatsHeader(){var e;try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)==null||0===this._heartbeatsCache.heartbeats.length)return"";let t=W(),{heartbeatsToSend:r,unsentEntries:n}=function(e,t=1024){let r=[],n=e.slice();for(let i of e){let e=r.find(e=>e.agent===i.agent);if(e){if(e.dates.push(i.date),Q(r)>t){e.dates.pop();break}}else if(r.push({agent:i.agent,dates:[i.date]}),Q(r)>t){r.pop();break}n=n.slice(1)}return{heartbeatsToSend:r,unsentEntries:n}}(this._heartbeatsCache.heartbeats),i=(0,l.L)(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,n.length>0?(this._heartbeatsCache.heartbeats=n,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(e){return A.warn(e),""}}}function W(){return new Date().toISOString().substring(0,10)}class Y{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!(0,l.hl)()&&(0,l.eu)().then(()=>!0).catch(()=>!1)}async read(){if(!await this._canUseIndexedDBPromise)return{heartbeats:[]};{let e=await j(this.app);return(null==e?void 0:e.heartbeats)?e:{heartbeats:[]}}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){let r=await this.read();return G(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;if(await this._canUseIndexedDBPromise){let r=await this.read();return G(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}}}function Q(e){return(0,l.L)(JSON.stringify({version:2,heartbeats:e})).length}C(new a.wA("platform-logger",e=>new b(e),"PRIVATE")),C(new a.wA("heartbeat",e=>new K(e),"PRIVATE")),B(I,T,""),B(I,T,"esm2017"),B("fire-js","")},7752:(e,t,r)=>{r.d(t,{H0:()=>o,wA:()=>i});var n=r(2377);class i{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */let s="[DEFAULT]";/**
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
 */class a{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let e=new n.BH;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{let r=this.getOrInitializeService({instanceIdentifier:t});r&&e.resolve(r)}catch(e){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;let r=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),n=null!==(t=null==e?void 0:e.optional)&&void 0!==t&&t;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(e){if(n)return null;throw e}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if("EAGER"===e.instantiationMode)try{this.getOrInitializeService({instanceIdentifier:s})}catch(e){}for(let[e,t]of this.instancesDeferred.entries()){let r=this.normalizeInstanceIdentifier(e);try{let e=this.getOrInitializeService({instanceIdentifier:r});t.resolve(e)}catch(e){}}}}clearInstance(e=s){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=s){return this.instances.has(e)}getOptions(e=s){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let n=this.getOrInitializeService({instanceIdentifier:r,options:t});for(let[e,t]of this.instancesDeferred.entries())r===this.normalizeInstanceIdentifier(e)&&t.resolve(n);return n}onInit(e,t){var r;let n=this.normalizeInstanceIdentifier(t),i=null!==(r=this.onInitCallbacks.get(n))&&void 0!==r?r:new Set;i.add(e),this.onInitCallbacks.set(n,i);let s=this.instances.get(n);return s&&e(s,n),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){let r=this.onInitCallbacks.get(t);if(r)for(let n of r)try{n(e,t)}catch(e){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:e===s?void 0:e,options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch(e){}return r||null}normalizeInstanceIdentifier(e=s){return this.component?this.component.multipleInstances?e:s:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}/**
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
 */class o{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new a(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}},5036:(e,t,r)=>{var n;r.d(t,{Yd:()=>u,in:()=>n});/**
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
 */let i=[];!function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"}(n||(n={}));let s={debug:n.DEBUG,verbose:n.VERBOSE,info:n.INFO,warn:n.WARN,error:n.ERROR,silent:n.SILENT},a=n.INFO,o={[n.DEBUG]:"log",[n.VERBOSE]:"log",[n.INFO]:"info",[n.WARN]:"warn",[n.ERROR]:"error"},l=(e,t,...r)=>{if(t<e.logLevel)return;let n=new Date().toISOString(),i=o[t];if(i)console[i](`[${n}]  ${e.name}:`,...r);else throw Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class u{constructor(e){this.name=e,this._logLevel=a,this._logHandler=l,this._userLogHandler=null,i.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in n))throw TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?s[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,n.DEBUG,...e),this._logHandler(this,n.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,n.VERBOSE,...e),this._logHandler(this,n.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,n.INFO,...e),this._logHandler(this,n.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,n.WARN,...e),this._logHandler(this,n.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,n.ERROR,...e),this._logHandler(this,n.ERROR,...e)}}},2377:(e,t,r)=>{r.d(t,{BH:()=>y,L:()=>l,LL:()=>b,P0:()=>m,Sg:()=>v,ZR:()=>E,aH:()=>g,eu:()=>w,hl:()=>_,m9:()=>A,vZ:()=>function e(t,r){if(t===r)return!0;let n=Object.keys(t),i=Object.keys(r);for(let s of n){if(!i.includes(s))return!1;let n=t[s],a=r[s];if(T(n)&&T(a)){if(!e(n,a))return!1}else if(n!==a)return!1}for(let e of i)if(!n.includes(e))return!1;return!0}});/**
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
 */let n=function(e){let t=[],r=0;for(let n=0;n<e.length;n++){let i=e.charCodeAt(n);i<128?t[r++]=i:(i<2048?t[r++]=i>>6|192:((64512&i)==55296&&n+1<e.length&&(64512&e.charCodeAt(n+1))==56320?(i=65536+((1023&i)<<10)+(1023&e.charCodeAt(++n)),t[r++]=i>>18|240,t[r++]=i>>12&63|128):t[r++]=i>>12|224,t[r++]=i>>6&63|128),t[r++]=63&i|128)}return t},i=function(e){let t=[],r=0,n=0;for(;r<e.length;){let i=e[r++];if(i<128)t[n++]=String.fromCharCode(i);else if(i>191&&i<224){let s=e[r++];t[n++]=String.fromCharCode((31&i)<<6|63&s)}else if(i>239&&i<365){let s=((7&i)<<18|(63&e[r++])<<12|(63&e[r++])<<6|63&e[r++])-65536;t[n++]=String.fromCharCode(55296+(s>>10)),t[n++]=String.fromCharCode(56320+(1023&s))}else{let s=e[r++],a=e[r++];t[n++]=String.fromCharCode((15&i)<<12|(63&s)<<6|63&a)}}return t.join("")},s={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();let r=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let t=0;t<e.length;t+=3){let i=e[t],s=t+1<e.length,a=s?e[t+1]:0,o=t+2<e.length,l=o?e[t+2]:0,u=i>>2,c=(3&i)<<4|a>>4,h=(15&a)<<2|l>>6,d=63&l;o||(d=64,s||(h=64)),n.push(r[u],r[c],r[h],r[d])}return n.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(n(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):i(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();let r=t?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let t=0;t<e.length;){let i=r[e.charAt(t++)],s=t<e.length?r[e.charAt(t)]:0,o=++t<e.length?r[e.charAt(t)]:64,l=++t<e.length?r[e.charAt(t)]:64;if(++t,null==i||null==s||null==o||null==l)throw new a;let u=i<<2|s>>4;if(n.push(u),64!==o){let e=s<<4&240|o>>2;if(n.push(e),64!==l){let e=o<<6&192|l;n.push(e)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class a extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}let o=function(e){let t=n(e);return s.encodeByteArray(t,!0)},l=function(e){return o(e).replace(/\./g,"")},u=function(e){try{return s.decodeString(e,!0)}catch(e){console.error("base64Decode failed: ",e)}return null},c=()=>/**
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
 */(function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw Error("Unable to locate global object.")})().__FIREBASE_DEFAULTS__,h=()=>{if("undefined"==typeof process||void 0===process.env)return;let e=process.env.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},d=()=>{let e;if("undefined"==typeof document)return;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(e){return}let t=e&&u(e[1]);return t&&JSON.parse(t)},f=()=>{try{return c()||h()||d()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},p=e=>{var t,r;return null===(r=null===(t=f())||void 0===t?void 0:t.emulatorHosts)||void 0===r?void 0:r[e]},m=e=>{let t=p(e);if(!t)return;let r=t.lastIndexOf(":");if(r<=0||r+1===t.length)throw Error(`Invalid host ${t} with no separate hostname and port!`);let n=parseInt(t.substring(r+1),10);return"["===t[0]?[t.substring(1,r-1),n]:[t.substring(0,r),n]},g=()=>{var e;return null===(e=f())||void 0===e?void 0:e.config};/**
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
 */class y{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,r))}}}/**
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
 */function v(e,t){if(e.uid)throw Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let r=t||"demo-project",n=e.iat||0,i=e.sub||e.user_id;if(!i)throw Error("mockUserToken must contain 'sub' or 'user_id' field!");let s=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:n,exp:n+3600,auth_time:n,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},e);return[l(JSON.stringify({alg:"none",type:"JWT"})),l(JSON.stringify(s)),""].join(".")}function _(){try{return"object"==typeof indexedDB}catch(e){return!1}}function w(){return new Promise((e,t)=>{try{let r=!0,n="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(n);i.onsuccess=()=>{i.result.close(),r||self.indexedDB.deleteDatabase(n),e(!0)},i.onupgradeneeded=()=>{r=!1},i.onerror=()=>{var e;t((null===(e=i.error)||void 0===e?void 0:e.message)||"")}}catch(e){t(e)}})}class E extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name="FirebaseError",Object.setPrototypeOf(this,E.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,b.prototype.create)}}class b{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){let r=t[0]||{},n=`${this.service}/${e}`,i=this.errors[e],s=i?i.replace(I,(e,t)=>{let n=r[t];return null!=n?String(n):`<${t}?>`}):"Error",a=`${this.serviceName}: ${s} (${n}).`;return new E(n,a,r)}}let I=/\{\$([^}]+)}/g;function T(e){return null!==e&&"object"==typeof e}/**
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
 */function A(e){return e&&e._delegate?e._delegate:e}},2585:(e,t,r)=>{r.d(t,{C6:()=>n.C6,ZF:()=>n.ZF});var n=r(3497);/**
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
 */(0,n.KN)("firebase","10.14.1","app")},5449:(e,t,r)=>{r.d(t,{ET:()=>rV,hJ:()=>tM,JU:()=>tB,QT:()=>rN,PL:()=>rS,ad:()=>tP,Xo:()=>rg,IO:()=>rd,r7:()=>rD});var n,i=r(3497),s=r(7752),a=r(5036),o=r(3837),l=r(2377),u=r(3122),c=r(6113);let h="4.7.3";/**
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
 */class d{constructor(e){this.uid=e}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}d.UNAUTHENTICATED=new d(null),d.GOOGLE_CREDENTIALS=new d("google-credentials-uid"),d.FIRST_PARTY=new d("first-party-uid"),d.MOCK_USER=new d("mock-user");/**
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
 */let f="10.14.0",p=new a.Yd("@firebase/firestore");function m(e,...t){if(p.logLevel<=a.in.DEBUG){let r=t.map(v);p.debug(`Firestore (${f}): ${e}`,...r)}}function g(e,...t){if(p.logLevel<=a.in.ERROR){let r=t.map(v);p.error(`Firestore (${f}): ${e}`,...r)}}function y(e,...t){if(p.logLevel<=a.in.WARN){let r=t.map(v);p.warn(`Firestore (${f}): ${e}`,...r)}}function v(e){if("string"==typeof e)return e;try{return(0,o.inspect)(e,{depth:100})}catch(t){return e}}/**
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
 */function _(e="Unexpected state"){let t=`FIRESTORE (${f}) INTERNAL ASSERTION FAILED: `+e;throw g(t),Error(t)}/**
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
 */let w={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable"};class E extends l.ZR{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class b{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
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
 */class I{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class T{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(d.UNAUTHENTICATED))}shutdown(){}}class A{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class N{constructor(e){this.auth=null,e.onInit(e=>{this.auth=e})}getToken(){return this.auth?this.auth.getToken().then(e=>e?("string"==typeof e.accessToken||_(),new I(e.accessToken,new d(this.auth.getUid()))):null):Promise.resolve(null)}invalidateToken(){}start(e,t){}shutdown(){}}class S{constructor(e,t,r){this.sessionIndex=e,this.iamToken=t,this.authTokenFactory=r,this.type="FirstParty",this.user=d.FIRST_PARTY,this._headers=new Map}getAuthToken(){return this.authTokenFactory?this.authTokenFactory():null}get headers(){this._headers.set("X-Goog-AuthUser",this.sessionIndex);let e=this.getAuthToken();return e&&this._headers.set("Authorization",e),this.iamToken&&this._headers.set("X-Goog-Iam-Authorization-Token",this.iamToken),this._headers}}class D{constructor(e,t,r){this.sessionIndex=e,this.iamToken=t,this.authTokenFactory=r}getToken(){return Promise.resolve(new S(this.sessionIndex,this.iamToken,this.authTokenFactory))}start(e,t){e.enqueueRetryable(()=>t(d.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class V{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class k{constructor(e){this.appCheckProvider=e,this.appCheck=null,e.onInit(e=>{this.appCheck=e})}getToken(){return this.appCheck?this.appCheck.getToken().then(e=>e?("string"==typeof e.token||_(),new V(e.token)):null):Promise.resolve(null)}invalidateToken(){}start(e,t){}shutdown(){}}/**
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
 */class R{constructor(e,t,r,n,i,s,a,o,l){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=n,this.ssl=i,this.forceLongPolling=s,this.autoDetectLongPolling=a,this.longPollingOptions=o,this.useFetchStreams=l}}let C="(default)";class L{constructor(e,t){this.projectId=e,this.database=t||C}static empty(){return new L("","")}get isDefaultDatabase(){return this.database===C}isEqual(e){return e instanceof L&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */let O="__name__";class P{constructor(e,t,r){void 0===t?t=0:t>e.length&&_(),void 0===r?r=e.length-t:r>e.length-t&&_(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return 0===P.comparator(this,e)}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof P?e.forEach(e=>{t.push(e)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let r=Math.min(e.length,t.length);for(let n=0;n<r;n++){let r=e.get(n),i=t.get(n);if(r<i)return -1;if(r>i)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class F extends P{construct(e,t,r){return new F(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){let t=[];for(let r of e){if(r.indexOf("//")>=0)throw new E(w.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(e=>e.length>0))}return new F(t)}static emptyPath(){return new F([])}}let x=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class U extends P{construct(e,t,r){return new U(e,t,r)}static isValidIdentifier(e){return x.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),U.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&this.get(0)===O}static keyField(){return new U([O])}static fromServerFormat(e){let t=[],r="",n=0,i=()=>{if(0===r.length)throw new E(w.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""},s=!1;for(;n<e.length;){let t=e[n];if("\\"===t){if(n+1===e.length)throw new E(w.INVALID_ARGUMENT,"Path has trailing escape character: "+e);let t=e[n+1];if(!("\\"===t||"."===t||"`"===t))throw new E(w.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=t,n+=2}else"`"===t?s=!s:"."!==t||s?r+=t:i(),n++}if(i(),s)throw new E(w.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new U(t)}static emptyPath(){return new U([])}}/**
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
 */class M{constructor(e){this.path=e}static fromPath(e){return new M(F.fromString(e))}static fromName(e){return new M(F.fromString(e).popFirst(5))}static empty(){return new M(F.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===F.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return F.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new M(new F(e.slice()))}}/**
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
 */function B(e,t,r){if(!r)throw new E(w.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function $(e){if(!M.isDocumentKey(e))throw new E(w.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function q(e){if(M.isDocumentKey(e))throw new E(w.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function z(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{var t;let r=(t=e).constructor?t.constructor.name:null;return r?`a custom ${r} object`:"an object"}}if("function"==typeof e)return"a function";return _()}function j(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new E(w.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let r=z(e);throw new E(w.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${r}`)}}return e}function G(e){let t={};return void 0!==e.timeoutSeconds&&(t.timeoutSeconds=e.timeoutSeconds),t}/**
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
 */let H=null,K="RestConnection",W={};W.BatchGetDocuments="batchGet",W.Commit="commit",W.RunQuery="runQuery",W.RunAggregationQuery="runAggregationQuery";class Y{constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),n=encodeURIComponent(this.databaseId.database);this.baseUrl=t+"://"+e.host,this.databasePath=`projects/${r}/databases/${n}`,this.requestParams=this.databaseId.database===C?`project_id=${r}`:`project_id=${r}&database_id=${n}`}get shouldResourcePathBeIncludedInRequest(){return!1}invokeRPC(e,t,r,n,i){let s=(null===H?H=268435456+Math.round(2147483648*Math.random()):H++,"0x"+H.toString(16)),a=this.makeUrl(e,t.toUriEncodedString());m(K,`Sending RPC '${e}' ${s}:`,a,r);let o={"google-cloud-resource-prefix":this.databasePath,"x-goog-request-params":this.requestParams};return this.modifyHeadersForRequest(o,n,i),this.performRPCRequest(e,a,o,r).then(t=>(m(K,`Received RPC '${e}' ${s}: `,t),t),t=>{throw y(K,`RPC '${e}' ${s} failed with error: `,t,"url: ",a,"request:",r),t})}invokeStreamingRPC(e,t,r,n,i,s){return this.invokeRPC(e,t,r,n,i)}modifyHeadersForRequest(e,t,r){e["X-Goog-Api-Client"]="gl-js/ fire/"+f,e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((t,r)=>e[r]=t),r&&r.headers.forEach((t,r)=>e[r]=t)}makeUrl(e,t){let r=W[e];return`${this.baseUrl}/v1/${t}:${r}`}terminate(){}}function Q(e){if(void 0===e)return g("RPC_ERROR","HTTP error has no status"),w.UNKNOWN;switch(e){case 200:return w.OK;case 400:return w.FAILED_PRECONDITION;case 401:return w.UNAUTHENTICATED;case 403:return w.PERMISSION_DENIED;case 404:return w.NOT_FOUND;case 409:return w.ABORTED;case 416:return w.OUT_OF_RANGE;case 429:return w.RESOURCE_EXHAUSTED;case 499:return w.CANCELLED;case 500:return w.UNKNOWN;case 501:return w.UNIMPLEMENTED;case 503:return w.UNAVAILABLE;case 504:return w.DEADLINE_EXCEEDED;default:if(e>=200&&e<300)return w.OK;if(e>=400&&e<500)return w.FAILED_PRECONDITION;if(e>=500&&e<600)return w.INTERNAL;return w.UNKNOWN}}!function(e){e[e.OK=0]="OK",e[e.CANCELLED=1]="CANCELLED",e[e.UNKNOWN=2]="UNKNOWN",e[e.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",e[e.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",e[e.NOT_FOUND=5]="NOT_FOUND",e[e.ALREADY_EXISTS=6]="ALREADY_EXISTS",e[e.PERMISSION_DENIED=7]="PERMISSION_DENIED",e[e.UNAUTHENTICATED=16]="UNAUTHENTICATED",e[e.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",e[e.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",e[e.ABORTED=10]="ABORTED",e[e.OUT_OF_RANGE=11]="OUT_OF_RANGE",e[e.UNIMPLEMENTED=12]="UNIMPLEMENTED",e[e.INTERNAL=13]="INTERNAL",e[e.UNAVAILABLE=14]="UNAVAILABLE",e[e.DATA_LOSS=15]="DATA_LOSS"}(n||(n={}));/**
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
 */class J extends Y{constructor(e,t){super(e),this.fetchImpl=t}openStream(e,t){throw Error("Not supported by FetchConnection")}async performRPCRequest(e,t,r,n){var i;let s;let a=JSON.stringify(n);try{s=await this.fetchImpl(t,{method:"POST",headers:r,body:a})}catch(e){throw new E(Q(e.status),"Request failed with error: "+e.statusText)}if(!s.ok){let e=await s.json();Array.isArray(e)&&(e=e[0]);let t=null===(i=null==e?void 0:e.error)||void 0===i?void 0:i.message;throw new E(Q(s.status),`Request failed with error: ${null!=t?t:s.statusText}`)}return s.json()}}/**
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
 */class X{static newId(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length,r="";for(;r.length<20;){let n=(0,c.randomBytes)(40);for(let i=0;i<n.length;++i)r.length<20&&n[i]<t&&(r+=e.charAt(n[i]%e.length))}return r}}function Z(e,t){return e<t?-1:e>t?1:0}function ee(e,t,r){return e.length===t.length&&e.every((e,n)=>r(e,t[n]))}/**
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
 */function et(e){let t=0;for(let r in e)Object.prototype.hasOwnProperty.call(e,r)&&t++;return t}function er(e,t){for(let r in e)Object.prototype.hasOwnProperty.call(e,r)&&t(r,e[r])}function en(e){return 0===e&&1/e==-1/0}/**
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
 */class ei{constructor(e){this.binaryString=e}static fromBase64String(e){return new ei(Buffer.from(e,"base64").toString("binary"))}static fromUint8Array(e){return new ei(function(e){let t="";for(let r=0;r<e.length;++r)t+=String.fromCharCode(e[r]);return t}(e))}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){var e;return e=this.binaryString,Buffer.from(e,"binary").toString("base64")}toUint8Array(){return function(e){let t=new Uint8Array(e.length);for(let r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Z(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}ei.EMPTY_BYTE_STRING=new ei("");/**
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
 */let es=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function ea(e){if(e||_(),"string"==typeof e){let t=0,r=es.exec(e);if(r||_(),r[1]){let e=r[1];t=Number(e=(e+"000000000").substr(0,9))}return{seconds:Math.floor(new Date(e).getTime()/1e3),nanos:t}}return{seconds:eo(e.seconds),nanos:eo(e.nanos)}}function eo(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}function el(e){return"string"==typeof e?ei.fromBase64String(e):ei.fromUint8Array(e)}class eu{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0||t>=1e9)throw new E(w.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800||e>=253402300800)throw new E(w.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return eu.fromMillis(Date.now())}static fromDate(e){return eu.fromMillis(e.getTime())}static fromMillis(e){let t=Math.floor(e/1e3);return new eu(t,Math.floor((e-1e3*t)*1e6))}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?Z(this.nanoseconds,e.nanoseconds):Z(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){return String(this.seconds- -62135596800).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}function ec(e){var t,r;return(null===(r=((null===(t=null==e?void 0:e.mapValue)||void 0===t?void 0:t.fields)||{}).__type__)||void 0===r?void 0:r.stringValue)==="server_timestamp"}function eh(e){let t=ea(e.mapValue.fields.__local_write_time__.timestampValue);return new eu(t.seconds,t.nanos)}/**
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
 */let ed="__type__",ef="__max__",ep={mapValue:{fields:{__type__:{stringValue:ef}}}},em="__vector__",eg="value";function ey(e){var t,r;return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?ec(e)?4:(((e.mapValue||{}).fields||{}).__type__||{}).stringValue===ef?9007199254740991:(null===(r=((null===(t=null==e?void 0:e.mapValue)||void 0===t?void 0:t.fields)||{})[ed])||void 0===r?void 0:r.stringValue)===em?10:11:_()}function ev(e,t){if(e===t)return!0;let r=ey(e);if(r!==ey(t))return!1;switch(r){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return eh(e).isEqual(eh(t));case 3:return function(e,t){if("string"==typeof e.timestampValue&&"string"==typeof t.timestampValue&&e.timestampValue.length===t.timestampValue.length)return e.timestampValue===t.timestampValue;let r=ea(e.timestampValue),n=ea(t.timestampValue);return r.seconds===n.seconds&&r.nanos===n.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return el(e.bytesValue).isEqual(el(t.bytesValue));case 7:return e.referenceValue===t.referenceValue;case 8:return eo(e.geoPointValue.latitude)===eo(t.geoPointValue.latitude)&&eo(e.geoPointValue.longitude)===eo(t.geoPointValue.longitude);case 2:return function(e,t){if("integerValue"in e&&"integerValue"in t)return eo(e.integerValue)===eo(t.integerValue);if("doubleValue"in e&&"doubleValue"in t){let r=eo(e.doubleValue),n=eo(t.doubleValue);return r===n?en(r)===en(n):isNaN(r)&&isNaN(n)}return!1}(e,t);case 9:return ee(e.arrayValue.values||[],t.arrayValue.values||[],ev);case 10:case 11:return function(e,t){let r=e.mapValue.fields||{},n=t.mapValue.fields||{};if(et(r)!==et(n))return!1;for(let e in r)if(r.hasOwnProperty(e)&&(void 0===n[e]||!ev(r[e],n[e])))return!1;return!0}(e,t);default:return _()}}function e_(e,t){return void 0!==(e.values||[]).find(e=>ev(e,t))}function ew(e,t){if(e===t)return 0;let r=ey(e),n=ey(t);if(r!==n)return Z(r,n);switch(r){case 0:case 9007199254740991:return 0;case 1:return Z(e.booleanValue,t.booleanValue);case 2:return function(e,t){let r=eo(e.integerValue||e.doubleValue),n=eo(t.integerValue||t.doubleValue);return r<n?-1:r>n?1:r===n?0:isNaN(r)?isNaN(n)?0:-1:1}(e,t);case 3:return eE(e.timestampValue,t.timestampValue);case 4:return eE(eh(e),eh(t));case 5:return Z(e.stringValue,t.stringValue);case 6:return function(e,t){let r=el(e),n=el(t);return r.compareTo(n)}(e.bytesValue,t.bytesValue);case 7:return function(e,t){let r=e.split("/"),n=t.split("/");for(let e=0;e<r.length&&e<n.length;e++){let t=Z(r[e],n[e]);if(0!==t)return t}return Z(r.length,n.length)}(e.referenceValue,t.referenceValue);case 8:return function(e,t){let r=Z(eo(e.latitude),eo(t.latitude));return 0!==r?r:Z(eo(e.longitude),eo(t.longitude))}(e.geoPointValue,t.geoPointValue);case 9:return eb(e.arrayValue,t.arrayValue);case 10:return function(e,t){var r,n,i,s;let a=e.fields||{},o=t.fields||{},l=null===(r=a[eg])||void 0===r?void 0:r.arrayValue,u=null===(n=o[eg])||void 0===n?void 0:n.arrayValue,c=Z((null===(i=null==l?void 0:l.values)||void 0===i?void 0:i.length)||0,(null===(s=null==u?void 0:u.values)||void 0===s?void 0:s.length)||0);return 0!==c?c:eb(l,u)}(e.mapValue,t.mapValue);case 11:return function(e,t){if(e===ep.mapValue&&t===ep.mapValue)return 0;if(e===ep.mapValue)return 1;if(t===ep.mapValue)return -1;let r=e.fields||{},n=Object.keys(r),i=t.fields||{},s=Object.keys(i);n.sort(),s.sort();for(let e=0;e<n.length&&e<s.length;++e){let t=Z(n[e],s[e]);if(0!==t)return t;let a=ew(r[n[e]],i[s[e]]);if(0!==a)return a}return Z(n.length,s.length)}(e.mapValue,t.mapValue);default:throw _()}}function eE(e,t){if("string"==typeof e&&"string"==typeof t&&e.length===t.length)return Z(e,t);let r=ea(e),n=ea(t),i=Z(r.seconds,n.seconds);return 0!==i?i:Z(r.nanos,n.nanos)}function eb(e,t){let r=e.values||[],n=t.values||[];for(let e=0;e<r.length&&e<n.length;++e){let t=ew(r[e],n[e]);if(t)return t}return Z(r.length,n.length)}function eI(e,t){return{referenceValue:`projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`}}function eT(e){return!!e&&"arrayValue"in e}function eA(e){return!!e&&"nullValue"in e}function eN(e){return!!e&&"doubleValue"in e&&isNaN(Number(e.doubleValue))}function eS(e){return!!e&&"mapValue"in e}function eD(e){if(e.geoPointValue)return{geoPointValue:Object.assign({},e.geoPointValue)};if(e.timestampValue&&"object"==typeof e.timestampValue)return{timestampValue:Object.assign({},e.timestampValue)};if(e.mapValue){let t={mapValue:{fields:{}}};return er(e.mapValue.fields,(e,r)=>t.mapValue.fields[e]=eD(r)),t}{if(!e.arrayValue)return Object.assign({},e);let t={arrayValue:{values:[]}};for(let r=0;r<(e.arrayValue.values||[]).length;++r)t.arrayValue.values[r]=eD(e.arrayValue.values[r]);return t}}/**
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
 */class eV{constructor(e,t){this.position=e,this.inclusive=t}}function ek(e,t){if(null===e)return null===t;if(null===t||e.inclusive!==t.inclusive||e.position.length!==t.position.length)return!1;for(let r=0;r<e.position.length;r++)if(!ev(e.position[r],t.position[r]))return!1;return!0}/**
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
 */class eR{}class eC extends eR{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?"in"===t||"not-in"===t?this.createKeyFieldInFilter(e,t,r):new eO(e,t,r):"array-contains"===t?new eU(e,r):"in"===t?new eM(e,r):"not-in"===t?new eB(e,r):"array-contains-any"===t?new e$(e,r):new eC(e,t,r)}static createKeyFieldInFilter(e,t,r){return"in"===t?new eP(e,r):new eF(e,r)}matches(e){let t=e.data.field(this.field);return"!="===this.op?null!==t&&this.matchesComparison(ew(t,this.value)):null!==t&&ey(this.value)===ey(t)&&this.matchesComparison(ew(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return 0===e;case"!=":return 0!==e;case">":return e>0;case">=":return e>=0;default:return _()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class eL extends eR{constructor(e,t){super(),this.filters=e,this.op=t,this.memoizedFlattenedFilters=null}static create(e,t){return new eL(e,t)}matches(e){return"and"===this.op?void 0===this.filters.find(t=>!t.matches(e)):void 0!==this.filters.find(t=>t.matches(e))}getFlattenedFilters(){return null!==this.memoizedFlattenedFilters||(this.memoizedFlattenedFilters=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.memoizedFlattenedFilters}getFilters(){return Object.assign([],this.filters)}}class eO extends eC{constructor(e,t,r){super(e,t,r),this.key=M.fromName(r.referenceValue)}matches(e){let t=M.comparator(e.key,this.key);return this.matchesComparison(t)}}class eP extends eC{constructor(e,t){super(e,"in",t),this.keys=ex("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class eF extends eC{constructor(e,t){super(e,"not-in",t),this.keys=ex("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function ex(e,t){var r;return((null===(r=t.arrayValue)||void 0===r?void 0:r.values)||[]).map(e=>M.fromName(e.referenceValue))}class eU extends eC{constructor(e,t){super(e,"array-contains",t)}matches(e){let t=e.data.field(this.field);return eT(t)&&e_(t.arrayValue,this.value)}}class eM extends eC{constructor(e,t){super(e,"in",t)}matches(e){let t=e.data.field(this.field);return null!==t&&e_(this.value.arrayValue,t)}}class eB extends eC{constructor(e,t){super(e,"not-in",t)}matches(e){if(e_(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;let t=e.data.field(this.field);return null!==t&&!e_(this.value.arrayValue,t)}}class e$ extends eC{constructor(e,t){super(e,"array-contains-any",t)}matches(e){let t=e.data.field(this.field);return!!eT(t)&&!!t.arrayValue.values&&t.arrayValue.values.some(e=>e_(this.value.arrayValue,e))}}/**
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
 */class eq{constructor(e,t="asc"){this.field=e,this.dir=t}}/**
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
 */class ez{constructor(e){this.timestamp=e}static fromTimestamp(e){return new ez(e)}static min(){return new ez(new eu(0,0))}static max(){return new ez(new eu(253402300799,1e9-1))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */class ej{constructor(e,t){this.comparator=e,this.root=t||eH.EMPTY}insert(e,t){return new ej(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,eH.BLACK,null,null))}remove(e){return new ej(this.comparator,this.root.remove(e,this.comparator).copy(null,null,eH.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let r=this.comparator(e,t.key);if(0===r)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){let n=this.comparator(e,r.key);if(0===n)return t+r.left.size;n<0?r=r.left:(t+=r.left.size+1,r=r.right)}return -1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){let e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new eG(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new eG(this.root,e,this.comparator,!1)}getReverseIterator(){return new eG(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new eG(this.root,e,this.comparator,!0)}}class eG{constructor(e,t,r,n){this.isReverse=n,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&n&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else if(0===i){this.nodeStack.push(e);break}else this.nodeStack.push(e),e=this.isReverse?e.right:e.left}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class eH{constructor(e,t,r,n,i){this.key=e,this.value=t,this.color=null!=r?r:eH.RED,this.left=null!=n?n:eH.EMPTY,this.right=null!=i?i:eH.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,n,i){return new eH(null!=e?e:this.key,null!=t?t:this.value,null!=r?r:this.color,null!=n?n:this.left,null!=i?i:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let n=this,i=r(e,n.key);return(n=i<0?n.copy(null,null,null,n.left.insert(e,t,r),null):0===i?n.copy(null,t,null,null,null):n.copy(null,null,null,null,n.right.insert(e,t,r))).fixUp()}removeMin(){if(this.left.isEmpty())return eH.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),(e=e.copy(null,null,null,e.left.removeMin(),null)).fixUp()}remove(e,t){let r;let n=this;if(0>t(e,n.key))n.left.isEmpty()||n.left.isRed()||n.left.left.isRed()||(n=n.moveRedLeft()),n=n.copy(null,null,null,n.left.remove(e,t),null);else{if(n.left.isRed()&&(n=n.rotateRight()),n.right.isEmpty()||n.right.isRed()||n.right.left.isRed()||(n=n.moveRedRight()),0===t(e,n.key)){if(n.right.isEmpty())return eH.EMPTY;r=n.right.min(),n=n.copy(r.key,r.value,null,null,n.right.removeMin())}n=n.copy(null,null,null,null,n.right.remove(e,t))}return n.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=(e=(e=e.copy(null,null,null,null,e.right.rotateRight())).rotateLeft()).colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=(e=e.rotateRight()).colorFlip()),e}rotateLeft(){let e=this.copy(null,null,eH.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,eH.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){return Math.pow(2,this.check())<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw _();let e=this.left.check();if(e===this.right.check())return e+(this.isRed()?0:1);throw _()}}eH.EMPTY=null,eH.RED=!0,eH.BLACK=!1;class eK{constructor(){this.size=0}get key(){throw _()}get value(){throw _()}get color(){throw _()}get left(){throw _()}get right(){throw _()}copy(e,t,r,n,i){return this}insert(e,t,r){return new eH(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}}eH.EMPTY=new eK;/**
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
 */class eW{constructor(e){this.comparator=e,this.data=new ej(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){let r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){let n=r.getNext();if(this.comparator(n.key,e[1])>=0)return;t(n.key)}}forEachWhile(e,t){let r;for(r=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new eY(this.data.getIterator())}getIteratorFrom(e){return new eY(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(e=>{t=t.add(e)}),t}isEqual(e){if(!(e instanceof eW)||this.size!==e.size)return!1;let t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){let e=t.getNext().key,n=r.getNext().key;if(0!==this.comparator(e,n))return!1}return!0}toArray(){let e=[];return this.forEach(t=>{e.push(t)}),e}toString(){let e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){let t=new eW(this.comparator);return t.data=e,t}}class eY{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class eQ{constructor(e){this.fields=e,e.sort(U.comparator)}static empty(){return new eQ([])}unionWith(e){let t=new eW(U.comparator);for(let e of this.fields)t=t.add(e);for(let r of e)t=t.add(r);return new eQ(t.toArray())}covers(e){for(let t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return ee(this.fields,e.fields,(e,t)=>e.isEqual(t))}}/**
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
 */class eJ{constructor(e){this.value=e}static empty(){return new eJ({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(!eS(t=(t.mapValue.fields||{})[e.get(r)]))return null;return(t=(t.mapValue.fields||{})[e.lastSegment()])||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=eD(t)}setAll(e){let t=U.emptyPath(),r={},n=[];e.forEach((e,i)=>{if(!t.isImmediateParentOf(i)){let e=this.getFieldsMap(t);this.applyChanges(e,r,n),r={},n=[],t=i.popLast()}e?r[i.lastSegment()]=eD(e):n.push(i.lastSegment())});let i=this.getFieldsMap(t);this.applyChanges(i,r,n)}delete(e){let t=this.field(e.popLast());eS(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return ev(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let n=t.mapValue.fields[e.get(r)];eS(n)&&n.mapValue.fields||(n={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=n),t=n}return t.mapValue.fields}applyChanges(e,t,r){for(let n of(er(t,(t,r)=>e[t]=r),r))delete e[n]}clone(){return new eJ(eD(this.value))}}/**
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
 */class eX{constructor(e,t,r,n,i,s,a){this.key=e,this.documentType=t,this.version=r,this.readTime=n,this.createTime=i,this.data=s,this.documentState=a}static newInvalidDocument(e){return new eX(e,0,ez.min(),ez.min(),ez.min(),eJ.empty(),0)}static newFoundDocument(e,t,r,n){return new eX(e,1,t,ez.min(),r,n,0)}static newNoDocument(e,t){return new eX(e,2,t,ez.min(),ez.min(),eJ.empty(),0)}static newUnknownDocument(e,t){return new eX(e,3,t,ez.min(),ez.min(),eJ.empty(),2)}convertToFoundDocument(e,t){return this.createTime.isEqual(ez.min())&&(2===this.documentType||0===this.documentType)&&(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=eJ.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=eJ.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ez.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(e){return e instanceof eX&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new eX(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class eZ{constructor(e,t=null,r=[],n=[],i=null,s=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=n,this.limit=i,this.startAt=s,this.endAt=a,this.memoizedCanonicalId=null}}function e0(e,t=null,r=[],n=[],i=null,s=null,a=null){return new eZ(e,t,r,n,i,s,a)}/**
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
 */class e1{constructor(e,t=null,r=[],n=[],i=null,s="F",a=null,o=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=n,this.limit=i,this.limitType=s,this.startAt=a,this.endAt=o,this.memoizedNormalizedOrderBy=null,this.memoizedTarget=null,this.memoizedAggregateTarget=null,this.startAt,this.endAt}}function e2(e){return null!==e.collectionGroup}function e4(e){if(null===e.memoizedNormalizedOrderBy){let t;e.memoizedNormalizedOrderBy=[];let r=new Set;for(let t of e.explicitOrderBy)e.memoizedNormalizedOrderBy.push(t),r.add(t.field.canonicalString());let n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(t=new eW(U.comparator),e.filters.forEach(e=>{e.getFlattenedFilters().forEach(e=>{e.isInequality()&&(t=t.add(e.field))})}),t).forEach(t=>{r.has(t.canonicalString())||t.isKeyField()||e.memoizedNormalizedOrderBy.push(new eq(t,n))}),r.has(U.keyField().canonicalString())||e.memoizedNormalizedOrderBy.push(new eq(U.keyField(),n))}return e.memoizedNormalizedOrderBy}function e6(e){return e.memoizedTarget||(e.memoizedTarget=function(e,t){if("F"===e.limitType)return e0(e.path,e.collectionGroup,t,e.filters,e.limit,e.startAt,e.endAt);{t=t.map(e=>{let t="desc"===e.dir?"asc":"desc";return new eq(e.field,t)});let r=e.endAt?new eV(e.endAt.position,e.endAt.inclusive):null,n=e.startAt?new eV(e.startAt.position,e.startAt.inclusive):null;return e0(e.path,e.collectionGroup,t,e.filters,e.limit,r,n)}}(e,e4(e))),e.memoizedTarget}function e3(e,t){let r=e.filters.concat([t]);return new e1(e.path,e.collectionGroup,e.explicitOrderBy.slice(),r,e.limit,e.limitType,e.startAt,e.endAt)}/**
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
 */function e5(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:en(t)?"-0":t}}function e9(e,t){return"number"==typeof t&&Number.isInteger(t)&&!en(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER?{integerValue:""+t}:e5(e,t)}/**
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
 */class e7{constructor(){this._=void 0}}class e8 extends e7{}class te extends e7{constructor(e){super(),this.elements=e}}class tt extends e7{constructor(e){super(),this.elements=e}}class tr extends e7{constructor(e,t){super(),this.serializer=e,this.operand=t}}/**
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
 */class tn{constructor(e,t){this.field=e,this.transform=t}}class ti{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new ti}static exists(e){return new ti(void 0,e)}static updateTime(e){return new ti(e)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}class ts{}class ta extends ts{constructor(e,t,r,n=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=n,this.type=0}getFieldMask(){return null}}class to extends ts{constructor(e,t,r,n,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=n,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}class tl extends ts{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class tu extends ts{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */let tc=(()=>{let e={};return e.asc="ASCENDING",e.desc="DESCENDING",e})(),th=(()=>{let e={};return e["<"]="LESS_THAN",e["<="]="LESS_THAN_OR_EQUAL",e[">"]="GREATER_THAN",e[">="]="GREATER_THAN_OR_EQUAL",e["=="]="EQUAL",e["!="]="NOT_EQUAL",e["array-contains"]="ARRAY_CONTAINS",e.in="IN",e["not-in"]="NOT_IN",e["array-contains-any"]="ARRAY_CONTAINS_ANY",e})(),td=(()=>{let e={};return e.and="AND",e.or="OR",e})();class tf{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function tp(e,t){if(!e.useProto3Json)return{seconds:""+t.seconds,nanos:t.nanoseconds};{let e=new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z",""),r=("000000000"+t.nanoseconds).slice(-9);return`${e}.${r}Z`}}function tm(e){return e||_(),ez.fromTimestamp(function(e){let t=ea(e);return new eu(t.seconds,t.nanos)}(e))}function tg(e,t){return ty(e,t).canonicalString()}function ty(e,t){let r=new F(["projects",e.projectId,"databases",e.database]).child("documents");return void 0===t?r:r.child(t)}function tv(e,t){return tg(e.databaseId,t.path)}function t_(e,t){let r=function(e){let t=F.fromString(e);return tb(t)||_(),t}(t);if(r.get(1)!==e.databaseId.projectId)throw new E(w.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+r.get(1)+" vs "+e.databaseId.projectId);if(r.get(3)!==e.databaseId.database)throw new E(w.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+r.get(3)+" vs "+e.databaseId.database);return new M((r.length>4&&"documents"===r.get(4)||_(),r.popFirst(5)))}function tw(e,t,r){return{name:tv(e,t),fields:r.value.mapValue.fields}}function tE(e){return{fieldPath:e.canonicalString()}}function tb(e){return e.length>=4&&"projects"===e.get(0)&&"databases"===e.get(2)}/**
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
 */function tI(e){return new tf(e,!0)}/**
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
 */class tT{}class tA extends tT{constructor(e,t,r,n){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=n,this.terminated=!1}verifyInitialized(){if(this.terminated)throw new E(w.FAILED_PRECONDITION,"The client has already been terminated.")}invokeRPC(e,t,r,n){return this.verifyInitialized(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,s])=>this.connection.invokeRPC(e,ty(t,r),n,i,s)).catch(e=>{if("FirebaseError"===e.name)throw e.code===w.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e;throw new E(w.UNKNOWN,e.toString())})}invokeStreamingRPC(e,t,r,n,i){return this.verifyInitialized(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,a])=>this.connection.invokeStreamingRPC(e,ty(t,r),n,s,a,i)).catch(e=>{if("FirebaseError"===e.name)throw e.code===w.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e;throw new E(w.UNKNOWN,e.toString())})}terminate(){this.terminated=!0,this.connection.terminate()}}async function tN(e,t){let r={writes:t.map(t=>(function(e,t){var r;let n;if(t instanceof ta)n={update:tw(e,t.key,t.value)};else if(t instanceof tl)n={delete:tv(e,t.key)};else if(t instanceof to)n={update:tw(e,t.key,t.data),updateMask:function(e){let t=[];return e.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}(t.fieldMask)};else{if(!(t instanceof tu))return _();n={verify:tv(e,t.key)}}return t.fieldTransforms.length>0&&(n.updateTransforms=t.fieldTransforms.map(e=>(function(e,t){let r=t.transform;if(r instanceof e8)return{fieldPath:t.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(r instanceof te)return{fieldPath:t.field.canonicalString(),appendMissingElements:{values:r.elements}};if(r instanceof tt)return{fieldPath:t.field.canonicalString(),removeAllFromArray:{values:r.elements}};if(r instanceof tr)return{fieldPath:t.field.canonicalString(),increment:r.operand};throw _()})(0,e))),t.precondition.isNone||(n.currentDocument=void 0!==(r=t.precondition).updateTime?{updateTime:tp(e,r.updateTime.toTimestamp())}:void 0!==r.exists?{exists:r.exists}:_()),n})(e.serializer,t))};await e.invokeRPC("Commit",e.serializer.databaseId,F.emptyPath(),r)}async function tS(e,t){let r={documents:t.map(t=>tv(e.serializer,t))},n=await e.invokeStreamingRPC("BatchGetDocuments",e.serializer.databaseId,F.emptyPath(),r,t.length),i=new Map;n.forEach(t=>{var r;let n=(r=e.serializer,"found"in t?function(e,t){t.found||_(),t.found.name,t.found.updateTime;let r=t_(e,t.found.name),n=tm(t.found.updateTime),i=t.found.createTime?tm(t.found.createTime):ez.min(),s=new eJ({mapValue:{fields:t.found.fields}});return eX.newFoundDocument(r,n,i,s)}(r,t):"missing"in t?function(e,t){t.missing||_(),t.readTime||_();let r=t_(e,t.missing),n=tm(t.readTime);return eX.newNoDocument(r,n)}(r,t):_());i.set(n.key.toString(),n)});let s=[];return t.forEach(e=>{let t=i.get(e.toString());t||_(),s.push(t)}),s}async function tD(e,t){let{queryTarget:r,parent:n}=function(e,t){var r,n,i,s;let a;let o={structuredQuery:{}},l=t.path;null!==t.collectionGroup?(a=l,o.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(a=l.popLast(),o.structuredQuery.from=[{collectionId:l.lastSegment()}]),o.parent=(r=a,tg(e.databaseId,r));let u=function(e){if(0!==e.length)return function e(t){return t instanceof eC?function(e){if("=="===e.op){if(eN(e.value))return{unaryFilter:{field:tE(e.field),op:"IS_NAN"}};if(eA(e.value))return{unaryFilter:{field:tE(e.field),op:"IS_NULL"}}}else if("!="===e.op){if(eN(e.value))return{unaryFilter:{field:tE(e.field),op:"IS_NOT_NAN"}};if(eA(e.value))return{unaryFilter:{field:tE(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:tE(e.field),op:th[e.op],value:e.value}}}(t):t instanceof eL?function(t){let r=t.getFilters().map(t=>e(t));return 1===r.length?r[0]:{compositeFilter:{op:td[t.op],filters:r}}}(t):_()}(eL.create(e,"and"))}(t.filters);u&&(o.structuredQuery.where=u);let c=function(e){if(0!==e.length)return e.map(e=>({field:tE(e.field),direction:tc[e.dir]}))}(t.orderBy);c&&(o.structuredQuery.orderBy=c);let h=(n=t.limit,e.useProto3Json||null==n?n:{value:n});return null!==h&&(o.structuredQuery.limit=h),t.startAt&&(o.structuredQuery.startAt={before:(i=t.startAt).inclusive,values:i.position}),t.endAt&&(o.structuredQuery.endAt={before:!(s=t.endAt).inclusive,values:s.position}),{queryTarget:o,parent:a}}(e.serializer,e6(t));return(await e.invokeStreamingRPC("RunQuery",e.serializer.databaseId,n,{structuredQuery:r.structuredQuery})).filter(e=>!!e.document).map(t=>(function(e,t,r){let n=t_(e,t.name),i=tm(t.updateTime),s=t.createTime?tm(t.createTime):ez.min(),a=new eJ({mapValue:{fields:t.fields}}),o=eX.newFoundDocument(n,i,s,a);return r&&o.setHasCommittedMutations(),r?o.setHasCommittedMutations():o})(e.serializer,t.document,void 0))}/**
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
 */let tV="ComponentProvider",tk=new Map;function tR(e){if(e._terminated)throw new E(w.FAILED_PRECONDITION,"The client has already been terminated.");if(!tk.has(e)){var t,r,n;m(tV,"Initializing Datastore");let i=new J((t=e._databaseId,r=e.app.options.appId||"",new R(t,r,e._persistenceKey,(n=e._freezeSettings()).host,n.ssl,n.experimentalForceLongPolling,n.experimentalAutoDetectLongPolling,G(n.experimentalLongPollingOptions),n.useFetchStreams)),u.fetch),s=tI(e._databaseId),a=new tA(e._authCredentials,e._appCheckCredentials,i,s);tk.set(e,a)}return tk.get(e)}/**
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
 */let tC="firestore.googleapis.com";class tL{constructor(e){var t,r;if(void 0===e.host){if(void 0!==e.ssl)throw new E(w.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=tC,this.ssl=!0}else this.host=e.host,this.ssl=null===(t=e.ssl)||void 0===t||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=41943040;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<1048576)throw new E(w.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}(function(e,t,r,n){if(!0===t&&!0===n)throw new E(w.INVALID_ARGUMENT,`${e} and ${r} cannot be used together.`)})("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=G(null!==(r=e.experimentalLongPollingOptions)&&void 0!==r?r:{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new E(w.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new E(w.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new E(w.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){var t,r;return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(t=this.experimentalLongPollingOptions,r=e.experimentalLongPollingOptions,t.timeoutSeconds===r.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}/**
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
 */class tO{constructor(e,t,r,n){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=n,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new tL({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new E(w.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return"notTerminated"!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new E(w.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new tL(e),void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new T;switch(e.type){case"firstParty":return new D(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new E(w.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return"notTerminated"===this._terminateTask&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){"notTerminated"===this._terminateTask?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){let t=tk.get(e);t&&(m(tV,"Removing Datastore"),tk.delete(e),t.terminate())}(this),Promise.resolve()}}function tP(e,t){let r="object"==typeof e?e:(0,i.Mq)(),n=(0,i.qX)(r,"firestore/lite").getImmediate({identifier:"string"==typeof e?e:t||"(default)"});if(!n._initialized){let e=(0,l.P0)("firestore");e&&function(e,t,r,n={}){var i;let s=(e=j(e,tO))._getSettings(),a=`${t}:${r}`;if(s.host!==tC&&s.host!==a&&y("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),e._setSettings(Object.assign(Object.assign({},s),{host:a,ssl:!1})),n.mockUserToken){let t,r;if("string"==typeof n.mockUserToken)t=n.mockUserToken,r=d.MOCK_USER;else{t=(0,l.Sg)(n.mockUserToken,null===(i=e._app)||void 0===i?void 0:i.options.projectId);let s=n.mockUserToken.sub||n.mockUserToken.user_id;if(!s)throw new E(w.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");r=new d(s)}e._authCredentials=new A(new I(t,r))}}(n,...e)}return n}/**
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
 */class tF{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new tF(this.firestore,e,this._query)}}class tx{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new tU(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new tx(this.firestore,e,this._key)}}class tU extends tF{constructor(e,t,r){super(e,t,new e1(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new tx(this.firestore,null,new M(e))}withConverter(e){return new tU(this.firestore,e,this._path)}}function tM(e,t,...r){if(e=(0,l.m9)(e),B("collection","path",t),e instanceof tO){let n=F.fromString(t,...r);return q(n),new tU(e,null,n)}{if(!(e instanceof tx)&&!(e instanceof tU))throw new E(w.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let n=e._path.child(F.fromString(t,...r));return q(n),new tU(e.firestore,null,n)}}function tB(e,t,...r){if(e=(0,l.m9)(e),1==arguments.length&&(t=X.newId()),B("doc","path",t),e instanceof tO){let n=F.fromString(t,...r);return $(n),new tx(e,null,new M(n))}{if(!(e instanceof tx)&&!(e instanceof tU))throw new E(w.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let n=e._path.child(F.fromString(t,...r));return $(n),new tx(e.firestore,e instanceof tU?e.converter:null,new M(n))}}/**
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
 */class t${constructor(e){this._byteString=e}static fromBase64String(e){try{return new t$(ei.fromBase64String(e))}catch(e){throw new E(w.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(e){return new t$(ei.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
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
 */class tq{constructor(...e){for(let t=0;t<e.length;++t)if(0===e[t].length)throw new E(w.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new U(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class tz{constructor(e){this._methodName=e}}/**
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
 */class tj{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new E(w.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new E(w.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return Z(this._lat,e._lat)||Z(this._long,e._long)}}/**
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
 */class tG{constructor(e){this._values=(e||[]).map(e=>e)}toArray(){return this._values.map(e=>e)}isEqual(e){return(/**
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
 */let tH=/^__.*__$/;class tK{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return null!==this.fieldMask?new to(e,this.data,this.fieldMask,t,this.fieldTransforms):new ta(e,this.data,t,this.fieldTransforms)}}class tW{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new to(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function tY(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw _()}}class tQ{constructor(e,t,r,n,i,s){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=n,void 0===i&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=s||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new tQ(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){var t;let r=null===(t=this.path)||void 0===t?void 0:t.child(e),n=this.contextWith({path:r,arrayElement:!1});return n.validatePathSegment(e),n}childContextForFieldPath(e){var t;let r=null===(t=this.path)||void 0===t?void 0:t.child(e),n=this.contextWith({path:r,arrayElement:!1});return n.validatePath(),n}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return rn(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return void 0!==this.fieldMask.find(t=>e.isPrefixOf(t))||void 0!==this.fieldTransforms.find(t=>e.isPrefixOf(t.field))}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(0===e.length)throw this.createError("Document fields must not be empty");if(tY(this.dataSource)&&tH.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class tJ{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||tI(e)}createContext(e,t,r,n=!1){return new tQ({dataSource:e,methodName:t,targetDoc:r,path:U.emptyPath(),arrayElement:!1,hasConverter:n},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function tX(e){let t=e._freezeSettings(),r=tI(e._databaseId);return new tJ(e._databaseId,!!t.ignoreUndefinedProperties,r)}class tZ extends tz{_toFieldTransform(e){if(2===e.dataSource)e.fieldMask.push(e.path);else if(1===e.dataSource)throw e.createError(`${this._methodName}() can only appear at the top level of your update data`);else throw e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return null}isEqual(e){return e instanceof tZ}}function t0(e,t,r){return new tQ({dataSource:3,targetDoc:t.settings.targetDoc,methodName:e._methodName,arrayElement:r},t.databaseId,t.serializer,t.ignoreUndefinedProperties)}class t1 extends null{_toFieldTransform(e){return new tn(e.path,new e8)}isEqual(e){return e instanceof t1}}class t2 extends tz{constructor(e,t){super(e),this._elements=t}_toFieldTransform(e){let t=t0(this,e,!0),r=new te(this._elements.map(e=>t5(e,t)));return new tn(e.path,r)}isEqual(e){return e instanceof t2&&(0,l.vZ)(this._elements,e._elements)}}class t4 extends tz{constructor(e,t){super(e),this._elements=t}_toFieldTransform(e){let t=t0(this,e,!0),r=new tt(this._elements.map(e=>t5(e,t)));return new tn(e.path,r)}isEqual(e){return e instanceof t4&&(0,l.vZ)(this._elements,e._elements)}}class t6 extends tz{constructor(e,t){super(e),this._operand=t}_toFieldTransform(e){let t=new tr(e.serializer,e9(e.serializer,this._operand));return new tn(e.path,t)}isEqual(e){return e instanceof t6&&this._operand===e._operand}}function t3(e,t,r,n=!1){return t5(r,e.createContext(n?4:3,t))}function t5(e,t){if(t7(e=(0,l.m9)(e)))return t8("Unsupported field value:",t,e),t9(e,t);if(e instanceof tz)return function(e,t){if(!tY(t.dataSource))throw t.createError(`${e._methodName}() can only be used with update() and set()`);if(!t.path)throw t.createError(`${e._methodName}() is not currently supported inside arrays`);let r=e._toFieldTransform(t);r&&t.fieldTransforms.push(r)}(e,t),null;if(void 0===e&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),!(e instanceof Array))return function(e,t){var r,n;if(null===(e=(0,l.m9)(e)))return{nullValue:"NULL_VALUE"};if("number"==typeof e)return e9(t.serializer,e);if("boolean"==typeof e)return{booleanValue:e};if("string"==typeof e)return{stringValue:e};if(e instanceof Date){let r=eu.fromDate(e);return{timestampValue:tp(t.serializer,r)}}if(e instanceof eu){let r=new eu(e.seconds,1e3*Math.floor(e.nanoseconds/1e3));return{timestampValue:tp(t.serializer,r)}}if(e instanceof tj)return{geoPointValue:{latitude:e.latitude,longitude:e.longitude}};else if(e instanceof t$)return{bytesValue:(r=t.serializer,n=e._byteString,r.useProto3Json?n.toBase64():n.toUint8Array())};else if(e instanceof tx){let r=t.databaseId,n=e.firestore._databaseId;if(!n.isEqual(r))throw t.createError(`Document reference is for database ${n.projectId}/${n.database} but should be for database ${r.projectId}/${r.database}`);return{referenceValue:tg(e.firestore._databaseId||t.databaseId,e._key.path)}}else if(e instanceof tG)return{mapValue:{fields:{[ed]:{stringValue:em},[eg]:{arrayValue:{values:e.toArray().map(e=>{if("number"!=typeof e)throw t.createError("VectorValues must only contain numeric values.");return e5(t.serializer,e)})}}}}};else throw t.createError(`Unsupported field value: ${z(e)}`)}(e,t);if(t.settings.arrayElement&&4!==t.dataSource)throw t.createError("Nested arrays are not supported");return function(e,t){let r=[],n=0;for(let i of e){let e=t5(i,t.childContextForArray(n));null==e&&(e={nullValue:"NULL_VALUE"}),r.push(e),n++}return{arrayValue:{values:r}}}(e,t)}function t9(e,t){let r={};return function(e){for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}(e)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):er(e,(e,n)=>{let i=t5(n,t.childContextForField(e));null!=i&&(r[e]=i)}),{mapValue:{fields:r}}}function t7(e){return"object"==typeof e&&null!==e&&!(e instanceof Array)&&!(e instanceof Date)&&!(e instanceof eu)&&!(e instanceof tj)&&!(e instanceof t$)&&!(e instanceof tx)&&!(e instanceof tz)&&!(e instanceof tG)}function t8(e,t,r){if(!t7(r)||!("object"==typeof r&&null!==r&&(Object.getPrototypeOf(r)===Object.prototype||null===Object.getPrototypeOf(r)))){let n=z(r);if("an object"===n)throw t.createError(e+" a custom object");throw t.createError(e+" "+n)}}function re(e,t,r){if((t=(0,l.m9)(t))instanceof tq)return t._internalPath;if("string"==typeof t)return rr(e,t);throw rn("Field path arguments must be of type string or ",e,!1,void 0,r)}let rt=RegExp("[~\\*/\\[\\]]");function rr(e,t,r){if(t.search(rt)>=0)throw rn(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,r);try{return new tq(...t.split("."))._internalPath}catch(n){throw rn(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,r)}}function rn(e,t,r,n,i){let s=n&&!n.isEmpty(),a=void 0!==i,o=`Function ${t}() called with invalid data`;r&&(o+=" (via `toFirestore()`)"),o+=". ";let l="";return(s||a)&&(l+=" (found",s&&(l+=` in field ${n}`),a&&(l+=` in document ${i}`),l+=")"),new E(w.INVALID_ARGUMENT,o+e+l)}function ri(e,t){return e.some(e=>e.isEqual(t))}/**
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
 */class rs{constructor(e,t,r,n,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=n,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new tx(this._firestore,this._converter,this._key)}exists(){return null!==this._document}data(){if(this._document){if(!this._converter)return this._userDataWriter.convertValue(this._document.data.value);{let e=new ra(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}}}get(e){if(this._document){let t=this._document.data.field(ru("DocumentSnapshot.get",e));if(null!==t)return this._userDataWriter.convertValue(t)}}}class ra extends rs{data(){return super.data()}}class ro{constructor(e,t){this._docs=t,this.query=e}get docs(){return[...this._docs]}get size(){return this.docs.length}get empty(){return 0===this.docs.length}forEach(e,t){this._docs.forEach(e,t)}}function rl(e,t){return(e=getModularInstance(e),t=getModularInstance(t),e instanceof rs&&t instanceof rs)?e._firestore===t._firestore&&e._key.isEqual(t._key)&&(null===e._document?null===t._document:e._document.isEqual(t._document))&&e._converter===t._converter:e instanceof ro&&t instanceof ro&&function(e,t){if(e=getModularInstance(e),t=getModularInstance(t),e instanceof tF&&t instanceof tF){var r,n;return e.firestore===t.firestore&&(r=e._query,n=t._query,function(e,t){if(e.limit!==t.limit||e.orderBy.length!==t.orderBy.length)return!1;for(let i=0;i<e.orderBy.length;i++){var r,n;if(r=e.orderBy[i],n=t.orderBy[i],!(r.dir===n.dir&&r.field.isEqual(n.field)))return!1}if(e.filters.length!==t.filters.length)return!1;for(let r=0;r<e.filters.length;r++)if(!function e(t,r){return t instanceof eC?r instanceof eC&&t.op===r.op&&t.field.isEqual(r.field)&&ev(t.value,r.value):t instanceof eL?r instanceof eL&&t.op===r.op&&t.filters.length===r.filters.length&&t.filters.reduce((t,n,i)=>t&&e(n,r.filters[i]),!0):void _()}(e.filters[r],t.filters[r]))return!1;return!!(e.collectionGroup===t.collectionGroup&&e.path.isEqual(t.path)&&ek(e.startAt,t.startAt))&&ek(e.endAt,t.endAt)}(e6(r),e6(n))&&r.limitType===n.limitType)&&e.converter===t.converter}return!1}(e.query,t.query)&&ee(e.docs,t.docs,rl)}function ru(e,t){return"string"==typeof t?rr(e,t):t instanceof tq?t._internalPath:t._delegate._internalPath}class rc{}class rh extends rc{}function rd(e,t,...r){let n=[];for(let i of(t instanceof rc&&n.push(t),function(e){let t=e.filter(e=>e instanceof rp).length,r=e.filter(e=>e instanceof rf).length;if(t>1||t>0&&r>0)throw new E(w.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(n=n.concat(r)),n))e=i._apply(e);return e}class rf extends rh{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new rf(e,t,r)}_apply(e){let t=this._parse(e);return rI(e._query,t),new tF(e.firestore,e.converter,e3(e._query,t))}_parse(e){let t=tX(e.firestore);return function(e,t,r,n,i,s,a){let o;if(i.isKeyField()){if("array-contains"===s||"array-contains-any"===s)throw new E(w.INVALID_ARGUMENT,`Invalid Query. You can't perform '${s}' queries on documentId().`);if("in"===s||"not-in"===s){rb(a,s);let t=[];for(let r of a)t.push(rE(n,e,r));o={arrayValue:{values:t}}}else o=rE(n,e,a)}else("in"===s||"not-in"===s||"array-contains-any"===s)&&rb(a,s),o=t3(r,t,a,"in"===s||"not-in"===s);return eC.create(i,s,o)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}class rp extends rc{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new rp(e,t)}_parse(e){let t=this._queryConstraints.map(t=>t._parse(e)).filter(e=>e.getFilters().length>0);return 1===t.length?t[0]:eL.create(t,this._getOperator())}_apply(e){let t=this._parse(e);return 0===t.getFilters().length?e:(function(e,t){let r=e;for(let e of t.getFlattenedFilters())rI(r,e),r=e3(r,e)}(e._query,t),new tF(e.firestore,e.converter,e3(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return"and"===this.type?"and":"or"}}class rm extends rh{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new rm(e,t)}_apply(e){let t=function(e,t,r){if(null!==e.startAt)throw new E(w.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(null!==e.endAt)throw new E(w.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new eq(t,r)}(e._query,this._field,this._direction);return new tF(e.firestore,e.converter,function(e,t){let r=e.explicitOrderBy.concat([t]);return new e1(e.path,e.collectionGroup,r,e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)}(e._query,t))}}function rg(e,t="asc"){let r=ru("orderBy",e);return rm._create(r,t)}class ry extends rh{constructor(e,t,r){super(),this.type=e,this._limit=t,this._limitType=r}static _create(e,t,r){return new ry(e,t,r)}_apply(e){var t,r,n;return new tF(e.firestore,e.converter,(t=e._query,r=this._limit,n=this._limitType,new e1(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),r,n,t.startAt,t.endAt)))}}class rv extends rh{constructor(e,t,r){super(),this.type=e,this._docOrFields=t,this._inclusive=r}static _create(e,t,r){return new rv(e,t,r)}_apply(e){var t;let r=rw(e,this.type,this._docOrFields,this._inclusive);return new tF(e.firestore,e.converter,new e1((t=e._query).path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),t.limit,t.limitType,r,t.endAt))}}class r_ extends rh{constructor(e,t,r){super(),this.type=e,this._docOrFields=t,this._inclusive=r}static _create(e,t,r){return new r_(e,t,r)}_apply(e){var t;let r=rw(e,this.type,this._docOrFields,this._inclusive);return new tF(e.firestore,e.converter,new e1((t=e._query).path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),t.limit,t.limitType,t.startAt,r))}}function rw(e,t,r,n){if(r[0]=(0,l.m9)(r[0]),r[0]instanceof rs)return function(e,t,r,n,i){if(!n)throw new E(w.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${r}().`);let s=[];for(let r of e4(e))if(r.field.isKeyField())s.push(eI(t,n.key));else{let e=n.data.field(r.field);if(ec(e))throw new E(w.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+r.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(null!==e)s.push(e);else{let e=r.field.canonicalString();throw new E(w.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${e}' (used as the orderBy) does not exist.`)}}return new eV(s,i)}(e._query,e.firestore._databaseId,t,r[0]._document,n);{let i=tX(e.firestore);return function(e,t,r,n,i,s){let a=e.explicitOrderBy;if(i.length>a.length)throw new E(w.INVALID_ARGUMENT,`Too many arguments provided to ${n}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);let o=[];for(let s=0;s<i.length;s++){let l=i[s];if(a[s].field.isKeyField()){if("string"!=typeof l)throw new E(w.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${n}(), but got a ${typeof l}`);if(!e2(e)&&-1!==l.indexOf("/"))throw new E(w.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${n}() must be a plain document ID, but '${l}' contains a slash.`);let r=e.path.child(F.fromString(l));if(!M.isDocumentKey(r))throw new E(w.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${n}() must result in a valid document path, but '${r}' is not because it contains an odd number of segments.`);let i=new M(r);o.push(eI(t,i))}else{let e=t3(r,n,l);o.push(e)}}return new eV(o,s)}(e._query,e.firestore._databaseId,i,t,r,n)}}function rE(e,t,r){if("string"==typeof(r=(0,l.m9)(r))){if(""===r)throw new E(w.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!e2(t)&&-1!==r.indexOf("/"))throw new E(w.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${r}' contains a '/' character.`);let n=t.path.child(F.fromString(r));if(!M.isDocumentKey(n))throw new E(w.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return eI(e,new M(n))}if(r instanceof tx)return eI(e,r._key);throw new E(w.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${z(r)}.`)}function rb(e,t){if(!Array.isArray(e)||0===e.length)throw new E(w.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function rI(e,t){let r=function(e,t){for(let r of e)for(let e of r.getFlattenedFilters())if(t.indexOf(e.op)>=0)return e.op;return null}(e.filters,function(e){switch(e){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(null!==r){if(r===t.op)throw new E(w.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`);throw new E(w.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${r.toString()}' filters.`)}}/**
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
 */class rT{convertValue(e,t="none"){switch(ey(e)){case 0:return null;case 1:return e.booleanValue;case 2:return eo(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(el(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw _()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){let r={};return er(e,(e,n)=>{r[e]=this.convertValue(n,t)}),r}convertVectorValue(e){var t,r,n;return new tG(null===(n=null===(r=null===(t=e.fields)||void 0===t?void 0:t[eg].arrayValue)||void 0===r?void 0:r.values)||void 0===n?void 0:n.map(e=>eo(e.doubleValue)))}convertGeoPoint(e){return new tj(eo(e.latitude),eo(e.longitude))}convertArray(e,t){return(e.values||[]).map(e=>this.convertValue(e,t))}convertServerTimestamp(e,t){switch(t){case"previous":let r=function e(t){let r=t.mapValue.fields.__previous_value__;return ec(r)?e(r):r}(e);if(null==r)return null;return this.convertValue(r,t);case"estimate":return this.convertTimestamp(eh(e));default:return null}}convertTimestamp(e){let t=ea(e);return new eu(t.seconds,t.nanos)}convertDocumentKey(e,t){let r=F.fromString(e);tb(r)||_();let n=new L(r.get(1),r.get(3)),i=new M(r.popFirst(5));return n.isEqual(t)||g(`Document ${i} contains a document reference within a different database (${n.projectId}/${n.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}class rA extends rT{constructor(e){super(),this.firestore=e}convertBytes(e){return new t$(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new tx(this.firestore,null,t)}}function rN(e){let t=tR((e=j(e,tx)).firestore),r=new rA(e.firestore);return tS(t,[e._key]).then(t=>{1===t.length||_();let n=t[0];return new rs(e.firestore,r,e._key,n.isFoundDocument()?n:null,e.converter)})}function rS(e){!/**
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
 */function(e){if("L"===e.limitType&&0===e.explicitOrderBy.length)throw new E(w.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}((e=j(e,tF))._query);let t=tR(e.firestore),r=new rA(e.firestore);return tD(t,e._query).then(t=>{let n=t.map(t=>new ra(e.firestore,r,t.key,t,e.converter));return"L"===e._query.limitType&&n.reverse(),new ro(e,n)})}function rD(e,t,r,...n){let i;let s=tX((e=j(e,tx)).firestore);return i="string"==typeof(t=(0,l.m9)(t))||t instanceof tq?function(e,t,r,n,i,s){let a=e.createContext(1,t,r),o=[re(t,n,r)],u=[i];if(s.length%2!=0)throw new E(w.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let e=0;e<s.length;e+=2)o.push(re(t,s[e])),u.push(s[e+1]);let c=[],h=eJ.empty();for(let e=o.length-1;e>=0;--e)if(!ri(c,o[e])){let t=o[e],r=u[e];r=(0,l.m9)(r);let n=a.childContextForFieldPath(t);if(r instanceof tZ)c.push(t);else{let e=t5(r,n);null!=e&&(c.push(t),h.set(t,e))}}return new tW(h,new eQ(c),a.fieldTransforms)}(s,"updateDoc",e._key,t,r,n):function(e,t,r,n){let i=e.createContext(1,t,r);t8("Data must be an object, but it was:",i,n);let s=[],a=eJ.empty();return er(n,(e,n)=>{let o=rr(t,e,r);n=(0,l.m9)(n);let u=i.childContextForFieldPath(o);if(n instanceof tZ)s.push(o);else{let e=t5(n,u);null!=e&&(s.push(o),a.set(o,e))}}),new tW(a,new eQ(s),i.fieldTransforms)}(s,"updateDoc",e._key,t),tN(tR(e.firestore),[i.toMutation(e._key,ti.exists(!0))])}function rV(e,t){var r,n,i;let s=tB(e=j(e,tU)),a=(r=e.converter,n=t,r?r.toFirestore(n):n),o=function(e,t,r,n,i,s={}){let a,o;let l=e.createContext(s.merge||s.mergeFields?2:0,t,r,i);t8("Data must be an object, but it was:",l,n);let u=t9(n,l);if(s.merge)a=new eQ(l.fieldMask),o=l.fieldTransforms;else if(s.mergeFields){let e=[];for(let n of s.mergeFields){let i=re(t,n,r);if(!l.contains(i))throw new E(w.INVALID_ARGUMENT,`Field '${i}' is specified in your field mask but missing from your input data.`);ri(e,i)||e.push(i)}a=new eQ(e),o=l.fieldTransforms.filter(e=>a.covers(e.field))}else a=null,o=l.fieldTransforms;return new tK(new eJ(u),a,o)}(tX(e.firestore),"addDoc",s._key,a,null!==s.converter,{});return tN(tR(e.firestore),[o.toMutation(s._key,ti.exists(!1))]).then(()=>s)}/**
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
 */class rk{constructor(e,t,r,n,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=n,this.removalCallback=i,this.deferred=new b,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(e=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,n,i){let s=new rk(e,t,Date.now()+r,n,i);return s.start(r),s}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new E(w.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}f=`${i.Jn}_lite`,(0,i.Xd)(new s.wA("firestore/lite",(e,{instanceIdentifier:t,options:r})=>{let n=e.getProvider("app").getImmediate(),i=new tO(new N(e.getProvider("auth-internal")),new k(e.getProvider("app-check-internal")),function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new E(w.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new L(e.options.projectId,t)}(n,t),n);return r&&i._setSettings(r),i},"PUBLIC").setMultipleInstances(!0)),(0,i.KN)("firestore-lite",h,"node"),(0,i.KN)("firestore-lite",h,"esm2017")}};