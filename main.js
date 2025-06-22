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

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("fetchButton");
  const result = document.getElementById("result");
  const skinContainer = document.getElementById("skin-viewer");

  button.addEventListener("click", async () => {
    const username = document.getElementById("usernameInput").value;
    result.textContent = "Loading...";

    try {
      const url = await getSkinURL(username);

      // Clear old model
      skinContainer.innerHTML = "";

      const viewer = new skinview3d.SkinViewer({
        canvas: undefined,
        width: 300,
        height: 400,
        skin: url
      });

      skinContainer.appendChild(viewer.canvas);

      // Optional animation
      viewer.controls.enableZoom = true;
      viewer.animation = new skinview3d.IdleAnimation();
      viewer.animation.speed = 1;

      result.textContent = ""; // Clear status
    } catch (err) {
      result.textContent = `Error: ${err.message}`;
    }
  });
});
