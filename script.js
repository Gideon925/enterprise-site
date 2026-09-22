/* =====================================================
   EMMYMAX ENTERPRISES
   SHOPPING CART JAVASCRIPT
===================================================== */


/* =====================================================
   CART DATA
===================================================== */

let cart = [];


/* =====================================================
   GET HTML ELEMENTS
===================================================== */

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

const cartButton = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartOverlay = document.getElementById("cartOverlay");
const clearCartButton = document.getElementById("clearCart");
const checkoutButton = document.getElementById("checkoutBtn");

const menuButton = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");

const year = document.getElementById("year");


/* =====================================================
   FORMAT MONEY
===================================================== */

function formatMoney(amount) {

    return "₦" + Number(amount).toLocaleString("en-NG");

}


/* =====================================================
   SHOW TOAST
===================================================== */

let toastTimer;

function showToast(message) {

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* =====================================================
   ADD PRODUCT TO CART
===================================================== */

function addToCart(product) {

    const existingProduct = cart.find(
        item => item.id === product.id
    );


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({

            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1

        });

    }


    updateCart();

    showToast(
        product.name + " added to cart"
    );

}


/* =====================================================
   GET PRODUCT FROM CARD
===================================================== */

function getProductFromCard(productCard) {

    if (!productCard) {
        return null;
    }


    const image =
        productCard.querySelector("img");


    return {

        id: Number(
            productCard.dataset.id
        ),

        name:
            productCard.dataset.name,

        price:
            Number(
                productCard.dataset.price
            ),

        image:
            image
                ? image.getAttribute("src")
                : ""

    };

}


/* =====================================================
   ADD TO CART BUTTONS
===================================================== */

document
    .querySelectorAll(".add-cart")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const productCard =
                    this.closest(".product-card");


                const product =
                    getProductFromCard(
                        productCard
                    );


                if (!product) {
                    return;
                }


                addToCart(product);

            }
        );

    });


/* =====================================================
   UPDATE CART
===================================================== */

function updateCart() {

    if (!cartItems) {
        return;
    }


    cartItems.innerHTML = "";


    let total = 0;
    let itemCount = 0;


    /* =================================================
       EMPTY CART
    ================================================= */

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add products to your cart
                    to see them here.
                </p>

            </div>

        `;

    }


    /* =================================================
       DISPLAY CART PRODUCTS
    ================================================= */

    cart.forEach(item => {

        const subtotal =
            item.price * item.quantity;


        total += subtotal;

        itemCount += item.quantity;


        const cartItem =
            document.createElement("div");


        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div class="cart-item-info">

                <h4>
                    ${item.name}
                </h4>

                <strong>
                    ${formatMoney(item.price)}
                </strong>

                <div class="quantity">

                    <button
                        type="button"
                        class="minus"
                        aria-label="Decrease quantity">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        class="plus"
                        aria-label="Increase quantity">
                        +
                    </button>

                </div>

            </div>

            <button
                type="button"
                class="remove-item"
                aria-label="Remove ${item.name}">
                ×
            </button>

        `;


        /* =================================================
           MINUS
        ================================================= */

        cartItem
            .querySelector(".minus")
            .addEventListener(
                "click",
                function () {

                    changeQuantity(
                        item.id,
                        -1
                    );

                }
            );


        /* =================================================
           PLUS
        ================================================= */

        cartItem
            .querySelector(".plus")
            .addEventListener(
                "click",
                function () {

                    changeQuantity(
                        item.id,
                        1
                    );

                }
            );


        /* =================================================
           REMOVE
        ================================================= */

        cartItem
            .querySelector(".remove-item")
            .addEventListener(
                "click",
                function () {

                    removeFromCart(
                        item.id
                    );

                }
            );


        cartItems.appendChild(
            cartItem
        );

    });


    /* =================================================
       UPDATE CART COUNT
    ================================================= */

    if (cartCount) {

        cartCount.textContent =
            itemCount;

    }


    /* =================================================
       UPDATE CART TOTAL
    ================================================= */

    if (cartTotal) {

        cartTotal.textContent =
            formatMoney(total);

    }

}


/* =====================================================
   CHANGE QUANTITY
===================================================== */

function changeQuantity(id, change) {

    const product =
        cart.find(
            item => item.id === id
        );


    if (!product) {
        return;
    }


    product.quantity += change;


    if (product.quantity <= 0) {

        cart = cart.filter(
            item => item.id !== id
        );

    }


    updateCart();

}


/* =====================================================
   REMOVE PRODUCT
===================================================== */

function removeFromCart(id) {

    cart = cart.filter(
        item => item.id !== id
    );


    updateCart();

}


/* =====================================================
   FILTER PRODUCTS
===================================================== */

function filterProducts(category) {

    const products =
        document.querySelectorAll(
            ".product-card"
        );


    products.forEach(product => {

        const productCategory =
            product.dataset.category;


        if (
            category === "all" ||
            productCategory === category
        ) {

            product.style.display = "";

        } else {

            product.style.display = "none";

        }

    });


    /* Update active filter */

    document
        .querySelectorAll(".filter")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.filter === category
            );

        });

}


/* =====================================================
   PRODUCT FILTER BUTTONS
===================================================== */

document
    .querySelectorAll(".filter")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const category =
                    this.dataset.filter;


                filterProducts(
                    category
                );

            }
        );

    });


/* =====================================================
   CATEGORY CARDS
===================================================== */

document
    .querySelectorAll(".category-card")
    .forEach(categoryCard => {

        categoryCard.addEventListener(
            "click",
            function () {

                const category =
                    this.dataset.category;


                /* =========================================
                   SERVICES
                ========================================= */

                if (category === "services") {

                    const services =
                        document.getElementById(
                            "services"
                        );


                    if (services) {

                        services.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                    return;

                }


                /* =========================================
                   FILTER PRODUCTS
                ========================================= */

                filterProducts(
                    category
                );


                /* =========================================
                   SCROLL TO SHOP
                ========================================= */

                const shop =
                    document.getElementById(
                        "shop"
                    );


                if (shop) {

                    shop.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    });


/* =====================================================
   OPEN CART
===================================================== */

if (cartButton && cartPanel) {

    cartButton.addEventListener(
        "click",
        function () {

            cartPanel.classList.add(
                "open"
            );

            document.body.style.overflow =
                "hidden";

        }
    );

}


/* =====================================================
   CLOSE CART FUNCTION
===================================================== */

function closeCartPanel() {

    if (!cartPanel) {
        return;
    }


    cartPanel.classList.remove(
        "open"
    );


    document.body.style.overflow =
        "";

}


/* =====================================================
   CLOSE CART BUTTON
===================================================== */

if (closeCart) {

    closeCart.addEventListener(
        "click",
        closeCartPanel
    );

}


/* =====================================================
   CLOSE CART OVERLAY
===================================================== */

if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        closeCartPanel
    );

}


/* =====================================================
   ESCAPE KEY CLOSES CART
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            cartPanel &&
            cartPanel.classList.contains("open")
        ) {

            closeCartPanel();

        }

    }
);


/* =====================================================
   CLEAR CART
===================================================== */

if (clearCartButton) {

    clearCartButton.addEventListener(
        "click",
        function () {

            if (cart.length === 0) {

                showToast(
                    "Cart is already empty"
                );

                return;

            }


            cart = [];

            updateCart();

            showToast(
                "Cart cleared"
            );

        }
    );

}


/* =====================================================
   WHATSAPP CHECKOUT
===================================================== */

if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        function () {

            if (cart.length === 0) {

                showToast(
                    "Your cart is empty"
                );

                return;

            }


            let message =
                "Hello Emmymax Enterprises, I want to place an order:\n\n";


            let total = 0;


            cart.forEach(item => {

                const subtotal =
                    item.price *
                    item.quantity;


                total += subtotal;


                message +=
                    item.name +
                    " x " +
                    item.quantity +
                    " = " +
                    formatMoney(subtotal) +
                    "\n";

            });


            message +=
                "\nTotal: " +
                formatMoney(total);


            message +=
                "\n\nPlease confirm availability and delivery details.";


            const whatsappNumber =
                "2348061539016";


            const whatsappURL =
                "https://wa.me/" +
                whatsappNumber +
                "?text=" +
                encodeURIComponent(
                    message
                );


            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );

}


/* =====================================================
   MOBILE MENU
===================================================== */

if (menuButton && mainNav) {

    menuButton.addEventListener(
        "click",
        function () {

            const isOpen =
                mainNav.classList.toggle(
                    "show"
                );


            menuButton.setAttribute(
                "aria-expanded",
                isOpen
            );

        }
    );

}


/* =====================================================
   CLOSE MOBILE MENU WHEN LINK IS CLICKED
===================================================== */

document
    .querySelectorAll("#mainNav a")
    .forEach(link => {

        link.addEventListener(
            "click",
            function () {

                if (mainNav) {

                    mainNav.classList.remove(
                        "show"
                    );

                }


                if (menuButton) {

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    });


/* =====================================================
   CURRENT YEAR
===================================================== */

if (year) {

    year.textContent =
        new Date().getFullYear();

}


/* =====================================================
   IMAGE ERROR HANDLING
===================================================== */

document
    .querySelectorAll(
        ".product-image img, .category-photo img"
    )
    .forEach(image => {

        image.addEventListener(
            "error",
            function () {

                this.style.display =
                    "none";

                const parent =
                    this.parentElement;


                if (parent) {

                    parent.classList.add(
                        "image-error"
                    );

                }

            }
        );

    });


/* =====================================================
   START
===================================================== */

filterProducts("all");

updateCart();