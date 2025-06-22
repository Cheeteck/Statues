async function getSkinURL(username) {
    const uuidRes = await fetch(`https://corsproxy.io/?https://api.mojang.com/users/profiles/minecraft/${username}`);
    if (!uuidRes.ok) throw new Error("Username not found");
    const uuidData = await uuidRes.json();
    const uuid = uuidData.id;
  
    const profileRes = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
    const profileData = await profileRes.json();
    const base64 = profileData.properties[0].value;
    const decoded = JSON.parse(atob(base64));
  
    const skinURL = decoded.textures.SKIN.url;
    return skinURL;
  }
  
  async function fetchSkin() {
    const username = document.getElementById("usernameInput").value;
    const result = document.getElementById("result");
    result.textContent = "Loading...";
  
    try {
      const url = await getSkinURL(username);
      result.innerHTML = `Skin URL: <a href="${url}" target="_blank">${url}</a><br><img src="${url}" width="64" height="64">`;
    } catch (err) {
      result.textContent = `Error: ${err.message}`;
    }
  }
  