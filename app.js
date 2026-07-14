const treatments = {
  "根管": [
    ["前牙顯微根管", "1.5萬"],
    ["小臼齒顯微根管", "2萬"],
    ["大臼齒顯微根管", "2.5萬"],
    ["活髓治療", "1萬"],
    ["移除斷針", "5仟"]
  ],
  "假牙": [
    ["臨時牙套", "3仟"],
    ["纖維釘", "3仟"],
    ["固定假牙", "1.5-3萬"],
    ["牙橋", "1.5-3萬"],
    ["活動假牙(一頷)", "5萬"],
    ["植牙假牙", "4.5萬"]
  ],
  "牙周": [
    ["牙周再生手術", "2.6-3萬"],
    ["拔牙補骨", "2.6-2.8萬"],
    ["拔牙補骨", "2.8-3萬"],
    ["拔牙補骨", "3-3.2萬"],
    ["牙冠增長術", "1.2萬"],
    ["牙冠增長術", "1.5萬"],
    ["植牙手術", "4.5萬"],
    ["植牙補骨", "2.6-3萬"],
    ["上顎竇增高術", "1.5-2.5萬"],
    ["游離牙齦移植術", "2萬"],
    ["牙根覆蓋手術", "1.5萬"]
  ]
};

const toothNames = {
  UR8: "右上第三大臼齒", UR7: "右上第二大臼齒", UR6: "右上第一大臼齒", UR5: "右上第二小臼齒",
  UR4: "右上第一小臼齒", UR3: "右上犬齒", UR2: "右上側門牙", UR1: "右上正中門牙",
  UL1: "左上正中門牙", UL2: "左上側門牙", UL3: "左上犬齒", UL4: "左上第一小臼齒",
  UL5: "左上第二小臼齒", UL6: "左上第一大臼齒", UL7: "左上第二大臼齒", UL8: "左上第三大臼齒",
  LR8: "右下第三大臼齒", LR7: "右下第二大臼齒", LR6: "右下第一大臼齒", LR5: "右下第二小臼齒",
  LR4: "右下第一小臼齒", LR3: "右下犬齒", LR2: "右下側門牙", LR1: "右下正中門牙",
  LL1: "左下正中門牙", LL2: "左下側門牙", LL3: "左下犬齒", LL4: "左下第一小臼齒",
  LL5: "左下第二小臼齒", LL6: "左下第一大臼齒", LL7: "左下第二大臼齒", LL8: "左下第三大臼齒"
};

const toothNumbers = {
  UR1: "11", UR2: "12", UR3: "13", UR4: "14", UR5: "15", UR6: "16", UR7: "17", UR8: "18",
  UL1: "21", UL2: "22", UL3: "23", UL4: "24", UL5: "25", UL6: "26", UL7: "27", UL8: "28",
  LL1: "31", LL2: "32", LL3: "33", LL4: "34", LL5: "35", LL6: "36", LL7: "37", LL8: "38",
  LR1: "41", LR2: "42", LR3: "43", LR4: "44", LR5: "45", LR6: "46", LR7: "47", LR8: "48"
};

const toothNameToNumber = Object.fromEntries(
  Object.entries(toothNames).map(([code, name]) => [name, toothNumbers[code]])
);

const toothLayout = [
  ["UR8", 37, 74, "upper"], ["UR7", 64, 74, "upper"], ["UR6", 90, 73, "upper"], ["UR5", 114, 76, "upper"],
  ["UR4", 132, 74, "upper"], ["UR3", 153, 71, "upper"], ["UR2", 173, 75, "upper"], ["UR1", 191, 73, "upper"],
  ["UL1", 214, 73, "upper"], ["UL2", 233, 73, "upper"], ["UL3", 253, 71, "upper"], ["UL4", 276, 72, "upper"],
  ["UL5", 293, 74, "upper"], ["UL6", 316, 72, "upper"], ["UL7", 342, 72, "upper"], ["UL8", 369, 75, "upper"],
  ["LR8", 34, 133, "lower"], ["LR7", 62, 134, "lower"], ["LR6", 89, 135, "lower"], ["LR5", 114, 136, "lower"],
  ["LR4", 136, 137, "lower"], ["LR3", 156, 137, "lower"], ["LR2", 175, 137, "lower"], ["LR1", 193, 133, "lower"],
  ["LL1", 212, 133, "lower"], ["LL2", 230, 137, "lower"], ["LL3", 249, 137, "lower"], ["LL4", 270, 136, "lower"],
  ["LL5", 291, 137, "lower"], ["LL6", 316, 135, "lower"], ["LL7", 345, 135, "lower"], ["LL8", 372, 133, "lower"]
];

let rows = [];
let activeIndex = 0;
let selectedCategory = "";

const els = {
  patientImage: document.getElementById("patientImage"),
  printPatientImage: document.getElementById("printPatientImage"),
  printPatientBox: document.getElementById("printPatientBox"),
  pasteArea: document.getElementById("pasteArea"),
  pasteHint: document.getElementById("pasteHint"),
  patientText: document.getElementById("patientText"),
  printPatientText: document.getElementById("printPatientText"),
  tableBody: document.getElementById("tableBody"),
  totalCell: document.getElementById("totalCell"),
  status: document.getElementById("status"),
  categoryGrid: document.getElementById("categoryGrid"),
  treatmentSelect: document.getElementById("treatmentSelect"),
  activeRowLabel: document.getElementById("activeRowLabel"),
  toothButtons: document.getElementById("toothButtons")
};

function init() {
  rows = Array.from({ length: 4 }, createEmptyRow);
  buildCategoryButtons();
  buildToothButtons();
  renderTable();
  bindEvents();
  syncPatientPrint();
}

function bindEvents() {
  document.getElementById("addRowBtn").addEventListener("click", () => addRow(true));
  document.getElementById("removeEmptyBtn").addEventListener("click", removeEmptyRows);
  document.getElementById("finishBtn").addEventListener("click", finishForm);
  document.getElementById("printBtn").addEventListener("click", printPdf);
  document.getElementById("applyTreatmentBtn").addEventListener("click", applyTreatment);
  document.getElementById("clearPatientBtn").addEventListener("click", clearPatient);
  els.treatmentSelect.addEventListener("change", applyTreatment);
  els.patientText.addEventListener("input", syncPatientPrint);
  els.pasteArea.addEventListener("paste", handlePaste);
  els.pasteArea.addEventListener("click", () => els.pasteArea.focus());
}

function buildCategoryButtons() {
  els.categoryGrid.innerHTML = "";
  Object.keys(treatments).forEach(category => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "category-btn";
    btn.textContent = category;
    btn.addEventListener("click", () => selectCategory(category));
    els.categoryGrid.appendChild(btn);
  });
}

function selectCategory(category) {
  selectedCategory = category;
  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.classList.toggle("active", btn.textContent === category);
  });
  els.treatmentSelect.innerHTML = `<option value="">請選擇${category}項目</option>`;
  treatments[category].forEach(([name, amount], index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${name}（${amount}）`;
    els.treatmentSelect.appendChild(option);
  });
}

function buildToothButtons() {
  els.toothButtons.innerHTML = "";
  toothLayout.forEach(([code, x, y, rowType]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `tooth-button ${rowType}`;
    btn.style.left = `${(x / 410) * 100}%`;
    btn.style.top = `${(y / 205) * 100}%`;
    btn.title = `${code} ${toothNames[code]}`;
    btn.setAttribute("aria-label", `${code} ${toothNames[code]}`);
    btn.dataset.code = code;
    btn.addEventListener("click", () => applyTooth(code));
    els.toothButtons.appendChild(btn);
  });
}

function renderTable() {
  els.tableBody.innerHTML = "";
  rows.forEach((row, index) => {
    const tr = document.createElement("tr");
    const groupInfo = getGroupInfo(index);
    tr.className = [
      index === activeIndex ? "active-row" : "",
      groupInfo.isGrouped ? "group-row" : "",
      groupInfo.isStart ? "group-start" : "",
      groupInfo.isEnd ? "group-end" : "",
      groupInfo.isSingle ? "single-row-group" : ""
    ].filter(Boolean).join(" ");
    tr.addEventListener("click", () => {
      if (index !== activeIndex) setActiveRow(index);
    });
    ["toothNo", "tooth", "category", "item", "amount"].forEach(key => {
      const td = document.createElement("td");
      td.contentEditable = "true";
      td.textContent = row[key];
      if (key === "toothNo") td.className = "tooth-number";
      if (key === "amount") td.className = "amount-cell";
      td.dataset.index = index;
      td.dataset.key = key;
      td.addEventListener("input", event => {
        rows[index][key] = event.currentTarget.textContent.trim();
        if (key === "tooth") {
          const matchedToothNo = toothNameToNumber[rows[index].tooth];
          if (matchedToothNo) {
            rows[index].toothNo = matchedToothNo;
            const toothNoCell = event.currentTarget.parentElement.querySelector('[data-key="toothNo"]');
            if (toothNoCell) toothNoCell.textContent = matchedToothNo;
          }
        }
        updateTotal();
      });
      td.addEventListener("focus", () => {
        if (index !== activeIndex) {
          activeIndex = index;
          updateActiveLabel();
        }
      });
      tr.appendChild(td);
    });
    els.tableBody.appendChild(tr);
  });
  updateActiveLabel();
  updateToothHighlights();
  updateTotal();
}

function setActiveRow(index) {
  activeIndex = Math.max(0, Math.min(index, rows.length - 1));
  renderTable();
}

function addRow(makeActive = false) {
  rows.push(createEmptyRow());
  if (makeActive) activeIndex = rows.length - 1;
  renderTable();
}

function removeEmptyRows() {
  rows = rows.filter(row => row.toothNo || row.tooth || row.category || row.item || row.amount);
  if (rows.length === 0) addRow(false);
  activeIndex = Math.min(activeIndex, rows.length - 1);
  renderTable();
  setStatus("已刪除空白列");
}

function applyTooth(code) {
  ensureActiveRow();
  rows[activeIndex].toothNo = toothNumbers[code];
  rows[activeIndex].tooth = toothNames[code];
  renderTable();
  setStatus(`已帶入牙位：${toothNumbers[code]} ${toothNames[code]}`);
}

function applyTreatment() {
  const itemIndex = Number(els.treatmentSelect.value);
  if (!selectedCategory || Number.isNaN(itemIndex)) return;
  ensureActiveRow();
  const found = treatments[selectedCategory][itemIndex];
  if (!found) return;
  const [item, amount] = found;
  rows[activeIndex].category = selectedCategory;
  rows[activeIndex].item = item;
  rows[activeIndex].amount = amount;
  if (rows[activeIndex].tooth && activeIndex === rows.length - 1) addRow(false);
  renderTable();
  setStatus(`已帶入：${item}`);
}

function ensureActiveRow() {
  if (!rows[activeIndex]) addRow(true);
}

function createEmptyRow() {
  return { toothNo: "", tooth: "", category: "", item: "", amount: "" };
}

function rowGroupKey(row) {
  return String(row.toothNo || row.tooth || "").trim();
}

function getGroupInfo(index) {
  const key = rowGroupKey(rows[index]);
  if (!key) {
    return { isGrouped: false, isStart: false, isEnd: false, isSingle: false };
  }
  const prevKey = index > 0 ? rowGroupKey(rows[index - 1]) : "";
  const nextKey = index < rows.length - 1 ? rowGroupKey(rows[index + 1]) : "";
  const isStart = key !== prevKey;
  const isEnd = key !== nextKey;
  return {
    isGrouped: true,
    isStart,
    isEnd,
    isSingle: isStart && isEnd
  };
}

function updateActiveLabel() {
  els.activeRowLabel.textContent = `目前列：第 ${activeIndex + 1} 列`;
}

function updateToothHighlights() {
  const usedToothNames = new Set(rows.map(row => row.tooth).filter(Boolean));
  document.querySelectorAll(".tooth-button").forEach(btn => {
    btn.classList.toggle("active", usedToothNames.has(toothNames[btn.dataset.code]));
  });
}

function parseAmount(value) {
  const text = String(value || "").trim();
  if (!text) return null;
  const unit = text.includes("仟") ? 0.1 : 1;
  const clean = text.replace(/[萬仟元,\s]/g, "");
  const match = clean.match(/^(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?$/);
  if (!match) return null;
  const min = Number(match[1]) * unit;
  const max = Number(match[2] || match[1]) * unit;
  return { min, max };
}

function formatWan(value) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}萬` : `${rounded.toFixed(1)}萬`;
}

function updateTotal() {
  let min = 0;
  let max = 0;
  let count = 0;
  rows.forEach(row => {
    const amount = parseAmount(row.amount);
    if (!amount) return;
    min += amount.min;
    max += amount.max;
    count += 1;
  });
  if (!count) {
    els.totalCell.textContent = "";
  } else if (Math.abs(min - max) < 0.0001) {
    els.totalCell.textContent = formatWan(min);
  } else {
    els.totalCell.textContent = `${formatWan(min)}-${formatWan(max)}`;
  }
}

function handlePaste(event) {
  const items = Array.from(event.clipboardData?.items || []);
  const imageItem = items.find(item => item.type.startsWith("image/"));
  if (imageItem) {
    event.preventDefault();
    const file = imageItem.getAsFile();
    const reader = new FileReader();
    reader.onload = () => {
      setPatientImage(reader.result);
      setStatus("已貼上病患截圖");
    };
    reader.readAsDataURL(file);
    return;
  }
  const text = event.clipboardData?.getData("text/plain");
  if (text) {
    event.preventDefault();
    els.patientText.value = [els.patientText.value, text].filter(Boolean).join("\n");
    syncPatientPrint();
  }
}

function setPatientImage(src) {
  els.patientImage.src = src;
  els.patientImage.style.display = "block";
  els.printPatientImage.src = src;
  els.printPatientBox.classList.add("has-image");
  els.pasteHint.style.display = "none";
}

function syncPatientPrint() {
  els.printPatientText.textContent = els.patientText.value;
}

function clearPatient() {
  els.patientImage.removeAttribute("src");
  els.patientImage.style.display = "none";
  els.printPatientImage.removeAttribute("src");
  els.printPatientBox.classList.remove("has-image");
  els.patientText.value = "";
  els.pasteHint.style.display = "block";
  syncPatientPrint();
  setStatus("已清除病患資料");
}

function finishForm() {
  removeEmptyRows();
  const incomplete = rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => row.toothNo || row.tooth || row.category || row.item || row.amount)
    .filter(({ row }) => !row.toothNo || !row.tooth || !row.category || !row.item || !row.amount);
  if (incomplete.length) {
    activeIndex = incomplete[0].index;
    renderTable();
    setStatus(`第 ${activeIndex + 1} 列尚未填完整`);
    return false;
  }
  setStatus("已完成，可輸出 PDF");
  return true;
}

function printPdf() {
  if (!finishForm()) return;
  window.print();
}

function setStatus(message) {
  els.status.textContent = message;
}

init();
