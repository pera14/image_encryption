(this.webpackJsonpencryption=this.webpackJsonpencryption||[]).push([[0],{10:function(e,t,n){},11:function(e,t,n){},12:function(e,t,n){"use strict";n.r(t);var c=n(0),i=n(1),l=n.n(i),r=n(4),a=n.n(r),o=(n(10),n(11),n(3)),s=function(){var e=Object(i.useState)(null),t=Object(o.a)(e,2),n=t[0],l=t[1],r=Object(i.useState)(null),a=Object(o.a)(r,2),s=a[0],d=(a[1],Object(i.useRef)());return Object(c.jsxs)("div",{style:{flex:1},children:[n&&Object(c.jsxs)("div",{style:{flexDirection:"row"},children:[Object(c.jsxs)("div",{style:{alignItems:"unset"},children:[Object(c.jsx)("img",{id:"image",className:"App-logo",src:null===n||void 0===n?void 0:n.url,alt:""}),Object(c.jsx)("img",{id:"image2",className:"App-logo",src:s,alt:""})]}),Object(c.jsxs)("div",{style:{flexDirection:"column",justifyContent:"space-between",flex:1},children:[Object(c.jsx)("button",{style:{marginRight:5},onClick:function(){d.current.value=null,l(!1)},children:"Remove image"}),Object(c.jsx)("button",{style:{marginLeft:5},onClick:function(){var e=document.querySelector("#cv"),t=document.querySelector("#image"),c=e.getContext("2d"),i=new Image;i.src=window.URL.createObjectURL(n.data),i.onload=function(){c.drawImage(t,0,0,i.width,i.height);for(var e=c.getImageData(0,0,i.width,i.height),n=[],l=0;l<e.data.length;l+=4){var r={r:e.data[l],g:e.data[l+1]+10,b:e.data[l+2],a:e.data[l+3]};n.push(r)}console.log(n)}},children:"Encrypt image"})]})]}),!n&&Object(c.jsx)("div",{onClick:function(){console.log("Input click!"),d.current.click()},style:{padding:100,borderRadius:16,borderWidth:3,borderColor:"#ffffff80",borderStyle:"dashed",cursor:"pointer"},children:Object(c.jsx)("label",{style:{cursor:"pointer"},children:"Upload image"})}),Object(c.jsxs)("div",{children:[Object(c.jsx)("input",{ref:d,type:"file",onChange:function(e){console.log("change"),console.log(e.target.files);var t={url:URL.createObjectURL(e.target.files[0]),data:e.target.files[0]};l(t)},style:{display:"none"}}),Object(c.jsx)("canvas",{id:"cv",style:{display:"none"}})]})]})};var d=function(){return Object(c.jsxs)("div",{className:"App",children:[Object(c.jsx)("h1",{children:"Image encryption"}),Object(c.jsx)(s,{})]})},u=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,13)).then((function(t){var n=t.getCLS,c=t.getFID,i=t.getFCP,l=t.getLCP,r=t.getTTFB;n(e),c(e),i(e),l(e),r(e)}))};a.a.render(Object(c.jsx)(l.a.StrictMode,{children:Object(c.jsx)(d,{})}),document.getElementById("root")),u()}},[[12,1,2]]]);
//# sourceMappingURL=main.c8e8c0ae.chunk.js.map