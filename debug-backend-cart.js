
// Native fetch used


const BASE_URL = 'http://localhost:8080/api/v1/cart';
const USER_ID = 1;
const PRODUCT_ID = 1;

async function debugCart() {
    console.log(`--- Debugging Cart for User ${USER_ID} ---`);

    // 1. Get Initial State
    console.log('\n1. Fetching Initial Cart...');
    let res = await fetch(`${BASE_URL}/current?userId=${USER_ID}`);
    if (!res.ok) console.log('Error fetching cart:', await res.text());
    let cart = await res.json();
    console.log('Initial Cart Item Count:', cart.data ? cart.data.itemCount : 'Error');

    // 2. Add Item
    console.log('\n2. Adding Item...');
    res = await fetch(`${BASE_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID, productId: PRODUCT_ID, quantity: 1 })
    });
    let addResult = await res.json();
    console.log('Add Result:', addResult.success ? 'Success' : `Failed: ${addResult.message}`);

    // 3. Get State After Add
    console.log('\n3. Fetching Cart After Add...');
    res = await fetch(`${BASE_URL}/current?userId=${USER_ID}`);
    cart = await res.json();
    console.log('Cart Status:', cart.success);
    console.log('Cart Items:', JSON.stringify(cart.data.items, null, 2));

    // 4. Force specific check
    if (cart.data.items.length === 0) {
        console.log('\n[CRITICAL] Cart is empty despite success response!');
    } else {
        console.log('\n[SUCCESS] Cart has items!');
    }
}

// Polyfill for Node environment if needed
if (!global.fetch) {
    console.log("Using native fetch");
}

debugCart();
