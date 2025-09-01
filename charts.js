// Load charts only on reports page
document.addEventListener("DOMContentLoaded", () => {
  const ctx1 = document.getElementById("salesChart");
  const ctx2 = document.getElementById("stockChart");

  if (ctx1 && ctx2) {
    new Chart(ctx1, {
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
          label: "Sales (KES)",
          data: [2000, 1500, 3000, 4000, 2500, 3500, 5000],
          backgroundColor: "#4a90e2"
        }]
      }
    });

    new Chart(ctx2, {
      type: "pie",
      data: {
        labels: ["Product A", "Product B", "Product C"],
        datasets: [{
          data: [10, 20, 30],
          backgroundColor: ["#4a90e2", "#7b4397", "#2c3e50"]
        }]
      }
    });
  }
});
