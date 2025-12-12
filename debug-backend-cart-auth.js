
// Native fetch used

const BASE_URL = 'http://localhost:8080/api/v1';

async function debugCart() {
    console.log(`--- Debugging Cart with Auth ---`);

    // 1. Login
    console.log('\n1. Logging in...');
    let res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
    });
    let authData = await res.json();

    if (!authData.success) {
        console.error('Login Failed:', authData);
        return;
    }

    const token = authData.data.token;
    const userId = authData.data.user.id;
    console.log(`Login Success! Token obtained. UserID: ${userId}`);

    const HEADERS = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // 2. Add Item
    console.log('\n2. Adding Item...');
    res = await fetch(`${BASE_URL}/cart/add`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ userId: userId, productId: 1, quantity: 1 })
    });
    let addResult = await res.json();
    console.log('Full Add Response:', JSON.stringify(addResult, null, 2));
    console.log('Add Result:', addResult.success ? 'Success' : `Failed: ${addResult.message}`);

    // 3. Get State After Add
    console.log('\n3. Fetching Cart After Add...');
    res = await fetch(`${BASE_URL}/cart/current?userId=${userId}`, {
        method: 'GET',
        headers: HEADERS
    });
    let cart = await res.json();
    console.log('Cart Status:', cart.success);

    if (cart.data) {
        console.log('Cart Items:', JSON.stringify(cart.data.items, null, 2));

        if (cart.data.items.length === 0) {
            console.log('\n[CRITICAL] Backend returned empty items list.');
        } else {
            console.log('\n[SUCCESS] Backend returned persisted items!');
        }
    } else {
        console.log('No data in cart response.');
    }
}

debugCart();
