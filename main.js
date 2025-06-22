async function getSkinURL(username) {
  const uuidRes = await fetch(
    `https://corsproxy.io/?https://api.mojang.com/users/profiles/minecraft/${username}`
  );
  if (!uuidRes.ok) throw new Error("Username not found");
  const uuidData = await uuidRes.json();
  const uuid = uuidData.id;

  const profileRes = await fetch(
    `https://corsproxy.io/?https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`
  );
  if (!profileRes.ok) throw new Error("Failed to fetch profile");
  const profileData = await profileRes.json();
  const decoded = JSON.parse(atob(profileData.properties[0].value));

  return decoded.textures.SKIN.url;
}

let viewer;

async function fetchSkin() {
  const username = document.getElementById("usernameInput").value.trim();
  const result = document.getElementById("result");
  const container = document.getElementById("skin-viewer");

  result.textContent = "Loading...";
  try {
    const skinURL = await getSkinURL(username);

    // Clear old viewer
    container.innerHTML = "";

    // Create viewer
    viewer = new skinview3d.SkinViewer({
      width: 300,
      height: 400,
      skin: skinURL,
      canvas: undefined // let it auto-create a canvas
    });

    container.appendChild(viewer.canvas);
    viewer.controls.enableRotate = true;

    const walk = new skinview3d.WalkingAnimation();
    viewer.animation = walk;
    walk.speed = 1;
    walk.play();

    result.textContent = "";
  } catch (err) {
    result.textContent = `Error: ${err.message}`;
  }
}
