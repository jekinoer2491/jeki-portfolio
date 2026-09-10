import * as THREE from 'three';
import { gsap } from 'gsap';
import './style.css';

const loader = document.querySelector('#loader');
const progressText = document.querySelector('#progress');
const loaderLine = document.querySelector('.loader-line i');

let progress = 0;
const timer = setInterval(() => {
  progress += Math.floor(Math.random() * 7) + 3;
  progress = Math.min(progress, 100);
  progressText.textContent = String(progress).padStart(3, '0') + '%';
  loaderLine.style.width = progress + '%';
  if (progress >= 100) {
    clearInterval(timer);
    gsap.to(loader, { yPercent: -100, duration: 1.2, ease: 'power4.inOut', delay: .35 });
    gsap.from('.hero > *', { y: 35, opacity: 0, duration: 1, stagger: .1, delay: 1.1, ease: 'power3.out' });
  }
}, 70);

const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, .1, 100);
camera.position.z = 7;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

scene.add(new THREE.AmbientLight(0xffffff, 1.5));
const key = new THREE.DirectionalLight(0xffffff, 5);
key.position.set(3, 4, 5);
scene.add(key);

const ring = new THREE.Mesh(
  new THREE.TorusGeometry(1.45, .055, 24, 128),
  new THREE.MeshStandardMaterial({ color: 0xd7d7d7, metalness: 1, roughness: .16 })
);
ring.position.set(2.15, .25, 0);
ring.rotation.set(.35, .2, -.35);
scene.add(ring);

const mouse = { x: 0, y: 0 };
const target = { x: 0, y: 0 };
addEventListener('pointermove', e => {
  target.x = (e.clientX / innerWidth - .5) * 2;
  target.y = (e.clientY / innerHeight - .5) * 2;
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

const clock = new THREE.Clock();
function animate() {
  const t = clock.getElapsedTime();
  mouse.x += (target.x - mouse.x) * .045;
  mouse.y += (target.y - mouse.y) * .045;

  ring.rotation.x += .002;
  ring.rotation.z += .003;
  ring.rotation.y += (mouse.x * .45 - ring.rotation.y) * .035;
  ring.position.x += (2.15 + mouse.x * .25 - ring.position.x) * .035;
  ring.position.y += (.25 - mouse.y * .2 + Math.sin(t) * .08 - ring.position.y) * .035;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

document.querySelectorAll('.magnetic').forEach(button => {
  button.addEventListener('pointermove', e => {
    const r = button.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(button, { x: x * .12, y: y * .18, duration: .35 });
  });
  button.addEventListener('pointerleave', () => gsap.to(button, { x: 0, y: 0, duration: .5 }));
});
