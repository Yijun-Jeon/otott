// 장르별 평점순 차트 정보를 반영하는 역할

let genreList = ['romance', 'comedy', 'horror', 'sf', 'history', 'family'];
let products = [];
// 문서의 로드가 완료되었을 때 실행 처리
$(document).ready(function () {
  for (var i = 0; i < 6; i++) {
    // 각 ott별 차트 1~20위까지의 요소 html 자동 삽입
    // 1~10위까지의 요소 내용 로컬 스토리지 기반 자동 반영
    let products = [];
    for (var j = 1; j <= 10; j++) {
      var productId = genreList[i] + '-' + j;
      var product = JSON.parse(localStorage.getItem(productId));
      var productInfo = JSON.parse(localStorage.getItem(product.title));
      products.push(productInfo);

      // 평점 높은 순으로 재정렬
      products = products.sort((a, b) => {
        var arating = a.rating;
        var brating = b.rating;
        var aStart = arating.indexOf('★') + 1;
        var aEnd = arating.indexOf('(');
        var bStart = brating.indexOf('★') + 1;
        var bEnd = brating.indexOf('(');
        var aFloat = parseFloat(arating.substring(aStart, aEnd));
        var bFloat = parseFloat(brating.substring(bStart, bEnd));
        if (aFloat > bFloat) {
          return -1;
        }
      });
    }

    for (var j = 1; j <= 10; j++) {
      var productInfo = products[j - 1];
      rankElement = `
    <li class="ranking">
      <a href="product.html" title="${productInfo.title}">
        <div class="ranking-icon">${j}</div>
        <img
          src="${productInfo.imgSrc}"
          alt="${j}th-poster"
        />
        <p>
          ${productInfo.title} <br />
          ${productInfo.detail} <br />
          ${productInfo.rating}
        </p>
      </a>
    </li>`;
      document.getElementsByClassName('ranking-listitem')[i].innerHTML +=
        rankElement;
    }
  }
});
