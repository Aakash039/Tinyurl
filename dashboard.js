const API_BASE = "/api/links";

// Elements
const form = document.getElementById("create-form");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");
const tableBody = document.getElementById("linksTableBody");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");

//load all links on page load
async function loadLinks() {
  tableBody.innerHTML = ""; 
  emptyState.style.display = "none";

  const res = await fetch(API_BASE);
  const links = await res.json();

  if (links.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  links.forEach((l) => addRow(l));
}

//add a row to the table
function addRow(links) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td><a href="/code/${links.code}">${links.code}</a></td>
    <td class="truncate">${links.targetUrl}</td>
    <td>${links.clicks}</td>
    <td>${links.lastClickedAt ? new Date(links.lastClickedAt).toLocaleString() : "—"}</td>
    <td>
      <button class="action-btn copy-btn" onclick="copyLink('${links.code}')">Copy</button>
      <button class="action-btn delete-btn" onclick="deleteLink('${links.code}')">Delete</button>
    </td>
  `;

  tableBody.appendChild(tr);
}

//handle create link
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  formMessage.textContent = "";
  submitBtn.disabled = true;
  submitBtn.textContent = "Processing...";

  const body = {
    targetUrl: form.targetUrl.value,
    code: form.code.value || undefined
  };

  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  submitBtn.disabled = false;
  submitBtn.textContent = "Shorten";

  if (!res.ok) {
    formMessage.textContent = data.error || "Something went wrong.";
    formMessage.style.color = "red";
    return;
  }

  formMessage.textContent = "Link created successfully!";
  formMessage.style.color = "green";

  form.reset();
  loadLinks();
});

//delete link
async function deleteLink(code) {
  await fetch(`${API_BASE}/${code}`, { method: "DELETE" });
  loadLinks();
}

//copy link
function copyLink(code) {
  const fullUrl = `${window.location.origin}/${code}`;
  navigator.clipboard.writeText(fullUrl);
  alert("Copied: " + fullUrl);
}

//search filter
searchInput.addEventListener("input", async (e) => {
  const term = e.target.value.toLowerCase();

  const rows = tableBody.querySelectorAll("tr");
  rows.forEach((row) => {
    const code = row.children[0].innerText.toLowerCase();
    const url = row.children[1].innerText.toLowerCase();

    row.style.display =
      code.includes(term) || url.includes(term) ? "" : "none";
  });
});
// Initial load
loadLinks();
