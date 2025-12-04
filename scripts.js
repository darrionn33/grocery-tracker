// get data

const inventory = {
  Milk: 4,
  Bread: 1,
};

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

// function to format YYYY-MM-DD to DD, MMM, YYYY

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
        generatePurchases(purchasesDiv, null, searchTerm.target.value);
      };

      dateInput.onchange = (date) => {
        generatePurchases(purchasesDiv, date.target.value, null);
      };

      pageDiv.appendChild(filtersDiv);
      pageDiv.appendChild(purchasesDiv);

      generatePurchases(purchasesDiv);

      break;
    case 1:
      // usage
      break;
    case 2:
      //inventory
      break;
  }
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
  uniqueDates.sort();

  uniqueDates.forEach((date) => {
    if (typeof filterDate === "string") {
      if (date == filterDate || filterDate == "") {
        purchasesDiv.appendChild(generateDateTotalDiv(date));
      }
    } else {
      purchasesDiv.appendChild(generateDateTotalDiv(date));
    }
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
      .filter((i) => {
        if (typeof filterDate == "string") {
          if (filterDate !== "") {
            return i.date == date && i.date == filterDate;
          } else {
            return i.date == date;
          }
        } else {
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
function openFullscreen() {
  let el = document.documentElement;
  if (el.requestFullscreen) el.requestFullscreen();
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
}

// inventory filters

document.querySelectorAll(".filters > button").forEach((button) => {
  button.onclick = () => {
    // openFullscreen();
    document
      .querySelectorAll(".filters > button")
      .forEach((btn) => (btn.style.backgroundColor = "transparent"));
    button.style.backgroundColor = getComputedStyle(button).outlineColor;
  };
});

generatePage(0);
