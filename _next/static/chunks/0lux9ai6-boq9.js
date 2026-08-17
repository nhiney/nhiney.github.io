(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,29334,e=>{e.v({canvas:"AIBackground-module__BH4s5a__canvas",copyWash:"AIBackground-module__BH4s5a__copyWash",root:"AIBackground-module__BH4s5a__root",vignette:"AIBackground-module__BH4s5a__vignette"})},47998,(e,t,a)=>{t.exports={schemaVersion:1,hours:1305,minutes:0,totalMinutes:78300,source:{provider:"WakaTime",url:"https://wakatime.com/badge/user/018b36df-8ee8-4a94-ab54-fb3a76987a97.svg",label:"1,305 hrs 0 mins"},observedAt:"2026-08-17T18:14:41Z"}},37066,e=>{e.v({pageContent:"HomeClient-module__MU82NW__pageContent",pageShell:"HomeClient-module__MU82NW__pageShell"})},19635,e=>{"use strict";var t=e.i(43476),a=e.i(71645),o=e.i(22016),r=e.i(72520);let i=(0,e.i(75254).default)("git-branch",[["path",{d:"M15 6a9 9 0 0 0-9 9V3",key:"1cii5b"}],["circle",{cx:"18",cy:"6",r:"3",key:"1h7g24"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}]]);var l=e.i(3116),n=e.i(97625),s=e.i(63488),c=e.i(46932);function d({text:e}){let o=a.useMemo(()=>{let t=0;return e.split(/(\s+)/).map((e,a)=>/^\s+$/.test(e)?{type:"space",part:e,tokenIndex:a}:{type:"word",chars:e.split("").map(e=>({char:e,charIndex:t++})),tokenIndex:a})},[e]);return(0,t.jsx)(t.Fragment,{children:o.map(e=>"space"===e.type?(0,t.jsx)(a.Fragment,{children:e.part},`space-${e.tokenIndex}`):(0,t.jsx)("span",{className:"inline-block whitespace-nowrap",children:e.chars.map(({char:e,charIndex:a})=>(0,t.jsx)(c.motion.span,{initial:{y:0},animate:{y:[0,-3,0],scale:[1,1.01,1],opacity:[1,.9,1]},transition:{duration:.5,delay:.035*a},className:"inline-block whitespace-pre font-sans",style:{color:`hsl(var(${["--site-accent","--site-accent-2","--site-accent-3"][a%3]}, var(--primary)))`},children:e},`${e}-${a}`))},`word-${e.tokenIndex}`))})}class u{constructor(e){this.stop=()=>this.runAll("stop"),this.animations=e.filter(Boolean)}get finished(){return Promise.all(this.animations.map(e=>e.finished))}getAll(e){return this.animations[0][e]}setAll(e,t){for(let a=0;a<this.animations.length;a++)this.animations[a][e]=t}attachTimeline(e){let t=this.animations.map(t=>t.attachTimeline(e));return()=>{t.forEach((e,t)=>{e&&e(),this.animations[t].stop()})}}get time(){return this.getAll("time")}set time(e){this.setAll("time",e)}get speed(){return this.getAll("speed")}set speed(e){this.setAll("speed",e)}get state(){return this.getAll("state")}get startTime(){return this.getAll("startTime")}get duration(){return m(this.animations,"duration")}get iterationDuration(){return m(this.animations,"iterationDuration")}runAll(e){this.animations.forEach(t=>t[e]())}play(){this.runAll("play")}pause(){this.runAll("pause")}cancel(){this.runAll("cancel")}complete(){this.runAll("complete")}}function m(e,t){let a=0;for(let o=0;o<e.length;o++){let r=e[o][t];null!==r&&r>a&&(a=r)}return a}class f extends u{then(e,t){return this.finished.finally(e).then(()=>{})}}var p=e.i(33887),v=e.i(86427),h=e.i(28409),g=e.i(83411),x=e.i(15923),y=e.i(97307),b=e.i(21748),w=e.i(15932),k=e.i(83920),C=e.i(63074),S=e.i(65566),_=e.i(93544);function A(e,t){var a;let o;return(0,_.isEasingArray)(e)?e[a=e.length,((t-0)%(o=a-0)+o)%o+0]:e}var E=e.i(49652);function P(e){return"object"==typeof e&&!Array.isArray(e)}function j(e,t,a,o){return null==e?[]:"string"==typeof e&&P(t)?(0,E.resolveElements)(e,a,o):e instanceof NodeList?Array.from(e):Array.isArray(e)?e.filter(e=>null!=e):[e]}function D(e,t,a,o){return"number"==typeof t?t:t.startsWith("-")||t.startsWith("+")?Math.max(0,e+parseFloat(t)):"<"===t?a:t.startsWith("<")?Math.max(0,a+parseFloat(t.slice(1))):o.get(t)??e}var M=e.i(706);function N(e,t){return e.at!==t.at?e.at-t.at:null===e.value?1:null===t.value?-1:0}function T(e,t){return t.has(e)||t.set(e,{}),t.get(e)}function F(e,t){return t[e]||(t[e]=[]),t[e]}let R=e=>"number"==typeof e,L=e=>e.every(R);var G=e.i(68705),B=e.i(72094),U=e.i(72323),z=e.i(89026),I=e.i(36331),O=e.i(75737),V=e.i(86783),W=e.i(30162),H=e.i(17218);class q extends H.VisualElement{constructor(){super(...arguments),this.type="object"}readValueFromInstance(e,t){if(t in e){let a=e[t];if("string"==typeof a||"number"==typeof a)return a}}getBaseTargetFromProps(){}removeValueFromRenderState(e,t){delete t.output[e]}measureInstanceViewportBox(){return(0,W.createBox)()}build(e,t){Object.assign(e.output,t)}renderInstance(e,{output:t}){Object.assign(e,t)}sortInstanceNodePosition(){return 0}}function Y(e){let t={presenceContext:null,props:{},visualState:{renderState:{transform:{},transformOrigin:{},style:{},vars:{},attrs:{}},latestValues:{}}},a=(0,z.isSVGElement)(e)&&!(0,I.isSVGSVGElement)(e)?new O.SVGVisualElement(t):new V.HTMLVisualElement(t);a.mount(e),B.visualElementStore.set(e,a)}function $(e){let t=new q({presenceContext:null,props:{},visualState:{renderState:{output:{}},latestValues:{}}});t.mount(e),B.visualElementStore.set(e,t)}function X(e,t,a,o){let r=[];if((0,g.isMotionValue)(e)||"number"==typeof e||"string"==typeof e&&!P(t))r.push((0,G.animateSingleValue)(e,P(t)&&t.default||t,a&&a.default||a));else{if(null==e)return r;let i=j(e,t,o),l=i.length;(0,S.invariant)(!!l,"No valid elements provided.","no-valid-elements");for(let e=0;e<l;e++){let o=i[e],n=o instanceof Element?Y:$;B.visualElementStore.has(o)||n(o);let s=B.visualElementStore.get(o),c={...a};"delay"in c&&"function"==typeof c.delay&&(c.delay=c.delay(e,l)),r.push(...(0,U.animateTarget)(s,{...t,transition:c},{}))}}return r}let K=function(e={}){let{scope:t,reduceMotion:a}=e;return function(e,o,r){var i;let l,n=[];if(Array.isArray(e)&&e.some(Array.isArray)){let r,{onComplete:s,...c}=o||{};"function"==typeof s&&(l=s),i=void 0!==a?{reduceMotion:a,...c}:c,r=[],(function(e,{defaultTransition:t={},...a}={},o,r){let i=t.duration||.3,l=new Map,n=new Map,s={},c=new Map,d=0,u=0,m=0;for(let a=0;a<e.length;a++){let l=e[a];if("string"==typeof l){c.set(l,u);continue}if(!Array.isArray(l)){c.set(l.name,D(u,l.at,d,c));continue}let[h,k,_={}]=l;void 0!==_.at&&(u=D(u,_.at,d,c));let E=0,P=(e,a,o,l=0,n=0)=>{var s;let c=Array.isArray(s=e)?s:[s],{delay:d=0,times:f=(0,x.defaultOffset)(c),type:v=t.type||"keyframes",repeat:h,repeatType:g,repeatDelay:k=0,..._}=a,{ease:P=t.ease||"easeOut",duration:j}=a,D="function"==typeof d?d(l,n):d,N=c.length,T=(0,y.isGenerator)(v)?v:r?.[v||"keyframes"];if(N<=2&&T){let e=100;2===N&&L(c)&&(e=Math.abs(c[1]-c[0]));let a={...t,..._};void 0!==j&&(a.duration=(0,C.secondsToMilliseconds)(j));let o=(0,b.createGeneratorEasing)(a,e,T);P=o.ease,j=o.duration}j??(j=i);let F=u+D;1===f.length&&0===f[0]&&(f[1]=1);let R=f.length-c.length;if(R>0&&(0,w.fillOffset)(f,R),1===c.length&&c.unshift(null),h){(0,S.invariant)(h<20,"Repeat count too high, must be less than 20","repeat-count-high"),j*=h+1;let e=[...c],t=[...f],a=[...P=Array.isArray(P)?[...P]:[P]];for(let o=0;o<h;o++){c.push(...e);for(let r=0;r<e.length;r++)f.push(t[r]+(o+1)),P.push(0===r?"linear":A(a,r-1))}for(let e=0;e<f.length;e++)f[e]=f[e]/(h+1)}let G=F+j;!function(e,t,a,o,r,i){for(let t=0;t<e.length;t++){let a=e[t];a.at>r&&a.at<i&&((0,p.removeItem)(e,a),t--)}for(let l=0;l<t.length;l++)e.push({value:t[l],at:(0,M.mixNumber)(r,i,o[l]),easing:A(a,l)})}(o,c,P,f,F,G),E=Math.max(D+j,E),m=Math.max(G,m)};if((0,g.isMotionValue)(h))P(k,_,F("default",T(h,n)));else{let e=j(h,k,o,s),t=e.length;for(let a=0;a<t;a++){let o=T(e[a],n);for(let e in k){var f,v;P(k[e],(f=_,v=e,f&&f[v]?{...f,...f[v]}:{...f}),F(e,o),a,t)}}}d=u,u+=E}return n.forEach((e,o)=>{for(let r in e){let i=e[r];i.sort(N);let n=[],s=[],c=[];for(let e=0;e<i.length;e++){let{at:t,value:a,easing:o}=i[e];n.push(a),s.push((0,k.progress)(0,m,t)),c.push(o||"easeOut")}0!==s[0]&&(s.unshift(0),n.unshift(n[0]),c.unshift("easeInOut")),1!==s[s.length-1]&&(s.push(1),n.push(null)),l.has(o)||l.set(o,{keyframes:{},transition:{}});let d=l.get(o);d.keyframes[r]=n;let{type:u,...f}=t;d.transition[r]={...f,duration:m,ease:c,times:s,...a}}}),l})(e.map(e=>{if(Array.isArray(e)&&"function"==typeof e[0]){let t=e[0],a=(0,v.motionValue)(0);return(a.on("change",t),1===e.length)?[a,[0,1]]:2===e.length?[a,[0,1],e[1]]:[a,e[1],e[2]]}return e}),i,t,{spring:h.spring}).forEach(({keyframes:e,transition:t},a)=>{r.push(...X(a,e,t))}),n=r}else{let{onComplete:i,...s}=r||{};"function"==typeof i&&(l=i),n=X(e,o,void 0!==a?{reduceMotion:a,...s}:s,t)}let s=new f(n);return l&&s.finished.then(l),t&&(t.animations.push(s),s.finished.then(()=>{(0,p.removeItem)(t.animations,s)})),s}}();var Z=e.i(96597);let J=(0,a.memo)(({blur:e=0,inactiveZone:o=.7,proximity:r=0,spread:i=20,variant:l="default",glow:n=!1,className:s,movementDuration:c=2,borderWidth:d=1,disabled:u=!0})=>{let m=(0,a.useRef)(null),f=(0,a.useRef)({x:0,y:0}),p=(0,a.useRef)(0),v=(0,a.useCallback)(e=>{m.current&&(p.current&&cancelAnimationFrame(p.current),p.current=requestAnimationFrame(()=>{let t=m.current;if(!t)return;let{left:a,top:i,width:l,height:n}=t.getBoundingClientRect(),s=e?.x??f.current.x,d=e?.y??f.current.y;e&&(f.current={x:s,y:d});let u=[a+.5*l,i+.5*n];if(Math.hypot(s-u[0],d-u[1])<.5*Math.min(l,n)*o)return void t.style.setProperty("--active","0");let p=s>a-r&&s<a+l+r&&d>i-r&&d<i+n+r;if(t.style.setProperty("--active",p?"1":"0"),!p)return;let v=parseFloat(t.style.getPropertyValue("--start"))||0,h=(180*Math.atan2(d-u[1],s-u[0])/Math.PI+90-v+180)%360-180;K(v,v+h,{duration:c,ease:[.16,1,.3,1],onUpdate:e=>{t.style.setProperty("--start",String(e))}})}))},[o,r,c]);return(0,a.useEffect)(()=>{if(u||!window.matchMedia("(hover: hover)").matches)return;let e=()=>v(),t=e=>v(e);return window.addEventListener("scroll",e,{passive:!0}),document.body.addEventListener("pointermove",t,{passive:!0}),()=>{p.current&&cancelAnimationFrame(p.current),window.removeEventListener("scroll",e),document.body.removeEventListener("pointermove",t)}},[v,u]),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("div",{className:(0,Z.cn)("pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",n&&"opacity-100","white"===l&&"border-white",u&&"!block")}),(0,t.jsx)("div",{ref:m,style:{"--blur":`${e}px`,"--spread":i,"--start":"0","--active":"0","--glowingeffect-border-width":`${d}px`,"--gradient":"white"===l?"repeating-conic-gradient(from 236.84deg at 50% 50%, var(--black), var(--black) calc(25% / 5))":"radial-gradient(circle, #3b82f6 10%, #3b82f600 20%), radial-gradient(circle at 40% 40%, #60a5fa 5%, #60a5fa00 15%), radial-gradient(circle at 60% 60%, #93c5fd 10%, #93c5fd00 20%), radial-gradient(circle at 40% 60%, #2563eb 10%, #2563eb00 20%), repeating-conic-gradient(from 236.84deg at 50% 50%, #2563eb 0%, #3b82f6 calc(25%/5), #60a5fa calc(50%/5), #1d4ed8 calc(75%/5), #2563eb calc(100%/5))"},className:(0,Z.cn)("glowing-effect-inner pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity",n&&"opacity-100",e>0&&"blur-[var(--blur)]",s,u&&"!hidden")})]})});J.displayName="GlowingEffect";var Q=e.i(29334);let ee="fusion-protocol",et=`
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`,ea=`
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_motion;
uniform float u_dark;
uniform float u_steps;

#define PI 3.14159265359
#define TAU 6.28318530718

float saturate(float value) {
  return clamp(value, 0.0, 1.0);
}

mat2 rotate2d(float angle) {
  float cosine = cos(angle);
  float sine = sin(angle);
  return mat2(cosine, -sine, sine, cosine);
}

float hash21(vec2 point) {
  point = fract(point * vec2(123.34, 456.21));
  point += dot(point, point + 45.32);
  return fract(point.x * point.y);
}

float valueNoise(vec2 point) {
  vec2 cell = floor(point);
  vec2 local = fract(point);
  local = local * local * (3.0 - 2.0 * local);

  float a = hash21(cell);
  float b = hash21(cell + vec2(1.0, 0.0));
  float c = hash21(cell + vec2(0.0, 1.0));
  float d = hash21(cell + vec2(1.0, 1.0));

  return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
}

float fbm(vec2 point) {
  float value = 0.0;
  float amplitude = 0.52;

  for (int octave = 0; octave < 4; octave++) {
    value += valueNoise(point) * amplitude;
    point = rotate2d(0.57) * point * 2.03 + 3.17;
    amplitude *= 0.5;
  }

  return value;
}

vec3 spectrum(float amount) {
  amount = fract(amount);
  vec3 cyan = vec3(0.08, 0.82, 1.0);
  vec3 blue = vec3(0.18, 0.42, 1.0);
  vec3 violet = vec3(0.55, 0.26, 1.0);
  vec3 ice = vec3(0.62, 0.92, 1.0);

  if (amount < 0.34) return mix(cyan, blue, amount / 0.34);
  if (amount < 0.7) return mix(blue, violet, (amount - 0.34) / 0.36);
  return mix(violet, ice, (amount - 0.7) / 0.3);
}

float sparseStars(vec2 uv, float time, float threshold) {
  vec2 grid = uv * vec2(104.0, 58.0);
  vec2 cell = floor(grid);
  vec2 local = fract(grid) - 0.5;
  float random = hash21(cell);
  vec2 offset = vec2(
    hash21(cell + 7.13),
    hash21(cell + 19.71)
  ) - 0.5;
  float distanceToStar = length(local - offset * 0.72);
  float star = smoothstep(0.055, 0.0, distanceToStar) * step(threshold, random);
  float twinkle = 0.58 + 0.42 * sin(time * (0.45 + random * 0.8) + random * TAU);
  return star * twinkle;
}

float textSafeMask(vec2 uv, float strength) {
  vec2 delta = (uv - vec2(0.31, 0.43)) / vec2(0.23, 0.29);
  float pocket = exp(-dot(delta, delta) * 1.65);
  return 1.0 - pocket * strength;
}

vec3 spectralHelix(vec2 uv, vec2 point, float time, out float energy) {
  vec2 orbitPoint = rotate2d(-0.09 + u_pointer.x * 0.018) *
    (point - vec2(0.1 + u_pointer.x * 0.025, 0.015 + u_pointer.y * 0.018));
  vec2 ellipsePoint = orbitPoint * vec2(0.73, 1.08);
  float radius = length(ellipsePoint);
  float angle = atan(ellipsePoint.y, ellipsePoint.x);
  float noiseWarp = (fbm(ellipsePoint * 4.2 + time * 0.025) - 0.5) * 0.028;

  float primaryRadius = 0.49 + 0.064 * sin(angle * 2.0 - time * 0.1) + noiseWarp;
  float secondaryRadius = 0.68 + 0.038 * sin(angle * 3.0 + time * 0.065);
  float primaryDistance = abs(radius - primaryRadius);
  float secondaryDistance = abs(radius - secondaryRadius);

  float primaryGlow = exp(-primaryDistance * 10.5);
  float primaryCore = exp(-primaryDistance * 78.0);
  float secondaryGlow = exp(-secondaryDistance * 12.0);
  float secondaryCore = exp(-secondaryDistance * 92.0);

  float primaryStrands = pow(
    0.5 + 0.5 * cos(primaryDistance * 225.0 - angle * 18.0 + time * 1.15),
    14.0
  ) * exp(-primaryDistance * 18.0);
  float secondaryStrands = pow(
    0.5 + 0.5 * cos(secondaryDistance * 260.0 + angle * 23.0 - time * 0.82),
    18.0
  ) * exp(-secondaryDistance * 20.0);

  vec2 sweepPoint = rotate2d(-0.24) * (point - vec2(-0.02, 0.02));
  float sweepCenter =
    0.16 * sin(sweepPoint.x * 2.35 + time * 0.11) +
    0.045 * sin(sweepPoint.x * 5.4 - time * 0.16);
  float sweepDistance = abs(sweepPoint.y - sweepCenter);
  float sweepGlow = exp(-sweepDistance * 12.0) * smoothstep(1.08, 0.05, abs(sweepPoint.x));
  float sweepCore = exp(-sweepDistance * 84.0);
  float sweepStrands = pow(
    0.5 + 0.5 * cos(sweepDistance * 240.0 - sweepPoint.x * 19.0 - time * 1.4),
    16.0
  ) * sweepGlow;

  float pulse = pow(
    max(0.0, sin(angle * 9.0 - radius * 18.0 - time * 1.7)),
    28.0
  ) * (primaryCore + secondaryCore);

  vec3 primaryColor = spectrum(angle / TAU + time * 0.014 + 0.13);
  vec3 secondaryColor = spectrum(angle / TAU - time * 0.009 + 0.58);
  vec3 sweepColor = spectrum(uv.x * 0.58 + uv.y * 0.16 + time * 0.01);

  vec3 color = vec3(0.0);
  color += primaryColor * (primaryGlow * 0.15 + primaryCore * 0.7 + primaryStrands * 0.34);
  color += secondaryColor * (secondaryGlow * 0.1 + secondaryCore * 0.47 + secondaryStrands * 0.23);
  color += sweepColor * (sweepGlow * 0.1 + sweepCore * 0.48 + sweepStrands * 0.26);
  color += vec3(0.72, 0.94, 1.0) * pulse * 1.4;

  float stars = sparseStars(uv + vec2(time * 0.0009, 0.0), time, 0.986);
  color += spectrum(hash21(floor(uv * 80.0))) * stars * 0.9;

  float safe = textSafeMask(uv, 0.62);
  color *= safe;
  energy = saturate(
    primaryGlow * 0.7 + secondaryGlow * 0.42 + sweepGlow * 0.55 + stars
  );

  return color;
}

vec3 neuralVeil(vec2 uv, vec2 point, float time, out float energy) {
  vec2 veilPoint = rotate2d(-0.34 + u_pointer.x * 0.022) *
    (point - vec2(0.1 + u_pointer.x * 0.02, 0.02 + u_pointer.y * 0.016));
  float fold =
    0.115 * sin(veilPoint.x * 2.2 + time * 0.14) +
    0.052 * sin(veilPoint.x * 5.1 - time * 0.1) +
    0.026 * sin(veilPoint.x * 9.4 + time * 0.07);
  float across = veilPoint.y - fold;
  float band = smoothstep(0.64, 0.045, abs(across));
  float depth = 0.5 + 0.5 * sin(
    veilPoint.x * 3.25 + across * 5.4 + time * 0.2
  );

  vec2 warped = vec2(
    veilPoint.x + 0.045 * sin(across * 5.0 + time * 0.16),
    across + 0.038 * sin(veilPoint.x * 5.7 - time * 0.13)
  );
  vec2 grid = warped * vec2(25.0, 31.0);
  vec2 gridCell = abs(fract(grid) - 0.5);
  float verticalLine = exp(-gridCell.x * 44.0);
  float horizontalLine = exp(-gridCell.y * 42.0);
  float focus = 0.22 + 0.78 * smoothstep(-0.82, 0.8, veilPoint.x);
  float mesh = (verticalLine * 0.44 + horizontalLine * 0.72) *
    band * (0.22 + 0.78 * depth) * focus;

  vec2 nodeCell = fract(grid) - 0.5;
  float node = exp(-length(nodeCell) * 21.0) *
    step(0.32, hash21(floor(grid))) * band * focus;
  float ridge = pow(
    0.5 + 0.5 * sin(veilPoint.x * 5.4 - across * 8.1 + time * 0.32),
    15.0
  ) * band;

  float filamentA = abs(across + 0.33 - 0.045 * sin(veilPoint.x * 3.3 + time * 0.19));
  float filamentB = abs(across - 0.01 - 0.052 * sin(veilPoint.x * 3.8 - time * 0.16));
  float filamentC = abs(across - 0.34 - 0.038 * sin(veilPoint.x * 4.2 + time * 0.12));
  float filamentGlow =
    exp(-filamentA * 18.0) +
    exp(-filamentB * 19.0) +
    exp(-filamentC * 18.0);
  float filamentCore =
    exp(-filamentA * 105.0) +
    exp(-filamentB * 112.0) +
    exp(-filamentC * 102.0);
  float packet = pow(
    max(0.0, sin(veilPoint.x * 13.0 - time * 2.1 + across * 4.0)),
    30.0
  ) * filamentCore;

  vec3 lowColor = vec3(0.06, 0.78, 1.0);
  vec3 middleColor = vec3(0.16, 0.42, 1.0);
  vec3 highColor = vec3(0.57, 0.3, 1.0);
  vec3 veilColor = across < 0.0
    ? mix(lowColor, middleColor, saturate(across + 1.0))
    : mix(middleColor, highColor, saturate(across * 1.5));

  vec3 color = veilColor * (mesh * 0.34 + node * 0.55 + ridge * 0.2);
  color += mix(lowColor, highColor, saturate(across + 0.5)) *
    (filamentGlow * 0.13 + filamentCore * 0.72);
  color += vec3(0.78, 0.95, 1.0) * packet * 1.2;

  float bokeh = sparseStars(uv * vec2(1.0, 0.94), time * 0.55, 0.991);
  color += vec3(0.2, 0.55, 1.0) * bokeh * 0.42;

  float safe = textSafeMask(uv, 0.78);
  color *= safe;
  energy = saturate(mesh * 0.8 + filamentGlow * 0.62 + node + bokeh * 0.5);

  return color;
}

vec3 lensLocal(vec3 position) {
  position -= vec3(
    0.43 + u_pointer.x * 0.055,
    -0.015 - u_pointer.y * 0.035,
    0.0
  );
  position.yz = rotate2d(-0.23 - u_pointer.y * 0.045) * position.yz;
  position.xz = rotate2d(0.32 + u_pointer.x * 0.064) * position.xz;
  position.xy = rotate2d(-0.075) * position.xy;
  position.x /= 1.14;
  return position;
}

float lensDistance(vec3 position, float time) {
  vec3 local = lensLocal(position);
  float majorAngle = atan(local.y, local.x);
  float wobble = 0.012 * sin(majorAngle * 5.0 - time * 0.17);
  vec2 torus = vec2(length(local.xy) - (0.69 + wobble), local.z);
  return (length(torus) - 0.105) * 0.82;
}

vec3 lensNormal(vec3 position, float time) {
  float epsilon = 0.0024;
  vec2 stepSize = vec2(epsilon, 0.0);
  return normalize(vec3(
    lensDistance(position + stepSize.xyy, time) - lensDistance(position - stepSize.xyy, time),
    lensDistance(position + stepSize.yxy, time) - lensDistance(position - stepSize.yxy, time),
    lensDistance(position + stepSize.yyx, time) - lensDistance(position - stepSize.yyx, time)
  ));
}

float diamondEdge(vec2 point, vec2 center, float angle, vec2 size) {
  vec2 local = rotate2d(angle) * (point - center);
  float distanceToBox = max(abs(local.x) - size.x, abs(local.y) - size.y);
  return exp(-abs(distanceToBox) * 180.0);
}

vec3 quantumLens(vec2 uv, vec2 point, float time, out float energy) {
  vec2 projected = rotate2d(-0.08) * (point - vec2(0.39, 0.005));
  vec2 projectedEllipse = projected * vec2(0.76, 1.14);
  float projectedRadius = length(projectedEllipse);
  float ringDistance = abs(projectedRadius - 0.53);
  vec3 origin = vec3(0.0, 0.0, 2.72);
  vec3 direction = normalize(vec3(point * 0.94, -2.18));
  float travel = 0.0;
  float hit = 0.0;
  vec3 position = origin;

  // The glass torus only occupies a projected annulus. Skipping the empty
  // center and corners saves most ray-march work without changing its edge.
  if (ringDistance < 0.255) {
    for (int stepIndex = 0; stepIndex < 40; stepIndex++) {
      if (float(stepIndex) >= u_steps) break;
      position = origin + direction * travel;
      float distanceToLens = lensDistance(position, time);
      if (distanceToLens < 0.0028) {
        hit = 1.0;
        break;
      }
      travel += clamp(distanceToLens * 0.76, 0.008, 0.2);
      if (travel > 5.2) break;
    }
  }

  vec3 color = vec3(0.0);
  float lensEnergy = 0.0;

  if (hit > 0.5) {
    vec3 normal = lensNormal(position, time);
    vec3 local = lensLocal(position);
    float majorAngle = atan(local.y, local.x);
    float minorAngle = atan(local.z, length(local.xy) - 0.69);
    float facing = saturate(dot(normal, -direction));
    float fresnel = 0.028 + 0.972 * pow(1.0 - facing, 5.0);
    float caustic = pow(
      0.5 + 0.5 * cos(majorAngle * 7.0 - minorAngle * 2.2 + time * 0.22),
      18.0
    );
    float goldFlash = pow(
      max(0.0, sin(majorAngle * 3.0 + minorAngle * 4.0 - time * 0.12)),
      44.0
    );
    vec3 chroma = spectrum(majorAngle / TAU + minorAngle * 0.08 + time * 0.008);
    vec3 reflected = spectrum(0.58 + normal.y * 0.2 + normal.x * 0.08);
    color += mix(chroma * 0.2, reflected, fresnel) * (0.36 + fresnel * 1.42);
    color += chroma * caustic * 1.15;
    color += vec3(1.0, 0.58, 0.16) * goldFlash * 0.24;
    color += vec3(0.64, 0.9, 1.0) * pow(1.0 - facing, 2.6) * 0.72;
    lensEnergy = saturate(fresnel + caustic * 0.8);
  }

  float outerGlow = exp(-ringDistance * 12.0);
  float spectralEdge = exp(-ringDistance * 76.0);
  vec3 ringColor = spectrum(atan(projectedEllipse.y, projectedEllipse.x) / TAU + 0.62);
  color += ringColor * (outerGlow * 0.08 + spectralEdge * 0.5);

  float horizon = smoothstep(0.6, 0.98, uv.y);
  float floorNoise = fbm(vec2(uv.x * 8.0, uv.y * 28.0 - time * 0.08));
  float reflection = outerGlow * horizon * (0.25 + floorNoise * 0.75);
  float floorStreak = pow(
    max(0.0, sin(uv.x * 82.0 + floorNoise * 8.0 - time * 0.7)),
    28.0
  ) * horizon;
  color += ringColor * reflection * 0.26;
  color += vec3(0.08, 0.65, 1.0) * floorStreak * 0.12;

  float beamSeed = hash21(vec2(floor(uv.x * 38.0), 4.0));
  float beamLocal = abs(fract(uv.x * 38.0) - 0.5);
  float verticalBeam = exp(-beamLocal * 38.0) *
    step(0.84, beamSeed) * smoothstep(0.18, 0.98, uv.y);
  color += spectrum(beamSeed) * verticalBeam * 0.16;

  float shards = 0.0;
  shards += diamondEdge(point, vec2(-0.72, 0.05), 0.62 + time * 0.025, vec2(0.016, 0.034));
  shards += diamondEdge(point, vec2(-0.48, -0.29), -0.4 - time * 0.02, vec2(0.011, 0.026));
  shards += diamondEdge(point, vec2(0.91, -0.04), 0.28 + time * 0.018, vec2(0.014, 0.032));
  shards += diamondEdge(point, vec2(0.74, 0.32), -0.74 + time * 0.022, vec2(0.01, 0.022));
  color += vec3(0.12, 0.72, 1.0) * shards * 0.34;

  float safe = textSafeMask(uv, 0.86);
  color *= safe;
  energy = saturate(lensEnergy + outerGlow * 0.6 + reflection + verticalBeam + shards);

  return color;
}

vec3 fusionPalette(float amount) {
  amount = fract(amount);
  vec3 abyssInk = vec3(0.004, 0.022, 0.03);
  vec3 deepTeal = vec3(0.018, 0.13, 0.18);
  vec3 auroraJade = vec3(0.06, 0.38, 0.34);
  vec3 moonMint = vec3(0.48, 0.82, 0.72);
  vec3 champagne = vec3(0.94, 0.72, 0.36);

  if (amount < 0.28) {
    return mix(abyssInk, deepTeal, amount / 0.28);
  }
  if (amount < 0.6) {
    return mix(deepTeal, auroraJade, (amount - 0.28) / 0.32);
  }
  if (amount < 0.84) {
    return mix(auroraJade, moonMint, (amount - 0.6) / 0.24);
  }
  if (amount < 0.92) {
    return mix(moonMint, champagne, (amount - 0.84) / 0.08);
  }
  return mix(champagne, abyssInk, (amount - 0.92) / 0.08);
}

float fusionTextSafeMask(vec2 uv, float strength) {
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  float portrait = 1.0 - smoothstep(0.82, 1.12, aspect);
  vec2 center = mix(vec2(0.31, 0.43), vec2(0.5, 0.32), portrait);
  vec2 radius = mix(vec2(0.23, 0.29), vec2(0.43, 0.28), portrait);
  vec2 delta = (uv - center) / radius;
  float pocket = exp(-dot(delta, delta) * 1.65);
  return 1.0 - pocket * strength;
}

vec3 fusionMicroParticles(
  vec2 uv,
  float time,
  float fieldMask,
  out float particleEnergy
) {
  float columns = clamp(floor(u_resolution.x / 3.5), 115.0, 330.0);
  vec2 gridCount = vec2(
    columns,
    columns * u_resolution.y / max(1.0, u_resolution.x)
  );
  vec2 flowUv = uv + vec2(
    time * 0.00065 + 0.0045 * sin(uv.y * 10.0 + time * 0.16 + 7.13),
    -time * 0.00032 + 0.0034 * sin(uv.x * 8.0 - time * 0.14 + 19.71)
  );
  vec2 grid = flowUv * gridCount;
  vec2 cell = floor(grid);
  vec2 local = fract(grid) - 0.5;
  float seed = hash21(cell + vec2(7.13, 19.71));
  float depth = hash21(cell + vec2(56.88, 90.54));
  vec2 offset = vec2(
    hash21(cell + vec2(18.83, 24.01)),
    hash21(cell + vec2(36.23, 37.51))
  ) - 0.5;
  vec2 starDelta = local - offset * 0.36;
  float distanceToDot = length(starDelta);
  float pixelFloor = min(
    0.15,
    0.34 * gridCount.x / max(1.0, u_resolution.x)
  );
  float size = max(mix(0.045, 0.085, depth), pixelFloor);
  float visible = step(0.22, seed);
  float dot = (1.0 - smoothstep(size * 0.16, size, distanceToDot)) * visible;
  float twinkle = 0.55 + 0.45 * sin(
    time * (0.42 + depth * 0.56) + seed * TAU + 7.13
  );
  float mediumStar = step(0.94, seed);
  float rareStar = step(0.991, seed);
  float sparklePulse = pow(
    max(0.0, sin(time * (0.94 + depth * 0.58) + seed * TAU)),
    10.0
  );
  float haloOuter = min(size * 2.35, 0.28);
  float halo = (1.0 - smoothstep(size * 1.05, haloOuter, distanceToDot)) *
    rareStar;
  vec3 dotColor = mix(
    vec3(0.035, 0.13, 0.16),
    vec3(0.08, 0.28, 0.3),
    step(0.78, seed)
  );
  dotColor = mix(
    dotColor,
    vec3(0.48, 0.82, 0.72),
    mediumStar
  );
  dotColor = mix(
    dotColor,
    vec3(0.94, 0.72, 0.36),
    rareStar
  );

  float nearColumns = clamp(floor(u_resolution.x / 14.8), 44.0, 108.0);
  vec2 nearGridCount = vec2(
    nearColumns,
    nearColumns * u_resolution.y / max(1.0, u_resolution.x)
  );
  vec2 nearFlowUv =
    uv +
    vec2(-time * 0.00155, time * 0.00095) +
    u_pointer * vec2(0.0065, 0.0045);
  vec2 nearGrid = nearFlowUv * nearGridCount;
  vec2 nearCell = floor(nearGrid);
  vec2 nearLocal = fract(nearGrid) - 0.5;
  float nearSeed = hash21(nearCell + vec2(61.7, 13.5));
  float nearDepth = fract(nearSeed * 17.37 + 0.13);
  vec2 nearOffset = vec2(
    fract(nearSeed * 31.17),
    fract(nearSeed * 67.41)
  ) - 0.5;
  vec2 nearDelta = nearLocal - nearOffset * 0.7;
  float nearDistance = length(nearDelta);
  float nearPixelFloor = min(
    0.18,
    0.55 * nearGridCount.x / max(1.0, u_resolution.x)
  );
  float nearSize = max(mix(0.075, 0.145, nearDepth), nearPixelFloor);
  float nearCore = (
    1.0 - smoothstep(nearSize * 0.12, nearSize, nearDistance)
  ) * step(0.86, nearSeed);
  float heroStar = step(0.988, nearSeed);
  float nearHalo = (
    1.0 - smoothstep(
      nearSize * 0.95,
      min(0.4, nearSize * 4.6),
      nearDistance
    )
  ) * heroStar;
  float rayX = 1.0 - smoothstep(0.006, 0.028, abs(nearDelta.x));
  float rayY = 1.0 - smoothstep(0.006, 0.028, abs(nearDelta.y));
  float rayEnvelope = 1.0 - smoothstep(
    nearSize * 0.62,
    min(0.4, nearSize * 4.2),
    nearDistance
  );
  float crossFlare = (rayX + rayY) * rayEnvelope * heroStar;
  float nearTwinkle = 0.72 + 0.28 * sin(
    time * (1.05 + nearDepth * 0.92) + nearSeed * TAU
  );
  float heroPulse = pow(
    max(0.0, sin(time * 1.65 + nearSeed * TAU)),
    11.0
  );
  vec3 nearColor = mix(
    vec3(0.07, 0.22, 0.24),
    vec3(0.62, 0.88, 0.78),
    step(0.63, nearDepth)
  );
  nearColor = mix(
    nearColor,
    vec3(0.96, 0.76, 0.38),
    heroStar
  );

  float weightedCore = dot * (0.35 + depth * 0.65);
  particleEnergy = saturate(
    (
      weightedCore * 0.4 +
      nearCore * 0.8 +
      nearHalo * 0.18 +
      crossFlare * 0.05
    ) * fieldMask
  );
  return (
    dotColor * weightedCore * (0.08 + twinkle * 0.2) +
    vec3(0.48, 0.82, 0.72) * mediumStar * dot *
      (0.055 + sparklePulse * 0.13) +
    vec3(0.94, 0.72, 0.36) * halo * (0.05 + sparklePulse * 0.085) +
    nearColor * nearCore * (0.3 + nearTwinkle * 0.58) +
    vec3(0.62, 0.88, 0.78) * nearHalo * (0.11 + heroPulse * 0.27) +
    vec3(0.96, 0.76, 0.38) * crossFlare *
      (0.055 + heroPulse * 0.2)
  ) * fieldMask;
}

vec3 fusionMagicSparkles(
  vec2 uv,
  float time,
  float fieldMask,
  out float sparkleEnergy
) {
  float columns = clamp(floor(u_resolution.x / 21.5), 34.0, 76.0);
  vec2 gridCount = vec2(
    columns,
    columns * u_resolution.y / max(1.0, u_resolution.x)
  );
  vec2 flowUv =
    uv +
    vec2(time * 0.0023, -time * 0.00125) +
    u_pointer * vec2(0.011, 0.0075);
  vec2 grid = flowUv * gridCount;
  vec2 cell = floor(grid);
  vec2 local = fract(grid) - 0.5;
  float seed = hash21(cell + vec2(83.17, 41.39));
  float depth = fract(seed * 17.37 + 0.13);
  vec2 offset = vec2(
    fract(seed * 31.17),
    fract(seed * 67.41)
  ) - 0.5;
  vec2 delta = local - offset * 0.64;
  float distanceToStar = length(delta);
  float pixelFloor = min(
    0.2,
    0.68 * gridCount.x / max(1.0, u_resolution.x)
  );
  float size = max(mix(0.09, 0.16, depth), pixelFloor);
  float visible = step(0.89, seed);
  float hero = step(0.97, seed);
  float crown = step(0.996, seed);
  float core = (
    1.0 - smoothstep(size * 0.1, size, distanceToStar)
  ) * visible;
  float twinkle = 0.42 + 0.58 * pow(
    max(0.0, sin(time * (1.35 + depth * 0.62) + seed * TAU)),
    10.0
  );
  float flash = pow(
    max(0.0, sin(time * 0.72 + seed * 91.7)),
    20.0
  );
  float halo = (
    1.0 - smoothstep(size, min(0.4, size * 4.6), distanceToStar)
  ) * hero;
  float rayEnvelope = 1.0 - smoothstep(
    size * 0.55,
    min(0.42, size * 4.2),
    distanceToStar
  );
  float rayX = 1.0 - smoothstep(0.006, 0.032, abs(delta.x));
  float rayY = 1.0 - smoothstep(0.006, 0.032, abs(delta.y));
  vec2 diagonal = rotate2d(0.785398) * delta;
  float diagonalRays = (
    1.0 - smoothstep(0.007, 0.038, min(abs(diagonal.x), abs(diagonal.y)))
  ) * crown;
  float cross = (rayX + rayY + diagonalRays * 0.48) * rayEnvelope * hero;
  vec3 starColor = mix(
    vec3(0.35, 0.78, 0.72),
    vec3(0.96, 0.72, 0.34),
    step(0.58, depth)
  );
  starColor = mix(starColor, vec3(0.98, 0.86, 0.52), crown);
  float safe = fusionTextSafeMask(uv, 0.9);
  float maskedField = fieldMask * safe;

  sparkleEnergy = saturate(
    (core * 0.82 + halo * 0.42 + cross * 0.2) * maskedField
  );
  return (
    starColor * core * (0.28 + twinkle * 0.56) +
    vec3(0.58, 0.9, 0.8) * halo * (0.12 + twinkle * 0.34) +
    vec3(0.9, 0.78, 0.43) * cross * (0.07 + twinkle * 0.24) +
    vec3(0.98, 0.86, 0.52) * halo * crown * (0.18 + flash * 0.65)
  ) * maskedField;
}

vec2 fusionGalaxyUvCenter(float portrait) {
  return mix(vec2(0.72, 0.53), vec2(0.5, 0.67), portrait);
}

vec3 fusionGalaxy(
  vec2 uv,
  float time,
  out float galaxyEnergy,
  out float galaxyStarMask
) {
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  float portrait = 1.0 - smoothstep(0.82, 1.12, aspect);
  vec2 galaxyCenter = fusionGalaxyUvCenter(portrait);
  galaxyCenter += vec2(
    u_pointer.x * mix(0.006, 0.002, portrait),
    -u_pointer.y * mix(0.004, 0.0015, portrait)
  );
  vec2 galaxyPoint = uv - galaxyCenter;
  galaxyPoint.x *= aspect;
  galaxyPoint = rotate2d(mix(-0.25, -0.08, portrait)) * galaxyPoint;
  galaxyPoint.y *= mix(1.2, 1.05, portrait);
  float radius = max(length(galaxyPoint), 0.0001);
  float angle = atan(galaxyPoint.y, galaxyPoint.x);
  float spiralPhase =
    angle * 2.0 - log(radius + 0.055) * 4.9 + time * 0.14;
  float spiralWave = 0.5 + 0.5 * cos(spiralPhase);
  float armGlow = pow(spiralWave, 1.85);
  float armRidge = pow(spiralWave, 5.2);
  float outerEnvelope = 1.0 - smoothstep(0.58, 0.92, radius);
  float innerEnvelope = smoothstep(0.045, 0.13, radius);
  float diskEnvelope = exp(-radius * 2.0) *
    (1.0 - smoothstep(0.72, 0.98, radius));

  vec2 cloudUv = galaxyPoint * vec2(7.0, 9.0) +
    vec2(time * 0.032, -time * 0.021);
  float cloud = valueNoise(cloudUv);
  float clump = smoothstep(0.28, 0.78, cloud);
  float featherWave = 0.5 + 0.5 * cos(spiralPhase * 2.0 + 1.2);
  float featherArms = pow(featherWave, 8.0) * 0.18;
  float arms = (armGlow * 0.28 + armRidge * 0.78 + featherArms) *
    outerEnvelope * innerEnvelope;
  float darkLane = pow(
    0.5 + 0.5 * cos(spiralPhase + 0.4),
    14.0
  ) * outerEnvelope * innerEnvelope;
  float dust = max(
    0.0,
    arms * (0.32 + clump * 0.68) - darkLane * 0.25
  );
  float diskMist = diskEnvelope * (0.07 + clump * 0.24);
  float luminousCore = exp(-radius * 7.4);
  float nucleus = exp(-radius * radius * 130.0);
  float safe = fusionTextSafeMask(uv, 0.9);

  galaxyStarMask = saturate(
    (
      dust * 1.28 +
      armGlow * outerEnvelope * innerEnvelope * 0.15 +
      diskMist * 0.3 +
      luminousCore * 0.34
    ) * safe
  );
  galaxyEnergy = saturate(
    (
      arms * 0.85 +
      diskMist * 0.3 +
      luminousCore * 0.5 +
      nucleus * 0.75
    ) * safe
  );
  vec3 nebulaColor = mix(
    fusionPalette(0.12),
    fusionPalette(0.55),
    clump
  );
  return (
    nebulaColor * (dust * 0.58 + diskMist * 0.13) +
    vec3(0.48, 0.82, 0.72) * armRidge * outerEnvelope *
      innerEnvelope * 0.095 +
    vec3(0.018, 0.1, 0.13) * luminousCore * 0.11 +
    vec3(0.94, 0.72, 0.36) * nucleus * 0.22
  ) * safe;
}

vec3 fusionNebulaSky(vec2 uv, float time, out float nebulaEnergy) {
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  float portrait = 1.0 - smoothstep(0.82, 1.12, aspect);
  vec2 driftUv = uv + vec2(time * 0.003, -time * 0.0019);
  driftUv += u_pointer * mix(vec2(0.004, 0.0025), vec2(0.0015), portrait);

  vec2 cloudPoint = rotate2d(-0.34) * (driftUv - 0.5);
  float cloudA = valueNoise(
    cloudPoint * vec2(3.4, 5.2) + vec2(time * 0.014, -time * 0.009)
  );
  float cloudB = cloudA;
  if (u_steps > 23.5) {
    cloudB = valueNoise(
      rotate2d(0.93) * cloudPoint * vec2(7.6, 9.2) +
        vec2(-time * 0.009, time * 0.013) + 17.0
    );
  }
  float cloud = smoothstep(0.32, 0.78, cloudA * 0.66 + cloudB * 0.34);

  float lowerRibbonY = mix(0.73, 0.79, portrait) +
    0.105 * sin(driftUv.x * 4.6 + time * 0.11) +
    0.038 * sin(driftUv.x * 10.2 - time * 0.17);
  float upperRibbonY = mix(0.17, 0.56, portrait) +
    0.075 * sin(driftUv.x * 5.8 - time * 0.14 + 2.4);
  float middleRibbonY = mix(0.46, 0.6, portrait) +
    0.065 * sin(driftUv.x * 7.2 - time * 0.13 + 1.1);
  float lowerRibbon = exp(-abs(driftUv.y - lowerRibbonY) * 8.2);
  float upperRibbon = exp(-abs(driftUv.y - upperRibbonY) * 11.0);
  float middleRibbon = exp(-abs(driftUv.y - middleRibbonY) * 13.0) *
    smoothstep(0.42, 0.72, uv.x);

  vec2 rightDelta = (uv - vec2(0.79, 0.37)) / vec2(0.64, 0.58);
  vec2 lowerDelta = (uv - vec2(0.48, 0.9)) / vec2(0.72, 0.32);
  float rightEnvelope = exp(-dot(rightDelta, rightDelta) * 1.1);
  float lowerEnvelope = exp(-dot(lowerDelta, lowerDelta) * 1.25);
  float envelope = saturate(0.2 + rightEnvelope * 0.84 + lowerEnvelope * 0.58);
  float field = (
    cloud * 0.5 +
    lowerRibbon * (0.52 + cloud * 0.32) +
    upperRibbon * (0.24 + cloudB * 0.2) +
    middleRibbon * (0.24 + cloudA * 0.38)
  ) * envelope;
  float voidPocket =
    smoothstep(0.58, 0.82, 1.0 - cloudA) * cloudB;
  field *= mix(1.0, 0.68, voidPocket);
  float mysticBreath = mix(
    1.0,
    0.94 + 0.06 * sin(time * 0.085 + cloudA * 2.4),
    u_motion
  );
  field *= mysticBreath;
  float shimmer = pow(
    0.5 + 0.5 * sin(driftUv.x * 13.0 - time * 0.75 + cloudB * 5.0),
    18.0
  ) * lowerRibbon;
  float safe = fusionTextSafeMask(uv, 0.82);
  field *= safe;
  shimmer *= safe;

  vec3 cloudColor = mix(
    fusionPalette(0.2),
    fusionPalette(0.62),
    cloudB
  );
  nebulaEnergy = saturate(field * 0.42 + shimmer * 0.3);
  return (
    cloudColor * field * 0.31 +
    vec3(0.48, 0.82, 0.72) * shimmer * 0.21 +
    vec3(0.94, 0.72, 0.36) * upperRibbon * cloud * safe * 0.095 +
    vec3(0.08, 0.6, 0.52) * middleRibbon * cloudB * safe * 0.1
  );
}

vec3 fusionDistantGalaxy(
  vec2 uv,
  vec2 center,
  vec2 scale,
  float rotation,
  float time,
  float armCount,
  float spinSpeed,
  float phase,
  float intensity,
  out float distantEnergy
) {
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  vec2 local = (
    uv + u_pointer * vec2(-0.0012, -0.0008) - center
  ) * vec2(aspect, 1.0);
  local = rotate2d(rotation) * local / scale;
  float radius = max(length(local), 0.0001);
  float angle = atan(local.y, local.x);
  float spiralPhase =
    angle * armCount - log(radius + 0.07) * 4.1 +
      time * spinSpeed + phase;
  float spiral = 0.5 + 0.5 * cos(spiralPhase);
  float arms = pow(spiral, 5.6);
  float feather = pow(
    0.5 + 0.5 * cos(spiralPhase * 2.0 + 1.7),
    12.0
  );
  float envelope = (1.0 - smoothstep(0.46, 1.08, radius)) *
    smoothstep(0.03, 0.13, radius);
  float core = exp(-radius * 5.2);
  float nucleus = exp(-radius * radius * 92.0);
  float dustLane = pow(
    0.5 + 0.5 * cos(spiralPhase + 0.48),
    18.0
  ) * envelope;
  float structure = max(
    0.0,
    (arms * 0.78 + spiral * 0.14 + feather * 0.18) * envelope -
      dustLane * 0.28
  );
  float knots = pow(
    max(0.0, sin(angle * 13.0 - radius * 39.0 - time * 0.9 + phase * 2.0)),
    26.0
  ) * structure;
  float safe = fusionTextSafeMask(uv, 0.86);
  distantEnergy = saturate(
    (structure * 0.7 + core * 0.38 + nucleus * 0.72) * safe * intensity
  );
  vec3 armColor = mix(
    fusionPalette(fract(phase / TAU + 0.18)),
    fusionPalette(fract(phase / TAU + 0.66)),
    spiral
  );
  return (
    armColor * structure * 0.43 +
    vec3(0.48, 0.82, 0.72) * core * 0.14 +
    vec3(0.96, 0.74, 0.38) * nucleus * 0.5 +
    vec3(0.7, 0.9, 0.76) * knots * 0.34
  ) * safe * intensity;
}

vec3 fusionShootingStar(
  vec2 uv,
  float time,
  float phase,
  float period,
  float duration,
  float lane,
  float slope,
  out float shootingEnergy
) {
  float localTime = mod(time + phase * period, period);
  shootingEnergy = 0.0;
  if (localTime > duration || u_motion < 0.001) {
    return vec3(0.0);
  }
  float travel = saturate(localTime / duration);
  float visibility = smoothstep(0.0, 0.045, localTime) *
    (1.0 - smoothstep(duration * 0.78, duration, localTime)) * u_motion;
  vec2 motionDirection = normalize(vec2(-1.0, slope));
  vec2 tailDirection = -motionDirection;
  vec2 perpendicular = vec2(-tailDirection.y, tailDirection.x);
  vec2 head = mix(
    vec2(1.16, lane - 0.08),
    vec2(-0.16, lane + 0.4),
    travel
  );
  vec2 delta = uv - head;
  float along = dot(delta, tailDirection);
  float across = abs(dot(delta, perpendicular));
  float tailEnvelope = smoothstep(0.0, 0.025, along) *
    (1.0 - smoothstep(0.24, 0.52, along));
  float tailCore = exp(-across * 430.0) * tailEnvelope;
  float tailGlow = exp(-across * 105.0) * tailEnvelope;
  float headCore = exp(-dot(delta, delta) * 18000.0);
  float headGlow = exp(-dot(delta, delta) * 1050.0);
  float trailDust = pow(
    max(0.0, sin(along * 155.0 - time * 18.0 + phase * TAU)),
    18.0
  ) * tailGlow * step(0.02, along);
  float sparkle = 0.72 + 0.28 * sin(time * 7.4 + phase * TAU);
  float safe = fusionTextSafeMask(uv, 0.92);
  float star = (tailCore * 0.72 + tailGlow * 0.18 + headGlow * 0.5 +
    headCore * 1.2 + trailDust * 0.24) * visibility * sparkle * safe;
  shootingEnergy = saturate(star);
  return (
    vec3(0.5, 0.86, 0.78) *
      (tailCore * 0.72 + headGlow * 0.78 + trailDust * 0.3) +
    vec3(0.98, 0.76, 0.4) * (tailGlow * 0.24 + headCore * 1.55)
  ) * visibility * sparkle * safe;
}

vec3 fusionPlanet(
  vec2 point,
  vec2 center,
  float radius,
  float lightAngle,
  float paletteOffset,
  float bandFrequency,
  float phase,
  float ringStrength,
  float intensity,
  float time,
  out float planetDisc
) {
  vec2 local = (point - center) / max(radius, 0.0001);
  float radial = length(local);
  float edgeWidth = clamp(
    1.25 / (max(1.0, u_resolution.y) * max(radius, 0.001)),
    0.014,
    0.14
  );
  float disc = 1.0 - smoothstep(
    1.0 - edgeWidth,
    1.0 + edgeWidth,
    radial
  );
  float sphereZ = sqrt(max(0.0, 1.0 - radial * radial));
  float driftingLight = lightAngle + 0.055 * sin(time * 0.075 + phase);
  vec2 planarLight = vec2(cos(driftingLight), sin(driftingLight));
  float lightAmount = saturate(
    dot(local, planarLight) * 0.58 + sphereZ * 0.64
  );
  float crescent = pow(lightAmount, 2.4) * disc;
  float bands = 0.5 + 0.5 * sin(
    local.y * bandFrequency +
    local.x * 1.8 +
    time * 0.11 +
    phase
  );
  float atmosphere = (
    1.0 - smoothstep(0.94, 1.2, radial)
  ) * smoothstep(0.7, 1.0, radial);
  vec2 radialDirection = local / max(radial, 0.001);
  float lightFacing = saturate(
    0.5 + 0.5 * dot(radialDirection, planarLight)
  );
  atmosphere *= pow(lightFacing, 2.0);

  vec2 ringPoint = rotate2d(-0.42 + phase * 0.11) * (point - center);
  ringPoint.y *= 4.2;
  float ringDistance = abs(length(ringPoint) - radius * 1.48);
  float ring = (
    1.0 - smoothstep(radius * 0.035, radius * 0.13, ringDistance)
  ) * ringStrength;
  float ringFront = step(0.0, ringPoint.y);
  ring *= mix(0.28, 1.0, ringFront);
  ring *= mix(1.0 - disc * 0.75, 1.0, ringFront);

  float surface = disc * (
    0.012 + crescent * (0.16 + bands * 0.055)
  );
  float specular = pow(lightAmount, 12.0) * disc * 0.025;
  vec3 dayColor = fusionPalette(paletteOffset);
  vec3 atmosphereColor = mix(
    vec3(0.48, 0.82, 0.72),
    fusionPalette(paletteOffset + 0.24),
    0.34
  );

  planetDisc = disc;
  return (
    dayColor * surface +
    atmosphereColor * (atmosphere * 0.075 + ring * 0.07) +
    vec3(0.8, 0.93, 0.84) * specular
  ) * intensity;
}

vec3 fusionProtocol(vec2 uv, vec2 point, float time, out float energy) {
  // Small planetary silhouettes create a distant orbital arc around the galaxy.
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  float portrait = 1.0 - smoothstep(0.82, 1.12, aspect);
  vec2 galaxyUvCenter = fusionGalaxyUvCenter(portrait);
  float driftScale = mix(1.0, 0.62, portrait);
  vec2 planetCenterA =
    (mix(vec2(0.67, 0.18), vec2(0.88, 0.16), portrait) - 0.5) *
      vec2(aspect, 1.0) +
    vec2(cos(time * 0.065 + 0.7), sin(time * 0.058 + 0.7)) *
      0.009 * driftScale;
  vec2 planetCenterB =
    (mix(vec2(0.86, 0.29), vec2(0.91, 0.49), portrait) - 0.5) *
      vec2(aspect, 1.0) +
    vec2(cos(time * 0.058 + 1.7), sin(time * 0.07 + 1.7)) *
      0.011 * driftScale;
  vec2 planetCenterC =
    (mix(vec2(0.94, 0.6), vec2(0.75, 0.86), portrait) - 0.5) *
      vec2(aspect, 1.0) +
    vec2(cos(time * 0.052 + 3.1), sin(time * 0.062 + 3.1)) *
      0.009 * driftScale;
  vec2 planetCenterD =
    (mix(vec2(0.73, 0.84), vec2(0.13, 0.74), portrait) - 0.5) *
      vec2(aspect, 1.0) +
    vec2(cos(time * 0.062 + 4.6), sin(time * 0.052 + 4.6)) *
      0.008 * driftScale;

  float planetFieldA = 0.0;
  float planetFieldB = 0.0;
  float planetFieldC = 0.0;
  float planetFieldD = 0.0;
  vec3 planetColor = vec3(0.0);
  if (u_steps > 27.5 && portrait < 0.55) {
    planetColor += fusionPlanet(
      point,
      planetCenterA,
      mix(0.042, 0.032, portrait),
      0.4,
      0.3,
      9.0,
      0.7,
      0.0,
      0.44,
      time,
      planetFieldA
    );
  }
  planetColor += fusionPlanet(
    point,
    planetCenterB,
    mix(0.058, 0.043, portrait),
    2.4,
    0.72,
    13.0,
    1.7,
    0.72,
    0.74,
    time,
    planetFieldB
  );
  planetColor += fusionPlanet(
    point,
    planetCenterC,
    mix(0.044, 0.05, portrait),
    -2.2,
    0.42,
    8.0,
    3.1,
    0.0,
    0.42,
    time,
    planetFieldC
  );
  if (u_steps > 23.5) {
    planetColor += fusionPlanet(
      point,
      planetCenterD,
      mix(0.066, 0.038, portrait),
      -0.65,
      0.88,
      15.0,
      4.6,
      0.12,
      0.6,
      time,
      planetFieldD
    );
  }
  float planetField = max(
    max(planetFieldA, planetFieldB),
    max(planetFieldC, planetFieldD)
  );
  float celestialSafe = fusionTextSafeMask(uv, 0.94);
  planetColor *= celestialSafe;
  planetField *= celestialSafe;

  vec2 galaxyCenterPoint = (galaxyUvCenter - 0.5) * vec2(aspect, 1.0);
  vec2 clusterDelta = (point - galaxyCenterPoint) /
    mix(vec2(0.72, 0.48), vec2(0.25, 0.42), portrait);
  float clusterAura = exp(-dot(clusterDelta, clusterDelta) * 1.35);

  float nebulaEnergy = 0.0;
  vec3 nebulaColor = fusionNebulaSky(uv, time, nebulaEnergy);
  float galaxyEnergy = 0.0;
  float galaxyStarMask = 0.0;
  vec3 galaxyColor = fusionGalaxy(
    uv,
    time,
    galaxyEnergy,
    galaxyStarMask
  );
  float distantEnergyA = 0.0;
  vec3 distantGalaxyA = fusionDistantGalaxy(
    uv,
    mix(vec2(0.17, 0.82), vec2(0.79, 0.82), portrait),
    mix(vec2(0.25, 0.095), vec2(0.15, 0.075), portrait),
    -0.58,
    time,
    2.0,
    0.14,
    3.2,
    mix(0.88, 0.7, portrait),
    distantEnergyA
  );
  float distantEnergyC = 0.0;
  vec3 distantGalaxyC = fusionDistantGalaxy(
    uv,
    mix(vec2(0.54, 0.13), vec2(0.82, 0.48), portrait),
    mix(vec2(0.19, 0.058), vec2(0.12, 0.052), portrait),
    -0.18,
    time,
    4.0,
    0.125,
    1.35,
    mix(0.68, 0.56, portrait),
    distantEnergyC
  );

  float shootingEnergyA = 0.0;
  vec3 shootingStars = fusionShootingStar(
    uv,
    time,
    0.17,
    7.2,
    0.78,
    mix(0.14, 0.2, portrait),
    0.36,
    shootingEnergyA
  );
  float shootingEnergyB = 0.0;
  if (u_steps > 27.5) {
    shootingStars += fusionShootingStar(
      uv,
      time,
      0.63,
      10.5,
      0.9,
      mix(0.42, 0.5, portrait),
      0.24,
      shootingEnergyB
    );
  }

  float particleMask = saturate(
    0.68 +
    galaxyStarMask * 0.62 +
    galaxyEnergy * 0.22 +
    distantEnergyA * 0.26 +
    distantEnergyC * 0.2 +
    nebulaEnergy * 0.14 +
    clusterAura * 0.08
  );
  particleMask *= mix(0.92, 1.0, smoothstep(0.1, 0.72, uv.x));
  particleMask *= fusionTextSafeMask(uv, 0.74);
  float microEnergy = 0.0;
  vec3 microColor = fusionMicroParticles(
    uv,
    time,
    particleMask,
    microEnergy
  );
  float sparkleEnergy = 0.0;
  vec3 sparkleColor = fusionMagicSparkles(
    uv,
    time,
    particleMask,
    sparkleEnergy
  );
  microColor *= 1.0 - planetField * mix(0.88, 0.94, portrait);
  sparkleColor *= 1.0 - planetField * 0.76;
  galaxyColor *= 1.0 - planetField * 0.35;

  float floorMask = smoothstep(0.58, 0.98, uv.y);
  float floorStreak = pow(
    max(0.0, sin(uv.x * 94.0 + sin(uv.y * 18.0) * 3.0 - time * 0.7)),
    32.0
  ) * floorMask;
  float nebulaShadow = mix(1.0, 0.76, u_dark);

  vec3 color =
    nebulaColor * mix(1.12, 0.98, portrait) * nebulaShadow +
    distantGalaxyA +
    distantGalaxyC +
    galaxyColor * mix(1.48, 1.28, portrait) +
    planetColor * mix(0.74, 0.58, portrait) +
    microColor * mix(1.15, 1.02, portrait) +
    sparkleColor * mix(0.82, 0.72, portrait) +
    shootingStars * 0.95 +
    vec3(0.02, 0.1, 0.085) * floorStreak *
      mix(0.008, 0.0, portrait);
  energy = saturate(
    nebulaEnergy * 0.32 +
    galaxyEnergy * 0.6 +
    distantEnergyA * 0.28 +
    distantEnergyC * 0.22 +
    microEnergy * 0.5 +
    sparkleEnergy * 0.38 +
    shootingEnergyA * 0.54 +
    shootingEnergyB * 0.48 +
    planetField * 0.22
  );
  return color;
}

vec3 abyssalGlassHalo(vec2 uv, vec2 point, float time, out float energy) {
  vec2 haloPoint = rotate2d(-0.07 + u_pointer.x * 0.012) *
    (point - vec2(0.38 + u_pointer.x * 0.025, 0.19));
  vec2 ellipse = haloPoint * vec2(0.84, 1.02);
  float radius = length(ellipse);
  float angle = atan(ellipse.y, ellipse.x);
  float haloRadius = 0.77 + 0.006 * sin(angle * 3.0 - time * 0.08);
  float signedDistance = radius - haloRadius;
  float distanceToRim = abs(signedDistance);

  float rim = exp(-distanceToRim * 155.0);
  float bloom = exp(-distanceToRim * 15.0);
  float innerRefraction = exp(-abs(signedDistance + 0.018) * 92.0);
  float inside = 1.0 - smoothstep(-0.13, 0.08, signedDistance);
  float keyLight = 0.28 + 0.72 * pow(
    saturate(0.5 + 0.5 * cos(angle + 1.8)),
    1.7
  );
  float shimmer = 0.86 + 0.14 * sin(angle * 7.0 - time * 0.19);

  vec3 tint = spectrum(angle / TAU + 0.72 + time * 0.003);
  vec3 color = tint * keyLight * shimmer * (
    rim * 0.78 + bloom * 0.105 + innerRefraction * 0.16
  );
  color += vec3(0.025, 0.16, 0.27) * bloom * inside * 0.13;

  float depthArc = exp(-abs(radius - haloRadius - 0.085) * 96.0) *
    pow(saturate(0.5 + 0.5 * cos(angle + 2.2)), 3.0);
  color += vec3(0.12, 0.34, 0.58) * depthArc * 0.08;

  float stars = sparseStars(uv, time * 0.36, 0.995);
  color += vec3(0.34, 0.69, 1.0) * stars * 0.18;
  color *= textSafeMask(uv, 0.87);

  energy = saturate(rim * 0.65 + bloom * 0.28 + depthArc * 0.12 + stars * 0.12);
  return color;
}

vec3 nocturneVeilMinimal(vec2 uv, vec2 point, float time, out float energy) {
  vec2 veilPoint = rotate2d(0.19 + u_pointer.x * 0.012) *
    (point - vec2(0.05, 0.075 + u_pointer.y * 0.012));
  float curve =
    0.105 * sin(veilPoint.x * 1.65 + time * 0.075) +
    0.032 * sin(veilPoint.x * 4.3 - time * 0.055);

  float cyanDistance = abs(veilPoint.y - curve + 0.23);
  float blueDistance = abs(veilPoint.y - curve + 0.035);
  float violetDistance = abs(veilPoint.y - curve - 0.17);
  vec2 normalizedPoint = veilPoint / vec2(1.28, 0.67);
  float envelope = exp(-dot(normalizedPoint, normalizedPoint) * 0.82);

  float cyanSheet =
    exp(-cyanDistance * 7.5) * 0.18 +
    exp(-cyanDistance * 61.0) * 0.33;
  float blueSheet =
    exp(-blueDistance * 8.5) * 0.21 +
    exp(-blueDistance * 72.0) * 0.38;
  float violetSheet =
    exp(-violetDistance * 7.0) * 0.16 +
    exp(-violetDistance * 58.0) * 0.29;
  float silk = pow(
    0.5 + 0.5 * cos(blueDistance * 118.0 + veilPoint.x * 8.0 - time * 0.38),
    18.0
  ) * exp(-blueDistance * 11.0);

  vec3 color =
    vec3(0.03, 0.54, 0.76) * cyanSheet +
    vec3(0.13, 0.34, 0.82) * blueSheet +
    vec3(0.42, 0.32, 0.85) * violetSheet +
    vec3(0.56, 0.86, 1.0) * silk * 0.19;
  color *= envelope;

  float stars = sparseStars(uv, time * 0.28, 0.997);
  color += vec3(0.28, 0.52, 1.0) * stars * 0.1;
  color *= textSafeMask(uv, 0.83);

  energy = saturate(
    (cyanSheet + blueSheet + violetSheet) * envelope * 0.48 +
    silk * 0.15
  );
  return color;
}

vec3 silentSingularity(vec2 uv, vec2 point, float time, out float energy) {
  vec2 center = vec2(
    0.37 + u_pointer.x * 0.026,
    -0.105 - u_pointer.y * 0.018
  );
  vec2 singularityPoint = rotate2d(-0.035) * (point - center);
  vec2 ellipse = singularityPoint * vec2(0.91, 1.04);
  float radius = length(ellipse);
  float angle = atan(ellipse.y, ellipse.x);
  float singularityRadius = 0.49 +
    0.0045 * sin(angle * 5.0 - time * 0.07);
  float ringDistance = abs(radius - singularityRadius);

  float rim = exp(-ringDistance * 175.0);
  float bloom = exp(-ringDistance * 17.0);
  float echo = exp(-abs(radius - singularityRadius - 0.032) * 92.0);
  float topKey = 0.22 + 0.78 * pow(
    saturate(0.5 + 0.5 * cos(angle + 1.42)),
    2.1
  );

  vec2 tailPoint = rotate2d(0.16) * (point - center);
  float tailCurve = 0.058 * sin(tailPoint.x * 2.1 - time * 0.06);
  float tailDistance = abs(tailPoint.y - tailCurve);
  float tailGate =
    (1.0 - smoothstep(-0.72, 0.1, tailPoint.x)) *
    (1.0 - smoothstep(0.88, 1.28, abs(tailPoint.x)));
  float tail = (
    exp(-tailDistance * 25.0) * 0.14 +
    exp(-tailDistance * 104.0) * 0.38
  ) * tailGate;

  float disk = 1.0 - smoothstep(
    singularityRadius - 0.018,
    singularityRadius + 0.012,
    radius
  );
  vec3 ringTint = spectrum(angle / TAU + 0.66 + time * 0.002);
  vec3 color = ringTint * (
    rim * 0.84 + bloom * 0.09 + echo * 0.12
  ) * topKey;
  color += vec3(0.37, 0.43, 0.83) * tail;
  color -= vec3(0.012, 0.018, 0.032) * disk * u_dark;

  float dust = sparseStars(uv, time * 0.2, 0.994) *
    exp(-ringDistance * 8.0);
  color += vec3(0.48, 0.57, 1.0) * dust * 0.22;
  color *= textSafeMask(uv, 0.9);

  energy = saturate(rim * 0.7 + bloom * 0.21 + tail * 0.25 + dust * 0.2);
  return color;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.y = 1.0 - uv.y;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 point = uv - 0.5;
  point.x *= aspect;

  float energy = 0.0;
  vec3 effect = fusionProtocol(uv, point, u_time, energy);

  float rightAura = exp(-dot(
    (uv - vec2(0.88, 0.35)) / vec2(0.42, 0.52),
    (uv - vec2(0.88, 0.35)) / vec2(0.42, 0.52)
  ));
  float lowerAura = exp(-dot(
    (uv - vec2(0.62, 0.9)) / vec2(0.48, 0.28),
    (uv - vec2(0.62, 0.9)) / vec2(0.48, 0.28)
  ));
  float vignette = 1.0 - smoothstep(0.38, 0.94, length((uv - 0.5) * vec2(0.72, 1.0)));

  float quietScene = 0.0;
  float fusionScene = 1.0;
  vec3 rightAuraColor = mix(
    vec3(0.0, 0.07, 0.1),
    vec3(0.003, 0.035, 0.04),
    fusionScene
  );
  vec3 lowerAuraColor = mix(
    vec3(0.06, 0.025, 0.1),
    vec3(0.035, 0.02, 0.006),
    fusionScene
  );
  vec3 darkBase = mix(
    vec3(0.006, 0.012, 0.022),
    vec3(0.001, 0.002, 0.004),
    fusionScene
  );
  darkBase += rightAuraColor * rightAura * mix(0.34, 0.12, quietScene);
  darkBase += lowerAuraColor * lowerAura * mix(0.2, 0.06, quietScene);
  darkBase *= 0.68 + vignette * 0.32;

  vec3 lightBase = mix(
    vec3(0.974, 0.982, 1.0),
    vec3(0.95, 0.963, 0.995),
    fusionScene
  );
  vec3 rightAuraShadow = mix(
    vec3(0.035, 0.012, 0.0),
    vec3(0.004, 0.028, 0.035),
    fusionScene
  );
  vec3 lowerAuraShadow = mix(
    vec3(0.008, 0.022, 0.045),
    vec3(0.035, 0.023, 0.006),
    fusionScene
  );
  lightBase -= rightAuraShadow * rightAura;
  lightBase -= lowerAuraShadow * lowerAura;

  vec3 darkColor = darkBase + effect;
  vec3 energyShadow = mix(
    vec3(0.025, 0.018, 0.0),
    vec3(0.038, 0.014, 0.006),
    fusionScene
  );
  vec3 lightColor = lightBase - energyShadow * energy + effect * 0.36;
  vec3 finalColor = mix(lightColor, darkColor, u_dark);

  float grainAmplitude = mix(
    mix(0.008, 0.014, u_dark),
    mix(0.004, 0.006, u_dark),
    fusionScene
  );
  float grain = (hash21(gl_FragCoord.xy + floor(u_time * 5.0)) - 0.5) *
    grainAmplitude;
  finalColor += grain;
  finalColor = finalColor / (1.0 + max(vec3(0.0), finalColor - 0.82) * 0.62);
  finalColor = pow(max(finalColor, vec3(0.0)), vec3(0.94));

  gl_FragColor = vec4(finalColor, 1.0);
}
`;function eo(e,t,a){let o=e.createShader(t);return o?(e.shaderSource(o,a),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS))?o:(console.error("AI background shader failed:",e.getShaderInfoLog(o)),e.deleteShader(o),null):null}function er(){let e=(0,a.useRef)(null),o=(0,a.useRef)(null),[r,i]=(0,a.useState)(0);return(0,a.useEffect)(()=>{let t=e.current,a=o.current,r=t?.parentElement,l=a?.getContext("webgl",{alpha:!1,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,powerPreference:"high-performance"});if(!t||!a||!r||!l){t&&(t.dataset.fallback="true",t.dataset.ready="true");return}let n=function(e){let t=eo(e,e.VERTEX_SHADER,et),a=eo(e,e.FRAGMENT_SHADER,ea);if(!t||!a)return null;let o=e.createProgram();return o?(e.attachShader(o,t),e.attachShader(o,a),e.linkProgram(o),e.deleteShader(t),e.deleteShader(a),e.getProgramParameter(o,e.LINK_STATUS))?o:(console.error("AI background program failed:",e.getProgramInfoLog(o)),e.deleteProgram(o),null):null}(l);if(!n){t.dataset.fallback="true",t.dataset.ready="true";return}let s=l.createBuffer(),c=l.getAttribLocation(n,"a_position"),d=l.getUniformLocation(n,"u_resolution"),u=l.getUniformLocation(n,"u_pointer"),m=l.getUniformLocation(n,"u_time"),f=l.getUniformLocation(n,"u_motion"),p=l.getUniformLocation(n,"u_dark"),v=l.getUniformLocation(n,"u_steps");if(!s||c<0){t.dataset.fallback="true",t.dataset.ready="true",l.deleteProgram(n);return}l.useProgram(n),l.bindBuffer(l.ARRAY_BUFFER,s),l.bufferData(l.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),l.STATIC_DRAW),l.enableVertexAttribArray(c),l.vertexAttribPointer(c,2,l.FLOAT,!1,0,0);let h=window.matchMedia("(prefers-reduced-motion: reduce)"),g=window.matchMedia("(hover: none), (pointer: coarse)"),x=(navigator.hardwareConcurrency??8)<=4,y=h.matches,b=g.matches,w=document.documentElement.classList.contains("dark"),k=!document.hidden,C=0,S=0,_=performance.now(),A=0,E=0,P=0,j=0,D=!1,M=()=>!y&&k&&!D,N=()=>{let e=t.getBoundingClientRect(),o=Math.max(1,Math.round(e.width)),r=Math.max(1,Math.round(e.height)),i=b?1.05:x?1.1:1.2,n=b?.66:x?.72:.82,s=Math.max(1,Math.min(b?900:x?1280:1600,Math.round(o*Math.min(window.devicePixelRatio||1,i)*n))),c=Math.max(1,Math.round(s*r/o));a.width=s,a.height=c,a.style.width=o+"px",a.style.height=r+"px",l.viewport(0,0,s,c)},T=(e,o=!1)=>{if(D)return;let r=Math.min(.05,Math.max(0,(e-_)/1e3));_=e;let i=1-Math.exp(-(4.8*r));o||(A+=(P-A)*i,E+=(j-E)*i),l.useProgram(n),l.uniform2f(d,a.width,a.height),l.uniform2f(u,A,E),l.uniform1f(m,o?7.25:e/1e3),l.uniform1f(f,+!o),l.uniform1f(p,+!!w),l.uniform1f(v,b?22:x?26:28),l.drawArrays(l.TRIANGLES,0,3),t.dataset.ready="true",t.dataset.fallback="false"},F=e=>{C=0,M()&&(e-S>=(b||x?1e3/30:1e3/60)&&(T(e),S=e),C=requestAnimationFrame(F))},R=()=>{C&&(cancelAnimationFrame(C),C=0),t.dataset.paused=M()?"false":"true",M()?(S=0,_=performance.now(),C=requestAnimationFrame(F)):T(performance.now(),!0)},L=e=>{b||y||(P=Math.max(-1,Math.min(1,e.clientX/Math.max(1,window.innerWidth)*2-1)),j=Math.max(-1,Math.min(1,e.clientY/Math.max(1,window.innerHeight)*2-1)))},G=()=>{P=0,j=0},B=()=>{k=!document.hidden,R()},U=()=>{y=h.matches,P=0,j=0,R()},z=()=>{b=g.matches,A=0,E=0,P=0,j=0,N(),R()},I=new ResizeObserver(()=>{N(),T(performance.now(),!M())}),O=new MutationObserver(()=>{let e=document.documentElement.classList.contains("dark");e!==w&&(w=e,M()||T(performance.now(),!0))}),V=e=>{e.preventDefault(),D=!0,t.dataset.fallback="true",R()},W=()=>{i(e=>e+1)};return N(),T(performance.now(),y),I.observe(t),O.observe(document.documentElement,{attributes:!0,attributeFilter:["class"]}),r.addEventListener("pointermove",L,{passive:!0}),r.addEventListener("pointerleave",G),document.addEventListener("visibilitychange",B),h.addEventListener("change",U),g.addEventListener("change",z),a.addEventListener("webglcontextlost",V),a.addEventListener("webglcontextrestored",W),R(),()=>{C&&cancelAnimationFrame(C),I.disconnect(),O.disconnect(),r.removeEventListener("pointermove",L),r.removeEventListener("pointerleave",G),document.removeEventListener("visibilitychange",B),h.removeEventListener("change",U),g.removeEventListener("change",z),a.removeEventListener("webglcontextlost",V),a.removeEventListener("webglcontextrestored",W),l.deleteBuffer(s),l.deleteProgram(n)}},[r]),(0,t.jsxs)("div",{ref:e,className:Q.default.root,"data-ai-background":ee,"data-effect":ee,"data-paused":"true","data-ready":"false","aria-hidden":"true",children:[(0,t.jsx)("canvas",{ref:o,className:Q.default.canvas}),(0,t.jsx)("div",{className:Q.default.copyWash}),(0,t.jsx)("div",{className:Q.default.vignette})]})}var ei=e.i(12931),el=e.i(33092),en=e.i(87236),es=e.i(2490),ec=e.i(47998),ed=e.i(37066);function eu({text:e}){let a=e.split(/\*\*(.+?)\*\*/);return(0,t.jsx)(t.Fragment,{children:a.map((e,a)=>a%2==1?(0,t.jsx)("strong",{className:"font-semibold site-heading",children:e},a):e)})}let em=[{label:"Laravel",cls:"border-rose-200/85 bg-rose-50/80 text-rose-700/95 dark:border-rose-300/30 dark:bg-rose-400/[0.12] dark:text-rose-100/95"},{label:"Flutter",cls:"border-sky-200/85 bg-sky-50/80 text-sky-700/95 dark:border-sky-300/30 dark:bg-sky-400/[0.12] dark:text-sky-100/95"},{label:"Oracle DB",cls:"border-red-200/85 bg-red-50/78 text-red-700/95 dark:border-red-300/30 dark:bg-red-400/[0.12] dark:text-red-100/95"},{label:"Firebase",cls:"border-amber-200/90 bg-amber-50/82 text-amber-700/95 dark:border-amber-300/30 dark:bg-amber-400/[0.12] dark:text-amber-100/95"},{label:"ASP.NET",cls:"border-violet-200/85 bg-violet-50/80 text-violet-700/95 dark:border-violet-300/30 dark:bg-violet-400/[0.12] dark:text-violet-100/95"},{label:"Dart",cls:"border-cyan-200/85 bg-cyan-50/80 text-cyan-700/95 dark:border-cyan-300/30 dark:bg-cyan-400/[0.12] dark:text-cyan-100/95"},{label:"C#",cls:"border-indigo-200/85 bg-indigo-50/80 text-indigo-700/95 dark:border-indigo-300/30 dark:bg-indigo-400/[0.12] dark:text-indigo-100/95"},{label:"PHP",cls:"border-fuchsia-200/85 bg-fuchsia-50/78 text-fuchsia-700/95 dark:border-fuchsia-300/30 dark:bg-fuchsia-400/[0.12] dark:text-fuchsia-100/95"},{label:"PL/SQL",cls:"border-orange-200/85 bg-orange-50/80 text-orange-700/95 dark:border-orange-300/30 dark:bg-orange-400/[0.12] dark:text-orange-100/95"},{label:"REST APIs",cls:"border-emerald-200/85 bg-emerald-50/80 text-emerald-700/95 dark:border-emerald-300/30 dark:bg-emerald-400/[0.12] dark:text-emerald-100/95"},{label:"Node.js",cls:"border-lime-200/85 bg-lime-50/78 text-lime-700/95 dark:border-lime-300/30 dark:bg-lime-400/[0.12] dark:text-lime-100/95"},{label:"Git",cls:"border-slate-200/90 bg-slate-50/85 text-slate-700/95 dark:border-slate-300/30 dark:bg-slate-400/[0.12] dark:text-slate-100/95"}],ef={github:{frame:"border-sky-200/80 bg-white/78 dark:border-sky-300/24 dark:bg-sky-300/[0.06]",panel:"bg-[linear-gradient(135deg,hsl(var(--card)/0.99),rgba(248,250,255,0.96)_52%,rgba(232,245,255,0.58))] dark:bg-[linear-gradient(135deg,hsl(var(--card)/0.98),rgba(17,27,50,0.96)_56%,rgba(56,189,248,0.11))]",icon:"border-sky-200/90 bg-sky-50/88 text-sky-700 dark:border-sky-300/32 dark:bg-sky-400/[0.14] dark:text-sky-100",rule:"from-sky-300/45 via-blue-300/45 to-indigo-300/40"},coding:{frame:"border-indigo-200/80 bg-white/78 dark:border-indigo-300/24 dark:bg-indigo-300/[0.06]",panel:"bg-[linear-gradient(135deg,hsl(var(--card)/0.99),rgba(248,249,255,0.96)_52%,rgba(235,237,255,0.62))] dark:bg-[linear-gradient(135deg,hsl(var(--card)/0.98),rgba(19,25,52,0.96)_56%,rgba(99,102,241,0.13))]",icon:"border-indigo-200/90 bg-indigo-50/88 text-indigo-700 dark:border-indigo-300/32 dark:bg-indigo-400/[0.14] dark:text-indigo-100",rule:"from-blue-300/45 via-indigo-300/45 to-violet-300/40"},tech:{frame:"border-violet-200/78 bg-white/78 dark:border-violet-300/24 dark:bg-violet-300/[0.06]",panel:"bg-[linear-gradient(135deg,hsl(var(--card)/0.99),rgba(250,248,255,0.96)_52%,rgba(244,237,255,0.6))] dark:bg-[linear-gradient(135deg,hsl(var(--card)/0.98),rgba(25,21,51,0.96)_56%,rgba(168,85,247,0.12))]",icon:"border-violet-200/90 bg-violet-50/88 text-violet-700 dark:border-violet-300/32 dark:bg-violet-400/[0.14] dark:text-violet-100",rule:"from-violet-300/42 via-fuchsia-300/35 to-amber-300/38"}},ep=[{key:"github_contributions",value:186,delay:0,cls:"border-blue-200/85 bg-white/88 text-blue-700 dark:border-blue-300/30 dark:bg-blue-400/[0.13] dark:text-blue-100"},{key:"github_repos",value:8,delay:.2,cls:"border-indigo-200/85 bg-white/88 text-indigo-700 dark:border-indigo-300/30 dark:bg-indigo-400/[0.13] dark:text-indigo-100"}];function ev({to:e,duration:o=1.4,suffix:r="",delay:i=0,formatter:l}){let[n,s]=(0,a.useState)(0);return(0,a.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){let t=requestAnimationFrame(()=>s(e));return()=>cancelAnimationFrame(t)}let t=0,a=null,r=window.setTimeout(()=>{let r=i=>{null===a&&(a=i);let l=Math.min((i-a)/(1e3*o),1);s(Math.round(e*(1-Math.pow(1-l,3)))),l<1&&(t=requestAnimationFrame(r))};t=requestAnimationFrame(r)},1e3*i);return()=>{window.clearTimeout(r),cancelAnimationFrame(t)}},[e,o,i]),(0,t.jsxs)(t.Fragment,{children:[l?l.format(n):n,r]})}function eh({area:e,icon:a,title:o,tone:r,children:i}){let l=ef[r];return(0,t.jsx)("li",{className:(0,Z.cn)("min-h-[12rem] list-none sm:min-h-[14rem]",e),children:(0,t.jsxs)("div",{className:(0,Z.cn)("relative h-full rounded-2xl border p-2 shadow-[0_18px_48px_-38px_hsl(var(--foreground)/0.24)] sm:rounded-3xl",l.frame),children:[(0,t.jsx)(J,{spread:40,glow:!0,disabled:!1,proximity:64,inactiveZone:.01}),(0,t.jsxs)("div",{className:(0,Z.cn)("relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl p-5 shadow-[0_10px_28px_-26px_hsl(var(--foreground)/0.2)] sm:p-6",l.panel),children:[(0,t.jsx)("div",{className:(0,Z.cn)("absolute inset-x-10 top-0 h-px rounded-b-full bg-gradient-to-r opacity-65",l.rule)}),(0,t.jsx)("div",{className:"pointer-events-none absolute right-8 top-8 h-px w-20 rotate-[-22deg] bg-gradient-to-r from-transparent via-current to-transparent opacity-[0.06]"}),(0,t.jsx)("div",{className:(0,Z.cn)("w-fit rounded-lg border p-2",l.icon),children:a}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("h3",{className:"text-xl font-semibold tracking-tight site-heading",children:o}),(0,t.jsx)("div",{className:"text-sm site-body",children:i})]})]})]})})}function eg(){let{language:e,t:a}=(0,en.useLanguage)(),s=new Intl.NumberFormat("vi"===e?"vi-VN":"en-US"),c=[s.format(ec.default.hours),a("home.bento.coding_hours_unit"),ec.default.minutes,a("home.bento.coding_minutes_unit")].join(" ");return(0,t.jsxs)("ul",{className:"grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-2 xl:max-h-[34rem] xl:grid-rows-2",children:[(0,t.jsxs)(eh,{area:"md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/7]",icon:(0,t.jsx)(i,{className:"h-4 w-4"}),title:a("home.bento.github_title"),tone:"github",children:[(0,t.jsx)("div",{className:"grid grid-cols-2 gap-3 mt-1",children:ep.map(e=>(0,t.jsxs)("div",{className:(0,Z.cn)("rounded-xl border p-3 text-center shadow-[0_8px_18px_-16px_currentColor]",e.cls),children:[(0,t.jsx)("div",{className:"text-2xl font-black",children:(0,t.jsx)(ev,{to:e.value,suffix:"+",duration:8===e.value?1:1.4,delay:e.delay})}),(0,t.jsx)("div",{className:"mt-1 text-[10px] font-bold uppercase tracking-wider text-current/70",children:a(`home.bento.${e.key}`)})]},e.key))}),(0,t.jsxs)(o.default,{href:es.SITE_CONFIG.links.github,target:"_blank",rel:"noopener noreferrer",className:"mt-3 flex items-center gap-1 text-xs font-semibold text-primary hover:underline",children:[a("home.bento.github_cta")," ",(0,t.jsx)(r.ArrowRight,{size:11})]})]}),(0,t.jsx)(eh,{area:"md:[grid-area:1/7/2/13] xl:[grid-area:1/7/2/13]",icon:(0,t.jsx)(l.Clock,{className:"h-4 w-4"}),title:a("home.bento.coding_title"),tone:"coding",children:(0,t.jsxs)("div",{className:"mt-1",children:[(0,t.jsxs)("div",{className:"coding-time-lockup",children:[(0,t.jsx)("span",{className:"sr-only",children:c}),(0,t.jsxs)("span",{className:"coding-time-stat coding-time-stat-hours","aria-hidden":"true",children:[(0,t.jsx)("span",{className:"coding-time-number",children:(0,t.jsx)(ev,{to:ec.default.hours,duration:1.6,delay:.1,formatter:s})}),(0,t.jsx)("span",{className:"coding-time-unit",children:a("home.bento.coding_hours_unit")})]}),(0,t.jsx)("span",{className:"coding-time-divider","aria-hidden":"true"}),(0,t.jsxs)("span",{className:"coding-time-stat coding-time-stat-minutes","aria-hidden":"true",children:[(0,t.jsx)("span",{className:"coding-time-minutes-number",children:(0,t.jsx)(ev,{to:ec.default.minutes,duration:1.15,delay:.25})}),(0,t.jsx)("span",{className:"coding-time-unit",children:a("home.bento.coding_minutes_unit")})]})]}),(0,t.jsxs)(o.default,{href:es.SITE_CONFIG.links.wakatime,target:"_blank",rel:"noopener noreferrer","aria-label":`${a("home.bento.coding_cta")}: ${c}`,className:"mt-3 flex w-fit items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80 hover:underline [&_svg]:transition-transform hover:[&_svg]:translate-x-0.5",children:[a("home.bento.coding_cta")," ",(0,t.jsx)(r.ArrowRight,{size:11})]})]})}),(0,t.jsx)(eh,{area:"md:[grid-area:2/1/3/13] xl:[grid-area:2/1/3/13]",icon:(0,t.jsx)(n.Code2,{className:"h-4 w-4"}),title:a("home.bento.tech_title"),tone:"tech",children:(0,t.jsx)("div",{className:"flex flex-wrap gap-2 mt-1",children:em.map(e=>(0,t.jsx)("span",{className:(0,Z.cn)("rounded-full border px-3 py-1 text-[10px] font-bold shadow-sm",e.cls),children:e.label},e.label))})})]})}e.s(["HomeClient",0,function(e){let{t:a}=(0,en.useLanguage)();return(0,t.jsxs)("div",{className:ed.default.pageShell,children:[(0,t.jsx)(er,{}),(0,t.jsxs)("div",{className:ed.default.pageContent,children:[(0,t.jsx)("section",{className:"relative min-h-[calc(100svh-4rem)] overflow-hidden",children:(0,t.jsx)(ei.Container,{className:"relative z-10 flex min-h-[calc(100svh-4rem)] flex-col justify-start pb-10 pt-20 sm:justify-center sm:py-12 md:py-16 xl:justify-start xl:pb-16 xl:pt-[clamp(5.5rem,11svh,8rem)]",children:(0,t.jsxs)("div",{className:"grid w-full grid-cols-1 gap-10 md:gap-12 xl:grid-cols-2 xl:items-center xl:gap-16",children:[(0,t.jsxs)("div",{className:"flex flex-col items-center gap-5 text-center xl:items-start xl:text-left",children:[(0,t.jsxs)("p",{className:"text-sm font-medium site-soft tracking-wide",children:[(0,t.jsx)("span",{className:"block sm:inline",children:a("home.hero.title_prefix")})," ",(0,t.jsx)(d,{text:a("home.hero.name")})]}),(0,t.jsxs)("h1",{className:"max-w-3xl text-3xl font-bold leading-tight site-heading sm:text-4xl md:text-5xl md:leading-[1.1]",children:[a("pages.portfolio.hero.headline_pre")," ",(0,t.jsx)("span",{className:"site-accent-gradient",children:a("pages.portfolio.hero.headline_acc1")})," ",a("pages.portfolio.hero.headline_mid")]}),(0,t.jsx)("p",{className:"mx-auto max-w-lg text-base leading-relaxed site-body sm:text-lg xl:mx-0",children:(0,t.jsx)(eu,{text:a("pages.portfolio.hero.sub_pre")})}),(0,t.jsxs)("div",{className:"flex w-full flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center xl:justify-start",children:[(0,t.jsx)("a",{href:"#projects","data-analytics-event":"hero_cta_clicked","data-analytics-label":"projects",className:"w-full sm:w-auto",children:(0,t.jsxs)("button",{className:"inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto",children:[a("pages.portfolio.hero.cta_projects"),(0,t.jsx)(r.ArrowRight,{className:"h-4 w-4"})]})}),(0,t.jsx)(o.default,{href:`mailto:${es.SITE_CONFIG.links.email}`,"data-analytics-event":"hero_cta_clicked","data-analytics-label":"email",className:"w-full sm:w-auto",children:(0,t.jsxs)("button",{className:"inline-flex items-center justify-center gap-2 border border-border/60 bg-background/60 backdrop-blur-sm rounded-full text-base px-7 h-12 font-medium transition-all hover:border-primary/40 hover:bg-primary/5 w-full sm:w-auto",children:[(0,t.jsx)(s.Mail,{className:"h-4 w-4"}),a("pages.portfolio.hero.cta_contact")]})})]})]}),(0,t.jsx)("div",{className:"block",children:(0,t.jsx)(eg,{})})]})})}),(0,t.jsx)(el.PortfolioClient,{projects:[],hideHero:!0,hideCerts:!0})]})]})}],19635)}]);