import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js';
import { SkinViewer } from 'https://cdn.jsdelivr.net/npm/skinview3d@1.6.0/dist/skinview3d.module.js';

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

let viewer;

export async function fetchSkin() {
  const username = document.getElementById("usernameInput").value.trim();
  const result = document.getElementById("result");
  const container = document.getElementById("skin-viewer");
  result.textContent = "Loading...";

  try {
    const skinURL = await getSkinURL(username);

    if (viewer) {
      viewer.dispose();
      container.innerHTML = "";
    }

    viewer = new SkinViewer({
      width: 300,
      height: 400,
      canvas: document.createElement("canvas"),
    });

    container.appendChild(viewer.canvas);
    viewer.loadSkin(skinURL);

    result.textContent = "";
  } catch (err) {
    result.textContent = `Error: ${err.message}`;
  }
}

// Make fetchSkin available on global scope for inline onclick
window.fetchSkin = fetchSkin;
