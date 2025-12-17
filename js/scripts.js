// get data

// Mock Data (Initial State)
const initialInventoryMock = [
  {
    name: "Bread",
    quantity: 1,
    unit: "loaf",
    min: 1,
    price: 50,
    lastUpdatedAt: "01/12/25",
  },
  {
    name: "Milk",
    quantity: 6,
    unit: "carton",
    min: 3,
    price: 40,
    lastUpdatedAt: "01/12/25",
  },
  {
    name: "Broccolo",
    quantity: 9,
    unit: "head",
    min: 4,
    price: 30,
    lastUpdatedAt: "01/12/25",
  },
  {
    name: "Pasta",
    quantity: 2,
    unit: "pack",
    min: 4,
    price: 60,
    lastUpdatedAt: "01/12/25",
  },
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
  localStorage.setItem("inventory", JSON.stringify(inventory));
  localStorage.setItem("purchases", JSON.stringify(purchases));
  localStorage.setItem("usage", JSON.stringify(usage));
};

let inventory = getStoredData("inventory", initialInventoryMock);
let purchases = getStoredData("purchases", initialPurchasesMock);
let usage = getStoredData("usage", initialUsageMock);

const resetData = (loadDemo) => {
  if (loadDemo) {
    // Generate Dynamic Demo Data for last 7 days
    const items = ["Milk", "Bread", "Potato", "Sugar"];
    const units = { Milk: "L", Bread: "loaf", Potato: "kg", Sugar: "kg" };
    const prices = { Milk: 60, Bread: 40, Potato: 30, Sugar: 45 };

    inventory = [];
    purchases = [];
    usage = [];

    // Initialize Inventory with baseline
    items.forEach((name) => {
      inventory.push({
        name: name,
        quantity: Math.floor(Math.random() * 5) + 2, // Random 2-6
        unit: units[name],
        min: 2,
        price: prices[name],
        lastUpdatedAt: new Date().toISOString().split("T")[0],
      });
    });

    // Generate History
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      items.forEach((name) => {
        // Randomly purchase
        if (Math.random() > 0.7) {
          const qty = Math.floor(Math.random() * 3) + 1;
          purchases.push({
            name: name,
            quantity: qty,
            unit: units[name],
            price: prices[name],
            date: dateStr,
          });
          // Update inventory?
          // Since we set a random baseline inventory above, strict correlation isn't required for "demo" feel,
          // BUT it's better if we just say "Inventory is result of this".
          // Let's adjust inventory:
          // actually, let's just make the inventory purely the result of these txns?
          // No, that might result in 0 or negative if we add usage.
          // Let's just create random independent history for the graph visuals
          // and let the inventory be the random baseline we set.
          // The user asked for "demo list using...".
          // To keep it simple and robust:
          // 1. Transactions are created.
          // 2. Inventory is just set to a "good state" manually.
        }

        // Randomly use
        if (Math.random() > 0.6) {
          const qty = Math.floor(Math.random() * 2) + 0.5;
          usage.push({
            name: name,
            quantity: qty,
            unit: units[name],
            date: dateStr,
          });
        }
      });
    }
  } else {
    inventory = [];
    purchases = [];
    usage = [];
  }
  saveData();
  // Refresh current page
  const navActive = document.querySelector(".nav .nav__item--active");
  const currentPageIndex = navActive ? parseInt(navActive.dataset.page) : 2;
  generatePage(currentPageIndex);
};

const openSettingsModal = () => {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal__content");

  const closeBtn = document.createElement("span");
  closeBtn.classList.add("modal__close");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => modal.remove();

  const title = document.createElement("h3");
  title.innerText = "Settings";
  title.classList.add("modal__title");

  // Reset Section
  const resetSection = document.createElement("div");
  resetSection.classList.add("modal__section");

  const resetBtn = document.createElement("button");
  resetBtn.innerText = "Reset All Data";
  resetBtn.classList.add("btn", "btn--danger", "btn--full");
  resetBtn.onclick = () => {
    openResetModal(); // Keeps existing logic, just triggers it from here
    modal.remove();
  };
  resetSection.appendChild(resetBtn);

  // Export Section
  const exportSection = document.createElement("div");
  exportSection.classList.add("modal__section");
  exportSection.innerHTML = "<h4 class='modal__subtitle'>Export Data</h4>";

  const exportArea = document.createElement("textarea");
  exportArea.classList.add("form__textarea");
  exportArea.readOnly = true;
  exportArea.value = JSON.stringify({ inventory, purchases, usage }, null, 2);

  const copyBtn = document.createElement("button");
  copyBtn.innerText = "Copy to Clipboard";
  copyBtn.classList.add("btn", "btn--primary", "btn--full");
  copyBtn.onclick = () => {
    exportArea.select();
    document.execCommand("copy"); // Fallback
    navigator.clipboard.writeText(exportArea.value).then(() => {
      copyBtn.innerText = "Copied!";
      setTimeout(() => (copyBtn.innerText = "Copy to Clipboard"), 2000);
    });
  };
  exportSection.appendChild(exportArea);
  exportSection.appendChild(copyBtn);

  // Import Section
  const importSection = document.createElement("div");
  importSection.classList.add("modal__section");
  importSection.innerHTML = "<h4 class='modal__subtitle'>Import Data</h4>";

  const importArea = document.createElement("textarea");
  importArea.classList.add("form__textarea");
  importArea.placeholder = "Paste data here...";

  const importBtn = document.createElement("button");
  importBtn.innerText = "Import Data";
  importBtn.classList.add("btn", "btn--primary", "btn--full");
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
        alert(
          "Invalid data structure. Missing inventory, purchases, or usage."
        );
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
  modal.classList.add("modal", "modal--top"); // z-index handling via class

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal__content", "modal__content--center");

  const closeBtn = document.createElement("span");
  closeBtn.classList.add("modal__close");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => modal.remove();

  const title = document.createElement("h3");
  title.innerText = "Reset Data";
  title.classList.add("modal__title");

  const msg = document.createElement("p");
  msg.innerText = "Do you want to clear all data or load demo data?";
  msg.classList.add("modal__msg");

  const btnContainer = document.createElement("div");
  btnContainer.classList.add("modal__actions");

  const clearBtn = document.createElement("button");
  clearBtn.innerText = "Clear All (Empty)";
  clearBtn.classList.add("btn", "btn--danger");
  clearBtn.onclick = () => {
    resetData(false);
    modal.remove();
  };

  const demoBtn = document.createElement("button");
  demoBtn.innerText = "Load Demo Data";
  demoBtn.classList.add("btn", "btn--primary");
  demoBtn.onclick = () => {
    resetData(true);
    modal.remove();
  };

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

document.querySelectorAll(".nav__item").forEach((option) => {
  option.onclick = () => {
    const currentActive = document.querySelector(".nav .nav__item--active");
    const currentPage = currentActive ? +currentActive.dataset.page : 2;
    const targetPage = +option.dataset.page;

    if (currentPage === targetPage) return;

    document
      .querySelectorAll(".nav__item")
      .forEach((item) => item.classList.remove("nav__item--active"));
    option.classList.add("nav__item--active");

    const direction = targetPage > currentPage ? "right" : "left";
    generatePage(targetPage, direction);
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

const generatePage = (page, direction = null) => {
  const appContent = document.querySelector(".app-content");
  appContent.replaceChildren();

  const wrapper = document.createElement("div");
  wrapper.classList.add("page-wrapper");

  if (direction === "right") {
    wrapper.classList.add("slide-in-right");
  } else if (direction === "left") {
    wrapper.classList.add("slide-in-left");
  }

  appContent.appendChild(wrapper);

  switch (page) {
    case 0:
      renderPurchasesPage(wrapper);
      break;
    case 1:
      renderUsagePage(wrapper);
      break;
    case 2:
      renderInventoryPage(wrapper);
      break;
  }
};

const renderPurchasesPage = (pageDiv) => {
  // --- Chart Section ---
  const chartSection = document.createElement("div");
  chartSection.classList.add("chart-section");
  chartSection.style.height = "40vh";
  chartSection.style.display = "flex";
  chartSection.style.flexDirection = "column";
  chartSection.style.marginBottom = "20px";
  chartSection.style.background = "var(--color-surface)";
  chartSection.style.padding = "10px";
  chartSection.style.borderRadius = "var(--border-radius)";

  // Navigation
  const navDiv = document.createElement("div");
  navDiv.style.display = "flex";
  navDiv.style.justifyContent = "space-between";
  navDiv.style.alignItems = "center";
  navDiv.style.marginBottom = "10px";

  const prevBtn = document.createElement("button");
  prevBtn.innerText = "<";
  prevBtn.classList.add("btn", "btn--icon");

  const monthLabel = document.createElement("span");
  monthLabel.style.fontWeight = "bold";
  monthLabel.style.color = "var(--color-text)";

  const nextBtn = document.createElement("button");
  nextBtn.innerText = ">";
  nextBtn.classList.add("btn", "btn--icon");

  navDiv.appendChild(prevBtn);
  navDiv.appendChild(monthLabel);
  navDiv.appendChild(nextBtn);

  // Canvas
  const canvas = document.createElement("canvas");
  canvas.id = "purchaseChart";

  chartSection.appendChild(navDiv);
  chartSection.appendChild(canvas);

  // --- Filters ---
  let filtersDiv = document.createElement("div");
  filtersDiv.classList.add("filter-bar");

  let searchBar = document.createElement("input");
  searchBar.classList.add("form__input", "form__input--search");
  searchBar.placeholder = "Search purchases...";

  const purchasesDiv = document.createElement("div");
  purchasesDiv.classList.add("card-list");

  pageDiv.appendChild(chartSection);
  filtersDiv.appendChild(searchBar);
  pageDiv.appendChild(filtersDiv);
  pageDiv.appendChild(purchasesDiv);

  // --- Logic ---
  let currentChartDate = new Date();
  let chartInstance = null;

  const updateView = () => {
    const year = currentChartDate.getFullYear();
    const month = currentChartDate.getMonth();

    // Update Label
    monthLabel.innerText = currentChartDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    // Update Chart
    chartInstance = renderPurchaseChart(
      canvas,
      purchases,
      year,
      month,
      chartInstance
    );

    // Update List
    renderList(searchBar.value);
  };

  const renderList = (filterTerm = "") => {
    purchasesDiv.replaceChildren();

    const year = currentChartDate.getFullYear();
    const month = currentChartDate.getMonth();

    const sortedPurchases = purchases
      .filter((p) => {
        const d = new Date(p.date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .filter(
        (p) =>
          !filterTerm || p.name.toLowerCase().includes(filterTerm.toLowerCase())
      );

    if (sortedPurchases.length === 0) {
      purchasesDiv.innerHTML = `<p style="text-align:center; color:var(--color-text-muted);">No purchases in ${monthLabel.innerText}.</p>`;
      return;
    }

    let lastDate = null;
    sortedPurchases.forEach((purchase) => {
      if (purchase.date !== lastDate) {
        purchasesDiv.appendChild(generateDateTotalDiv(purchase.date));
        lastDate = purchase.date;
      }
      purchasesDiv.appendChild(generatePurchaseCard(purchase));
    });
  };

  prevBtn.onclick = () => {
    currentChartDate.setMonth(currentChartDate.getMonth() - 1);
    updateView();
  };

  nextBtn.onclick = () => {
    currentChartDate.setMonth(currentChartDate.getMonth() + 1);
    updateView();
  };

  searchBar.oninput = (e) => renderList(e.target.value);

  updateView(); // Initial Render
  renderFAB("purchase");
};

const renderPurchaseChart = (
  canvas,
  allPurchases,
  year,
  month,
  existingChart
) => {
  if (existingChart) existingChart.destroy();

  // 1. Filter Data for Month
  const monthlyData = allPurchases.filter((p) => {
    const d = new Date(p.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  // 2. Aggregate by Day
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dailyTotals = new Array(daysInMonth).fill(0);

  monthlyData.forEach((p) => {
    const day = new Date(p.date).getDate(); // 1-31
    const cost = p.price * p.quantity;
    dailyTotals[day - 1] += cost;
  });

  // 3. Labels
  const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // 4. Render
  return new Chart(canvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Daily Spending (₹)",
          data: dailyTotals,
          borderColor: "#009688", // Teal
          backgroundColor: "rgba(0, 150, 136, 0.1)",
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 3,
          pointBackgroundColor: "#009688",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#333" },
          ticks: { color: "#a0a0a0" },
        },
        x: {
          grid: { display: false },
          ticks: { color: "#a0a0a0", maxTicksLimit: 10 },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => ` ₹ ${context.parsed.y.toFixed(2)}`,
          },
        },
      },
    },
  });
};

const renderUsagePage = (pageDiv) => {
  // Filters & Search
  let filtersDiv = document.createElement("div");
  filtersDiv.classList.add("filter-bar");

  let searchBar = document.createElement("input");
  searchBar.classList.add("form__input", "form__input--search");
  searchBar.placeholder = "Search usage...";

  // Container for Search
  const searchContainer = document.createElement("div");
  searchContainer.classList.add("search-container");
  searchContainer.appendChild(searchBar);

  // Chart Container
  const chartContainer = document.createElement("div");
  chartContainer.classList.add("chart-container");
  chartContainer.style.marginBottom = "20px";
  chartContainer.style.background = "var(--color-surface)";
  chartContainer.style.padding = "10px";
  chartContainer.style.borderRadius = "var(--border-radius)";

  const canvas = document.createElement("canvas");
  canvas.id = "usageChart";
  chartContainer.appendChild(canvas);

  const usageDiv = document.createElement("div");
  usageDiv.classList.add("card-list");

  searchBar.oninput = (e) => {
    generateUsageList(usageDiv, e.target.value);
  };

  pageDiv.appendChild(searchContainer);
  pageDiv.appendChild(chartContainer);
  pageDiv.appendChild(usageDiv);

  generateUsageList(usageDiv);
  renderUsageChart(canvas);
  renderFAB("usage");
};

const formatUnit = (unit, qty) => {
  if (unit && unit.trim() !== "") return unit;
  return qty === 1 ? "no." : "nos.";
};

const generateUsageList = (container, searchTerm = "") => {
  container.replaceChildren();

  // Sort by date descending
  const sortedUsage = usage
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((item) => {
      if (!searchTerm) return true;
      return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

  if (sortedUsage.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.innerText = "No usage history found.";
    emptyMsg.style.color = "var(--color-text-muted)";
    emptyMsg.style.textAlign = "center";
    container.appendChild(emptyMsg);
    return;
  }

  sortedUsage.forEach((item) => {
    let card = document.createElement("div");
    card.classList.add("card", "card--usage");

    let name = document.createElement("div");
    name.innerText = item.name;
    name.classList.add("card__header");

    let details = document.createElement("div");
    details.innerText = `${item.quantity} ${formatUnit(
      item.unit,
      item.quantity
    )} on ${formatDate(item.date)}`;
    details.classList.add("card__detail");

    card.appendChild(name);
    card.appendChild(details);

    card.style.cursor = "pointer";
    card.onclick = () => openEditUsageModal(item);

    container.appendChild(card);
  });
};

const renderUsageChart = (canvas) => {
  // Aggregate usage by date (last 7 days active) or just all time daily activty
  // Let's show last 7 days of activity

  // 1. Get last 7 days dates
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }

  // 2. Count items used per day
  const dataPoints = dates.map((date) => {
    return usage.filter((u) => u.date === date).length;
  });

  // 3. Render Chart
  new Chart(canvas, {
    type: "bar",
    data: {
      labels: dates.map((d) => formatDate(d).split(" ").slice(0, 2).join(" ")), // "12th Dec"
      datasets: [
        {
          label: "Items Used",
          data: dataPoints,
          backgroundColor: "rgba(0, 150, 136, 0.5)",
          borderColor: "rgba(0, 150, 136, 1)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0, color: "#a0a0a0" },
          grid: { color: "#333" },
        },
        x: {
          ticks: { color: "#a0a0a0" },
          grid: { display: false },
        },
      },
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Daily Activity (Last 7 Days)",
          color: "#e0e0e0",
          font: { size: 14 },
        },
      },
    },
  });
};

const renderInventoryPage = (pageDiv) => {
  let filtersDiv = document.createElement("div");
  filtersDiv.classList.add("filter-bar");

  let searchBar = document.createElement("input");
  searchBar.classList.add("form__input", "form__input--search");
  searchBar.placeholder = "Search...";

  // searchBar inline styles removed -> handled by form__input--search

  ["In", "Almost", "Out"].forEach((status, index) => {
    const btn = document.createElement("button");
    btn.classList.add(
      "filter-bar__btn",
      `filter-bar__btn--${status.toLowerCase()}`
    );
    btn.innerText = status;

    btn.onclick = () => {
      [...filtersDiv.children].forEach((btn, index) => {
        if (index < 3) {
          btn.style.backgroundColor = "transparent";
          btn.style.color = getComputedStyle(btn).borderColor;
        }
      });
      btn.style.backgroundColor = getComputedStyle(btn).borderColor;
      btn.style.color = "#fff";

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
          [...filtersDiv.children].forEach((btn) => {
            btn.style.backgroundColor = "transparent";
            btn.style.color = getComputedStyle(btn).borderColor;
          });
          generateInventory(inventoryDiv);
          filtersDiv.removeChild(clearButton);
        };
      }
    };
    filtersDiv.appendChild(btn);
  });

  const inventoryDiv = document.createElement("div");
  inventoryDiv.classList.add("card-list");

  // Search Container with Reset Button
  const searchContainer = document.createElement("div");
  searchContainer.classList.add("search-container");
  // Removed inline styles for searchContainer

  // searchBar.style.flex = "1"; // Moved to CSS
  // searchBar.style.marginBottom = "0"; // Moved to CSS

  const settingsBtn = document.createElement("button");
  settingsBtn.innerHTML =
    '<span class="material-symbols-outlined">settings</span>';
  settingsBtn.classList.add("btn", "btn--icon");
  settingsBtn.title = "Settings";
  settingsBtn.onclick = () => openSettingsModal();

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

  // Enable FAB
  renderFAB("inventory");
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
  inventoryCardDiv.classList.add("card", "card--inventory");
  let nameDiv = document.createElement("p");
  nameDiv.classList.add("card__header");
  nameDiv.innerText = item.name;
  let qtyDiv = document.createElement("p");
  qtyDiv.classList.add("card__badge");

  if (item.quantity > item.min) {
    qtyDiv.classList.add("card__badge--success");
  } else if (item.quantity == item.min) {
    qtyDiv.classList.add("card__badge--warning");
  } else {
    qtyDiv.classList.add("card__badge--danger");
  }

  qtyDiv.innerText = item.quantity + " x " + item.unit;
  let dateDiv = document.createElement("p");
  dateDiv.classList.add("card__detail");
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
  dateTotalDiv.classList.add("list-header");

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
  purchaseCardDiv.classList.add("card", "card--purchase");
  let nameDiv = document.createElement("div");
  nameDiv.classList.add("card__header");
  nameDiv.innerText = purchase.name;
  let qtyDiv = document.createElement("div");
  qtyDiv.classList.add("card__field", "card__field--qty");
  qtyDiv.innerText = purchase.quantity;
  let priceDiv = document.createElement("div");
  priceDiv.classList.add("card__field", "card__field--price");
  priceDiv.innerText = "₹ " + purchase.price;
  let unitDiv = document.createElement("div");
  unitDiv.classList.add("card__field", "card__field--unit");
  unitDiv.innerText = purchase.unit;
  let amtDiv = document.createElement("div");
  amtDiv.classList.add("card__field", "card__field--amount");
  amtDiv.innerText = "₹ " + purchase.price * purchase.quantity;

  purchaseCardDiv.appendChild(nameDiv);
  purchaseCardDiv.appendChild(qtyDiv);
  purchaseCardDiv.appendChild(priceDiv);
  purchaseCardDiv.appendChild(unitDiv);
  purchaseCardDiv.appendChild(amtDiv);

  purchaseCardDiv.style.cursor = "pointer";
  purchaseCardDiv.onclick = () => openEditPurchaseModal(purchase);

  return purchaseCardDiv;
};

// Inventory Update Helper
const updateInventoryFromTransaction = (item, type, isRevert = false) => {
  // If isRevert is true, we reverse the operation.
  // Purchase: Add (Normal), Remove (Revert)
  // Usage: Remove (Normal), Add (Revert)

  let quantityChange = item.quantity;
  if (type === "purchase") {
    quantityChange = isRevert ? -item.quantity : item.quantity;
  } else if (type === "usage") {
    quantityChange = isRevert ? item.quantity : -item.quantity;
  }

  let inventoryItem = inventory.find(
    (i) => i.name.toLowerCase() === item.name.toLowerCase()
  );

  if (inventoryItem) {
    inventoryItem.quantity += quantityChange;
    inventoryItem.lastUpdatedAt = item.date;
    // If reversing a purchase/usage brings it to neg (shouldn't happen with valid logic) or 0
    // We generally keep the item in inventory even if 0.
  } else if (!isRevert) {
    // If applying a NEW transaction and item doesn't exist, create it.
    // If Reverting, we don't create an item if it's missing (it might have been deleted manually).
    inventory.push({
      name: item.name,
      quantity: quantityChange, // Will be positive for purchase, likely negative for usage if starting fresh
      unit: item.unit,
      min: 0,
      lastUpdatedAt: item.date,
    });
  }
};

const openEditPurchaseModal = (purchase) => {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal__content");

  const closeBtn = document.createElement("span");
  closeBtn.classList.add("modal__close");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => modal.remove();

  // Reuse the item select logic or just simple inputs?
  // Use simple inputs for edit to avoid complexity of "New" vs "Existing" switch during edit,
  // but keep it flexible.

  const form = document.createElement("form");
  form.innerHTML = `
      <h3 class="modal__title">Edit Purchase</h3>
      <label class="form__label">Name</label>
      <input type="text" name="name" class="form__input" value="${purchase.name}" required>
      <label class="form__label">Quantity</label>
      <input type="number" name="quantity" class="form__input" value="${purchase.quantity}" step="0.1" required>
      <label class="form__label">Unit</label>
      <input type="text" name="unit" class="form__input" value="${purchase.unit}" required>
      <label class="form__label">Price</label>
      <input type="number" name="price" class="form__input" value="${purchase.price}" required>
      <label class="form__label">Date</label>
      <input type="date" name="date" class="form__input" value="${purchase.date}" required>
      
      <div class="modal__actions">
        <button type="submit" class="btn btn--primary" style="flex:1">Update</button>
        <button type="button" id="deleteBtn" class="btn btn--danger" style="flex:1">Delete</button>
      </div>
  `;

  form.onsubmit = (e) => {
    e.preventDefault();

    // 1. Revert Old
    updateInventoryFromTransaction(purchase, "purchase", true);

    // 2. Update Object
    const newItem = {
      name: form.name.value,
      quantity: parseFloat(form.quantity.value),
      unit: form.unit.value,
      price: parseFloat(form.price.value),
      date: form.date.value,
    };

    // Update reference
    Object.assign(purchase, newItem);

    // 3. Apply New
    updateInventoryFromTransaction(purchase, "purchase", false);

    saveData();
    generatePage(0);
    modal.remove();
  };

  const deleteBtn = form.querySelector("#deleteBtn");
  deleteBtn.onclick = () => {
    if (confirm("Delete this purchase? Inventory will be adjusted.")) {
      // Revert inventory
      updateInventoryFromTransaction(purchase, "purchase", true);

      // Remove from array
      const index = purchases.indexOf(purchase);
      if (index > -1) {
        purchases.splice(index, 1);
      }

      saveData();
      generatePage(0);
      modal.remove();
    }
  };

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(form);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
};

const openEditUsageModal = (usageItem) => {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal__content");

  const closeBtn = document.createElement("span");
  closeBtn.classList.add("modal__close");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => modal.remove();

  const form = document.createElement("form");
  form.innerHTML = `
      <h3 class="modal__title">Edit Usage</h3>
      <label class="form__label">Name</label>
      <input type="text" name="name" class="form__input" value="${usageItem.name}" required>
      <label class="form__label">Quantity</label>
      <input type="number" name="quantity" class="form__input" value="${usageItem.quantity}" step="0.1" required>
      <label class="form__label">Unit</label>
      <input type="text" name="unit" class="form__input" value="${usageItem.unit}" required>
      <label class="form__label">Date</label>
      <input type="date" name="date" class="form__input" value="${usageItem.date}" required>
      
      <div class="modal__actions">
        <button type="submit" class="btn btn--primary" style="flex:1">Update</button>
        <button type="button" id="deleteBtn" class="btn btn--danger" style="flex:1">Delete</button>
      </div>
  `;

  form.onsubmit = (e) => {
    e.preventDefault();

    // 1. Revert Old
    updateInventoryFromTransaction(usageItem, "usage", true);

    // 2. Update Object
    const newItem = {
      name: form.name.value,
      quantity: parseFloat(form.quantity.value),
      unit: form.unit.value,
      date: form.date.value,
    };

    // Update reference
    Object.assign(usageItem, newItem);

    // 3. Apply New
    updateInventoryFromTransaction(usageItem, "usage", false);

    saveData();
    generatePage(1);
    modal.remove();
  };

  const deleteBtn = form.querySelector("#deleteBtn");
  deleteBtn.onclick = () => {
    if (confirm("Delete this usage entry? Inventory will be adjusted.")) {
      // Revert inventory
      updateInventoryFromTransaction(usageItem, "usage", true);

      // Remove from array
      const index = usage.indexOf(usageItem);
      if (index > -1) {
        usage.splice(index, 1);
      }

      saveData();
      generatePage(1);
      modal.remove();
    }
  };

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(form);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
};

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
  modalContent.classList.add("modal__content");

  const closeBtn = document.createElement("span");
  closeBtn.classList.add("modal__close");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => modal.remove();

  const form = document.createElement("form");
  form.onsubmit = (e) => {
    e.preventDefault();
    e.preventDefault();
    if (type === "purchase") handlePurchaseSubmit(e.target);
    if (type === "usage") handleUsageSubmit(e.target);
    if (type === "inventory") handleInventorySubmit(e.target);
    modal.remove();
  };

  if (type === "inventory") {
    const formContent = `
        <h3 class="modal__title">Add Inventory Item</h3>
        <label class="form__label">Name</label>
        <input type="text" name="name" class="form__input" placeholder="Item Name" required>
        <label class="form__label">Quantity</label>
        <input type="number" name="quantity" class="form__input" placeholder="0" step="0.1" required>
        <label class="form__label">Unit</label>
        <input type="text" name="unit" class="form__input" placeholder="e.g. kg, pcs" required>
        <label class="form__label">Min Stock</label>
        <input type="number" name="min" class="form__input" placeholder="Min Alert Level" required>
        <label class="form__label">Price (Optional)</label>
        <input type="number" name="price" class="form__input" placeholder="Price">
        <button type="submit" class="btn btn--primary btn--full">Add Item</button>
      `;
    form.innerHTML = formContent;
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(form);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    return;
  }

  const inventoryOptions = inventory
    .map((i) => `<option value="${i.name}">${i.name}</option>`)
    .join("");
  const itemSelectHTML = `
    <select name="name" class="form__select" required>
      <option value="" disabled selected>Select Item</option>
      ${inventory
        .map(
          (i) =>
            `<option value="${i.name}" data-unit="${
              i.unit || ""
            }" data-price="${i.price || ""}">${i.name}</option>`
        )
        .join("")}
      <option value="new">+ Add New Item</option>
    </select>
  `;

  // Bulk Mode Toggle State
  let isBulkMode = false;

  const renderFormContent = () => {
    form.innerHTML = ""; // Clear

    if (isBulkMode) {
      const placeholder =
        type === "purchase"
          ? "e.g. Milk, 500ml, 2, 40, 80\nBread,, 1, 45"
          : "e.g. Milk, 500ml, 1\nBread,, 0.5";

      form.innerHTML = `
            <h3 class="modal__title">Bulk Add ${
              type === "purchase" ? "Purchases" : "Usage"
            }</h3>
            <p class="modal__msg" style="font-size:0.85em; text-align:left; opacity:0.8;">
                Format: <strong>${
                  type === "purchase"
                    ? "Name, Unit, Qty, Price, [Total]"
                    : "Name, Unit, Qty"
                }</strong>
            </p>
            <textarea name="bulkInput" class="form__textarea" rows="8" placeholder="${placeholder}" required style="font-family:monospace;"></textarea>
            <label class="form__label">Date (Applied to all)</label>
            <input type="date" name="date" class="form__input" value="${
              new Date().toISOString().split("T")[0]
            }" required>
            
            <button type="submit" class="btn btn--primary btn--full" style="margin-bottom:10px;">Process Bulk Add</button>
            <button type="button" id="toggleModeBtn" class="btn btn--icon" style="width:100%; font-size:0.9em; text-decoration:underline;">&larr; Back to Single Item</button>
          `;
    } else {
      // Standard Single Item Form
      const formContent = `
            <h3 class="modal__title">Add ${
              type === "purchase" ? "Purchase" : "Usage"
            }</h3>
            ${itemSelectHTML}
            
            <!-- Custom Name Input (Hidden by default) -->
            <input type="text" name="customName" class="form__input" placeholder="Item Name" style="display:none;">
            
            <div style="display:flex; gap:10px;">
                <div style="flex:1">
                    <label class="form__label">Quantity</label>
                    <input type="number" name="quantity" class="form__input" step="0.1" required>
                </div>
                <div style="flex:1">
                     <label class="form__label">Unit</label>
                     <input type="text" name="unit" class="form__input" required>
                </div>
            </div>
            
             ${
               type === "purchase"
                 ? `
            <label class="form__label">Price (Total)</label>
            <input type="number" name="price" class="form__input" required>
            `
                 : ""
             }

            <label class="form__label">Date</label>
            <input type="date" name="date" class="form__input" value="${
              new Date().toISOString().split("T")[0]
            }" required>

            <button type="submit" class="btn btn--primary btn--full" style="margin-bottom:10px;">${
              type === "purchase" ? "Add Purchase" : "Add Usage"
            }</button>
            <button type="button" id="toggleModeBtn" class="btn btn--icon" style="width:100%; font-size:0.9em; text-decoration:underline;">Switch to Bulk Add mode</button>
          `;
      form.innerHTML = formContent;

      // Re-attach scripts for Single Item mode
      const select = form.querySelector('select[name="name"]');
      if (select) {
        select.onchange = function () {
          const customName = form.querySelector('input[name="customName"]');
          const unitInput = form.querySelector('input[name="unit"]');
          const priceInput = form.querySelector('input[name="price"]');

          if (this.value === "new") {
            this.style.display = "none";
            customName.style.display = "block";
            customName.required = true;
            customName.focus();
            unitInput.value = "";
            if (priceInput) priceInput.value = "";
          } else {
            const selectedRes = this.options[this.selectedIndex];
            unitInput.value = selectedRes.dataset.unit || "";
            if (priceInput) priceInput.value = selectedRes.dataset.price || "";
          }
        };
      }
    }

    form.querySelector("#toggleModeBtn").onclick = () => {
      isBulkMode = !isBulkMode;
      renderFormContent();
    };
  };

  renderFormContent();

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(form);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
};

const openEditInventoryModal = (item) => {
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal__content");

  const closeBtn = document.createElement("span");
  closeBtn.classList.add("modal__close");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => modal.remove();

  const form = document.createElement("form");
  form.innerHTML = `
      <h3 class="modal__title">Edit ${item.name}</h3>
      <label class="form__label">Name</label>
      <input type="text" name="name" class="form__input" value="${
        item.name
      }" required>
      <label class="form__label">Quantity</label>
      <input type="number" name="quantity" class="form__input" value="${
        item.quantity
      }" step="0.1" required>
      <label class="form__label">Unit</label>
      <input type="text" name="unit" class="form__input" value="${
        item.unit || ""
      }" required>
      <label class="form__label">Min Stock</label>
      <input type="number" name="min" class="form__input" value="${
        item.min || 0
      }" required>
      <label class="form__label">Price</label>
      <input type="text" name="price" class="form__input" value="${
        item.price || ""
      }" placeholder="Price">
      
      <div style="margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: 8px;">
        <input type="checkbox" id="logToHistory" name="logToHistory">
        <label for="logToHistory" style="color: var(--color-text-muted); cursor: pointer; font-size: 0.9rem;">Log changes to history? (Auto-add Purchase/Usage)</label>
      </div>

      <div class="modal__actions">
        <button type="submit" class="btn btn--primary" style="flex:1">Save Changes</button>
        <button type="button" id="deleteInventoryBtn" class="btn btn--danger" style="flex:1">Delete</button>
      </div>
  `;

  form.onsubmit = (e) => {
    e.preventDefault();

    const originalName = item.name;
    const originalQuantity = item.quantity;

    const newName = form.name.value;
    const newQuantity = parseFloat(form.quantity.value);
    const newUnit = form.unit.value;

    // Auto-Log History Logic
    if (form.logToHistory.checked) {
      const diff = newQuantity - originalQuantity;
      if (diff > 0) {
        // Add Purchase
        const newPurchase = {
          name: newName,
          quantity: diff,
          unit: newUnit,
          price: parseFloat(form.price.value) || 0,
          date: new Date().toISOString().split("T")[0],
        };
        purchases.push(newPurchase);
      } else if (diff < 0) {
        // Add Usage
        const newUsage = {
          name: newName,
          quantity: Math.abs(diff),
          unit: newUnit,
          date: new Date().toISOString().split("T")[0],
        };
        usage.push(newUsage);
      }
    }

    // Update item
    item.name = newName;
    item.quantity = newQuantity;
    item.unit = newUnit;
    item.min = parseFloat(form.min.value);
    if (form.price.value) item.price = parseFloat(form.price.value);

    // Cascading Updates: Update history if name or unit changed
    purchases.forEach((p) => {
      if (p.name === originalName) {
        p.name = newName;
        p.unit = newUnit;
      }
    });

    usage.forEach((u) => {
      if (u.name === originalName) {
        u.name = newName;
        u.unit = newUnit;
      }
    });

    saveData(); // Save changes
    generatePage(2); // Refresh Inventory Page
    modal.remove();
  };

  const deleteBtn = form.querySelector("#deleteInventoryBtn");
  deleteBtn.onclick = () => {
    if (
      confirm(
        `Delete ${item.name} from inventory? This will NOT delete purchase/usage history.`
      )
    ) {
      const index = inventory.indexOf(item);
      if (index > -1) {
        inventory.splice(index, 1);
      }
      saveData();
      generatePage(2);
      modal.remove();
    }
  };

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(form);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
};

const handlePurchaseSubmit = (form) => {
  if (form.bulkInput) {
    // HANDLE BULK
    const lines = form.bulkInput.value.split("\n");
    let successCount = 0;

    lines.forEach((line) => {
      const parts = line.split(",").map((s) => s.trim());
      if (parts.length >= 3) {
        // Expect Name, Unit, Qty, [Price], [Total]
        const name = parts[0];
        let unit = parts[1];
        let qty = parseFloat(parts[2]);
        let price = parts[3] ? parseFloat(parts[3]) : 0;
        let total = parts[4] ? parseFloat(parts[4]) : 0;

        if (name && !isNaN(qty)) {
          // Logic v2: Round Qty
          qty = Math.round(qty);

          // Logic v2: Calc Price from Total if Price missing/zero and Total exists
          if (!price && total && qty > 0) {
            price = Math.round(total / qty);
          }

          // Logic v2: Smart Unit Default
          if (!unit || unit === "") {
            const existingItem = inventory.find(
              (i) => i.name.toLowerCase() === name.toLowerCase()
            );
            if (existingItem && existingItem.unit) {
              unit = existingItem.unit;
            } else {
              unit = ""; // Store as empty, render as no./nos.
            }
          }

          const newPurchase = {
            name: name,
            quantity: qty,
            unit: unit,
            price: price,
            date: form.date.value,
          };
          purchases.push(newPurchase);
          updateInventoryFromTransaction(newPurchase, "purchase", false);
          successCount++;
        }
      }
    });
    if (successCount > 0) {
      alert(`Successfully added ${successCount} items.`);
    } else {
      alert("No valid items found. Format: Name, Unit, Qty, Price, [Total]");
      return;
    }
  } else {
    // HANDLE SINGLE
    const isNewItem = form.name.style.display === "none";
    const itemName = isNewItem ? form.customName.value : form.name.value;

    const newPurchase = {
      name: itemName,
      quantity: parseFloat(form.quantity.value),
      unit: form.unit.value,
      price: parseFloat(form.price.value),
      date: form.date.value,
    };
    purchases.push(newPurchase);

    // Update Inventory using helper
    updateInventoryFromTransaction(newPurchase, "purchase", false);
  }

  saveData(); // Save changes
  generatePage(0); // Refresh purchases page
};

const handleUsageSubmit = (form) => {
  if (form.bulkInput) {
    // HANDLE BULK
    const lines = form.bulkInput.value.split("\n");
    let successCount = 0;

    lines.forEach((line) => {
      const parts = line.split(",").map((s) => s.trim());
      if (parts.length >= 3) {
        // Expect Name, Unit, Qty
        const name = parts[0];
        let unit = parts[1];
        let qty = parseFloat(parts[2]);

        if (name && !isNaN(qty)) {
          // Logic v2: Round Qty
          qty = Math.round(qty);

          // Logic v2: Smart Unit Default
          if (!unit || unit === "") {
            const existingItem = inventory.find(
              (i) => i.name.toLowerCase() === name.toLowerCase()
            );
            if (existingItem && existingItem.unit) {
              unit = existingItem.unit;
            } else {
              unit = ""; // Store as empty
            }
          }

          const newUsage = {
            name: name,
            quantity: qty,
            unit: unit,
            date: form.date.value,
          };
          usage.push(newUsage);
          updateInventoryFromTransaction(newUsage, "usage", false);
          successCount++;
        }
      }
    });
    if (successCount > 0) {
      alert(`Successfully added ${successCount} items.`);
    } else {
      alert("No valid items found. Format: Name, Unit, Qty");
      return;
    }
  } else {
    // HANDLE SINGLE
    const isNewItem = form.name.style.display === "none";
    const itemName = isNewItem ? form.customName.value : form.name.value;

    const newUsage = {
      name: itemName,
      quantity: parseFloat(form.quantity.value),
      unit: form.unit.value,
      date: form.date.value,
    };
    usage.push(newUsage);

    // Update Inventory using helper
    updateInventoryFromTransaction(newUsage, "usage", false);
  }

  saveData(); // Save changes
  generatePage(1); // Refresh usage page
};

const handleInventorySubmit = (form) => {
  const newItem = {
    name: form.name.value,
    quantity: parseFloat(form.quantity.value),
    unit: form.unit.value,
    min: parseFloat(form.min.value),
    price: parseFloat(form.price.value) || 0,
    lastUpdatedAt: new Date().toISOString().split("T")[0],
  };

  // Check if exists
  const existingIndex = inventory.findIndex(
    (i) => i.name.toLowerCase() === newItem.name.toLowerCase()
  );
  if (existingIndex > -1) {
    alert("Item already exists in inventory. Updating quantity.");
    inventory[existingIndex].quantity += newItem.quantity;
    // Optionally update other fields? keeping simple for now.
  } else {
    inventory.push(newItem);
  }

  saveData();
  generatePage(2);
};

generatePage(2);
