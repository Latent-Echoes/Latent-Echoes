import { archiveRecords } from "./data.js";

const sortState = {
  key: "date",
  direction: "desc"
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
  const left = a[key].toLowerCase();
  const right = b[key].toLowerCase();
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

  document.getElementById("pm-date").textContent = record.date;
  document.getElementById("pm-project").textContent = record.project;
  document.getElementById("pm-meta").textContent = `${record.failureType} | ${record.technicalKey}`;
  document.getElementById("pm-abstract").textContent = record.abstract;
  document.getElementById("pm-breaking-point").textContent = record.breakingPoint;
  document.getElementById("pm-pivot").textContent = record.pivot;

  preview.innerHTML = `
    <h3 class="repository-heading text-2xl">${record.project}</h3>
    <p class="mt-4 max-w-3xl text-sm uppercase tracking-[0.15em] text-neutral-700">${record.date} | ${record.failureType}</p>
    <p class="mt-4 max-w-3xl leading-7 text-neutral-800">${record.pivot}</p>
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
    row.className = "border-b border-black align-top";

    row.innerHTML = `
      <td class="border-r border-black px-4 py-4 text-sm">${record.date}</td>
      <td class="border-r border-black px-4 py-4 text-base">${record.project}</td>
      <td class="border-r border-black px-4 py-4 text-sm">${record.failureType}</td>
      <td class="px-4 py-4">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <span class="text-sm">${record.technicalKey}</span>
          <button
            type="button"
            class="open-record border border-black px-3 py-1 text-xs uppercase tracking-[0.1em] hover:bg-black hover:text-white"
            data-record-id="${record.id}"
          >
            View Post-Mortem
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });

  document.querySelectorAll(".open-record").forEach((button) => {
    button.addEventListener("click", () => {
      const record = archiveRecords.find((entry) => entry.id === button.dataset.recordId);
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
