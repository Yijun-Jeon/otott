$(window).load(function () {
  const elements = document.querySelectorAll('.rank');
  elements.forEach((element, index) => {
    var product = JSON.parse(localStorage.getItem('ott' + (index + 1)));
    var productId = 'ott' + (index + 1);
    document.getElementById(productId + '-text').innerHTML = product.title;
    document.getElementById(productId + '-img').src = product.imgSrc;
  });
});
