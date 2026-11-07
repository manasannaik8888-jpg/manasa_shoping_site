
// Get HTML Elements

const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const cartButton = document.getElementById("cartButton");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const noProducts = document.getElementById("noProducts");
const checkoutButton = document.getElementById("checkoutButton");

let products = [];
let cart = [];


// 1. Load Products From JSON File

async function loadProducts() {

    try {

        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {

        console.error("Error:", error);

        productContainer.innerHTML =
            "<p>Unable to load products. Please run the website using a local server.</p>";

    }

}


// 2. Display Products Dynamically

function displayProducts(productList) {

    productContainer.innerHTML = "";

    noProducts.hidden = productList.length !== 0;

    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

            </div>

            <div class="product-info">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3>${product.name}</h3>

                <div class="rating">

                    ${"★".repeat(Math.floor(product.rating))}
                    ${"☆".repeat(5 - Math.floor(product.rating))}

                    <span>(${product.rating})</span>

                </div>

                <div class="product-bottom">

                    <span class="price">
                        ₹${product.price.toLocaleString("en-IN")}
                    </span>

                    <button
                        class="add-cart"
                        data-id="${product.id}"
                    >

                        <i class="fas fa-cart-plus"></i>
                        Add

                    </button>

                </div>

            </div>

        `;

        productContainer.appendChild(card);

    });

}


// 3. Search Products

searchInput.addEventListener("input", function() {

    const searchValue = this.value.toLowerCase().trim();

    const filteredProducts = products.filter(product => {

        return (
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue)
        );

    });

    displayProducts(filteredProducts);

});


// 4. Add Products To Cart

function addToCart(productId) {

    const product = products.find(p => p.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    updateCart();

}


// Listen For Add To Cart Clicks

productContainer.addEventListener("click", function(event) {

    const button = event.target.closest(".add-cart");

    if (!button) return;

    const productId = Number(button.dataset.id);

    addToCart(productId);

    button.innerHTML = '<i class="fas fa-check"></i> Added';

    setTimeout(() => {

        button.innerHTML =
            '<i class="fas fa-cart-plus"></i> Add';

    }, 700);

});


// 5. Update Cart

function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty!
            </p>
        `;

    }

    cart.forEach(item => {

        total += item.price * item.quantity;

        totalItems += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <p>
                    ₹${(item.price * item.quantity).toLocaleString("en-IN")}
                </p>

                <div class="quantity-controls">

                    <button
                        data-action="decrease"
                        data-id="${item.id}"
                        aria-label="Decrease quantity"
                    >-</button>

                    <span>${item.quantity}</span>

                    <button
                        data-action="increase"
                        data-id="${item.id}"
                        aria-label="Increase quantity"
                    >+</button>

                </div>

            </div>

            <button
                class="remove-item"
                data-action="remove"
                data-id="${item.id}"
                aria-label="Remove product"
            >

                <i class="fas fa-trash"></i>

            </button>

        `;

        cartItems.appendChild(cartItem);

    });

    cartCount.textContent = totalItems;

    cartTotal.textContent =
        "₹" + total.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

}


// 6. Cart Quantity And Remove Functionality

cartItems.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const productId = Number(button.dataset.id);

    const action = button.dataset.action;

    const item = cart.find(p => p.id === productId);

    if (!item) return;

    if (action === "increase") {

        item.quantity++;

    }

    else if (action === "decrease") {

        item.quantity--;

        if (item.quantity <= 0) {

            cart = cart.filter(p => p.id !== productId);

        }

    }

    else if (action === "remove") {

        cart = cart.filter(p => p.id !== productId);

    }

    updateCart();

});


// 7. Open And Close Cart

function openCart() {

    cartSidebar.classList.add("active");

    cartOverlay.classList.add("active");

}

function hideCart() {

    cartSidebar.classList.remove("active");

    cartOverlay.classList.remove("active");

}

cartButton.addEventListener("click", openCart);

closeCart.addEventListener("click", hideCart);

cartOverlay.addEventListener("click", hideCart);


// 8. Checkout Button

checkoutButton.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Your cart is empty! Please add some products.");

        return;

    }

    const total = cart.reduce((sum, item) => {

        return sum + item.price * item.quantity;

    }, 0);

    alert(
        "Thank you for shopping at ShopZone!\n\n" +
        "Your order total is ₹" +
        total.toLocaleString("en-IN") +
        "\n\nThis is a demo checkout."
    );

});


// 9. Start Website

loadProducts();

updateCart();
