// get data

const inventory = {
  Milk: 4,
  Bread: 1,
};

const purchases=[
  {name:'Milk', quantity:6, unit:'500ml',price:40,date:"2025-12-01"},
  {name:'Milk', quantity:6, unit:'500ml',price:40,date:"2025-12-01"},
  {name:'Milk', quantity:6, unit:'500ml',price:40,date:"2025-12-01"},
  {name:'Milk', quantity:6, unit:'500ml',price:40,date:"2025-12-02"},
]
// bottom nav bar highlighting

document.querySelectorAll(".bottom-nav-bar > *").forEach((option) => {
  option.onclick = () => {
    document
      .querySelectorAll(".bottom-nav-bar > *")
      .forEach((item) => item.classList.remove("selected"));
    option.classList.add("selected");
    generatePage(0);
  };
});


// format YYYY-MM-DD to DD, MMM, YYYY

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);

  // Get suffix
  function getSuffix(d) {
    if (d >= 11 && d <= 13) return "th"; // special case
    switch (d % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  const suffix = getSuffix(day);

  // Month names
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return `${day}${suffix} ${months[month - 1]} ${year}`;
}



// page generation

const generatePage = (value,text) => {
  const page = document.querySelector(".page");
  page.replaceChildren();
  switch(value){
    case(0):
    // purchases
    let filtersDiv=document.createElement("div")
    filtersDiv.classList.add("filters");
    
    let searchBar=document.createElement("input")
    searchBar.placeholder="Search...";

    searchBar.onchange=(text)=>{
      generatePage(0,text.target.value)
    }
    
    let dateInput=document.createElement("input")
    dateInput.type="date";
    dateInput.name="purchase-date";
    dateInput.id="purchase-date";     
    
    filtersDiv.appendChild(searchBar);
    filtersDiv.appendChild(dateInput);
    page.appendChild(filtersDiv);
    
    const allDates = purchases.map(p=>p.date);
    const uniqueDates = [...new Set(allDates)];
    uniqueDates.sort();
    uniqueDates.forEach(date=>{
    
    let dateTotalDiv=document.createElement("div");
    dateTotalDiv.classList.add("date-total");
    
    let dateSpan=document.createElement("span");
    dateSpan.innerText=formatDate(date);
    
    let totalSpan=document.createElement("span");
    totalSpan.innerText="₹ "+purchases.reduce((acc,purchase)=>{if(purchase.date==date){
      return acc+purchase.quantity*purchase.price}else{return acc}
    },0)
    dateTotalDiv.appendChild(dateSpan);
    dateTotalDiv.appendChild(totalSpan);
    
    page.appendChild(dateTotalDiv);
console.log(text)
    purchases.filter(i=>{
      text?i.date==date&&i.name==text:i.date==date
    }).forEach(purchase=>{
      
      let purchaseCardDiv=document.createElement("div"); 
      purchaseCardDiv.classList.add("purchase-card");     
      let nameDiv=document.createElement("div");
      nameDiv.classList.add("name")
      nameDiv.innerText=purchase.name       
      let qtyDiv=document.createElement("div");
      qtyDiv.classList.add("quantity")
      qtyDiv.innerText=purchase.quantity     
      let priceDiv=document.createElement("div");
      priceDiv.classList.add("price")
      priceDiv.innerText="₹ "+purchase.price     
      let unitDiv=document.createElement("div");
      unitDiv.classList.add("unit")
      unitDiv.innerText=purchase.unit     
      let amtDiv=document.createElement("div");
      amtDiv.classList.add("amount")
      amtDiv.innerText="₹ "+purchase.price*purchase.quantity;
      
      purchaseCardDiv.appendChild(nameDiv);
      purchaseCardDiv.appendChild(qtyDiv);
      purchaseCardDiv.appendChild(priceDiv);
      purchaseCardDiv.appendChild(unitDiv);
      purchaseCardDiv.appendChild(amtDiv);

      page.appendChild(purchaseCardDiv);
    })     
})
      break;
    case(1):
      // usage
      break;
    case(2):
      //inventory
      break;    
    }
  
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