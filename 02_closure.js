var i=null;function j(){return function(){}}var l=document;l.title="TPOLM 9012";PI=Math.PI;si=Math.sin;M=Math.max;N=Math.min;Q=Math.sqrt;var m=l.body,n=m.style;n.margin="0px";var o=n.background="#000";n.overflow="hidden";m.innerHTML="";var p=l.createElement("canvas");m.appendChild(p);p.style.background="#fff";var ctx=p.getContext("2d");for(k in ctx)ctx[k[0]+[k[6]]]=ctx[k];var q=ctx.width=p.width=window.innerWidth,r=ctx.height=p.height=window.innerHeight;rand=function(b){return 0|Math.random()*b};
var s=note=0,t=[],u=(new Date).getTime();(function(){for(var b=0,a=["ms","moz","webkit","o"],e=0;e<a.length&&!window.requestAnimationFrame;++e)window.requestAnimationFrame=window[a[e]+"RequestAnimationFrame"],window.Nb=window[a[e]+"CancelAnimationFrame"]||window[a[e]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(a){var c=(new Date).getTime(),e=M(0,16-(c-b)),h=window.setTimeout(function(){a(c+e)},e);b=c+e;return h});window.Nb||(window.Nb=function(a){clearTimeout(a)})})();
AHXSong=j();
AHXSong.prototype={ya:"",Cb:0,Aa:0,Ea:0,Gb:0,vb:0,mb:0,jb:0,kb:0,w:[],P:[],$a:[],Fb:[],Ub:function(b,a){var e=new dataType;e.data=b;this.Ka(e);a()},Ka:function(b){b.h=3;this.jb=b.ec();var a=14,e=b.gc();this.ya=b.Ob(e);e+=this.ya.length+1;this.kb=(b.a(6)>>5&3)+1;this.Aa=(b.a(6)&15)<<8|b.a(7);this.Cb=b.a(8)<<8|b.a(9);this.Ea=b.a(10);this.Gb=b.a(11);this.vb=b.a(12);this.mb=b.a(13);for(var d=0;d<this.mb;d++)this.Fb.push(b.a(a+0)<<8|b.a(a+1)),a+=2;for(d=0;d<this.Aa;d++){for(var c={v:[],ga:[]},g=0;4>g;g++){c.v.push(b.a(a++));
var h=b.a(a++);h&128&&(h=(h&127)-128);c.ga.push(h)}this.w.push(c)}c=this.Gb;for(d=0;d<c+1;d++){h=[];if(128==(b.a(6)&128)&&0==d)for(g=0;g<this.Ea;g++)h.push(v());else for(g=0;g<this.Ea;g++){var f=v();f.$=b.a(a)>>2&63;f.b=(b.a(a)&3)<<4|b.a(a+1)>>4;f.W=b.a(a+1)&15;f.X=b.a(a+2);h.push(f);a+=3}this.P.push(h)}this.$a.push(w());for(d=1;d<this.vb+1;d++){c=w();c.ya=b.Ob(e);e+=c.ya.length+1;c.Kb=b.a(a+0);c.I=b.a(a+1)>>3&31|b.a(a+12)>>2&32;c.j=b.a(a+1)&7;c.p.S=b.a(a+2);c.p.la=b.a(a+3);c.p.T=b.a(a+4);c.p.ma=
b.a(a+5);c.p.na=b.a(a+6);c.p.U=b.a(a+7);c.p.V=b.a(a+8);c.sa=b.a(a+12)&127;c.ia=b.a(a+13);c.rb=b.a(a+14)>>4&7;c.xa=b.a(a+14)&128?1:0;c.ja=b.a(a+14)&15;c.Fa=b.a(a+15);c.Ba=b.a(a+16);c.Da=b.a(a+17);c.Eb=b.a(a+18);c.va=b.a(a+19)&63;c.L.Db=b.a(a+20);c.L.ab=b.a(a+21);a+=22;for(g=0;g<c.L.ab;g++)h={$:0,qb:0,k:0,W:[0,0],X:[0,0]},h.W[0]=b.a(a+0)>>2&7,h.W[1]=b.a(a+0)>>5&7,h.k=b.a(a+0)<<1&6|b.a(a+1)>>7,h.qb=b.a(a+1)>>6&1,h.$=b.a(a+1)&63,h.X[0]=b.a(a+2),h.X[1]=b.a(a+3),c.L.B.push(h),a+=4;this.$a.push(c)}}};
function v(){return{$:0,b:0,W:0,X:0}}function x(){return{S:0,la:0,T:0,ma:0,na:0,U:0,V:0}}function w(){return{ya:"",Kb:0,j:0,p:x(),sa:0,va:0,I:0,Ba:0,Da:0,Eb:0,ia:0,ja:0,Fa:0,xa:0,rb:0,L:{Db:0,ab:0,B:[]}}}
function y(){return{Ua:0,Jb:0,R:[],v:0,ga:0,yb:0,Wb:0,o:0,g:x(),b:i,ub:0,Hb:0,nb:0,q:0,eb:0,Sa:64,K:0,k:0,ib:0,D:0,Za:0,Ta:1,Xa:0,Mb:0,Lb:0,Ia:0,xa:0,Ya:0,hb:0,M:0,gb:0,Ab:0,Zb:0,Oa:0,za:0,fb:0,ia:0,ha:0,ja:0,Fa:0,ea:0,Qa:0,lb:0,Ba:0,Da:0,Ra:0,F:0,Ca:0,dc:0,Ha:0,Wa:0,wa:0,sa:0,va:0,G:0,H:0,I:0,ua:0,Ja:0,Na:0,cb:0,da:0,j:0,C:i,zb:0,Xb:0,bb:0,Ma:0,A:[],f:0,pb:0,Pb:function(){var b=this.g,a=this.b.p;b.S=a.S;b.la=256*a.la/b.S;b.T=a.T;b.ma=256*(a.ma-a.la)/b.T;b.na=a.na;b.U=a.U;b.V=256*(a.V-a.ma)/b.U}}}
function z(){this.Z=function(b){for(var a=[],e=b>>2,d=128/e,c=-(b>>1),g=0,b=0;b<e;b++)a.push(g),g+=d;a.push(127);if(1!=e){g=128;for(b=0;b<e-1;b++)g-=d,a.push(g)}d=a.length+c;for(b=0;b<2*e;b++)c=a[d++],c=127==c?-128:-c,a.push(c);return a};this.Sb=function(){for(var b=[],a=1;32>=a;a++){for(var e=0;e<2*(64-a);e++)b.push(-128);for(e=0;e<2*a;e++)b.push(127)}return b};this.Y=function(b){for(var a=[],e=0|256/(b-1),d=-128,c=0;c<b;c++)a.push(d),d+=e;return a};this.Tb=function(){for(var b=0;1920>b;b++)t[b]=
rand(255),6>rand(10)&&(t[b]=128-rand(2));return t};this.ra=function(b,a,e){for(var d,c=0,g=0,h=[],f=0;f<b.length;f++)d=b[f]-c-g,d=N(127,M(-128,d)),c+=d*a,c=N(127,M(-128,c)),g+=c*a,g=N(127,M(-128,g));for(f=0;f<b.length;f++)d=b[f]-c-g,d=N(127,M(-128,d)),c+=d*a,c=N(127,M(-128,c)),g+=c*a,g=N(127,M(-128,g)),e?h.push(0|d):h.push(0|g);return h};this.Rb=function(){for(var b=this.d[31],a=this.ra,e=8,d=0;31>d;){for(var c={m:[],n:[]},g={m:[],n:[]},h=1.25*e/100,f=0;5>=f;f++)c.m[f]=a(b.m[f],h,0),c.n[f]=a(b.n[f],
h,0),g.m[f]=a(b.m[f],h,1),g.n[f]=a(b.n[f],h,1);c.z=[];g.z=[];for(f=0;32>f;f++)c.z=c.z.concat(this.ra(b.z.slice(128*f,128*(f+1)),h,0)),g.z=g.z.concat(this.ra(b.z.slice(128*f,128*(f+1)),h,1));c.Ga=this.ra(b.Ga,h,0);g.Ga=this.ra(b.Ga,h,1);this.d[d]=c;this.d[d+32]=g;d++;e+=3}};this.d=Array(63);this.d[31]={};this.d[31].m=[];this.d[31].m[0]=this.Y(4);this.d[31].m[1]=this.Y(8);this.d[31].m[2]=this.Y(16);this.d[31].m[3]=this.Y(32);this.d[31].m[4]=this.Y(64);this.d[31].m[5]=this.Y(128);this.d[31].n=[];this.d[31].n[0]=
this.Z(4);this.d[31].n[1]=this.Z(8);this.d[31].n[2]=this.Z(16);this.d[31].n[3]=this.Z(32);this.d[31].n[4]=this.Z(64);this.d[31].n[5]=this.Z(128);this.d[31].z=this.Sb();this.d[31].Ga=this.Tb();this.Rb();return this}
function aa(){return{O:0,J:0,mc:0,nc:0,aa:0,wb:0,jc:0,fa:0,e:0,N:0,r:0,Pa:0,pc:[],Va:new z,i:[],ka:0,c:AHXSong(),kc:0,Ib:[0,24,49,74,97,120,141,161,180,197,212,224,235,244,250,253,255,253,250,244,235,224,212,197,180,161,141,120,97,74,49,24],$b:[0,3424,3232,3048,2880,2712,2560,2416,2280,2152,2032,1920,1812,1712,1616,1524,1440,1356,1280,1208,1140,1076,1016,960,906,856,808,762,720,678,640,604,570,538,508,480,453,428,404,381,360,339,320,302,285,269,254,240,226,214,202,190,180,170,160,151,143,135,127,
120,113],Ka:function(b){this.c=b},tb:function(b){if(b>this.c.mb)return 0;this.e=0==b?0:Song.Fb[b-1];this.aa=this.N=0;this.wb=64;this.r=this.Pa=0;this.fa=6;this.O=0;this.J=1;this.i=[y(),y(),y(),y()];return 1},ac:function(){if(0>=this.O){if(this.J){for(var b=this.e+1==this.c.Aa?0:this.e+1,a=0;4>a;a++)this.i[a].v=this.c.w[this.e].v[a],this.i[a].ga=this.c.w[this.e].ga[a],this.i[a].yb=this.c.w[b].v[a],this.i[a].Wb=this.c.w[b].ga[a];s=b;this.J=0}for(a=0;4>a;a++)this.Bb(a);this.O=this.fa}for(a=0;4>a;a++)this.bc(a);
if(0<this.fa&&0>=--this.O&&(this.aa||(this.r++,this.r>=this.c.Ea&&(this.N=this.e+1,this.Pa=0,this.aa=1)),this.aa))this.aa=0,this.r=this.Pa,this.Pa=0,this.e=this.N,this.N=0,this.e==this.c.Aa&&(this.e=this.c.Cb),this.J=1;for(b=0;4>b;b++)this.cc(b)},ic:function(){this.e++;this.e==this.c.Aa&&(this.e=0);this.O=0;this.J=1},lc:function(){this.e--;0>this.e&&(this.e=0);this.O=0;this.J=1},hc:function(b){this.e=b;this.O=0;this.J=1},Bb:function(b){var a=this.i[b];if(a.Ta){note=this.r;a.Mb=a.Lb=0;var e=this.c.P[this.c.w[this.e].v[b]][this.r].$,
d=this.c.P[this.c.w[this.e].v[b]][this.r].b,c=this.c.P[this.c.w[this.e].v[b]][this.r].W,b=this.c.P[this.c.w[this.e].v[b]][this.r].X;switch(c){case 0:0<(b&15)&&9>=(b&15)&&(this.N=b&15);break;case 11:this.N=100*this.N+(b&15)+10*(b>>4);this.aa=1;break;case 15:this.fa=b}if(d){a.eb=64;a.hb=a.M=a.gb=0;a.o=0;a.b=this.c.$a[d];a.Pb();a.j=a.b.j;a.q=a.b.Kb;a.ha=0;a.ia=a.b.ia;a.ja=a.b.ja;a.Fa=a.b.Fa;a.nb=0;a.xa=a.b.xa;a.Ia=a.b.rb;a.Za=a.Ca=0;a.lb=a.ea=0;var g=a.b.Ba>>5-a.j,h=a.b.Da>>5-a.j;h<g&&(d=h,h=g,g=d);
a.Da=h;a.Ba=g;a.Ja=a.wa=a.Ha=0;a.ua=0;d=a.b.I;g=a.b.sa;h=a.b.va;g&128&&(d|=32);h&128&&(d|=64);a.I=d;g&=-129;h&=-129;g>h&&(d=g,g=h,h=d);a.va=h;a.sa=g;a.G=32;a.da=a.Na=0;a.cb=a.b.L.Db;a.C=a.b.L}a.Ab=0;e&&(a.Hb=e,a.D=1);switch(c){case 12:if(64>=b)a.q=b;else if(b-=80,64>=b)for(a=0;4>a;a++)this.i[a].Sa=b;else b-=80,64>=b&&(a.Sa=b)}}},bc:function(b){var a=this.i[b];if(a.Ta){a.Xb&&(0>=a.zb?this.Bb(b):a.zb--);if(a.Ia&&(this.r+1<this.c.Ea?this.c.P[a.v][this.r+1].b:this.c.P[a.yb][0].b)){var e=this.fa-a.Ia;
0>e&&(e=0);a.Ma?a.Ia=0:(a.Ma=1,a.bb=e,a.Ya=-(e-this.fa))}a.Ma&&(0>=a.bb?(a.Ma=0,a.xa?(a.g.V=-(a.o-(a.b.p.V<<8))/a.Ya,a.g.U=a.Ya,a.g.S=a.g.T=a.g.na=0):a.q=0):a.bb--);a.g.S?(a.o+=a.g.la,0>=--a.g.S&&(a.o=a.b.p.la<<8)):a.g.T?(a.o+=a.g.ma,0>=--a.g.T&&(a.o=a.b.p.ma<<8)):a.g.na?a.g.na--:a.g.U&&(a.o+=a.g.V,0>=--a.g.U&&(a.o=a.b.p.V<<8));a.q=a.q+a.Mb-a.Lb;0>a.q&&(a.q=0);64<a.q&&(a.q=64);if(a.Ab)if(a.Zb){var d=a.M-a.gb,c=a.hb;0<d&&(c=-c);d&&(d=0<=(d+c^d)?a.M+c:a.gb,a.M=d,a.D=1)}else a.M+=a.hb,a.D=1;a.ja&&(0>=
a.ia?(d=a.ha,a.nb=(31<a.ha?-this.Ib[32-a.ha]:this.Ib[a.ha])*a.ja>>7,a.D=1,a.ha=d+a.Fa&63):a.ia--);if(a.b&&a.Na<a.b.L.ab){if(0>=--a.da){c=a.Na++;a.da=a.cb;a.C.B[c].k&&(a.k=a.C.B[c].k-1,a.K=1,a.Oa=a.za=0);for(d=a.fb=0;2>d;d++)this.Yb(b,a.C.B[c].W[d],a.C.B[c].X[d]);a.C.B[c].$&&(a.ub=a.C.B[c].$,a.D=1,a.Xa=a.C.B[c].qb)}}else a.da?a.da--:a.Oa=0;a.fb&&(a.za-=a.Oa,a.za&&(a.D=1));if(2==a.k&&a.ea&&0>=--a.lb){e=a.Ba;c=a.Da;b=a.Ra;a.Qa&&(a.Qa=0,b<=e?(a.Ca=1,a.F=1):b>=c&&(a.Ca=1,a.F=-1));if(e==b||c==b)a.Ca?a.Ca=
0:a.F=-a.F;b+=a.F;a.Ra=b;a.ib=1;a.lb=a.b.Eb}if(a.Ha&&0>=--a.wa){e=a.sa;c=a.va;b=a.G;a.Wa&&(a.Wa=0,b<=e?(a.ua=1,a.H=1):b>=c&&(a.ua=1,a.H=-1));for(var g=3>a.I?5-a.I:1,d=0;d<g;d++){if(e==b||c==b)a.ua?a.ua=0:a.H=-a.H;b+=a.H}a.G=b;a.K=1;a.wa=a.I-3;1>a.wa&&(a.wa=1)}if(2==a.k||a.ib){b=this.Va.d[a.G-1].z;c=0;d=a.Ra<<5-a.j;32<d&&(d=64-d,a.dc=1);d--&&(c=128*d);e=32>>a.j;g=4*(1<<a.j);a.A=Array(g);for(d=0;d<g;d++)a.A[d]=b[c],c+=e;a.K=1;a.k=2;a.ib=0}3==a.k&&(a.K=1);a.K&&2!=a.k&&(d=31,d=a.G-1,3==a.k?(b=this.ka&
1278,a.A=this.Va.d[d].Ga.slice(b,b+640),this.ka+=2239384,this.ka=((this.ka>>8|this.ka<<24)+782323^75)-6735):0==a.k?a.A=this.Va.d[d].n[a.j].slice():1==a.k&&(a.A=this.Va.d[d].m[a.j].slice()));a.f=a.ub;a.Xa||(a.f+=a.ga+a.Hb-1);60<a.f&&(a.f=60);0>a.f&&(a.f=0);a.f=this.$b[a.f];a.Xa||(a.f+=a.M);a.f+=a.za+a.nb;3424<a.f&&(a.f=3424);113>a.f&&(a.f=113);a.pb=((((a.o>>8)*a.q>>6)*a.eb>>6)*a.Sa>>6)*this.wb>>6}},cc:function(b){b=this.i[b];if(b.Ta){if(b.Ua=b.pb,b.D&&(b.D=0,b.Jb=b.f),b.K)if(3==b.k)b.R=b.A.slice();
else{var a=5*(1<<5-b.j),e=4*(1<<b.j);if(b.A.length){b.R=[];for(d=0;d<a;d++)b.R=b.R.concat(b.A.slice(0,e))}else{b.R=Array(a*e);for(var d=0;d<a*e;d++)b.R=0}}}else b.Ua=0},Yb:function(b,a,e){b=this.i[b];switch(a){case 0:0<this.c.jb&&0!=e&&(b.Ja?(b.G=b.Ja,b.Ja=0):b.G=e,b.K=1);break;case 2:b.Oa=-e;b.fb=1;break;case 3:b.Za?b.Za=0:b.Ra=e>>5-b.j;break;case 4:if(0==this.c.jb||0==e)b.Qa=b.ea^=1,b.F=1;else if(e&15&&(b.Qa=b.ea^=1,b.F=1,15==(e&15)&&(b.F=-1)),e&240)b.Wa=b.Ha^=1,b.H=1,240==(e&240)&&(b.H=-1);break;
case 5:b.Na=e;break;case 6:if(64<e){if(0<=(e-=80))if(64>=e)b.eb=e;else if(0<=(e-=80)&&64>=e)b.Sa=e}else b.q=e;break;case 7:b.cb=b.da=e}},oc:function(b,a){0>b||3<b||(this.i[b].Ta=a)}}}
function A(){return{s:aa(),sb:function(b){this.Qb=b;this.qa=0|b/50;this.La=Array(this.qa)},h:[0,0,0,0],Vb:function(b,a){for(var e=0;4>e;e++)if(0!=this.s.i[e].Ua)for(var d=0|65536*(3579545.25/this.s.i[e].Jb)/this.Qb,c=b,g=0;c;){41943040<=this.h[e]&&(this.h[e]-=41943040);for(var h=N(c,0|(41943040-this.h[e]-1)/d+1),c=c-h,f=0;f<h;f++)this.La[a+g++]+=this.s.i[e].R[this.h[e]>>16]*this.s.i[e].Ua>>6,this.h[e]+=d}return a+b},xb:function(){for(var b=0;b<this.qa;b++)this.La[b]=0;for(var b=0,a=0|this.qa/this.s.c.kb,
e=0;e<this.s.c.kb;e++)this.s.ac(),b=this.Vb(a,b)}}}AHXMasterWebKit=function(b){this.l=b||A();this.pa=this.oa=i};
AHXMasterWebKit.prototype={Play:function(b){this.l.s.Ka(b);this.l.s.tb(0);this.oa||(this.oa=new webkitAudioContext);this.l.sb(this.oa.sampleRate,16);this.bufferSize=8192;this.u=this.t=0;this.pa&&this.pa.disconnect();this.pa=this.oa.createJavaScriptNode(this.bufferSize);var a=this;this.pa.onaudioprocess=function(b){a.ob(b)};this.pa.connect(this.oa.destination)},ob:function(b){for(var a=this.bufferSize,e=b.outputBuffer,b=e.getChannelData(0),e=e.getChannelData(1),d=0;0<a;){0==this.t&&(this.l.xb(),this.t=
this.l.qa,this.u=0);for(var c=N(this.t-this.u,a),a=a-c;0<c--;){var g=this.l.La[this.u++]/512;b[d]=e[d]=g;d++}this.u>=this.t&&(this.u=this.t=0)}},reset:j()};
function da(){function b(a,b){var d=new Audio;d.mozSetup(1,a);var c=0,g=a/2,h=i,f;setInterval(function(){var a;if(h){a=d.mozWriteAudio(h.subarray(f));c+=a;f+=a;if(f<h.length)return;h=i}a=d.mozCurrentSampleOffset()+g-c;if(0<a){var B=new Float32Array(a);b(B);a=d.mozWriteAudio(B);a<B.length&&(h=B,f=a);c+=a}},100)}this.l=A();this.Play=function(a){this.l.s.Ka(a);this.l.s.tb(0);this.sampleRate=44100;this.u=this.t=0;var e=this;this.l.sb(this.sampleRate,16);new b(this.sampleRate,function(a){e.ob(a)})};this.ob=
function(a){for(var b=a.length,d=0;0<b;){0==this.t&&(this.l.xb(),this.t=this.l.qa,this.u=0);for(var c=N(this.t-this.u,b),b=b-c;0<c--;){var g=this.l.La[this.u++]/512;a[d]=g;d++}this.u>=this.t&&(this.u=this.t=0)}};this.reset=j();this.reset();return this}function ea(){this.Play=j();this.reset=j();return this}dataType=j();
dataType.prototype={data:i,h:0,gc:function(){var b=parseInt(this.data[this.h+0].charCodeAt(0).toString(16),16)<<8|parseInt(this.data[this.h+1].charCodeAt(0).toString(16),16);this.h+=2;return b},ec:function(){var b=parseInt(this.data[this.h].charCodeAt(0).toString(16),16);this.h+=1;return b},a:function(b){return parseInt(this.data[b].charCodeAt(0).toString(16),16)},Ob:function(b){for(var a="";;)if(0!=this.data[b++].charCodeAt(0))a+=this.data[b-1];else return a}};var C,D;
m.onload=function(){C="undefined"!=typeof webkitAudioContext?new AHXMasterWebKit:"undefined"!=typeof(new Audio).mozSetup?new da:new ea;D=new AHXSong;D.Ub("54485801115a8011000040140c000100000000000000010000000000000008000200000000000900030000000000120001000000000007000200050004000a0003000600040007000200100004000a0003001100040001000b0010000d0001000b0011000000130002000500040014000200060004001300020010000400140003001100040001000b000c000d000f0000000e00000034640100040100040100040100040100040100040100040100040000040f00040000040000040000040300040000040000040300040000040000040100040100040100040100040100040100040100040100040100040100040100040100040100040f00040000040000040100040000040300040000040f000400000400000403000400000401000401000401000401000401000401000401000401000400000402000403000400000400000404000400000400000405000400000406000400041f04000000342000348000644000000000943000943000942000000000644000000000342000000000c42000000000041000000000342000348000644000000000943000943000942000000000041000000000644000000000643000000000041000000000342000348000644000000000943000943000942000000000644000000000342000000000c42000000000041000000000342000348000644000000000943000943000942000000000041000000000c43c05c43c10c43c20c43c40041000000000342000348000644000000000943000943000945000000000644000000000342000000000c42000000000041000000000342000348000644000000000345000000000000000000000041000000000644000000000643000000000041000000000342000348000644000000000943000943000942000000000644000000000342000000000c42000000000041000000000342000348000644000000000943000943000942000000000346000000000000000000000000000000000c43000000000c43000000000785000000000c43000000000c43000000000485000000000c43000000000c43000000000c43000000000c430000000006c5000000000c43000000000c43000000000c430000000003c5000000000c43000000000c43000000000c43000000000785000000000c43000000000c43000000000485000000000c43000000000c43000000000c43000000000c430000000006c5000000000c43000000000c43000000000c430000000003c5000000000c430000000007480000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007880000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007480000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006c800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044700000000000000000000014700000000000000000000044900000000044a00000000000000000000000000090bc2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000048700000000000000000000018700000000000000000000044900000000044a00000000000000000000000000088bc20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000447000000000000000000000000000000000000000000000147000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000487000000000000000000000000000000000000000000000000000000000000000000000000000000000147c200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004470000000000000000000000000000000000000000000001470000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003c70000000000000000000000000000000000000000000000000000000000000000000000000000000009cbc2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044700000000000000000000014700000000000000000000044900000000044a00000000000000000000000000090bc200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003c70000000000000000000000c70000000000000000000003c90000000003ca000000000000000000000000000a4bc2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000034b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000045000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b1600040100040100040100040100040100040100040100040100040000040f00040000040000040000040300040000040000040300040000040000040100040100040100040100040100040100040100040100040100040100040100040100040100040f00040000040000040100040000040300040000040f00040000040000040300040000040100040100040100040100040100040100040100040100040000040200040300040000040000040400040000040000040500040000040600040074c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000078c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000074c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006cc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010f00020f00010f00020f00028000028000028000028000028000028000028000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044700000000000000000000014700000000000000000000044900000000044a00000000000000000000000000090bc20000000000000000000000000c0b000000000000000000000000000000000a4b00000000000000000000000000000000048700000000000000000000018700000000000000000000044900000000044a00000000000000000000000000088bc20000000000000000000000000000000000000b8b000000000000000000000c0b00000000000000000000000000000000044700000000000000000000014700000000000000000000044900000000044a00000000000000000000000000090bc20000000000000000000000000000000000000ccb000000000000000000000000000b8b0000000000000000000000000003c70000000000000000000000c70000000000000000000003c90000000003ca000000000000000000000000000a4bc20000000000000000000000000000000000000000000ccb000000000000000000000000000d4b00000000000000000000040250140080001010000000001000000203f011f02030da520080800ff040a00ff0037650131050001010000000001000e10203f011f010382190fff0d8020001980100040220140030001010000000001000000203f011f010202250f00410002ff40040140074001080000000000000000043f010001060e7a20100dec20104a19ffff19faf0281a4070101400000040250140100001010000000001000000203f011f0103012503000200040002000f0040a240404d3aff450000000001000000203f01220502020d0000a000080038240131130001010000000001000000203f071f01040d8d5008820000010d80200400000000355c0134122378300000000001002000203f011f0406010d080000190b00001204000019000c0d8d400f151200081f2401231a2c69120000000001000004023f061f0703718d013000000900a00002013123083919001b1d0000000001000000043f091f010461990f208225030100990f00a1a502002e0d012101400810200000001e0826070114010101058e7a3f001d810800800000108000001100000000354c01341a2f78300000000001002000203f041f0406718d012001990f030112040f008f000f0d8d400615120008666c617661342d7300000000534e414152320000000000000046696c74657265642042617373310000".replace(/../g,
function(b){return String.fromCharCode(parseInt(b,16))}),function(){C.Play(D);fa()})};for(var E=!0,F=!1,G=!0,H="rgba(",I=H+"0,0,0,1)",J=H+"0,0,0,.1)",K=H+"254,147,88,1)",L=H+"94,88,254,1)",O=H+"254,229,88,1)",ga=lines=lW=10,P=0|0.0175*q,R=0|0.015*r,S=[],T=0;2>T;T++)S[T]=rand(P*R);for(var U=[],V=4,T=0;T<P;T++)for(var W=0;W<R;W++)U[T+W*P]=rand(V);var X=l.createElement("div"),Y=X.style;Y.background="#fff";Y.position="absolute";Y.height="100px";Y.lineHeight=X.style.height;Y.letterSpacing="-5px";
Y.textAlign="center";Y.fontSize="60px";Y.border="solid #49b249";Y.borderWidth="5px 0";Y.fontFamily="Helvetica";m.appendChild(X);function Z(b,a){Y.display="";if(a)for(style in a)Y[style]=a[style];X.innerHTML=b}function $(){Y.display="none"}
function fa(){(loop=function(){requestAnimationFrame(loop);var b=(new Date).getTime();switch(s){case 0:case 1:case 2:case 10:case 11:case 16:E||(E=!0,p.style.background="#eeeee0");ctx.ce(0,0,q,r);var a=q/ga,e=r/lines;ctx.lineCap="round";ctx.lineWidth=a+si(b/1E3)*e;for(var d=0;11>d;d++){var c=rand(255-note);color2=H+c+","+c+","+c+",.5)";ctx.strokeStyle=color2;c=a*d;ctx.ba();ctx.moveTo(c,0);ctx.lineTo(c,r);ctx.stroke()}ctx.lineWidth=e+si(b/1E3+500)*a;for(var g=0;11>g;g++){c=rand(255-note);color2=H+
c+","+c+","+c+",.5)";ctx.strokeStyle=color2;var h=e*g;ctx.ba();ctx.moveTo(0,h);ctx.lineTo(q,h);ctx.stroke()}ctx.ca();F?(ctx.fillStyle=I,G?Z("byebye you silly samurai",{color:o}):Z("ps . kaneel . fthr"),240<rand(255)&&(G=!G),1E5<b-u&&(l.location.href=l.location.href)):2>s?(ctx.fillStyle=I,32>note?Z("the united presidents of tpolm present",{left:"0",top:"45%",marginTop:"-50px",bottom:"",width:"100%",height:"100px",color:o}):Z("a 10k intro for demojs entitled")):32>note?Z("love cosmic space hate"):Z("our fresh parsley state");
break;case 3:case 4:var c=h=0,f=50,d=q+2*f,g=q+f-0.15*b%d,a=20*si(b/500)+0.25*r;ctx.save();ctx.ta(g,a);ctx.rotate(PI*si(b/1E3));ctx.lineCap="round";ctx.shadowOffsetX=5;ctx.shadowOffsetY=5;ctx.shadowColor=J;ctx.strokeStyle=K;ctx.lineWidth=lW;ctx.ba();ctx.moveTo(c-f,h-f);ctx.lineTo(c+f,h+f);ctx.stroke();ctx.re();d=0.15*b%d;g=20*si(b/500)+0.75*r;ctx.save();ctx.ta(d,g);ctx.rotate(PI*si(b/1E3));ctx.shadowOffsetX=5;ctx.shadowOffsetY=5;ctx.shadowColor=J;ctx.strokeStyle=L;ctx.lineWidth=lW;ctx.ba();ctx.moveTo(c-
f,h-f);ctx.lineTo(c+f,h+f);ctx.stroke();ctx.re();3==s?16>note?Z("important facts on parsley"):32>note?Z("parsley is anticancer"):48>note?Z("parsley freshens bad breath"):Z("parsley is antimicrobial"):16>note?Z("can parsley cure socialism?"):32>note?Z("can parsley make metaballs shine?"):48>note?Z("parsley is not like the hemp you smoke"):Z("but it's still quite dope!");break;case 6:case 9:$();c=0|0.015*q;h=0|0.02*r;ctx.ce(0,0,q,r);ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;ctx.globalCompositeOperation=
"xor";32>note?a=9!=s?"rgb(73,162,73)":"rgb(200,"+t[s]+","+t[note]+")":(E?(E=!1,p.style.background="#123"):p.style.background="#321",a=9!=s?K:"rgb("+t[note]+","+t[s]+",200)");for(d=0;d<=c;d++)for(g=0;g<=h;g++)f=40+10*si(b/1E3)+10*si(b*(g-0.5*h)/1E3),ctx.save(),ctx.ta(d*(q/c),g*(r/h)),ctx.rotate(si((f+b)/3E3)*PI),ctx.fillStyle=a,ctx.ba(),ctx.moveTo(0,0),ctx.lineTo(f/2+f,-f/2*Q(3)),ctx.lineTo(f,0),ctx.lineTo(f/2-f,f/2*Q(3)),ctx.fill(),ctx.ca(),ctx.re();if(9==s){ctx.globalCompositeOperation="source-over";
ctx.ta(0.5*q-99,0.5*r-141);with(ctx)save(),ta(0,0),ba(),moveTo(0,0),lineTo(187,0),lineTo(187,241),lineTo(0,241),ca(),clip(),ta(0,0),ta(0,0),scale(1,1),ta(7,5),strokeStyle=J,lineCap="butt",lineJoin="miter",miterLimit=4,save(),fillStyle="#7ecdda",strokeStyle=o,lineWidth=2,miterLimit=10,ba(),moveTo(1,1),bC(1,1,1,150,1,177),bC(1,204,87,202,87,235),bC(87,202,176,204,176,177),bC(176,150,176,1,176,1),lineTo(1,1),ca(),fill(),stroke(),re(),save(),fillStyle="#f0915c",ba(),moveTo(175,2),lineTo(156,2),lineTo(2,
156),lineTo(2,175),bC(2,175,-0.9,182,8,187),lineTo(175,20.47),lineTo(175,2),ca(),fill(),stroke(),re(),save(),fillStyle="#49b249",strokeStyle=o,lineWidth=1.25,lineCap=lineJoin="round",miterLimit=10,ba(),moveTo(110,144),bC(97,134,95,135,93,135),bC(81,151,90,167,86,183),bC(79,175,92,143,76,135),bC(68,130,60,142,49,146),bC(46,137,41,140,36,133),bC(48,126,55,129,62,127),bC(31,108,34,111,38,109),bC(31,86,35,96,38,88),bC(40,92,42,95,43,99),bC(46,85,50,85,54,87),bC(54,81,46,83,45,77),bC(47,74,49,76,51,78),
bC(46,70,50,67,48,60),bC(57,56,54,52,53,48),bC(59,42,64,54,67,55),bC(67,49,59,43,59,37),bC(61,35,63,37,66,38),bC(68,28,66,26,68,22),bC(81,32,77,26,82,25),bC(87,40,86,35,92,29),bC(95,43,97,41,98,40),bC(96,54,86,68,90,82),bC(98,54,98,55,99,56),bC(100,50,102,44,107,39),bC(111,58,113,53,115,52),bC(110,77,115,66,119,69),bC(121,73,117,77,113,82),bC(123,82,106,87,101,94),bC(107,100,104,95,109,90),bC(121,95,120,103,112,110),bC(118,109,126,99,127,95),bC(132,98,132,92,138,90),bC(150,95,158,81,161,85),bC(158,
99,156,98,154,100),bC(150,110,144,108,136,113),bC(142,119,137,122,136,125),bC(113,132,116,132,119,136),ca(),moveTo(74,83),bC(73,79,72,70,65,70),bC(67,74,69,82,74,83),ca(),moveTo(87,140),bC(97,127,98,114,94,101),bC(82,114,88,127,87,140),ca(),moveTo(66,98),bC(64,101,64,107,68,106),bC(66,105,68,100,70,102),bC(75,114,70,131,85,139),bC(85,126,88,103,66,98),ca(),moveTo(51,97),bC(55,100,54,109,59,109),bC(57,105,55,101,57,97),bC(55,99,53,95,51,97),ca(),fill(),stroke(),re(),re();ctx.ta(99-0.5*q,141-0.5*r)}break;
case 5:c=0|0.0275*q;ctx.lineCap=ctx.lineJoin="round";ctx.fillStyle="rgba(200,200,0,.1)";ctx.fc(0,0,q,q);for(d=0;d<c;d++){h=q/c;ctx.lineWidth=Math.abs(si(2*b*d/1E3)*0.5*c);ctx.strokeStyle=H+t[d]+","+t[d+1]+","+t[d+2]+",.5)";ctx.ba();for(g=0;g<q;g+=2*h)ctx.moveTo(d*h+10*si(b/500),g+5*si(b/1E3+(g+d))),ctx.lineTo(d*h+10*si(b/1E3),g+h);ctx.stroke()}32>note?$():48>note?Z("if you're a pregnant woman"):Z("don't consume parsley in excess");break;case 7:$();ctx.ce(0,0,q,r);a=q/P;e=r/R;color2=H+"255,0,0,1)";
ctx.strokeStyle=color2;ctx.fillStyle=color2;ctx.lineCap="round";ctx.globalCompositeOperation="xor";ctx.shadowOffsetX=5;ctx.shadowOffsetY=6;ctx.shadowColor=J;32<note&&(p.style.background="#fff");b=10*si(b/1E3)+18;for(d=0;d<=P;d++)for(g=0;g<=R;g++)switch(c=a*d,h=e*g,f=0.5*a,U[d+g*P]){case 0:ctx.strokeStyle=K;ctx.lineWidth=b;ctx.ba();ctx.moveTo(c-f,h-f);ctx.lineTo(c+f,h+f);ctx.stroke();break;case 1:ctx.strokeStyle=O;ctx.lineWidth=b;ctx.ba();ctx.moveTo(c+f,h-f);ctx.lineTo(c-f,h+f);ctx.stroke();break;
case 2:ctx.strokeStyle=H+"88,254,250,1)";ctx.lineWidth=b;ctx.ba();ctx.moveTo(c-f,h-f);ctx.lineTo(c+f,h+f);ctx.stroke();break;case 3:ctx.strokeStyle=L,ctx.lineWidth=b,ctx.ba(),ctx.moveTo(c-f,h-f),ctx.lineTo(c+f,h+f),ctx.stroke()}for(b=0;b<S.length;b++){switch(rand(4)){case 0:S[b]+=P;break;case 1:S[b]-=P;break;case 2:S[b]++;break;case 3:S[b]--}S[b]>P*R&&(S[b]-=P*R);0>S[b]&&(S[b]+=P*R);U[S[b]]=rand(V)}break;case 8:color1=K,color2=32>note?O:L;case 12:case 13:case 14:case 15:ctx.ce(0,0,q,r);ctx.shadowOffsetX=
0;ctx.shadowOffsetY=0;c=h=0|0.01*q;for(d=0;d<c;d++)for(g=0;g<h;g++)f=c*PI+10*si(b/1E3)+10*si(b*(g-0.5*h)/1E3),a=f/2*Q(3),ctx.save(),ctx.ta(d*(q/c),g*(r/h)),ctx.globalCompositeOperation="xor",ctx.rotate(2*(si((f+b/(8-g-d))/3E3)*si(b/2E3))*PI),ctx.ta(0.5*f,0.5*f),ctx.fillStyle=color1,ctx.ba(),ctx.moveTo(0.5*-f,0.5*-f),ctx.lineTo(0.5*-f,0.5*f),ctx.lineTo(0.5*f,0.5*f),ctx.lineTo(0.5*f,0.5*-f),ctx.fill(),ctx.ta(0.5*-f,0.5*-f),ctx.fillStyle=color2,ctx.ba(),ctx.moveTo(0,0),ctx.lineTo(1.5*f,-a),ctx.lineTo(f,
0),ctx.lineTo(0.5*-f,a),ctx.fill(),ctx.ta(f,0),ctx.rotate(0.5*PI),ctx.ba(),ctx.moveTo(0,0),ctx.lineTo(1.5*f,-a),ctx.lineTo(f,0),ctx.lineTo(0.5*-f,a),ctx.fill(),ctx.ta(f,0),ctx.rotate(0.5*PI),ctx.ba(),ctx.moveTo(0,0),ctx.lineTo(1.5*f,-a),ctx.lineTo(f,0),ctx.lineTo(0.5*-f,a),ctx.fill(),ctx.ta(f,0),ctx.rotate(0.5*PI),ctx.ba(),ctx.moveTo(0,0),ctx.lineTo(1.5*f,-a),ctx.lineTo(f,0),ctx.lineTo(0.5*-f,a),ctx.fill(),ctx.re();8!=s&&($(),color1=H+t[s]+","+t[s+note]+",255,1)",color2=32>note?H+t[s]+","+t[s+1]+
","+t[s+2]+",1)":H+t[note]+","+t[s+1]+","+t[note]+",1)",12==s?8>note?Z("vintage greetings to",{left:"0",top:"45%",marginTop:"-50px",bottom:"",width:"100%",height:"100px",color:o}):12>note?Z("TPOLM"):18>note?Z("PWP"):24>note?Z("MFX"):32>note?Z("Kewlers"):40>note?Z("Bypass"):48>note?Z("TPOLM"):56>note?Z("Alien Prophets"):Z("Atebit"):13==s?8>note?Z("knos"):12>note?Z("p01"):18>note?Z("grid23"):24>note?Z("brothomstates"):32>note?Z("gasman"):40>note?Z("bartman"):48>note?Z("wullon"):56>note?Z("fell"):Z("cb"):
14==s?8>note?Z("GlenZ"):12>note?Z("Farbrausch"):18>note?Z("Quite"):24>note?Z("TPOLM"):32>note?Z("Matt Current"):40>note?Z("Cyberpunks Unity"):48>note?Z("TPOLM"):56>note?Z("Kosmoplovci"):Z("Haujobb"):15==s&&(16>note?Z("hear hear if you're awake",{color:"#0e0"}):32>note?Z("we know our haterz gonna hate",{color:"#e00"}):48>note?Z("fuckings to them from parsley state",{color:"#00e"}):Z("we ain't likely to hibernate",{color:"#0e0"})),F=!0)}})()};
