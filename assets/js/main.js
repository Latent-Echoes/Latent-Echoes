import { archiveRecords } from "./data.js";

const sortState = {
  key: "serial",
  direction: "asc"
};

const sectionFiles = {
  header: "sections/header.html",
  table: "sections/archive-table.html",
  postmortem: "sections/postmortem.html"
};

async function loadSection(targetId, file) {
  const target = document.getElementById(targetId);
  const response = await fetch(file);
  target.innerHTML = await response.text();
}

function compareValues(a, b, key) {
  const left = String(a[key]).toLowerCase();
  const right = String(b[key]).toLowerCase();
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function getSortedRecords() {
  const records = [...archiveRecords].sort((a, b) => compareValues(a, b, sortState.key));
  return sortState.direction === "asc" ? records : records.reverse();
}

function openPostmortem(record) {
  const dialog = document.getElementById("postmortem-dialog");
  const preview = document.getElementById("postmortem-preview");

  document.getElementById("pm-id").textContent = `[${record.serial}]`;
  document.getElementById("pm-title").textContent = record.title;
  document.getElementById("pm-meta").textContent = `${record.class} | ${record.status}`;
  document.getElementById("pm-objective").textContent = record.objective;
  document.getElementById("pm-bottleneck").textContent = record.bottleneck;
  document.getElementById("pm-pivot").textContent = record.pivot;

  preview.innerHTML = `
    <h3 class="repository-heading text-2xl">${record.title}</h3>
    <p class="mono-id mt-3 text-xs uppercase tracking-[0.15em]">[${record.serial}]</p>
    <p class="mt-2 text-xs uppercase tracking-[0.12em]">${record.class} | ${record.status}</p>
    <p class="mt-4 max-w-3xl text-sm leading-6">${record.pivot}</p>
  `;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  }
}

function renderTable() {
  const tbody = document.getElementById("archive-tbody");
  const sortStatus = document.getElementById("sort-status");

  const directionLabel = sortState.direction === "asc" ? "ascending" : "descending";
  sortStatus.textContent = `Sort: ${sortState.key} ${directionLabel}`;

  tbody.innerHTML = "";

  getSortedRecords().forEach((record) => {
    const row = document.createElement("tr");
    row.className = "hairline-b align-top hover:bg-[color:var(--paper-soft)]";

    row.innerHTML = `
      <td class="hairline-r px-3 py-2 text-xs">
        <span class="mono-id">[${record.serial}]</span>
      </td>
      <td class="hairline-r px-3 py-2 text-sm">${record.title}</td>
      <td class="hairline-r px-3 py-2 text-xs uppercase tracking-[0.1em]">${record.class}</td>
      <td class="px-3 py-2">
        <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span class="text-xs uppercase tracking-[0.1em]">${record.status}</span>
          <button
            type="button"
            class="open-record hairline px-2 py-1 text-[11px] uppercase tracking-[0.1em] hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)]"
            data-record-id="${record.serial}"
          >
            Open Notebook
          </button>
        </div>
      </td>
    `;

    row.addEventListener("click", (event) => {
      if (event.target instanceof HTMLElement && event.target.closest("button")) {
        return;
      }
      openPostmortem(record);
    });

    tbody.appendChild(row);
  });

  document.querySelectorAll(".open-record").forEach((button) => {
    button.addEventListener("click", () => {
      const record = archiveRecords.find((entry) => entry.serial === button.dataset.recordId);
      if (record) openPostmortem(record);
    });
  });
}

function initSorting() {
  const sortableButtons = document.querySelectorAll(".sortable");
  sortableButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.sortKey;
      if (!key) return;

      if (sortState.key === key) {
        sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
      } else {
        sortState.key = key;
        sortState.direction = "asc";
      }

      renderTable();
    });
  });
}

function initDialog() {
  const dialog = document.getElementById("postmortem-dialog");
  const closeButton = document.getElementById("close-postmortem");

  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const dialogDimensions = dialog.getBoundingClientRect();
    const isInside =
      event.clientX >= dialogDimensions.left &&
      event.clientX <= dialogDimensions.right &&
      event.clientY >= dialogDimensions.top &&
      event.clientY <= dialogDimensions.bottom;

    if (!isInside) dialog.close();
  });
}

async function init() {
  await Promise.all([
    loadSection("header-slot", sectionFiles.header),
    loadSection("table-slot", sectionFiles.table),
    loadSection("postmortem-slot", sectionFiles.postmortem)
  ]);

  renderTable();
  initSorting();
  initDialog();
}

init();
