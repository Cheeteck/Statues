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
  const viewerDiv = document.getElementById("viewer");

  result.textContent = "Loading...";

  try {
    const skinUrl = await getSkinURL(username);
    result.textContent = ""; // Clear result

    // Clear old viewer
    viewerDiv.innerHTML = "";

    const skinViewer = new skinview3d.SkinViewer({
      canvas: viewerDiv.appendChild(document.createElement("canvas")),
      width: 300,
      height: 400,
      skin: skinUrl
    });

    skinViewer.controls.enableZoom = true;
    skinViewer.animation = new skinview3d.WalkingAnimation();
    skinViewer.animation.speed = 1;
    skinViewer.animation.play();

  } catch (err) {
    result.textContent = `Error: ${err.message}`;
  }
}
