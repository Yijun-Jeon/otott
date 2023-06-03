// 검색한 작품 정보를 href로 설정해주는 역할

$(document).ready(function () {
  // 기본 폼 제출 동작 제거
  document
    .getElementById('search-form')
    .addEventListener('submit', function (event) {
      event.preventDefault();
    });

  $('.input-search-submit').click(function () {
    event.preventDefault(); // 기본 동작 방지
    // 하위 태그 div의 class 속성 가져오기
    var value = document.getElementsByClassName('input-search')[0].value;
    window.location.href = `product.html#${value}`;
    if ($('body').attr('class') == 'product-body') {
      setTimeout(function () {
        location.reload();
      }, 100);
    }
  });
});
