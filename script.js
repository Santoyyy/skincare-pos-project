// --- CONSTANTS & STATE ---
const EXCHANGE_RATE_RIEL = 4100;
const TAX_RATE = 0.07;
const CASHIERS = ['Heng', 'Chanthorn', 'Nida'];
const PAYMENT_METHODS = ['CASH', 'ABA', 'ACLEDA'];

let categories = [];
let brands = [];
const skinConcerns = ['All Concerns', 'Acne', 'Hydration', 'Anti-Aging', 'Brightening', 'Sensitivity'];
let products = [];
let salesHistory = [];
let sessionTransactions = [];
let cart = [];
let activeCategory = 'All';
let numpadTarget = null;
let sessionStartTime = null;

// --- PRODUCT DATA ---
const productDescriptions = {
    'The Ordinary Niacinamide 10% + Zinc 1%': 'A high-strength vitamin and mineral blemish formula that visibly regulates sebum and minimizes pores.',
    'The Ordinary Hyaluronic Acid 2% + B5': 'A hydrating formula with ultra-pure, vegan hyaluronic acid to attract up to 1,000 times its weight in water.',
    'The Ordinary Glycolic Acid 7% Toning Solution': 'An exfoliating toning solution with 7% glycolic acid, amino acids, aloe vera, ginseng, and tasmanian pepperberry.',
    'The Ordinary Salicylic Acid 2% Masque': 'A two-percent salicylic acid treatment masque with kaolin and charcoal clays to smooth and clarify the skin.',
    'The Ordinary "Buffet" + Copper Peptides 1%': 'A peptide-rich serum targeting multiple signs of aging at once, including fine lines, wrinkles, and textural irregularities.',
    'The Ordinary Retinol 0.5% in Squalane': 'A water-free solution containing 0.5% pure Retinol, an ingredient that can reduce the appearances of fine lines and photo damage.',
    'The Ordinary Natural Moisturizing Factors + HA': 'A non-greasy hydrator that offers immediate and long-lasting hydration with amino acids, dermal lipids, and hyaluronic acid.',
    'The Ordinary Vitamin C Suspension 23% + HA Spheres 2%': 'A water-free, stable suspension of 23% pure L-Ascorbic Acid to visibly brighten and improve uneven skin tone.',
    'The Ordinary 100% Plant-Derived Squalane': 'A lightweight, plant-derived solution to support healthy hydration and prevent the ongoing loss of hydration.',
    'The Ordinary Caffeine Solution 5% + EGCG': 'A light-textured formula containing a 5% concentration of caffeine, supplemented with EGCG to reduce puffiness and dark circles.',
    'CeraVe Hydrating Cleanser': 'A gentle, non-foaming cleanser that removes dirt and oil while increasing skin hydration after just one use.',
    'CeraVe Foaming Facial Cleanser': 'A gentle, foaming cleanser for normal-to-oily skin that removes excess oil without disrupting the skin’s protective barrier.',
    'CeraVe AM Facial Moisturizing Lotion SPF 30': 'A morning skincare multitasker, featuring 3 essential ceramides, hydrating hyaluronic acid and soothing Niacinamide, plus SPF 30.',
    'CeraVe PM Facial Moisturizing Lotion': 'An oil-free night cream with hyaluronic acid and niacinamide to help calm the skin and restore the skin barrier overnight.',
    'CeraVe Skin Renewing Vitamin C Serum': 'Features 10% pure vitamin C for antioxidant benefits, helping to visibly brighten your complexion and promote a more even skin tone.',
    'CeraVe Resurfacing Retinol Serum': 'Formulated with encapsulated retinol to help resurface your skin and reduce the appearance of post-acne marks.',
    'CeraVe Moisturizing Cream': 'A rich, non-greasy, fast-absorbing moisturizing cream for normal to dry skin on the face and body.',
    'CeraVe Hydrating Sunscreen SPF 50': 'A 100% mineral sunscreen with titanium dioxide and zinc oxide that forms a protective barrier on your skin to reflect UVA & UVB rays.',
    'CeraVe SA Cleanser for Rough & Bumpy Skin': 'Effectively cleanses to remove dirt and oil while softening and smoothing skin with salicylic acid. For rough & bumpy skin.',
    'CeraVe Eye Repair Cream': 'A non-greasy, fast-absorbing, and fragrance-free eye cream to reduce the appearance of dark circles and eye puffiness.',
    'La Roche-Posay Toleriane Moisturizer': 'A daily facial moisturizer with broad spectrum SPF 30, providing all-day hydration and helping to restore the skin barrier.',
    'La Roche-Posay Anthelios Melt-in Milk Sunscreen SPF 60': 'A fast-absorbing, non-greasy sunscreen for face and body with a velvety finish. Suitable for sensitive skin.',
    'La Roche-Posay Hyalu B5 Pure Hyaluronic Acid Serum': 'An anti-aging ultra hydrating pure hyaluronic acid face and neck serum that leaves skin feeling plump to the touch.',
    'La Roche-Posay Lipikar Balm AP+M': 'An intense soothing balm that moisturizes and helps relieve dry, irritated skin. Suitable for adults, children, and babies.',
    'La Roche-Posay Effaclar Medicated Gel Cleanser': 'An acne face wash with 2% salicylic acid that helps clear acne breakouts, blackheads, and whiteheads.',
    'La Roche-Posay 10% Pure Vitamin C Serum': 'A rich serum texture with 10% pure vitamin C that leaves skin feeling softer and more hydrated. Visibly reduces wrinkles.',
    'La Roche-Posay Toleriane Purifying Foaming Cleanser': 'A daily face wash for normal to oily, sensitive skin. Gently cleanses dirt and oil while maintaining the skin\'s natural pH.',
    'La Roche-Posay Cicaplast Balm B5': 'A multi-purpose soothing cream for cracked, chapped, and irritated skin that helps to hydrate and soothe.',
    'La Roche-Posay Redermic R Retinol Cream': 'An award-winning anti-aging pure retinol cream that visibly reduces the look of lines, wrinkles and premature sun damage.',
    'La Roche-Posay Anthelios Clear Skin Sunscreen SPF 60': 'An oil-free, dry touch sunscreen for face with broad spectrum SPF 60. Helps absorb pore-clogging oil, even in heat and humidity.',
    'Innisfree Daily UV Defense Sunscreen': 'A lightweight, water-based sunscreen with SPF 36 that delivers invisible protection. Perfect for daily use.',
    'Innisfree Green Tea Seed Intensive Hydrating Serum': 'A daily hydrating serum infused with green tea seed oil to hydrate skin from within, for a soft, glowing complexion.',
    'Innisfree Pore Clearing Clay Mask': 'A deep-cleansing, creamy clay mask formulated with Jeju Super Volcanic Clusters that helps to cleanse pores and absorb excess oil.',
    'Innisfree Youth-Enriched Cream with Orchid': 'A rich anti-aging cream with the vitality of Jeju orchids to help combat the signs of aging and provide a radiant glow.',
    'Innisfree Green Tea Hyaluronic Acid Serum': 'A lightweight, hydrating serum with green tea and hyaluronic acid that helps to replenish moisture and balance the skin.',
    'Innisfree Volcanic AHA Pore Clearing Clay Mask': 'A creamy clay mask with volcanic clusters and AHA to help exfoliate and minimize the look of pores.',
    'Innisfree Green Tea Cleansing Foam': 'A refreshing cleansing foam with Jeju green tea extract to whisk away dirt and impurities, leaving skin clean and supple.',
    'Innisfree Dewy Glow Jelly Cream': 'A gel-cream that provides a burst of hydration from Jeju cherry blossom for a dewy, glowing complexion.',
    'Innisfree Black Tea Youth Enhancing Ampoule': 'An intensive anti-aging ampoule formulated with Black Tea Reset Concentrate™ to help firm, brighten, and moisturize tired skin.',
    'Innisfree Matte Priming UV Shield Sunscreen': 'A lightweight, matte sunscreen with SPF 37 that helps to control excess sebum for a soft, shine-free finish.',
    'COSRX Snail Mucin 96% Power Essence': 'A lightweight essence formulated with 96% snail secretion filtrate to protect the skin from moisture loss and improve elasticity.',
    'COSRX Advanced Snail 92 All in one Cream': 'A rich gel-type cream that absorbs instantly into the skin with a full of nourishment while leaving your skin feeling fresh.',
    'COSRX Low pH Good Morning Gel Cleanser': 'A gentle gel type cleanser with a mildly acidic pH level. Effectively removes impurities without stripping the skin\'s natural oils.',
    'COSRX AHA/BHA Clarifying Treatment Toner': 'A mild daily toner for clear, supple skin. Formulated with AHA, BHA and purifying botanical ingredients.',
    'COSRX Ultimate Nourishing Rice Overnight Spa Mask': 'Enriched with more than 68% of Rice Extract, this mask provides intensive nourishment and deep moisturization.',
    'COSRX The Vitamin C 23 Serum': 'A potent serum with 23% pure Vitamin C to brighten the complexion and diminish the appearance of dark spots.',
    'COSRX Salicylic Acid Daily Gentle Cleanser': 'A gentle cleanser with salicylic acid that helps to exfoliate and control sebum for a clear, blemish-free complexion.',
    'COSRX Aloe Soothing Sun Cream SPF50': 'A soothing sun cream formulated with Aloe Arborescens Leaf Extract, this daily sun cream is lightweight and moisturizing.',
    'COSRX The Retinol 0.5 Oil': 'A powerful anti-aging oil with 0.5% pure retinol to help reduce the signs of aging, such as fine lines and wrinkles.',
    'COSRX Acne Pimple Master Patch': 'A hydrocolloid patch that protects wounded or troubled areas from getting worse and maintains humidity of skin.'
};

// NEW: Structured detailed information for all products.
const productExtendedDetails = {
    "The Ordinary Niacinamide 10% + Zinc 1%": { targets: "Textural Irregularities, Dryness, Dullness, Visible Shine, Signs of Congestion", suited_to: "All Skin Types", format: "Serum: Water-Based", key_ingredients: "Niacinamide, Zinc PCA" },
    "The Ordinary Hyaluronic Acid 2% + B5": { targets: "Dryness, Signs of Aging", suited_to: "All Skin Types", format: "Water-based Serum", key_ingredients: "Hyaluronic Acid, Ceramides, Pro-vitamin B5" },
    "The Ordinary Glycolic Acid 7% Toning Solution": { targets: "Textural Irregularities, Dullness, Uneven Skin Tone", suited_to: "All Skin Types", format: "Water-based Toner", key_ingredients: "Glycolic Acid, Aloe Barbadensis Leaf Water, Panax Ginseng Root Extract" },
    "The Ordinary Salicylic Acid 2% Masque": { targets: "Signs of Congestion, Dullness, Textural Irregularities", suited_to: "Oily Skin", format: "Masque", key_ingredients: "Salicylic Acid, Kaolin, Charcoal Powder" },
    "The Ordinary \"Buffet\" + Copper Peptides 1%": { targets: "Signs of Aging, Firmness, Textural Irregularities", suited_to: "All Skin Types", format: "Water-based Serum", key_ingredients: "Copper Peptides, Lactococcus Ferment Lysate, Matrixyl" },
    "The Ordinary Retinol 0.5% in Squalane": { targets: "Textural Irregularities, Signs of Aging, Uneven Skin Tone, Dryness", suited_to: "All Skin Types", format: "Anhydrous Serum", key_ingredients: "Retinol, Squalane" },
    "The Ordinary Natural Moisturizing Factors + HA": { targets: "Dryness, Dullness", suited_to: "All Skin Types", format: "Emulsion", key_ingredients: "Sodium Hyaluronate, Arginine, Sodium PCA, Lactic Acid" },
    "The Ordinary Vitamin C Suspension 23% + HA Spheres 2%": { targets: "Uneven Skin Tone, Signs of Aging, Antioxidant Support", suited_to: "All Skin Types", format: "Suspension", key_ingredients: "Ascorbic Acid, Sodium Hyaluronate, Squalane" },
    "The Ordinary 100% Plant-Derived Squalane": { targets: "Dryness, Dehydration (can also be used on hair)", suited_to: "All Skin Types", format: "Anhydrous Solution / Oil", key_ingredients: "Squalane" },
    "The Ordinary Caffeine Solution 5% + EGCG": { targets: "Puffiness, Dark Circles", suited_to: "All Skin Types", format: "Water-based Serum", key_ingredients: "Caffeine, Epigallocatechin Gallatyl Glucoside (EGCG)" },
    "CeraVe Hydrating Cleanser": { targets: "Dryness, Gentle Cleansing", suited_to: "Normal to Dry Skin", format: "Cream-to-lotion Cleanser", key_ingredients: "Ceramides, Hyaluronic Acid" },
    "CeraVe Foaming Facial Cleanser": { targets: "Oiliness, Gentle Cleansing, Makeup Removal", suited_to: "Normal to Oily Skin", format: "Foaming Gel Cleanser", key_ingredients: "Ceramides, Hyaluronic Acid, Niacinamide" },
    "CeraVe AM Facial Moisturizing Lotion SPF 30": { targets: "Dryness, Sun Protection", suited_to: "All Skin Types", format: "Lotion", key_ingredients: "Ceramides, Hyaluronic Acid, Niacinamide, Zinc Oxide" },
    "CeraVe PM Facial Moisturizing Lotion": { targets: "Dryness, Barrier Repair", suited_to: "All Skin Types", format: "Lightweight Lotion", key_ingredients: "Ceramides, Hyaluronic Acid, Niacinamide" },
    "CeraVe Skin Renewing Vitamin C Serum": { targets: "Dullness, Uneven Skin Tone, Antioxidant Support", suited_to: "All Skin Types", format: "Serum", key_ingredients: "Ascorbic Acid (10% L-ascorbic acid), Hyaluronic Acid, Ceramides" },
    "CeraVe Resurfacing Retinol Serum": { targets: "Post-Acne Marks, Pores, Textural Irregularities", suited_to: "Acne-Prone, Sensitive Skin", format: "Serum", key_ingredients: "Retinol, Niacinamide, Ceramides, Licorice Root Extract" },
    "CeraVe Moisturizing Cream": { targets: "Dryness, Dehydration, Eczema", suited_to: "Dry to Very Dry Skin", format: "Rich Cream", key_ingredients: "Ceramides, Hyaluronic Acid" },
    "CeraVe Hydrating Sunscreen SPF 50": { targets: "Sun Protection, Dryness", suited_to: "All Skin Types, including Sensitive", format: "Mineral Sunscreen Lotion", key_ingredients: "Titanium Dioxide, Zinc Oxide, Ceramides, Hyaluronic Acid" },
    "CeraVe SA Cleanser for Rough & Bumpy Skin": { targets: "Textural Irregularities, Bumps, Dryness, Acne", suited_to: "Rough & Bumpy Skin, Dry, Acne-Prone", format: "Gel Cleanser", key_ingredients: "Salicylic Acid, Ceramides, Niacinamide" },
    "CeraVe Eye Repair Cream": { targets: "Puffiness, Dark Circles", suited_to: "All Skin Types", format: "Cream", key_ingredients: "Ceramides, Hyaluronic Acid, Niacinamide, Marine & Botanical Complex" },
    "La Roche-Posay Toleriane Moisturizer": { targets: "Dryness, Barrier Repair", suited_to: "All Skin Types, including Sensitive", format: "Cream", key_ingredients: "Ceramide-3, Niacinamide, Glycerin, Thermal Water" },
    "La Roche-Posay Anthelios Melt-in Milk Sunscreen SPF 60": { targets: "Sun Protection", suited_to: "All Skin Types, including Sensitive", format: "Sunscreen Lotion", key_ingredients: "Avobenzone, Homosalate, Octisalate, Octocrylene (Cell-Ox Shield® technology)" },
    "La Roche-Posay Hyalu B5 Pure Hyaluronic Acid Serum": { targets: "Dehydration, Fine Lines, Loss of Volume", suited_to: "All Skin Types, including Sensitive", format: "Serum", key_ingredients: "Hyaluronic Acid, Vitamin B5, Madecassoside" },
    "La Roche-Posay Lipikar Balm AP+M": { targets: "Intense Dryness, Itching, Eczema-Prone Skin", suited_to: "Dry to Extra Dry, Sensitive Skin", format: "Rich Balm", key_ingredients: "Shea Butter, Niacinamide, Thermal Water, AP+M Technology" },
    "La Roche-Posay Effaclar Medicated Gel Cleanser": { targets: "Acne, Blackheads, Oiliness", suited_to: "Oily, Acne-Prone Skin", format: "Gel Cleanser", key_ingredients: "Salicylic Acid (2%), Lipo-Hydroxy Acid" },
    "La Roche-Posay 10% Pure Vitamin C Serum": { targets: "Wrinkles, Dullness, Uneven Skin Tone", suited_to: "All Skin Types, including Sensitive", format: "Serum", key_ingredients: "Ascorbic Acid (10%), Salicylic Acid, Neurosensine" },
    "La Roche-Posay Toleriane Purifying Foaming Cleanser": { targets: "Oiliness, Makeup Removal, Impurities", suited_to: "Normal to Oily, Sensitive Skin", format: "Foaming Cleanser", key_ingredients: "Ceramide-3, Niacinamide, Glycerin, Thermal Water" },
    "La Roche-Posay Cicaplast Balm B5": { targets: "Dry Patches, Irritation, Compromised Skin Barrier", suited_to: "All Skin Types, including Sensitive and Babies", format: "Balm", key_ingredients: "Panthenol (Vitamin B5), Shea Butter, Madecassoside" },
    "La Roche-Posay Redermic R Retinol Cream": { targets: "Wrinkles, Fine Lines, Premature Sun Damage", suited_to: "Sensitive Skin", format: "Cream", key_ingredients: "Retinol, Lipo-Hydroxy Acid" },
    "La Roche-Posay Anthelios Clear Skin Sunscreen SPF 60": { targets: "Sun Protection, Oil Control", suited_to: "Oily, Acne-Prone Skin", format: "Dry Touch Sunscreen Lotion", key_ingredients: "Avobenzone, Homosalate, Octisalate, Octocrylene (Cell-Ox Shield® technology)" },
    "Innisfree Daily UV Defense Sunscreen": { targets: "Sun Protection, Hydration", suited_to: "All Skin Types", format: "Water-based Sunscreen Lotion", key_ingredients: "Green Tea, Cica, Sunflower Seed Oil" },
    "Innisfree Green Tea Seed Intensive Hydrating Serum": { targets: "Dehydration, Barrier Support", suited_to: "All Skin Types", format: "Serum", key_ingredients: "Green Tea Tri-biotics™, Hyaluronic Acid, Green Tea Seed Oil" },
    "Innisfree Pore Clearing Clay Mask": { targets: "Pores, Oiliness, Uneven Texture", suited_to: "Normal, Combination, and Oily Skin", format: "Clay Mask", key_ingredients: "Volcanic Clusters, Lactic Acid (AHA)" },
    "Innisfree Youth-Enriched Cream with Orchid": { targets: "Fine lines, Wrinkles, Dryness, Dullness", suited_to: "Normal to Dry Skin", format: "Cream", key_ingredients: "Orchid Elixir 2.0™, Hyaluronic Acid, Peptides" },
    "Innisfree Green Tea Hyaluronic Acid Serum": { targets: "Intense Hydration, Dryness", suited_to: "All Skin Types", format: "Serum", key_ingredients: "Green Tea Extract, Hyaluronic Acid" },
    "Innisfree Volcanic AHA Pore Clearing Clay Mask": { targets: "Pores, Excess Oil, Dead Skin Cells", suited_to: "Oily and Combination Skin", format: "Clay Mask", key_ingredients: "Volcanic Clusters, AHAs (Glycolic Acid)" },
    "Innisfree Green Tea Cleansing Foam": { targets: "Cleansing, Hydration", suited_to: "All Skin Types", format: "Foam Cleanser", key_ingredients: "Green Tea Root Extract, Hyaluronic Acid" },
    "Innisfree Dewy Glow Jelly Cream": { targets: "Dullness, Uneven Tone, Hydration", suited_to: "All Skin Types", format: "Gel-Cream", key_ingredients: "Jeju Cherry Blossom Leaf Extract, Niacinamide, Betaine" },
    "Innisfree Black Tea Youth Enhancing Ampoule": { targets: "Signs of Aging, Dryness, Dullness", suited_to: "All Skin Types", format: "Ampoule / Serum", key_ingredients: "Black Tea Reset Concentrate™, Niacinamide, Hyaluronic Acid" },
    "Innisfree Matte Priming UV Shield Sunscreen": { targets: "Sun Protection, Oil Control, Pore Blurring", suited_to: "Normal to Oily Skin", format: "Sunscreen Cream / Primer", key_ingredients: "Green Tea, Sunflower Seed Oil" },
    "COSRX Snail Mucin 96% Power Essence": { targets: "Dullness, Dehydration, Fine Lines, Post-Acne Marks", suited_to: "All Skin Types, including Sensitive", format: "Essence", key_ingredients: "Snail Secretion Filtrate, Betaine, Sodium Hyaluronate" },
    "COSRX Advanced Snail 92 All in one Cream": { targets: "Dryness, Redness, Damaged Skin Barrier", suited_to: "All Skin Types", format: "Gel-Cream", key_ingredients: "Snail Secretion Filtrate, Betaine, Adenosine" },
    "COSRX Low pH Good Morning Gel Cleanser": { targets: "Gentle Cleansing, Mild Exfoliation, Oil Control", suited_to: "All Skin Types, especially Oily and Sensitive", format: "Gel Cleanser", key_ingredients: "Tea Tree Oil, BHA (Betaine Salicylate)" },
    "COSRX AHA/BHA Clarifying Treatment Toner": { targets: "Blackheads, Whiteheads, Dullness, Textural Irregularities", suited_to: "All Skin Types, especially Acne-Prone", format: "Liquid Toner", key_ingredients: "Willow Bark Water (BHA), Apple Fruit Water (AHA), Glycolic Acid (AHA)" },
    "COSRX Ultimate Nourishing Rice Overnight Spa Mask": { targets: "Dryness, Dullness, Uneven Texture", suited_to: "All Skin Types, especially Dry", format: "Cream Mask", key_ingredients: "Rice Extract, Niacinamide" },
    "COSRX The Vitamin C 23 Serum": { targets: "Dullness, Dark Spots, Uneven Tone, Antioxidant Support", suited_to: "All Skin Types (use with caution on sensitive skin)", format: "Serum", key_ingredients: "Ascorbic Acid (23%), Tocotrienol (Super Vitamin E), Hyaluronic Acid" },
    "COSRX Salicylic Acid Daily Gentle Cleanser": { targets: "Acne, Blackheads, Oil Control", suited_to: "Oily, Acne-Prone Skin", format: "Cream Cleanser", key_ingredients: "Salicylic Acid, Tea Tree Oil" },
    "COSRX Aloe Soothing Sun Cream SPF50": { targets: "Sun Protection, Soothing, Hydration", suited_to: "All Skin Types, especially Dry and Sensitive", format: "Cream Sunscreen", key_ingredients: "Aloe Arborescens Leaf Extract" },
    "COSRX The Retinol 0.5 Oil": { targets: "Wrinkles, Fine Lines, Loss of Elasticity", suited_to: "Skin accustomed to Retinoids", format: "Oil", key_ingredients: "Retinol (0.5%), Squalane, Tocotrienol (Super Vitamin E)" },
    "COSRX Acne Pimple Master Patch": { targets: "Active Acne, Blemishes, Wound Protection", suited_to: "All Skin Types", format: "Hydrocolloid Patch", key_ingredients: "Hydrocolloid" }
};

// --- INITIALIZATION ---
window.onload = () => {
    initializeApp();
    updateTime();
    setInterval(updateTime, 1000);
};
    window.addEventListener('keydown', (event) => {
        // Only run this code if the numpad target (e.g., Cash Received input) is active
        if (!numpadTarget) {
            return;
        }

        // Check which key was pressed and call the correct function
        if (event.key >= '0' && event.key <= '9') {
            event.preventDefault(); // Prevent the key from being typed elsewhere
            numpadInput(event.key);
        } else if (event.key === '.') {
            event.preventDefault();
            numpadInput('.');
        } else if (event.key === 'Backspace') {
            event.preventDefault();
            numpadBackspace();
        } else if (event.key === 'Escape' || event.key.toLowerCase() === 'c') {
            // Use Escape or 'c' to clear the input, like the CLR button
            event.preventDefault();
            numpadClear();
        }
    });
async function initializeApp() {
    sessionStartTime = new Date();
    try {
        const [productsResponse, brandsResponse, categoriesResponse, salesResponse] = await Promise.all([
            fetch('http://localhost:3000/api/products'),
            fetch('http://localhost:3000/api/brands'),
            fetch('http://localhost:3000/api/categories'),
            fetch('http://localhost:3000/api/sales')
        ]);

        products = await productsResponse.json();
        brands = await brandsResponse.json();
        categories = await categoriesResponse.json();
        salesHistory = await salesResponse.json();

        // MODIFICATION: Merge all details into the product data
        products.forEach(p => {
            if (productDescriptions[p.name]) {
                p.description = productDescriptions[p.name];
            }
            if (productExtendedDetails[p.name]) {
                Object.assign(p, productExtendedDetails[p.name]);
            }
        });

        salesHistory.forEach(sale => {
            sale.date = new Date(sale.date);
        });

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
    document.getElementById('product-browser-controls').classList.add('hidden');
    const cartContainer = document.getElementById('panel-content-area');
    activeCategory = 'All';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-gray-400 text-center p-8">Shopping bag is empty.</p>';
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image_url}" alt="${item.name}" class="cart-item-img" onerror="this.onerror=null;this.src='images/placeholder.png';">
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

function renderBrandFilterDropdown(selectId) {
    const brandNames = ['All Brands', ...brands.map(b => b.brand_name)];
    document.getElementById(selectId).innerHTML = brandNames.map(name => `<option>${name}</option>`).join('');
}

function renderCategoryFilterDropdown(selectId) {
    const categoryNames = ['All Categories', ...categories.map(c => c.category_name)];
    document.getElementById(selectId).innerHTML = categoryNames.map(name => `<option>${name}</option>`).join('');
}

function renderConcernFilterDropdown() {
    document.getElementById('concern-filter-select').innerHTML = skinConcerns.map(name => `<option>${name}</option>`).join('');
}

function renderDetailedList(productsToRender) {
    const productContainer = document.getElementById('panel-content-area');

    if (productsToRender.length === 0) {
        productContainer.innerHTML = `<p class="text-gray-500 text-center p-8">No products match your filters.</p>`;
        return;
    }

    productContainer.innerHTML = `<div class="p-2 space-y-3">${productsToRender.map(p => {
        const brand = brands.find(b => b.brand_id === p.brand_id) || { brand_name: 'N/A' };
        const category = categories.find(c => c.category_id === p.category_id) || { category_name: 'N/A' };
        const placeholderUrl = `images/placeholder.png`;
        return `
            <div class="grid grid-cols-12 gap-x-4 items-start p-4 border rounded-lg bg-gray-50">
                
                
                <div class="col-span-2">
                    <img src="${p.image_url}" alt="${p.name}" class="w-full h-auto object-cover rounded-md border" onerror="this.onerror=null;this.src='${placeholderUrl}';">
                </div>
                
                
                <div class="col-span-10">
                    
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h3 class="font-bold text-md text-pink-700">${p.name}</h3>
                            <p class="text-sm text-gray-700 font-semibold">Brand: ${brand.brand_name}</p>
                            <p class="text-sm text-gray-700 font-semibold">Category: ${category.category_name}</p>
                        </div>
                        <p class="font-bold text-lg text-green-700 flex-shrink-0 ml-4">$${p.price.toFixed(2)}</p>
                    </div>

                    
                    <div class="border-t">
                        <div class="flex py-1.5 border-b text-sm">
                            <strong class="w-32 flex-shrink-0 text-gray-600">Targets</strong>
                            <span class="text-gray-800">${p.targets || 'N/A'}</span>
                        </div>
                        <div class="flex py-1.5 border-b text-sm">
                            <strong class="w-32 flex-shrink-0 text-gray-600">Suited to</strong>
                            <span class="text-gray-800">${p.suited_to || 'N/A'}</span>
                        </div>
                        <div class="flex py-1.5 border-b text-sm">
                            <strong class="w-32 flex-shrink-0 text-gray-600">Format</strong>
                            <span class="text-gray-800">${p.format || 'N/A'}</span>
                        </div>
                        <div class="flex py-1.5 text-sm">
                            <strong class="w-32 flex-shrink-0 text-gray-600">Key Ingredients</strong>
                            <span class="text-gray-800">${p.key_ingredients || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>`;
    }).join('')}</div>`;
}

/**
 * Filters the detailed product list based on search, brand, and category.
 */
function filterDetailedView() {
    const searchTerm = document.getElementById('detailed-search-input').value.toLowerCase();
    const selectedBrandName = document.getElementById('detailed-brand-select').value;
    const selectedCategoryName = document.getElementById('detailed-category-select').value;
    
    let filteredProducts = products;

    if (selectedBrandName !== 'All Brands') {
        const brand = brands.find(b => b.brand_name === selectedBrandName);
        if (brand) {
            filteredProducts = filteredProducts.filter(p => p.brand_id === brand.brand_id);
        }
    }

    if (selectedCategoryName !== 'All Categories') {
        const category = categories.find(c => c.category_name === selectedCategoryName);
        if (category) {
            filteredProducts = filteredProducts.filter(p => p.category_id === category.category_id);
        }
    }
    
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm)
        );
    }
    
    renderDetailedList(filteredProducts);
}

/**
 * Sets up the detailed view with search and filter controls.
 */
function renderProductDetailedView() {
    const panelHeader = document.getElementById('left-panel-header');
    document.getElementById('product-browser-controls').classList.add('hidden');

    panelHeader.innerHTML = `
        <h2 id="left-panel-title" class="panel-title-text text-sm">PRODUCT INFO</h2>
        <div class="flex-grow mx-2">
            <input type="text" id="detailed-search-input" onkeyup="filterDetailedView()" placeholder="Search products..." class="w-full p-2 border rounded-md text-sm">
        </div>
        <div class="filter-controls">
            <div>
                <label for="detailed-brand-select" class="filter-label">Brand</label>
                <select id="detailed-brand-select" onchange="filterDetailedView()" class="filter-select"></select>
            </div>
            <div>
                <label for="detailed-category-select" class="filter-label">Category</label>
                <select id="detailed-category-select" onchange="filterDetailedView()" class="filter-select"></select>
            </div>
        </div>
    `;

    renderBrandFilterDropdown('detailed-brand-select');
    renderCategoryFilterDropdown('detailed-category-select');
    renderDetailedList(products);
}

/**
 * Sets up the main "selling" view with product grid and category filters.
 */
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

    const controlsContainer = document.getElementById('product-browser-controls');
    controlsContainer.classList.remove('hidden');

    const categoryNames = ['All', ...categories.map(c => c.category_name)];

    const categoryButtonsHTML = categoryNames.map(name =>
        `<button onclick="setCategoryFilter('${name}')" class="category-filter-btn px-3 py-1 rounded-md text-sm font-medium" data-category="${name}">${name}</button>`
    ).join('');

    controlsContainer.innerHTML = `
        <div class="flex justify-center items-center gap-4 w-full">
            <div id="category-filters" class="flex items-center gap-1 bg-gray-200 p-1 rounded-lg">
                ${categoryButtonsHTML}
            </div>
            <button id="show-detailed-view-btn" class="bg-white border border-gray-300 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100">
                Products Detailed
            </button>
        </div>
    `;

    document.getElementById('show-detailed-view-btn').addEventListener('click', renderProductDetailedView);

    renderBrandFilterDropdown('brand-filter-select');
    renderConcernFilterDropdown();
    setCategoryFilter(activeCategory);
}

/**
 * Handles clicks on the CATEGORY filter tabs only.
 */
function setCategoryFilter(categoryName) {
    activeCategory = categoryName;
    document.querySelectorAll('.category-filter-btn').forEach(btn => {
        btn.classList.toggle('active-filter', btn.dataset.category === categoryName);
    });
    filterAndRenderProducts();
}


function filterAndRenderProducts() {
    const productContainer = document.getElementById('panel-content-area');
    const searchInput = document.getElementById('product-search-input');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase() || '';
    const selectedBrandName = document.getElementById('brand-filter-select')?.value || 'All Brands';
    const selectedConcern = document.getElementById('concern-filter-select')?.value || 'All Concerns';

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

    productContainer.innerHTML = `<div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">${filteredProducts.map(p => {
        const placeholderUrl = `images/placeholder.png`;
        return `
            <div onclick="addToCart(${p.product_id})" class="p-2 border rounded-lg text-center cursor-pointer hover:bg-gray-100 hover:border-pink-500 transition-all flex flex-col h-full">
                <img src="${p.image_url}" alt="${p.name}" class="w-full h-20 object-cover rounded-md mb-2" onerror="this.onerror=null;this.src='${placeholderUrl}';">
                <div class="flex flex-col flex-grow">
                     <p class="font-semibold text-xs leading-tight h-10">${p.name}</p>
                     <p class="text-sm font-medium text-gray-800 mt-auto">$${p.price.toFixed(2)}</p>
                </div>
            </div>`;
        }).join('')}</div>`;
}


function renderTransactionHistory() {
    const container = document.getElementById('history-content');
    if (sessionTransactions.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center p-4">No transactions in this session.</p>`;
        return;
    }

    const header = `
        <div class="history-header">
            <span>Details</span>
            <span class="text-right">Total</span>
            <span class="text-right">Action</span>
        </div>
    `;

    const items = sessionTransactions.map((sale, index) => {
        const displayDate = sale.date.toLocaleString();
        return `
            <div class="history-item">
                <div>
                    <p class="font-semibold truncate">${sale.receiptId}</p>
                    <p class="text-xs text-gray-500">${displayDate}</p>
                </div>
                <p class="font-bold text-lg text-right">$${sale.totalUSD.toFixed(2)}</p>
                <button onclick='displayReceipt(sessionTransactions[${index}])' class="text-blue-500 hover:underline text-xs justify-self-end">View</button>
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
        if (cartItem.quantity <= 0) {
            removeFromCart(productId);
        } else {
            renderCart();
            renderSummary();
        }
    }
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
    const total = parseFloat(document.getElementById('summary-total').textContent.replace('$', ''));

    if (paymentMethod === 'CASH') {
        const totalRiel = Math.round((total * EXCHANGE_RATE_RIEL) / 100) * 100;
        const cashReceived = parseFloat(document.getElementById('main-cash-received').value) || 0;
        if (cashReceived < totalRiel) {
            showInfoModal('Please enter the correct amount of cash received.');
            return;
        }
        // If cash is sufficient, finalize the sale immediately.
        finalizeSale();
    } else {
        // For other methods (ABA, ACLEDA), show the QR code for confirmation.
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

async function finalizeSale() {
    if (cart.length === 0) {
        showInfoModal('Cannot confirm an empty sale.');
        return;
    }
    const total = parseFloat(document.getElementById('summary-total').textContent.replace('$', ''));
    const paymentMethod = document.getElementById('payment-method').value;

    const tempReceiptData = {
        receiptId: `RCPT-${Date.now()}`,
        date: new Date(),
        cashier: document.getElementById('cashier-select').value,
        items: cart.map(item => ({...item})),
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        totalUSD: total,
        paymentMethod: paymentMethod
    };

    const salePayload = {
        receiptId: tempReceiptData.receiptId,
        cashier: tempReceiptData.cashier,
        items: tempReceiptData.items,
        totalUSD: tempReceiptData.totalUSD,
        paymentMethod: tempReceiptData.paymentMethod
    };

    try {
        const response = await fetch('http://localhost:3000/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(salePayload),
        });

        if (!response.ok) {
            // This will trigger the "Could not save..." error if the server is not running
            throw new Error('Failed to save the sale.');
        }

        if (tempReceiptData.paymentMethod === 'CASH') {
            const cashReceived = parseFloat(document.getElementById('main-cash-received').value) || 0;
            const totalRiel = Math.round((tempReceiptData.totalUSD * EXCHANGE_RATE_RIEL) / 100) * 100;
            tempReceiptData.cashReceived = cashReceived;
            tempReceiptData.changeDue = cashReceived - totalRiel;
        }
        
        salesHistory.unshift(tempReceiptData);
        sessionTransactions.unshift(tempReceiptData);
        
        displayReceipt(tempReceiptData);
        renderTransactionHistory();

        cart = [];
        document.getElementById('main-cash-received').value = '';
        showProductBrowser();
        renderSummary();
        closeModal('qrCodeModal'); // Close the QR modal if it was open

    } catch (error) {
        console.error("Error during finalizeSale:", error);
        // This is where the error modal is triggered
        showInfoModal('Error: Could not save the transaction to the server.');
    }
}


/**
 * CORRECTED: Fixes a bug where the total in Riel was calculated using the
 * wrong variable name, causing the script to crash.
 */
function displayReceipt(saleData) {
    const receiptContent = document.getElementById('receiptContent');
    const subtotal = saleData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const displayDate = saleData.date.toLocaleString();
    let receiptHtml = `
        <div class="text-center mb-4"><h2 class="text-xl font-bold">Angkoria Beauty</h2><p class="text-xs">#65, Tonle Sap Street, Chroy Chongva</p></div>
        <div class="text-xs text-gray-600 mb-2"><p>Receipt ID: ${saleData.receiptId}</p><p>Date: ${displayDate}</p><p>Cashier: ${saleData.cashier}</p></div>
        <div class="border-t border-b border-dashed py-2 my-2"><div class="flex font-bold text-xs"><span class="w-8">QTY</span><span class="flex-grow">ITEM</span><span class="w-16 text-right">PRICE</span></div>`;

    saleData.items.forEach(item => {
        receiptHtml += `<div class="flex text-sm my-1"><span class="w-8">${item.quantity}x</span><span class="flex-grow truncate pr-2">${item.name}</span><span class="w-16 text-right">$${(item.price * item.quantity).toFixed(2)}</span></div>`;
    });

    // The variable name here is now corrected from 'totalUSD' to 'saleData.totalUSD'
    receiptHtml += `</div><div class="mt-4 space-y-1 text-sm">
        <div class="flex justify-between"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="flex justify-between font-bold text-base border-t border-dashed mt-2 pt-2"><span>Total (USD):</span><span>$${saleData.totalUSD.toFixed(2)}</span></div>
        <div class="flex justify-between font-bold text-base"><span>Total (Riel):</span><span>R ${(Math.round((saleData.totalUSD * EXCHANGE_RATE_RIEL) / 100) * 100).toLocaleString()}</span></div></div>`;

    if (saleData.paymentMethod === 'CASH' && saleData.cashReceived !== undefined) {
        receiptHtml += `<div class="border-t border-dashed mt-2 pt-2 text-sm">
            <div class="flex justify-between"><span>Cash Received:</span><span>R ${saleData.cashReceived.toLocaleString()}</span></div>
            <div class="flex justify-between"><span>Change Due:</span><span>R ${saleData.changeDue.toLocaleString()}</span></div></div>`;
    }

    receiptHtml += `<div class="text-center text-xs text-gray-500 mt-6"><p>Thank you! Please come again.</p></div>`;
    receiptContent.innerHTML = receiptHtml;
    openModal('receiptModal');
}   

// --- REPORT, VOID, RETURN & LOGOUT FUNCTIONS ---

function showEndSessionReport() {
    const cashier = document.getElementById('cashier-select').value;
    
    const sessionSales = sessionTransactions.filter(sale => sale.cashier === cashier);

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

async function processTransactionAction(type) {
    const receiptId = document.getElementById('transaction-id-input').value.trim();
    if (!receiptId) {
        showInfoModal('Please enter a Receipt ID.');
        return;
    }

    const saleIndex = salesHistory.findIndex(sale => sale.receiptId === receiptId);
    if (saleIndex === -1) {
        showInfoModal(`Receipt ID "${receiptId}" not found.`);
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/sales/${receiptId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete transaction from server.');
        }

        salesHistory.splice(saleIndex, 1);
        
        const sessionSaleIndex = sessionTransactions.findIndex(sale => sale.receiptId === receiptId);
        if (sessionSaleIndex > -1) {
            sessionTransactions.splice(sessionSaleIndex, 1);
        }

        renderTransactionHistory();

        closeModal('transactionModal');
        showInfoModal(`Receipt ${receiptId} has been successfully ${type.toLowerCase()}ed.`);

    } catch (error) {
        console.error(`Error during ${type}:`, error);
        showInfoModal(`Error: Could not ${type.toLowerCase()} the transaction.`);
    }
}


function logOut() {
    showInfoModal('Session ended successfully. A new session has begun.');
    cart = [];
    sessionTransactions = [];
    renderTransactionHistory();
    
    document.getElementById('cashier-select').selectedIndex = 0;
    showProductBrowser();
    renderSummary();
    
    sessionStartTime = new Date();
}


// --- NUMPAD & MODAL LOGIC ---
function numpadInput(value) {
    if (numpadTarget) {
        if (value === '.' && numpadTarget.value.includes('.')) return;
        numpadTarget.value += value;
        numpadTarget.dispatchEvent(new Event('input'));
    }
}

function numpadClear() {
    if (numpadTarget) {
        numpadTarget.value = '';
        numpadTarget.dispatchEvent(new Event('input'));
    }
}
function numpadBackspace() {
    if (numpadTarget) {
        numpadTarget.value = numpadTarget.value.slice(0, -1);
        numpadTarget.dispatchEvent(new Event('input'));
    }
}
function showInfoModal(text) {
    document.getElementById('infoModalText').textContent = text;
    openModal('infoModal');
}
function openModal(modalId) { document.getElementById(modalId)?.classList.remove('hidden'); }
function closeModal(modalId) {
    document.getElementById(modalId)?.classList.add('hidden');
}
