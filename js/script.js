let products = [];

function initialize()
{

    currentTime();
    setInterval(currentTime, 1000);
    displayProducts();
    displaySavedCurrency();
    productsReview();

    localStorage.setItem('preferredCurrency', currentCurrency);

    // Currency change handler
    document.getElementById('currency').addEventListener('change', function() {
        setCurrency(this.value);
    });
}


//Constructors
function Product(id, name, price, img, rating, quantity, stock)
{
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.img = img;
    this.rating = rating;
    this.stock = stock;
}

function CartItem(id, name, price, quantity, img)
{
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.img = img;
}

function Review(id, productId,userName, text, rating, date){
    this.id = id;
    this.productId = productId;
    this.text = text;
    this.rating = rating;
    this.userName = userName;
    this.date = date;
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
        productDiv.className = "col-4 product";
        productDiv.dataset.id = product.id;
        productDiv.innerHTML = `
          <img src="${product.img}" alt="${product.name}">
          <h4>${product.name}</h4>
          <div class="rating">${renderStars(product.rating)}</div>
          <p data-price="${product.price}">${formatPrice(product.price)}</p>
          <div>
            <button class="view" onclick="goToProductDetail(${product.id})">View</button>
            <button class="btn add-to-cart" onclick="addToCart(${product.id}, 1)">Add to Cart</button>
          </div>
          
    `;
        container.appendChild(productDiv);
    });
}

function displayProducts()
{
     products = [
        new Product(1, "Red Puma T-Shirt", 19, "img/product-1.jpg", 4, 0, 10),
        new Product(2, "Blue Puma T-Shirt", 49, "img/product-4.jpg", 3.5, 0, 20),
        new Product(3, "Black Puma T-Shirt", 29, "img/product-6.jpg", 4.5, 0,5),
        new Product(4, "Yellow Puma T-Shirt", 39, "img/product-4.jpg", 2, 0, 1),

        new Product(5, "Nike Grey Shoes", 59, "img/product-5.jpg", 2, 0, 4),
        new Product(6, "Black Shoes", 39, "img/product-10.jpg", 2, 0, 1),
        new Product(7, "Adidas Grey Shoes", 69, "img/product-11.jpg", 2, 0, 7),
        new Product(8, "Black Adidas Shoes", 79, "img/product-2.jpg", 2, 0, 5),

        new Product(9, "Black Fossil", 1009, "img/product-8.jpg", 2, 0, 10),
        new Product(10, "Grey George Armani", 2099, "img/product-9.jpg", 2,0,  5),
        new Product(11, "Black LV", 3999, "img/product-8.jpg", 2, 0, 4),
        new Product(12, "Grey Patek Philippe", 4000, "img/product-9.jpg", 2, 0, 3)
    ];

     localStorage.setItem('Products', JSON.stringify(products));

    renderProducts(products, "tshirts", 0);
    renderProducts(products, "shoes", 4);
    renderProducts(products, "wristwatch", 8);
}

function goToProductDetail(productId)
{
    // Salva o ID do produto no localStorage (ou localStorage)
    localStorage.setItem('selectedProductId', productId);

    // Redireciona para a página de detalhes
    window.location.href = 'product-detail.html';
}
//Currency Exchange
const exchangeRates = {
    USD: 1.0,    // Base currency
    EUR: 0.91,   // Example rate (check current rates)
    AOA: 916.0,
    CAD: 1.42,
};

const currencySymbols = {
    USD: '$',
    EUR: '€',
    CAD: 'C$',
    AOA: 'Kz',
};

let currentCurrency = 'USD';

function setCurrency(currency) {
    if (exchangeRates[currency]) {
        currentCurrency = currency;
        localStorage.setItem('preferredCurrency', currency);
        updatePrices();
        updateAndStoreConvertedProducts(convertProducts);
    }
}

function convertPrice(price) {
    return price * exchangeRates[currentCurrency];
}

function formatPrice(price) {
    return `${currencySymbols[currentCurrency]} ${convertPrice(price).toFixed(2)}`;
}

function updatePrices()
{
    // Update product prices
    const priceElements = document.querySelectorAll('[data-price]');
    priceElements.forEach(el => {
        const originalPrice = parseFloat(el.dataset.price);
        el.textContent = formatPrice(originalPrice);
    });
}
const convertProducts = JSON.parse(localStorage.getItem('Products'));

function updateAndStoreConvertedProducts(products) {
    // 1. Converte o preço de cada produto
    const convertedProducts = products.map(prod => {
        return {
            ...prod,
            price: convertPrice(prod.price), // mantém o original e adiciona o convertido
        };
    });

    // 2. Salva no localStorage
    localStorage.setItem('convertedProducts', JSON.stringify(convertedProducts));
}

function displaySavedCurrency()
{

    // Load saved currency preference
    const savedCurrency = localStorage.getItem('preferredCurrency');
    if (savedCurrency) {
        document.getElementById('currency').value = savedCurrency;
        setCurrency(savedCurrency);
    }

}

function displayCurrency(preferredCurrency = 'USD'){
    let currency = '$';

    if (preferredCurrency === 'EUR') {
        currency = '€';
    } else if (preferredCurrency === 'AOA') {
        currency = 'Kz';
    } else if (preferredCurrency === 'CAD') {
        currency = 'C$';
    }

    return currency;
}

const productList = JSON.parse(localStorage.getItem('convertedProducts'));

// Add item to cart with quantity validation
function addToCart(productId, quantity) {
    const pid = parseInt(productId); // garante tipo número
    quantity = parseInt(quantity) || 1; // Default 1 se não for número

    const product = productList.find(p => p.id === pid);
    if (!product) {
        alert('Product not found');
        return false;
    }

    const maxQuantity = product.stock || 10;

    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cartItems.find(item => item.id == pid);

    if (existingItem) {
        const currentQty = parseInt(existingItem.quantity);
        const newQty = parseInt(quantity);
        const total = currentQty + newQty;

        if (total > maxQuantity) {
            alert(`You reached the maximum quantity of this product.`);
            return false;
        }

        existingItem.quantity = total;
    } else {
        if (quantity > maxQuantity) {
            alert(`You can only add up to of this product.`);
            return false;
        }

        cartItems.push({
            id: pid,
            name: product.name,
            price: parseFloat(product.price), // Garante que é número
            img: product.img,
            stock: parseInt(product.stock) || 10, // Garante que é número
            quantity: parseInt(quantity) // Garante que é número
        });
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));
    alert('Product added to cart');
    updateCartCounter();
    return true;
}

// Function to remove or update item quantity in cart
function updateCartItemQuantity(productId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    // 1. Get current cart from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // 2. Find the item in cart
    const itemIndex = cartItems.findIndex(item => item.id == productId);

    // 3. If item doesn't exist, return
    if (itemIndex === -1) return false;

    // 4. Handle quantity change
    if (newQuantity <= 0) {
        // Remove item completely if quantity is 0 or less
        cartItems.splice(itemIndex, 1);
    } else {
        // Update quantity respecting maximum limit
        const maxQuantity = cartItems[itemIndex].stock || 10;
        cartItems[itemIndex].quantity = Math.min(newQuantity, maxQuantity);
    }

    // 5. Save updated cart
    localStorage.setItem('cart', JSON.stringify(cartItems));

    if (document.querySelector('.cart-page')) {
        displayCartItems(cartItems);
    }

    updateCartCounter();
    return true;
}

// Function to completely remove item from cart
function removeFromCart(productId, qty) {
    updateCartItemQuantity(productId, qty - 1); // Setting quantity to 0 removes the item
}

function updateCartCounter() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const counter = document.querySelector('.cart-counter');

    if (!counter) return; // evita erro se o elemento não existir

    if (cartItems.length === 0) {
        counter.classList.add('hidden');
    } else {
        counter.textContent = cartItems.length;
        counter.classList.remove('hidden');
    }
}

function productsReview()
{
    const reviews = [
        new Review(1, 1, "Hendrick Nkuba", "Bad Product. I do not recomend", 1, "09/09/2009"),
        new Review(2, 2, "Hendrick Nkuba", "Bad Product. I do not recomend", 2, "11/09/2004"),
        new Review(3, 3, "Hendrick Nkuba", "Bad Product. I do not recomend", 3, "12/09/2004"),
        new Review(4, 4, "Hendrick Nkuba", "It could be Better.", 4, "07/04/2025"),
        new Review(5, 5, "Hendrick Nkuba", "It worth the price. Great Product.", 5, "07/04/2025"),
        new Review(5, 6, "Hendrick Nkuba", "It could be Better.", 4, "07/04/2025"),
        new Review(5, 7, "Hendrick Nkuba", "Bad Product. I do not recomend", 3, "07/04/2025"),
        new Review(5, 8, "Hendrick Nkuba", "Bad Product. I do not recomend", 2, "07/04/2025"),
        new Review(5, 9, "Hendrick Nkuba", "Bad Product. I do not recomend", 1, "07/04/2025"),
        new Review(5, 10, "Hendrick Nkuba", "Bad Product. I do not recomend", 2, "07/04/2025"),
        new Review(5, 11, "Hendrick Nkuba", "It could be Better.", 3, "07/04/2025"),
        new Review(5, 12, "Hendrick Nkuba", "It worth the price. Great Product.", 4, "07/04/2025"),
    ];


    localStorage.setItem('Reviews', JSON.stringify(reviews));
}