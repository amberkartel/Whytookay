// ------------------- Paystack Payment -------------------
const payButton = document.getElementById('payButton');

payButton.addEventListener('click', () => {
  let handler = PaystackPop.setup({
    key: 'pk_live_b74b2d92842a32feda36c2d4cd98dc50d2944c12', // live public key
    email: 'customer@email.com', // optionally dynamic
    amount: 1000000, // ₦10,000 in kobo
    currency: 'NGN',
    ref: '' + Math.floor((Math.random() * 1000000000) + 1),
    callback: function(response){
      alert('Payment successful! Reference: ' + response.reference);
    },
    onClose: function(){
      alert('Transaction was not completed.');
    }
  });
  handler.openIframe();
});

// ------------------- 3D Scroll Floating -------------------
const floats = document.querySelectorAll('.float');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  floats.forEach((el, i) => {
    const speed = (i + 1) * 0.3; 
    el.style.transform = `translateY(${scrollY * speed}px) rotateY(${scrollY * speed}deg) rotateX(${scrollY * speed / 2}deg)`;
  });
});