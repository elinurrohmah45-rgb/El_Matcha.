document.addEventListener('DOMContentLoaded', () => {
    // --- SIMULATED DATA (DATABASE) ---
    const products = [
        { id: 1, name: 'Ceremonial Grade Matcha', price: 350000, category: 'Powder', image: 'https://i.pinimg.com/1200x/87/4c/de/874cdee6180e7b89770a44ecfaedc564.jpg' },
        { id: 2, name: 'Iced Matcha Latte Kit', price: 450000, category: 'Kits', image: 'https://i.pinimg.com/1200x/c1/5b/5a/c15b5a19fb93ebbf1cc147b1516aa6da.jpg' },
        { id: 3, name: 'Bamboo Whisk (Chasen)', price: 180000, category: 'Accessories', image: 'https://i.pinimg.com/1200x/2a/d5/7b/2ad57bce81529ce11c525ad3ba30710c.jpg' },
        { id: 4, name: 'Hojicha Roasted Green Tea', price: 280000, category: 'Powder', image: 'https://i.pinimg.com/1200x/01/ab/36/01ab36be4852c199941c47439fdbfb5e.jpg' },
        { id: 5, name: 'Matcha Bowl (Chawan)', price: 250000, category: 'Accessories', image: 'https://i.pinimg.com/1200x/8d/63/53/8d63538a556bd2b83673f28fbed10380.jpg' },
        { id: 6, name: 'Genmaicha Brown Rice Tea', price: 220000, category: 'Tea Bags', image: 'https://i.pinimg.com/1200x/54/5c/9b/545c9ba4c774dce9b58e40b81cfbeef7.jpg' },
        { id: 7, name: 'Starter Matcha Kit', price: 750000, category: 'Kits', image: 'https://i.pinimg.com/736x/22/6a/cc/226accf69e3a1e289c346bd67d81b3cb.jpg' },
        { id: 8, name: 'Culinary Grade Matcha', price: 200000, category: 'Powder', image: 'https://i.pinimg.com/1200x/ab/4a/e5/ab4ae58febbddfcc24a2539740847ae0.jpg' },
    ];

    // --- STATE MANAGEMENT ---
    let cart = [];
    let shippingCost = 15000;
    let currentFilters = { searchTerm: '', category: 'all' };

    // --- DOM ELEMENTS ---
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const productGrid = document.getElementById('product-grid');
    const featuredGrid = document.getElementById('featured-products-grid');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const searchInput = document.getElementById('search-input');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartSummaryDiv = document.getElementById('cart-summary');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutForm = document.getElementById('checkout-form');
    const shippingSelect = document.getElementById('shipping');

    // --- CORE FUNCTIONS ---
    const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

    window.showPage = (pageId) => {
        pages.forEach(page => page.classList.add('hidden'));
        document.getElementById(pageId).classList.remove('hidden');
        
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
        });
        
        if (pageId === 'shop-page') {
            currentFilters.searchTerm = '';
            searchInput.value = '';
            renderProducts();
            document.querySelector('.category-btn[data-category="all"]').click();
        }
        window.scrollTo(0, 0);
    };
    
    window.goHomeAndReset = () => {
        cart = [];
        checkoutForm.reset();
        updateCartDisplay();
        showPage('home-page');
    };

    const createProductCard = (product) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${formatRupiah(product.price)}</p>
                <div class="product-actions">
                    <button class="btn btn-secondary buy-now-btn" data-id="${product.id}">Buy</button>
                    <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        return card;
    };

    const renderProducts = () => {
        productGrid.innerHTML = '';
        const { searchTerm, category } = currentFilters;
        const filteredProducts = products.filter(p => 
            (category === 'all' || p.category === category) &&
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        filteredProducts.forEach(product => productGrid.appendChild(createProductCard(product)));
    };

    const renderFeaturedProducts = () => {
        featuredGrid.innerHTML = '';
        products.slice(0, 4).forEach(product => featuredGrid.appendChild(createProductCard(product)));
    };

    const renderCategories = () => {
        const categories = ['all', ...new Set(products.map(p => p.category))];
        categoryFiltersContainer.innerHTML = '';
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.textContent = cat === 'all' ? 'All' : cat;
            btn.dataset.category = cat;
            if (cat === 'all') btn.classList.add('active');
            Object.assign(btn.style, {
                padding: '8px 15px',
                border: '1px solid var(--border-color)',
                backgroundColor: '#fff',
                borderRadius: '20px',
                cursor: 'pointer'
            });
            categoryFiltersContainer.appendChild(btn);
        });
    };

    const updateCartDisplay = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        if (cart.length === 0) {
            cartSummaryDiv.classList.add('hidden');
            emptyCartMessage.classList.remove('hidden');
            cartItemsContainer.innerHTML = '';
        } else {
            cartSummaryDiv.classList.remove('hidden');
            emptyCartMessage.classList.add('hidden');
            cartItemsContainer.innerHTML = '';
            cart.forEach(item => {
                const li = document.createElement('li');
                li.className = 'cart-item';
                li.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info"><h4>${item.name}</h4><p>${formatRupiah(item.price)}</p></div>
                    <div class="cart-item-actions"><input type="number" class="quantity-input" data-id="${item.id}" value="${item.quantity}" min="1" style="width: 50px; text-align: center; padding: 5px; border: 1px solid var(--border-color); border-radius: 4px;"><button class="remove-btn" data-id="${item.id}" style="background: none; border: none; color: red; cursor: pointer; margin-left: 15px;">Remove</button></div>
                `;
                cartItemsContainer.appendChild(li);
            });
        }
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalEl.textContent = formatRupiah(total);
    };

    const addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) cartItem.quantity++;
        else cart.push({ ...product, quantity: 1 });
        updateCartDisplay();
    };
    
    const buyNow = (productId) => {
        const product = products.find(p => p.id === productId);
        cart = [{ ...product, quantity: 1 }];
        updateCartDisplay();
        updateOrderSummary();
        showPage('checkout-page');
    };

    const updateOrderSummary = () => {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        shippingCost = parseInt(shippingSelect.value === 'reguler' ? 15000 : 30000);
        const total = subtotal + shippingCost;
        document.getElementById('summary-subtotal').textContent = formatRupiah(subtotal);
        document.getElementById('summary-shipping').textContent = formatRupiah(shippingCost);
        document.getElementById('summary-total').textContent = formatRupiah(total);
    };

    // --- EVENT LISTENERS ---
    navLinks.forEach(link => link.addEventListener('click', () => showPage(link.dataset.page)));
    
    document.querySelector('main').addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            addToCart(parseInt(e.target.dataset.id));
        }
        if (e.target.classList.contains('buy-now-btn')) {
            buyNow(parseInt(e.target.dataset.id));
        }
    });

    searchInput.addEventListener('keyup', (e) => {
        currentFilters.searchTerm = e.target.value;
        if (!document.getElementById('shop-page').classList.contains('hidden')) renderProducts();
    });

    categoryFiltersContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            currentFilters.category = e.target.dataset.category;
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.style.backgroundColor = '#fff';
                btn.style.color = 'var(--text-color)';
            });
            e.target.style.backgroundColor = 'var(--primary-color)';
            e.target.style.color = '#fff';
            renderProducts();
        }
    });
    
    cartItemsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const item = cart.find(i => i.id === parseInt(e.target.dataset.id));
            if (item) item.quantity = parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 1;
            updateCartDisplay();
        }
    });
    
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            cart = cart.filter(item => item.id !== parseInt(e.target.dataset.id));
            updateCartDisplay();
        }
    });

    document.getElementById('checkout-btn').addEventListener('click', () => {
        updateOrderSummary();
        showPage('checkout-page');
    });
    
    shippingSelect.addEventListener('change', updateOrderSummary);

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + shippingCost;
        document.getElementById('payment-total').textContent = formatRupiah(total);
        showPage('payment-page');
    });

    document.querySelector('.payment-options').addEventListener('click', (e) => {
        const selectedOption = e.target.closest('.payment-option');
        if (!selectedOption) return;
        document.querySelectorAll('.payment-option').forEach(opt => opt.style.borderColor = 'var(--border-color)');
        selectedOption.style.borderColor = 'var(--primary-color)';
        document.getElementById('pay-now-btn').disabled = false;
    });

    document.getElementById('pay-now-btn').addEventListener('click', () => {
        document.getElementById('order-number').textContent = `EM-${Date.now()}`;
        showPage('confirmation-page');
    });
    
    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you! Your message has been sent.');
        e.target.reset();
    });

    // --- INITIALIZATION ---
    const initialize = () => {
        renderFeaturedProducts();
        renderCategories();
        renderProducts();
        updateCartDisplay();
        showPage('home-page');
    };

    initialize();
});