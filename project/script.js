const categoryList = document.getElementById("categoryList");
const categoryListMobile = document.getElementById("categoryListMobile");
const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");

// Fetch Categories
async function fetchCategories() {
  const res = await fetch("https://fakestoreapi.com/products/categories");
  const categories = await res.json();

  categories.forEach(cat => {
    // Desktop sidebar
    const liDesktop = document.createElement("li");
    liDesktop.classList.add("mb-2", "category-item");
    liDesktop.textContent = cat.toUpperCase();
    liDesktop.addEventListener("click", () => fetchProducts(cat));
    categoryList.appendChild(liDesktop);

    // Mobile sidebar
    const liMobile = liDesktop.cloneNode(true);
    liMobile.addEventListener("click", () => {
      fetchProducts(cat);
      const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById("offcanvasSidebar"));
      offcanvas.hide(); // close menu after click
    });
    categoryListMobile.appendChild(liMobile);
  });
}

// Fetch Products
async function fetchProducts(category = "") {
  let url = "https://fakestoreapi.com/products";
  if (category) {
    url = `https://fakestoreapi.com/products/category/${category}`;
  }

  const res = await fetch(url);
  const products = await res.json();
  displayProducts(products);
}

// Display Products
function displayProducts(products) {
  productContainer.innerHTML = "";
  products.forEach(product => {
    const div = document.createElement("div");
    div.classList.add("col-md-4", "col-sm-6", "mb-4");

    div.innerHTML = `
      <div class="card h-100 shadow-lg border-0 product-card">
        <img src="${product.image}" class="card-img-top p-3" alt="${product.title}" style="height:250px; object-fit:contain;">
        <div class="card-body">
          <h6 class="card-title text-truncate">${product.title}</h6>
          <p class="text-danger fw-bold">$${product.price}</p>
          <p class="text-muted small">${product.category}</p>
        </div>
      </div>
    `;
    productContainer.appendChild(div);
  });
}

// Search
searchInput.addEventListener("keyup", async () => {
  const query = searchInput.value.toLowerCase();
  const res = await fetch("https://fakestoreapi.com/products");
  const products = await res.json();

  const filtered = products.filter(p => 
    p.title.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );

  displayProducts(filtered);
});

// Init
fetchCategories();
fetchProducts();
