// ------------------- Paystack Payment -------------------
const payButton = document.getElementById('payButton');

payButton.addEventListener('click', () => {
  let handler = PaystackPop.setup({
    key: 'pk_live_b74b2d92842a32feda36c2d4cd98dc50d2944c12',
    email: 'customer@email.com',
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

// ------------------- Floating + 3D Scroll & Mouse -------------------
const floats = document.querySelectorAll('.float');

// Save initial float positions
const floatOffsets = [];
floats.forEach((el) => {
  const style = window.getComputedStyle(el);
  const matrix = new WebKitCSSMatrix(style.transform);
  floatOffsets.push({x: matrix.m41, y: matrix.m42, z: 0});
});

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  floats.forEach((el, i) => {
    const speed = (i + 1) * 0.15; // subtle scroll
    const rotateMultiplier = (i + 1) * 0.5; // gentle rotation
    el.style.transform = `translateY(calc(${floatOffsets[i].y}px + ${scrollY * speed}px)) rotateY(${scrollY * rotateMultiplier}deg) rotateX(${scrollY * rotateMultiplier/2}deg)`;
  });
});

// Gentle mouse interaction without breaking float
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX - window.innerWidth / 2) / 150;
  const y = (e.clientY - window.innerHeight / 2) / 150;
  floats.forEach((el, i) => {
    el.style.transform += ` translateX(${x*(i+1)}px) translateY(${y*(i+1)}px)`;
  });
});