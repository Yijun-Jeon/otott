// 문서의 로드가 완료되었을 때 실행 처리
$(document).ready(function () {
  // 차트 1~20위까지의 요소 html 자동 삽입
  for (i = 1; i <= 20; i++) {
    rankElement = `<a href='product.html'>
    <li class='rank'>
      <div class='pull-left-rank'>
        <img
          id='total${i}-img'
          class='poster-img'
          src='https://nujhrcqkiwag1408085.cdn.ntruss.com/static/upload/drama_poster_images/280x400/drama_102591_1681959812.jpg'
          alt=''
        />
        <span class='rank-number'>${i}</span>
        <span id='total${i}-text' class='title-text'>
          영화제목
        </span>
      </div>
      <div class='pull-right-rank'>
        <span class='rank-number'>임시</span>
      </div>
    </li>
  </a>`;

    document.getElementById('chart').innerHTML += rankElement;
  }

  // 1~20위까지의 요소 내용 로컬 스토리지 기반 자동 반영
  const elements = document.querySelectorAll('.rank');
  elements.forEach((element, index) => {
    var product = JSON.parse(localStorage.getItem('total' + (index + 1)));
    var productId = 'total' + (index + 1);
    document.getElementById(productId + '-text').innerHTML = product.title;
    document.getElementById(productId + '-img').src = product.imgSrc;
  });
});
