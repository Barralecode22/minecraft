const $=id=>document.getElementById(id);
const N=256,H=32,CS=16,NC=N/CS,W=new Uint8Array(N*H*N);
const get=(x,y,z)=>x<0||z<0||x>=N||y<0||z>=N?1:y>=H?0:W[(x*H+y)*N+z];
const put=(x,y,z,t)=>{if(y>=0&&y<H&&x>=0&&z>=0&&x<N&&z<N)W[(x*H+y)*N+z]=t};
// ===== registro de bloques y texturas (atlas de 32 casillas de 16x16) =====
let sd=7;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
const NT=32,atl=document.createElement('canvas');atl.width=NT*16;atl.height=16;const ctx=atl.getContext('2d');
function tile(i,base,v,fn){for(let y=0;y<16;y++)for(let x=0;x<16;x++){const c=new THREE.Color(base).multiplyScalar(1+(rnd()-.5)*v);if(fn&&fn(x,y,c)===false)continue;['r','g','b'].forEach(k=>c[k]=Math.min(1,c[k]));ctx.fillStyle='#'+c.getHexString();ctx.fillRect(i*16+x,y,1,1)}}
tile(0,0x5fa83a,.3);
tile(1,0x7a5230,.3,(x,y,c)=>{if(y<3+(rnd()<.3?1:0))c.setHex(0x5fa83a).multiplyScalar(1+(rnd()-.5)*.3)});
tile(2,0x7a5230,.3);tile(3,0x8a8a8a,.25);
tile(4,0x6b4a26,.2,(x,y,c)=>{if(x%4==0)c.multiplyScalar(.8)});
tile(5,0x9c7a45,.15,(x,y,c)=>{const d=Math.max(Math.abs(x-7.5),Math.abs(y-7.5));if(d>7)c.setHex(0x5a3d1e);else if(Math.floor(d)%2==0)c.multiplyScalar(.85)});
tile(6,0x2f7d2f,.4,()=>rnd()<.2?false:0);tile(7,0xe3d59a,.12);
tile(8,0xb8924f,.12,(x,y,c)=>{if(y%4==3)c.multiplyScalar(.75)});
tile(9,0x808080,.35,(x,y,c)=>{if(y%8==0||(x+(y>>3)*4)%8==0)c.multiplyScalar(.7)});
tile(10,0xcfeeff,.1,(x,y)=>{if(!(x==0||y==0||x==15||y==15||(x==3&&y>=3&&y<=6)||(y==3&&x>=3&&x<=6)))return false});
tile(11,0x8a8a8a,.12,(x,y,c)=>{if(y%8==0||(x+((y>>3)%2)*8)%16==0)c.multiplyScalar(.68)});
tile(12,0xb8924f,.12,(x,y,c)=>{if(x%8==0||y%8==0)c.setHex(0x5a3d1e)});
tile(13,0x9c7a45,.15,(x,y,c)=>{if(y<2||y>13)c.setHex(0x5a3d1e);else if(x>3&&x<12&&y>4&&y<11)c.multiplyScalar(.7)});
tile(14,0x8a8480,.5,(x,y,c)=>{if(rnd()<.2)c.multiplyScalar(.6)});
const blobs=[[3,3],[10,2],[6,8],[12,10],[2,12],[9,13]];
const ore=(i,h)=>tile(i,0x8a8a8a,.25,(x,y,c)=>{if(blobs.some(b=>x>=b[0]&&x<b[0]+2&&y>=b[1]&&y<b[1]+2))c.setHex(h).multiplyScalar(1+(rnd()-.5)*.2)});
ore(15,0x1c1c1c);ore(16,0xd8a87c);ore(17,0xf5d742);ore(18,0x4de8e0);
tile(19,0x3a3a3a,.7);tile(20,0xf0f0f0,.07);
tile(21,0x7a7a7a,.2);
tile(22,0x7a7a7a,.2,(x,y,c)=>{if(x>3&&x<12&&y>6&&y<13)c.setHex(0x222222);else if(x>3&&x<12&&y>3&&y<6)c.multiplyScalar(.6)});
tile(23,0x8f5f23,.15,(x,y,c)=>{if(x==0||y==0||x==15||y==15)c.multiplyScalar(.7)});
tile(24,0x9c6a2a,.15,(x,y,c)=>{if(y==7||y==8)c.setHex(0x4a2e12);if((x==7||x==8)&&y>=6&&y<=9)c.setHex(0xcfcfcf)});
tile(25,0x6b4a26,.2,(x,y,c)=>{if(x>=7&&x<=8){if(y>=8)return;if(y>=6){c.setHex(y<7?0xffd23f:0xff8a1f);return}}return false});
tile(26,0xb82020,.1,(x,y,c)=>{if(y<5)c.setHex(0xf0f0f0)});
tile(27,0xb8924f,.1,(x,y,c)=>{if(y<6)c.setHex(0xb82020)});
tile(28,0x6b4a26,.25,(x,y,c)=>{if(y%4==0)c.multiplyScalar(.7)});
tile(29,0xb8924f,.1,(x,y,c)=>{if(x==0||x==15||y==15||(x>2&&x<13&&(y==4||y==5||y==11||y==12)))c.multiplyScalar(.72);if(x==12&&y==8)c.setHex(0x555555)});
tile(30,0xb8924f,.1,(x,y,c)=>{if(x==0||x==15||y==0||(x>2&&x<13&&y>=2&&y<=6))c.multiplyScalar(.72);if(x>3&&x<12&&y>2&&y<6)c.setHex(0xcfeeff)});
const tex=new THREE.CanvasTexture(atl);tex.magFilter=tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;
// ids de bloques (el inventario usa ids <100 para bloques y >=100 para ítems)
const B={grass:1,dirt:2,stone:3,log:4,leaves:5,sand:6,planks:7,cobble:8,glass:9,sbrick:10,table:11,gravel:40,coal:41,iron:42,gold:43,diamond:44,bedrock:45,wool:46,furnace:47,chest:48,torch:49,slab:50,cslab:51,fence:52,bed:53,camp:54,door:60,stair:64,cstair:68};
const BK=[],CAN=[];
function bk(id,n,t,h,e,l,x){BK[id]=Object.assign({n,t,h,e,l},x||{})}
bk(1,'Césped',[0,1,2],.6,'s',-1);bk(2,'Tierra',[2,2,2],.5,'s',-1);bk(3,'Piedra',[3,3,3],1.5,'p',0);bk(4,'Tronco',[5,4,5],2,'a',-1);
bk(5,'Hojas',[6,6,6],.2,0,-1,{tr:1});bk(6,'Arena',[7,7,7],.5,'s',-1);bk(7,'Tablones',[8,8,8],2,'a',-1);bk(8,'Adoquín',[9,9,9],2,'p',0);
bk(9,'Vidrio',[10,10,10],.3,0,-1,{tr:1});bk(10,'Ladrillos de piedra',[11,11,11],1.5,'p',0);bk(11,'Mesa de crafteo',[12,13,8],2.5,'a',-1);
bk(40,'Grava',[14,14,14],.6,'s',-1);bk(41,'Mena de carbón',[15,15,15],3,'p',0);bk(42,'Mena de hierro',[16,16,16],3,'p',1);
bk(43,'Mena de oro',[17,17,17],3,'p',2);bk(44,'Mena de diamante',[18,18,18],3,'p',2);bk(45,'Lecho de roca',[19,19,19],-1,0,99);
bk(46,'Lana',[20,20,20],.8,0,-1);bk(47,'Horno',[21,22,21],3.5,'p',0);bk(48,'Cofre',[23,24,23],2.5,'a',-1,{sh:1});
bk(49,'Antorcha',[25,25,25],0,0,-1,{sh:1,ns:1,lt:14});bk(50,'Losa de madera',[8,8,8],2,'a',-1,{sh:1});bk(51,'Losa de adoquín',[9,9,9],2,'p',0,{sh:1});
bk(52,'Valla',[8,8,8],2,'a',-1,{sh:1});bk(53,'Cama',[26,27,27],.2,0,-1,{sh:1});bk(54,'Fogata',[28,28,28],2,'a',-1,{sh:1,lt:15});
bk(60,'Puerta',[29,29,29],3,'a',-1,{sh:1});bk(62,'Puerta',[30,30,30],3,'a',-1,{sh:1});
BK[61]=Object.assign({},BK[60]);BK[63]=Object.assign({},BK[62]);
for(let i=0;i<4;i++){bk(64+i,'Escalera de madera',[8,8,8],2,'a',-1,{sh:1});bk(68+i,'Escalera de adoquín',[9,9,9],2,'p',0,{sh:1});bk(72+i,'Antorcha',[25,25,25],0,0,-1,{sh:1,ns:1,lt:14})}
for(let i=1;i<80;i++)CAN[i]=i;CAN[61]=CAN[62]=CAN[63]=60;for(let i=1;i<4;i++){CAN[64+i]=64;CAN[68+i]=68}for(let i=0;i<4;i++)CAN[72+i]=49;
const trp=n=>{const d=BK[n];return !d||d.tr||d.sh};
// mundo 256x256 determinista (todos los jugadores generan el mismo mapa)
let ws=12345;const wr=()=>{ws=(ws+0x6D2B79F5)|0;let t=Math.imul(ws^ws>>>15,1|ws);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const hgt=(x,z)=>Math.max(3,Math.min(29,Math.floor(14+7*Math.sin(x*.022+1)*Math.cos(z*.027)+4*Math.sin(x*.06+z*.05)+3*Math.cos(z*.1-x*.04)+Math.sin(x*.4)*Math.cos(z*.37))));
const HG=new Uint8Array(N*N);
for(let x=0;x<N;x++)for(let z=0;z<N;z++){const h=hgt(x,z);HG[x*N+z]=h;for(let y=0;y<=h;y++)put(x,y,z,y==0?45:y==h?(h<=10?6:h>=22?3:1):y>h-4?(h>=22?3:2):3)}
// cuevas: túneles sinuosos, algunos con entrada en la superficie, y salas ocasionales
function carve(cx,cy,cz,r){const q=Math.ceil(r);for(let a=-q;a<=q;a++)for(let b=-q;b<=q;b++)for(let c=-q;c<=q;c++){if(a*a+b*b+c*c>r*r)continue;const x=Math.floor(cx)+a,y=Math.floor(cy)+b,z=Math.floor(cz)+c;if(x>0&&z>0&&x<N-1&&z<N-1&&y>=2&&y<=HG[x*N+z])put(x,y,z,0)}}
for(let w=0;w<260;w++){let x=wr()*N,z=wr()*N,yaw=wr()*6.28,pt=0,y;const en=wr()<.35;if(en){y=HG[(x|0)*N+(z|0)];pt=-.45}else y=5+wr()*12;const len=60+wr()*100;
for(let s=0;s<len;s++){carve(x,y,z,1.7+Math.sin(s*.15+w)*.5+(wr()<.015?2.2:0));yaw+=(wr()-.5)*.5;pt=Math.max(-.6,Math.min(.6,pt*.9+(wr()-.5)*.25));x+=Math.cos(yaw)*Math.cos(pt);z+=Math.sin(yaw)*Math.cos(pt);y+=Math.sin(pt);
if(x<3||z<3||x>N-4||z>N-4)break;const hh=HG[(x|0)*N+(z|0)];if(!(en&&s<14)&&y>hh-4.5){y=hh-4.5;pt=-.2}if(y<4){y=4;pt=.2}}}
// minerales y grava: vetas que reemplazan piedra (rara vez asoman a la superficie)
function vein(id,cnt,y0,y1,s0,s1){for(let i=0;i<cnt;i++){let x=2+wr()*(N-4),y=y0+wr()*(y1-y0),z=2+wr()*(N-4);const sz=s0+Math.floor(wr()*(s1-s0+1));for(let s=0;s<sz;s++){const X=Math.floor(x),Y=Math.floor(y),Z=Math.floor(z);if(X>0&&Z>0&&X<N-1&&Z<N-1&&Y>=1&&Y<=HG[X*N+Z]&&get(X,Y,Z)==3)put(X,Y,Z,id);x+=wr()*2-1;y+=wr()*2-1;z+=wr()*2-1}}}
vein(40,160,2,24,10,26);vein(41,640,2,27,5,12);vein(42,360,1,23,3,8);vein(43,70,1,11,3,6);vein(44,26,1,8,1,3);
for(let i=0;i<750;i++){const x=4+Math.floor(wr()*(N-8)),z=4+Math.floor(wr()*(N-8)),h=HG[x*N+z];if(get(x,h,z)!=1)continue;const t=4+Math.floor(wr()*2);if(h+t+2>=H)continue;
for(let y=h+t-2;y<=h+t+1;y++){const r=y<h+t?2:1;for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++)if(!(Math.abs(a)==r&&Math.abs(b)==r&&(y>h+t||wr()<.5))&&!get(x+a,y,z+b))put(x+a,y,z+b,5)}
for(let y=1;y<=t;y++)put(x,h+y,z,4)}
// altura de luz del cielo: bajo tierra oscurece (cuevas)
const HT=new Uint8Array(N*N);function ht2(x,z){let y=H-1;while(y>0&&!W[(x*H+y)*N+z])y--;HT[x*N+z]=y}
for(let x=0;x<N;x++)for(let z=0;z<N;z++)ht2(x,z);
const lgt=(x,y,z)=>{const d=HT[Math.max(0,Math.min(N-1,x))*N+Math.max(0,Math.min(N-1,z))]-y;return d<=1?1:Math.max(.16,1-(d-1)*.1)};
const scene=new THREE.Scene();scene.background=new THREE.Color(0x87ceeb);scene.fog=new THREE.Fog(0x87ceeb,40,85);
const amb=new THREE.AmbientLight(0xffffff,.75);scene.add(amb);const dl=new THREE.DirectionalLight(0xffffff,.5);dl.position.set(.5,1,.3);scene.add(dl);
const cam=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,.1,130);cam.rotation.order='YXZ';
const ren=new THREE.WebGLRenderer({antialias:false});ren.setPixelRatio(Math.min(devicePixelRatio,2));ren.setSize(innerWidth,innerHeight);ren.domElement.className='g';document.body.prepend(ren.domElement);
addEventListener('resize',()=>{ren.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()});
const F=[[1,0,0,[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],.8],[-1,0,0,[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],.8],[0,1,0,[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],1],[0,-1,0,[[0,0,0],[1,0,0],[1,0,1],[0,0,1]],.5],[0,0,1,[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],.7],[0,0,-1,[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],.7]];
const UV=[[0,0],[1,0],[1,1],[0,1]],dayU={value:1},meshes=new Array(NC*NC).fill(null);
F.forEach(f=>{const c=f[3];f.aU=[0,1,2].find(i=>c[0][i]!=c[1][i]);f.aV=[0,1,2].find(i=>c[0][i]!=c[3][i])});
const mat=new THREE.MeshBasicMaterial({map:tex,vertexColors:true,alphaTest:.5});
// color de vértice = (sombra de la cara, luz del cielo, luz de bloque); de noche solo baja la luz del cielo
mat.onBeforeCompile=sh=>{sh.uniforms.uDay=dayU;sh.fragmentShader='uniform float uDay;\n'+sh.fragmentShader.replace('#include <color_fragment>','diffuseColor.rgb*=vColor.x*max(vColor.y*uDay,vColor.z)*mix(vec3(.82,.86,1.),vec3(1.),uDay);')};
// luces de bloque (antorchas y fogatas)
const LS=new Map(),DIRTY=new Set(),LV=[];BK.forEach((d,i)=>{if(d&&d.lt)LV[i]=d.lt});
function addLight(x,y,z,l,t){const k=(x>>4)*NC+(z>>4);let a=LS.get(k);if(!a)LS.set(k,a=[]);a.push([x,y,z,l,t])}
function delLight(x,y,z){const k=(x>>4)*NC+(z>>4),a=LS.get(k);if(a){const i=a.findIndex(s=>s[0]==x&&s[1]==y&&s[2]==z);if(i>=0)a.splice(i,1)}}
function blockLight(x,y,z){let m=0;const ci=x>>4,cj=z>>4;for(let i=ci-1;i<=ci+1;i++)for(let j=cj-1;j<=cj+1;j++){const a=LS.get(i*NC+j);if(a)for(const s of a){const d=Math.hypot(s[0]-x,s[1]-y,s[2]-z),v=(s[3]-d*1.15)/15;if(v>m)m=v}}return m}
function mark(x,z,r){for(let i=(x-r)>>4;i<=(x+r)>>4;i++)for(let j=(z-r)>>4;j<=(z+r)>>4;j++)if(i>=0&&j>=0&&i<NC&&j<NC)DIRTY.add(i*NC+j)}
function flush(){let n=0;for(const k of DIRTY){DIRTY.delete(k);if(meshes[k]){build(Math.floor(k/NC),k%NC);if(++n>=6)break}}}
function edit(x,y,z,t,own){const o=get(x,y,z);if(o==t)return;put(x,y,z,t);ht2(x,z);if(LV[o])delLight(x,y,z);if(LV[t])addLight(x,y,z,LV[t],t);mark(x,z,(LV[o]||LV[t])?10:1);if(own)logEdit(x,y,z,t)}
// formas de bloques que no son cubos (medidas en 1/16 de bloque)
function boxesOf(t,x,y,z){
if(t==48)return[[1,0,1,15,14,15]];if(t==49)return[[7,0,7,9,10,9]];
if(t==72)return[[0,3,7,2,13,9]];if(t==73)return[[14,3,7,16,13,9]];if(t==74)return[[7,3,0,9,13,2]];if(t==75)return[[7,3,14,9,13,16]];
if(t==50||t==51)return[[0,0,0,16,8,16]];
if(t==52){const a=[[6,0,6,10,16,10]],c=(dx,dz)=>{const n=get(x+dx,y,z+dz);return n==52||(n&&!BK[n].sh&&!BK[n].tr)};
if(c(1,0))a.push([10,6,7,16,9,9],[10,12,7,16,15,9]);if(c(-1,0))a.push([0,6,7,6,9,9],[0,12,7,6,15,9]);if(c(0,1))a.push([7,6,10,9,9,16],[7,12,10,9,15,16]);if(c(0,-1))a.push([7,6,0,9,9,6],[7,12,0,9,15,6]);return a}
if(t==53)return[[0,0,0,16,9,16]];if(t==54)return[[0,0,0,16,7,16]];
if(t==60||t==62)return[[0,0,13,16,16,16]];if(t==61||t==63)return[[13,0,0,16,16,16]];
if(t>=64&&t<=71){const f=(t-64)&3,L=[[0,0,0,16,8,16]];L.push(f==0?[8,8,0,16,16,16]:f==1?[0,8,0,8,16,16]:f==2?[0,8,8,16,16,16]:[0,8,0,16,16,8]);return L}
return[[0,0,0,16,16,16]]}
function build(a,b){const k=a*NC+b;if(meshes[k]){scene.remove(meshes[k]);meshes[k].geometry.dispose()}
const p=[],c=[],u=[],ix=[],FULL=[0,0,0,1,1,1];
const quad=(f,x,y,z,bx,ti,sk,bl)=>{const q=p.length/3,fc=f[3];for(let i=0;i<4;i++){const v=fc[i],w=[bx[0]+v[0]*(bx[3]-bx[0]),bx[1]+v[1]*(bx[4]-bx[1]),bx[2]+v[2]*(bx[5]-bx[2])];p.push(x+w[0],y+w[1],z+w[2]);c.push(f[4],sk,bl);
const uu=fc[0][f.aU]==0?w[f.aU]:1-w[f.aU],vv=fc[0][f.aV]==0?w[f.aV]:1-w[f.aV];u.push((ti+.001+uu*.998)/NT,vv)}ix.push(q,q+1,q+2,q,q+2,q+3)};
for(let x=a*CS;x<a*CS+CS;x++)for(let z=b*CS;z<b*CS+CS;z++)for(let y=0;y<H;y++){const t=get(x,y,z);if(!t)continue;const d=BK[t];if(!d)continue;
if(d.sh){const sk=lgt(x,y,z),bl=blockLight(x,y,z);for(const bx of boxesOf(t,x,y,z)){const bb=bx.map(v=>v/16);for(const f of F)quad(f,x,y,z,bb,f[1]>0?d.t[0]:f[1]<0?d.t[2]:d.t[1],sk,bl)}continue}
for(const f of F){const nx=x+f[0],ny=y+f[1],nz=z+f[2],n=get(nx,ny,nz);if(n&&(!trp(n)||n==t))continue;quad(f,x,y,z,FULL,f[1]>0?d.t[0]:f[1]<0?d.t[2]:d.t[1],lgt(nx,ny,nz),blockLight(nx,ny,nz))}}
const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(u,2));g.setIndex(ix);
const m=new THREE.Mesh(g,mat);scene.add(m);meshes[k]=m}
const RD=5;
function stream(){const pa=Math.floor(P.x/CS),pb=Math.floor(P.z/CS);let best=null,bd=1e9;
for(let a=0;a<NC;a++)for(let b=0;b<NC;b++){const d=Math.max(Math.abs(a-pa),Math.abs(b-pb)),m=meshes[a*NC+b];if(d<=RD){if(m)m.visible=true;else{const dd=(a-pa)**2+(b-pb)**2;if(dd<bd){bd=dd;best=[a,b]}}}else if(m)m.visible=false}
if(best)build(best[0],best[1])}
// colisiones con las formas reales (medias losas, escaleras, vallas de 1,5 de alto...)
const FULLB=[[0,0,0,16,16,16]];
function colBoxes(t,a,b,c){if(t==52)return[[6,0,6,10,24,10]];const d=BK[t];return !d||!d.sh?FULLB:boxesOf(t,a,b,c)}
function sol(x,y,z,hw,h){const x0=x-hw,x1=x+hw,z0=z-hw,z1=z+hw,y1=y+h;
for(let a=Math.floor(x0);a<=Math.floor(x1);a++)for(let b=Math.floor(y);b<=Math.floor(y1-.001);b++)for(let c=Math.floor(z0);c<=Math.floor(z1);c++){
const t=get(a,b,c);let bx=null;if(t&&!(BK[t]&&BK[t].ns))bx=colBoxes(t,a,b,c);if(b>0&&get(a,b-1,c)==52)bx=(bx||[]).concat([[6,0,6,10,8,10]]);if(!bx)continue;
for(const q of bx)if(x1>a+q[0]/16&&x0<a+q[3]/16&&y1>b+q[1]/16&&y<b+q[4]/16&&z1>c+q[2]/16&&z0<c+q[5]/16)return true}
return false}
const surf=(x,z)=>{for(let y=H-1;y>=0;y--)if(get(Math.floor(x),y,Math.floor(z)))return y+1;return 1};
const P={x:N/2+.5,y:surf(N/2,N/2),z:N/2+.5,vy:0,g:false,fly:false},R={yaw:0,pitch:0};
for(let i=0;i<30;i++)stream();
const keys={};let jx=0,jy=0,sel=0,playing=false,holdUp=false,holdFn=null,ht=0,invOpen=false,cur=null,cgs=2,mining=false,mine={x:-1,y:0,z:0,p:0,t:0},mcd=0,view=0,sw=-1,eq=0,walk=0,bob=0,ptm=0;
const SPN={x:N/2+.5,y:surf(N/2,N/2),z:N/2+.5};
const ui={mode:'inv',key:null,ch:null,fu:null},chests=new Map(),furns=new Map();
// 0-8 barra, 9-35 mochila, 36-39 armadura, 40 mano izq., 50-58 crafteo, 100-126 cofre, 130-132 horno
const inv=new Array(140).fill(null);
// ===== ítems =====
const IT={},ITM={},TOOL={},ARM={},ARMP={},AMAT={};let nid=100;
const item=(k,n,x)=>{ITM[k]=nid;IT[nid]=Object.assign({n},x||{});return nid++};
[['stick','Palo'],['coal','Carbón'],['ironIngot','Lingote de hierro'],['goldIngot','Lingote de oro'],['diamond','Diamante'],['string','Hilo'],['feather','Pluma'],['flint','Pedernal'],['arrow','Flecha'],['bone','Hueso'],['gunpowder','Pólvora'],['leather','Cuero'],
['apple','Manzana',{f:4}],['rawPork','Chuleta cruda',{f:3}],['cookedPork','Chuleta cocinada',{f:8}],['rawMutton','Cordero crudo',{f:2}],['cookedMutton','Cordero cocinado',{f:6}],['rawChicken','Pollo crudo',{f:2}],['cookedChicken','Pollo cocinado',{f:6}],['rawBeef','Ternera cruda',{f:3}],['cookedBeef','Filete',{f:8}],['rotten','Carne podrida',{f:4}],['bow','Arco']].forEach(a=>item(a[0],a[1],a[2]));
const MATS=[['wood','madera',2,59,0],['stone','piedra',4,131,1],['iron','hierro',6,250,2],['gold','oro',12,32,0],['diamond','diamante',8,1561,3]],DMG={pick:[2,3,4,2,5],axe:[7,9,9,7,9],shovel:[2.5,3.5,4.5,2.5,5.5],sword:[4,5,6,4,7]},TN={pick:['p','Pico'],axe:['a','Hacha'],shovel:['s','Pala'],sword:['w','Espada']};
MATS.forEach((m,i)=>{for(const k in TN){const id=item(m[0]+'_'+k,TN[k][1]+' de '+m[1]);TOOL[id]={y:TN[k][0],sp:k=='sword'?1:m[2],mx:m[3],lv:m[4],dm:DMG[k][i],mi:i}}});
const AMS=[['leather','cuero',[1,3,2,1],0x8b5a2b],['iron','hierro',[2,6,5,2],0xd8d8d8],['gold','oro',[2,5,3,1],0xf5d742],['diamond','diamante',[3,8,6,3],0x4de8e0]],APC=[['helmet','Casco'],['chest','Pechera'],['legs','Pantalones'],['boots','Botas']];
AMS.forEach((m,i)=>APC.forEach((p,j)=>{const id=item(m[0]+'_'+p[0],p[1]+' de '+m[1]);ARM[id]=36+j;ARMP[id]=m[2][j];AMAT[id]=i}));
const DUR=id=>TOOL[id]?TOOL[id].mx:id==ITM.bow?384:0,NM=id=>id<100?BK[id].n:IT[id].n;
const MC=['#b8924f','#9a9a9a','#e0e0e0','#f5d742','#4de8e0'],AC=AMS.map(m=>'#'+m[3].toString(16).padStart(6,'0')),isFood=id=>IT[id]&&IT[id].f!==undefined;
const armorPts=()=>[36,37,38,39].reduce((a,i)=>a+(inv[i]?ARMP[inv[i].id]||0:0),0);
// combustibles (segundos) y fundición (10 s por ítem)
const FUEL={[ITM.coal]:80,[B.log]:15,[B.planks]:15,[ITM.stick]:5,[B.slab]:7.5,[B.stair]:15,[B.fence]:15,[B.table]:15,[B.chest]:15};
const SMELT={[B.cobble]:{o:B.stone,c:1},[B.sand]:{o:B.glass,c:1},[B.iron]:{o:ITM.ironIngot,c:1},[B.gold]:{o:ITM.goldIngot,c:1},[ITM.rawPork]:{o:ITM.cookedPork,c:1},[ITM.rawMutton]:{o:ITM.cookedMutton,c:1},[ITM.rawChicken]:{o:ITM.cookedChicken,c:1},[ITM.rawBeef]:{o:ITM.cookedBeef,c:1},[B.log]:{o:ITM.coal,c:1}};
const getS=i=>i<100?inv[i]:i<130?(ui.ch?ui.ch[i-100]:null):(ui.fu?ui.fu[['i','f','o'][i-130]]:null);
const setS=(i,v)=>{if(i<100)inv[i]=v;else if(i<130){if(ui.ch)ui.ch[i-100]=v}else if(ui.fu)ui.fu[['i','f','o'][i-130]]=v};
function addItem(id,n){const mx=DUR(id),one=mx||ARM[id];if(!one)for(let i=0;i<36;i++){const s=inv[i];if(s&&s.id==id&&s.n<64){const m=Math.min(64-s.n,n);s.n+=m;n-=m;if(!n)return}}
while(n>0){let i=-1;for(let k=0;k<36;k++)if(!inv[k]){i=k;break}if(i<0)return;const m=one?1:Math.min(64,n);inv[i]=mx?{id,n:1,d:mx}:{id,n:m};n-=m}}
const count=id=>inv.reduce((a,s)=>a+(s&&s.id==id?s.n:0),0);
function giveBack(s){if(!s)return;if(s.d!==undefined||ARM[s.id]){const i=inv.slice(0,36).indexOf(null);if(i>=0)inv[i]=s}else addItem(s.id,s.n)}
// ===== recetas con forma (como Minecraft; también aceptan el espejo) =====
const K={L:B.log,P:B.planks,C:B.cobble,S:ITM.stick,H:ITM.leather,W:B.wool,I:ITM.ironIngot,G:ITM.goldIngot,D:ITM.diamond,T:ITM.string,F:ITM.feather,K:ITM.flint,O:ITM.coal,N:B.stone};
const REC=[],rc=(o,c,p)=>REC.push({o,c,p});
rc(B.planks,4,['L']);rc(ITM.stick,4,['P','P']);rc(B.table,1,['PP','PP']);rc(B.chest,1,['PPP','P P','PPP']);rc(B.furnace,1,['CCC','C C','CCC']);
rc(B.torch,4,['O','S']);rc(B.door,3,['PP','PP','PP']);rc(B.fence,3,['PSP','PSP']);rc(B.slab,6,['PPP']);rc(B.cslab,6,['CCC']);
rc(B.stair,4,['P  ','PP ','PPP']);rc(B.cstair,4,['C  ','CC ','CCC']);rc(B.sbrick,4,['NN','NN']);rc(B.bed,1,['WWW','PPP']);
rc(B.camp,1,[' S ','SOS','LLL']);rc(ITM.bow,1,[' ST','S T',' ST']);rc(ITM.arrow,4,['K','S','F']);
['P','C','I','G','D'].forEach((L,i)=>{const m=MATS[i][0];rc(ITM[m+'_pick'],1,[L+L+L,' S ',' S ']);rc(ITM[m+'_axe'],1,[L+L,L+'S',' S']);rc(ITM[m+'_shovel'],1,[L,'S','S']);rc(ITM[m+'_sword'],1,[L,L,'S'])});
['H','I','G','D'].forEach((L,i)=>{const m=AMS[i][0];rc(ITM[m+'_helmet'],1,[L+L+L,L+' '+L]);rc(ITM[m+'_chest'],1,[L+' '+L,L+L+L,L+L+L]);rc(ITM[m+'_legs'],1,[L+L+L,L+' '+L,L+' '+L]);rc(ITM[m+'_boots'],1,[L+' '+L,L+' '+L])});
function match(){let r0=9,c0=9,r1=-1,c1=-1;for(let r=0;r<cgs;r++)for(let c=0;c<cgs;c++)if(inv[50+r*3+c]){r0=Math.min(r0,r);c0=Math.min(c0,c);r1=Math.max(r1,r);c1=Math.max(c1,c)}
if(r1<0)return null;const h=r1-r0+1,w=c1-c0+1;
for(const rc of REC){if(rc.p.length!=h||rc.p[0].length!=w)continue;for(const fl of[0,1]){let ok=true;for(let r=0;r<h&&ok;r++)for(let c=0;c<w;c++){const ch=rc.p[r][fl?w-1-c:c],it=inv[50+(r0+r)*3+c0+c];if((it?it.id:0)!=(ch==' '?0:K[ch])){ok=false;break}}if(ok)return rc}}return null}
function takeResult(){const rc=match();if(!rc)return;addItem(rc.o,rc.c);for(let r=0;r<cgs;r++)for(let c=0;c<cgs;c++){const i=50+r*3+c,s=inv[i];if(s&&--s.n<=0)inv[i]=null}renderUI()}
// ===== iconos dibujados con píxeles =====
function icon(id){const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d'),f=(col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h)};
if(id<100){x.drawImage(atl,BK[id].t[1]*16,0,16,16,0,0,16,16);return c}
const tl=TOOL[id];
if(tl){for(let i=0;i<10;i++)f('#6b4a26',3+i,12-i,2,2);const col=MC[tl.mi];if(tl.y=='p'){f(col,4,2,9,2);f(col,3,3,2,3);f(col,12,3,2,3)}else if(tl.y=='a')f(col,8,2,5,5);else if(tl.y=='s')f(col,9,2,4,4);else{for(let i=3;i<10;i++)f(col,3+i,12-i,3,3);f('#6b4a26',3,10,5,2)}return c}
if(ARM[id]){const col=AC[AMAT[id]],j=ARM[id]-36;(j==0?[[3,3,10,5],[3,8,3,4],[10,8,3,4]]:j==1?[[3,3,10,10],[1,3,3,6],[12,3,3,6]]:j==2?[[3,2,10,5],[3,7,4,7],[9,7,4,7]]:[[2,8,4,5],[10,8,4,5]]).forEach(a=>f(col,a[0],a[1],a[2],a[3]));if(j==1)x.clearRect(6,3,4,2);return c}
const k=Object.keys(ITM).find(q=>ITM[q]==id);
switch(k){
case'stick':for(let i=0;i<11;i++)f('#7a5a2a',2+i,13-i,2,2);break;
case'coal':f('#222',4,5,8,7);f('#444',5,6,3,2);break;
case'ironIngot':f('#d8d8d8',3,6,10,5);f('#fff',4,6,8,1);f('#8a8a8a',3,10,10,1);break;
case'goldIngot':f('#f5d742',3,6,10,5);f('#fff3a0',4,6,8,1);f('#b89a1a',3,10,10,1);break;
case'diamond':f('#4de8e0',5,3,6,2);f('#4de8e0',3,5,10,4);f('#4de8e0',5,9,6,2);f('#bffcf8',5,5,3,2);f('#2aa8a2',7,11,2,1);break;
case'string':f('#f0f0f0',3,5,10,1);f('#f0f0f0',3,8,10,1);f('#ddd',3,11,10,1);f('#f0f0f0',3,5,1,7);break;
case'feather':for(let i=0;i<9;i++)f('#f4f4f4',4+i,11-i,2,2);f('#cfcfcf',3,12,3,2);break;
case'flint':f('#3a3a3a',5,5,7,7);f('#5a5a5a',6,6,3,3);break;
case'arrow':for(let i=0;i<9;i++)f('#8b6a3a',3+i,12-i,1,1);f('#aaa',12,2,3,3);f('#eee',2,11,3,3);break;
case'bone':for(let i=0;i<8;i++)f('#f0e6d2',4+i,11-i,2,2);f('#f0e6d2',3,11,3,3);f('#f0e6d2',11,3,3,3);break;
case'gunpowder':f('#6a6a6a',4,6,8,6);f('#8a8a8a',5,7,3,3);f('#444',9,9,3,2);break;
case'leather':f('#8a5a2b',3,3,10,10);f('#a8733c',4,4,8,8);f('#6b4420',3,3,10,1);f('#6b4420',3,12,10,1);break;
case'apple':f('#c81e1e',4,5,8,7);f('#c81e1e',5,4,6,9);f('#ff6a6a',5,6,2,2);f('#4a2a10',8,2,1,3);f('#3da832',9,2,3,2);break;
case'rawPork':f('#e89a9a',3,5,10,7);f('#f5c4c4',4,6,5,3);break;case'cookedPork':f('#a9642f',3,5,10,7);f('#c98a50',4,6,5,3);break;
case'rawMutton':f('#c45a5a',3,5,10,7);f('#e89a9a',4,6,4,3);break;case'cookedMutton':f('#8a4a2a',3,5,10,7);f('#b0703f',4,6,4,3);break;
case'rawChicken':f('#f0c8b0',4,4,8,8);f('#fae4d6',5,5,4,3);f('#f0e6d2',11,10,3,3);break;case'cookedChicken':f('#d89a50',4,4,8,8);f('#f0bf75',5,5,4,3);f('#f0e6d2',11,10,3,3);break;
case'rawBeef':f('#b04040',3,5,10,7);f('#e07070',4,6,5,3);break;case'cookedBeef':f('#7a3a1a',3,5,10,7);f('#a8612f',4,6,5,3);break;
case'rotten':f('#7a8a3a',3,5,10,7);f('#a8b85a',4,6,4,3);f('#5a6a2a',9,9,3,2);break;
case'bow':for(let y=2;y<14;y++){f('#7a5a2a',5+Math.round((1-Math.sin((y-2)/11*Math.PI))*5),y,2,1);f('#eee',12,y,1,1)}f('#a07a3a',5,8,3,1);break}
return c}
const mk=(t,c)=>{const e=document.createElement(t);if(c)e.className=c;return e};
function slot(i){const d=mk('div','sl'),it=getS(i);if(it){d.appendChild(icon(it.id));if(it.n>1){const s=mk('span');s.textContent=it.n;d.appendChild(s)}if(it.d!==undefined){const b=mk('i');b.style.width=Math.round(it.d/DUR(it.id)*26)+'px';d.appendChild(b)}}return d}
function tap(i,one){const s=getS(i),ar=i>=36&&i<40,gr=i>=50&&i<60;
if(i==132&&cur){if(s&&s.id==cur.id&&cur.d===undefined&&cur.n+s.n<=64){cur.n+=s.n;setS(i,null);renderUI()}return}
if(ar&&cur&&ARM[cur.id]!=i)return;
if(!cur){if(s){cur=s;setS(i,null)}}
else if(!s){if(cur.n>1&&(one||gr)&&!ar){setS(i,{id:cur.id,n:1});cur.n--}else{setS(i,cur);cur=null}}
else if(s.id==cur.id&&s.d===undefined&&!ARM[s.id]){const m=Math.min(64-s.n,(one||gr)?1:cur.n);s.n+=m;cur.n-=m;if(cur.n<=0)cur=null}
else{setS(i,cur);cur=s}
renderUI()}
// personaje (medidas de Minecraft: 1,8 de alto) y brazo en primera persona
const bm=c=>[.8,.8,1,.5,.7,.7].map(s=>new THREE.MeshBasicMaterial({color:new THREE.Color(c).multiplyScalar(s)}));
const ontop=o=>{o.traverse(m=>{if(m.isMesh){m.renderOrder=10;(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>{x.depthTest=false;x.fog=false})}});return o};
function face(){const c=document.createElement('canvas');c.width=c.height=8;const x=c.getContext('2d');x.fillStyle='#c68b59';x.fillRect(0,0,8,8);x.fillStyle='#3b2a1a';x.fillRect(0,0,8,2);x.fillRect(0,2,1,1);x.fillRect(7,2,1,1);x.fillStyle='#fff';x.fillRect(1,4,2,1);x.fillRect(5,4,2,1);x.fillStyle='#4a3aa8';x.fillRect(2,4,1,1);x.fillRect(5,4,1,1);x.fillStyle='#8a5a3c';x.fillRect(3,6,2,1);const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t}
function makePlayer(){const g=new THREE.Group(),r=new THREE.Group();r.scale.setScalar(.9);g.add(r);
const mesh=(w,h,d,m,y)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.y=y;return o};
const pivot=(x,y)=>{const p=new THREE.Group();p.position.set(x,y,0);r.add(p);return p};
r.add(mesh(.5,.75,.25,bm(0x00a8a8),1.125));
const head=pivot(0,1.5),hm=bm(0xc68b59),hair=bm(0x3b2a1a);hm[4]=new THREE.MeshBasicMaterial({map:face()});hm[2]=hair[2];hm[5]=hair[5];head.add(mesh(.5,.5,.5,hm,.25));
const limb=(x,c)=>{const p=pivot(x,.75);p.add(mesh(.25,.75,.25,bm(c),-.375));return p};
const ll=limb(-.125,0x3a3a8a),rl=limb(.125,0x3a3a8a),la=pivot(-.375,1.5),ra=pivot(.375,1.5);
[la,ra].forEach(a=>{a.add(mesh(.25,.75,.25,bm(0xc68b59),-.375));a.add(mesh(.26,.35,.26,bm(0x00a8a8),-.175))});
const ov=(p,w,h,d,y,c)=>{const o=mesh(w,h,d,bm(c),y);o.visible=false;p.add(o);return o};
const A={h:ov(head,.56,.56,.56,.25,0x8b5a2b),c:ov(r,.56,.8,.31,1.125,0x8b5a2b),l:[ll,rl].map(p=>ov(p,.29,.5,.29,-.25,0x8b5a2b)),b:[ll,rl].map(p=>ov(p,.29,.25,.29,-.625,0x5a3a1a))};
return{g,head,ll,rl,la,ra,arm(){const sh=[.8,.8,1,.5,.7,.7],set=(o,q)=>{o.visible=!!q;if(q){const hx=AMS[AMAT[q.id]][3];o.material.forEach((mt,i)=>mt.color.setHex(hx).multiplyScalar(sh[i]))}};set(A.h,inv[36]);set(A.c,inv[37]);A.l.forEach(o=>set(o,inv[38]));A.b.forEach(o=>set(o,inv[39]))}}}
function pose(m,ph,a,s,pt){const q=Math.sin(ph*.5)*.9*a;m.ll.rotation.x=q;m.rl.rotation.x=-q;m.la.rotation.x=-q;m.ra.rotation.x=s>=0?-Math.sin(s*Math.PI)*1.8:q;m.head.rotation.x=-pt}
const mm=makePlayer();mm.g.visible=false;scene.add(mm.g);
const hand=new THREE.Group(),hroot=new THREE.Group(),held=new THREE.Group();
const sk=(()=>{const c=mk('canvas');c.width=c.height=8;const x=c.getContext('2d');for(let i=0;i<8;i++)for(let j=0;j<8;j++){const v=.9+rnd()*.2;x.fillStyle='rgb('+Math.round(198*v)+','+Math.round(139*v)+','+Math.round(89*v)+')';x.fillRect(i,j,1,1)}const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t})();
const arm1=new THREE.Mesh(new THREE.BoxGeometry(.3,.3,1),[.8,.8,1,.55,.75,.75].map(v=>new THREE.MeshBasicMaterial({map:sk,color:new THREE.Color(v,v,v)})));arm1.position.z=.2;
hand.add(arm1,held);held.position.set(0,.22,-.36);hand.rotation.set(.28,.5,-.1);
hroot.add(hand);cam.add(ontop(hroot));scene.add(cam);
const tc={};function tileTex(ti){if(!tc[ti]){const c=mk('canvas');c.width=c.height=16;c.getContext('2d').drawImage(atl,ti*16,0,16,16,0,0,16,16);const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;tc[ti]=t}return tc[ti]}
function updHeld(){while(held.children.length)held.remove(held.children[0]);const it=inv[sel];if(!it)return;let m;
if(it.id<100&&!BK[it.id].sh){const t=BK[it.id].t,mt=ti=>new THREE.MeshBasicMaterial({map:tileTex(ti),alphaTest:.5});m=new THREE.Mesh(new THREE.BoxGeometry(.3,.3,.3),[mt(t[1]),mt(t[1]),mt(t[0]),mt(t[2]),mt(t[1]),mt(t[1])]);m.position.set(0,.05,-.05);m.rotation.set(.3,.7,0)}
else{const tx=new THREE.CanvasTexture(icon(it.id));tx.magFilter=tx.minFilter=THREE.NearestFilter;m=new THREE.Mesh(new THREE.PlaneGeometry(.5,.5),new THREE.MeshBasicMaterial({map:tx,transparent:true,alphaTest:.5,side:THREE.DoubleSide}));m.position.set(0,.18,-.05);m.rotation.set(0,-.5,.1)}
held.add(ontop(m))}
// vista previa del personaje en el inventario
const pr=new THREE.WebGLRenderer({alpha:true});pr.setPixelRatio(1);pr.setSize(110,150);pr.domElement.style.cssText='width:110px;height:150px;display:block';
const ps=new THREE.Scene(),pc=new THREE.PerspectiveCamera(30,110/150,.1,30),pm=makePlayer();ps.add(pm.g);pc.position.set(0,1,5.2);pc.lookAt(0,.95,0);
// interfaz
const bar=$('bar'),nm=$('nm');let furnRT=0;
function renderUI(){bar.innerHTML='';for(let i=0;i<9;i++){const d=slot(i);if(i==sel)d.classList.add('on');d.onpointerdown=e=>{e.stopPropagation();sel=i;eq=.8;renderUI()};bar.appendChild(d)}
const dd=mk('div','sl dots');dd.textContent='•••';dd.onpointerdown=e=>{e.stopPropagation();e.preventDefault();openInv(2)};bar.appendChild(dd);
const it=inv[sel];nm.textContent=it?NM(it.id):inv.slice(0,36).every(s=>!s)?'Mantén pulsado sobre un tronco para conseguir madera':'';if(invOpen)renderInv();updHeld();mm.arm();pm.arm()}
const tp=(d,i,ph)=>{d.onpointerdown=e=>{e.preventDefault();tap(i,e.button==2)};d.oncontextmenu=e=>e.preventDefault();if(ph)d.dataset.ph=ph;return d};
function renderInv(){const p=$('inv');p.innerHTML='';const m=ui.mode;
const hd=mk('div');hd.innerHTML='<b>'+({inv:'Inventario',table:'Mesa de crafteo',chest:'Cofre',furn:'Horno'})[m]+'</b><span id="xx" style="float:right;padding:0 6px;font-weight:bold">✕</span>';p.appendChild(hd);$('xx').onpointerdown=closeInv;
if(m=='inv'||m=='table'){
const top=mk('div','top'),ar=mk('div','col');[36,37,38,39].forEach((i,k)=>ar.appendChild(tp(slot(i),i,['Cab','Pec','Pie','Bot'][k])));
const pv=mk('div','col'),pw=mk('div','pv');pw.appendChild(pr.domElement);pv.appendChild(pw);pv.appendChild(tp(slot(40),40,'Mano'));
const cr=mk('div','cr'),gd=mk('div','cg');gd.style.gridTemplateColumns='repeat('+cgs+',34px)';for(let r=0;r<cgs;r++)for(let c=0;c<cgs;c++)gd.appendChild(tp(slot(50+r*3+c),50+r*3+c));
const res=match(),rs=mk('div','sl');if(res){rs.appendChild(icon(res.o));if(res.c>1){const s=mk('span');s.textContent=res.c;rs.appendChild(s)}}rs.onpointerdown=e=>{e.preventDefault();takeResult()};
const arrow=mk('div');arrow.textContent='→';cr.append(gd,arrow,rs);top.append(ar,pv,cr);p.appendChild(top)}
else if(m=='chest'){const g0=mk('div','g');for(let i=0;i<27;i++)g0.appendChild(tp(slot(100+i),100+i));p.appendChild(g0)}
else{const F=ui.fu,t=mk('div','top'),c1=mk('div','col'),b1=mk('div'),b2=mk('div');
b1.style.cssText='width:34px;height:6px;background:#555';b1.innerHTML='<i style="display:block;height:100%;width:'+(F.bmax>0?Math.max(0,F.burn/F.bmax)*100:0)+'%;background:#f90"></i>';
c1.append(tp(slot(130),130),b1,tp(slot(131),131));
b2.style.cssText='width:44px;height:8px;background:#555;align-self:center';b2.innerHTML='<i style="display:block;height:100%;width:'+Math.min(100,F.cook/10*100)+'%;background:#fff"></i>';
t.append(c1,b2,tp(slot(132),132));p.appendChild(t)}
const g=mk('div','g');for(let i=9;i<36;i++)g.appendChild(tp(slot(i),i));p.appendChild(g);
const h2=mk('div','g');h2.style.marginTop='8px';for(let i=0;i<9;i++)h2.appendChild(tp(slot(i),i));p.appendChild(h2);
const cb=mk('div','cb');if(cur){cb.append('En la mano: ');cb.appendChild(icon(cur.id));cb.append(' ×'+cur.n+' '+NM(cur.id))}else cb.textContent=m=='inv'||m=='table'?'Toca un objeto y luego un espacio. En el crafteo se suelta de 1 en 1; toca el resultado para tomarlo.':'Toca un objeto y luego un espacio para moverlo.';p.appendChild(cb);
if(m=='inv'){const tot=Object.keys(MOBW).reduce((a,k)=>a+MOBW[k],0),nz={zombie:'Zombi',skeleton:'Esqueleto con arco',spider:'Araña',creeper:'Creeper'},sp=mk('div','cb');sp.style.fontSize='11px';
sp.textContent='Probabilidad de aparición de enemigos: '+Object.keys(MOBW).map(k=>nz[k]+' '+Math.round(MOBW[k]/tot*100)+'%').join(' · ')+'. Todos los esqueletos llevan arco y lo sueltan el 8,5% de las veces.';p.appendChild(sp)}}
function openCommon(){invOpen=true;holdFn=null;stopMine();$('inv').style.display='block';document.exitPointerLock&&document.exitPointerLock();renderUI()}
function openInv(g){ui.mode=g==3?'table':'inv';cgs=g==3?3:2;ui.ch=ui.fu=null;openCommon()}
function openChest(x,y,z){const k=x+','+y+','+z;let ch=chests.get(k);if(!ch){ch=new Array(27).fill(null);chests.set(k,ch)}ui.mode='chest';ui.ch=ch;ui.fu=null;openCommon()}
function openFurn(x,y,z){const k=x+','+y+','+z;let fu=furns.get(k);if(!fu){fu={i:null,f:null,o:null,burn:0,bmax:0,cook:0};furns.set(k,fu)}ui.mode='furn';ui.fu=fu;ui.ch=null;openCommon()}
function closeInv(){for(let i=50;i<59;i++){giveBack(inv[i]);inv[i]=null}giveBack(cur);cur=null;ui.ch=ui.fu=null;ui.mode='inv';invOpen=false;$('inv').style.display='none';renderUI()}
// el horno sigue fundiendo aunque esté cerrado
function furnTick(dt){furns.forEach(F=>{const rec=F.i&&SMELT[F.i.id],room=rec&&(!F.o||(F.o.id==rec.o&&F.o.n<64));
if(room){if(F.burn<=0&&F.f&&FUEL[F.f.id]){F.bmax=F.burn=FUEL[F.f.id];if(--F.f.n<=0)F.f=null}
if(F.burn>0){F.cook+=dt;if(F.cook>=10){F.cook=0;if(F.o)F.o.n+=rec.c;else F.o=DUR(rec.o)?{id:rec.o,n:1,d:DUR(rec.o)}:{id:rec.o,n:rec.c};if(--F.i.n<=0)F.i=null}}else F.cook=Math.max(0,F.cook-dt*2)}else F.cook=0;
if(F.burn>0)F.burn-=dt})}
renderUI();
const dirv=()=>new THREE.Vector3(-Math.sin(R.yaw)*Math.cos(R.pitch),Math.sin(R.pitch),-Math.cos(R.yaw)*Math.cos(R.pitch));
function ray(){const d=dirv();let last=null;for(let t=0;t<5;t+=.04){const x=Math.floor(P.x+d.x*t),y=Math.floor(P.y+eyeH+d.y*t),z=Math.floor(P.z+d.z*t);if(get(x,y,z))return{h:[x,y,z],l:last};if(!last||last[0]!=x||last[1]!=y||last[2]!=z)last=[x,y,z]}return null}
// animales con las caras de Minecraft
function px(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');for(let j=0;j<h;j++)for(let i=0;i<w;i++){const col=fn(i,j);if(col){x.fillStyle=col;x.fillRect(i,j,1,1)}}const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t}
const jc=(r,g,b,v)=>{const k=1+(rnd()-.5)*v;return 'rgb('+Math.round(r*k)+','+Math.round(g*k)+','+Math.round(b*k)+')'};
const tcache={},tx=(k,w,h,fn)=>tcache[k]||(tcache[k]=px(w,h,fn));
const LMT=(t,e)=>new THREE.MeshLambertMaterial({map:t,emissive:e||0}),LMC=(c,e)=>new THREE.MeshLambertMaterial({color:c,emissive:e||0});
const eb=(g,w,h,d,m,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);g.add(o);return o};
const m6=(s,t,f)=>[s,s,t,s,f,s],pvt=(p,x,y,z)=>{const q=new THREE.Group();q.position.set(x,y,z);p.add(q);return q};
const leg=(g,w,h,col,x,z,top)=>{const p=pvt(g,x,top,z);eb(p,w,h,w,LMC(col),0,-h/2,0);return p};
const L4=(g,w,h,col,dx,dz)=>[[-1,1],[1,1],[-1,-1],[1,-1]].map(s=>leg(g,w,h,col,s[0]*dx,s[1]*dz,h));
// velocidad de caminata aproximada a partir del atributo de Minecraft (0.25 → 4 bloques/s)
const spd=a=>63.8*a*a;
const SP={
pig:{hw:.45,h:.9,sp:spd(.25),mk(g){const b=LMT(tx('pigB',8,8,()=>jc(240,165,165,.12))),fc=LMT(tx('pigF',8,8,(i,j)=>{if(j==3&&(i==1||i==6))return'#1a1a1a';if(j==3&&(i==2||i==5))return'#fff';return jc(240,165,165,.1)})),sn=LMT(tx('pigS',4,3,(i,j)=>j==1&&(i==1||i==2)?'#6a2a2a':jc(228,140,140,.1)));
eb(g,.6,.55,.95,b,0,.65,0);eb(g,.5,.5,.5,m6(b,b,fc),0,.7,.72);eb(g,.25,.19,.08,sn,0,.62,1);return L4(g,.22,.375,0xe59a9a,.18,.3)}},
sheep:{hw:.45,h:1.3,sp:spd(.23),mk(g){const w=LMT(tx('shW',8,8,()=>jc(240,240,240,.1))),s=LMT(tx('shS',8,8,()=>jc(200,180,160,.1))),fc=LMT(tx('shF',8,8,(i,j)=>{if(j==3&&(i==1||i==6))return'#2a2a2a';if(j==3&&(i==2||i==5))return'#fff';if(j>=5&&j<=6&&i>=3&&i<=4)return'#d9a8a0';return jc(200,180,160,.08)}));
eb(g,.8,.62,1,w,0,.96,0);eb(g,.4,.4,.4,m6(s,s,fc),0,1.07,.68);eb(g,.44,.14,.44,w,0,1.3,.6);return L4(g,.2,.65,0xcfc0a8,.2,.3)}},
chicken:{hw:.2,h:.7,sp:spd(.25),mk(g){const w=LMT(tx('chW',8,8,()=>jc(244,244,244,.06))),hf=LMT(tx('chF',8,8,(i,j)=>j==3&&(i==1||i==6)?'#111':jc(244,244,244,.04)));
eb(g,.32,.3,.45,w,0,.4,0);eb(g,.18,.24,.18,m6(w,w,hf),0,.58,.2);eb(g,.1,.06,.1,LMC(0xf5c542),0,.55,.33);eb(g,.06,.1,.04,LMC(0xd23030),0,.47,.31);eb(g,.04,.2,.3,LMC(0xe0e0e0),.18,.42,0);eb(g,.04,.2,.3,LMC(0xe0e0e0),-.18,.42,0);return[-1,1].map(s=>leg(g,.06,.25,0xf0a020,s*.07,0,.25))}},
cow:{hw:.45,h:1.4,sp:spd(.2),mk(g){const b=LMT(tx('cowB',8,8,(i,j)=>((i*7+j*3)%5<2)?jc(240,240,240,.05):jc(70,50,40,.15))),s=LMT(tx('cowS',8,8,()=>jc(90,65,50,.12))),fc=LMT(tx('cowF',8,8,(i,j)=>{if(j==3&&(i==1||i==6))return'#111';if(j>=5&&i>=2&&i<=5)return'#d8c8b8';return jc(90,65,50,.1)}));
eb(g,.7,.7,1.2,b,0,.95,0);eb(g,.5,.5,.45,m6(s,s,fc),0,1.15,.8);eb(g,.08,.2,.08,LMC(0xe8e0c8),-.28,1.45,.78);eb(g,.08,.2,.08,LMC(0xe8e0c8),.28,1.45,.78);return L4(g,.2,.6,0x5a4030,.25,.4)}}};
const animals=[];
function spawn(type){for(let i=0;i<80;i++){const x=6+wr()*(N-12),z=6+wr()*(N-12),y=surf(x,z);if(get(Math.floor(x),y-1,Math.floor(z))!=1)continue;
const s=SP[type],g=new THREE.Group(),legs=s.mk(g);scene.add(g);animals.push({type,s,g,legs,x,y,z,vy:0,hp:type=='chicken'?4:10,dead:0,sx:x,sz:z,yaw:wr()*6.28,t:0,mv:false,ph:0,flee:0,on:false});return}}
['pig','sheep','chicken','cow'].forEach(t=>{for(let i=0;i<12;i++)spawn(t)});
function upd(a,dt){const s=a.s;a.t-=dt;a.flee-=dt;if(a.t<=0){a.mv=Math.random()<.35;a.yaw=Math.random()*6.28;a.t=3+Math.random()*5}
const sp=s.sp*(a.flee>0?1.5:1);
if(a.mv){const dx=Math.sin(a.yaw)*sp*dt,dz=Math.cos(a.yaw)*sp*dt;
a.x+=dx;if(sol(a.x,a.y,a.z,s.hw,s.h)){a.x-=dx;if(a.on)a.vy=8.2;else a.t=0}
a.z+=dz;if(sol(a.x,a.y,a.z,s.hw,s.h)){a.z-=dz;if(a.on)a.vy=8.2;else a.t=0}}
a.vy=Math.max(a.type=='chicken'?-2.5:-40,a.vy-32*dt);a.on=false;a.y+=a.vy*dt;
if(sol(a.x,a.y,a.z,s.hw,s.h)){a.y-=a.vy*dt;if(a.vy<0)a.on=true;a.vy=0}
if(a.y<-5)a.y=surf(a.x,a.z);
if(a.mv){a.ph+=dt*8*(a.flee>0?1.6:1);a.legs.forEach((l,i)=>l.rotation.x=Math.sin(a.ph)*.6*(i==0||i==3?1:-1))}else a.legs.forEach(l=>l.rotation.x=0);
a.g.position.set(a.x,a.y,a.z);a.g.rotation.y=a.yaw}
// golpes: se apunta a la caja del animal o enemigo (hasta 3,2 bloques)
function hit(){const d=dirv(),e=new THREE.Vector3(P.x,P.y+eyeH,P.z);let best=null,bd=3.2;
for(const a of animals.concat(mobs)){if(a.dead)continue;const hw=a.s.hw+.1,lo=[a.x-hw,a.y,a.z-hw],hi=[a.x+hw,a.y+a.s.h,a.z+hw],o=[e.x,e.y,e.z],dd=[d.x,d.y,d.z];let t0=0,t1=bd;
for(let i=0;i<3;i++){if(Math.abs(dd[i])<1e-6){if(o[i]<lo[i]||o[i]>hi[i]){t1=-1;break}}else{let p1=(lo[i]-o[i])/dd[i],p2=(hi[i]-o[i])/dd[i];if(p1>p2){const tt=p1;p1=p2;p2=tt}t0=Math.max(t0,p1);t1=Math.min(t1,p2);if(t0>t1)break}}
if(t1>=t0&&t1>=0&&t0<bd){bd=t0;best=a}}
const rb=ray();if(best&&rb){const bl=Math.hypot(rb.h[0]+.5-e.x,rb.h[1]+.5-e.y,rb.h[2]+.5-e.z)-.5;if(bl<bd-.3)best=null}
if(!best)return false;const it=inv[sel],tl=it&&TOOL[it.id];hurtEntity(best,tl?tl.dm:1,P.x,P.z);if(tl){if(--it.d<=0)inv[sel]=null;renderUI()}return true}
// romper (tiempos de Minecraft), poner, interactuar y arco
function startMine(){if(invOpen)return;const it=inv[sel];if(it&&it.id==ITM.bow){startDraw();return}if(hit()){sw=0;return}mining=true}
function stopMine(){mining=false;mine={x:-1,y:0,z:0,p:0,t:0};if(drawing)relBow()}
const bcc={};function bcol(t){if(bcc[t]!==undefined)return bcc[t];let c=0x888888;try{const d=BK[t],dt=ctx.getImageData(d.t[1]*16+6,6,4,4).data;let r=0,g=0,b=0,n=0;for(let i=0;i<dt.length;i+=4)if(dt[i+3]>0){r+=dt[i];g+=dt[i+1];b+=dt[i+2];n++}if(n)c=((r/n|0)<<16)|((g/n|0)<<8)|(b/n|0)}catch(e){}return bcc[t]=c}
const pg=new THREE.BoxGeometry(.1,.1,.1),pcs=[],pmat={};
function burst(x,y,z,t,n){const col=t<0?0xff7a18:bcol(t),m=pmat[col]||(pmat[col]=new THREE.MeshBasicMaterial({color:col}));for(let i=0;i<n;i++){const o=new THREE.Mesh(pg,m);o.position.set(x+Math.random(),y+Math.random(),z+Math.random());o.userData={v:new THREE.Vector3((Math.random()-.5)*3,Math.random()*3+1,(Math.random()-.5)*3),l:.7};scene.add(o);pcs.push(o)}while(pcs.length>150)scene.remove(pcs.shift())}
const canHarvest=(t,tl)=>{const l=BK[t].l;return l<0||(tl&&tl.y=='p'&&tl.lv>=l)};
function dropsOf(t){const c=CAN[t]||t,r=Math.random();
if(c==1)return[[2,1]];if(c==3)return[[8,1]];if(c==5)return r<.05?[[ITM.apple,1]]:r<.13?[[ITM.stick,1+(Math.random()*2|0)]]:[];
if(c==9||c==45)return[];if(c==40)return r<.1?[[ITM.flint,1]]:[[40,1]];if(c==41)return[[ITM.coal,1]];if(c==44)return[[ITM.diamond,1]];
return[[c,1]]}
function dig(x,y,z){const t=get(x,y,z),d=BK[t],it=inv[sel],tl=it&&TOOL[it.id];if(!d||d.h<0)return;burst(x,y,z,t,14);exh+=.025;
const ok=canHarvest(t,tl);let drops=ok?dropsOf(t):[];
if(t>=60&&t<=63){const lo=(t==60||t==61)?y:y-1;edit(x,lo,z,0,true);edit(x,lo+1,z,0,true);drops=ok?[[60,1]]:[]}
else{const k=x+','+y+','+z;
if(t==B.chest){const ch=chests.get(k);if(ch){ch.forEach(s=>s&&giveBack(s));chests.delete(k)}}
if(t==B.furnace){const fu=furns.get(k);if(fu){[fu.i,fu.f,fu.o].forEach(s=>s&&giveBack(s));furns.delete(k)}}
edit(x,y,z,0,true)}
drops.forEach(a=>addItem(a[0],a[1]));if(ok&&t==B.coal)gainXp(1);if(ok&&t==B.diamond)gainXp(3);
if(tl&&d.h>0&&--it.d<=0)inv[sel]=null;renderUI()}
function toggleDoor(x,y,z){const t=get(x,y,z),lo=(t==60||t==61)?y:y-1,a=get(x,lo,z),b=get(x,lo+1,z);if(a!=60&&a!=61)return;edit(x,lo,z,a==60?61:60,true);edit(x,lo+1,z,b==62?63:62,true)}
function eat(it){food=Math.min(20,food+IT[it.id].f);if(--it.n<=0)inv[sel]=null;sw=0;renderUI();hud()}
function plc(){if(invOpen||dead>0)return;const it=inv[sel];if(it&&it.id==ITM.bow){startDraw();return}
const r=ray();
if(r&&!snk){const[hx,hy,hz]=r.h,t=get(hx,hy,hz);
if(t==B.table){openInv(3);return}if(t==B.chest){openChest(hx,hy,hz);return}if(t==B.furnace){openFurn(hx,hy,hz);return}
if(t>=60&&t<=63){toggleDoor(hx,hy,hz);sw=0;return}
if(t==B.bed){SPN.x=hx+.5;SPN.y=hy+.6;SPN.z=hz+.5;nm.textContent='Punto de reaparición establecido';return}
if(t==B.camp&&it&&SMELT[it.id]&&isFood(it.id)){const sm=SMELT[it.id];if(--it.n<=0)inv[sel]=null;addItem(sm.o,1);sw=0;renderUI();return}}
if(it&&isFood(it.id)&&food<20){eat(it);return}
if(!it||it.id>=100||!r||!r.l)return;
const[x,y,z]=r.l,nx=x-r.h[0],ny=y-r.h[1],nz=z-r.h[2];if(x<0||z<0||x>=N||z>=N||y<0||y>=H-1)return;
let id=it.id;const fx=-Math.sin(R.yaw),fz=-Math.cos(R.yaw);
if(id==B.torch){if(ny==1){const b=get(x,y-1,z);if(!b||BK[b].sh)return}else if(ny==0)id=nx==1?72:nx==-1?73:nz==1?74:75;else return}
if(id==B.door){if(get(x,y+1,z)||y+2>=H)return;id=Math.abs(fz)>=Math.abs(fx)?60:61}
if(id==B.stair||id==B.cstair)id+=Math.abs(fx)>Math.abs(fz)?(fx>0?0:1):(fz>0?2:3);
put(x,y,z,id);const col=!BK[id].ns&&(sol(P.x,P.y,P.z,.3,1.8)||animals.some(a=>Math.abs(a.x-x-.5)<a.s.hw+.5&&Math.abs(a.z-z-.5)<a.s.hw+.5&&a.y<y+1&&a.y+a.s.h>y)||mobs.some(a=>Math.abs(a.x-x-.5)<a.s.hw+.5&&Math.abs(a.z-z-.5)<a.s.hw+.5&&a.y<y+1&&a.y+a.s.h>y));put(x,y,z,0);if(col)return;
edit(x,y,z,id,true);if(it.id==B.door)edit(x,y+1,z,id+2,true);
sw=0;if(--it.n<=0)inv[sel]=null;renderUI()}
// ===== arco: mantener clic derecho (o mantener el toque) para tensar y soltar para disparar =====
let drawing=false,drawT=0;const parrows=[],arrowGeo=new THREE.BoxGeometry(.05,.05,.6),arrowMat=new THREE.MeshBasicMaterial({color:0x8b6a3a});
function startDraw(){if(!drawing){drawing=true;drawT=0}}
function relBow(){if(!drawing)return;drawing=false;const it=inv[sel];if(!it||it.id!=ITM.bow||dead>0){drawT=0;return}const ch=Math.min(1,(drawT*drawT+2*drawT)/3);drawT=0;if(ch<.1)return;
const ai=inv.slice(0,36).findIndex(s=>s&&s.id==ITM.arrow);if(ai<0){nm.textContent='Necesitas flechas';return}
const s=inv[ai];if(--s.n<=0)inv[ai]=null;if(--it.d<=0)inv[sel]=null;renderUI();
const d=dirv(),v=60*ch,o=new THREE.Mesh(arrowGeo,arrowMat);scene.add(o);parrows.push({o,p:new THREE.Vector3(P.x+d.x*.5,P.y+eyeH-.1+d.y*.5,P.z+d.z*.5),v:new THREE.Vector3(d.x*v,d.y*v,d.z*v),l:5,dm:Math.ceil(v/10)});sw=0}
function arrowsTick(dt){for(const a of parrows){const n=Math.max(1,Math.ceil(a.v.length()*dt/.3)),h=dt/n;for(let s=0;s<n&&a.l>0;s++){a.v.y-=20*h;const nx=a.p.x+a.v.x*h,ny=a.p.y+a.v.y*h,nz=a.p.z+a.v.z*h;if(get(Math.floor(nx),Math.floor(ny),Math.floor(nz))){a.l=0;break}a.p.set(nx,ny,nz);
for(const e of animals.concat(mobs)){if(e.dead)continue;const hw=e.s.hw+.15;if(Math.abs(nx-e.x)<hw&&Math.abs(nz-e.z)<hw&&ny>e.y-.1&&ny<e.y+e.s.h+.1){hurtEntity(e,a.dm,P.x,P.z);a.l=0;break}}}
a.o.position.copy(a.p);a.o.lookAt(a.p.x+a.v.x,a.p.y+a.v.y,a.p.z+a.v.z);a.l-=dt}
for(let i=parrows.length-1;i>=0;i--)if(parrows[i].l<=0){scene.remove(parrows[i].o);parrows.splice(i,1)}}
function hurtEntity(e,dm,fx,fz){const ya=Math.atan2(e.x-fx,e.z-fz);if(e.hostile){e.lp=5;hurtMob(e,dm);return}e.mine=true;flashA(e);if(isHost)dmgA(e,ya,dm);else{scare(e,ya);netHit(animals.indexOf(e),ya,dm)}}
const hl=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.005,1.005,1.005)),new THREE.LineBasicMaterial({color:0}));scene.add(hl);
// grietas por etapas al romper
const ck=mk('canvas');ck.width=160;ck.height=16;{const x=ck.getContext('2d'),ord=[...Array(256).keys()].sort(()=>rnd()-.5);x.fillStyle='rgba(0,0,0,.65)';for(let s=0;s<10;s++)for(let k=0;k<(s+1)*22&&k<256;k++){const v=ord[k];x.fillRect(s*16+v%16,v>>4,1,1)}}
const ct=new THREE.CanvasTexture(ck);ct.magFilter=ct.minFilter=THREE.NearestFilter;ct.generateMipmaps=false;ct.repeat.set(.1,1);
const crack=new THREE.Mesh(new THREE.BoxGeometry(1.01,1.01,1.01),new THREE.MeshBasicMaterial({map:ct,transparent:true,depthWrite:false}));crack.visible=false;scene.add(crack);
// nubes
const cl=new THREE.Group(),cm=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.85});
for(let i=0;i<40;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(6+Math.random()*8,1.5,4+Math.random()*4),cm);m.position.set(Math.random()*(N+60)-30,38,Math.random()*(N+60)-30);cl.add(m)}scene.add(cl);
// entrada

const setView=()=>{view=(view+1)%3;$('cross').style.display=view?'none':'block'};

addEventListener('keydown',e=>{keys[e.code]=1;if(e.code=='AltLeft'||e.code=='AltRight')e.preventDefault();if(e.code=='Space')e.preventDefault();if(e.code=='KeyE'&&playing)invOpen?closeInv():openInv(2);if(e.code=='KeyV')setView();if(e.code.startsWith('Digit')){const n=+e.code[5];if(n>0){sel=n-1;eq=.8;renderUI()}}});
addEventListener('keyup',e=>keys[e.code]=0);
addEventListener('wheel',e=>{sel=(sel+(e.deltaY>0?1:8))%9;eq=.8;renderUI()});
addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('mousemove',e=>{if(document.pointerLockElement){R.yaw-=e.movementX*.0025;R.pitch=Math.max(-1.5,Math.min(1.5,R.pitch-e.movementY*.0025))}});
addEventListener('mousedown',e=>{if(!playing||invOpen)return;if(!document.pointerLockElement){ren.domElement.requestPointerLock&&ren.domElement.requestPointerLock();return}if(e.button==2){plc();holdFn=plc;ht=.25}else startMine()});
addEventListener('mouseup',()=>{holdFn=null;stopMine()});
$('start').addEventListener('pointerdown',e=>{playing=true;e.currentTarget.style.display='none';if(e.pointerType=='mouse')ren.domElement.requestPointerLock&&ren.domElement.requestPointerLock()});
const joy=$('joy'),knob=$('knob');let jid=null,lid=null,lx=0,ly=0;
function jm(t){const r=joy.getBoundingClientRect();let dx=t.clientX-r.left-60,dy=t.clientY-r.top-60;const l=Math.hypot(dx,dy),m=50;if(l>m){dx*=m/l;dy*=m/l}knob.style.left=40+dx+'px';knob.style.top=40+dy+'px';jx=dx/m;jy=dy/m}
joy.addEventListener('touchstart',e=>{e.preventDefault();jid=e.changedTouches[0].identifier;jm(e.changedTouches[0])},{passive:false});
function btn(id,down,up){const e=$(id);e.addEventListener('pointerdown',ev=>{ev.preventDefault();ev.stopPropagation();e.setPointerCapture(ev.pointerId);down()});['pointerup','pointercancel'].forEach(n=>e.addEventListener(n,()=>up&&up()))}
btn('bJ',()=>holdUp=true,()=>holdUp=false);


ren.domElement.addEventListener('touchstart',e=>{if(lid===null&&!invOpen){const t=e.changedTouches[0];lid=t.identifier;lx=t.clientX;ly=t.clientY;lt={x:t.clientX,y:t.clientY,t:performance.now(),mv:false,h:false}}},{passive:true});
addEventListener('touchmove',e=>{for(const t of e.changedTouches){if(t.identifier===jid)jm(t);else if(t.identifier===lid){if(Math.hypot(t.clientX-lt.x,t.clientY-lt.y)>12)lt.mv=true;R.yaw-=(t.clientX-lx)*.005;R.pitch=Math.max(-1.5,Math.min(1.5,R.pitch-(t.clientY-ly)*.005));lx=t.clientX;ly=t.clientY}}},{passive:true});
addEventListener('touchend',e=>{for(const t of e.changedTouches){if(t.identifier===jid){jid=null;jx=jy=0;knob.style.left=knob.style.top='40px'}if(t.identifier===lid){if(!lt.mv&&!lt.h&&performance.now()-lt.t<250&&!(dead>0)){if(hit())sw=0;else plc()}if(lt.h||drawing)stopMine();lid=null}}});
// pantalla completa
function fs(){try{const e=document.documentElement,on=document.fullscreenElement||document.webkitFullscreenElement;if(on)(document.exitFullscreen||document.webkitExitFullscreen).call(document);else{const f=e.requestFullscreen||e.webkitRequestFullscreen;f&&Promise.resolve(f.call(e)).catch(()=>{})}}catch(x){}}
$('start').addEventListener('pointerdown',()=>{try{const e=document.documentElement,f=e.requestFullscreen||e.webkitRequestFullscreen;if(!(document.fullscreenElement||document.webkitFullscreenElement)&&f)Promise.resolve(f.call(e)).catch(()=>{})}catch(x){}});
// ciclo día/noche: 24000 ticks = 20 minutos reales, igual que Minecraft (mismo reloj para todos)
const sunM=new THREE.Mesh(new THREE.PlaneGeometry(22,22),new THREE.MeshBasicMaterial({color:0xfff3a0,fog:false,depthWrite:false,depthTest:false})),moonM=new THREE.Mesh(new THREE.PlaneGeometry(16,16),new THREE.MeshBasicMaterial({color:0xdfe6f0,fog:false,depthWrite:false,depthTest:false}));
sunM.renderOrder=moonM.renderOrder=-1;scene.add(sunM,moonM);
const spv=[];for(let i=0;i<220;i++){const a=wr()*6.283,b=Math.acos(wr()*1.6-.6);spv.push(110*Math.sin(b)*Math.cos(a),110*Math.cos(b),110*Math.sin(b)*Math.sin(a))}
const starM=new THREE.PointsMaterial({color:0xffffff,size:2,sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false}),stars=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(spv,3)),starM);stars.frustumCulled=false;scene.add(stars);
const pl=$('pl');let clk=0;
function skyUpdate(){const tod=(Date.now()/50+6000)%24000,a=tod/24000*6.2832,el=Math.sin(a),k=Math.max(0,Math.min(1,(el+.15)/.45)),m=.2+.8*k,t=Math.max(0,1-Math.abs(el)/.25)*.5;
const c=[.02+.51*k,.03+.78*k,.08+.84*k].map((v,i)=>v+([1,.5,.25][i]-v)*t);scene.background.setRGB(c[0],c[1],c[2]);scene.fog.color.setRGB(c[0],c[1],c[2]);
dayK=k;dayU.value=m;cm.color.setRGB(m,m,m);amb.intensity=.3+.45*k;dl.intensity=.05+.45*k;starM.opacity=1-k;
const cp=cam.position;sunM.position.set(cp.x+Math.cos(a)*100,cp.y+el*100,cp.z+20);moonM.position.set(cp.x-Math.cos(a)*100,cp.y-el*100,cp.z-20);sunM.lookAt(cp);moonM.lookAt(cp);stars.position.copy(cp);sunM.visible=el>-.25;moonM.visible=el<.25;
}
// multijugador (capacidad room: posiciones, bloques y animales viajan por la presencia)
const remotes=new Map(),seenEq=new Map(),seenHit=new Map(),NICK='Jugador '+Math.floor(100+Math.random()*900);
let room=null,isHost=true,edLog=[],edN=0,lastPs='',pT=0,anT=0,lastAn='',lastAnO='',hitSeq=0;
function logEdit(x,y,z,t){edLog.push(x+','+y+','+z+','+t);if(edLog.length>150)edLog.shift();edN++;if(room)room.presence({e:edLog.join(';'),eq:edN}).catch(e=>console.error('[Minicraft multiplayer] No se pudieron sincronizar los bloques.',e))}
function netHit(i,yaw,d){if(room&&!isHost)room.presence({hg:i+','+yaw.toFixed(2)+','+(++hitSeq)+','+d}).catch(e=>console.error('[Minicraft multiplayer] No se pudo sincronizar el ataque.',e))}
function scare(a,yaw){a.flee=3;a.mv=true;a.t=3;a.yaw=yaw;a.vy=5}
function tagTex(txt){const c=mk('canvas');c.width=256;c.height=48;const x=c.getContext('2d');x.fillStyle='rgba(0,0,0,.5)';x.fillRect(0,0,256,48);x.fillStyle='#fff';x.font='bold 28px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(txt,128,26);return new THREE.CanvasTexture(c)}
function addRemote(p){const m=makePlayer(),sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tagTex('Jugador'),transparent:true,fog:false}));sp.scale.set(1.6,.3,1);scene.add(m.g,sp);const r={m,sp,nm:'',x:0,y:0,z:0,yaw:0,pt:0,tx:null,w:0,s:0,sw:-1,ph:0};remotes.set(p.peer,r);return r}
function dropRemote(k){const r=remotes.get(k);if(!r)return;scene.remove(r.m.g,r.sp);remotes.delete(k);seenEq.delete(k);seenHit.delete(k)}
function netAnimal(a,dt){if(a.nx===undefined)return;const k=Math.min(1,dt*6),dx=a.nx-a.x,dz=a.nz-a.z;a.mv=Math.hypot(dx,dz)>.02;a.x+=dx*k;a.y+=(a.ny-a.y)*k;a.z+=dz*k;let d=a.nyaw-a.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));a.yaw+=d*k;
if(a.mv){a.ph+=dt*8;a.legs.forEach((l,i)=>l.rotation.x=Math.sin(a.ph)*.6*(i==0||i==3?1:-1))}else a.legs.forEach(l=>l.rotation.x=0);a.g.position.set(a.x,a.y,a.z);a.g.rotation.y=a.yaw}
function net(ch){const pe=ch.peers.filter(p=>p.kind=='viewer'),me=pe.find(p=>p.sameTab),oth=pe.filter(p=>!p.sameTab),host=pe.reduce((a,p)=>!a||p.peer<a.peer?p:a,null);
isHost=!host||!me||host.peer==me.peer;const live=new Set(oth.map(p=>p.peer));[...remotes.keys()].forEach(k=>{if(!live.has(k))dropRemote(k)});const dirty=new Set();
for(const p of oth){const q=p.presence,r=remotes.get(p.peer)||addRemote(p);
if(typeof q.p=='string'){const v=q.p.split(',').map(Number);if(v.length==5&&v.every(isFinite)){if(r.tx===null){r.x=v[0];r.y=v[1];r.z=v[2];r.yaw=v[3]}r.tx=v}}
r.w=q.w|0;r.s=q.s|0;r.k=q.k|0;
if(typeof q.nm=='string'&&q.nm!==r.nm){r.nm=q.nm.slice(0,16);r.sp.material.map=tagTex(r.nm);r.sp.material.needsUpdate=true}
const eq=q.eq|0;if(typeof q.e=='string'&&seenEq.get(p.peer)!==eq){const arr=q.e?q.e.split(';'):[],prev=seenEq.get(p.peer),n=prev===undefined?arr.length:Math.min(arr.length,eq-prev);
arr.slice(arr.length-n).forEach(s=>{const v=s.split(',').map(Number);if(v.length==4&&v.every(Number.isInteger)&&v[3]>=100&&v[3]<=110&&v[0]>=0&&v[0]<N&&v[2]>=0&&v[2]<N&&v[1]>=0&&v[1]<H){explode(v[0]+.5,v[1]+.5,v[2]+.5,v[3]-100,false);return}if(v.length==4&&v.every(Number.isInteger)&&v[0]>=0&&v[0]<N&&v[2]>=0&&v[2]<N&&v[1]>=1&&v[1]<H&&v[3]>=0&&v[3]<=80){edit(v[0],v[1],v[2],v[3],false)}});seenEq.set(p.peer,eq)}
if(isHost&&typeof q.hg=='string'&&seenHit.get(p.peer)!==q.hg){seenHit.set(p.peer,q.hg);const v=q.hg.split(',').map(Number),a=animals[v[0]];if(a&&isFinite(v[1])&&!a.dead)dmgA(a,v[1],Math.min(5,v[3]||1))}
if(!isHost&&host&&p.peer==host.peer&&typeof q.an=='string'&&q.an!==lastAn){lastAn=q.an;q.an.split(';').forEach((s,i)=>{const a=animals[i];if(!a)return;if(s=='x'){a.dead=1;return}a.dead=0;const v=s.split(',').map(Number);if(v.length==4&&v.every(isFinite)){a.nx=v[0];a.ny=v[1];a.nz=v[2];a.nyaw=v[3]}})}}
dirty.forEach(k=>{if(meshes[k])build(Math.floor(k/NC),k%NC)})}
(async()=>{try{if(!window.claude||!claude.use)throw new Error('No está disponible el adaptador de Firebase.');room=await claude.use('room');room.onPeers(net,()=>{[...remotes.keys()].forEach(dropRemote);isHost=true;room=null});room.presence({nm:NICK}).catch(e=>console.error('[Minicraft multiplayer] No se pudo registrar al jugador.',e))}catch(e){room=null;console.error('[Minicraft multiplayer] No se pudo conectar a la sala. Revisá firebase-config.js, Authentication y las reglas de Realtime Database.',e)}})();
function tick(dt,now,mvng){skyUpdate();survive(dt,mvng);if(playing)mobsTick(dt);flush();furnTick(dt);arrowsTick(dt);fireSparks(dt);animals.forEach(a=>{if(a.ft>0){a.ft-=dt;if(a.ft<=0)glowAll(a.g,0)}});animals.forEach(a=>{if(a.dead&&a.mine){a.mine=false;loot(a)}});
if(room){pT-=dt;if(pT<=0){pT=.1;const ps=[P.x,P.y,P.z,R.yaw,R.pitch].map(v=>+v.toFixed(2)).join(','),ky=ps+(mvng?1:0)+(sw>=0?1:0)+(snk?1:0);if(ky!==lastPs){lastPs=ky;room.presence({p:ps,w:mvng?1:0,s:sw>=0?1:0,k:snk?1:0}).catch(e=>console.error('[Minicraft multiplayer] No se pudo sincronizar la posición.',e))}}
if(isHost){anT-=dt;if(anT<=0){anT=.25;const an=animals.map(a=>a.dead?'x':[a.x,a.y,a.z,a.yaw].map(v=>+v.toFixed(1)).join(',')).join(';');if(an!==lastAnO){lastAnO=an;room.presence({an}).catch(e=>console.error('[Minicraft multiplayer] No se pudieron sincronizar los animales.',e))}}}}
remotes.forEach(r=>{if(r.tx===null)return;const k=Math.min(1,dt*10);r.x+=(r.tx[0]-r.x)*k;r.y+=(r.tx[1]-r.y)*k;r.z+=(r.tx[2]-r.z)*k;let d=r.tx[3]-r.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));r.yaw+=d*k;r.pt=r.tx[4];r.ph+=dt*(r.w?9:0);r.sw=r.s?(r.sw<0||r.sw>=1?0:r.sw+dt/.3):-1;
r.m.g.position.set(r.x,r.y,r.z);r.m.g.rotation.y=r.yaw+Math.PI;pose(r.m,r.ph,r.w,r.sw,r.pt);r.m.g.children[0].rotation.x=r.k?.4:0;r.sp.position.set(r.x,r.y+2.15,r.z)})}
// vida, hambre y experiencia (interfaz como en Minecraft)
let hp=20,food=20,exh=0,xp=0,lvl=0,regT=0,hurtT=0,dead=0,peak=0,air=false,lt={x:0,y:0,t:0,mv:false,h:false};
const need=l=>l<16?2*l+7:l<31?5*l-38:9*l-158;
const HPD={p:['..##.##..','.#RR#RR#.','#RWRRRRR#','#RRRRRRR#','#RRRRRRR#','.#RRRRR#.','..#RRR#..','...#R#...','....#....'],c:{'#':'#1a0000',R:'#ff1313',W:'#ffb4b4'},e:{R:'#4a4a4a',W:'#5a5a5a'}};
const FPD={p:['....###..','...#BBB#.','..#BBBBB#','..#BBBBB#','...#BBB#.','..#W#B#..','.#W#.#...','#W#......','.#.......'],c:{'#':'#2a1405',B:'#c4772c',W:'#efe6d4'},e:{B:'#4a4a4a',W:'#5a5a5a'}};
function ico(d,k){const c=mk('canvas');c.width=c.height=9;const x=c.getContext('2d');d.p.forEach((row,j)=>{for(let i=0;i<9;i++){const ch=row[i];if(ch=='.')continue;let col=d.c[ch];if(ch!='#'&&(k==0||(k==1&&i>4)))col=d.e[ch]||col;x.fillStyle=col;x.fillRect(i,j,1,1)}});return c}
function hud(){const a=$('hrt'),b=$('fd');a.innerHTML=b.innerHTML='';for(let i=0;i<10;i++){a.appendChild(ico(HPD,i*2+2<=hp?2:i*2+1==hp?1:0));b.appendChild(ico(FPD,i*2+2<=food?2:i*2+1==food?1:0))}
$('xpf').style.width=Math.min(100,xp/need(lvl)*100)+'%';$('lv').textContent=lvl>0?lvl:''}
function drawFood(x,id){if(id==27){x.fillStyle='#8a5a2b';x.fillRect(3,3,10,10);x.fillStyle='#a8733c';x.fillRect(4,4,8,8);x.fillStyle='#6b4420';x.fillRect(3,3,10,1);x.fillRect(3,12,10,1);return}if(id==23){x.fillStyle='#c81e1e';x.fillRect(4,5,8,7);x.fillRect(5,4,6,9);x.fillStyle='#ff6a6a';x.fillRect(5,6,2,2);x.fillStyle='#4a2a10';x.fillRect(8,2,1,3);x.fillStyle='#3da832';x.fillRect(9,2,3,2)}else{x.fillStyle='#8a3524';x.fillRect(3,6,10,6);x.fillStyle='#d97b66';x.fillRect(4,7,8,4);x.fillStyle='#f0d8c8';x.fillRect(11,5,3,3)}}
function gainXp(n){xp+=n;while(xp>=need(lvl)){xp-=need(lvl);lvl++}hud()}
function hurt(n,arm){if(dead>0||n<=0)return;if(arm)n=Math.max(1,Math.round(n*(1-armorPts()*.04)));hp=Math.max(0,hp-n);hurtT=.4;hud();if(hp<=0){dead=2.2;$('dead').style.display='flex'}}
function respawn(){mobs.forEach(m=>scene.remove(m.g));mobs.length=0;arrows.forEach(a=>scene.remove(a.o));arrows.length=0;drawing=false;parrows.forEach(a=>scene.remove(a.o));parrows.length=0;P.x=SPN.x;P.z=SPN.z;P.y=SPN.y;P.vy=0;hp=20;food=20;exh=0;xp=0;lvl=0;air=false;dead=0;$('dead').style.display='none';hud()}
function survive(dt,mvng){if(dead>0){dead-=dt;if(dead<=0)respawn();return}
if(!P.g){if(!air){air=true;peak=P.y}else peak=Math.max(peak,P.y)}else if(air){air=false;const d=peak-P.y;if(d>3.2)hurt(Math.floor(d-3))}
if(mvng)exh+=dt*(sprinting?5.612*.1:4.3*.02);if(exh>=4){exh-=4;if(food>0)food--;hud()}
if(food>=18&&hp<20){regT+=dt;if(regT>=4){regT=0;hp++;hud()}}else if(food<=0&&hp>1){regT+=dt;if(regT>=4){regT=0;hurt(1)}}else regT=0;
hurtT=Math.max(0,hurtT-dt);$('hurt').style.opacity=hurtT>0?1:0}
function dmgA(a,yaw,d){scare(a,yaw);if(a.dead)return;a.hp-=d;if(a.hp<=0){a.dead=90;a.g.visible=false}}
function reviveA(a){a.dead=0;a.hp=a.type=='chicken'?4:10;a.x=a.sx;a.z=a.sz;a.y=surf(a.sx,a.sz);a.vy=0}
function loot(a){const r=n=>Math.floor(Math.random()*(n+1));
if(a.type=='pig')addItem(ITM.rawPork,1+r(2));
else if(a.type=='sheep'){addItem(B.wool,1);addItem(ITM.rawMutton,1+r(1))}
else if(a.type=='chicken'){addItem(ITM.rawChicken,1);addItem(ITM.feather,r(2))}
else if(a.type=='cow'){addItem(ITM.leather,r(2));addItem(ITM.rawBeef,1+r(2))}
gainXp(1+r(2));renderUI()}
function mobLoot(m){const r=n=>Math.floor(Math.random()*(n+1));
if(m.type=='zombie'){addItem(ITM.rotten,r(2));if(Math.random()<.025)addItem(ITM.ironIngot,1)}
else if(m.type=='skeleton'){addItem(ITM.bone,r(2));addItem(ITM.arrow,r(2));if(Math.random()<.085)addItem(ITM.bow,1)}
else if(m.type=='spider')addItem(ITM.string,r(2));else addItem(ITM.gunpowder,r(2));
gainXp(5);renderUI()}
hud();
// ===== enemigos: zombis, esqueletos con arco, arañas y creepers =====
let eyeH=1.62,snk=false,dayK=1,spT=0,sprinting=false;
const MOBW={zombie:50,skeleton:20,spider:18,creeper:12},mobs=[],arrows=[];
function pickMob(){const tot=Object.keys(MOBW).reduce((a,k)=>a+MOBW[k],0);let w=Math.random()*tot;for(const k in MOBW){if((w-=MOBW[k])<0)return k}return'zombie'}
function glowAll(g,hex){g.traverse(o=>{if(o.isMesh)[].concat(o.material).forEach(m=>m.emissive&&m.emissive.setHex(hex))})}
function flashA(a){glowAll(a.g,0x992222);a.ft=.25}
function humMob(g,o){const r=pvt(g,0,0,0);r.scale.setScalar(o.sc);const T=o.t,w=o.w,E=0x151515;
eb(r,.5,.75,.25,LMT(T.body,E),0,1.125,0);const hd=pvt(r,0,1.5,0);eb(hd,.5,.5,.5,m6(LMT(T.head,E),LMT(T.top,E),LMT(T.face,E)),0,.25,0);
const L=x=>{const p=pvt(r,x,.75,0);eb(p,w,.75,w,LMT(T.leg,E),0,-.375,0);return p},A=x=>{const p=pvt(r,x,1.5,0);eb(p,w,.75,w,LMT(T.arm,E),0,-.375,0);return p};
const ll=L(-.125),rl=L(.125),la=A(-.375),ra=A(.375);if(o.zom)la.rotation.x=ra.rotation.x=-1.45;
if(o.bow){const t2=new THREE.CanvasTexture(icon(ITM.bow));t2.magFilter=t2.minFilter=THREE.NearestFilter;const bw=new THREE.Mesh(new THREE.PlaneGeometry(.7,.7),new THREE.MeshLambertMaterial({map:t2,transparent:true,alphaTest:.5,side:THREE.DoubleSide,emissive:E}));bw.position.set(0,-.65,.12);bw.rotation.y=Math.PI/2;ra.add(bw)}
return{limbs:[ll,rl,la,ra]}}
function zombieMob(g){const t={face:tx('zF',8,8,(i,j)=>{if(j==3&&(i==1||i==2||i==5||i==6))return'#1d2a3a';if(j==4&&(i==3||i==4))return jc(55,105,45,.1);if(j==6&&i>=2&&i<=5)return'#2a3a22';return jc(74,138,59,.15)}),head:tx('zH',8,8,()=>jc(74,138,59,.18)),top:tx('zT',8,8,()=>jc(60,115,48,.2)),body:tx('zB',8,8,()=>rnd()<.1?jc(70,120,60,.2):jc(43,166,166,.12)),arm:tx('zA',8,8,(i,j)=>j<3?jc(43,166,166,.1):jc(74,138,59,.15)),leg:tx('zL',8,8,()=>jc(46,56,140,.18))};return humMob(g,{t,w:.25,sc:.97,zom:1})}
function skeletonMob(g){const t={face:tx('kF',8,8,(i,j)=>{if(j>=3&&j<=4&&(i==1||i==2||i==5||i==6))return'#111';if(j==5&&(i==3||i==4))return'#555';if(j==6&&i>=1&&i<=6)return i%2?'#d8d8d8':'#222';return jc(205,205,205,.1)}),head:tx('kH',8,8,()=>jc(200,200,200,.12)),top:tx('kT',8,8,()=>jc(190,190,190,.12)),body:tx('kB',8,8,(i,j)=>(j==1||j==3||j==5)&&i>0&&i<7?jc(90,90,90,.15):(i==3||i==4?jc(215,215,215,.08):jc(195,195,195,.12))),arm:tx('kA',8,8,(i,j)=>j%4==0?jc(120,120,120,.1):jc(200,200,200,.12)),leg:tx('kL',8,8,(i,j)=>j%4==0?jc(120,120,120,.1):jc(200,200,200,.12))};return humMob(g,{t,w:.125,sc:1,bow:1})}
function creeperMob(g){const E=0x151515,sk=LMT(tx('cS',8,8,()=>rnd()<.25?jc(40,120,40,.2):jc(70,170,60,.18)),E),fc=LMT(tx('cF',8,8,(i,j)=>{if(((i==1||i==2||i==5||i==6)&&(j==2||j==3))||((i==3||i==4)&&j==4)||(i>=2&&i<=5&&(j==5||j==6)&&!((i==3||i==4)&&j==6))||((i==2||i==5)&&j==7))return'#0b1a0b';return jc(70,170,60,.18)}),E);
eb(g,.5,.75,.25,sk,0,.75,0);eb(g,.5,.5,.5,m6(sk,sk,fc),0,1.375,0);
return{limbs:[[-1,1],[1,1],[-1,-1],[1,-1]].map(a=>{const p=pvt(g,a[0]*.125,.375,a[1]*.2);eb(p,.25,.375,.25,sk,0,-.1875,0);return p})}}
function spiderMob(g){const E=0x151515,dk=LMT(tx('sB',8,8,()=>rnd()<.15?jc(80,60,50,.2):jc(40,32,28,.25)),E),fc=LMT(tx('sF',8,8,(i,j)=>{if(((i==1||i==2||i==5||i==6)&&j==2)||((i==3||i==4)&&j==3))return'#e02020';if((i==1||i==6)&&j==4)return'#e02020';if((i==2||i==5)&&j==4)return'#a01010';return jc(60,50,45,.2)}),E),lg=LMC(0x1e1e1e,E);
eb(g,.9,.7,1.1,dk,0,.55,-.55);eb(g,.7,.55,.7,dk,0,.55,.2);eb(g,.55,.5,.5,m6(dk,dk,fc),0,.55,.72);eb(g,.08,.2,.08,LMC(0x600000,E),-.12,.3,.99);eb(g,.08,.2,.08,LMC(0x600000,E),.12,.3,.99);
const legs=[];for(let i=0;i<4;i++)for(const sg of[-1,1]){const p=pvt(g,sg*.3,.55,.4-i*.3),up=pvt(p,0,0,0);eb(up,.6,.08,.08,lg,sg*.3,0,0);up.rotation.z=sg*.5;const lo=pvt(p,sg*.53,.29,0);eb(lo,1,.08,.08,lg,sg*.5,0,0);lo.rotation.z=-sg*1.1;legs.push(p)}return{limbs:legs}}
// velocidades aproximadas a las de Minecraft (atributo 0.23→3,4 · 0.25→4 · 0.3→5,7 bloques/s)
const MOB={zombie:{hw:.3,h:1.95,hp:20,sp:3.4,mk:zombieMob},skeleton:{hw:.3,h:1.99,hp:20,sp:4,mk:skeletonMob},spider:{hw:.7,h:.9,hp:16,sp:5.7,mk:spiderMob},creeper:{hw:.3,h:1.7,hp:20,sp:4,mk:creeperMob}};
function spawnMob(type,x,y,z){const s=MOB[type],g=new THREE.Group(),b=s.mk(g);scene.add(g);mobs.push({type,s,g,limbs:b.limbs,hostile:true,x,y,z,vy:0,hp:s.hp,yaw:Math.random()*6.28,ph:0,cd:1.5,fuse:0,age:0,iv:0,kx:0,kz:0,kt:0,burn:0,fd:0,ht:0,lp:0,gl:-1,on:false,wt:0,wd:-1,dead:0,aim:false})}
function hurtMob(m,dmg,silent){if(m.dead)return;if(!silent&&m.iv>0)return;m.hp-=dmg;if(!silent){m.iv=.5;m.ht=.25;const L=Math.hypot(m.x-P.x,m.z-P.z)||1;m.kx=(m.x-P.x)/L*6;m.kz=(m.z-P.z)/L*6;m.kt=.25;m.vy=Math.max(m.vy,4)}
if(m.hp<=0){m.dead=1;scene.remove(m.g);burst(m.x-.5,m.y+.3,m.z-.5,3,12);if(m.lp>0)mobLoot(m)}}
function explode(x,y,z,r,own){for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++)for(let c=-r;c<=r;c++){if(a*a+b*b+c*c>r*r+1)continue;const X=Math.floor(x)+a,Y=Math.floor(y)+b,Z=Math.floor(z)+c;if(X<0||Z<0||X>=N||Z>=N||Y<1||Y>=H)continue;const t=get(X,Y,Z);if(!t||t==45)continue;edit(X,Y,Z,0,false)}
burst(x-.5,y-.5,z-.5,3,30);if(own){const d=Math.hypot(P.x-x,P.y+.9-y,P.z-z),dm=Math.round(Math.max(0,1-d/(r*2.3))*18);if(dm>0)hurt(dm,true);logEdit(Math.floor(x),Math.floor(y),Math.floor(z),100+r)}}
function los(m){const x0=m.x,y0=m.y+1.5,z0=m.z,dx=P.x-x0,dy=P.y+1.2-y0,dz=P.z-z0,L=Math.hypot(dx,dy,dz);for(let t=.5;t<L;t+=.4)if(get(Math.floor(x0+dx/L*t),Math.floor(y0+dy/L*t),Math.floor(z0+dz/L*t)))return false;return true}
function shoot(m){const x0=m.x,y0=m.y+1.5,z0=m.z,L0=Math.hypot(P.x-x0,P.y+1.2-y0,P.z-z0),sg=L0*.05,dx=P.x-x0+(Math.random()-.5)*sg,dy=P.y+1.2-y0+(Math.random()-.5)*sg,dz=P.z-z0+(Math.random()-.5)*sg,L=Math.hypot(dx,dy,dz),v=26,o=new THREE.Mesh(arrowGeo,arrowMat);scene.add(o);arrows.push({o,p:new THREE.Vector3(x0,y0,z0),v:new THREE.Vector3(dx/L*v,dy/L*v+L*.1,dz/L*v),l:4})}
function arrowStep(a,dt){a.v.y-=10*dt;const nx=a.p.x+a.v.x*dt,ny=a.p.y+a.v.y*dt,nz=a.p.z+a.v.z*dt;if(get(Math.floor(nx),Math.floor(ny),Math.floor(nz))){a.l=0;return}
a.p.set(nx,ny,nz);a.o.position.copy(a.p);a.o.lookAt(nx+a.v.x,ny+a.v.y,nz+a.v.z);if(Math.abs(nx-P.x)<.4&&Math.abs(nz-P.z)<.4&&ny>P.y-.1&&ny<P.y+1.8&&!(dead>0)){hurt(3,true);a.l=0}a.l-=dt}
function mobStep(m,dt){const s=m.s,dx=P.x-m.x,dz=P.z-m.z,dy=P.y-m.y,d=Math.hypot(dx,dz);m.age+=dt;m.iv=Math.max(0,m.iv-dt);m.cd-=dt;m.ht-=dt;m.lp-=dt;
const cx=Math.max(0,Math.min(N-1,Math.floor(m.x))),cz=Math.max(0,Math.min(N-1,Math.floor(m.z)));
if(dayK>.5&&HT[cx*N+cz]<=Math.floor(m.y+s.h-.01))m.burn=6;
if(m.burn>0){m.burn-=dt;m.fd+=dt;if(m.fd>=.5){m.fd=0;hurtMob(m,1,true)}if(Math.random()<dt*14)burst(m.x-.5,m.y+s.h*.5,m.z-.5,-1,1);if(m.dead)return}
let wx=0,wz=0;const near=d<(m.type=='creeper'?18:34)&&!(dead>0);m.aim=false;
if(near){if(m.type=='skeleton'){m.yaw=Math.atan2(dx,dz);m.aim=m.cd<1.2&&d<20;if(d>9){wx=dx;wz=dz}else if(d<5){wx=-dx;wz=-dz}else{wx=dz*.6;wz=-dx*.6}}
else if(m.type=='creeper'){if(d<3){m.fuse+=dt;m.yaw=Math.atan2(dx,dz)}else{m.fuse=Math.max(0,m.fuse-dt);wx=dx;wz=dz}}else{wx=dx;wz=dz}}
else{m.wt-=dt;if(m.wt<=0){m.wt=2+Math.random()*3;m.wd=Math.random()<.5?Math.random()*6.28:-1}if(m.wd>=0){wx=Math.sin(m.wd);wz=Math.cos(m.wd)}}
const L=Math.hypot(wx,wz);if(L>.01&&!(m.type=='skeleton'&&near))m.yaw=Math.atan2(wx,wz);
if(m.fuse>=1.5){explode(m.x,m.y+.8,m.z,3,true);m.dead=1;scene.remove(m.g);return}
if(m.kt>0){m.kt-=dt;m.x+=m.kx*dt;if(sol(m.x,m.y,m.z,s.hw,s.h))m.x-=m.kx*dt;m.z+=m.kz*dt;if(sol(m.x,m.y,m.z,s.hw,s.h))m.z-=m.kz*dt}
else if(L>.01){const sp=s.sp*(m.aim?.7:1),mx=wx/L*sp*dt,mz=wz/L*sp*dt;
m.x+=mx;if(sol(m.x,m.y,m.z,s.hw,s.h)){m.x-=mx;if(m.on)m.vy=9}m.z+=mz;if(sol(m.x,m.y,m.z,s.hw,s.h)){m.z-=mz;if(m.on)m.vy=9}}
m.x=Math.max(2,Math.min(N-2,m.x));m.z=Math.max(2,Math.min(N-2,m.z));
m.vy=Math.max(-40,m.vy-32*dt);m.on=false;m.y+=m.vy*dt;if(sol(m.x,m.y,m.z,s.hw,s.h)){m.y-=m.vy*dt;if(m.vy<0)m.on=true;m.vy=0}
if(m.y<-5){m.dead=1;scene.remove(m.g);return}
if((m.type=='zombie'||m.type=='spider')&&d<(m.type=='spider'?1.5:1.15)&&Math.abs(dy)<1.5&&m.cd<=0&&!(dead>0)){hurt(m.type=='spider'?2:3,true);m.cd=1}
if(m.type=='skeleton'&&near&&d<20&&m.cd<=0&&los(m)){shoot(m);m.cd=1.5+Math.random()}
m.g.position.set(m.x,m.y,m.z);m.g.rotation.y=m.yaw;
const ge=m.fuse>0&&Math.floor(m.fuse*10)%2==0?0x888888:m.ht>0?0xaa1111:m.burn>0?0xff5a10:0x151515;if(m.gl!==ge){m.gl=ge;glowAll(m.g,ge)}
if(m.type=='creeper')m.g.scale.setScalar(1+m.fuse*.14);
const k=m.limbs;
if(L>.01&&m.kt<=0){m.ph+=dt*s.sp*3.2;const q=Math.sin(m.ph)*.8;
if(m.type=='spider')k.forEach((p,i)=>p.rotation.y=Math.sin(m.ph+i*1.3)*.35);
else if(m.type=='creeper')k.forEach((p,i)=>p.rotation.x=q*(i%3==0?1:-1));
else{k[0].rotation.x=q;k[1].rotation.x=-q;if(m.type=='skeleton'){k[2].rotation.x=-q;k[3].rotation.x=q}}}
if(m.type=='skeleton'&&m.aim){k[2].rotation.x=k[3].rotation.x=-1.4}
if(d>70||(m.age>240&&d>32)){m.dead=1;scene.remove(m.g)}}
function spawnTick(dt){spT-=dt;if(spT>0)return;spT=1;if(mobs.length>=18||dead>0)return;
for(let t=0;t<8;t++){const a=Math.random()*6.283,r=18+Math.random()*22,x=Math.floor(P.x+Math.cos(a)*r),z=Math.floor(P.z+Math.sin(a)*r);if(x<4||z<4||x>N-5||z>N-5)continue;
const y0=Math.min(H-3,Math.floor(P.y)+8);let y=-1;for(let yy=y0;yy>Math.max(2,Math.floor(P.y)-14);yy--){if(!get(x,yy,z)&&!get(x,yy+1,z)&&get(x,yy-1,z)&&get(x,yy-1,z)!=5){y=yy;break}}
if(y<0)continue;const under=HT[x*N+z]-y;
if((under<=0&&dayK<.35)||under>=4){spawnMob(pickMob(),x+.5,y,z+.5);return}}}
function mobsTick(dt){spawnTick(dt);mobs.forEach(m=>{if(!m.dead)mobStep(m,dt)});for(let i=mobs.length-1;i>=0;i--)if(mobs[i].dead)mobs.splice(i,1);
arrows.forEach(a=>arrowStep(a,dt));for(let i=arrows.length-1;i>=0;i--)if(arrows[i].l<=0){scene.remove(arrows[i].o);arrows.splice(i,1)}}
// ===== bucle principal =====
let fsT=0,PH=1.8;
function fireSparks(dt){fsT-=dt;if(fsT>0)return;fsT=.18;const ci=Math.floor(P.x)>>4,cj=Math.floor(P.z)>>4;for(let i=ci-2;i<=ci+2;i++)for(let j=cj-2;j<=cj+2;j++){const a=LS.get(i*NC+j);if(a)for(const s of a)if(s[4]==54&&Math.hypot(s[0]-P.x,s[2]-P.z)<30)burst(s[0]-.2,s[1]+.3,s[2]-.2,-1,1)}}
// movimiento horizontal con subida automática de medios bloques (losas y escaleras) y sin caer al agacharse
function moveH(dx,dz){for(let ax=0;ax<2;ax++){const d=ax?dz:dx;if(!d)continue;if(ax)P.z+=d;else P.x+=d;
if(sol(P.x,P.y,P.z,.3,PH)){let ok=false;if(P.g)for(const up of[.5,.6]){if(!sol(P.x,P.y+up,P.z,.3,PH)){P.y+=up;ok=true;break}}if(!ok){if(ax)P.z-=d;else P.x-=d}}
else if(snk&&P.g&&!sol(P.x,P.y-.6,P.z,.3,PH)){if(ax)P.z-=d;else P.x-=d}}}
let last=performance.now();
function loop(now){requestAnimationFrame(loop);const dt=Math.max(0,Math.min(.05,(now-last)/1000));last=now;const ok=!invOpen&&!(dead>0);
if(ok){let n=0;while(sol(P.x,P.y,P.z,.3,1.5)&&n++<40)P.y+=.25}
let f=ok?(keys.KeyW?1:0)-(keys.KeyS?1:0)-jy:0,r=ok?(keys.KeyD?1:0)-(keys.KeyA?1:0)+jx:0;const l=Math.hypot(f,r);if(l>1){f/=l;r/=l}
snk=(ok&&!!(keys.ShiftLeft||keys.ShiftRight))||(snk&&ok&&sol(P.x,P.y,P.z,.3,1.8));PH=snk?1.5:1.8;eyeH+=((snk?1.27:1.62)-eyeH)*Math.min(1,dt*12);
// velocidades de Minecraft: caminar 4,317 · correr (Alt) 5,612 · agachado 1,295 bloques/s
sprinting=ok&&!snk&&!!(keys.AltLeft||keys.AltRight)&&f>.2&&food>6&&!drawing;
const sp=sprinting?5.612:snk?1.295:4.317,s=Math.sin(R.yaw),c=Math.cos(R.yaw),vx=(-s*f+c*r)*sp,vz=(-c*f-s*r)*sp,up=ok&&(keys.Space||holdUp);
if(up&&P.g){P.vy=9;exh+=.05}P.vy=Math.max(-50,P.vy-32*dt);
moveH(vx*dt,vz*dt);
P.g=false;P.y+=P.vy*dt;if(sol(P.x,P.y,P.z,.3,PH)){P.y-=P.vy*dt;if(P.vy<0)P.g=true;P.vy=0}
if(P.y<-10){P.x=SPN.x;P.z=SPN.z;P.y=SPN.y;P.vy=0}
const mvng=l>.05&&ok;walk+=dt*(mvng?(sprinting?11:9):0);bob+=(((mvng&&P.g)?1:0)-bob)*Math.min(1,dt*8);
if(holdFn){ht-=dt;if(ht<=0){holdFn();ht=.25}}
if(lid!==null&&!lt.mv&&!lt.h&&ok&&performance.now()-lt.t>300){lt.h=true;startMine()}
mcd=Math.max(0,mcd-dt);if(drawing)drawT=Math.min(1.5,drawT+dt);
if(mining&&ok){const q=ray();if(q&&q.h[1]>=1&&q.h[0]>=0&&q.h[2]>=0&&q.h[0]<N&&q.h[2]<N){const[x,y,z]=q.h;if(mine.x!=x||mine.y!=y||mine.z!=z)mine={x,y,z,p:0,t:get(x,y,z)};
const t=mine.t,d=BK[t];if(d&&d.h>=0){const it=inv[sel],tl=it&&TOOL[it.id],tm=d.h*(canHarvest(t,tl)?1.5:5)/(tl&&tl.y==d.e?tl.sp:1);
if(mcd<=0){mine.p+=tm<=0?1:dt/tm;if(mine.p>=1){dig(x,y,z);mine={x:-1,y:0,z:0,p:0,t:0};mcd=.25}}}else mine={x:-1,y:0,z:0,p:0,t:0}}else mine={x:-1,y:0,z:0,p:0,t:0}}
if(mining&&mine.x>=0&&sw<0)sw=0;if(sw>=0){sw+=dt/.3;if(sw>=1)sw=-1}
if(mining&&mine.x>=0&&mine.p>0&&(ptm-=dt)<=0){ptm=.12;burst(mine.x,mine.y,mine.z,mine.t,1)}
crack.visible=mining&&mine.x>=0&&mine.p>0;if(crack.visible){crack.position.set(mine.x+.5,mine.y+.5,mine.z+.5);ct.offset.x=Math.min(9,Math.floor(mine.p*10))*.1}
for(let i=pcs.length-1;i>=0;i--){const o=pcs[i],u=o.userData;u.v.y-=20*dt;o.position.addScaledVector(u.v,dt);if((u.l-=dt)<=0){scene.remove(o);pcs.splice(i,1)}}
stream();
animals.forEach(a=>{const dx=a.x-P.x,dz=a.z-P.z,d2=dx*dx+dz*dz;a.g.visible=d2<6400&&!a.dead;if(isHost){if(a.dead){a.dead-=dt;if(a.dead<=0)reviveA(a)}else upd(a,dt)}else netAnimal(a,dt)});
cl.children.forEach(m=>{m.position.x+=dt*.8;if(m.position.x>N+30)m.position.x=-30});
// cámara, brazo y personaje
const ex=P.x,ey=P.y+eyeH,ez=P.z,fx=-Math.sin(R.yaw)*Math.cos(R.pitch),fy=Math.sin(R.pitch),fz=-Math.cos(R.yaw)*Math.cos(R.pitch);
if(view==0){cam.position.set(ex,ey+Math.sin(walk)*.03*bob,ez);cam.rotation.set(R.pitch,R.yaw,0)}
else{const sg=view==1?-1:1;let d=4;while(d>.3&&get(Math.floor(ex+sg*fx*d),Math.floor(ey+sg*fy*d),Math.floor(ez+sg*fz*d)))d-=.2;cam.position.set(ex+sg*fx*d,ey+sg*fy*d,ez+sg*fz*d);cam.rotation.set(view==1?R.pitch:-R.pitch,view==1?R.yaw:R.yaw+Math.PI,0)}
const tf=70+(sprinting?12:0)-(drawing?10*Math.min(1,drawT):0);if(Math.abs(cam.fov-tf)>.05){cam.fov+=(tf-cam.fov)*Math.min(1,dt*10);cam.updateProjectionMatrix()}
const sv=sw>=0?Math.sin(sw*Math.PI):0,dw=drawing?Math.min(1,drawT):0;eq=Math.max(0,eq-dt*3);
hroot.visible=view==0;hroot.position.set(.5+Math.sin(walk*.5)*.025*bob-dw*.08,-.6-sv*.1-eq*.4-Math.abs(Math.sin(walk*.5))*.03*bob+dw*.08,-.5-sv*.2);hroot.rotation.set(-sv*1.1+dw*.4,sv*.35-dw*.3,sv*.2);
mm.g.visible=view!=0;if(view){mm.g.position.set(P.x,P.y,P.z);mm.g.rotation.y=R.yaw+Math.PI;pose(mm,walk,mvng?1:0,sw,R.pitch);mm.g.children[0].rotation.x=snk?.4:0}
if(invOpen){pm.g.rotation.y=Math.sin(now/1500)*.7;pose(pm,0,0,-1,0);pr.render(ps,pc);if(ui.mode=='furn'&&(furnRT-=dt)<=0){furnRT=.4;renderInv()}}
const q=playing&&ok?ray():null;hl.visible=!!q;if(q)hl.position.set(q.h[0]+.5,q.h[1]+.5,q.h[2]+.5);
tick(dt,now,mvng);ren.render(scene,cam)}
requestAnimationFrame(loop);
