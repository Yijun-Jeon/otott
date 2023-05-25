$(document).ready(function () {
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
});
