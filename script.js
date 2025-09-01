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

// ------------------- Floating + 3D -------------------
const floats = document.querySelectorAll('.float');
const floatOffsets = [];

// Store initial positions
floats.forEach((el) => {
  const rect = el.getBoundingClientRect();
  floatOffsets.push({x: rect.left, y: rect.top});
});

let floatStep = 0;

function animateFloats() {
  floatStep += 0.02; // controls float speed

  floats.forEach((el, i) => {
    const floatY = Math.sin(floatStep + i) * 10; // smooth floating
    const rotateMultiplier = (i + 1) * 0.5;      // subtle 3D rotation

    el.style.transform = `
      translateY(${floatOffsets[i].y + floatY}px)
      rotateY(${floatStep * rotateMultiplier}deg)
      rotateX(${floatStep * rotateMultiplier / 2}deg)
    `;
  });

  requestAnimationFrame(animateFloats);
}

animateFloats();

// Gentle mouse interaction
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX - window.innerWidth / 2) / 200;
  const y = (e.clientY - window.innerHeight / 2) / 200;

  floats.forEach((el, i) => {
    el.style.transform += ` translateX(${x * (i + 1)}px) translateY(${y * (i + 1)}px)`;
  });
});