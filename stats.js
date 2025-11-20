async function loadStats() {
  const pathParts = window.location.pathname.split('/');
  const code = pathParts[pathParts.length - 1];

  const codeTitle = document.getElementById('codeTitle');
  const targetUrl = document.getElementById('targetUrl');
  const totalClicks = document.getElementById('totalClicks');
  const lastClickedAt = document.getElementById('lastClickedAt');
  const createdAt = document.getElementById('createdAt');

  try {
    const res = await fetch(`/api/links/${code}`);
    const data = await res.json();

    if (!res.ok) {
      codeTitle.textContent = 'Link not found';
      return;
    }

    codeTitle.textContent = `Stats for ${data.code}`;
    targetUrl.textContent = data.targetUrl;
    totalClicks.textContent = data.totalClicks;
    lastClickedAt.textContent = data.lastClickedAt
      ? new Date(data.lastClickedAt).toLocaleString()
      : '-';
    createdAt.textContent = data.createdAt
      ? new Date(data.createdAt).toLocaleString()
      : '-';
  } catch (err) {
    console.error('Error fetching stats:', err);
    codeTitle.textContent = 'Error loading stats';
  }
}

loadStats();
