import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const loader=document.querySelector('#loader'),bar=document.querySelector('#load-bar'),num=document.querySelector('#load-num');
let p=0; const timer=setInterval(()=>{p+=Math.random()*12+4;if(p>=100){p=100;clearInterval(timer);setTimeout(()=>{gsap.to(loader,{yPercent:-100,duration:1.15,ease:'power4.inOut'});},300)}bar.style.width=p+'%';num.textContent=String(Math.round(p)).padStart(2,'0')},75);

const nav=document.querySelector('.nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30),{passive:true});

const cursor=document.querySelector('#cursor');let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
function cursorLoop(){cx+=(mx-cx)*.18;cy+=(my-cy)*.18;cursor.style.left=cx+'px';cursor.style.top=cy+'px';requestAnimationFrame(cursorLoop)} cursorLoop();
document.querySelectorAll('[data-cursor]').forEach(el=>{el.addEventListener('mouseenter',()=>{cursor.classList.add('active');cursor.querySelector('span').textContent=el.dataset.cursor});el.addEventListener('mouseleave',()=>cursor.classList.remove('active'))});

document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('mousemove',e=>{if(matchMedia('(pointer:coarse)').matches)return;const r=el.getBoundingClientRect();gsap.to(el,{x:(e.clientX-r.left-r.width/2)*.18,y:(e.clientY-r.top-r.height/2)*.18,duration:.35,ease:'power3.out'})});el.addEventListener('mouseleave',()=>gsap.to(el,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'}))});

const sceneEl=document.querySelector('#scene3d');const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(35,innerWidth/innerHeight,.1,100);camera.position.z=6;
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);sceneEl.appendChild(renderer.domElement);
const group=new THREE.Group();scene.add(group);
const ring=new THREE.Mesh(new THREE.TorusGeometry(1.35,.055,24,120),new THREE.MeshStandardMaterial({color:0xd8d8d8,metalness:1,roughness:.18}));group.add(ring);
const ring2=new THREE.Mesh(new THREE.TorusGeometry(1.8,.018,16,100),new THREE.MeshStandardMaterial({color:0x888888,metalness:1,roughness:.25,transparent:true,opacity:.55}));ring2.rotation.y=.8;group.add(ring2);
scene.add(new THREE.AmbientLight(0xffffff,.35));const key=new THREE.DirectionalLight(0xffffff,2.4);key.position.set(3,3,4);scene.add(key);const fill=new THREE.DirectionalLight(0x999999,1.2);fill.position.set(-4,-2,2);scene.add(fill);
let tx=0,ty=0;window.addEventListener('mousemove',e=>{tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5)});
function render(){group.rotation.x+=(ty*.45-group.rotation.x)*.035;group.rotation.y+=(tx*.65-group.rotation.y)*.035;ring.rotation.z+=.0025;ring2.rotation.z-=.0015;const mobile=innerWidth<800;group.position.set(mobile?.8:1.35,mobile?.15:.05,mobile?-.4:0);group.scale.setScalar(mobile?.72:1);renderer.render(scene,camera);requestAnimationFrame(render)} render();
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7))});

const portrait=document.querySelector('.portrait');window.addEventListener('mousemove',e=>{if(matchMedia('(pointer:coarse)').matches)return;const x=(e.clientX/innerWidth-.5)*10,y=(e.clientY/innerHeight-.5)*6;gsap.to(portrait,{x:x,y:y,duration:1.1,ease:'power3.out'})});

gsap.utils.toArray('.reveal-text').forEach(el=>ScrollTrigger.create({trigger:el,start:'top 82%',onEnter:()=>el.classList.add('visible')}));
gsap.utils.toArray('.cap').forEach(el=>ScrollTrigger.create({trigger:el,start:'top 88%',onEnter:()=>el.classList.add('visible')}));
ScrollTrigger.create({trigger:'.steps',start:'top 80%',onEnter:()=>document.querySelector('.steps').classList.add('visible')});
const preview=document.querySelector('#preview'),pt=document.querySelector('#preview-title');document.querySelectorAll('.project').forEach(card=>{card.addEventListener('mouseenter',()=>{if(matchMedia('(pointer:coarse)').matches)return;pt.textContent=card.dataset.title;preview.style.display='flex';gsap.fromTo(preview,{opacity:0,scale:.8},{opacity:1,scale:1,duration:.35})});card.addEventListener('mousemove',e=>{if(matchMedia('(pointer:coarse)').matches)return;gsap.to(preview,{left:e.clientX,top:e.clientY,duration:.35,ease:'power3.out'})});card.addEventListener('mouseleave',()=>{preview.style.display='none'})});

gsap.to('.hero-copy',{y:-60,opacity:.82,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});gsap.to('.portrait-wrap',{y:'-55%',ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
