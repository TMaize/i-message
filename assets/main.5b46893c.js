(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const o of e.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function i(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerpolicy&&(e.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?e.credentials="include":t.crossorigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function a(t){if(t.ep)return;t.ep=!0;const e=i(t);fetch(t.href,e)}})();const f={},u={},d={init:!1};async function g(r){var i,a,t;const s=r.data;if(s.messageId&&s.request&&s.messageId){const e=s,o=f[e.request];if(!o)return;try{const n=await o(e);if(n instanceof Error)throw n;if(n.code){const m={messageId:e.messageId,data:n.data,code:n.code};(i=r.source)==null||i.postMessage(m);return}const c={messageId:e.messageId,data:n,code:200};(a=r.source)==null||a.postMessage(c)}catch(n){const c={messageId:e.messageId,error:n,code:-1};(t=r.source)==null||t.postMessage(c)}}if(s.messageId&&!s.request&&s.messageId){const e=s,o=u[e.messageId];if(clearTimeout(o.timer),delete u[e.messageId],!o)return;e.error?o.reject(e.error):o.resolve(e.data)}}function l(){d.init||(d.init=!0,window.addEventListener("message",g))}function p(r,s){l(),f[r]=async function(i){return s.length==2?new Promise(a=>s(i,a)):await s(i)}}async function w(r){if(l(),!r.request)throw new Error("\u7F3A\u5C11\u53C2\u6570 request");const s=String(Date.now()),i=r.target||window.parent,a=r.timeout||10*1e3,t={messageId:s,request:r.request,data:r.data},e=new Promise((o,n)=>{u[s]={payload:t,resolve:o,reject:n,timer:window.setTimeout(()=>{n(new Error("timeout"))},a)}});return i.postMessage(t,"*"),e}export{w as e,p as o};
