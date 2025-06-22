import * as THREE from './libs/three.module.js';
import { OrbitControls } from './libs/OrbitControls.js';

const canvas = document.getElementById('skinCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(300, 300);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;

const light = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(light);

let skinMesh = null;

async function getSkinURL(username) {
  const uuidRes = await fetch(`https://corsproxy.io/?https://api.mojang.com/users/profiles/minecraft/${username}`);
  if (!uuidRes.ok) throw new Error("Username not found");
  const uuidData = await uuidRes.json();
  const uuid = uuidData.id;

  const profileRes = await fetch(`https://corsproxy.io/?https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
  const profileData = await profileRes.json();
  const base64 = profileData.properties[0].value;
  const decoded = JSON.parse(atob(base64));

  return decoded.textures.SKIN.url;
}

async function fetchSkin() {
  const username = document.getElementById("usernameInput").value;
  const result = document.getElementById("result");
  result.textContent = "Loading...";

  try {
    const url = await getSkinURL(username);
    result.textContent = "";

    const texture = new THREE.TextureLoader().load(url, () => {
      if (skinMesh) {
        scene.remove(skinMesh);
      }

      const geometry = new THREE.BoxGeometry(1, 2, 0.5);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      skinMesh = new THREE.Mesh(geometry, material);
      scene.add(skinMesh);
    });
  } catch (err) {
    result.textContent = `Error: ${err.message}`;
  }
}

function animate() {
  requestAnimationFrame(animate);
  if (skinMesh) skinMesh.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.fetchSkin = fetchSkin; // <-- so it works from HTML onclick
