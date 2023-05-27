$(document).ready(function () {
  // 기본 폼 제출 동작 제거
  document
    .getElementById('search-form')
    .addEventListener('submit', function (event) {
      event.preventDefault();
    });

  $('.rank').click(function () {
    event.preventDefault(); // 기본 동작 방지
    // 하위 태그 div의 class 속성 가져오기
    var title = $(this).find('.title-text').text();
    window.location.href = `product.html#${title}`;
  });

  $('.ranking').click(function () {
    event.preventDefault(); // 기본 동작 방지
    // 하위 태그 div의 class 속성 가져오기
    var title = $(this).find('a').attr('title');
    window.location.href = `product.html#${title}`;
  });

  $('.input-search-submit').click(function () {
    event.preventDefault(); // 기본 동작 방지
    // 하위 태그 div의 class 속성 가져오기
    var value = document.getElementsByClassName('input-search')[0].value;
    window.location.href = `product.html#${value}`;
  });
});
