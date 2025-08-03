(() => {
  let products = [];
  let favoriteProducts = [];

  const BASE_API_URL = "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json";

  const init = async () => {
    if (window.location.pathname !== "/" && window.location.pathname !== "/index.html") {
      console.log("wrong page");
      return;
    }

    loadFavorites();
    await fetchData();
    buildHTML();
    buildCSS();
    setEvents();
  };

  // Load favorite products from localStorage
  const loadFavorites = () => {
    try {
      const storedFavorites = localStorage.getItem("favoriteProducts");
      favoriteProducts = storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
      console.log("Error loading favorites from localStorage:", error);
      favoriteProducts = [];
    }
  };

  const fetchData = async () => {
    try {
      const stored = localStorage.getItem("products");
      if (stored) return (products = JSON.parse(stored));

      const response = await fetch(BASE_API_URL);
      products = await response.json();
      localStorage.setItem("products", JSON.stringify(products));
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  const buildHTML = () => {
    const container = document.createElement("div");
    container.className = "container";

    const header = document.createElement("header");
    header.innerText = "Beğenebileceğinizi düşündüklerimiz";

    const carousel = document.createElement("div");
    carousel.className = "carousel-container";

    const carouselWrapper = document.createElement("div");
    carouselWrapper.className = "carousel-wrapper";

    const itemsHTML = products
      .map((product) => {
        // Destructure product properties
        const { id, name, brand, price, original_price, url, img } = product;

        const hasDiscount = price < original_price;
        const discountPercent = hasDiscount
          ? Math.round(((original_price - price) / original_price) * 100)
          : 0;

        // Generate random rating and review count
        const rating = Math.floor(Math.random() * 5) + 1;
        const reviewCount = Math.floor(Math.random() * 100) + 1;
        const stars = Math.floor(parseFloat(rating));
        const isFavorite = favoriteProducts.includes(id);

        return `
        <div class="carousel-item">
        <a href="${url}" target="_blank" class="product-link">
          <div class="product-card">
              <div class="product-image-container">
                <img src="${img}" alt="${name}" class="product-image" />
              <button class="favorite-btn ${
                isFavorite ? "favorited" : ""
              }" data-product-id="${id}">
              <!-- Generate favorite icon -->
                <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
                  <path d="M17.367 1.594c-2.021-1.981-5.3-1.981-7.321
                   0L10 1.64l-.046-.046c-2.021-1.981-5.3-1.981-7.321 0-2.022
                    1.98-2.022 5.193 0 7.173L10 16.4l7.367-7.633c2.022-1.98 
                    2.022-5.193 0-7.173z" stroke="currentColor" stroke-width="1.5" 
                    fill="${isFavorite ? "#ff8c00" : "none"}"/>
                </svg>
              </button>
            </div>
            
            <div class="product-info">
              <p class="product-name"><span class="product-brand">${brand}</span> - ${name}</p>
              <div class="rating-container">
                <div class="stars">
                  ${Array.from(
                    { length: 5 },
                    (_, i) =>
                      `<span class="star ${i < stars ? "filled" : ""}">${
                        i < stars ? "★" : "☆"
                      }</span>`
                  ).join("")}
                </div>
                <span class="rating-text">(${reviewCount})</span>
              </div>
              
              <div class="price-container">
                ${
                  hasDiscount
                    ? `<span class="original-price">${original_price} TL</span>`
                    : ""
                }
               
                ${
                  hasDiscount
                    ? `<div class="discount-percent">%${discountPercent} 
                    </div>
                    <!-- Creating a discount icon -->
                    <span class="discount-icon">
                    <svg xmlns="http://www.w3.org/2000/svg"
                     width="20"
                     height="20"
                     viewBox="0 0 48 48"
                     fill="none">
                 
                  <circle 
                    cx="24" cy="24" r="22"
                    fill="#00a365"
                    stroke="#00a365"
                    stroke-width="3"
                    stroke-dasharray="4 4"
                 />

                <line 
                 x1="24" y1="14" x2="24" y2="30" 
                 stroke="white" stroke-width="3" stroke-linecap="round"
                />

                <polyline 
                  points="16 24, 24 34, 32 24" 
                  stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"
                />
                </span>
                </svg> `: ""
                }
                 
              </div>
              <div class="current-price ${
                hasDiscount ? "discounted" : ""
              }">${price} TL</div>
              <div class="promote-info">
                <span class="promote-text">Farklı Ürünlerde 3 Al 2 Öde</span>
              </div>
              <button class="add-to-cart-btn">Sepete Ekle</button>
            </div>
          </div>
           </a>
        </div>
      `;
      })
      .join("");

    carousel.innerHTML = itemsHTML;

    const navigationHTML = `
      <button class="nav-arrow prev-arrow" aria-label="Önceki">‹</button>
      <button class="nav-arrow next-arrow" aria-label="Sonraki">›</button>
    `;

    carouselWrapper.innerHTML = navigationHTML;
    carouselWrapper.appendChild(carousel);

    container.appendChild(header);
    container.appendChild(carouselWrapper);
    document.body.appendChild(container);
  };

  // Load Google Fonts
  const loadFonts = () => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=Quicksand:wght@700&display=swap";
    document.head.appendChild(link);
  };

  loadFonts();

  const buildCSS = () => {
    const style = document.createElement("style");
    style.textContent = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
        
      .container {
        padding: 25px 60px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      header {
        font-family: 'Quicksand-Bold', sans-serif;
        font-size: 28.8px;
        font-weight: 700;
        background-color: #FEF6EB;
        color: rgb(242, 142, 0);
        padding: 16px;
        margin: 0;
        line-height: 31.968px;
        border-radius: 35px 35px 0 0;

      }
    
      .carousel-wrapper {
        position: relative;
        padding: 40px 60px;
        margin-top: 20px;
        overflow: hidden;
        background-color: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        font-family: Poppins, "cursive";

      }
      
      .nav-arrow {
        width: 50px;
        height: 50px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: #fef6eb;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 32px;
        color: #ff8c00;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 10;
      }
      
      .prev-arrow {
        left: 0;
      }
      
      .next-arrow {
        right: 0;
      }
      
      .nav-arrow:hover {
        background: white;
        border: 1px solid #ff8c00;
      }
      
      .carousel-container {
        display: flex;
        overflow-x: auto;
        gap: 15px;
        scrollbar-width: none;
      }
 
      .carousel-item {
        flex: 0 0 auto;
        width: calc((100% - 60px) / 5); /* 5 items per row */
      }
      
      .product-card {
        background: white;
        border: 4px solid transparent;
        border-radius: 10px;
        position: relative;
        margin: 0 0 20px 3px;
        padding: 1rem;
        font-size: 12px;
        min-height: 480px;
        box-shadow: 0 0 0 1px #e0e0e0;
         z-index: 1;
      }
      
      .product-card:hover {
         border-color: #ff8c00;
      }

      .product-link {
        text-decoration: none;
      }
      
      .product-image {
        width: 100%;
        object-fit: cover;
      }
      
      .favorite-btn {
        position: absolute;
        top: 24px;
        right: 24px;
        width: 36px;
        height: 36px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 50%;
        cursor: pointer;
        color: #666;
        transition: all 0.2s ease;
      }
      
      .favorite-btn:hover,
      .favorite-btn.favorited {
        color: #ff8c00;
        border-color: #ff8c00;
      }

      .discount-percent {
      font-size: 18px;
      font-weight: 700;
      line-height: 28.8px;
      color: rgb(0, 163, 101);
      }

      .discount-icon {
        margin: 3px 0 0 -5px;
      }
      
      .product-info {
        display: flex;
        flex-direction: column;
        height: 300px;
        overflow: hidden;
      }
      
      .product-info p {
        font-size: 12px;
        color: rgb(125, 125, 125);
        word-wrap: break-word;
      }
      
      .product-brand {
        font-weight: 600;
        color: #333;
      }
      
      .product-name {
        font-size: 1rem;
        color: rgb(125, 125, 125);
        line-height: 1.4;
        margin: 0 0 8px 0;
        overflow: hidden;
        word-wrap: break-word;
        padding: 1.4rem 0;
      }
      
      .rating-container {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
      }
      
      .stars {
        display: flex;
        gap: 2px;
      }
      
      .star {
        color: #ffc107;
        font-size: 20px;
      }
      
      .star:not(.filled) {
        color: #e0e0e0;
      }
      
      .rating-text {
        font-size: 12px;
        color: rgb(125, 125, 125);
      }
      
      .price-container {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 24px;
      }
      
      .original-price {
        font-size: 14px;
        color: rgb(125, 125, 125);
        text-decoration: line-through;
      }
      
      .current-price {
        font-size: 18px;
        font-weight: 700;
        color: #7d7d7d;
        font-size: 1.4rem;
        margin-top: 8px; 
        min-height: 28px;
        display: flex;
        align-items: center;
      }

      .current-price.discounted {
        color: #00a365;
      }
      
      .promote-info {
        margin-bottom: 1rem;
      }

      .promote-text {
        font-size: 11px;
        color: #4bb788;
        background: #eaf8f3;
        padding: 6px 5px;
        border-radius: 12px;
        display: inline-block;
        margin: 10px 0;
        font-weight: bold;
      }
      
      .add-to-cart-btn {
        background-color: #FEF6EB;
        color: #e67e00;
        border: none;
        padding: 12px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s ease;
        border-radius: 37.5px;
        margin-top: auto;
        width: 100%;
      }
      
      .add-to-cart-btn:hover {
        background: #e67e00;
        color: white;
      }

      /* Media Queries for responsive design */
      @media (max-width: 1024px) {
        .container {
          padding: 20px 40px;
        }

        .carousel-wrapper {
          padding: 0 50px;
        }

        .carousel-item {
          width: calc((100% - 45px) / 4); 
          min-width: 180px;
        }

        .product-card {
          min-height: 450px;
        }
      }

      @media (max-width: 768px) {
        .container {
          padding: 15px 20px;
        }

        header {
          font-size: 20px;
          padding: 12px;
          border-radius: 8px;
        }

        .carousel-wrapper {
          padding: 0 30px;
        }

        .carousel-item {
          width: calc((100% - 15px) / 2); 
          min-width: 150px;
        }

        .product-card {
          min-height: 420px;
          font-size: 11px;
        }

        .product-image {
          height: 160px;
        }

        .nav-arrow {
          width: 40px;
          height: 40px;
          font-size: 24px;
        }
      }

      @media (max-width: 480px) {
        body {
          padding: 10px;
        }

        .container {
          padding: 10px 15px;
        }

        .carousel-wrapper {
          padding: 0 25px;
        }

        .carousel-item {
          width: calc((100% - 10px) / 2); 
          min-width: 140px;
        }

        .product-card {
          min-height: 380px;
          padding: 0.3rem;
        }

        .product-image {
          height: 140px;
        }

        .current-price {
          font-size: 18px;
        }

        .add-to-cart-btn {
          padding: 8px 10px;
          font-size: 12px;
        }

        .favorite-btn {
          width: 30px;
          height: 30px;
          top: 18px;
          right: 18px;
        }

        .favorite-btn svg {
          width: 16px;
          height: 14px;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const setEvents = () => {
    const prevBtn = document.querySelector(".prev-arrow");
    const nextBtn = document.querySelector(".next-arrow");
    const carousel = document.querySelector(".carousel-container");

    // Function to calculate the scroll amount based on the width of the carousel items
    const getScrollAmount = () => {
    let item = document.querySelector(".carousel-item");
    return item ? item.offsetWidth + 15 : 0; 
    };

    prevBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    });

    // Set click events for all favorite buttons
    document.querySelectorAll(".favorite-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = parseInt(btn.getAttribute("data-product-id"));

        const isFavorited = favoriteProducts.includes(productId);

        // Toggle favorite status
       const toggleFavorite = (add) => {
         btn.classList.toggle("favorited", add);
         btn.querySelector("path").setAttribute("fill", add ? "#ff8c00" : "none");
      };

      if (isFavorited) {
        favoriteProducts = favoriteProducts.filter(id => id !== productId);
        toggleFavorite(false);
      } else {
        favoriteProducts.push(productId);
        toggleFavorite(true);
      }
        saveFavoritesToStorage();
      });
    });

    // Function to save favorite products to localStorage
    const saveFavoritesToStorage = () => {
      try {
        localStorage.setItem(
          "favoriteProducts",
          JSON.stringify(favoriteProducts)
        );
      } catch (error) {
        console.error("Error saving favorites to localStorage:", error);
      }
    };

    // Set click events for all add-to-cart buttons
    document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        btn.innerText = "Sepete Eklendi!";
        setTimeout(() => {
          btn.innerText = "Sepete Ekle";
        }, 2000);
      });
    });
  };

  init();
})();
