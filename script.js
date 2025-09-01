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

// Store initial positions
const floatOffsets = [];
floats.forEach((el) => {
  const rect = el.getBoundingClientRect();
  floatOffsets.push({x: rect.left, y: rect.top});
});

let floatStep = 0;

function animateFloats() {
  floatStep += 0.02; // controls smooth float
  const scrollY = window.scrollY;

  floats.forEach((el, i) => {
    const floatY = Math.sin(floatStep + i) * 10; // smooth floating
    const speed = (i + 1) * 0.15;               // scroll effect
    const rotateMultiplier = (i + 1) * 0.5;    // 3D rotation

    el.style.transform = `
      translateX(0px)
      translateY(${floatOffsets[i].y + scrollY * speed + floatY}px)
      rotateY(${scrollY * rotateMultiplier}deg)
      rotateX(${scrollY * rotateMultiplier / 2}deg)
    `;
  });

  requestAnimationFrame(animateFloats);
}

animateFloats();

// Gentle mouse reaction without breaking float
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX - window.innerWidth / 2) / 200; // subtle
  const y = (e.clientY - window.innerHeight / 2) / 200;

  floats.forEach((el, i) => {
    el.style.transform += ` translateX(${x*(i+1)}px) translateY(${y*(i+1)}px)`;
  });
});