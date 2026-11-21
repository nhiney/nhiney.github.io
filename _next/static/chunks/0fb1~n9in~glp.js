(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,36496,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(75056),i=e.i(25234),n=e.i(28600),o=e.i(90072);function s(e){let t=e>>>0;return()=>{let e=t=t+0x6d2b79f5>>>0;return e=Math.imul(e^e>>>15,1|e),(((e^=e+Math.imul(e^e>>>7,61|e))^e>>>14)>>>0)/0x100000000}}function l(e){let t=2*e()-1,r=e()*Math.PI*2,a=Math.sqrt(1-t*t);return[a*Math.cos(r),t,a*Math.sin(r)]}function u(e,t,r,a,i){let[n,o,s]=l(r),u=a+Math.pow(r(),.7)*(i-a);e.set([n*u,o*u,s*u],3*t)}let d=[{shape:0,x:.2,y:.02,s:.82,rx:.06,ry:0,spin:.03,dim:1},{shape:0,x:-.27,y:-.55,s:1.55,rx:.15,ry:.5,spin:.03,dim:.9},{shape:1,x:0,y:0,s:1,rx:0,ry:0,spin:.025,dim:.6},{shape:2,x:-.2,y:0,s:.82,rx:.25,ry:0,spin:.07,dim:1},{shape:1,x:0,y:0,s:1,rx:0,ry:.6,spin:.025,dim:.4},{shape:3,x:.27,y:-.02,s:.86,rx:.32,ry:-.6,spin:.07,dim:1},{shape:1,x:0,y:0,s:1,rx:0,ry:1.2,spin:.025,dim:.5},{shape:1,x:0,y:0,s:1.15,rx:0,ry:1.6,spin:.025,dim:.55}],c=[{shape:0,x:.05,y:.62,s:.46,rx:.06,ry:0,spin:.03,dim:1},{shape:0,x:0,y:-.2,s:.9,rx:.15,ry:.5,spin:.03,dim:.35},{shape:1,x:0,y:0,s:.8,rx:0,ry:0,spin:.025,dim:.45},{shape:2,x:0,y:.15,s:.7,rx:.25,ry:0,spin:.07,dim:.35},{shape:1,x:0,y:0,s:.8,rx:0,ry:.6,spin:.025,dim:.3},{shape:3,x:0,y:.15,s:.85,rx:.32,ry:-.6,spin:.07,dim:.35},{shape:1,x:0,y:0,s:.8,rx:0,ry:1.2,spin:.025,dim:.35},{shape:1,x:0,y:0,s:.9,rx:0,ry:1.6,spin:.025,dim:.4}],f=`
  // One cool family (violet → blue → cyan → moonlight) with rare amber sparks.
  vec3 palette(float t) {
    float i = fract(t);
    if (i < 0.34) return vec3(0.50, 0.36, 1.00);
    if (i < 0.62) return vec3(0.30, 0.50, 1.00);
    if (i < 0.82) return vec3(0.34, 0.82, 1.00);
    if (i < 0.95) return vec3(0.82, 0.82, 1.00);
    return vec3(1.00, 0.72, 0.22);
  }

  // Light theme: saturated inks that hold their colour on paper white.
  vec3 inkPalette(float t) {
    float i = fract(t);
    if (i < 0.38) return vec3(0.40, 0.20, 0.88); // violet
    if (i < 0.66) return vec3(0.20, 0.26, 0.80); // indigo
    if (i < 0.84) return vec3(0.04, 0.50, 0.62); // teal
    if (i < 0.96) return vec3(0.55, 0.16, 0.62); // plum
    return vec3(0.86, 0.50, 0.06);               // amber
  }
`,m=`
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uIntro;
  uniform float uFrom;
  uniform float uTo;
  uniform float uMix;
  uniform float uBurst;
  uniform float uDim;
  uniform float uPointerStrength;
  uniform vec3  uPointer;
  uniform float uLight; // 1 on the light theme: ink tones, normal blending

  attribute float aOrder;
  attribute vec3  aScatter;
  attribute vec3  aIdea;
  attribute vec3  aGlobe;
  attribute vec4  aRandom;
  attribute float aKind;

  varying vec3  vColor;
  varying float vAlpha;
  varying float vRot;
  varying float vShape;
  varying float vSoft;

  ${f}

  vec3 shapePos(float s) {
    if (s < 0.5) return position;
    if (s < 1.5) return aScatter;
    if (s < 2.5) return aIdea;
    return aGlobe;
  }

  void main() {
    // Morph: each particle leaves at its own moment, bursting outward mid-flight.
    float m = clamp((uMix - aRandom.x * 0.35) / 0.65, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    vec3 base = mix(shapePos(uFrom), shapePos(uTo), m);
    base += (aRandom.yzw - 0.5) * sin(m * 3.14159) * 1.4 * uBurst;

    // How much of the dandelion is on screen (0 during the other shapes).
    float dw = (uFrom < 0.5 ? 1.0 - m : 0.0) + (uTo < 0.5 ? m : 0.0);

    // The head nods in the breeze (more at the top, none at the root)…
    float bend = clamp((position.y + 1.35) / 2.7, 0.0, 1.0);
    base.x += dw * sin(uTime * 0.5) * 0.06 * bend * bend;

    // …and some seeds let go and drift up and away on the wind, again and again.
    float drift = fract(uTime * 0.035 + aRandom.z * 7.0);
    float flying = step(1.5, aKind) * step(aKind, 2.5) * dw;
    base += flying * vec3(
      drift * 2.8,
      drift * 1.1 + sin(drift * 6.2831 + aRandom.y * 20.0) * 0.12,
      sin(drift * 4.0 + aRandom.x * 10.0) * 0.35
    );

    // Intro: the stem rises first, then the head opens from its core to the tufts.
    float k = clamp((uIntro - aOrder * 0.7 - aRandom.x * 0.1) / 0.3, 0.0, 1.0);
    k = 1.0 - pow(1.0 - k, 3.0);
    vec3 origin = position.y > 0.0 ? vec3(0.0, 0.45, 0.0) : vec3(0.0, -1.35, 0.0);
    vec3 p = mix(origin, base, k);
    p += (aRandom.yzw - 0.5) * sin(uTime * 0.9 + aRandom.w * 6.2831) * 0.012;

    // On the dandelion a soft band of light climbs the stem and opens into the head;
    // on the other shapes a slow wave of light crosses them.
    float climb = smoothstep(0.92, 1.0, fract(aOrder - uTime * 0.14)) * dw;
    float w = sin(dot(base, normalize(vec3(0.25, 0.55, 1.0))) * 5.0 - uTime * 1.6 + aRandom.x * 0.5);
    float pulse = smoothstep(0.88, 1.0, w) * (1.0 - dw);

    vec4 world = modelMatrix * vec4(p, 1.0);

    // Pointer: seeds part around the cursor, like breath on a dandelion.
    vec3 d = world.xyz - uPointer;
    float f = smoothstep(0.8, 0.0, length(d)) * uPointerStrength;
    world.xyz += normalize(d + 1e-4) * f * 0.34;

    vec4 mv = viewMatrix * world;

    // Colour: moonlit white filaments and tufts with a lilac/blue tint, a warm amber
    // core, a cool stem. Other shapes use the palette.
    vec3 tuft = aRandom.w < 0.6 ? vec3(0.92, 0.93, 1.0) : (aRandom.w < 0.85 ? vec3(0.72, 0.68, 1.0) : vec3(0.55, 0.72, 1.0));
    vec3 own = aKind > 2.5 ? vec3(1.0, 0.74, 0.32)
             : aKind > 0.5 ? tuft
             : (position.y < 0.3 ? vec3(0.42, 0.62, 0.95) : vec3(0.68, 0.74, 1.0));
    vec3 col = mix(palette(aRandom.w + dot(position, vec3(0.32, 0.6, 0.22)) * 0.2), own, dw);
    vColor = col * (1.0 + pulse * 0.6 + f * 0.4) + vec3(0.6, 0.75, 1.0) * climb;

    float baseA = aKind > 2.5 ? 0.9 : (aKind > 1.5 ? 0.85 : (aKind > 0.5 ? 0.62 : 0.42));
    float near = smoothstep(0.6, 1.6, -mv.z); // fade anything about to touch the lens
    vAlpha = baseA * (1.0 + pulse * 0.6 + climb) * k * uDim * near;
    vAlpha *= mix(1.0, sin(drift * 3.14159), flying);

    // Light theme: saturated inks on paper (the dandelion keeps an amber core).
    vec3 ink = inkPalette(aRandom.w + dot(position, vec3(0.32, 0.6, 0.22)) * 0.2);
    vec3 inkOwn = aKind > 2.5 ? vec3(0.86, 0.5, 0.06)
               : aKind > 0.5 ? (aRandom.w < 0.6 ? vec3(0.36, 0.2, 0.86) : vec3(0.18, 0.3, 0.82))
               : vec3(0.26, 0.26, 0.5);
    vec3 lightCol = mix(ink, inkOwn, dw) + vec3(0.25, 0.15, 0.6) * (pulse * 0.3 + climb * 0.5);
    vColor = mix(vColor, lightCol, uLight);
    vAlpha *= mix(1.0, 1.15, uLight);

    // Tufts and drifting seeds are seed-shaped; filaments, stem and core are fine dots.
    float isSeed = step(0.5, aKind) * step(aKind, 2.5);
    float size = uSize * (0.55 + aRandom.y * 0.5) * mix(0.34, 1.0, isSeed) * (1.0 + flying * 0.6);
    size *= 1.0 + pulse * 0.35 + f * 0.6 + climb * 0.4;
    gl_PointSize = min(size * uPixelRatio / -mv.z, 72.0 * uPixelRatio);
    gl_Position = projectionMatrix * mv;

    // Seeds face outward from the head and turn slowly as they fly.
    vRot = atan(position.x, position.y - 0.45) + flying * uTime * 0.4;
    vShape = isSeed * 2.0;
    vSoft = 0.0;
  }
`,h=`
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uScroll;
  uniform float uIntro;
  uniform float uLight;

  attribute vec4 aRandom;

  varying vec3  vColor;
  varying float vAlpha;
  varying float vRot;
  varying float vShape;
  varying float vSoft;

  ${f}

  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * 0.03 * (0.4 + aRandom.x) + uScroll + 3.5, 7.0) - 3.5;
    p.x += sin(uTime * 0.1 + aRandom.y * 6.2831) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float depth = -mv.z;

    vColor = mix(palette(aRandom.w), vec3(0.9, 0.9, 1.0), 0.45);
    vSoft = smoothstep(2.6, 0.9, depth);
    vAlpha = 0.45 * uIntro * (1.0 - vSoft * 0.55) * smoothstep(12.0, 5.0, depth) * smoothstep(0.35, 0.9, depth);
    vColor = mix(vColor, inkPalette(aRandom.w), uLight);
    vAlpha *= mix(1.0, 0.7, uLight);

    gl_PointSize = min(uSize * (0.6 + aRandom.y * 1.1) * uPixelRatio / depth, 90.0 * uPixelRatio);
    gl_Position = projectionMatrix * mv;

    vRot = (aRandom.x - 0.5) * 1.2 + sin(uTime * 0.4 + aRandom.y * 6.2831) * 0.25;
    vShape = 2.0;
  }
`,v=`
  varying vec3  vColor;
  varying float vAlpha;
  varying float vRot;
  varying float vShape;
  varying float vSoft;

  float seg(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0));
  }

  // A dandelion seed: a fan of fine rays (the pappus) on a thin stalk, with the
  // seed itself at the bottom.
  float sdSeed(vec2 p) {
    vec2 o = vec2(0.0, 0.06);
    float d = 1e3;
    for (int k = 0; k < 9; k++) {
      float a = (float(k) / 8.0 - 0.5) * 2.4;
      d = min(d, seg(p, o, o + vec2(sin(a), cos(a)) * 0.33));
    }
    d = min(d, seg(p, o, vec2(0.0, -0.3)));
    d = min(d, length((p - vec2(0.0, -0.35)) * vec2(1.0, 0.6)) - 0.02);
    return d - 0.012;
  }

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    uv.y = -uv.y;
    float c = cos(vRot), s = sin(vRot);
    uv = mat2(c, s, -s, c) * uv;

    float a;
    if (vShape > 1.5) {
      float w = 0.03 + vSoft * 0.12;
      a = 1.0 - smoothstep(0.0, w, sdSeed(uv));
    } else {
      a = pow(smoothstep(0.5, 0.0, length(uv)), 1.6);
    }
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;function p(){let[e,t]=(0,r.useState)(()=>"u"<typeof document||document.documentElement.classList.contains("dark"));return(0,r.useEffect)(()=>{let e=document.documentElement,r=()=>t(e.classList.contains("dark"));r();let a=new MutationObserver(r);return a.observe(e,{attributes:!0,attributeFilter:["class"]}),()=>a.disconnect()},[]),e}let w=(e,t,r)=>e+(t-e)*r,g=2*Math.PI;function y(e){return Math.max(1,Math.min(window.devicePixelRatio||1,e,Math.sqrt(42e5/Math.max(1,window.innerWidth*window.innerHeight))))}function x({count:e,env:a,pointer:f}){let h=(0,r.useRef)(null),y=(0,r.useRef)(null),{camera:M,size:b,viewport:R,gl:S,invalidate:A}=(0,n.useThree)(),P=a.mobile?c:d,k=(0,r.useMemo)(()=>{let t=function(e,t=29){let r=s(t),a=new Float32Array(3*e),i=new Float32Array(e),n=new Float32Array(e),o=[];for(let e=0;e<320;e++){let t=1-2*(e+.5)/320;if(t<-.82)continue;let r=Math.sqrt(1-t*t),a=2.399963*e;o.push([Math.cos(a)*r,t,Math.sin(a)*r])}let l=e=>{let t=.9>Math.abs(e[1])?[0,1,0]:[1,0,0],r=[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],a=Math.hypot(r[0],r[1],r[2]),i=[r[0]/a,r[1]/a,r[2]/a];return[i,[e[1]*i[2]-e[2]*i[1],e[2]*i[0]-e[0]*i[2],e[0]*i[1]-e[1]*i[0]]]},u=Math.floor(.08*e),d=Math.floor(.05*e),c=Math.floor(.55*e),f=Math.floor(.26*e),m=0;for(;m<u;m++){let e=r(),t=.12*Math.sin(2.4*e)*(1-e),o=-1.35+e*(.35+1.35),s=r()*Math.PI*2,l=.016+.006*(1-e);a.set([t+Math.cos(s)*l,o,Math.sin(s)*l],3*m),i[m]=0,n[m]=.3*e}for(;m<u+d;m++){let e=o[Math.floor(r()*o.length)],t=.06+.07*r();a.set([0+e[0]*t,.45+e[1]*t,0+e[2]*t],3*m),i[m]=3,n[m]=.32}for(;m<u+d+c;m++){let e=o[Math.floor(r()*o.length)],t=.14+.72*r();a.set([0+.95*e[0]*t,.45+.95*e[1]*t,0+.95*e[2]*t],3*m),i[m]=0,n[m]=.35+.55*t}for(;m<u+d+c+f;m++){let e=o[Math.floor(r()*o.length)],[t,s]=l(e),u=r()*Math.PI*2,d=.13*Math.pow(r(),.6),c=.86+.06*r()+.35*d;a.set([0+.95*e[0]*c+(t[0]*Math.cos(u)+s[0]*Math.sin(u))*d,.45+.95*e[1]*c+(t[1]*Math.cos(u)+s[1]*Math.sin(u))*d,0+.95*e[2]*c+(t[2]*Math.cos(u)+s[2]*Math.sin(u))*d],3*m),i[m]=1,n[m]=.9+.1*r()}for(;m<e;m++){let e=o[Math.floor(r()*o.length)],t=[.8*Math.abs(e[0])+.2,.6*e[1]+.3,e[2]];a.set([0+.95*t[0],.45+.95*t[1],0+.95*t[2]*.6],3*m),i[m]=2,n[m]=1}return{position:a,kind:i,order:n}}(e),r=s(9),a=Float32Array.from({length:4*e},()=>r()),i=new o.BufferGeometry;return i.setAttribute("position",new o.BufferAttribute(t.position,3)),i.setAttribute("aScatter",new o.BufferAttribute(function(e,t=21){let r=s(t),a=new Float32Array(3*e),i=0;for(;i<e;){let e=(2*r()-1)*3.6,t=(2*r()-1)*2.1,n=-4+5.4*r(),o=(e/2.3)**2+(t/1.15)**2;!(o<1&&r()>.12+.88*o*o)&&(a.set([e,t,n],3*i),i++)}return a}(e),3)),i.setAttribute("aIdea",new o.BufferAttribute(function(e,t=37){let r=s(t),a=new Float32Array(3*e),i=[];for(let e=0;e<7;e++){let t=1-2*(e+.5)/7,a=Math.sqrt(1-t*t),n=2.399963*e+.4,o=.78+.14*r();i.push([Math.cos(n)*a*o,t*o*.82,Math.sin(n)*a*o])}let n=[];for(let e of i){let t=3+Math.floor(2*r());for(let a=0;a<t;a++){let[t,a,i]=l(r),o=[.55*e[0]+.3*t,.55*e[1]+.3*a,.55*e[2]+.3*i];n.push({from:e,at:[e[0]+o[0],e[1]+o[1],e[2]+o[2]]})}}let o=(e,t)=>{let[a,i,n]=l(r),o=t*(.7>r()?.85+.15*r():Math.cbrt(r()));return[e[0]+a*o,e[1]+i*o,e[2]+n*o]},d=(e,t,a)=>{let i=r(),n=[(e[0]+t[0])/2+a*(e[1]-t[1]),(e[1]+t[1])/2+.3*a,(e[2]+t[2])/2-a*(e[0]-t[0])],o=1-i,s=()=>(r()-.5)*.008;return[o*o*e[0]+2*o*i*n[0]+i*i*t[0]+s(),o*o*e[1]+2*o*i*n[1]+i*i*t[1]+s(),o*o*e[2]+2*o*i*n[2]+i*i*t[2]+s()]},c=[0,0,0],f=[{w:11,at:()=>o(c,.17)},{w:16,at:()=>o(i[Math.floor(7*r())],.075)},{w:12,at:()=>o(n[Math.floor(r()*n.length)].at,.04)},{w:24,at:()=>{let e=Math.floor(7*r());return d(c,i[e],.12*(e%2?1:-1))}},{w:20,at:()=>{let e=n[Math.floor(r()*n.length)];return d(e.from,e.at,.05)}},{w:5,at:()=>{let e=Math.floor(7*r());return d(i[e],i[(e+2)%7],.18)}}],m=f.reduce((e,t)=>e+t.w,0),h=Math.floor(.08*e);for(let t=0;t<e-h;t++){let e=r()*m,i=f[0];for(let t of f){if(e<t.w){i=t;break}e-=t.w}a.set(i.at(),3*t)}for(let t=e-h;t<e;t++)u(a,t,r,1.2,2.2);return a}(e),3)),i.setAttribute("aGlobe",new o.BufferAttribute(function(e,t=47){let r=s(t),a=new Float32Array(3*e),i=Math.floor(.94*e),n=0;for(;n<i;){let[e,t,i]=l(r);!(.1>Math.sin(3.1*e+1.3*Math.sin(2.2*i))*Math.sin(2.7*t+1.7*Math.sin(1.9*e))+.55*Math.sin(4.3*i+2.1*t+.7)&&r()>.2)&&(a.set([e,t,i],3*n),n++)}for(;n<e;n++)u(a,n,r,1.15,1.9);return a}(e),3)),i.setAttribute("aRandom",new o.BufferAttribute(a,4)),i.setAttribute("aKind",new o.BufferAttribute(t.kind,1)),i.setAttribute("aOrder",new o.BufferAttribute(t.order,1)),i},[e]),[E]=(0,r.useState)(()=>({uTime:{value:0},uSize:{value:40},uPixelRatio:{value:1},uIntro:{value:+!!a.reduced},uFrom:{value:0},uTo:{value:0},uMix:{value:0},uBurst:{value:0},uDim:{value:1},uPointerStrength:{value:0},uPointer:{value:new o.Vector3(99,99,0)},uLight:{value:0}})),T=p();(0,r.useEffect)(()=>()=>k.dispose(),[k]),(0,r.useEffect)(()=>{let e=y.current;e&&(e.uniforms.uLight.value=+!T,A())},[T,A]),(0,r.useEffect)(()=>{let e=y.current;e&&(e.uniforms.uSize.value=40*Math.min(1.2,Math.max(.7,b.height/900)),e.uniforms.uPixelRatio.value=S.getPixelRatio(),A())},[b.height,S,A]);let z=(0,r.useRef)({t:0,intro:+!!a.reduced,stage:-1,spin:0,markers:[],v:new o.Vector3,dir:new o.Vector3,target:new o.Vector3});return(0,i.useFrame)((e,t)=>{let r=h.current,i=y.current;if(!r||!i)return;let n=z.current,o=Math.min(t,.05),s=i.uniforms;a.reduced||(n.t+=o,n.intro=Math.min(1,n.intro+o/2.6)),s.uTime.value=n.t,s.uIntro.value=n.intro,0===n.markers.length&&(n.markers=Array.from(document.querySelectorAll("[data-scene]")));let l=Math.min(P.length,Math.max(1,n.markers.length))-1,u=Math.min(l,function(e){let t=window.innerHeight,r=0;for(let a=1;a<e.length;a++)r+=Math.min(1,Math.max(0,(.8*t-e[a].getBoundingClientRect().top)/(.6*t)));return r}(n.markers));a.reduced?n.stage=Math.round(u):n.stage=n.stage<0?u:n.stage+(u-n.stage)*(1-Math.pow(2e-4,o));let d=Math.floor(n.stage),c=Math.min(d+1,l),m=n.stage-d,v=P[d],p=P[c],x=m*m*(3-2*m);s.uFrom.value=v.shape,s.uTo.value=p.shape,s.uMix.value=m,s.uBurst.value=+(v.shape!==p.shape),s.uDim.value=w(v.dim,p.dim,x);let b=w(v.spin,p.spin,x);if(a.reduced||(n.spin+=o*b),b<.01){let e=Math.round(n.spin/g)*g;n.spin+=(e-n.spin)*(1-Math.pow(.05,o))}let S=f.current;n.v.set(S.x,S.y,.5).unproject(M),n.dir.copy(n.v).sub(M.position).normalize(),n.target.copy(M.position).addScaledVector(n.dir,-M.position.z/n.dir.z),s.uPointer.value.lerp(n.target,1-Math.pow(8e-4,o)),s.uPointerStrength.value+=(S.active-s.uPointerStrength.value)*(1-Math.pow(.02,o));let A=a.reduced?0:.13*Math.sin(.16*n.t);r.position.set(w(v.x,p.x,x)*R.width,w(v.y,p.y,x),0),r.scale.setScalar(w(v.s,p.s,x)),r.rotation.set(w(v.rx,p.rx,x)-.1*S.y*S.active,w(v.ry,p.ry,x)+n.spin+A+.25*S.x*S.active,0)}),(0,t.jsx)("group",{ref:h,children:(0,t.jsx)("points",{geometry:k,frustumCulled:!1,children:(0,t.jsx)("shaderMaterial",{ref:y,vertexShader:m,fragmentShader:v,uniforms:E,transparent:!0,depthWrite:!1,blending:T?o.AdditiveBlending:o.NormalBlending})})})}function M({count:e,env:a}){let l=(0,r.useRef)(null),{gl:u}=(0,n.useThree)(),d=(0,r.useMemo)(()=>{let t=s(5),r=new Float32Array(3*e),a=new Float32Array(4*e);for(let i=0;i<e;i++)r.set([(t()-.5)*12,(t()-.5)*7,-9+12*t()],3*i),a.set([t(),t(),t(),t()],4*i);let i=new o.BufferGeometry;return i.setAttribute("position",new o.BufferAttribute(r,3)),i.setAttribute("aRandom",new o.BufferAttribute(a,4)),i},[e]),[c]=(0,r.useState)(()=>({uTime:{value:0},uSize:{value:80},uPixelRatio:{value:1},uScroll:{value:0},uIntro:{value:+!!a.reduced},uLight:{value:0}})),f=p();(0,r.useEffect)(()=>()=>d.dispose(),[d]),(0,r.useEffect)(()=>{let e=l.current;e&&(e.uniforms.uLight.value=+!f)},[f]);let m=(0,r.useRef)({t:0,intro:+!!a.reduced});return(0,i.useFrame)((e,t)=>{let r=l.current;if(!r)return;let i=Math.min(t,.05);a.reduced||(m.current.t+=i,m.current.intro=Math.min(1,m.current.intro+i/2)),r.uniforms.uTime.value=m.current.t,r.uniforms.uIntro.value=m.current.intro,r.uniforms.uPixelRatio.value=u.getPixelRatio(),r.uniforms.uScroll.value=9e-4*window.scrollY}),(0,t.jsx)("points",{geometry:d,frustumCulled:!1,children:(0,t.jsx)("shaderMaterial",{ref:l,vertexShader:h,fragmentShader:v,uniforms:c,transparent:!0,depthWrite:!1,blending:f?o.AdditiveBlending:o.NormalBlending})})}function b(){let{invalidate:e}=(0,n.useThree)();return(0,r.useEffect)(()=>{let t=()=>e();return window.addEventListener("scroll",t,{passive:!0}),window.addEventListener("resize",t),()=>{window.removeEventListener("scroll",t),window.removeEventListener("resize",t)}},[e]),null}e.s(["AmbientField",0,M,"canvasDpr",0,y,"default",0,function({className:e}){let i=(0,r.useRef)({x:0,y:0,active:0}),[n,o]=(0,r.useState)(!1),[s]=(0,r.useState)(()=>{let e=window.matchMedia("(max-width: 1023px)").matches;return{reduced:window.matchMedia("(prefers-reduced-motion: reduce)").matches,mobile:e,dpr:y(e?1.5:1.75)}});(0,r.useEffect)(()=>{let e=()=>o(document.hidden);return document.addEventListener("visibilitychange",e),()=>document.removeEventListener("visibilitychange",e)},[]),(0,r.useEffect)(()=>{if(s.reduced)return;let e=e=>{i.current.x=e.clientX/window.innerWidth*2-1,i.current.y=-(2*(e.clientY/window.innerHeight))+1,i.current.active=+("touch"!==e.pointerType)},t=()=>{i.current.active=0};return window.addEventListener("pointermove",e,{passive:!0}),document.documentElement.addEventListener("pointerleave",t),()=>{window.removeEventListener("pointermove",e),document.documentElement.removeEventListener("pointerleave",t)}},[s.reduced]);let l=n?"never":s.reduced?"demand":"always";return(0,t.jsx)("div",{className:e,"aria-hidden":"true",children:(0,t.jsxs)(a.Canvas,{frameloop:l,dpr:s.dpr,camera:{position:[0,0,4.4],fov:34,near:.1,far:50},gl:{antialias:!1,alpha:!0,powerPreference:"high-performance"},style:{pointerEvents:"none"},children:[(0,t.jsx)(M,{count:s.mobile?120:260,env:s}),(0,t.jsx)(x,{count:s.mobile?8e3:16e3,env:s,pointer:i}),s.reduced&&(0,t.jsx)(b,{})]})})},"useIsDark",0,p],36496)},37073,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(75056),i=e.i(25234),n=e.i(36496);function o({pointer:e}){return(0,i.useFrame)((t,r)=>{let a=t.camera,i=1-Math.pow(.05,Math.min(r,.05));a.position.x+=(.35*e.current.x-a.position.x)*i,a.position.y+=(.22*e.current.y-a.position.y)*i,a.lookAt(0,0,0)}),null}e.s(["default",0,function(){let e=(0,r.useRef)({x:0,y:0}),[i,s]=(0,r.useState)(!1),[l]=(0,r.useState)(()=>{let e=window.matchMedia("(max-width: 1023px)").matches;return{reduced:window.matchMedia("(prefers-reduced-motion: reduce)").matches,mobile:e,dpr:(0,n.canvasDpr)(1.5)}});return(0,r.useEffect)(()=>{let e=()=>s(document.hidden);return document.addEventListener("visibilitychange",e),()=>document.removeEventListener("visibilitychange",e)},[]),(0,r.useEffect)(()=>{if(l.reduced)return;let t=t=>{"touch"!==t.pointerType&&(e.current.x=t.clientX/window.innerWidth*2-1,e.current.y=-(2*(t.clientY/window.innerHeight))+1)};return window.addEventListener("pointermove",t,{passive:!0}),()=>window.removeEventListener("pointermove",t)},[l.reduced]),(0,t.jsx)("div",{className:"absolute inset-0 opacity-80","aria-hidden":"true",children:(0,t.jsxs)(a.Canvas,{frameloop:i?"never":l.reduced?"demand":"always",dpr:l.dpr,camera:{position:[0,0,4.4],fov:34,near:.1,far:50},gl:{antialias:!1,alpha:!0,powerPreference:"low-power"},style:{pointerEvents:"none"},children:[(0,t.jsx)(n.AmbientField,{count:l.mobile?90:220,env:l}),!l.reduced&&(0,t.jsx)(o,{pointer:e})]})})}])},83160,e=>{e.n(e.i(37073))}]);