// 로컬 스토리지애 등록된 작품 정보를 product.html과 연동하는 역할

OTTS = {
  넷플릭스: 'netflix',
  티빙: 'tving',
  웨이브: 'wavve',
  '디즈니+': 'disneyplus',
  왓챠: 'watcha',
};

$(document).ready(function () {
  const hash = decodeURI(window.location.hash).trim();
  const title = hash.substring(1).trim();

  const product = JSON.parse(localStorage.getItem(title));
  $('.product-img').attr('src', product.imgSrc);
  $('.product-rating').text(product.rating);
  $('.product-rating-graph').text(product.rating);
  $('.product-title').text(product.title);
  $('.graph_title').text(product.title);

  $('.product-detail').text(product.detail);
  $('.product-infoTitle').html(product.infoTitle.replaceAll('\n', '<br />'));
  $('.product-info').text(product.info);

  // 감상 가능한 ott 목록 div 자동 삽입
  product.ottList.forEach((element) => {
    ottElement = `<div class="product_section_third_platform">
                <a
                  href="https://www.${OTTS[element]}.com"
                  class="available_platform"
                >
                  <img
                    src="../images/ottList/${OTTS[element]}.png"
                    width="90"
                    height="90"
                    class="icon_img"
                  />
                  <span class="platform_text">${element}</span>
                </a>
              </div>`;
    document.getElementsByClassName(
      'product_section_third_contents'
    )[0].innerHTML += ottElement;
  });
});
