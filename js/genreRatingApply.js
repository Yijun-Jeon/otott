let genreList = ['romance', 'comedy', 'horror', 'sf', 'history', 'family'];
let products = [];
// 문서의 로드가 완료되었을 때 실행 처리
$(document).ready(function () {
  for (var i = 0; i < 6; i++) {
    // 각 ott별 차트 1~20위까지의 요소 html 자동 삽입
    // 1~20위까지의 요소 내용 로컬 스토리지 기반 자동 반영
    let products = [];
    for (var j = 1; j <= 10; j++) {
      var productId = genreList[i] + '-' + j;
      var product = JSON.parse(localStorage.getItem(productId));
      var productInfo = JSON.parse(localStorage.getItem(product.title));
      products.push(productInfo);

      products = products.sort((a, b) => {
        var arating = a.rating;
        var brating = b.rating;
        var aStart = arating.indexOf('★') + 1;
        var aEnd = arating.indexOf('(');
        var bStart = brating.indexOf('★') + 1;
        var bEnd = brating.indexOf('(');
        console.log(arating.substring(aStart, aEnd));
        var aFloat = parseFloat(arating.substring(aStart, aEnd));
        var bFloat = parseFloat(brating.substring(bStart, bEnd));
        console.log(aFloat);
        console.log(bFloat);
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
