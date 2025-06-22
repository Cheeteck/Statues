async function getSkinURL(username) {
  // same as before using corsproxy
}

async function fetchSkin() {
  const result = document.getElementById('result');
  const canvas = document.getElementById('skinCanvas');
  const username = document.getElementById('usernameInput').value;

  result.textContent = 'Loading...';
  try {
    const skinURL = await getSkinURL(username);
    result.textContent = '';
    new PrismarineViewer.SkinViewer(canvas, { skin: skinURL, width: 300, height: 400 });
  } catch(err) {
    result.textContent = 'Error: ' + err.message;
  }
}
