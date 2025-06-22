async function getSkinURL(username) {
  const uuidRes = await fetch(`https://corsproxy.io/?https://api.mojang.com/users/profiles/minecraft/${username}`);
  if (!uuidRes.ok) throw new Error("Username not found");
  const uuidData = await uuidRes.json();
  const uuid = uuidData.id;

  const profileRes = await fetch(`https://corsproxy.io/?https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
  const profileData = await profileRes.json();
  const decoded = JSON.parse(atob(profileData.properties[0].value));

  return decoded.textures.SKIN.url;
}

function fetchSkin() {
  const username = document.getElementById("usernameInput").value.trim();
  const result = document.getElementById("result");
  const container = document.getElementById("viewer");

  result.textContent = "Loading...";
  container.innerHTML = "";

  getSkinURL(username)
    .then(skinUrl => {
      const viewer = new skinview3d.SkinViewer({
        width: 300,
        height: 400,
        skin: skinUrl
      });
      container.appendChild(viewer.canvas);

      viewer.controls.enableZoom = true;
      viewer.animation = new skinview3d.WalkingAnimation();
      viewer.animation.speed = 1;
      viewer.animation.play();

      result.textContent = "";
    })
    .catch(err => {
      result.textContent = `Error: ${err.message}`;
    });
}
