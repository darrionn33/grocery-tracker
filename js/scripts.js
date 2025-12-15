// get data

const inventory = [
  { name: "Bread", quantity: 1, min: 1, lastUpdatedAt: "01/12/25" },
  { name: "Milk", quantity: 6, min: 3, lastUpdatedAt: "01/12/25" },
  { name: "Broccolo", quantity: 9, min: 4, lastUpdatedAt: "01/12/25" },
  { name: "Broccolo", quantity: 1, min: 4, lastUpdatedAt: "01/12/25" },
  { name: "Pasta", quantity: 2, min: 4, lastUpdatedAt: "01/12/25" },
];

const purchases = [
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
  { name: "Milk", quantity: 6, unit: "500ml", price: 40, date: "2025-12-02" },
];

const usage = [
  { name: "Milk", quantity: 1, unit: "carton", date: "2025-12-10" },
  { name: "Bread", quantity: 0.5, unit: "loaf", date: "2025-12-11" },
  { name: "Eggs", quantity: 2, unit: "pcs", date: "2025-12-12" },
  { name: "Cheese", quantity: 200, unit: "g", date: "2025-12-13" },
];

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

  inventoryDiv.appendChild(searchBar);

  searchBar.oninput = (searchTerm) => {
    generateInventory(inventoryDiv, 3, searchTerm.target.value);
  };

  pageDiv.appendChild(searchBar);
  pageDiv.appendChild(filtersDiv);
  pageDiv.appendChild(inventoryDiv);

  generateInventory(inventoryDiv);
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

generatePage(2);
