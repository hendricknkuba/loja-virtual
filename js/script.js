let products = [
    new Product(1, "Red Puma T-Shirt", 19, "img/product-1.jpg", 4, 10),
    new Product(2, "Blue Puma T-Shirt", 49, "img/product-4.jpg", 3.5, 20),
    new Product(3, "Black Puma T-Shirt", 29, "img/product-6.jpg", 4.5, 5),
    new Product(4, "Yellow Puma T-Shirt", 39, "img/product-4.jpg", 2, 1),
    
    new Product(5, "Nike Grey Shoes", 59, "img/product-5.jpg", 2, 4),
    new Product(6, "Black Shoes", 39, "img/product-10.jpg", 2, 1),
    new Product(7, "Adidas Grey Shoes", 69, "img/product-11.jpg", 2, 7),
    new Product(8, "Black Adidas Shoes", 79, "img/product-2.jpg", 2, 5),
    
    new Product(9, "Black Fossil", 35, "img/product-8.jpg", 2, 10),
    new Product(10, "Grey George Armani", 35, "img/product-9.jpg", 2, 5),
    new Product(11, "Black LV", 35, "img/product-8.jpg", 2, 4),
    new Product(12, "Grey Patek Philippe", 35, "img/product-9.jpg", 2, 3)
];

let cartItems = [];

function initialize()
{
    currentTime();
    setInterval(currentTime, 1000);
    renderProducts(products, "tshirts", 0);
    renderProducts(products, "shoes", 4);
    renderProducts(products, "wristwatch", 8);
    
}

//Constructors
function Product(id, name, price, img, rating, quantity)
{
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.img = img;
    this.rating = rating;
}

function CartItem(id, name, price, quantity, img)
{
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.img = img;
}

function Review(productId, text, rating){

    this.productId = productId;
    this.text = text;
    this.rating = rating;
}

//Funções de inicialização
function currentTime()
{
    const time = new Date();
    document.getElementById("local-time").textContent = time.toLocaleTimeString();
}

function renderStars(rating) {
    // Ensure rating is a valid number between 0 and 5
    rating = parseFloat(rating);
    if (isNaN(rating) || rating < 0) rating = 0;
    if (rating > 5) rating = 5;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let html = "";

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fa fa-star"></i>';
    }

    // Add half star if needed
    if (hasHalfStar) {
        html += '<i class="fa fa-star-half-o"></i>';
    }

    // Add empty stars to complete 5 stars
    const starsAdded = fullStars + (hasHalfStar ? 1 : 0);
    for (let i = starsAdded; i < 5; i++) {
        html += '<i class="fa fa-star-o"></i>';
    }

    return html;
}

function renderProducts(productList, containerId, startIndex = 0, itemsToShow = 4) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; 
    
    const productToRender =  productList.slice(startIndex, startIndex + itemsToShow);
    
    productToRender.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "col-4";
        productDiv.innerHTML = `
          <img src="${product.img}" alt="${product.name}">
          <h4>${product.name}</h4>
          <div class="rating">${renderStars(product.rating)}</div>
          <p>$${product.price.toFixed(2)}</p>
          <a href="#" class="btn">Add to Cart</a>
    `;
        container.appendChild(productDiv);
    });
}




window.addEventListener('DOMContentLoaded', initialize);
