import{E as o,a as y}from"./chunks/EzFormItem.8e62555e.js";import"./chunks/EzFormItemAutoBindingInput.fc4ef82f.js";import{d as i,o as r,c,G as s,B as a,e as l,z as n,O as F}from"./chunks/framework.f385a0f3.js";const m={class:"example-box"},b=n("input",{placeholder:"Enter Username"},null,-1),C=n("input",{placeholder:"Enter your First name"},null,-1),A=n("input",{placeholder:"Enter your Last name"},null,-1),d=n("input",{placeholder:"Password",type:"password"},null,-1),E=n("button",{type:"submit"},"Submit",-1),q=n("p",null,"Fill form and submit then check console tab in devtool.",-1),_=i({__name:"ValidationFormItemLevel",setup(D){function e(p){console.log(p)}function t(p){console.log(p)}return(p,u)=>(r(),c("div",m,[s(l(y),{onSubmit:e,onError:t},{default:a(()=>[s(l(o),{label:"Username",name:"user.username",rules:[{required:!0}]},{default:a(()=>[b]),_:1}),s(l(o),{label:"First name",name:"user.firstName",rules:[{required:!0}]},{default:a(()=>[C]),_:1}),s(l(o),{label:"First name",name:"user.lastName",rules:[{required:!0}]},{default:a(()=>[A]),_:1}),s(l(o),{label:"Password",name:"user.password",rules:[{required:!0}]},{default:a(()=>[d]),_:1}),E]),_:1}),q]))}}),h={class:"example-box"},g=n("input",{placeholder:"Enter Username"},null,-1),f=n("input",{placeholder:"Enter your First name"},null,-1),v=n("input",{placeholder:"Enter your Last name"},null,-1),w=n("input",{placeholder:"Password",type:"password"},null,-1),I=n("button",{type:"submit"},"Submit",-1),z=n("p",null,"Fill form and submit then check console tab in devtool.",-1),S=i({__name:"ValidationFormLevel",setup(D){function e(p){console.log(p)}function t(p){console.log(p)}return(p,u)=>(r(),c("div",h,[s(l(y),{rules:{"user.username":[{type:"string",min:3}],"user.firstName":{type:"string",min:3}},onSubmit:e,onError:t},{default:a(()=>[s(l(o),{label:"Username",name:["user","username"],rules:[{required:!0}]},{default:a(()=>[g]),_:1}),s(l(o),{label:"First name",name:"user.firstName",rules:[{required:!0}]},{default:a(()=>[f]),_:1}),s(l(o),{label:"First name",name:"user.lastName",rules:[{required:!0}]},{default:a(()=>[v]),_:1}),s(l(o),{label:"Password",name:"user.password",rules:[{required:!0}]},{default:a(()=>[w]),_:1}),I]),_:1},8,["rules"]),z]))}}),P=F("",5),N=F("",3),T=F("",6),R=JSON.parse('{"title":"Validation","description":"","frontmatter":{"title":"Validation"},"headers":[],"relativePath":"guide/validation.md","filePath":"guide/validation.md"}'),k={name:"guide/validation.md"},$=Object.assign(k,{setup(D){return(e,t)=>(r(),c("div",null,[P,s(_),N,s(S),T]))}});export{R as __pageData,$ as default};