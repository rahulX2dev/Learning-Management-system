const Razorpay = require('razorpay');
console.log('Razorpay imported successfully');
try {
    const instance = new Razorpay({ key_id: 'test', key_secret: 'test' });
    console.log('Razorpay instance created');
} catch (e) {
    console.error(e);
}
