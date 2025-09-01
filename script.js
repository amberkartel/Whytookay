let handler = PaystackPop.setup({
  key: 'pk_live_b74b2d92842a32feda36c2d4cd98dc50d2944c12', // your live public key
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