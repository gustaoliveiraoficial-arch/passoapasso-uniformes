"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[837],{6712:function(e,t,n){n.d(t,{ET:function(){return ni},IO:function(){return t1},JU:function(){return tI},PL:function(){return nn},QT:function(){return nt},Xo:function(){return t6},ad:function(){return tb},ar:function(){return t9},hJ:function(){return tk},r7:function(){return nr}});var r,i,s=n(9279),a=n(2680),o=n(9053),l=n(3943);/**
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
 */class u{constructor(e){this.uid=e}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}u.UNAUTHENTICATED=new u(null),u.GOOGLE_CREDENTIALS=new u("google-credentials-uid"),u.FIRST_PARTY=new u("first-party-uid"),u.MOCK_USER=new u("mock-user");/**
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
 */let c="10.14.0",h=new o.Yd("@firebase/firestore");function d(e,...t){if(h.logLevel<=o.in.DEBUG){let n=t.map(m);h.debug(`Firestore (${c}): ${e}`,...n)}}function f(e,...t){if(h.logLevel<=o.in.ERROR){let n=t.map(m);h.error(`Firestore (${c}): ${e}`,...n)}}function p(e,...t){if(h.logLevel<=o.in.WARN){let n=t.map(m);h.warn(`Firestore (${c}): ${e}`,...n)}}function m(e){if("string"==typeof e)return e;try{/**
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
 */return JSON.stringify(e)}catch(t){return e}}/**
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
 */function g(e="Unexpected state"){let t=`FIRESTORE (${c}) INTERNAL ASSERTION FAILED: `+e;throw f(t),Error(t)}function y(e,t){e||g()}/**
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
 */let w="unknown",v="invalid-argument",_="unauthenticated",b="failed-precondition",T="unimplemented";class S extends l.ZR{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class E{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class k{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(u.UNAUTHENTICATED))}shutdown(){}}class I{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class V{constructor(e){this.auth=null,e.onInit(e=>{this.auth=e})}getToken(){return this.auth?this.auth.getToken().then(e=>e?(y("string"==typeof e.accessToken),new E(e.accessToken,new u(this.auth.getUid()))):null):Promise.resolve(null)}invalidateToken(){}start(e,t){}shutdown(){}}class A{constructor(e,t,n){this.t=e,this.i=t,this.o=n,this.type="FirstParty",this.user=u.FIRST_PARTY,this.u=new Map}l(){return this.o?this.o():null}get headers(){this.u.set("X-Goog-AuthUser",this.t);let e=this.l();return e&&this.u.set("Authorization",e),this.i&&this.u.set("X-Goog-Iam-Authorization-Token",this.i),this.u}}class N{constructor(e,t,n){this.t=e,this.i=t,this.o=n}getToken(){return Promise.resolve(new A(this.t,this.i,this.o))}start(e,t){e.enqueueRetryable(()=>t(u.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class P{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class F{constructor(e){this.h=e,this.appCheck=null,e.onInit(e=>{this.appCheck=e})}getToken(){return this.appCheck?this.appCheck.getToken().then(e=>e?(y("string"==typeof e.token),new P(e.token)):null):Promise.resolve(null)}invalidateToken(){}start(e,t){}shutdown(){}}/**
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
 */class x{constructor(e,t,n,r,i,s,a,o,l){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=r,this.ssl=i,this.forceLongPolling=s,this.autoDetectLongPolling=a,this.longPollingOptions=o,this.useFetchStreams=l}}class R{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new R("","")}get isDefaultDatabase(){return"(default)"===this.database}isEqual(e){return e instanceof R&&e.projectId===this.projectId&&e.database===this.database}}class D{constructor(e,t,n){void 0===t?t=0:t>e.length&&g(),void 0===n?n=e.length-t:n>e.length-t&&g(),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return 0===D.comparator(this,e)}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof D?e.forEach(e=>{t.push(e)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let n=Math.min(e.length,t.length);for(let r=0;r<n;r++){let n=e.get(r),i=t.get(r);if(n<i)return -1;if(n>i)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class O extends D{construct(e,t,n){return new O(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){let t=[];for(let n of e){if(n.indexOf("//")>=0)throw new S(v,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(e=>e.length>0))}return new O(t)}static emptyPath(){return new O([])}}let C=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class L extends D{construct(e,t,n){return new L(e,t,n)}static isValidIdentifier(e){return C.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),L.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&"__name__"===this.get(0)}static keyField(){return new L(["__name__"])}static fromServerFormat(e){let t=[],n="",r=0,i=()=>{if(0===n.length)throw new S(v,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""},s=!1;for(;r<e.length;){let t=e[r];if("\\"===t){if(r+1===e.length)throw new S(v,"Path has trailing escape character: "+e);let t=e[r+1];if("\\"!==t&&"."!==t&&"`"!==t)throw new S(v,"Path has invalid escape sequence: "+e);n+=t,r+=2}else"`"===t?s=!s:"."!==t||s?n+=t:i(),r++}if(i(),s)throw new S(v,"Unterminated ` in path: "+e);return new L(t)}static emptyPath(){return new L([])}}/**
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
 */class ${constructor(e){this.path=e}static fromPath(e){return new $(O.fromString(e))}static fromName(e){return new $(O.fromString(e).popFirst(5))}static empty(){return new $(O.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===O.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return O.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new $(new O(e.slice()))}}/**
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
 */function M(e,t,n){if(!n)throw new S(v,`Function ${e}() cannot be called with an empty ${t}.`)}function q(e){if(!$.isDocumentKey(e))throw new S(v,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function U(e){if($.isDocumentKey(e))throw new S(v,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function z(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{var t;let n=(t=e).constructor?t.constructor.name:null;return n?`a custom ${n} object`:"an object"}}return"function"==typeof e?"a function":g()}function j(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new S(v,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let n=z(e);throw new S(v,`Expected type '${t.name}', but it was: ${n}`)}}return e}/**
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
 */function B(e){let t={};return void 0!==e.timeoutSeconds&&(t.timeoutSeconds=e.timeoutSeconds),t}/**
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
 */let K=null;function G(){return null===K?K=268435456+Math.round(2147483648*Math.random()):K++,"0x"+K.toString(16)}function Y(e){return 0===e&&1/e==-1/0}/**
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
 */let Q={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};function H(e){if(void 0===e)return f("RPC_ERROR","HTTP error has no status"),w;switch(e){case 200:return"ok";case 400:return b;case 401:return _;case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 416:return"out-of-range";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return w;case 501:return T;case 503:return"unavailable";case 504:return"deadline-exceeded";default:return e>=200&&e<300?"ok":e>=400&&e<500?b:e>=500&&e<600?"internal":w}}/**
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
 */(i=r||(r={}))[i.OK=0]="OK",i[i.CANCELLED=1]="CANCELLED",i[i.UNKNOWN=2]="UNKNOWN",i[i.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",i[i.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",i[i.NOT_FOUND=5]="NOT_FOUND",i[i.ALREADY_EXISTS=6]="ALREADY_EXISTS",i[i.PERMISSION_DENIED=7]="PERMISSION_DENIED",i[i.UNAUTHENTICATED=16]="UNAUTHENTICATED",i[i.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",i[i.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",i[i.ABORTED=10]="ABORTED",i[i.OUT_OF_RANGE=11]="OUT_OF_RANGE",i[i.UNIMPLEMENTED=12]="UNIMPLEMENTED",i[i.INTERNAL=13]="INTERNAL",i[i.UNAVAILABLE=14]="UNAVAILABLE",i[i.DATA_LOSS=15]="DATA_LOSS";class W extends class{constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.m=t+"://"+e.host,this.A=`projects/${n}/databases/${r}`,this.T="(default)"===this.databaseId.database?`project_id=${n}`:`project_id=${n}&database_id=${r}`}get R(){return!1}P(e,t,n,r,i){let s=G(),a=this.V(e,t.toUriEncodedString());d("RestConnection",`Sending RPC '${e}' ${s}:`,a,n);let o={"google-cloud-resource-prefix":this.A,"x-goog-request-params":this.T};return this.I(o,r,i),this.p(e,a,o,n).then(t=>(d("RestConnection",`Received RPC '${e}' ${s}: `,t),t),t=>{throw p("RestConnection",`RPC '${e}' ${s} failed with error: `,t,"url: ",a,"request:",n),t})}g(e,t,n,r,i,s){return this.P(e,t,n,r,i)}I(e,t,n){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+c}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((t,n)=>e[n]=t),n&&n.headers.forEach((t,n)=>e[n]=t)}V(e,t){let n=Q[e];return`${this.m}/v1/${t}:${n}`}terminate(){}}{constructor(e,t){super(e),this.F=t}v(e,t){throw Error("Not supported by FetchConnection")}async p(e,t,n,r){var i;let s;let a=JSON.stringify(r);try{s=await this.F(t,{method:"POST",headers:n,body:a})}catch(e){throw new S(H(e.status),"Request failed with error: "+e.statusText)}if(!s.ok){let e=await s.json();Array.isArray(e)&&(e=e[0]);let t=null===(i=null==e?void 0:e.error)||void 0===i?void 0:i.message;throw new S(H(s.status),`Request failed with error: ${null!=t?t:s.statusText}`)}return s.json()}}/**
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
 */class J{static newId(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length,n="";for(;n.length<20;){let r=/**
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
 */function(e){let t="undefined"!=typeof self&&(self.crypto||self.msCrypto),n=new Uint8Array(40);if(t&&"function"==typeof t.getRandomValues)t.getRandomValues(n);else for(let e=0;e<40;e++)n[e]=Math.floor(256*Math.random());return n}(0);for(let i=0;i<r.length;++i)n.length<20&&r[i]<t&&(n+=e.charAt(r[i]%e.length))}return n}}function X(e,t){return e<t?-1:e>t?1:0}function Z(e,t,n){return e.length===t.length&&e.every((e,r)=>n(e,t[r]))}/**
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
 */function ee(e){let t=0;for(let n in e)Object.prototype.hasOwnProperty.call(e,n)&&t++;return t}function et(e,t){for(let n in e)Object.prototype.hasOwnProperty.call(e,n)&&t(n,e[n])}/**
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
 */class en extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 *//**
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
 */class er{constructor(e){this.binaryString=e}static fromBase64String(e){return new er(function(e){try{return atob(e)}catch(e){throw"undefined"!=typeof DOMException&&e instanceof DOMException?new en("Invalid base64 string: "+e):e}}(e))}static fromUint8Array(e){return new er(function(e){let t="";for(let n=0;n<e.length;++n)t+=String.fromCharCode(e[n]);return t}(e))}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return btoa(this.binaryString)}toUint8Array(){return function(e){let t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return X(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}er.EMPTY_BYTE_STRING=new er("");let ei=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function es(e){if(y(!!e),"string"==typeof e){let t=0,n=ei.exec(e);if(y(!!n),n[1]){let e=n[1];t=Number(e=(e+"000000000").substr(0,9))}return{seconds:Math.floor(new Date(e).getTime()/1e3),nanos:t}}return{seconds:ea(e.seconds),nanos:ea(e.nanos)}}function ea(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}function eo(e){return"string"==typeof e?er.fromBase64String(e):er.fromUint8Array(e)}/**
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
 */class el{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0||t>=1e9)throw new S(v,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800||e>=253402300800)throw new S(v,"Timestamp seconds out of range: "+e)}static now(){return el.fromMillis(Date.now())}static fromDate(e){return el.fromMillis(e.getTime())}static fromMillis(e){let t=Math.floor(e/1e3);return new el(t,Math.floor(1e6*(e-1e3*t)))}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?X(this.nanoseconds,e.nanoseconds):X(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){return String(this.seconds- -62135596800).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
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
 */function eu(e){var t,n;return"server_timestamp"===(null===(n=((null===(t=null==e?void 0:e.mapValue)||void 0===t?void 0:t.fields)||{}).__type__)||void 0===n?void 0:n.stringValue)}function ec(e){let t=e.mapValue.fields.__previous_value__;return eu(t)?ec(t):t}function eh(e){let t=es(e.mapValue.fields.__local_write_time__.timestampValue);return new el(t.seconds,t.nanos)}/**
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
 */let ed={};function ef(e){var t,n;return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?eu(e)?4:"__max__"===(((e.mapValue||{}).fields||{}).__type__||{}).stringValue?9007199254740991:"__vector__"===(null===(n=((null===(t=null==e?void 0:e.mapValue)||void 0===t?void 0:t.fields)||{}).__type__)||void 0===n?void 0:n.stringValue)?10:11:g()}function ep(e,t){if(e===t)return!0;let n=ef(e);if(n!==ef(t))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return eh(e).isEqual(eh(t));case 3:return function(e,t){if("string"==typeof e.timestampValue&&"string"==typeof t.timestampValue&&e.timestampValue.length===t.timestampValue.length)return e.timestampValue===t.timestampValue;let n=es(e.timestampValue),r=es(t.timestampValue);return n.seconds===r.seconds&&n.nanos===r.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return eo(e.bytesValue).isEqual(eo(t.bytesValue));case 7:return e.referenceValue===t.referenceValue;case 8:return ea(e.geoPointValue.latitude)===ea(t.geoPointValue.latitude)&&ea(e.geoPointValue.longitude)===ea(t.geoPointValue.longitude);case 2:return function(e,t){if("integerValue"in e&&"integerValue"in t)return ea(e.integerValue)===ea(t.integerValue);if("doubleValue"in e&&"doubleValue"in t){let n=ea(e.doubleValue),r=ea(t.doubleValue);return n===r?Y(n)===Y(r):isNaN(n)&&isNaN(r)}return!1}(e,t);case 9:return Z(e.arrayValue.values||[],t.arrayValue.values||[],ep);case 10:case 11:return function(e,t){let n=e.mapValue.fields||{},r=t.mapValue.fields||{};if(ee(n)!==ee(r))return!1;for(let e in n)if(n.hasOwnProperty(e)&&(void 0===r[e]||!ep(n[e],r[e])))return!1;return!0}(e,t);default:return g()}}function em(e,t){return void 0!==(e.values||[]).find(e=>ep(e,t))}function eg(e,t){if(e===t)return 0;let n=ef(e),r=ef(t);if(n!==r)return X(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return X(e.booleanValue,t.booleanValue);case 2:return function(e,t){let n=ea(e.integerValue||e.doubleValue),r=ea(t.integerValue||t.doubleValue);return n<r?-1:n>r?1:n===r?0:isNaN(n)?isNaN(r)?0:-1:1}(e,t);case 3:return ey(e.timestampValue,t.timestampValue);case 4:return ey(eh(e),eh(t));case 5:return X(e.stringValue,t.stringValue);case 6:return function(e,t){let n=eo(e),r=eo(t);return n.compareTo(r)}(e.bytesValue,t.bytesValue);case 7:return function(e,t){let n=e.split("/"),r=t.split("/");for(let e=0;e<n.length&&e<r.length;e++){let t=X(n[e],r[e]);if(0!==t)return t}return X(n.length,r.length)}(e.referenceValue,t.referenceValue);case 8:return function(e,t){let n=X(ea(e.latitude),ea(t.latitude));return 0!==n?n:X(ea(e.longitude),ea(t.longitude))}(e.geoPointValue,t.geoPointValue);case 9:return ew(e.arrayValue,t.arrayValue);case 10:return function(e,t){var n,r,i,s;let a=e.fields||{},o=t.fields||{},l=null===(n=a.value)||void 0===n?void 0:n.arrayValue,u=null===(r=o.value)||void 0===r?void 0:r.arrayValue,c=X((null===(i=null==l?void 0:l.values)||void 0===i?void 0:i.length)||0,(null===(s=null==u?void 0:u.values)||void 0===s?void 0:s.length)||0);return 0!==c?c:ew(l,u)}(e.mapValue,t.mapValue);case 11:return function(e,t){if(e===ed&&t===ed)return 0;if(e===ed)return 1;if(t===ed)return -1;let n=e.fields||{},r=Object.keys(n),i=t.fields||{},s=Object.keys(i);r.sort(),s.sort();for(let e=0;e<r.length&&e<s.length;++e){let t=X(r[e],s[e]);if(0!==t)return t;let a=eg(n[r[e]],i[s[e]]);if(0!==a)return a}return X(r.length,s.length)}(e.mapValue,t.mapValue);default:throw g()}}function ey(e,t){if("string"==typeof e&&"string"==typeof t&&e.length===t.length)return X(e,t);let n=es(e),r=es(t),i=X(n.seconds,r.seconds);return 0!==i?i:X(n.nanos,r.nanos)}function ew(e,t){let n=e.values||[],r=t.values||[];for(let e=0;e<n.length&&e<r.length;++e){let t=eg(n[e],r[e]);if(t)return t}return X(n.length,r.length)}function ev(e,t){return{referenceValue:`projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`}}function e_(e){return!!e&&"arrayValue"in e}function eb(e){return!!e&&"nullValue"in e}function eT(e){return!!e&&"doubleValue"in e&&isNaN(Number(e.doubleValue))}function eS(e){return!!e&&"mapValue"in e}function eE(e){if(e.geoPointValue)return{geoPointValue:Object.assign({},e.geoPointValue)};if(e.timestampValue&&"object"==typeof e.timestampValue)return{timestampValue:Object.assign({},e.timestampValue)};if(e.mapValue){let t={mapValue:{fields:{}}};return et(e.mapValue.fields,(e,n)=>t.mapValue.fields[e]=eE(n)),t}if(e.arrayValue){let t={arrayValue:{values:[]}};for(let n=0;n<(e.arrayValue.values||[]).length;++n)t.arrayValue.values[n]=eE(e.arrayValue.values[n]);return t}return Object.assign({},e)}class ek{constructor(e,t){this.position=e,this.inclusive=t}}/**
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
 */class eI{}class eV extends eI{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?"in"===t||"not-in"===t?this.createKeyFieldInFilter(e,t,n):new eN(e,t,n):"array-contains"===t?new eR(e,n):"in"===t?new eD(e,n):"not-in"===t?new eO(e,n):"array-contains-any"===t?new eC(e,n):new eV(e,t,n)}static createKeyFieldInFilter(e,t,n){return"in"===t?new eP(e,n):new eF(e,n)}matches(e){let t=e.data.field(this.field);return"!="===this.op?null!==t&&this.matchesComparison(eg(t,this.value)):null!==t&&ef(this.value)===ef(t)&&this.matchesComparison(eg(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return 0===e;case"!=":return 0!==e;case">":return e>0;case">=":return e>=0;default:return g()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class eA extends eI{constructor(e,t){super(),this.filters=e,this.op=t,this.D=null}static create(e,t){return new eA(e,t)}matches(e){return"and"===this.op?void 0===this.filters.find(t=>!t.matches(e)):void 0!==this.filters.find(t=>t.matches(e))}getFlattenedFilters(){return null!==this.D||(this.D=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.D}getFilters(){return Object.assign([],this.filters)}}class eN extends eV{constructor(e,t,n){super(e,t,n),this.key=$.fromName(n.referenceValue)}matches(e){let t=$.comparator(e.key,this.key);return this.matchesComparison(t)}}class eP extends eV{constructor(e,t){super(e,"in",t),this.keys=ex("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class eF extends eV{constructor(e,t){super(e,"not-in",t),this.keys=ex("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function ex(e,t){var n;return((null===(n=t.arrayValue)||void 0===n?void 0:n.values)||[]).map(e=>$.fromName(e.referenceValue))}class eR extends eV{constructor(e,t){super(e,"array-contains",t)}matches(e){let t=e.data.field(this.field);return e_(t)&&em(t.arrayValue,this.value)}}class eD extends eV{constructor(e,t){super(e,"in",t)}matches(e){let t=e.data.field(this.field);return null!==t&&em(this.value.arrayValue,t)}}class eO extends eV{constructor(e,t){super(e,"not-in",t)}matches(e){if(em(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;let t=e.data.field(this.field);return null!==t&&!em(this.value.arrayValue,t)}}class eC extends eV{constructor(e,t){super(e,"array-contains-any",t)}matches(e){let t=e.data.field(this.field);return!(!e_(t)||!t.arrayValue.values)&&t.arrayValue.values.some(e=>em(this.value.arrayValue,e))}}/**
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
 */class eL{constructor(e,t="asc"){this.field=e,this.dir=t}}/**
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
 */class e${constructor(e){this.timestamp=e}static fromTimestamp(e){return new e$(e)}static min(){return new e$(new el(0,0))}static max(){return new e$(new el(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */class eM{constructor(e,t){this.comparator=e,this.root=t||eU.EMPTY}insert(e,t){return new eM(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,eU.BLACK,null,null))}remove(e){return new eM(this.comparator,this.root.remove(e,this.comparator).copy(null,null,eU.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let n=this.comparator(e,t.key);if(0===n)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){let r=this.comparator(e,n.key);if(0===r)return t+n.left.size;r<0?n=n.left:(t+=n.left.size+1,n=n.right)}return -1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){let e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new eq(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new eq(this.root,e,this.comparator,!1)}getReverseIterator(){return new eq(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new eq(this.root,e,this.comparator,!0)}}class eq{constructor(e,t,n,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(0===i){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class eU{constructor(e,t,n,r,i){this.key=e,this.value=t,this.color=null!=n?n:eU.RED,this.left=null!=r?r:eU.EMPTY,this.right=null!=i?i:eU.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,r,i){return new eU(null!=e?e:this.key,null!=t?t:this.value,null!=n?n:this.color,null!=r?r:this.left,null!=i?i:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let r=this,i=n(e,r.key);return(r=i<0?r.copy(null,null,null,r.left.insert(e,t,n),null):0===i?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,n))).fixUp()}removeMin(){if(this.left.isEmpty())return eU.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),(e=e.copy(null,null,null,e.left.removeMin(),null)).fixUp()}remove(e,t){let n,r=this;if(0>t(e,r.key))r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),0===t(e,r.key)){if(r.right.isEmpty())return eU.EMPTY;n=r.right.min(),r=r.copy(n.key,n.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=(e=(e=e.copy(null,null,null,null,e.right.rotateRight())).rotateLeft()).colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=(e=e.rotateRight()).colorFlip()),e}rotateLeft(){let e=this.copy(null,null,eU.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,eU.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){return Math.pow(2,this.check())<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw g();let e=this.left.check();if(e!==this.right.check())throw g();return e+(this.isRed()?0:1)}}eU.EMPTY=null,eU.RED=!0,eU.BLACK=!1,eU.EMPTY=new class{constructor(){this.size=0}get key(){throw g()}get value(){throw g()}get color(){throw g()}get left(){throw g()}get right(){throw g()}copy(e,t,n,r,i){return this}insert(e,t,n){return new eU(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class ez{constructor(e){this.comparator=e,this.data=new eM(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){let n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){let r=n.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let n;for(n=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new ej(this.data.getIterator())}getIteratorFrom(e){return new ej(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(e=>{t=t.add(e)}),t}isEqual(e){if(!(e instanceof ez)||this.size!==e.size)return!1;let t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){let e=t.getNext().key,r=n.getNext().key;if(0!==this.comparator(e,r))return!1}return!0}toArray(){let e=[];return this.forEach(t=>{e.push(t)}),e}toString(){let e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){let t=new ez(this.comparator);return t.data=e,t}}class ej{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class eB{constructor(e){this.fields=e,e.sort(L.comparator)}static empty(){return new eB([])}unionWith(e){let t=new ez(L.comparator);for(let e of this.fields)t=t.add(e);for(let n of e)t=t.add(n);return new eB(t.toArray())}covers(e){for(let t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Z(this.fields,e.fields,(e,t)=>e.isEqual(t))}}/**
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
 */class eK{constructor(e){this.value=e}static empty(){return new eK({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(!eS(t=(t.mapValue.fields||{})[e.get(n)]))return null;return(t=(t.mapValue.fields||{})[e.lastSegment()])||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=eE(t)}setAll(e){let t=L.emptyPath(),n={},r=[];e.forEach((e,i)=>{if(!t.isImmediateParentOf(i)){let e=this.getFieldsMap(t);this.applyChanges(e,n,r),n={},r=[],t=i.popLast()}e?n[i.lastSegment()]=eE(e):r.push(i.lastSegment())});let i=this.getFieldsMap(t);this.applyChanges(i,n,r)}delete(e){let t=this.field(e.popLast());eS(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return ep(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let r=t.mapValue.fields[e.get(n)];eS(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,n){for(let r of(et(t,(t,n)=>e[t]=n),n))delete e[r]}clone(){return new eK(eE(this.value))}}/**
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
 */class eG{constructor(e,t,n,r,i,s,a){this.key=e,this.documentType=t,this.version=n,this.readTime=r,this.createTime=i,this.data=s,this.documentState=a}static newInvalidDocument(e){return new eG(e,0,e$.min(),e$.min(),e$.min(),eK.empty(),0)}static newFoundDocument(e,t,n,r){return new eG(e,1,t,e$.min(),n,r,0)}static newNoDocument(e,t){return new eG(e,2,t,e$.min(),e$.min(),eK.empty(),0)}static newUnknownDocument(e,t){return new eG(e,3,t,e$.min(),e$.min(),eK.empty(),2)}convertToFoundDocument(e,t){return this.createTime.isEqual(e$.min())&&(2===this.documentType||0===this.documentType)&&(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=eK.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=eK.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=e$.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(e){return e instanceof eG&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new eG(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class eY{constructor(e,t=null,n=[],r=[],i=null,s=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=r,this.limit=i,this.startAt=s,this.endAt=a,this.C=null}}function eQ(e,t=null,n=[],r=[],i=null,s=null,a=null){return new eY(e,t,n,r,i,s,a)}/**
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
 */class eH{constructor(e,t=null,n=[],r=[],i=null,s="F",a=null,o=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=r,this.limit=i,this.limitType=s,this.startAt=a,this.endAt=o,this.S=null,this.N=null,this.O=null,this.startAt,this.endAt}}function eW(e,t){let n=e.filters.concat([t]);return new eH(e.path,e.collectionGroup,e.explicitOrderBy.slice(),n,e.limit,e.limitType,e.startAt,e.endAt)}/**
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
 */function eJ(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Y(t)?"-0":t}}/**
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
 */class eX{constructor(){this._=void 0}}class eZ extends eX{}class e0 extends eX{constructor(e){super(),this.elements=e}}class e1 extends eX{constructor(e){super(),this.elements=e}}class e4 extends eX{constructor(e,t){super(),this.serializer=e,this.q=t}}class e9{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new e9}static exists(e){return new e9(void 0,e)}static updateTime(e){return new e9(e)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}class e2{}class e3 extends e2{constructor(e,t,n,r=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class e6 extends e2{constructor(e,t,n,r,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}class e5 extends e2{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class e8 extends e2{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */let e7={asc:"ASCENDING",desc:"DESCENDING"},te={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},tt={and:"AND",or:"OR"};class tn{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function tr(e,t){return e.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function ti(e){return y(!!e),e$.fromTimestamp(function(e){let t=es(e);return new el(t.seconds,t.nanos)}(e))}function ts(e,t){return ta(e,t).canonicalString()}function ta(e,t){let n=new O(["projects",e.projectId,"databases",e.database]).child("documents");return void 0===t?n:n.child(t)}function to(e,t){return ts(e.databaseId,t.path)}function tl(e,t){let n=function(e){let t=O.fromString(e);return y(th(t)),t}(t);if(n.get(1)!==e.databaseId.projectId)throw new S(v,"Tried to deserialize key from different project: "+n.get(1)+" vs "+e.databaseId.projectId);if(n.get(3)!==e.databaseId.database)throw new S(v,"Tried to deserialize key from different database: "+n.get(3)+" vs "+e.databaseId.database);return new $((y(n.length>4&&"documents"===n.get(4)),n.popFirst(5)))}function tu(e,t,n){return{name:to(e,t),fields:n.value.mapValue.fields}}function tc(e){return{fieldPath:e.canonicalString()}}function th(e){return e.length>=4&&"projects"===e.get(0)&&"databases"===e.get(2)}/**
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
 */function td(e){return new tn(e,!0)}/**
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
 */class tf extends class{}{constructor(e,t,n,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=r,this.Y=!1}Z(){if(this.Y)throw new S(b,"The client has already been terminated.")}P(e,t,n,r){return this.Z(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,s])=>this.connection.P(e,ta(t,n),r,i,s)).catch(e=>{throw"FirebaseError"===e.name?(e.code===_&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new S(w,e.toString())})}g(e,t,n,r,i){return this.Z(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,a])=>this.connection.g(e,ta(t,n),r,s,a,i)).catch(e=>{throw"FirebaseError"===e.name?(e.code===_&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new S(w,e.toString())})}terminate(){this.Y=!0,this.connection.terminate()}}async function tp(e,t){let n={writes:t.map(t=>(function(e,t){var n;let r;if(t instanceof e3)r={update:tu(e,t.key,t.value)};else if(t instanceof e5)r={delete:to(e,t.key)};else if(t instanceof e6)r={update:tu(e,t.key,t.data),updateMask:function(e){let t=[];return e.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}(t.fieldMask)};else{if(!(t instanceof e8))return g();r={verify:to(e,t.key)}}return t.fieldTransforms.length>0&&(r.updateTransforms=t.fieldTransforms.map(e=>(function(e,t){let n=t.transform;if(n instanceof eZ)return{fieldPath:t.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(n instanceof e0)return{fieldPath:t.field.canonicalString(),appendMissingElements:{values:n.elements}};if(n instanceof e1)return{fieldPath:t.field.canonicalString(),removeAllFromArray:{values:n.elements}};if(n instanceof e4)return{fieldPath:t.field.canonicalString(),increment:n.q};throw g()})(0,e))),t.precondition.isNone||(r.currentDocument=void 0!==(n=t.precondition).updateTime?{updateTime:tr(e,n.updateTime.toTimestamp())}:void 0!==n.exists?{exists:n.exists}:g()),r})(e.serializer,t))};await e.P("Commit",e.serializer.databaseId,O.emptyPath(),n)}async function tm(e,t){let n={documents:t.map(t=>to(e.serializer,t))},r=await e.g("BatchGetDocuments",e.serializer.databaseId,O.emptyPath(),n,t.length),i=new Map;r.forEach(t=>{var n;let r=(n=e.serializer,"found"in t?function(e,t){y(!!t.found),t.found.name,t.found.updateTime;let n=tl(e,t.found.name),r=ti(t.found.updateTime),i=t.found.createTime?ti(t.found.createTime):e$.min(),s=new eK({mapValue:{fields:t.found.fields}});return eG.newFoundDocument(n,r,i,s)}(n,t):"missing"in t?function(e,t){y(!!t.missing),y(!!t.readTime);let n=tl(e,t.missing),r=ti(t.readTime);return eG.newNoDocument(n,r)}(n,t):g());i.set(r.key.toString(),r)});let s=[];return t.forEach(e=>{let t=i.get(e.toString());y(!!t),s.push(t)}),s}async function tg(e,t){let{B:n,parent:r}=function(e,t){var n,r,i,s;let a;let o={structuredQuery:{}},l=t.path;null!==t.collectionGroup?(a=l,o.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(a=l.popLast(),o.structuredQuery.from=[{collectionId:l.lastSegment()}]),o.parent=(n=a,ts(e.databaseId,n));let u=function(e){if(0!==e.length)return function e(t){return t instanceof eV?function(e){if("=="===e.op){if(eT(e.value))return{unaryFilter:{field:tc(e.field),op:"IS_NAN"}};if(eb(e.value))return{unaryFilter:{field:tc(e.field),op:"IS_NULL"}}}else if("!="===e.op){if(eT(e.value))return{unaryFilter:{field:tc(e.field),op:"IS_NOT_NAN"}};if(eb(e.value))return{unaryFilter:{field:tc(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:tc(e.field),op:te[e.op],value:e.value}}}(t):t instanceof eA?function(t){let n=t.getFilters().map(t=>e(t));return 1===n.length?n[0]:{compositeFilter:{op:tt[t.op],filters:n}}}(t):g()}(eA.create(e,"and"))}(t.filters);u&&(o.structuredQuery.where=u);let c=function(e){if(0!==e.length)return e.map(e=>({field:tc(e.field),direction:e7[e.dir]}))}(t.orderBy);c&&(o.structuredQuery.orderBy=c);let h=(r=t.limit,e.useProto3Json||null==r?r:{value:r});return null!==h&&(o.structuredQuery.limit=h),t.startAt&&(o.structuredQuery.startAt={before:(i=t.startAt).inclusive,values:i.position}),t.endAt&&(o.structuredQuery.endAt={before:!(s=t.endAt).inclusive,values:s.position}),{B:o,parent:a}}(e.serializer,(t.N||(t.N=function(e,t){if("F"===e.limitType)return eQ(e.path,e.collectionGroup,t,e.filters,e.limit,e.startAt,e.endAt);{t=t.map(e=>{let t="desc"===e.dir?"asc":"desc";return new eL(e.field,t)});let n=e.endAt?new ek(e.endAt.position,e.endAt.inclusive):null,r=e.startAt?new ek(e.startAt.position,e.startAt.inclusive):null;return eQ(e.path,e.collectionGroup,t,e.filters,e.limit,n,r)}}(t,function(e){if(null===e.S){let t;e.S=[];let n=new Set;for(let t of e.explicitOrderBy)e.S.push(t),n.add(t.field.canonicalString());let r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(t=new ez(L.comparator),e.filters.forEach(e=>{e.getFlattenedFilters().forEach(e=>{e.isInequality()&&(t=t.add(e.field))})}),t).forEach(t=>{n.has(t.canonicalString())||t.isKeyField()||e.S.push(new eL(t,r))}),n.has(L.keyField().canonicalString())||e.S.push(new eL(L.keyField(),r))}return e.S}(t))),t.N));return(await e.g("RunQuery",e.serializer.databaseId,r,{structuredQuery:n.structuredQuery})).filter(e=>!!e.document).map(t=>(function(e,t,n){let r=tl(e,t.name),i=ti(t.updateTime),s=t.createTime?ti(t.createTime):e$.min(),a=new eK({mapValue:{fields:t.fields}}),o=eG.newFoundDocument(r,i,s,a);return n&&o.setHasCommittedMutations(),n?o.setHasCommittedMutations():o})(e.serializer,t.document,void 0))}/**
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
 */let ty=new Map;function tw(e){if(e._terminated)throw new S(b,"The client has already been terminated.");if(!ty.has(e)){var t,n;d("ComponentProvider","Initializing Datastore");let r=new W((t=e._databaseId,new x(t,e.app.options.appId||"",e._persistenceKey,(n=e._freezeSettings()).host,n.ssl,n.experimentalForceLongPolling,n.experimentalAutoDetectLongPolling,B(n.experimentalLongPollingOptions),n.useFetchStreams)),fetch.bind(null)),i=td(e._databaseId),s=new tf(e._authCredentials,e._appCheckCredentials,r,i);ty.set(e,s)}return ty.get(e)}class tv{constructor(e){var t,n;if(void 0===e.host){if(void 0!==e.ssl)throw new S(v,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=null===(t=e.ssl)||void 0===t||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=41943040;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<1048576)throw new S(v,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}!function(e,t,n,r){if(!0===t&&!0===r)throw new S(v,`${e} and ${n} cannot be used together.`)}("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=B(null!==(n=e.experimentalLongPollingOptions)&&void 0!==n?n:{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new S(v,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new S(v,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new S(v,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){var t,n;return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(t=this.experimentalLongPollingOptions,n=e.experimentalLongPollingOptions,t.timeoutSeconds===n.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class t_{constructor(e,t,n,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new tv({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new S(b,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return"notTerminated"!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new S(b,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new tv(e),void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new k;switch(e.type){case"firstParty":return new N(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new S(v,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return"notTerminated"===this._terminateTask&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){"notTerminated"===this._terminateTask?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){let t=ty.get(e);t&&(d("ComponentProvider","Removing Datastore"),ty.delete(e),t.terminate())}(this),Promise.resolve()}}function tb(e,t){let n="object"==typeof e?e:(0,s.Mq)(),r=(0,s.qX)(n,"firestore/lite").getImmediate({identifier:"string"==typeof e?e:t||"(default)"});if(!r._initialized){let e=(0,l.P0)("firestore");e&&function(e,t,n,r={}){var i;let s=(e=j(e,t_))._getSettings(),a=`${t}:${n}`;if("firestore.googleapis.com"!==s.host&&s.host!==a&&p("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),e._setSettings(Object.assign(Object.assign({},s),{host:a,ssl:!1})),r.mockUserToken){let t,n;if("string"==typeof r.mockUserToken)t=r.mockUserToken,n=u.MOCK_USER;else{t=(0,l.Sg)(r.mockUserToken,null===(i=e._app)||void 0===i?void 0:i.options.projectId);let s=r.mockUserToken.sub||r.mockUserToken.user_id;if(!s)throw new S(v,"mockUserToken must contain 'sub' or 'user_id' field!");n=new u(s)}e._authCredentials=new I(new E(t,n))}}(r,...e)}return r}/**
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
 */class tT{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new tT(this.firestore,e,this._query)}}class tS{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new tE(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new tS(this.firestore,e,this._key)}}class tE extends tT{constructor(e,t,n){super(e,t,new eH(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new tS(this.firestore,null,new $(e))}withConverter(e){return new tE(this.firestore,e,this._path)}}function tk(e,t,...n){if(e=(0,l.m9)(e),M("collection","path",t),e instanceof t_){let r=O.fromString(t,...n);return U(r),new tE(e,null,r)}{if(!(e instanceof tS||e instanceof tE))throw new S(v,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=e._path.child(O.fromString(t,...n));return U(r),new tE(e.firestore,null,r)}}function tI(e,t,...n){if(e=(0,l.m9)(e),1==arguments.length&&(t=J.newId()),M("doc","path",t),e instanceof t_){let r=O.fromString(t,...n);return q(r),new tS(e,null,new $(r))}{if(!(e instanceof tS||e instanceof tE))throw new S(v,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=e._path.child(O.fromString(t,...n));return q(r),new tS(e.firestore,e instanceof tE?e.converter:null,new $(r))}}/**
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
 */class tV{constructor(e){this._byteString=e}static fromBase64String(e){try{return new tV(er.fromBase64String(e))}catch(e){throw new S(v,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(e){return new tV(er.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
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
 */class tA{constructor(...e){for(let t=0;t<e.length;++t)if(0===e[t].length)throw new S(v,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new L(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class tN{constructor(e){this._methodName=e}}/**
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
 */class tP{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new S(v,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new S(v,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return X(this._lat,e._lat)||X(this._long,e._long)}}/**
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
 *//**
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
 */class tF{constructor(e){this._values=(e||[]).map(e=>e)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;++n)if(e[n]!==t[n])return!1;return!0}(this._values,e._values)}}/**
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
 */let tx=/^__.*__$/;class tR{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return null!==this.fieldMask?new e6(e,this.data,this.fieldMask,t,this.fieldTransforms):new e3(e,this.data,t,this.fieldTransforms)}}class tD{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new e6(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function tO(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw g()}}class tC{constructor(e,t,n,r,i,s){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=r,void 0===i&&this.tt(),this.fieldTransforms=i||[],this.fieldMask=s||[]}get path(){return this.settings.path}get et(){return this.settings.et}rt(e){return new tC(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}nt(e){var t;let n=null===(t=this.path)||void 0===t?void 0:t.child(e),r=this.rt({path:n,it:!1});return r.st(e),r}ot(e){var t;let n=null===(t=this.path)||void 0===t?void 0:t.child(e),r=this.rt({path:n,it:!1});return r.tt(),r}ut(e){return this.rt({path:void 0,it:!0})}_t(e){return tY(e,this.settings.methodName,this.settings.ct||!1,this.path,this.settings.lt)}contains(e){return void 0!==this.fieldMask.find(t=>e.isPrefixOf(t))||void 0!==this.fieldTransforms.find(t=>e.isPrefixOf(t.field))}tt(){if(this.path)for(let e=0;e<this.path.length;e++)this.st(this.path.get(e))}st(e){if(0===e.length)throw this._t("Document fields must not be empty");if(tO(this.et)&&tx.test(e))throw this._t('Document fields cannot begin and end with "__"')}}class tL{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||td(e)}ht(e,t,n,r=!1){return new tC({et:e,methodName:t,lt:n,path:L.emptyPath(),it:!1,ct:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function t$(e){let t=e._freezeSettings(),n=td(e._databaseId);return new tL(e._databaseId,!!t.ignoreUndefinedProperties,n)}class tM extends tN{_toFieldTransform(e){if(2!==e.et)throw 1===e.et?e._t(`${this._methodName}() can only appear at the top level of your update data`):e._t(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof tM}}function tq(e,t){if(tz(e=(0,l.m9)(e)))return tj("Unsupported field value:",t,e),tU(e,t);if(e instanceof tN)return function(e,t){if(!tO(t.et))throw t._t(`${e._methodName}() can only be used with update() and set()`);if(!t.path)throw t._t(`${e._methodName}() is not currently supported inside arrays`);let n=e._toFieldTransform(t);n&&t.fieldTransforms.push(n)}(e,t),null;if(void 0===e&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),e instanceof Array){if(t.settings.it&&4!==t.et)throw t._t("Nested arrays are not supported");return function(e,t){let n=[],r=0;for(let i of e){let e=tq(i,t.ut(r));null==e&&(e={nullValue:"NULL_VALUE"}),n.push(e),r++}return{arrayValue:{values:n}}}(e,t)}return function(e,t){var n,r,i,s;if(null===(e=(0,l.m9)(e)))return{nullValue:"NULL_VALUE"};if("number"==typeof e){return i=t.serializer,"number"==typeof(s=e)&&Number.isInteger(s)&&!Y(s)&&s<=Number.MAX_SAFE_INTEGER&&s>=Number.MIN_SAFE_INTEGER?{integerValue:""+s}:eJ(i,s)}if("boolean"==typeof e)return{booleanValue:e};if("string"==typeof e)return{stringValue:e};if(e instanceof Date){let n=el.fromDate(e);return{timestampValue:tr(t.serializer,n)}}if(e instanceof el){let n=new el(e.seconds,1e3*Math.floor(e.nanoseconds/1e3));return{timestampValue:tr(t.serializer,n)}}if(e instanceof tP)return{geoPointValue:{latitude:e.latitude,longitude:e.longitude}};if(e instanceof tV)return{bytesValue:(n=t.serializer,r=e._byteString,n.useProto3Json?r.toBase64():r.toUint8Array())};if(e instanceof tS){let n=t.databaseId,r=e.firestore._databaseId;if(!r.isEqual(n))throw t._t(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);return{referenceValue:ts(e.firestore._databaseId||t.databaseId,e._key.path)}}if(e instanceof tF)return{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:e.toArray().map(e=>{if("number"!=typeof e)throw t._t("VectorValues must only contain numeric values.");return eJ(t.serializer,e)})}}}}};throw t._t(`Unsupported field value: ${z(e)}`)}(e,t)}function tU(e,t){let n={};return!function(e){for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}(e)?et(e,(e,r)=>{let i=tq(r,t.nt(e));null!=i&&(n[e]=i)}):t.path&&t.path.length>0&&t.fieldMask.push(t.path),{mapValue:{fields:n}}}function tz(e){return!("object"!=typeof e||null===e||e instanceof Array||e instanceof Date||e instanceof el||e instanceof tP||e instanceof tV||e instanceof tS||e instanceof tN||e instanceof tF)}function tj(e,t,n){if(!tz(n)||!("object"==typeof n&&null!==n&&(Object.getPrototypeOf(n)===Object.prototype||null===Object.getPrototypeOf(n)))){let r=z(n);throw"an object"===r?t._t(e+" a custom object"):t._t(e+" "+r)}}function tB(e,t,n){if((t=(0,l.m9)(t))instanceof tA)return t._internalPath;if("string"==typeof t)return tG(e,t);throw tY("Field path arguments must be of type string or ",e,!1,void 0,n)}let tK=RegExp("[~\\*/\\[\\]]");function tG(e,t,n){if(t.search(tK)>=0)throw tY(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,n);try{return new tA(...t.split("."))._internalPath}catch(r){throw tY(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,n)}}function tY(e,t,n,r,i){let s=r&&!r.isEmpty(),a=void 0!==i,o=`Function ${t}() called with invalid data`;n&&(o+=" (via `toFirestore()`)"),o+=". ";let l="";return(s||a)&&(l+=" (found",s&&(l+=` in field ${r}`),a&&(l+=` in document ${i}`),l+=")"),new S(v,o+e+l)}function tQ(e,t){return e.some(e=>e.isEqual(t))}/**
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
 */class tH{constructor(e,t,n,r,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new tS(this._firestore,this._converter,this._key)}exists(){return null!==this._document}data(){if(this._document){if(this._converter){let e=new tW(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){let t=this._document.data.field(tX("DocumentSnapshot.get",e));if(null!==t)return this._userDataWriter.convertValue(t)}}}class tW extends tH{data(){return super.data()}}class tJ{constructor(e,t){this._docs=t,this.query=e}get docs(){return[...this._docs]}get size(){return this.docs.length}get empty(){return 0===this.docs.length}forEach(e,t){this._docs.forEach(e,t)}}function tX(e,t){return"string"==typeof t?tG(e,t):t instanceof tA?t._internalPath:t._delegate._internalPath}/**
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
 */class tZ{}class t0 extends tZ{}function t1(e,t,...n){let r=[];for(let i of(t instanceof tZ&&r.push(t),function(e){let t=e.filter(e=>e instanceof t2).length,n=e.filter(e=>e instanceof t4).length;if(t>1||t>0&&n>0)throw new S(v,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r=r.concat(n)),r))e=i._apply(e);return e}class t4 extends t0{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new t4(e,t,n)}_apply(e){let t=this._parse(e);return t7(e._query,t),new tT(e.firestore,e.converter,eW(e._query,t))}_parse(e){let t=t$(e.firestore);return function(e,t,n,r,i,s,a){let o;if(i.isKeyField()){if("array-contains"===s||"array-contains-any"===s)throw new S(v,`Invalid Query. You can't perform '${s}' queries on documentId().`);if("in"===s||"not-in"===s){t8(a,s);let t=[];for(let n of a)t.push(t5(r,e,n));o={arrayValue:{values:t}}}else o=t5(r,e,a)}else"in"!==s&&"not-in"!==s&&"array-contains-any"!==s||t8(a,s),o=function(e,t,n,r=!1){return tq(n,e.ht(r?4:3,t))}(n,t,a,"in"===s||"not-in"===s);return eV.create(i,s,o)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function t9(e,t,n){let r=tX("where",e);return t4._create(r,t,n)}class t2 extends tZ{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new t2(e,t)}_parse(e){let t=this._queryConstraints.map(t=>t._parse(e)).filter(e=>e.getFilters().length>0);return 1===t.length?t[0]:eA.create(t,this._getOperator())}_apply(e){let t=this._parse(e);return 0===t.getFilters().length?e:(function(e,t){let n=e;for(let e of t.getFlattenedFilters())t7(n,e),n=eW(n,e)}(e._query,t),new tT(e.firestore,e.converter,eW(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return"and"===this.type?"and":"or"}}class t3 extends t0{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new t3(e,t)}_apply(e){let t=function(e,t,n){if(null!==e.startAt)throw new S(v,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(null!==e.endAt)throw new S(v,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new eL(t,n)}(e._query,this._field,this._direction);return new tT(e.firestore,e.converter,function(e,t){let n=e.explicitOrderBy.concat([t]);return new eH(e.path,e.collectionGroup,n,e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)}(e._query,t))}}function t6(e,t="asc"){let n=tX("orderBy",e);return t3._create(n,t)}function t5(e,t,n){if("string"==typeof(n=(0,l.m9)(n))){if(""===n)throw new S(v,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!(null!==t.collectionGroup)&&-1!==n.indexOf("/"))throw new S(v,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);let r=t.path.child(O.fromString(n));if(!$.isDocumentKey(r))throw new S(v,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return ev(e,new $(r))}if(n instanceof tS)return ev(e,n._key);throw new S(v,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${z(n)}.`)}function t8(e,t){if(!Array.isArray(e)||0===e.length)throw new S(v,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function t7(e,t){let n=function(e,t){for(let n of e)for(let e of n.getFlattenedFilters())if(t.indexOf(e.op)>=0)return e.op;return null}(e.filters,function(e){switch(e){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(null!==n)throw n===t.op?new S(v,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new S(v,`Invalid query. You cannot use '${t.op.toString()}' filters with '${n.toString()}' filters.`)}class ne extends class{convertValue(e,t="none"){switch(ef(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ea(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(eo(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw g()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){let n={};return et(e,(e,r)=>{n[e]=this.convertValue(r,t)}),n}convertVectorValue(e){var t,n,r;let i=null===(r=null===(n=null===(t=e.fields)||void 0===t?void 0:t.value.arrayValue)||void 0===n?void 0:n.values)||void 0===r?void 0:r.map(e=>ea(e.doubleValue));return new tF(i)}convertGeoPoint(e){return new tP(ea(e.latitude),ea(e.longitude))}convertArray(e,t){return(e.values||[]).map(e=>this.convertValue(e,t))}convertServerTimestamp(e,t){switch(t){case"previous":let n=ec(e);return null==n?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(eh(e));default:return null}}convertTimestamp(e){let t=es(e);return new el(t.seconds,t.nanos)}convertDocumentKey(e,t){let n=O.fromString(e);y(th(n));let r=new R(n.get(1),n.get(3)),i=new $(n.popFirst(5));return r.isEqual(t)||f(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}{constructor(e){super(),this.firestore=e}convertBytes(e){return new tV(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new tS(this.firestore,null,t)}}function nt(e){let t=tw((e=j(e,tS)).firestore),n=new ne(e.firestore);return tm(t,[e._key]).then(t=>{y(1===t.length);let r=t[0];return new tH(e.firestore,n,e._key,r.isFoundDocument()?r:null,e.converter)})}function nn(e){!function(e){if("L"===e.limitType&&0===e.explicitOrderBy.length)throw new S(T,"limitToLast() queries require specifying at least one orderBy() clause")}((e=j(e,tT))._query);let t=tw(e.firestore),n=new ne(e.firestore);return tg(t,e._query).then(t=>{let r=t.map(t=>new tW(e.firestore,n,t.key,t,e.converter));return"L"===e._query.limitType&&r.reverse(),new tJ(e,r)})}function nr(e,t,n,...r){let i;let s=t$((e=j(e,tS)).firestore);return i="string"==typeof(t=(0,l.m9)(t))||t instanceof tA?function(e,t,n,r,i,s){let a=e.ht(1,t,n),o=[tB(t,r,n)],u=[i];if(s.length%2!=0)throw new S(v,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let e=0;e<s.length;e+=2)o.push(tB(t,s[e])),u.push(s[e+1]);let c=[],h=eK.empty();for(let e=o.length-1;e>=0;--e)if(!tQ(c,o[e])){let t=o[e],n=u[e];n=(0,l.m9)(n);let r=a.ot(t);if(n instanceof tM)c.push(t);else{let e=tq(n,r);null!=e&&(c.push(t),h.set(t,e))}}return new tD(h,new eB(c),a.fieldTransforms)}(s,"updateDoc",e._key,t,n,r):function(e,t,n,r){let i=e.ht(1,t,n);tj("Data must be an object, but it was:",i,r);let s=[],a=eK.empty();return et(r,(e,r)=>{let o=tG(t,e,n);r=(0,l.m9)(r);let u=i.ot(o);if(r instanceof tM)s.push(o);else{let e=tq(r,u);null!=e&&(s.push(o),a.set(o,e))}}),new tD(a,new eB(s),i.fieldTransforms)}(s,"updateDoc",e._key,t),tp(tw(e.firestore),[i.toMutation(e._key,e9.exists(!0))])}function ni(e,t){var n;let r=tI(e=j(e,tE)),i=(n=e.converter)?n.toFirestore(t):t,s=function(e,t,n,r,i,s={}){let a,o;let l=e.ht(s.merge||s.mergeFields?2:0,t,n,i);tj("Data must be an object, but it was:",l,r);let u=tU(r,l);if(s.merge)a=new eB(l.fieldMask),o=l.fieldTransforms;else if(s.mergeFields){let e=[];for(let r of s.mergeFields){let i=tB(t,r,n);if(!l.contains(i))throw new S(v,`Field '${i}' is specified in your field mask but missing from your input data.`);tQ(e,i)||e.push(i)}a=new eB(e),o=l.fieldTransforms.filter(e=>a.covers(e.field))}else a=null,o=l.fieldTransforms;return new tR(new eK(u),a,o)}(t$(e.firestore),"addDoc",r._key,i,null!==r.converter,{});return tp(tw(e.firestore),[s.toMutation(r._key,e9.exists(!1))]).then(()=>r)}c=`${s.Jn}_lite`,(0,s.Xd)(new a.wA("firestore/lite",(e,{instanceIdentifier:t,options:n})=>{let r=e.getProvider("app").getImmediate(),i=new t_(new V(e.getProvider("auth-internal")),new F(e.getProvider("app-check-internal")),function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new S(v,'"projectId" not provided in firebase.initializeApp.');return new R(e.options.projectId,t)}(r,t),r);return n&&i._setSettings(n),i},"PUBLIC").setMultipleInstances(!0)),(0,s.KN)("firestore-lite","4.7.3",""),(0,s.KN)("firestore-lite","4.7.3","esm2017")}}]);