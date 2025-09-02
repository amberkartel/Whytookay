// ------------------- Paystack -------------------
const payButton = document.getElementById('payButton');

payButton.addEventListener('click', () => {
  let handler = PaystackPop.setup({
    key: 'pk_live_b74b2d92842a32feda36c2d4cd98dc50d2944c12',
    email: 'customer@email.com',
    amount: 1000000, // ₦10,000 in kobo
    currency: 'NGN',
    ref: '' + Math.floor((Math.random() * 1000000000) + 1),
    callback: function(response){
      alert('Payment successful! Ref: ' + response.reference);
    },
    onClose: function(){
      alert('Transaction not completed.');
    }
  });
  handler.openIframe();
});

// ------------------- Floating + 3D -------------------
const floats = document.querySelectorAll('.float');

// Random initial positions
floats.forEach(el => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const size = 50 + Math.random() * 50; // 50-100px
  el.style.width = size + "px";
  el.dataset.origX = Math.random() * (vw - size);
  el.dataset.origY = Math.random() * (vh - size);
  el.style.left = el.dataset.origX + "px";
  el.style.top = el.dataset.origY + "px";
});

let floatStep = 0;

function animateFloats() {
  floatStep += 0.02;

  floats.forEach((el, i) => {
    const origX = parseFloat(el.dataset.origX);
    const origY = parseFloat(el.dataset.origY);

    const floatY = Math.sin(floatStep + i) * 10; // vertical float
    const floatX = Math.cos(floatStep + i/2) * 8; // horizontal float

    const rotateY = floatStep * (i+1) * 2; // rotation
    const rotateX = floatStep * (i+1) * 1.5;

    el.style.transform = `
      translate(${floatX}px, ${floatY}px)
      translate(${origX}px, ${origY}px)
      rotateY(${rotateY}deg)
      rotateX(${rotateX}deg)
    `;
  });

  requestAnimationFrame(animateFloats);
}

animateFloats();

// ------------------- Mouse Interaction -------------------
document.addEventListener('mousemove', (e) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const moveX = (e.clientX - centerX)/100;
  const moveY = (e.clientY - centerY)/100;

  floats.forEach((el, i) => {
    el.style.transform += ` translate(${moveX*(i+1)}px, ${moveY*(i+1)}px)`;
  });
});