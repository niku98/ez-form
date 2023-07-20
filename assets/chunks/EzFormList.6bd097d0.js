import{b as Q}from"./EzFormItem.8e62555e.js";import{$ as X,f as Y,h as v,i as Z,j as h,o as x,k as M,l as ee,m as re,n as te}from"./EzFormItemAutoBindingInput.fc4ef82f.js";import{S as se,l as S,j as $,w as j,a3 as _,d as ne,ad as ae}from"./framework.f385a0f3.js";function oe(s){se(X,s)}function ie(s){const o=Y(s),{fieldMeta:a,handleChange:t,requiredMarkString:c,validate:l,resetFieldMeta:f,clearValidate:u,updateProps:g,props:m,injectedForm:y}=o,i=S(()=>a.transformedValue&&Array.isArray(a.transformedValue)?a.transformedValue:[]),d=S(()=>Array.isArray(m.name)?m.name:m.name?[m.name]:[]),w=S(()=>i.value.map((r,e)=>({key:v([...d.value,e]),index:e,getNamePath(n){return v([...d.value,e,...Z(n)])}})));function F(r){return x(y.fields).filter(({name:e})=>v(e).includes(v([...d.value,r])+"."))}function A(r){F(r).forEach(e=>{e.reset()})}function k(r){F(r).forEach(e=>{e.clearValidate()})}function R(r,e){return e=Array.isArray(e)?e:[e],v([...d.value,r,...e])}function L(r){return r===void 0?y.meta.errors:F(r).map(({error:e})=>e).filter(e=>!!e)}function z(r){return L(r).length>0}function q(r){const e=[...i.value];e.push(r),t(e)}function B(r,e){const n=[...i.value];n.splice(r,0,e),t(n)}function I(r){const e=[...i.value];e.unshift(r),t(e)}function N(){const r=[...i.value],e=r.pop();return t(r),e}function b(){const r=[...i.value],e=r.shift();return t(r),e}function E(r){const e=[...i.value];e.splice(r,1),t(e)}function P(r,e){const n=[...i.value],p=n.findIndex(J=>J[r]===e);p>-1&&n.splice(p,1),t(n)}function V(r,e){const n=[...i.value];n[r]=e,t(n)}function O(r,e){const n=[...i.value],p=n[r];n[r]=n[e],n[e]=p,t(n)}function T(r,e){const n=[...i.value],p=n[r];n.splice(r,1),n.splice(e,0,p),t(n)}const H={props:m,meta:a,requiredMarkString:c,listValues:i,namePrefix:d,fields:w,reset:f,registerFormField:G,unRegisterFormField:K,updateProps:g,getItemFields:F,resetItem:A,clearItemValidate:k,validate:l,clearValidate:u,getNamePath:R,getErrors:L,hasError:z,add:q,insert:B,unshift:I,pop:N,shift:b,remove:E,removeByKey:P,replace:V,swap:O,move:T},C=$(()=>{}),U=le(a,H),W=$(()=>()=>{}),D=$(()=>{});function G(r){D.value(),C.value(),o.registerFormField(r),D.value=W.value(),C.value=U()}function K(r){o.unRegisterFormField(r),D.value(),C.value()}return G(),j(()=>m.name,(r,e)=>{e&&K(e),G()}),_(()=>{K()}),H}function le(s,o){return _(()=>{if(!s.name)return;const a=h[s.formName];if(!a)return;const t=v(s.name);a.lists&&delete a.lists[t]}),()=>{const a=s.formName,t=s.formName,c=j(()=>s.name,(l,f)=>{h[s.formName]||(h[s.formName]={});const u=h[s.formName];if(!u)return;if(f){const m=v(f);u.lists&&delete u.lists[m]}if(!l)return;const g=v(l);u.lists?u.lists[g]=o:u.lists={[g]:o}},{immediate:!0});return()=>{if(!t)return;const l=h[a];if(!l)return;const f=v(t);l.lists&&delete l.lists[f],c()}}}function ue(s,o){const a=M(),t=s.formList??ie(s);return s.formList&&(t.unRegisterFormField(),t.updateProps(s),t.registerFormField(a),j(s,ee(()=>{t.updateProps(s)},500))),j(()=>t.meta.rawValue,c=>{o("change",re(c),a)}),oe(t),{formListInstance:t,formInstance:a}}const me=ne({name:"EzFormList",props:te(),setup:(s,o)=>{const{formListInstance:a,formInstance:t}=ue(s,o.emit),{meta:c,requiredMarkString:l,listValues:f,fields:u,getErrors:g,getNamePath:m,hasError:y,add:i,pop:d,insert:w,unshift:F,shift:A,remove:k,removeByKey:R,swap:L,replace:z,move:q}=a,B=S(()=>`${t.classPrefix}-form-list`);return o.expose(a),()=>{var I,N,b,E;return ae(Q,{class:B.value,label:s.label,idFor:c.id,requiredMark:l.value,noStyle:s.noStyle,hasError:!!c.error},{default:()=>{var P,V;return(V=(P=o.slots).default)==null?void 0:V.call(P,{value:f.value,length:f.value.length,fields:u.value,getNamePath:m,getErrors:g,hasError:y,add:i,insert:w,unshift:F,shift:A,pop:d,remove:k,removeByKey:R,swap:L,replace:z,move:q,form:t})},errors:(N=(I=o.slots).errors)==null?void 0:N.call(I,{error:c.error,form:t,formList:a}),extra:(E=(b=o.slots).extra)==null?void 0:E.call(b,{form:t,formList:a})})}}}),de=me;export{de as E,ie as u};