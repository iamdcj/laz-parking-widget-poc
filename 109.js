"use strict";(self.webpackChunklaz_parking_widget_poc=self.webpackChunklaz_parking_widget_poc||[]).push([[109],{109:(e,t,n)=>{n.r(t),n.d(t,{default:()=>C});var r=n(5257),l=n(6540),a=n(926),i=n(655),o=n(4073),c=n(7393),u=n(7636),s=n(4977),m=n(4155),f=n(6819),p=n(2100),d=n(5945),g=n(4675);const h=function(e){e.setView,e.view;var t=(0,l.useRef)(null),n=(0,a.U)(),i=n.state,h=i.locations,b=i.focusedLocation,v=i.selectedLocation,E=n.dispatch,A=(0,g.A)(),y=(0,f.A)(A.breakpoints.down("md")),w=function(){return t.current||(t.current=new Map),t.current};return(0,l.useEffect)((function(){var e,t;v&&(e=v,(t=w().get(e))&&t.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}))}),[v]),l.createElement(m.A,{component:"aside",sx:{position:"absolute",left:20,top:20,width:400,height:"calc(100% - 40px)",overflow:"hidden",zIndex:2}},(null==h?void 0:h.length)>0&&l.createElement(l.Fragment,null,l.createElement(r.A,{sx:{height:y?"calc(100vh - 49px)":"100%",overflow:"auto",px:1,scrollbarWidth:"none",pb:10}},h.map((function(e){var t=e.label,n=e.id,a=e.imageUrl,i=e.address,m=e.city,f=e.state,g=e.zipCode,h=n===b||n===v,A=a?"https://xpark.lazparking.com/".concat(a):"https://go.lazparking.com/static/media/default_bg.9175f9eefa59a42c0776.png";return l.createElement(s.A,{key:n,sx:{border:"1px solid lightgrey",my:1.5,backgroundColor:h&&"primary.light"},onMouseEnter:function(){return E({type:p.En.FOCUSED_LOCATION,payload:n})},ref:function(e){var t=w();e?t.set(n,e):t.delete(n)}},l.createElement(u.A,{sx:{display:"grid",gridTemplateColumns:"120px 3fr",rowGap:2,justifyContent:"space-between"}},l.createElement(c.A,{component:"img",image:A,width:120,height:120,sx:{objectFit:"cover",borderRadius:2}}),l.createElement(r.A,{textAlign:"right",display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"end"},l.createElement(o.A,{variant:"h6"},t),l.createElement(o.A,{sx:{color:"text.secondary",fontSize:14,mb:2}},i,l.createElement("br",null),m,", ",f,", ",g),l.createElement(d.A,{id:n}))))})))))};var b=n(4790),v=n(7483),E=n(695),A=n(203);const y=function(e){var t=e.setView,n=e.view,r=e.count;return l.createElement(m.A,{sx:{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid grey",borderRadius:"0 0 2px 2px",px:2,height:48}},l.createElement(o.A,{fontSize:16},r," Locations available"),t&&l.createElement(v.A,{value:n,size:"small"},l.createElement(b.A,{value:"list",size:"small",onClick:function(){return t("list")}},l.createElement(E.A,null)),l.createElement(b.A,{value:"map",size:"small",onClick:function(){return t("map")}},l.createElement(A.A,null))))};var w=n(7808);function x(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,l,a,i,o=[],c=!0,u=!1;try{if(a=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=a.call(n)).done)&&(o.push(r.value),o.length!==t);c=!0);}catch(e){u=!0,l=e}finally{try{if(!c&&null!=n.return&&(i=n.return(),Object(i)!==i))return}finally{if(u)throw l}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return k(e,t);var n={}.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?k(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function k(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}const C=function(){var e=(0,a.U)().state.locations,t=x((0,l.useState)("list"),2),n=t[0],o=t[1],c=(0,g.A)(),u=(0,f.A)(c.breakpoints.down("md"));return l.createElement(r.A,{height:"100%",position:"relative"},l.createElement(w.A,null),u?l.createElement(l.Fragment,null,"map"===n?l.createElement(l.Fragment,null,l.createElement(y,{setView:o,view:n,count:e.length}),l.createElement(i.A,{height:"100%"})):l.createElement(h,{setView:o,view:n})):l.createElement(l.Fragment,null,l.createElement(h,null),l.createElement(i.A,{height:"100%"})))}}}]);