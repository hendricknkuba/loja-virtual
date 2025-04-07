let products = [];
let currentCurrency = 'USD';
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
//This constant will be used to convert currency to be displayed in carts
const convertProducts = JSON.parse(localStorage.getItem('Products'));
const productList = JSON.parse(localStorage.getItem('convertedProducts'));
const productId = localStorage.getItem('selectedProductId');


function initialize()
{
    //localStorage.clear();
    currentTime();
    setInterval(currentTime, 1000);
    storeProductsInLocalStorage();
    displaySavedCurrency();
    productsReview();

    //Storing preferred currency in localStorage
    localStorage.setItem('preferredCurrency', currentCurrency);

    //Currency change handler
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


//This function display the current time
function currentTime()
{
    const time = new Date();
    document.getElementById("local-time").textContent = time.toLocaleTimeString();
}

//This function receive a number of stars and render as HTML icons
function renderStars(rating) {
    //Ensuring that rating is a valid number between 0 and 5
    rating = parseFloat(rating);

    if (isNaN(rating) || rating < 0)
    {
        rating = 0;
    }

    if (rating > 5)
    {
        rating = 5;
    }

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let html = "";

    //Adding full stars
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fa fa-star"></i>';
    }

    //Adding half star if it is needed
    if (hasHalfStar) {
        html += '<i class="fa fa-star-half-o"></i>';
    }

    //Adding empty stars to complete 5 stars
    const starsAdded = fullStars + (hasHalfStar ? 1 : 0);
    for (let i = starsAdded; i < 5; i++) {
        html += '<i class="fa fa-star-o"></i>';
    }

    return html;
}

//This function display products in index page
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

//This function store the product object in Local Storage to be accessed by any page.
function storeProductsInLocalStorage()
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
    productId = parseInt(productId);

    //Store product id in localStorage
    localStorage.setItem('selectedProductId', productId);
    console.log(JSON.parse(localStorage.getItem('selectedProductId')));
    //Redirect to the page that shows product details
    window.location.href = 'product-detail.html';
}

function productDetail()
{
    if (productId) {
        const product = productList.find(p => p.id == productId);

        isDisabled = false;

        if (product) {

            document.getElementById('product-name').textContent = product.name;
            document.getElementById('productImg').src = product.img;
            document.getElementById('product-price').textContent = `${currency}${product.price.toFixed(2)}`;
            document.getElementById('stock').textContent = `Left in Stock: ${product.stock}`;

            const inputDiv = document.getElementById('quantity');
            inputDiv.innerHTML = '';

            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'input-quantity';
            input.value = 1;
            input.min = 1;
            input.max = product.stock;
            input.style = 'width: 80px;';
            input.id = 'product-quantity';

            inputDiv.appendChild(input);
        } else {
            alert("Product not found!");
            flag = false;
        }
    }
}

//Currency Exchange
function setCurrency(currency) {

    if (exchangeRates[currency]) {

        currentCurrency = currency;

        localStorage.setItem('preferredCurrency', currency);

        updatePrices();

        updateAndStoreConvertedProducts(convertProducts);
    }
}

//This function convert the price based on the current currency rates
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

// Add item to cart with quantity validation
function addToCart(productId, quantity) {

    const pid = parseInt(productId);

    quantity = parseInt(quantity) || 1;

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
            alert(`You reached the maximum quantity of this product.`);
            return false;
        }

        cartItems.push({
            id: pid,
            name: product.name,
            price: parseFloat(product.price),
            img: product.img,
            stock: parseInt(product.stock) || 10,
            quantity: parseInt(quantity)
        });
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));

    alert('Product added to cart');

    updateCartCounter();
    return true;
}

//This function remove or update item quantity in cart
function updateCartItemQuantity(productId, newQuantity) {

    newQuantity = parseInt(newQuantity);

    //Getting current cart from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    //Finding the item in cart
    const itemIndex = cartItems.findIndex(item => item.id == productId);

    //If item doesn't exist, return
    if (itemIndex === -1){
        return false;
    }

    if (newQuantity <= 0) {
        //Removing item completely if the quantity is 0 or less
        cartItems.splice(itemIndex, 1);

    } else {
        //Updating the quantity respecting maximum limit
        const maxQuantity = cartItems[itemIndex].stock || 10;
        cartItems[itemIndex].quantity = Math.min(newQuantity, maxQuantity);
    }

    //Saving the updated cart
    localStorage.setItem('cart', JSON.stringify(cartItems));

    if (document.querySelector('.cart-page')) {
        displayCartItems(cartItems);
    }

    updateCartCounter();
    return true;
}

//This function remove completely item from cart
function removeFromCart(productId, qty) {
    updateCartItemQuantity(productId, qty - 1); // Setting quantity to 0 removes the item
}

function updateCartCounter() {

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const counter = document.querySelector('.cart-counter');

    //Break if the element does not exist
    if (!counter){
        return;
    }

    if (cartItems.length === 0) {
        counter.classList.add('hidden');
    } else {
        counter.textContent = cartItems.length;
        counter.classList.remove('hidden');
    }
}

//This function store reviews in localstorage.
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