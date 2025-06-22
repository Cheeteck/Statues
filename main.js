// === Set up THREE.js scene ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('viewer').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
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

// === Skin Fetching ===
async function getSkinURL(username) {
  const r = await fetch(`https://corsproxy.io/?https://api.mojang.com/users/profiles/minecraft/${username}`);
  if (!r.ok) throw new Error("Username not found");
  const { id } = await r.json();

  const r2 = await fetch(`https://corsproxy.io/?https://sessionserver.mojang.com/session/minecraft/profile/${id}`);
  const { properties } = await r2.json();
  const { url } = JSON.parse(atob(properties[0].value)).textures.SKIN;
  return url;
}

// === Clear old model ===
function clearModel() {
  scene.traverse(obj => {
    if (obj.userData.isPlayer) {
      scene.remove(obj);
      obj.geometry?.dispose?.();
      obj.material?.dispose?.();
    }
  });
}

// === Create a basic cube body model ===
function createPlayerModel(texture) {
  const group = new THREE.Group();
  group.userData.isPlayer = true;

  const material = new THREE.MeshBasicMaterial({ map: texture });
  material.map.magFilter = THREE.NearestFilter;

  const geometry = new THREE.BoxGeometry(1, 2, 1); // Basic body shape
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 1, 0); // Lift so bottom is on ground
  group.add(mesh);

  scene.add(group);
}

// === Fetch skin + build model ===
async function fetchSkin() {
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
