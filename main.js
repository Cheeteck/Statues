import * as THREE from './libs/three.module.js';
import { OrbitControls } from './libs/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);
controls.update();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

function clearModel() {
  scene.traverse(obj => {
    if (obj.userData.isPlayer) {
      scene.remove(obj);
      obj.geometry?.dispose?.();
      obj.material?.dispose?.();
    }
  });
}

async function getSkinURL(username) {
  const r = await fetch(`https://corsproxy.io/?https://api.mojang.com/users/profiles/minecraft/${username}`);
  if (!r.ok) throw new Error("Username not found");
  const { id } = await r.json();

  const r2 = await fetch(`https://corsproxy.io/?https://sessionserver.mojang.com/session/minecraft/profile/${id}`);
  const { properties } = await r2.json();
  const { url } = JSON.parse(atob(properties[0].value)).textures.SKIN;
  return url;
}

function createPlayerModel(texture) {
  const group = new THREE.Group();
  group.userData.isPlayer = true;

  const material = new THREE.MeshBasicMaterial({ map: texture });
  material.map.magFilter = THREE.NearestFilter;

  const geometry = new THREE.BoxGeometry(1, 2, 1); // basic box
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 1, 0);
  group.add(mesh);

  scene.add(group);
}

window.fetchSkin = async function () {
  const username = document.getElementById("usernameInput").value.trim();
  const result = document.getElementById("result");
  result.textContent = "Loading...";
  clearModel();

  try {
    const url = await getSkinURL(username);
    const loader = new THREE.TextureLoader();
    loader.load(url, (texture) => {
      createPlayerModel(texture);
      result.textContent = "";
    });
  } catch (err) {
    result.textContent = `Error: ${err.message}`;
  }
}
