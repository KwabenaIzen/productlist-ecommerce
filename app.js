const productsContainer = document.querySelector(".allproduct-container");
const cart = []; // Initialize the cart array

fetch("data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("404 Page Not Found!");
    }
    return response.json();
  })
  .then((data) => {
    // Render products
    for (let i = 0; i < data.length; i++) {
      const product = document.createElement("div");
      product.classList.add("product");
      product.innerHTML = `
        <div class="img-container">
          <img class="product-image" src="${data[i].image.desktop}" alt="" />
          <button class="add-btn" data-index="${i}">
            <img src="assets/images/icon-add-to-cart.svg" alt="" /> Add to Cart
          </button>
          <div class="quantity-btn ">
            <span class="decrement">
              <img src="assets/images/icon-decrement-quantity.svg" alt="" />
            </span>
            <span class="quantity">1</span>
            <span class="increment">
              <img src="assets/images/icon-increment-quantity.svg" alt="" />
            </span>
          </div>
        </div>
        <p class="category">${data[i].category}</p>
        <h3 class="product-name">${data[i].name}</h3>
        <p class="price">$${data[i].price.toFixed(2)}</p>
      `;
      productsContainer.appendChild(product);
    }

    const cartCount = document.querySelector(".cart-counter");

    // Handle Add to Cart button
    const addBtns = document.querySelectorAll(".add-btn");
    addBtns.forEach((addBtn) => {
      addBtn.addEventListener("click", (e) => {
        const cartEmpty = document.querySelector(".empty-img");
        cartEmpty.style.display = "none";
        document.querySelector(".selection-container").style.display = "block";
        document.querySelector(".total-price").style.display = "flex";
        document.querySelector(".delivery-para").style.display = "flex";
        document.querySelector(".confirm-btn").style.display = "block";
        const totalCont = document.querySelector(".total-price");
        const index = e.currentTarget.dataset.index;
        const product = data[index];
        const parent = e.currentTarget.closest(".product");

        // Add product to the cart
        addToCart(product.name, product.price);

        // Hide Add to Cart button and show quantity controls
        addBtn.style.display = "none";
        const quantityControls = parent.querySelector(".quantity-btn");
        quantityControls.classList.add("active");

        // Initialize quantity controls
        const quantity = quantityControls.querySelector(".quantity");
        quantity.innerText = 1;

        // Increment button
        const increment = quantityControls.querySelector(".increment");
        increment.addEventListener("click", () => {
          const cartItem = cart.find((item) => item.name === product.name);
          if (cartItem) {
            cartItem.quantity += 1;
            quantity.innerText = cartItem.quantity;
            updateCartCount();
            renderCart();
          }
        });

        // Decrement button
        const decrement = quantityControls.querySelector(".decrement");
        decrement.addEventListener("click", () => {
          const cartItem = cart.find((item) => item.name === product.name);
          if (cartItem && cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            quantity.innerText = cartItem.quantity;
            updateCartCount();
            renderCart();
          } else if (cartItem && cartItem.quantity === 1) {
            // Remove from cart if quantity is 0
            cart.splice(cart.indexOf(cartItem), 1);

            addBtn.style.display = "flex";
            quantityControls.classList.remove("active");
            const cartEmpty = document.querySelector(".empty-img");
            cartEmpty.style.display = "flex";
            document.querySelector(".selection-container").style.display =
              "none";
            document.querySelector(".total-price").style.display = "none";
            document.querySelector(".delivery-para").style.display = "none";
            document.querySelector(".confirm-btn").style.display = "none";
            updateCartCount();
            renderCart();
          }
        });

        updateCartCount();
        renderCart();
      });
    });

    // Add to cart function
    function addToCart(name, price) {
      const existingItem = cart.find((item) => item.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }
    }

    // Render cart
    function renderCart() {
      const cartOrder = document.querySelector(".cart-orders");
      cartOrder.innerHTML = ""; // Clear existing cart items
      cart.forEach((item) => {
        const selected = document.createElement("div");
        selected.classList.add("selected");
        selected.innerHTML = `
          <div class="selected">
            <h3 class="food-name">${item.name}</h3>
            <span class="times">${item.quantity}x</span>
            <span class="select-price">$${(item.price * item.quantity).toFixed(
              2
            )}</span>
            <span class="cancel" data-name="${item.name}">
              <img src="assets/images/icon-remove-item.svg" />
            </span>
            <hr />
          </div>
        `;

        cartOrder.appendChild(selected);
      });
      const confirmBtn = document.querySelector(".confirm-btn");
      confirmBtn.addEventListener("click", () => {
        confirmBtn.style.display = "none";
        document.querySelector(".confirmation-message").style.display = "block";
        document.querySelector(".allproduct-container").style.filter =
          "blur(2px) saturate(50%)";

        document.querySelector(".carts-container").style.filter = "blur(2px)";
        cart.forEach((item) => {
          const confselected = document.createElement("div");
          confselected.classList.add("conf-selected");
          confselected.innerHTML = `
            <div class="selected">
              <h3 class="food-name">${item.name}</h3>
              <span class="times">${item.quantity}x</span>
              <span class="select-price">$${(
                item.price * item.quantity
              ).toFixed(2)}</span>
             
              <hr />
            </div>
          `;
          document
            .querySelector(".confirmation-message-choices")
            .appendChild(confselected);
          const totallPrice = document.querySelector(".conf");
          totallPrice.innerText = `$${cart
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toFixed(2)}`;
        });
      });
      const newOrder = document.querySelector(".neworder-btn");
      newOrder.addEventListener("click", () => {
        document.querySelector(".confirmation-message-choices").innerHTML = "";
        document.querySelector(".confirmation-message").style.display = "none";
        resetPage();
      });
      function resetPage() {
        location.reload();
      }
      const totallPrice = document.querySelector(".overall-price");
      totallPrice.innerText = `$${cart
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2)}`;

      // Add event listeners to remove buttons
      const removeBtns = document.querySelectorAll(".cancel");
      removeBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const name = e.currentTarget.dataset.name;
          const index = cart.findIndex((item) => item.name === name);
          if (index !== -1) {
            cart.splice(index, 1);
            renderCart();
            updateCartCount();
          }
        });
      });
    }

    // Update cart count
    function updateCartCount() {
      cartCount.innerText = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );
    }
  })
  .catch((err) => alert(err));
