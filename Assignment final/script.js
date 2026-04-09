// ============================================
// CINEMATIC VISION - MASTER JAVASCRIPT
// Bao gồm tất cả chức năng cho mọi trang
// ============================================

// ========== 1. PRELOADER ==========
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hide');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1500);
    }
});

// ========== 2. HEADER SCROLL EFFECT ==========
const header = document.querySelector('.cv-header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ========== 3. USER DROPDOWN ==========
function initUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    const trigger = document.getElementById('userTrigger');
    if (!dropdown || !trigger) return;
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
        if (dropdown && !dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dropdown) {
            dropdown.classList.remove('active');
        }
    });
}

function updateDropdownUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    let currentUser = null;
    try {
        const userData = localStorage.getItem('currentUser');
        if (userData) currentUser = JSON.parse(userData);
    } catch(e) {}
    const loginText = document.querySelector('.cv-login-text');
    const avatar = document.querySelector('.cv-avatar');
    const userName = document.querySelector('.user-name');
    const userEmail = document.querySelector('.user-email');
    const logoutBtn = document.getElementById('logoutBtn');
    if (isLoggedIn === 'true' && currentUser) {
        if (loginText) loginText.innerText = (currentUser.username || 'USER').toUpperCase();
        if (avatar) {
            avatar.style.background = '#c41e3a';
            avatar.innerHTML = '<i class="fas fa-user"></i>';
        }
        if (userName) userName.textContent = currentUser.fullname || currentUser.username;
        if (userEmail) userEmail.textContent = currentUser.email || 'user@cinematic.com';
        if (logoutBtn) {
            logoutBtn.style.display = 'flex';
            const newLogoutBtn = logoutBtn.cloneNode(true);
            logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
            newLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if(confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('currentUser');
                    window.location.reload();
                }
            });
        }
    } else {
        if (loginText) loginText.innerText = 'Login';
        if (avatar) {
            avatar.style.background = '#333';
            avatar.innerHTML = '<i class="fas fa-user"></i>';
        }
        if (userName) userName.textContent = 'Guest User';
        if (userEmail) userEmail.textContent = 'Please login';
        if (logoutBtn) logoutBtn.style.display = 'none';
        const dropdownItems = document.querySelectorAll('.dropdown-item:not(#logoutBtn)');
        dropdownItems.forEach(item => {
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            newItem.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Please login to use this feature!');
                window.location.href = 'login.html';
            });
        });
    }
}

// ========== 4. CART & PENDING BADGE ==========
function updateCartBadge() {
    const pending = JSON.parse(localStorage.getItem('pendingOrders')) || [];
    const count = pending.reduce((total, item) => total + item.qty, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
    const pendingBadge = document.getElementById('pendingBadge');
    if (pendingBadge) {
        pendingBadge.textContent = count;
        pendingBadge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

// ========== 5. ADD TO PENDING ORDERS (My Orders) ==========
window.addToPendingOrders = function(product) {
    let pending = JSON.parse(localStorage.getItem('pendingOrders')) || [];
    const existingIndex = pending.findIndex(item => item.id === product.id);
    if (existingIndex !== -1) {
        pending[existingIndex].qty += product.qty;
    } else {
        pending.push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            qty: product.qty
        });
    }
    localStorage.setItem('pendingOrders', JSON.stringify(pending));
    updateCartBadge();
    showNotification(`Added ${product.name} to orders`);
};

window.addToCart = function(id, name, price, img) {
    addToPendingOrders({ id, name, price, img, qty: 1 });
};

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ========== 6. SLIDER (Trang chủ) ==========
function initSlider() {
    const track = document.querySelector('.cv-hero-track');
    const slides = Array.from(document.querySelectorAll('.cv-hero-slide'));
    const prevBtn = document.getElementById('cvPrevBtn');
    const nextBtn = document.getElementById('cvNextBtn');
    const slider = document.getElementById('cvHeroSlider');
    if (!track || !slider || !prevBtn || !nextBtn) return;
    let currentIndex = 0;
    const slideCount = slides.length;
    const intervalTime = 5000;
    let autoPlayId = null;
    function goToSlide(index) {
        currentIndex = (index + slideCount) % slideCount;
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
    }
    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayId = setInterval(nextSlide, intervalTime);
    }
    function stopAutoPlay() {
        if (autoPlayId) {
            clearInterval(autoPlayId);
            autoPlayId = null;
        }
    }
    nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
    prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    goToSlide(0);
    startAutoPlay();
}

// ========== 7. TAB FILTER (Trang chủ) ==========
function initTabFilter() {
    const tabs = document.querySelectorAll('.brand-tabs .tab-btn');
    tabs.forEach(btn => {
        btn.addEventListener('click', function() {
            const activeTab = document.querySelector('.brand-tabs .tab-btn.active');
            if (activeTab) activeTab.classList.remove('active');
            this.classList.add('active');
            const brand = this.getAttribute('data-brand');
            const items = document.querySelectorAll('.product-item');
            items.forEach(item => {
                if (brand === 'all' || item.classList.contains(brand)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ========== 8. STATS COUNTER ==========
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = { threshold: 0.5, rootMargin: '0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        el.textContent = target.toLocaleString();
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(current).toLocaleString();
                    }
                }, 30);
                observer.unobserve(el);
            }
        });
    }, observerOptions);
    statNumbers.forEach(el => observer.observe(el));
}

// ========== 9. PARTICLES EFFECT ==========
function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.borderRadius = '50%';
        particle.style.animation = `float ${5 + Math.random() * 10}s linear infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(particle);
    }
}

// ========== 10. QUICK VIEW MODAL ==========
window.quickView = (productId) => {
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;
    const modalBody = modal.querySelector('.modal-body');
    const products = {
        1: { name: 'Canon EOS R5 Mirrorless', price: '85,000,000₫', img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop' },
        2: { name: 'Fujifilm X-T5 Silver', price: '42,000,000₫', img: 'https://images.unsplash.com/photo-1581595219315-bbbb6d5b9dab?w=600&h=400&fit=crop' },
        3: { name: 'Sony Alpha A7 IV', price: '58,000,000₫', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop' }
    };
    const product = products[productId];
    if (product) {
        modalBody.innerHTML = `
            <div style="display: flex; gap: 30px; flex-wrap: wrap;">
                <img src="${product.img}" style="width: 50%; object-fit: cover;">
                <div style="flex: 1;">
                    <h2 style="margin-bottom: 20px;">${product.name}</h2>
                    <p style="font-size: 28px; color: var(--accent); margin-bottom: 20px;">${product.price}</p>
                    <p style="color: var(--text-secondary); margin-bottom: 30px;">Experience cinematic excellence with this professional-grade camera.</p>
                    <button class="add-to-cart-btn" onclick="addToCart(${productId}, '${product.name}', ${parseInt(product.price.replace(/[^\d]/g, ''))}, '${product.img}')">Add to Cart</button>
                </div>
            </div>
        `;
        modal.style.display = 'flex';
    }
};
const modal = document.getElementById('quickViewModal');
if (modal) {
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.onclick = () => { modal.style.display = 'none'; };
    }
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// ========== 11. SHOP PAGE - FILTER & SORT ==========
function initShopFilters() {
    const productGrid = document.getElementById('cvProductGrid');
    if (!productGrid) return;
    const cards = Array.from(document.querySelectorAll('.cv-product-card'));
    const categoryButtons = Array.from(document.querySelectorAll('.cv-category-list button'));
    const priceButtons = Array.from(document.querySelectorAll('.cv-filter-group button'));
    const sortSelect = document.getElementById('cvSortSelect');
    let currentCategory = 'all';
    let currentPrice = 'all';
    function parsePrice(text) {
        return Number(text.replace(/[^\d]/g, '')) || 0;
    }
    function applyFilterAndSort() {
        cards.forEach((card) => {
            const cat = card.dataset.category;
            const priceRange = card.dataset.price;
            let show = true;
            if (currentCategory !== 'all' && cat !== currentCategory) show = false;
            if (currentPrice !== 'all' && priceRange !== currentPrice) show = false;
            card.style.display = show ? '' : 'none';
        });
        let visibleCards = cards.filter(card => card.style.display !== 'none');
        const value = sortSelect?.value || 'featured';
        visibleCards.sort((a, b) => {
            const nameA = a.dataset.name?.toLowerCase() || '';
            const nameB = b.dataset.name?.toLowerCase() || '';
            const priceA = parsePrice(a.querySelector('.cv-product-price')?.textContent || '0');
            const priceB = parsePrice(b.querySelector('.cv-product-price')?.textContent || '0');
            switch (value) {
                case 'price-asc': return priceA - priceB;
                case 'price-desc': return priceB - priceA;
                case 'name-asc': return nameA.localeCompare(nameB);
                case 'name-desc': return nameB.localeCompare(nameA);
                default: return 0;
            }
        });
        visibleCards.forEach(card => productGrid.appendChild(card));
    }
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            currentCategory = btn.dataset.filter || 'all';
            applyFilterAndSort();
        });
    });
    priceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            priceButtons.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            currentPrice = btn.dataset.price || 'all';
            applyFilterAndSort();
        });
    });
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilterAndSort);
    }
    applyFilterAndSort();
}

// ========== 12. SHOP PAGE - ADD TO CART BUTTONS ==========
function initShopAddToCart() {
    const buttons = document.querySelectorAll('.add-to-cart');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const product = {
                id: parseInt(button.dataset.id),
                name: button.dataset.name,
                price: parseInt(button.dataset.price),
                img: button.dataset.img,
                qty: 1
            };
            addToPendingOrders(product);
            button.innerHTML = '<i class="fas fa-check"></i> <span>Added</span>';
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-shopping-bag"></i> <span>Add to Cart</span>';
            }, 1500);
        });
    });
}

// ========== 13. MY ORDERS PAGE ==========
function renderMyOrders() {
    const container = document.getElementById('orderListContainer');
    const checkoutSection = document.getElementById('checkoutSection');
    if (!container) return;
    const pending = JSON.parse(localStorage.getItem('pendingOrders')) || [];
    if (pending.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fas fa-inbox"></i></div>
                <h3>NO ORDERS YET</h3>
                <p>Add products from the Shop page</p>
                <a href="shop.html" class="shop-now-btn"><i class="fas fa-shopping-cart"></i> SHOP NOW</a>
            </div>
        `;
        if (checkoutSection) checkoutSection.style.display = 'none';
        return;
    }
    if (checkoutSection) checkoutSection.style.display = 'block';
    let totalAmount = 0;
    container.innerHTML = pending.map(item => {
        const subtotal = item.price * item.qty;
        totalAmount += subtotal;
        return `
            <div class="order-item" data-id="${item.id}">
                <img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80x60?text=No+Image'">
                <div class="order-info">
                    <h3>${item.name}</h3>
                    <div class="order-meta">Quantity: ${item.qty} | Price: ${item.price.toLocaleString()}₫</div>
                </div>
                <div class="order-price">${subtotal.toLocaleString()}₫</div>
                <button class="remove-btn" onclick="removeFromPendingOrders(${item.id})"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
    }).join('');
    const totalDiv = document.createElement('div');
    totalDiv.className = 'total-summary';
    totalDiv.innerHTML = `<strong>Total:</strong> <span>${totalAmount.toLocaleString()}₫</span>`;
    container.appendChild(totalDiv);
}
window.removeFromPendingOrders = function(productId) {
    let pending = JSON.parse(localStorage.getItem('pendingOrders')) || [];
    pending = pending.filter(item => item.id !== productId);
    localStorage.setItem('pendingOrders', JSON.stringify(pending));
    renderMyOrders();
    updateCartBadge();
    showNotification('Product removed');
};
function proceedToCheckout() {
    const pending = JSON.parse(localStorage.getItem('pendingOrders')) || [];
    if (pending.length === 0) {
        alert('No items to checkout');
        return;
    }
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        alert('Please login to checkout');
        window.location.href = 'login.html';
        return;
    }
    localStorage.setItem('cart', JSON.stringify(pending));
    localStorage.removeItem('pendingOrders');
    alert('Redirecting to checkout...');
    window.location.href = 'cart.html';
}

// ========== 14. CART PAGE ==========
function renderCart() {
    const container = document.getElementById('cartContent');
    if (!container) return;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon"><i class="fas fa-shopping-cart"></i></div>
                <h3>YOUR CART IS EMPTY</h3>
                <p>Add some products to your cart</p>
                <a href="shop.html" class="shop-link"><i class="fas fa-arrow-left"></i> CONTINUE SHOPPING</a>
            </div>
        `;
        return;
    }
    let subtotal = 0;
    container.innerHTML = `
        <div class="cart-layout">
            <div class="cart-items">
                <div class="cart-header">
                    <span>Product</span>
                    <span>Info</span>
                    <span>Price</span>
                    <span>Quantity</span>
                    <span></span>
                </div>
                ${cart.map(item => {
                    const itemTotal = item.price * item.qty;
                    subtotal += itemTotal;
                    return `
                        <div class="cart-item" data-id="${item.id}">
                            <img src="${item.img}" alt="${item.name}">
                            <div class="item-info">
                                <h4>${item.name}</h4>
                                <p>Code: CV${item.id.toString().padStart(4, '0')}</p>
                            </div>
                            <div class="item-price">${item.price.toLocaleString()}₫</div>
                            <div class="item-quantity">
                                <button class="qty-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                                <span>${item.qty}</span>
                                <button class="qty-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                            </div>
                            <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="cart-summary">
                <h3 class="summary-title">ORDER SUMMARY</h3>
                <div class="summary-row"><span>Subtotal:</span><span>${subtotal.toLocaleString()}₫</span></div>
                <div class="summary-row"><span>Shipping:</span><span>Free</span></div>
                <div class="summary-row total"><span>Total:</span><span class="amount">${subtotal.toLocaleString()}₫</span></div>
                <div class="checkout-action">
                    <button class="confirm-btn" onclick="processCheckout()"><i class="fas fa-lock"></i> PROCEED TO CHECKOUT</button>
                </div>
            </div>
        </div>
    `;
}
window.updateCartQuantity = function(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(i => i.id === productId);
    if (itemIndex !== -1) {
        const newQty = cart[itemIndex].qty + change;
        if (newQty <= 0) {
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].qty = newQty;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartBadge();
    }
};
window.removeFromCart = function(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartBadge();
    showNotification('Product removed from cart');
};
function processCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        alert('Please login to checkout');
        window.location.href = 'login.html';
        return;
    }
    let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const newOrder = {
        orderId: 'CV' + Date.now(),
        date: new Date().toLocaleString(),
        status: 'pending',
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            img: item.img
        })),
        total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
        paymentMethod: 'COD'
    };
    orderHistory.unshift(newOrder);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    localStorage.removeItem('cart');
    localStorage.removeItem('pendingOrders');
    alert('Order placed successfully!');
    window.location.href = 'order-history.html';
}

// ========== 15. ORDER HISTORY PAGE ==========
function initSampleOrderHistory() {
    let history = JSON.parse(localStorage.getItem('orderHistory'));
    if (!history || history.length === 0) {
        const sampleOrders = [
            {
                orderId: 'CV202401001',
                date: '2024-01-15 14:30:00',
                status: 'delivered',
                items: [{ id: 1, name: 'Canon EOS R5 Mirrorless', price: 85000000, qty: 1, img: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=100&h=80&fit=crop' }],
                total: 85000000,
                paymentMethod: 'COD'
            },
            {
                orderId: 'CV202402002',
                date: '2024-02-20 10:15:00',
                status: 'shipping',
                items: [
                    { id: 3, name: 'Sony Alpha A7 IV', price: 58000000, qty: 1, img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=80&fit=crop' },
                    { id: 4, name: 'Shotgun Mic V1', price: 4200000, qty: 1, img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=100&h=80&fit=crop' }
                ],
                total: 62200000,
                paymentMethod: 'Bank Transfer'
            }
        ];
        localStorage.setItem('orderHistory', JSON.stringify(sampleOrders));
    }
}
function renderOrderHistory(filter = 'all') {
    const container = document.getElementById('ordersContainer');
    if (!container) return;
    const orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    let filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);
    if (filteredOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fas fa-receipt"></i></div>
                <h3>NO ORDERS YET</h3>
                <p>You haven't placed any orders yet</p>
                <a href="shop.html" class="shop-link"><i class="fas fa-shopping-cart"></i> SHOP NOW</a>
            </div>
        `;
        return;
    }
    function getStatusClass(status) {
        switch(status) {
            case 'delivered': return 'status-delivered';
            case 'shipping': return 'status-shipping';
            case 'pending': return 'status-pending';
            default: return 'status-pending';
        }
    }
    function getStatusText(status) {
        switch(status) {
            case 'delivered': return 'Delivered';
            case 'shipping': return 'Shipping';
            case 'pending': return 'Pending';
            default: return status;
        }
    }
    container.innerHTML = filteredOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-info">
                    <div class="order-info-item">
                        <span class="label">ORDER ID</span>
                        <span class="value">${order.orderId}</span>
                    </div>
                    <div class="order-info-item">
                        <span class="label">DATE</span>
                        <span class="value">${new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div class="order-info-item">
                        <span class="label">PAYMENT</span>
                        <span class="value">${order.paymentMethod || 'COD'}</span>
                    </div>
                </div>
                <div class="order-total">
                    <div class="label">TOTAL</div>
                    <div class="value">${order.total.toLocaleString()}₫</div>
                </div>
            </div>
            <div class="order-body">
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item-history">
                            <img src="${item.img}" alt="${item.name}">
                            <div class="item-details">
                                <h4>${item.name}</h4>
                                <p>Quantity: ${item.qty} | Price: ${item.price.toLocaleString()}₫</p>
                            </div>
                            <div class="item-price">${(item.price * item.qty).toLocaleString()}₫</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="order-footer">
                <div class="order-status ${getStatusClass(order.status)}">${getStatusText(order.status)}</div>
                <button class="btn-reorder" onclick="reorder('${order.orderId}')"><i class="fas fa-redo-alt"></i> REORDER</button>
            </div>
        </div>
    `).join('');
}
window.reorder = function(orderId) {
    const orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
        let pending = JSON.parse(localStorage.getItem('pendingOrders')) || [];
        order.items.forEach(item => {
            const existing = pending.find(p => p.id === item.id);
            if (existing) {
                existing.qty += item.qty;
            } else {
                pending.push({ id: item.id, name: item.name, price: item.price, img: item.img, qty: item.qty });
            }
        });
        localStorage.setItem('pendingOrders', JSON.stringify(pending));
        alert('Products added to orders!');
        window.location.href = 'my-orders.html';
    }
};

// ========== 16. LOGIN PAGE FUNCTIONS ==========
const USERS_KEY = 'cinematic_users';
function initUserDatabase() {
    let users = JSON.parse(localStorage.getItem(USERS_KEY));
    if (!users || users.length === 0) {
        const sampleUsers = [
            { id: 1, username: "demo", password: "demo123", email: "demo@cinematic.com", fullname: "Demo User", phone: "0987654321", avatar: "https://ui-avatars.com/api/?background=c41e3a&color=fff&name=Demo", createdAt: new Date().toISOString(), orders: [], wishlist: [] },
            { id: 2, username: "cinematic", password: "cinematic123", email: "admin@cinematic.com", fullname: "Cinematic Admin", phone: "0123456789", avatar: "https://ui-avatars.com/api/?background=c41e3a&color=fff&name=Admin", createdAt: new Date().toISOString(), orders: [], wishlist: [] }
        ];
        localStorage.setItem(USERS_KEY, JSON.stringify(sampleUsers));
    }
}
function getUsers() { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
function findUserByUsername(username) {
    const users = getUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
}
function findUserByEmail(email) {
    const users = getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}
function generateNewId() {
    const users = getUsers();
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
}
function showMessage(message, type = 'error') {
    const msgBox = document.getElementById('messageBox');
    if (!msgBox) return;
    msgBox.textContent = message;
    msgBox.className = `message ${type}`;
    setTimeout(() => { msgBox.className = 'message'; }, 3000);
}
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
window.handleRegister = function() {
    const fullname = document.getElementById('regFullname').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    if (!fullname || !username || !email || !password) {
        showMessage('Please fill in all required fields!', 'error');
        return;
    }
    if (!isValidEmail(email)) { showMessage('Invalid email address!', 'error'); return; }
    if (password.length < 6) { showMessage('Password must be at least 6 characters!', 'error'); return; }
    if (password !== confirmPassword) { showMessage('Passwords do not match!', 'error'); return; }
    if (findUserByUsername(username)) { showMessage('Username already exists!', 'error'); return; }
    if (findUserByEmail(email)) { showMessage('Email already registered!', 'error'); return; }
    const newUser = {
        id: generateNewId(),
        username: username,
        password: password,
        email: email,
        fullname: fullname,
        phone: phone || '',
        avatar: `https://ui-avatars.com/api/?background=c41e3a&color=fff&name=${encodeURIComponent(fullname)}`,
        createdAt: new Date().toISOString(),
        orders: [],
        wishlist: []
    };
    const users = getUsers();
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    showMessage('Registration successful! Please login.', 'success');
    setTimeout(() => {
        document.querySelector('.auth-tabs .tab-btn[data-tab="login"]').click();
        document.getElementById('loginUsername').value = username;
    }, 1500);
};
window.handleLogin = function() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    if (!username || !password) { showMessage('Please enter username and password!', 'error'); return; }
    let user = findUserByUsername(username);
    if (!user) user = findUserByEmail(username);
    if (!user) { showMessage('Account does not exist!', 'error'); return; }
    if (user.password !== password) { showMessage('Incorrect password!', 'error'); return; }
    const loginData = { id: user.id, username: user.username, fullname: user.fullname, email: user.email, phone: user.phone, avatar: user.avatar };
    if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(loginData));
    } else {
        sessionStorage.setItem('currentUser', JSON.stringify(loginData));
    }
    localStorage.setItem('isLoggedIn', 'true');
    showMessage(`Welcome back ${user.fullname}!`, 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
};
window.forgotPassword = function() {
    const email = prompt('Please enter your registered email:');
    if (!email) return;
    const user = findUserByEmail(email);
    if (user) {
        alert(`Your password is: ${user.password}\nPlease login and change your password later.`);
    } else {
        alert('Email not found in the system!');
    }
};
window.socialLogin = function(provider) {
    let socialUser = findUserByEmail(`${provider}@social.com`);
    if (!socialUser) {
        socialUser = {
            id: generateNewId(),
            username: `${provider}_${Date.now()}`,
            password: Math.random().toString(36),
            email: `${provider}@social.com`,
            fullname: `${provider.toUpperCase()} User`,
            phone: '',
            avatar: `https://ui-avatars.com/api/?background=c41e3a&color=fff&name=${provider}`,
            createdAt: new Date().toISOString(),
            orders: [],
            wishlist: []
        };
        const users = getUsers();
        users.push(socialUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    const loginData = { id: socialUser.id, username: socialUser.username, fullname: socialUser.fullname, email: socialUser.email, phone: socialUser.phone, avatar: socialUser.avatar };
    localStorage.setItem('currentUser', JSON.stringify(loginData));
    localStorage.setItem('isLoggedIn', 'true');
    showMessage(`Login with ${provider} successful!`, 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
};

// ========== 17. PROFILE PAGE ==========
function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const user = users.find(u => u.id === currentUser.id);
    if (user) {
        if (document.getElementById('fullname')) document.getElementById('fullname').value = user.fullname || '';
        if (document.getElementById('username')) document.getElementById('username').value = user.username || '';
        if (document.getElementById('email')) document.getElementById('email').value = user.email || '';
        if (document.getElementById('phone')) document.getElementById('phone').value = user.phone || '';
        if (document.getElementById('profileName')) document.getElementById('profileName').textContent = user.fullname || user.username;
    }
}
function saveProfile(e) {
    if (e) e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].fullname = document.getElementById('fullname').value;
        users[userIndex].email = document.getElementById('email').value;
        users[userIndex].phone = document.getElementById('phone').value;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        const updatedUser = { id: users[userIndex].id, username: users[userIndex].username, fullname: users[userIndex].fullname, email: users[userIndex].email, avatar: users[userIndex].avatar };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        alert('Profile updated successfully!');
        loadUserProfile();
        updateDropdownUI();
    }
}

// ========== 18. INITIALIZE ALL ==========
document.addEventListener('DOMContentLoaded', () => {
    // Common
    initUserDropdown();
    updateDropdownUI();
    updateCartBadge();
    // Homepage specific
    if (document.querySelector('.cv-hero-slider')) initSlider();
    if (document.querySelector('.brand-tabs')) initTabFilter();
    if (document.querySelector('.stat-number')) initStatsCounter();
    if (document.getElementById('heroParticles')) initParticles();
    // Shop page specific
    if (document.getElementById('cvProductGrid')) {
        initShopFilters();
        initShopAddToCart();
    }
    // My Orders page specific
    if (document.getElementById('orderListContainer')) {
        renderMyOrders();
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) checkoutBtn.addEventListener('click', proceedToCheckout);
    }
    // Cart page specific
    if (document.getElementById('cartContent')) {
        renderCart();
    }
    // Order History page specific
    if (document.getElementById('ordersContainer')) {
        initSampleOrderHistory();
        renderOrderHistory();
        const historyTabs = document.querySelectorAll('.history-tabs .tab-btn');
        historyTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                historyTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderOrderHistory(tab.dataset.filter);
            });
        });
    }
    // Login page specific
    if (document.querySelector('.login-card')) {
        initUserDatabase();
        const tabs = document.querySelectorAll('.auth-tabs .tab-btn');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                if (tab.dataset.tab === 'login') {
                    loginForm.classList.add('active');
                    registerForm.classList.remove('active');
                } else {
                    loginForm.classList.remove('active');
                    registerForm.classList.add('active');
                }
            });
        });
        const toggleBtns = document.querySelectorAll('.toggle-password');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const input = document.getElementById(btn.dataset.target);
                const icon = btn.querySelector('i');
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }
    // Profile page specific
    if (document.getElementById('profileForm')) {
        loadUserProfile();
        document.getElementById('profileForm').addEventListener('submit', saveProfile);
    }
    // Active nav link
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
    // Add particle animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});