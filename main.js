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
  
  let viewer;  // Declare viewer outside so it can be reused
  
  async function fetchSkin() {
    const username = document.getElementById("usernameInput").value.trim();
    const result = document.getElementById("result");
    const container = document.getElementById("skin-viewer");
    result.textContent = "Loading...";
  
    try {
      const skinURL = await getSkinURL(username);
  
      // Clear previous viewer if exists
      if (viewer) {
        viewer.dispose();
        container.innerHTML = "";
      }
  
      // Create new viewer and load skin
      viewer = new skinview3d.SkinViewer({
        width: 300,
        height: 400,
        canvas: document.createElement("canvas"),
      });
  
      container.appendChild(viewer.canvas);
      viewer.loadSkin(skinURL);
  
      result.textContent = ""; // Clear loading text
    } catch (err) {
      result.textContent = `Error: ${err.message}`;
    }
  }
  