let products = [];

let cartItems = [];

function initialize()
{
    currentTime();
    setInterval(currentTime, 1000);
    displayProducts();
    displayCartItems(cartItems);

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

function displayProducts()
{
     products = [
        new Product(1, "Red Puma T-Shirt", 19, "img/product-1.jpg", 4, 10),
        new Product(2, "Blue Puma T-Shirt", 49, "img/product-4.jpg", 3.5, 20),
        new Product(3, "Black Puma T-Shirt", 29, "img/product-6.jpg", 4.5, 5),
        new Product(4, "Yellow Puma T-Shirt", 39, "img/product-4.jpg", 2, 1),

        new Product(5, "Nike Grey Shoes", 59, "img/product-5.jpg", 2, 4),
        new Product(6, "Black Shoes", 39, "img/product-10.jpg", 2, 1),
        new Product(7, "Adidas Grey Shoes", 69, "img/product-11.jpg", 2, 7),
        new Product(8, "Black Adidas Shoes", 79, "img/product-2.jpg", 2, 5),

        new Product(9, "Black Fossil", 1009, "img/product-8.jpg", 2, 10),
        new Product(10, "Grey George Armani", 2099, "img/product-9.jpg", 2, 5),
        new Product(11, "Black LV", 3999, "img/product-8.jpg", 2, 4),
        new Product(12, "Grey Patek Philippe", 4000, "img/product-9.jpg", 2, 3)
    ];

    renderProducts(products, "tshirts", 0);
    renderProducts(products, "shoes", 4);
    renderProducts(products, "wristwatch", 8);
}

function displayCartItems(cartItems) {
    // Exemplo de uso:
    cartItems = [
        { id: 1, name: "Red Printed T-shirt", price: 50.00, quantity: 2, img: "img/buy-1.jpg" },
        { id: 2, name: "Black Jeans", price: 75.00, quantity: 1, img: "img/buy-2.jpg" },
        { id: 3, name: "White Sneakers", price: 120.00, quantity: 1, img: "img/buy-3.jpg" }
    ];

    const tbody = document.querySelector('.cart-page table'); // Usa o table diretamente se não tiver tbody

    // Limpa apenas as linhas de itens (mantém o cabeçalho)
    const rows = tbody.querySelectorAll('tr:not(:first-child)');
    rows.forEach(row => row.remove());

    let subtotal = 0;

    // Adiciona cada item do carrinho
    cartItems.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="cart-info">
                    <img src="${item.img || 'img/default-product.jpg'}" alt="${item.name}">
                    <div>
                        <p>${item.name}</p>
                        <small>Price: $${item.price.toFixed(2)}</small>
                        <br>
                        <a href="#" class="remove-item" data-id="${item.id}">Remove</a>
                    </div>
                </div>
            </td>
            <td><input type="number" value="${item.quantity}" min="1" class="item-quantity" data-id="${item.id}"></td>
            <td>$${itemSubtotal.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });

    // Atualiza os totais
    const tax = subtotal * 0.1; // 10% de taxa (ajuste conforme necessário)
    const total = subtotal + tax;

    alert(total);

    document.querySelector('.total-price tr:nth-child(1) td:last-child').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.total-price tr:nth-child(2) td:last-child').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.total-price tr:nth-child(3) td:last-child').textContent = `$${total.toFixed(2)}`;
}

window.addEventListener('DOMContentLoaded', initialize);

