// 문서의 로드가 완료되었을 때 실행 처리
$(document).ready(function () {
  // 차트 1~20위까지의 요소 html 자동 삽입
  for (i = 1; i <= 20; i++) {
    var productId = 'total-' + i;
    var product = JSON.parse(localStorage.getItem(productId));
    rankElement = `<a href='product.html'>
    <li class='rank'>
      <div class='pull-left-rank'>
        <img
          id='${productId}-img'
          class='poster-img'
          src='${product.imgSrc}'
          alt=''
        />
        <span class='rank-number'>${i}</span>
        <span id='${productId}-text' class='title-text'>
          ${product.title}
        </span>
      </div>
      <div class='pull-right-rank'>
        <span class='rank-number'>임시</span>
      </div>
    </li>
  </a>`;

    document.getElementById('chart').innerHTML += rankElement;
  }
});
