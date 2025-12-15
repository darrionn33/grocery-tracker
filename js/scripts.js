// get data

// Mock Data (Initial State)
const initialInventoryMock = [
  { name: "Bread", quantity: 1, unit: "loaf", min: 1, price: 50, lastUpdatedAt: "01/12/25" },
  { name: "Milk", quantity: 6, unit: "carton", min: 3, price: 40, lastUpdatedAt: "01/12/25" },
  { name: "Broccolo", quantity: 9, unit: "head", min: 4, price: 30, lastUpdatedAt: "01/12/25" },
  { name: "Pasta", quantity: 2, unit: "pack", min: 4, price: 60, lastUpdatedAt: "01/12/25" },
];

const initialPurchasesMock = [
  { name: "Milk", quantity: 6, unit: "500ml", price: 40, date: "2025-12-01" },
  { name: "Milk", quantity: 6, unit: "500ml", price: 40, date: "2025-12-01" },
  { name: "Milk", quantity: 6, unit: "500ml", price: 40, date: "2025-12-01" },
  { name: "Milk", quantity: 6, unit: "500ml", price: 40, date: "2025-12-02" },
  { name: "Milk", quantity: 6, unit: "500ml", price: 40, date: "2025-12-02" },
  { name: "Milk", quantity: 6, unit: "500ml", price: 40, date: "2025-12-02" },
  { name: "Milk", quantity: 6, unit: "500ml", price: 40, date: "2025-12-02" },
  { name: "Milk", quantity: 6, unit: "500ml", price: 40, date: "2025-12-02" },
  { name: "Milk", quantity: 6, unit: "500ml", price: 40, date: "2025-12-02" },
  { name: "Milk", quantity: 6, unit: "500ml", price: 40, date: "2025-12-02" },
  { name: "Milk", quantity: 6, unit: "500ml", price: 40, date: "2025-12-02" },
  { name: "Milk", quantity: 6, unit: "500ml", price: 40, date: "2025-12-02" },
  { name: "Milk", quantity: 6, unit: "500ml", price: 40, date: "2025-12-02" },
  { name: "Milk", quantity: 6, unit: "500ml", price: 40, date: "2025-12-02" },
];

const initialUsageMock = [
  { name: "Milk", quantity: 1, unit: "carton", date: "2025-12-05" },
  { name: "Bread", quantity: 0.5, unit: "loaf", date: "2025-12-06" },
];

// Local Storage Handlers
const getStoredData = (key, defaultData) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultData;
};

const saveData = () => {
  localStorage.setItem('inventory', JSON.stringify(inventory));
  localStorage.setItem('purchases', JSON.stringify(purchases));
  localStorage.setItem('usage', JSON.stringify(usage));
};

let inventory = getStoredData('inventory', initialInventoryMock);
let purchases = getStoredData('purchases', initialPurchasesMock);
let usage = getStoredData('usage', initialUsageMock);

const resetData = (loadDemo) => {
    if (loadDemo) {
        inventory = JSON.parse(JSON.stringify(initialInventoryMock));
        purchases = JSON.parse(JSON.stringify(initialPurchasesMock));
        usage = JSON.parse(JSON.stringify(initialUsageMock));
    } else {
        inventory = [];
        purchases = [];
        usage = [];
    }
    saveData();
    // Refresh current page
    const currentPageIndex = parseInt(document.querySelector('.bottom-nav-bar .selected').dataset.page);
    generatePage(currentPageIndex);
};

const openSettingsModal = () => {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalContent.style.textAlign = "center";
  modalContent.style.maxHeight = "90vh";
  modalContent.style.overflowY = "auto";
  
  const closeBtn = document.createElement("span");
  closeBtn.classList.add("close");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => modal.remove();
  
  const title = document.createElement("h3");
  title.innerText = "Settings";
  title.style.color = "teal";
  title.style.marginBottom = "20px";

  // Reset Section
  const resetSection = document.createElement("div");
  resetSection.style.marginBottom = "20px";
  resetSection.style.borderBottom = "1px solid #555";
  resetSection.style.paddingBottom = "20px";
  
  const resetBtn = document.createElement("button");
  resetBtn.innerText = "Reset All Data";
  resetBtn.style.width = "100%";
  resetBtn.style.backgroundColor = "#d9534f"; // Red
  resetBtn.style.color = "white";
  resetBtn.onclick = () => {
      openResetModal(); // Keeps existing logic, just triggers it from here
      modal.remove();
  };
  resetSection.appendChild(resetBtn);

  // Export Section
  const exportSection = document.createElement("div");
  exportSection.style.marginBottom = "20px";
  exportSection.innerHTML = "<h4 style='color:#ccc; margin-bottom:10px;'>Export Data</h4>";
  
  const exportArea = document.createElement("textarea");
  exportArea.style.width = "100%";
  exportArea.style.height = "100px";
  exportArea.style.backgroundColor = "#222";
  exportArea.style.color = "#fff";
  exportArea.style.border = "1px solid #555";
  exportArea.style.marginBottom = "10px";
  exportArea.readOnly = true;
  exportArea.value = JSON.stringify({ inventory, purchases, usage }, null, 2);
  
  const copyBtn = document.createElement("button");
  copyBtn.innerText = "Copy to Clipboard";
  copyBtn.style.width = "100%";
  copyBtn.onclick = () => {
    exportArea.select();
    document.execCommand("copy"); // Fallback
    navigator.clipboard.writeText(exportArea.value).then(() => {
        copyBtn.innerText = "Copied!";
        setTimeout(() => copyBtn.innerText = "Copy to Clipboard", 2000);
    });
  };
  exportSection.appendChild(exportArea);
  exportSection.appendChild(copyBtn);

  // Import Section
  const importSection = document.createElement("div");
  importSection.innerHTML = "<h4 style='color:#ccc; margin-bottom:10px;'>Import Data</h4>";
  
  const importArea = document.createElement("textarea");
  importArea.style.width = "100%";
  importArea.style.height = "100px";
  importArea.style.backgroundColor = "#222";
  importArea.style.color = "#fff";
  importArea.style.border = "1px solid #555";
  importArea.style.marginBottom = "10px";
  importArea.placeholder = "Paste data here...";
  
  const importBtn = document.createElement("button");
  importBtn.innerText = "Import Data";
  importBtn.style.width = "100%";
  importBtn.style.backgroundColor = "teal";
  importBtn.onclick = () => {
      try {
          const data = JSON.parse(importArea.value);
          if (data.inventory && data.purchases && data.usage) {
            inventory = data.inventory;
            purchases = data.purchases;
            usage = data.usage;
            saveData();
            generatePage(2);
            modal.remove();
            alert("Data imported successfully!");
          } else {
              alert("Invalid data structure. Missing inventory, purchases, or usage.");
          }
      } catch (e) {
          alert("Invalid JSON data. Please check your text.");
      }
  };
  importSection.appendChild(importArea);
  importSection.appendChild(importBtn);

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(title);
  modalContent.appendChild(resetSection);
  modalContent.appendChild(exportSection);
  modalContent.appendChild(importSection);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
};

const openResetModal = () => {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.style.zIndex = "2100"; // Higher than settings modal if open
  
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalContent.style.textAlign = "center";
  
  const closeBtn = document.createElement("span");
  closeBtn.classList.add("close");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => modal.remove();
  
  const title = document.createElement("h3");
  title.innerText = "Reset Data";
  title.style.color = "teal";

  const msg = document.createElement("p");
  msg.innerText = "Do you want to clear all data or load demo data?";
  msg.style.marginBottom = "20px";
  msg.style.color = "#ccc";

  const btnContainer = document.createElement("div");
  btnContainer.style.display = "flex";
  btnContainer.style.justifyContent = "space-around";
  btnContainer.style.gap = "10px";

  const clearBtn = document.createElement("button");
  clearBtn.innerText = "Clear All (Empty)";
  clearBtn.style.padding = "10px";
  clearBtn.style.backgroundColor = "#d9534f";
  clearBtn.style.color = "white";
  clearBtn.style.border = "none";
  clearBtn.style.borderRadius = "5px";
  clearBtn.style.cursor = "pointer";
  clearBtn.onclick = () => { resetData(false); modal.remove(); };

  const demoBtn = document.createElement("button");
  demoBtn.innerText = "Load Demo Data";
  demoBtn.style.padding = "10px";
  demoBtn.style.backgroundColor = "teal";
  demoBtn.style.color = "white";
  demoBtn.style.border = "none";
  demoBtn.style.borderRadius = "5px";
  demoBtn.style.cursor = "pointer";
  demoBtn.onclick = () => { resetData(true); modal.remove(); };

  btnContainer.appendChild(clearBtn);
  btnContainer.appendChild(demoBtn);

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(title);
  modalContent.appendChild(msg);
  modalContent.appendChild(btnContainer);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
};

// bottom nav bar highlighting & functionality

document.querySelectorAll(".bottom-nav-bar > *").forEach((option) => {
  option.onclick = () => {
    document
      .querySelectorAll(".bottom-nav-bar > *")
      .forEach((item) => item.classList.remove("selected"));
    option.classList.add("selected");
    generatePage(+option.dataset.page);
  };
});

// function to format YYYY-MM-DD to DD MMM YYYY

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);

  // Get suffix
  function getSuffix(d) {
    if (d >= 11 && d <= 13) return "th"; // special case
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  const suffix = getSuffix(day);

  // Month names
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${day}${suffix} ${months[month - 1]} ${year}`;
}

// page generation

const generatePage = (page) => {
  const pageDiv = document.querySelector(".page");
  pageDiv.replaceChildren();

  switch (page) {
    case 0:
      renderPurchasesPage(pageDiv);
      break;
    case 1:
      renderUsagePage(pageDiv);
      break;
    case 2:
      renderInventoryPage(pageDiv);
      break;
  }
};

const renderPurchasesPage = (pageDiv) => {
  let filtersDiv = document.createElement("div");
  filtersDiv.classList.add("filters");

  let searchBar = document.createElement("input");
  searchBar.placeholder = "Search...";

  let dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.name = "purchase-date";
  dateInput.id = "purchase-date";
  filtersDiv.appendChild(searchBar);
  filtersDiv.appendChild(dateInput);

  const purchasesDiv = document.createElement("div");
  purchasesDiv.classList.add("purchases");

  searchBar.oninput = (searchTerm) => {
    if (typeof dateInput.value === "string") {
      generatePurchases(
        purchasesDiv,
        dateInput.value,
        searchTerm.target.value
      );
    } else {
      generatePurchases(purchasesDiv, null, searchTerm.target.value);
    }
  };

  dateInput.onchange = (date) => {
    if (typeof searchBar.value === "string") {
      generatePurchases(purchasesDiv, date.target.value, searchBar.value);
    } else {
      generatePurchases(purchasesDiv, date.target.value, null);
    }
  };

  pageDiv.appendChild(filtersDiv);
  pageDiv.appendChild(purchasesDiv);

  generatePurchases(purchasesDiv);
  renderFAB("purchase");
};

const renderUsagePage = (pageDiv) => {
  const usageDiv = document.createElement("div");
  usageDiv.classList.add("usage-list");

  // Sort by date descending
  const sortedUsage = usage.sort((a, b) => new Date(b.date) - new Date(a.date));

  sortedUsage.forEach((item) => {
    let card = document.createElement("div");
    card.classList.add("usage-card");

    let name = document.createElement("div");
    name.innerText = item.name;
    name.classList.add("name");

    let details = document.createElement("div");
    details.innerText = `${item.quantity} ${item.unit} on ${formatDate(item.date)}`;
    details.classList.add("details");

    card.appendChild(name);
    card.appendChild(details);
    usageDiv.appendChild(card);
  });

  pageDiv.appendChild(usageDiv);
  renderFAB("usage");
};

const renderInventoryPage = (pageDiv) => {
  let filtersDiv = document.createElement("div");
  filtersDiv.classList.add("filters");

  let searchBar = document.createElement("input");
  searchBar.placeholder = "Search...";

  ["In", "Almost", "Out"].forEach((status, index) => {
    const btn = document.createElement("button");
    btn.classList.add(status.toLowerCase());
    btn.innerText = status;

    btn.onclick = () => {
      [...filtersDiv.children].forEach((btn, index) => {
        if (index < 3) {
          btn.style.backgroundColor = "transparent";
        }
      });
      btn.style.backgroundColor = getComputedStyle(btn).outlineColor;

      if (typeof searchBar.value === "string") {
        generateInventory(inventoryDiv, index, searchBar.value);
      } else {
        generateInventory(inventoryDiv, index);
      }

      if (filtersDiv.children.length < 4) {
        const clearButton = document.createElement("button");
        clearButton.innerText = "Clear";
        filtersDiv.appendChild(clearButton);

        clearButton.onclick = () => {
          [...filtersDiv.children].forEach(
            (btn) => (btn.style.backgroundColor = "transparent")
          );
          generateInventory(inventoryDiv);
          filtersDiv.removeChild(clearButton);
        };
      }
    };
    filtersDiv.appendChild(btn);
  });

  const inventoryDiv = document.createElement("div");
  inventoryDiv.classList.add("inventory");



  // Search Container with Reset Button
  const searchContainer = document.createElement("div");
  searchContainer.style.display = "flex";
  searchContainer.style.alignItems = "center";
  searchContainer.style.gap = "10px";
  searchContainer.style.marginBottom = "10px";

  searchBar.style.flex = "1";
  searchBar.style.marginBottom = "0"; // Override if needed
  
  const settingsBtn = document.createElement("button");
  settingsBtn.innerHTML = '<span class="material-symbols-outlined">settings</span>';
  settingsBtn.style.padding = "10px";
  settingsBtn.style.borderRadius = "50%";
  settingsBtn.style.border = "none";
  settingsBtn.style.backgroundColor = "transparent";
  settingsBtn.style.color = "#888";
  settingsBtn.style.cursor = "pointer";
  settingsBtn.style.display = "flex";
  settingsBtn.style.alignItems = "center";
  settingsBtn.style.justifyContent = "center";
  settingsBtn.title = "Settings";
  settingsBtn.onclick = () => openSettingsModal();
  settingsBtn.onmouseover = () => settingsBtn.style.color = "teal";
  settingsBtn.onmouseout = () => settingsBtn.style.color = "#888";

  searchContainer.appendChild(searchBar);
  searchContainer.appendChild(settingsBtn);

  inventoryDiv.appendChild(searchContainer);

  searchBar.oninput = (searchTerm) => {
    generateInventory(inventoryDiv, 3, searchTerm.target.value);
  };

  pageDiv.appendChild(searchContainer); // Add container specifically
  pageDiv.appendChild(filtersDiv);
  pageDiv.appendChild(inventoryDiv);

  generateInventory(inventoryDiv);
  
  // Remove FAB if exists
  const existingFab = document.querySelector(".fab");
  if (existingFab) existingFab.remove();
};

// generate inventory items

const generateInventory = (inventoryDiv, index = 3, searchTerm) => {
  inventoryDiv.replaceChildren();
  inventory
    .filter((i) => {
      switch (index) {
        case 0:
          return i.quantity > i.min;
        case 1:
          return i.quantity == i.min;
        case 2:
          return i.quantity < i.min;
        case 3:
          return true;
      }
    })
    .filter((i) => {
      if (searchTerm == "" || !searchTerm) {
        return true;
      } else {
        return i.name.toLowerCase().startsWith(searchTerm.toLowerCase());
      }
    })
    .forEach((item) => {
      inventoryDiv.appendChild(generateInventoryCard(item));
    });
};

//generate inventory cards

const generateInventoryCard = (item) => {
  let inventoryCardDiv = document.createElement("div");
  inventoryCardDiv.classList.add("inventory-card");
  let nameDiv = document.createElement("p");
  nameDiv.classList.add("name");
  nameDiv.innerText = item.name;
  let qtyDiv = document.createElement("p");
  qtyDiv.classList.add("qty");

  if (item.quantity > item.min) {
    qtyDiv.classList.add("in");
  } else if (item.quantity == item.min) {
    qtyDiv.classList.add("almost");
  } else {
    qtyDiv.classList.add("out");
  }

  qtyDiv.innerText = item.quantity;
  let dateDiv = document.createElement("p");
  dateDiv.classList.add("date");
  dateDiv.innerText = item.lastUpdatedAt;

  inventoryCardDiv.appendChild(nameDiv);
  inventoryCardDiv.appendChild(qtyDiv);
  inventoryCardDiv.appendChild(dateDiv);
  
  inventoryCardDiv.onclick = () => openEditInventoryModal(item);

  return inventoryCardDiv;
};

// generate date-total div

const generateDateTotalDiv = (date) => {
  let dateTotalDiv = document.createElement("div");
  dateTotalDiv.classList.add("date-total");

  let dateSpan = document.createElement("span");
  dateSpan.innerText = formatDate(date);

  let totalSpan = document.createElement("span");
  totalSpan.innerText =
    "₹ " +
    purchases.reduce((acc, purchase) => {
      if (purchase.date == date) {
        return acc + purchase.quantity * purchase.price;
      } else {
        return acc;
      }
    }, 0);
  dateTotalDiv.appendChild(dateSpan);
  dateTotalDiv.appendChild(totalSpan);

  return dateTotalDiv;
};

// generate purchase list

const generatePurchases = (purchasesDiv, filterDate, searchTerm) => {
  purchasesDiv.replaceChildren();
  const allDates = purchases.map((p) => p.date);
  const uniqueDates = [...new Set(allDates)];
  uniqueDates.sort().reverse();

  uniqueDates.forEach((date) => {
    purchases
      .filter((i) => {
        if (typeof searchTerm == "string") {
          if (searchTerm !== "") {
            return (
              i.date == date &&
              i.name.toLowerCase().startsWith(searchTerm.toLowerCase())
            );
          } else {
            return i.date == date;
          }
        } else {
          return i.date == date;
        }
      })
      .filter((i, index) => {
        if (typeof filterDate == "string") {
          if (filterDate !== "") {
            if (i.date == filterDate && index == 0) {
              purchasesDiv.appendChild(generateDateTotalDiv(date));
            }
            return i.date == date && i.date == filterDate;
          } else {
            if (index == 0) {
              purchasesDiv.appendChild(generateDateTotalDiv(date));
            }
            return i.date == date;
          }
        } else {
          if (index == 0) {
            purchasesDiv.appendChild(generateDateTotalDiv(date));
          }
          return i.date == date;
        }
      })
      .forEach((purchase) => {
        purchasesDiv.appendChild(generatePurchaseCard(purchase));
      });
  });
};

// generate purchase card

const generatePurchaseCard = (purchase) => {
  let purchaseCardDiv = document.createElement("div");
  purchaseCardDiv.classList.add("purchase-card");
  let nameDiv = document.createElement("div");
  nameDiv.classList.add("name");
  nameDiv.innerText = purchase.name;
  let qtyDiv = document.createElement("div");
  qtyDiv.classList.add("quantity");
  qtyDiv.innerText = purchase.quantity;
  let priceDiv = document.createElement("div");
  priceDiv.classList.add("price");
  priceDiv.innerText = "₹ " + purchase.price;
  let unitDiv = document.createElement("div");
  unitDiv.classList.add("unit");
  unitDiv.innerText = purchase.unit;
  let amtDiv = document.createElement("div");
  amtDiv.classList.add("amount");
  amtDiv.innerText = "₹ " + purchase.price * purchase.quantity;

  purchaseCardDiv.appendChild(nameDiv);
  purchaseCardDiv.appendChild(qtyDiv);
  purchaseCardDiv.appendChild(priceDiv);
  purchaseCardDiv.appendChild(unitDiv);
  purchaseCardDiv.appendChild(amtDiv);

  return purchaseCardDiv;
};

// FAB and Modal Logic

const renderFAB = (type) => {
  // Remove existing FAB if any
  const existingFab = document.querySelector(".fab");
  if (existingFab) existingFab.remove();

  const fab = document.createElement("button");
  fab.classList.add("fab");
  fab.innerHTML = '<span class="material-symbols-outlined">add</span>';
  fab.onclick = () => openModal(type);
  document.body.appendChild(fab);
};

const openModal = (type) => {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  
  const closeBtn = document.createElement("span");
  closeBtn.classList.add("close");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => modal.remove();
  
  const form = document.createElement("form");
  form.onsubmit = (e) => {
    e.preventDefault();
    if (type === "purchase") handlePurchaseSubmit(e.target);
    if (type === "usage") handleUsageSubmit(e.target);
    modal.remove();
  };

  const inventoryOptions = inventory.map(i => `<option value="${i.name}">${i.name}</option>`).join("");
  const itemSelectHTML = `
    <select name="name" required onchange="this.form.unit.value = this.options[this.selectedIndex].dataset.unit || ''; this.form.price.value = this.options[this.selectedIndex].dataset.price || ''">
      <option value="" disabled selected>Select Item</option>
      ${inventory.map(i => `<option value="${i.name}" data-unit="${i.unit || ''}" data-price="${i.price || ''}">${i.name}</option>`).join("")}
      <option value="new">+ Add New Item</option>
    </select>
  `;

  // Helper to handle switching between select and input
  const handleNameChangeScript = `
    const select = this.form.name;
    const nameInput = this.form.customName;
    const unitInput = this.form.unit;
    const priceInput = this.form.price;
    
    if (select.value === 'new') {
       select.style.display = 'none';
       nameInput.style.display = 'block';
       nameInput.required = true;
       select.required = false;
       nameInput.focus();
       unitInput.value = '';
       unitInput.readOnly = false;
       if(priceInput) {
         priceInput.value = '';
         priceInput.readOnly = false;
       }
    } else {
       const selectedOption = select.options[select.selectedIndex];
       unitInput.value = selectedOption.dataset.unit || '';
       unitInput.readOnly = true;
       if(priceInput) {
         priceInput.value = selectedOption.dataset.price || '';
         // priceInput.readOnly = true; // Maybe allow editing price? User might buy at different price.
       }
    }
  `;

  if (type === "purchase") {
    form.innerHTML = `
      <h3>Add Purchase</h3>
      ${itemSelectHTML}
      <input type="text" name="customName" placeholder="Item Name" style="display:none">
      <input type="number" name="quantity" placeholder="Quantity" step="0.1" required>
      <input type="text" name="unit" placeholder="Unit (e.g., kg, pcs)" required>
      <input type="number" name="price" placeholder="Price per Unit" required>
      <input type="date" name="date" required value="${new Date().toISOString().split('T')[0]}">
      <button type="submit">Add Purchase</button>
    `;
  } else if (type === "usage") {
    form.innerHTML = `
      <h3>Add Usage</h3>
      ${itemSelectHTML}
      <input type="text" name="customName" placeholder="Item Name" style="display:none">
      <input type="number" name="quantity" placeholder="Quantity" step="0.1" required>
      <input type="text" name="unit" placeholder="Unit (e.g., kg, pcs)" required>
      <input type="date" name="date" required value="${new Date().toISOString().split('T')[0]}">
      <button type="submit">Add Usage</button>
    `;
  }

  // Attach event listener for dropdown change
  const selectElement = form.querySelector('select[name="name"]');
  selectElement.onchange = function() {
    const nameInput = form.querySelector('input[name="customName"]');
    const unitInput = form.querySelector('input[name="unit"]');
    const priceInput = form.querySelector('input[name="price"]');
    
    if (this.value === 'new') {
        this.style.display = 'none';
        nameInput.style.display = 'block';
        nameInput.required = true;
        this.required = false; // Disable select requirement
        nameInput.focus();
        unitInput.value = '';
        unitInput.readOnly = false;
        if (priceInput) priceInput.value = '';
    } else {
        const selectedOption = this.options[this.selectedIndex];
        unitInput.value = selectedOption.dataset.unit || '';
        unitInput.readOnly = true;
        
        if (priceInput) {
            priceInput.value = selectedOption.dataset.price || '';
        }
    }
  };


  modalContent.appendChild(closeBtn);
  modalContent.appendChild(form);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

const openEditInventoryModal = (item) => {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  
  const closeBtn = document.createElement("span");
  closeBtn.classList.add("close");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => modal.remove();
  
  const form = document.createElement("form");
  form.innerHTML = `
      <h3>Edit ${item.name}</h3>
      <label>Name</label>
      <input type="text" name="name" value="${item.name}" required>
      <label>Quantity</label>
      <input type="number" name="quantity" value="${item.quantity}" step="0.1" required>
      <label>Unit</label>
      <input type="text" name="unit" value="${item.unit || ''}" required>
      <label>Min Stock</label>
      <input type="number" name="min" value="${item.min || 0}" required>
      <label>Price</label>
      <input type="number" name="price" value="${item.price || ''}" placeholder="Price">
      <button type="submit">Save Changes</button>
  `;
  
  form.onsubmit = (e) => {
      e.preventDefault();
      
      const originalName = item.name;
      const newName = form.name.value;
      const newUnit = form.unit.value;

      // Update item
      item.name = newName;
      item.quantity = parseFloat(form.quantity.value);
      item.unit = newUnit;
      item.min = parseFloat(form.min.value);
      if (form.price.value) item.price = parseFloat(form.price.value);
      
      // Cascading Updates: Update history if name or unit changed
      purchases.forEach(p => {
         if (p.name === originalName) {
             p.name = newName;
             p.unit = newUnit;
         }
      });
      
      usage.forEach(u => {
         if (u.name === originalName) {
             u.name = newName;
             u.unit = newUnit;
         }
      });
      
      saveData(); // Save changes
      generatePage(2); // Refresh Inventory Page
      modal.remove();
  };

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(form);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
};

const handlePurchaseSubmit = (form) => {
  const isNewItem = form.name.style.display === 'none';
  const itemName = isNewItem ? form.customName.value : form.name.value;
  
  const newPurchase = {
    name: itemName,
    quantity: parseFloat(form.quantity.value),
    unit: form.unit.value,
    price: parseFloat(form.price.value),
    date: form.date.value
  };
  purchases.push(newPurchase);

  // Update Inventory
  const existingItem = inventory.find(i => i.name.toLowerCase() === itemName.toLowerCase());
  if (existingItem) {
    existingItem.quantity += newPurchase.quantity;
    existingItem.lastUpdatedAt = formatDate(newPurchase.date); // Using formatted date for display consistency? Or should act as date string? Mock data uses "DD/MM/YY" format or similar.
    // The mock data uses "01/12/25" (DD/MM/YY). formatDate returns "DDth MMM YYYY".
    // I will stick to simple string for now or better, update with YYYY-MM-DD and let display handle it.
    // Actually mock data has "01/12/25". Let's just use the form date YYYY-MM-DD for consistency with new entries if we were rewriting, 
    // but to match existing display style maybe I should format it or just leave it.
    // The current display uses the string directly.
    // Let's us DD/MM/YY to match existing mock data style if possible, or just the YYYY-MM-DD.
    // Given the mix, I'll use YYYY-MM-DD as it's cleaner.
    existingItem.lastUpdatedAt = newPurchase.date; 
  } else {
    // New Item
    inventory.push({
      name: itemName,
      quantity: newPurchase.quantity,
      unit: newPurchase.unit,
      min: 0, // Default min
      lastUpdatedAt: newPurchase.date
    });
  }

  saveData(); // Save changes
  generatePage(0); // Refresh purchases page
};

const handleUsageSubmit = (form) => {
  const isNewItem = form.name.style.display === 'none';
  const itemName = isNewItem ? form.customName.value : form.name.value;

  const newUsage = {
    name: itemName,
    quantity: parseFloat(form.quantity.value),
    unit: form.unit.value,
    date: form.date.value
  };
  usage.push(newUsage);

  // Update Inventory
  const existingItem = inventory.find(i => i.name.toLowerCase() === itemName.toLowerCase());
  if (existingItem) {
    existingItem.quantity -= newUsage.quantity;
    existingItem.lastUpdatedAt = newUsage.date;
  } else {
    // Usage for item not in inventory? Add it with negative quantity?
    inventory.push({
        name: itemName,
        quantity: -newUsage.quantity,
        unit: newUsage.unit,
        min: 0,
        lastUpdatedAt: newUsage.date
    });
  }
  
  saveData(); // Save changes
  generatePage(1); // Refresh usage page
};


generatePage(2);
