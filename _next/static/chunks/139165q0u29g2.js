(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,36496,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(75056),i=e.i(25234),o=e.i(28600),n=e.i(90072);function l(e){let t=e>>>0;return()=>{let e=t=t+0x6d2b79f5>>>0;return e=Math.imul(e^e>>>15,1|e),(((e^=e+Math.imul(e^e>>>7,61|e))^e>>>14)>>>0)/0x100000000}}function s(e){let t=2*e()-1,a=e()*Math.PI*2,r=Math.sqrt(1-t*t);return[r*Math.cos(a),t,r*Math.sin(a)]}function u(e,t,a,r,i){let[o,n,l]=s(a),u=r+Math.pow(a(),.7)*(i-r);e.set([o*u,n*u,l*u],3*t)}let d=[{shape:0,x:.2,y:.02,s:.82,rx:.06,ry:0,spin:.03,dim:1},{shape:0,x:-.27,y:-.55,s:1.55,rx:.15,ry:.5,spin:.03,dim:.9},{shape:1,x:0,y:0,s:1,rx:0,ry:0,spin:.025,dim:.6},{shape:2,x:-.2,y:0,s:.82,rx:.25,ry:0,spin:.07,dim:1},{shape:1,x:0,y:0,s:1,rx:0,ry:.6,spin:.025,dim:.4},{shape:3,x:.27,y:-.02,s:.86,rx:.32,ry:-.6,spin:.07,dim:1},{shape:1,x:0,y:0,s:1,rx:0,ry:1.2,spin:.025,dim:.5},{shape:1,x:0,y:0,s:1.15,rx:0,ry:1.6,spin:.025,dim:.55}],f=[{shape:0,x:.05,y:.62,s:.46,rx:.06,ry:0,spin:.03,dim:1},{shape:0,x:0,y:-.2,s:.9,rx:.15,ry:.5,spin:.03,dim:.35},{shape:1,x:0,y:0,s:.8,rx:0,ry:0,spin:.025,dim:.45},{shape:2,x:0,y:.15,s:.7,rx:.25,ry:0,spin:.07,dim:.35},{shape:1,x:0,y:0,s:.8,rx:0,ry:.6,spin:.025,dim:.3},{shape:3,x:0,y:.15,s:.85,rx:.32,ry:-.6,spin:.07,dim:.35},{shape:1,x:0,y:0,s:.8,rx:0,ry:1.2,spin:.025,dim:.35},{shape:1,x:0,y:0,s:.9,rx:0,ry:1.6,spin:.025,dim:.4}],m=`
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
`,h=`
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

  ${m}

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
`,c=`
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

  ${m}

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
`;function p(){let[e,t]=(0,a.useState)(()=>"u"<typeof document||document.documentElement.classList.contains("dark"));return(0,a.useEffect)(()=>{let e=document.documentElement,a=()=>t(e.classList.contains("dark"));a();let r=new MutationObserver(a);return r.observe(e,{attributes:!0,attributeFilter:["class"]}),()=>r.disconnect()},[]),e}let w=(e,t,a)=>e+(t-e)*a,g=2*Math.PI;function y(e){return Math.max(1,Math.min(window.devicePixelRatio||1,e,Math.sqrt(42e5/Math.max(1,window.innerWidth*window.innerHeight))))}function x({count:e,env:r,pointer:m}){let c=(0,a.useRef)(null),y=(0,a.useRef)(null),{camera:M,size:b,viewport:R,gl:S,invalidate:A}=(0,o.useThree)(),P=r.mobile?f:d,k=(0,a.useMemo)(()=>{let t=function(e,t=29){let a=l(t),r=new Float32Array(3*e),i=new Float32Array(e),o=new Float32Array(e),n=[];for(let e=0;e<320;e++){let t=1-2*(e+.5)/320;if(t<-.82)continue;let a=Math.sqrt(1-t*t),r=2.399963*e;n.push([Math.cos(r)*a,t,Math.sin(r)*a])}let s=e=>{let t=.9>Math.abs(e[1])?[0,1,0]:[1,0,0],a=[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],r=Math.hypot(a[0],a[1],a[2]),i=[a[0]/r,a[1]/r,a[2]/r];return[i,[e[1]*i[2]-e[2]*i[1],e[2]*i[0]-e[0]*i[2],e[0]*i[1]-e[1]*i[0]]]},u=Math.floor(.08*e),d=Math.floor(.05*e),f=Math.floor(.55*e),m=Math.floor(.26*e),h=0;for(;h<u;h++){let e=a(),t=.12*Math.sin(2.4*e)*(1-e),n=-1.35+e*(.35+1.35),l=a()*Math.PI*2,s=.016+.006*(1-e);r.set([t+Math.cos(l)*s,n,Math.sin(l)*s],3*h),i[h]=0,o[h]=.3*e}for(;h<u+d;h++){let e=n[Math.floor(a()*n.length)],t=.06+.07*a();r.set([0+e[0]*t,.45+e[1]*t,0+e[2]*t],3*h),i[h]=3,o[h]=.32}for(;h<u+d+f;h++){let e=n[Math.floor(a()*n.length)],t=.14+.72*a();r.set([0+.95*e[0]*t,.45+.95*e[1]*t,0+.95*e[2]*t],3*h),i[h]=0,o[h]=.35+.55*t}for(;h<u+d+f+m;h++){let e=n[Math.floor(a()*n.length)],[t,l]=s(e),u=a()*Math.PI*2,d=.13*Math.pow(a(),.6),f=.86+.06*a()+.35*d;r.set([0+.95*e[0]*f+(t[0]*Math.cos(u)+l[0]*Math.sin(u))*d,.45+.95*e[1]*f+(t[1]*Math.cos(u)+l[1]*Math.sin(u))*d,0+.95*e[2]*f+(t[2]*Math.cos(u)+l[2]*Math.sin(u))*d],3*h),i[h]=1,o[h]=.9+.1*a()}for(;h<e;h++){let e=n[Math.floor(a()*n.length)],t=[.8*Math.abs(e[0])+.2,.6*e[1]+.3,e[2]];r.set([0+.95*t[0],.45+.95*t[1],0+.95*t[2]*.6],3*h),i[h]=2,o[h]=1}return{position:r,kind:i,order:o}}(e),a=l(9),r=Float32Array.from({length:4*e},()=>a()),i=new n.BufferGeometry;return i.setAttribute("position",new n.BufferAttribute(t.position,3)),i.setAttribute("aScatter",new n.BufferAttribute(function(e,t=21){let a=l(t),r=new Float32Array(3*e),i=0;for(;i<e;){let e=(2*a()-1)*3.6,t=(2*a()-1)*2.1,o=-4+5.4*a(),n=(e/2.3)**2+(t/1.15)**2;!(n<1&&a()>.12+.88*n*n)&&(r.set([e,t,o],3*i),i++)}return r}(e),3)),i.setAttribute("aIdea",new n.BufferAttribute(function(e,t=37){let a=l(t),r=new Float32Array(3*e),i=[];for(let e=0;e<7;e++){let t=1-2*(e+.5)/7,r=Math.sqrt(1-t*t),o=2.399963*e+.4,n=.78+.14*a();i.push([Math.cos(o)*r*n,t*n*.82,Math.sin(o)*r*n])}let o=[];for(let e of i){let t=3+Math.floor(2*a());for(let r=0;r<t;r++){let[t,r,i]=s(a),n=[.55*e[0]+.3*t,.55*e[1]+.3*r,.55*e[2]+.3*i];o.push({from:e,at:[e[0]+n[0],e[1]+n[1],e[2]+n[2]]})}}let n=(e,t)=>{let[r,i,o]=s(a),n=t*(.7>a()?.85+.15*a():Math.cbrt(a()));return[e[0]+r*n,e[1]+i*n,e[2]+o*n]},d=(e,t,r)=>{let i=a(),o=[(e[0]+t[0])/2+r*(e[1]-t[1]),(e[1]+t[1])/2+.3*r,(e[2]+t[2])/2-r*(e[0]-t[0])],n=1-i,l=()=>(a()-.5)*.008;return[n*n*e[0]+2*n*i*o[0]+i*i*t[0]+l(),n*n*e[1]+2*n*i*o[1]+i*i*t[1]+l(),n*n*e[2]+2*n*i*o[2]+i*i*t[2]+l()]},f=[0,0,0],m=[{w:11,at:()=>n(f,.17)},{w:16,at:()=>n(i[Math.floor(7*a())],.075)},{w:12,at:()=>n(o[Math.floor(a()*o.length)].at,.04)},{w:24,at:()=>{let e=Math.floor(7*a());return d(f,i[e],.12*(e%2?1:-1))}},{w:20,at:()=>{let e=o[Math.floor(a()*o.length)];return d(e.from,e.at,.05)}},{w:5,at:()=>{let e=Math.floor(7*a());return d(i[e],i[(e+2)%7],.18)}}],h=m.reduce((e,t)=>e+t.w,0),c=Math.floor(.08*e);for(let t=0;t<e-c;t++){let e=a()*h,i=m[0];for(let t of m){if(e<t.w){i=t;break}e-=t.w}r.set(i.at(),3*t)}for(let t=e-c;t<e;t++)u(r,t,a,1.2,2.2);return r}(e),3)),i.setAttribute("aGlobe",new n.BufferAttribute(function(e,t=47){let a=l(t),r=new Float32Array(3*e),i=Math.floor(.94*e),o=0;for(;o<i;){let[e,t,i]=s(a);!(.1>Math.sin(3.1*e+1.3*Math.sin(2.2*i))*Math.sin(2.7*t+1.7*Math.sin(1.9*e))+.55*Math.sin(4.3*i+2.1*t+.7)&&a()>.2)&&(r.set([e,t,i],3*o),o++)}for(;o<e;o++)u(r,o,a,1.15,1.9);return r}(e),3)),i.setAttribute("aRandom",new n.BufferAttribute(r,4)),i.setAttribute("aKind",new n.BufferAttribute(t.kind,1)),i.setAttribute("aOrder",new n.BufferAttribute(t.order,1)),i},[e]),[T]=(0,a.useState)(()=>({uTime:{value:0},uSize:{value:40},uPixelRatio:{value:1},uIntro:{value:+!!r.reduced},uFrom:{value:0},uTo:{value:0},uMix:{value:0},uBurst:{value:0},uDim:{value:1},uPointerStrength:{value:0},uPointer:{value:new n.Vector3(99,99,0)},uLight:{value:0}})),z=p();(0,a.useEffect)(()=>()=>k.dispose(),[k]),(0,a.useEffect)(()=>{let e=y.current;e&&(e.uniforms.uLight.value=+!z,A())},[z,A]),(0,a.useEffect)(()=>{let e=y.current;e&&(e.uniforms.uSize.value=40*Math.min(1.2,Math.max(.7,b.height/900)),e.uniforms.uPixelRatio.value=S.getPixelRatio(),A())},[b.height,S,A]);let E=(0,a.useRef)({t:0,intro:+!!r.reduced,stage:-1,spin:0,markers:[],v:new n.Vector3,dir:new n.Vector3,target:new n.Vector3});return(0,i.useFrame)((e,t)=>{let a=c.current,i=y.current;if(!a||!i)return;let o=E.current,n=Math.min(t,.05),l=i.uniforms;r.reduced||(o.t+=n,o.intro=Math.min(1,o.intro+n/2.6)),l.uTime.value=o.t,l.uIntro.value=o.intro,0===o.markers.length&&(o.markers=Array.from(document.querySelectorAll("[data-scene]")));let s=Math.min(P.length,Math.max(1,o.markers.length))-1,u=Math.min(s,function(e){let t=window.innerHeight,a=0;for(let r=1;r<e.length;r++)a+=Math.min(1,Math.max(0,(.8*t-e[r].getBoundingClientRect().top)/(.6*t)));return a}(o.markers));r.reduced?o.stage=Math.round(u):o.stage=o.stage<0?u:o.stage+(u-o.stage)*(1-Math.pow(2e-4,n));let d=Math.floor(o.stage),f=Math.min(d+1,s),h=o.stage-d,v=P[d],p=P[f],x=h*h*(3-2*h);l.uFrom.value=v.shape,l.uTo.value=p.shape,l.uMix.value=h,l.uBurst.value=+(v.shape!==p.shape),l.uDim.value=w(v.dim,p.dim,x);let b=w(v.spin,p.spin,x);if(r.reduced||(o.spin+=n*b),b<.01){let e=Math.round(o.spin/g)*g;o.spin+=(e-o.spin)*(1-Math.pow(.05,n))}let S=m.current;o.v.set(S.x,S.y,.5).unproject(M),o.dir.copy(o.v).sub(M.position).normalize(),o.target.copy(M.position).addScaledVector(o.dir,-M.position.z/o.dir.z),l.uPointer.value.lerp(o.target,1-Math.pow(8e-4,n)),l.uPointerStrength.value+=(S.active-l.uPointerStrength.value)*(1-Math.pow(.02,n));let A=r.reduced?0:.13*Math.sin(.16*o.t);a.position.set(w(v.x,p.x,x)*R.width,w(v.y,p.y,x),0),a.scale.setScalar(w(v.s,p.s,x)),a.rotation.set(w(v.rx,p.rx,x)-.1*S.y*S.active,w(v.ry,p.ry,x)+o.spin+A+.25*S.x*S.active,0)}),(0,t.jsx)("group",{ref:c,children:(0,t.jsx)("points",{geometry:k,frustumCulled:!1,children:(0,t.jsx)("shaderMaterial",{ref:y,vertexShader:h,fragmentShader:v,uniforms:T,transparent:!0,depthWrite:!1,blending:z?n.AdditiveBlending:n.NormalBlending})})})}function M({count:e,env:r}){let s=(0,a.useRef)(null),{gl:u}=(0,o.useThree)(),d=(0,a.useMemo)(()=>{let t=l(5),a=new Float32Array(3*e),r=new Float32Array(4*e);for(let i=0;i<e;i++)a.set([(t()-.5)*12,(t()-.5)*7,-9+12*t()],3*i),r.set([t(),t(),t(),t()],4*i);let i=new n.BufferGeometry;return i.setAttribute("position",new n.BufferAttribute(a,3)),i.setAttribute("aRandom",new n.BufferAttribute(r,4)),i},[e]),[f]=(0,a.useState)(()=>({uTime:{value:0},uSize:{value:80},uPixelRatio:{value:1},uScroll:{value:0},uIntro:{value:+!!r.reduced},uLight:{value:0}})),m=p();(0,a.useEffect)(()=>()=>d.dispose(),[d]),(0,a.useEffect)(()=>{let e=s.current;e&&(e.uniforms.uLight.value=+!m)},[m]);let h=(0,a.useRef)({t:0,intro:+!!r.reduced});return(0,i.useFrame)((e,t)=>{let a=s.current;if(!a)return;let i=Math.min(t,.05);r.reduced||(h.current.t+=i,h.current.intro=Math.min(1,h.current.intro+i/2)),a.uniforms.uTime.value=h.current.t,a.uniforms.uIntro.value=h.current.intro,a.uniforms.uPixelRatio.value=u.getPixelRatio(),a.uniforms.uScroll.value=9e-4*window.scrollY}),(0,t.jsx)("points",{geometry:d,frustumCulled:!1,children:(0,t.jsx)("shaderMaterial",{ref:s,vertexShader:c,fragmentShader:v,uniforms:f,transparent:!0,depthWrite:!1,blending:m?n.AdditiveBlending:n.NormalBlending})})}function b(){let{invalidate:e}=(0,o.useThree)();return(0,a.useEffect)(()=>{let t=()=>e();return window.addEventListener("scroll",t,{passive:!0}),window.addEventListener("resize",t),()=>{window.removeEventListener("scroll",t),window.removeEventListener("resize",t)}},[e]),null}e.s(["AmbientField",0,M,"canvasDpr",0,y,"default",0,function({className:e}){let i=(0,a.useRef)({x:0,y:0,active:0}),[o,n]=(0,a.useState)(!1),[l]=(0,a.useState)(()=>{let e=window.matchMedia("(max-width: 1023px)").matches;return{reduced:window.matchMedia("(prefers-reduced-motion: reduce)").matches,mobile:e,dpr:y(e?1.5:1.75)}});(0,a.useEffect)(()=>{let e=()=>n(document.hidden);return document.addEventListener("visibilitychange",e),()=>document.removeEventListener("visibilitychange",e)},[]),(0,a.useEffect)(()=>{if(l.reduced)return;let e=e=>{i.current.x=e.clientX/window.innerWidth*2-1,i.current.y=-(2*(e.clientY/window.innerHeight))+1,i.current.active=+("touch"!==e.pointerType)},t=()=>{i.current.active=0};return window.addEventListener("pointermove",e,{passive:!0}),document.documentElement.addEventListener("pointerleave",t),()=>{window.removeEventListener("pointermove",e),document.documentElement.removeEventListener("pointerleave",t)}},[l.reduced]);let s=o?"never":l.reduced?"demand":"always";return(0,t.jsx)("div",{className:e,"aria-hidden":"true",children:(0,t.jsxs)(r.Canvas,{frameloop:s,dpr:l.dpr,camera:{position:[0,0,4.4],fov:34,near:.1,far:50},gl:{antialias:!1,alpha:!0,powerPreference:"high-performance"},style:{pointerEvents:"none"},children:[(0,t.jsx)(M,{count:l.mobile?120:260,env:l}),(0,t.jsx)(x,{count:l.mobile?8e3:16e3,env:l,pointer:i}),l.reduced&&(0,t.jsx)(b,{})]})})},"useIsDark",0,p],36496)},9113,e=>{e.n(e.i(36496))}]);