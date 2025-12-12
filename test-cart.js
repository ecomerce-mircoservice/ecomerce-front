
const addToCart = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: 1, // Explicitly using ID 1 which we know exists
                productId: 1,
                quantity: 1
            })
        });

        const data = await response.json();
        console.log('Add Response:', JSON.stringify(data, null, 2));

        const verifyResponse = await fetch('http://localhost:8080/api/v1/cart/current?userId=1');
        const verifyData = await verifyResponse.json();
        console.log('Get Cart Response:', JSON.stringify(verifyData, null, 2));

    } catch (error) {
        console.error('Error:', error);
    }
};

addToCart();
