// --- CONSTANTS & STATE ---
const EXCHANGE_RATE_RIEL = 4100;
const TAX_RATE = 0.07;
const CASHIERS = ['Heng', 'Chanthorn', 'Nida']; 
const PAYMENT_METHODS = ['CASH', 'ABA', 'ACLEDA'];

let categories = [
    { category_id: 1, category_name: 'Cleansers' },
    { category_id: 2, category_name: 'Serums' },
    { category_id: 3, category_name: 'Moisturizers' },
    { category_id: 4, category_name: 'Sunscreens' }
];
let brands = [];
const skinConcerns = ['All Concerns', 'Acne', 'Hydration', 'Anti-Aging', 'Brightening', 'Sensitivity'];
let products = [];
let salesHistory = [];
let cart = [];
let activeCategory = 'All';
let numpadTarget = null;
let sessionStartTime = null; // To track cashier check-in time

// --- INITIALIZATION ---
window.onload = () => {
    initializeApp();
    updateTime();
    setInterval(updateTime, 1000);
};

async function initializeApp() {
    sessionStartTime = new Date(); // Set check-in time when the app loads
    try {
        const productsResponse = await fetch('http://localhost:3000/api/products');
        products = await productsResponse.json();
        
        const brandsResponse = await fetch('http://localhost:3000/api/brands');
        brands = await brandsResponse.json();
        
        showProductBrowser(); 
        renderSummary();
        renderTransactionHistory();
        showRightPanelTab('payment');
        setupPaymentMethodListener();

    } catch (error) {
        console.error("Failed to load initial data:", error);
        document.getElementById('panel-content-area').innerHTML = `<p class="text-red-500 p-4">Could not connect to the server.</p>`;
    }
}

function updateTime() {
    const timeEl = document.getElementById('current-time');
    if (timeEl) {
        timeEl.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
}

// --- UI RENDER FUNCTIONS ---
function renderCart() {
    const panelHeader = document.getElementById('left-panel-header');
    panelHeader.innerHTML = `<h2 id="left-panel-title" class="panel-title-text">YOUR SHOPPING BAG</h2>`;
    
    const cartContainer = document.getElementById('panel-content-area');
    activeCategory = 'All';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-gray-400 text-center p-8">Shopping bag is empty.</p>';
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image_url || 'https://placehold.co/50x50/ccc/999?text=N/A'}" alt="${item.name}" class="cart-item-img">
            <div class="font-medium">${item.name}</div>
            <div class="quantity-selector">
                <button onclick="updateCartQuantity(${item.product_id}, -1)">-</button>
                <input type="number" value="${item.quantity}" onchange="setCartQuantity(${item.product_id}, this.value)">
                <button onclick="updateCartQuantity(${item.product_id}, 1)">+</button>
            </div>
            <div class="font-bold text-lg text-right">$${(item.price * item.quantity).toFixed(2)}</div>
            <button onclick="removeFromCart(${item.product_id})" class="text-red-500 hover:text-red-700">🗑️</button>
        </div>
    `).join('');
}

function renderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = 0;
    const total = subtotal - discount;

    document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('summary-discount').textContent = `-$${discount.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
    
    const totalRiel = Math.round((total * EXCHANGE_RATE_RIEL) / 100) * 100;
    document.getElementById('cash-total-riel').textContent = `R ${totalRiel.toLocaleString()}`;
    calculateChange();
}

function renderBrandFilterDropdown() {
    const brandNames = ['All Brands', ...brands.map(b => b.brand_name)];
    document.getElementById('brand-filter-select').innerHTML = brandNames.map(name => `<option>${name}</option>`).join('');
}
function renderConcernFilterDropdown() {
    document.getElementById('concern-filter-select').innerHTML = skinConcerns.map(name => `<option>${name}</option>`).join('');
}

function showProductBrowser() {
    const panelHeader = document.getElementById('left-panel-header');
    panelHeader.innerHTML = `
        <h2 id="left-panel-title" class="panel-title-text">OUR PRODUCTS</h2>
        <div class="flex-grow mx-4">
            <input type="text" id="product-search-input" onkeyup="filterAndRenderProducts()" placeholder="Search products..." class="w-full p-2 border rounded-md text-sm">
        </div>
        <div class="filter-controls">
            <div>
                <label for="brand-filter-select" class="filter-label">Brand</label>
                <select id="brand-filter-select" onchange="filterAndRenderProducts()" class="filter-select"></select>
            </div>
            <div>
                <label for="concern-filter-select" class="filter-label">Skin Concern</label>
                <select id="concern-filter-select" onchange="filterAndRenderProducts()" class="filter-select"></select>
            </div>
        </div>
    `;

    document.getElementById('cash-summary-details').classList.add('hidden');
    
    const controlsContainer = document.getElementById('product-browser-controls');
    const categoryNames = ['All', ...categories.map(c => c.category_name)];

    controlsContainer.innerHTML = `
        <div class="flex justify-center w-full">
            <div id="category-filters" class="flex items-center gap-1 bg-gray-200 p-1 rounded-lg">
                ${categoryNames.map(name => `<button onclick="setCategoryFilter('${name}')" class="category-filter-btn px-3 py-1 rounded-md text-sm font-medium" data-category="${name}">${name}</button>`).join('')}
            </div>
        </div>
    `;
    
    renderBrandFilterDropdown();
    renderConcernFilterDropdown();
    setCategoryFilter(activeCategory);
}

function setCategoryFilter(categoryName) {
    activeCategory = categoryName;
    document.querySelectorAll('.category-filter-btn').forEach(btn => {
        btn.classList.toggle('active-filter', btn.dataset.category === categoryName);
    });
    filterAndRenderProducts();
}

function filterAndRenderProducts() {
    const productContainer = document.getElementById('panel-content-area');
    const searchTerm = document.getElementById('product-search-input')?.value.toLowerCase() || '';
    const selectedBrandName = document.getElementById('brand-filter-select').value;
    const selectedConcern = document.getElementById('concern-filter-select').value;

    let filteredProducts = products;

    if (activeCategory !== 'All') {
        const category = categories.find(c => c.category_name === activeCategory);
        if (category) filteredProducts = filteredProducts.filter(p => p.category_id === category.category_id);
    }
    
    if (selectedBrandName !== 'All Brands') {
        const brand = brands.find(b => b.brand_name === selectedBrandName);
        if (brand) filteredProducts = filteredProducts.filter(p => p.brand_id === brand.brand_id);
    }

    if (selectedConcern !== 'All Concerns') {
        filteredProducts = filteredProducts.filter(p => p.skin_concern && p.skin_concern.includes(selectedConcern));
    }

    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    if (filteredProducts.length === 0) {
        productContainer.innerHTML = `<p class="text-gray-500 text-center p-8">No products match your filters.</p>`;
        return;
    }
    // MODIFIED: Increased font size and weight for the product price
    productContainer.innerHTML = `<div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">${filteredProducts.map(p => `
        <div onclick="addToCart(${p.product_id})" class="p-2 border rounded-lg text-center cursor-pointer hover:bg-gray-100 hover:border-pink-500 transition-all">
            <img src="${p.image_url || 'https://placehold.co/100x100/ccc/999?text=N/A'}" alt="${p.name}" class="w-full h-20 object-cover rounded-md mb-2">
            <p class="font-semibold text-xs leading-tight h-8">${p.name}</p>
            <p class="text-sm font-medium text-gray-800 mt-1">$${p.price.toFixed(2)}</p>
        </div>`).join('')}</div>`;
}

function renderTransactionHistory() {
    const container = document.getElementById('history-content');
    if (salesHistory.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center p-4">No transactions yet.</p>`;
        return;
    }

    const header = `
        <div class="history-header">
            <span>Details</span>
            <span class="text-right">Total</span>
            <span class="text-right">Action</span>
        </div>
    `;

    const items = salesHistory.slice().reverse().map((sale, index) => {
        const originalIndex = salesHistory.length - 1 - index;
        return `
            <div class="history-item">
                <div>
                    <p class="font-semibold truncate">${sale.receiptId}</p>
                    <p class="text-xs text-gray-500">${sale.date}</p>
                </div>
                <p class="font-bold text-lg text-right">$${sale.totalUSD.toFixed(2)}</p>
                <button onclick="displayReceipt(salesHistory[${originalIndex}])" class="text-blue-500 hover:underline text-xs justify-self-end">View</button>
            </div>
        `;
    }).join('');

    container.innerHTML = header + items;
}

function showRightPanelTab(tabName) {
    document.querySelectorAll('.right-panel-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.right-panel-tab').forEach(el => el.classList.remove('active'));

    document.getElementById(`${tabName}-content`).classList.remove('hidden');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}


// --- CART ACTIONS ---
function addToCart(productId) {
    const product = products.find(p => p.product_id === productId);
    if (!product) return;
    const cartItem = cart.find(item => item.product_id === productId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    renderSummary();
}

function updateCartQuantity(productId, change) {
    const cartItem = cart.find(item => item.product_id === productId);
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) removeFromCart(productId);
    }
    renderCart();
    renderSummary();
}

function setCartQuantity(productId, newQuantity) {
    const cartItem = cart.find(item => item.product_id === productId);
    const quantity = parseInt(newQuantity);
    if (cartItem && quantity > 0) {
        cartItem.quantity = quantity;
    } else if (cartItem) {
        removeFromCart(productId);
    }
    renderCart();
    renderSummary();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.product_id !== productId);
    renderCart();
    renderSummary();
}

// --- PAYMENT & SALE LOGIC ---
function setupPaymentMethodListener() {
    const paymentMethodSelect = document.getElementById('payment-method');
    const cashDetailsPanel = document.getElementById('cash-details-panel');
    
    paymentMethodSelect.addEventListener('change', (e) => {
        if (e.target.value === 'CASH') {
            cashDetailsPanel.classList.remove('hidden');
            numpadTarget = document.getElementById('main-cash-received');
        } else {
            cashDetailsPanel.classList.add('hidden');
            numpadTarget = null;
        }
    });
    if (paymentMethodSelect.value === 'CASH') {
        cashDetailsPanel.classList.remove('hidden');
        numpadTarget = document.getElementById('main-cash-received');
    }
}

function handlePayment() {
    if (cart.length === 0) {
        showInfoModal('Cannot process payment for an empty cart.');
        return;
    }
    const paymentMethod = document.getElementById('payment-method').value;
    if (paymentMethod === 'CASH') {
        finalizeSale();
    } else {
        showQrCodeModal();
    }
}

function calculateChange() {
    const totalText = document.getElementById('summary-total').textContent;
    const totalUSD = parseFloat(totalText.replace('$', ''));
    const totalRiel = Math.round((totalUSD * EXCHANGE_RATE_RIEL) / 100) * 100;
    
    const cashReceived = parseFloat(document.getElementById('main-cash-received').value) || 0;
    const change = cashReceived - totalRiel;
    
    document.getElementById('main-change-due').textContent = `R ${change >= 0 ? change.toLocaleString() : '0'}`;
}

function showQrCodeModal() {
    const totalUSD = parseFloat(document.getElementById('summary-total').textContent.replace('$', ''));
    document.getElementById('qr-title').textContent = `Scan to Pay with ${document.getElementById('payment-method').value}`;
    document.getElementById('qr-total-usd').textContent = `$${totalUSD.toFixed(2)}`;
    const qrCodeImages = { 'ABA': 'aba.jpg', 'ACLEDA': 'acleda.jpg' };
    document.getElementById('qr-image').src = qrCodeImages[document.getElementById('payment-method').value];
    openModal('qrCodeModal');
}

function finalizeSale() {
    if (cart.length === 0) {
        showInfoModal('Cannot confirm an empty sale.');
        return;
    }
    const total = parseFloat(document.getElementById('summary-total').textContent.replace('$', ''));
    
    const receiptData = {
        receiptId: `RCPT-${Date.now()}`,
        date: new Date().toLocaleString(),
        cashier: document.getElementById('cashier-select').value,
        items: cart,
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        totalUSD: total,
        paymentMethod: document.getElementById('payment-method').value
    };

    if (receiptData.paymentMethod === 'CASH') {
        const cashReceived = parseFloat(document.getElementById('main-cash-received').value) || 0;
        const totalRiel = Math.round((receiptData.totalUSD * EXCHANGE_RATE_RIEL) / 100) * 100;
        receiptData.cashReceived = cashReceived;
        receiptData.changeDue = cashReceived - totalRiel;
        
        document.getElementById('summary-cash-received').textContent = `R ${cashReceived.toLocaleString()}`;
        document.getElementById('summary-change-due').textContent = `R ${receiptData.changeDue.toLocaleString()}`;
        document.getElementById('cash-summary-details').classList.remove('hidden');
    }

    salesHistory.push(receiptData);
    displayReceipt(receiptData);
    renderTransactionHistory();
    
    cart = [];
    document.getElementById('main-cash-received').value = '';
    showProductBrowser();
    renderSummary();
    
    numpadTarget = document.getElementById('main-cash-received');
    closeModal('qrCodeModal');
}

function displayReceipt(saleData) {
    const receiptContent = document.getElementById('receiptContent');
    let receiptHtml = `
        <div class="text-center mb-4"><h2 class="text-xl font-bold">Skincare Store</h2><p class="text-xs">#65, Tonle Sap Street, Chroy Chongva</p></div>
        <div class="text-xs text-gray-600 mb-2"><p>Receipt ID: ${saleData.receiptId}</p><p>Date: ${saleData.date}</p><p>Cashier: ${saleData.cashier}</p></div>
        <div class="border-t border-b border-dashed py-2 my-2"><div class="flex font-bold text-xs"><span class="w-8">QTY</span><span class="flex-grow">ITEM</span><span class="w-16 text-right">PRICE</span></div>`;

    saleData.items.forEach(item => {
        receiptHtml += `<div class="flex text-sm my-1"><span class="w-8">${item.quantity}x</span><span class="flex-grow truncate pr-2">${item.name}</span><span class="w-16 text-right">$${(item.price * item.quantity).toFixed(2)}</span></div>`;
    });

    receiptHtml += `</div><div class="mt-4 space-y-1 text-sm">
        <div class="flex justify-between"><span>Subtotal:</span><span>$${saleData.subtotal.toFixed(2)}</span></div>
        <div class="flex justify-between font-bold text-base border-t border-dashed mt-2 pt-2"><span>Total (USD):</span><span>$${saleData.totalUSD.toFixed(2)}</span></div>
        <div class="flex justify-between font-bold text-base"><span>Total (Riel):</span><span>R ${(Math.round((saleData.totalUSD * EXCHANGE_RATE_RIEL) / 100) * 100).toLocaleString()}</span></div></div>`;

    if (saleData.paymentMethod === 'CASH') {
        receiptHtml += `<div class="border-t border-dashed mt-2 pt-2 text-sm">
            <div class="flex justify-between"><span>Cash Received:</span><span>R ${saleData.cashReceived.toLocaleString()}</span></div>
            <div class="flex justify-between"><span>Change Due:</span><span>R ${saleData.changeDue.toLocaleString()}</span></div></div>`;
    }
    
    receiptHtml += `<div class="text-center text-xs text-gray-500 mt-6"><p>Thank you! Please come again.</p></div>`;
    receiptContent.innerHTML = receiptHtml;
    openModal('receiptModal');
}

// --- REPORT, VOID, RETURN & LOGOUT FUNCTIONS ---

// NEW: Shows end-of-session report with check-in/out times
function showEndSessionReport() {
    const cashier = document.getElementById('cashier-select').value;
    
    // Filter sales for the current cashier within the current session
    const sessionSales = salesHistory.filter(sale => {
        const saleDate = new Date(sale.date);
        return sale.cashier === cashier && saleDate >= sessionStartTime;
    });

    const totalSalesValue = sessionSales.reduce((sum, sale) => sum + sale.totalUSD, 0);
    const totalItemsSold = sessionSales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    const checkoutTime = new Date();

    document.getElementById('session-report-cashier-name').textContent = cashier;
    document.getElementById('session-report-check-in').textContent = sessionStartTime.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
    document.getElementById('session-report-check-out').textContent = checkoutTime.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
    document.getElementById('session-report-transaction-count').textContent = sessionSales.length;
    document.getElementById('session-report-items-sold').textContent = totalItemsSold;
    document.getElementById('session-report-total-sales').textContent = `$${totalSalesValue.toFixed(2)}`;

    openModal('sessionReportModal');
}

// NEW: Called after cashier confirms the session report
function confirmEndSession() {
    closeModal('sessionReportModal');
    logOut();
}


function showTransactionModal(type) {
    document.getElementById('transaction-modal-title').textContent = `${type} Transaction`;
    document.getElementById('transaction-id-input').value = '';
    document.getElementById('confirm-transaction-btn').setAttribute('onclick', `processTransactionAction('${type}')`);
    openModal('transactionModal');
}

function processTransactionAction(type) {
    const receiptId = document.getElementById('transaction-id-input').value;
    if (!receiptId) {
        showInfoModal('Please enter a Receipt ID.');
        return;
    }

    const saleIndex = salesHistory.findIndex(sale => sale.receiptId === receiptId);
    if (saleIndex === -1) {
        showInfoModal(`Receipt ID "${receiptId}" not found.`);
        return;
    }

    salesHistory.splice(saleIndex, 1);
    renderTransactionHistory();

    closeModal('transactionModal');
    showInfoModal(`Receipt ${receiptId} has been successfully ${type.toLowerCase()}ed.`);
}

// MODIFIED: This now resets the application for the next cashier's session
function logOut() {
    showInfoModal('Session ended successfully. A new session has begun.');
    cart = [];
    document.getElementById('cashier-select').selectedIndex = 0;
    showProductBrowser();
    renderSummary();
    
    // Reset the session start time for the next cashier
    sessionStartTime = new Date();
}


// --- NUMPAD & MODAL LOGIC ---
function numpadInput(value) {
    if (numpadTarget) {
        if (value === '.' && numpadTarget.value.includes('.')) return;
        numpadTarget.value += value;
        numpadTarget.dispatchEvent(new Event('input'));
    } else {
        showInfoModal(`Numpad pressed: ${value}. No active input.`);
    }
}

function numpadClear() {
    if (numpadTarget) {
        numpadTarget.value = '';
        numpadTarget.dispatchEvent(new Event('input'));
    } else {
        showInfoModal('Numpad Cleared. No active input.');
    }
}

function showInfoModal(text) {
    document.getElementById('infoModalText').textContent = text;
    openModal('infoModal');
}
function openModal(modalId) { document.getElementById(modalId)?.classList.remove('hidden'); }
function closeModal(modalId) {
    if (modalId === 'cashModal') {
        numpadTarget = null;
    }
    document.getElementById(modalId)?.classList.add('hidden');
}