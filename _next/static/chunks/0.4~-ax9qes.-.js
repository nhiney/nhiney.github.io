(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,61836,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(75056),i=e.i(25234),o=e.i(28600),n=e.i(90072);let l=`
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uIntro;
  uniform float uScroll;
  uniform float uPointerStrength;
  uniform vec3  uPointer;

  attribute vec3  aNormal;
  attribute vec4  aRandom;
  attribute float aKind;

  varying vec3  vColor;
  varying float vAlpha;
  varying float vRot;
  varying float vShape;

  // Iridescent cosine palette (gold → magenta → violet → cyan → lime).
  vec3 palette(float t) {
    return 0.52 + 0.48 * cos(6.28318 * (vec3(1.0, 1.0, 1.0) * t + vec3(0.02, 0.36, 0.67)));
  }

  void main() {
    vec3 p = position;

    // Assembly: every particle flies in from a scattered start position.
    float delay = aRandom.x * 0.45;
    float k = clamp((uIntro - delay) / 0.55, 0.0, 1.0);
    k = 1.0 - pow(1.0 - k, 3.0);
    vec3 scatter = (aRandom.yzw - 0.5) * 7.0 + aNormal * 1.6;
    p = mix(p + scatter, p, k);

    // Breathing + slow orbit for the dust halo.
    float breath = sin(uTime * 1.1 + aRandom.w * 6.2831) * 0.007;
    p += aNormal * breath * (aKind > 1.5 ? 5.0 : 1.0);
    if (aKind > 1.5) {
      float a = uTime * 0.04 * (0.4 + aRandom.x);
      p.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xz;
    }

    // Neural wave sweeping across the cortex + random synapse sparks.
    float w = sin(dot(position, normalize(vec3(0.25, 0.55, 1.0))) * 5.0 - uTime * 1.6 + aRandom.x * 0.5);
    float pulse = smoothstep(0.88, 1.0, w) * (aKind < 0.5 ? 1.0 : 0.35);
    float s = fract(aRandom.z * 91.7 + floor(uTime * 2.2 + aRandom.y * 9.0) * 0.6180339);
    float spark = step(0.993, s) * (aKind < 1.5 ? 1.0 : 0.0);

    vec4 world = modelMatrix * vec4(p, 1.0);

    // Scroll: the brain dissolves outward as the hero leaves the viewport.
    world.xyz += (aRandom.xyz - 0.5) * uScroll * 4.0;

    // Pointer: particles part around the cursor like iron filings.
    vec3 d = world.xyz - uPointer;
    float dist = length(d);
    float f = smoothstep(0.8, 0.0, dist) * uPointerStrength;
    world.xyz += normalize(d + 1e-4) * f * 0.34;

    vec4 mv = viewMatrix * world;

    vec3 nView = normalize(mat3(viewMatrix) * mat3(modelMatrix) * aNormal);
    float rim = pow(1.0 - abs(nView.z), 2.2);

    float t = dot(position, vec3(0.32, 0.6, 0.22)) * 0.5 + uTime * 0.03 + aRandom.w * 0.1;
    vec3 col = palette(t);
    col = mix(col, vec3(1.0, 0.8, 0.36), 0.22 * (1.0 - rim));
    col += vec3(0.6, 0.55, 1.0) * pulse * 0.9 + spark * 1.4 + f * 0.5;
    vColor = col;

    float base = aKind > 1.5 ? 0.22 : (aKind > 0.5 ? 0.3 : 0.5 + rim * 0.55);
    vAlpha = (base + pulse * 0.45 + spark) * k * (1.0 - uScroll * 0.9);

    float size = uSize * (0.55 + aRandom.y * 0.95) * (aKind > 1.5 ? 0.55 : 1.0);
    size *= 1.0 + pulse * 1.1 + spark * 2.2 + f * 1.1;
    gl_PointSize = size * uPixelRatio / -mv.z;
    gl_Position = projectionMatrix * mv;

    vRot = aRandom.x * 6.2831 + uTime * 0.25 * (aRandom.y - 0.5);
    vShape = step(0.32, aRandom.z);
  }
`,s=`
  varying vec3  vColor;
  varying float vAlpha;
  varying float vRot;
  varying float vShape;

  float sdTri(vec2 p, float r) {
    const float k = 1.7320508;
    p.x = abs(p.x) - r;
    p.y = p.y + r / k;
    if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -2.0 * r, 0.0);
    return -length(p) * sign(p.y);
  }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float c = cos(vRot), s = sin(vRot);
    uv = mat2(c, -s, s, c) * uv;

    float a;
    if (vShape > 0.5) {
      float d = sdTri(uv, 0.3);
      float fill = 1.0 - smoothstep(-0.02, 0.03, d);
      float edge = 1.0 - smoothstep(0.0, 0.06, abs(d));
      a = max(fill * 0.4, edge);
    } else {
      a = pow(smoothstep(0.5, 0.0, length(uv)), 1.6);
    }
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;function u({count:e,progress:r,pointer:c,reducedMotion:d,placement:v}){let h=(0,a.useRef)(null),{camera:m,size:p,viewport:f,gl:g,invalidate:w}=(0,o.useThree)(),M=(0,a.useMemo)(()=>{let t=function(e,t=7){let a,r=(a=t>>>0,()=>{let e=a=a+0x6d2b79f5>>>0;return e=Math.imul(e^e>>>15,1|e),(((e^=e+Math.imul(e^e>>>7,61|e))^e>>>14)>>>0)/0x100000000}),i=new Float32Array(3*e),o=new Float32Array(3*e),n=new Float32Array(4*e),l=new Float32Array(e),s=Math.floor(.74*e),u=Math.floor(.11*e),c=Math.floor(.04*e),d=0,v=(e,t,a,s,u,c,v)=>{i[3*d]=e,i[3*d+1]=t,i[3*d+2]=a;let h=Math.hypot(s,u,c)||1;o[3*d]=s/h,o[3*d+1]=u/h,o[3*d+2]=c/h,n[4*d]=r(),n[4*d+1]=r(),n[4*d+2]=r(),n[4*d+3]=r(),l[d]=v,d++},h=()=>{let e=2*r()-1,t=r()*Math.PI*2,a=Math.sqrt(1-e*e);return[a*Math.cos(t),e,a*Math.sin(t)]},m=0;for(;d<s&&m++<40*e;){var p,f;let[e,t,a]=h(),i=.5>r()?-1:1,o=.56*Math.abs(e)*i+.31*i,n=.7*t+.08,l=1.02*a;n+=.06*Math.max(0,l),o*=1-.08*Math.max(0,-l),n<-.28&&(n=-.28+(n+.28)*.42),n<-.12&&l>-.2&&l<.55&&(o*=.97),o*i<.035&&(o=i*(.035+.02*r()));let s=1-Math.min(1,1.9*Math.abs(.72*(Math.sin(3.1*(p=o)+1.7*Math.sin(2.3*l+.4))*Math.sin(2.9*(f=n)+1.3*Math.sin(2.1*p+1.1))*Math.sin(3.3*l+1.1*Math.sin(2.7*f+2.3)))+.28*(Math.sin(5.7*p+2.1*Math.sin(4.3*f))*Math.sin(6.1*l+1.9*Math.sin(3.9*p))))),u=.22+.78*s*s;if(r()>u)continue;let c=.14>r(),d=1+.055*s-.03-(c?.06+.18*r():0),m=.31*i;v(m+(o-m)*d,.08+(n-.08)*d,l*d,(o-m)/(.56*.56),(n-.08)/(.7*.7),l/1.0404,+!!c)}let g=d+u;for(m=0;d<g&&m++<40*e;){let[e,t,a]=h(),i=.5*e,o=.24*t-.4,n=.32*a-.66;if(n>-.5&&o>-.32)continue;let l=.5+.5*Math.cos((o+.4)*62+.6*Math.sin(9*i));r()>.25+.75*l||v(i,o,n,e/.5,t/.24,a/.32,+(.12>r()))}let w=d+c;for(;d<w;){let e=r(),t=r()*Math.PI*2,a=.15-.05*e;v(Math.cos(t)*a,-.32-.66*e,-.22-.12*e+Math.sin(t)*a,Math.cos(t),0,Math.sin(t),0)}for(;d<e;){let[e,t,a]=h(),i=1.25+1.6*Math.pow(r(),.7);v(e*i,t*i*.8,a*i,e,t,a,2)}return{position:i,normal:o,random:n,kind:l,count:e}}(e),a=new n.BufferGeometry;return a.setAttribute("position",new n.BufferAttribute(t.position,3)),a.setAttribute("aNormal",new n.BufferAttribute(t.normal,3)),a.setAttribute("aRandom",new n.BufferAttribute(t.random,4)),a.setAttribute("aKind",new n.BufferAttribute(t.kind,1)),a.computeBoundingSphere(),a},[e]),x=(0,a.useRef)(null),[y]=(0,a.useState)(()=>({uTime:{value:0},uSize:{value:20},uPixelRatio:{value:1},uIntro:{value:+!!d},uScroll:{value:0},uPointerStrength:{value:0},uPointer:{value:new n.Vector3(99,99,0)}}));(0,a.useEffect)(()=>()=>M.dispose(),[M]),(0,a.useEffect)(()=>{let e=x.current;e&&(e.uniforms.uSize.value=22*Math.min(1.25,Math.max(.45,Math.min(p.height/900,p.width/1100))),e.uniforms.uPixelRatio.value=g.getPixelRatio(),w())},[p.height,p.width,g,w]);let b=(0,a.useRef)({v:new n.Vector3,dir:new n.Vector3,target:new n.Vector3(99,99,0)}),R=(0,a.useRef)({t:0,intro:+!!d});return(0,i.useFrame)((e,t)=>{let a=h.current,i=x.current;if(!a||!i)return;let o=Math.min(t,.05),n=i.uniforms,l=b.current,s=r?r.get():0;d||(R.current.t+=o,R.current.intro=Math.min(1,R.current.intro+o/2.4));let u=R.current.t;n.uTime.value=u,n.uIntro.value=R.current.intro,n.uScroll.value=s;let p=c.current;l.v.set(p.x,p.y,.5).unproject(m),l.dir.copy(l.v).sub(m.position).normalize();let g=-m.position.z/l.dir.z;l.target.copy(m.position).addScaledVector(l.dir,g),n.uPointer.value.lerp(l.target,1-Math.pow(8e-4,o)),n.uPointerStrength.value+=(p.active-n.uPointerStrength.value)*(1-Math.pow(.02,o));let w="right"===v,M=w?.2*f.width:0,y=w?-.02:.29*f.height;a.position.x=M,a.position.y=y+.6*s;let S=(w?Math.min(1.08,.36*f.height):Math.min(.66,.29*f.width))*(1+.25*s);a.scale.setScalar(S);let z=-.95+(d?0:.22*Math.sin(.16*u))+.28*p.x*p.active,P=.16-.12*p.y*p.active;a.rotation.y+=(z-a.rotation.y)*(1-Math.pow(.06,o)),a.rotation.x+=(P-a.rotation.x)*(1-Math.pow(.06,o))}),(0,t.jsx)("group",{ref:h,rotation:[.16,-.95,0],children:(0,t.jsx)("points",{geometry:M,frustumCulled:!1,children:(0,t.jsx)("shaderMaterial",{ref:x,vertexShader:l,fragmentShader:s,uniforms:y,transparent:!0,depthWrite:!1,blending:n.AdditiveBlending})})})}e.s(["default",0,function({progress:e,interactionTarget:i,className:o}){let n=(0,a.useRef)(null),l=(0,a.useRef)({x:0,y:0,active:0}),[s,c]=(0,a.useState)(!0),[d]=(0,a.useState)(()=>{let e=window.matchMedia("(max-width: 1023px)").matches;return{reduced:window.matchMedia("(prefers-reduced-motion: reduce)").matches,mobile:e,dpr:Math.min(window.devicePixelRatio||1,e?1.5:1.75)}});(0,a.useEffect)(()=>{let e=n.current;if(!e)return;let t=!0,a=()=>c(t&&!document.hidden),r=new IntersectionObserver(([e])=>{t=e.isIntersecting,a()});return r.observe(e),document.addEventListener("visibilitychange",a),()=>{r.disconnect(),document.removeEventListener("visibilitychange",a)}},[]),(0,a.useEffect)(()=>{let e=i?.current??n.current;if(!e||d.reduced)return;let t=e=>{let t=n.current?.getBoundingClientRect();t&&(l.current.x=(e.clientX-t.left)/t.width*2-1,l.current.y=-(2*((e.clientY-t.top)/t.height))+1,l.current.active="touch"===e.pointerType?.7:1)},a=()=>{l.current.active=0};return e.addEventListener("pointermove",t,{passive:!0}),e.addEventListener("pointerdown",t,{passive:!0}),e.addEventListener("pointerleave",a),e.addEventListener("pointercancel",a),()=>{e.removeEventListener("pointermove",t),e.removeEventListener("pointerdown",t),e.removeEventListener("pointerleave",a),e.removeEventListener("pointercancel",a)}},[i,d.reduced]);let v=d.reduced?"demand":s?"always":"never";return(0,t.jsx)("div",{ref:n,className:o,"aria-hidden":"true",children:(0,t.jsx)(r.Canvas,{frameloop:v,dpr:d.dpr,camera:{position:[0,0,4.4],fov:34,near:.1,far:50},gl:{antialias:!1,alpha:!0,powerPreference:"high-performance"},style:{pointerEvents:"none"},children:(0,t.jsx)(u,{count:d.mobile?12e3:26e3,progress:e,pointer:l,reducedMotion:d.reduced,placement:d.mobile?"center":"right"})})})}],61836)},81498,e=>{e.n(e.i(61836))}]);