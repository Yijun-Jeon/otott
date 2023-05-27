const { Builder, By, until } = require('selenium-webdriver'); //모듈 불러오기
const { Navigation } = require('selenium-webdriver/lib/webdriver');

// 시스템 잠시 멈추는 함수
function wait(sec) {
  let start = Date.now(),
    now = start;
  while (now - start < sec * 1000) {
    now = Date.now();
  }
}

// 해당 요소를 찾을 때까지 기다렸다가 반환
function find(driver, css) {
  return driver.wait(until.elementLocated(By.css(css)), 5000);
}
// 해당 요소를 모두 찾을 때까지 기다렸다가 반환
function findAll(driver, css) {
  return driver.wait(until.elementsLocated(By.css(css)));
}

// 임시
async function findProductException(driver, title) {
  await driver.get('https://pedia.watcha.com/ko-KR');

  // #### 검색바 ####
  var search = await driver.findElement(By.name('searchKeyword'));
  await search.sendKeys(title);
  await search.submit();

  // #### 검색한 첫 번째 작품 ####
  var product = find(
    driver,
    '#root > div > div.css-1xm32e0 > section > section > div.css-ipmqep-StyledTabContentContainer.e1szkzar3 > div.css-12hxjcc-StyledHideableBlock.e1pww8ij0 > section > section.css-1s4ow07 > div > div.css-awu20a > div > ul > li:nth-child(1)'
  );
  await product.click();

  // #### 작품 상단 제목 ####
  var titleP = await find(
    driver,
    '#root > div > div.css-1xm32e0 > section > div > div.css-10ofaaw > div > section > div.css-1p7n6er-Pane.e1svyhwg15 > div > div > div > div > h1'
  ).getText();
  return titleP;
}

const watcha = 'https://www.google.com';

(async function myFunction() {
  let driver = await new Builder().forBrowser('chrome').build(); //가상 브라우저 빌드
  try {
    await driver.get(watcha);

    var search = await driver.findElement(By.id('APjFqb'));
    var title = '1박 2일 시즌 1';
    await search.sendKeys(title + ' - 왓챠피디아');
    await search.submit();

    var firstResult = await findAll(
      driver,
      'div.Z26q7c.UK95Uc.jGGQ5e > div > a'
    );
    var aTagCnt = 0;
    for (; aTagCnt < 3; aTagCnt++) {
      var aHref = await firstResult[aTagCnt].getAttribute('href');
      if (aHref.indexOf('pedia.watcha.com') !== -1) {
        await firstResult[aTagCnt].click();
        break;
      }
    }

    // 왓챠피디아 url의 a태그를 찾지 못함 -> 왓챠피디아에서 직접 검색
    if (aTagCnt == 3) var titleP = findProductException(driver, title);
    else {
      try {
        // #### 작품 상단 제목 ####
        var titleP = await find(
          driver,
          '#root > div > div.css-1xm32e0 > section > div > div.css-10ofaaw > div > section > div.css-1p7n6er-Pane.e1svyhwg15 > div > div > div > div > h1'
        ).getText();
      } catch (error) {
        var titleP = findProductException(driver, title);
      }
    }

    // // #### 검색바 ####
    // var search = await driver.findElement(By.name('searchKeyword'));
    // await search.sendKeys('인터스텔라');
    // await search.submit();

    // // #### 검색한 첫 번째 작품 ####
    // var product = find(
    //   driver,
    //   '#root > div > div.css-1xm32e0 > section > section > div.css-ipmqep-StyledTabContentContainer.e1szkzar3 > div.css-12hxjcc-StyledHideableBlock.e1pww8ij0 > section > section.css-1s4ow07 > div > div.css-awu20a > div > ul > li:nth-child(1)'
    // );
    // await product.click();

    console.log('"title": ' + '"' + title + '",');

    // #### 작품 이미지 url ####
    var imgSrc = await find(driver, '.css-qhzw1o-StyledImg').getAttribute(
      'src'
    );
    console.log('"imgSrc": ' + '"' + imgSrc + '",');

    // #### 작품 상단 정보 ####
    var detail = await find(
      driver,
      '#root > div > div.css-1xm32e0 > section > div > div.css-10ofaaw > div > section > div.css-1p7n6er-Pane.e1svyhwg15 > div > div > div > div > div.css-11h0kfd-Detail.e1svyhwg18'
    ).getText();
    console.log('"detail": ' + '"' + detail + '",');

    // 개봉 예정 작품의 경우 평점이 없을 수 있으므로 에러 처리
    try {
      // #### 작품 상단 평점 ####
      var rating = await find(
        driver,
        '#root > div > div.css-1xm32e0 > section > div > div.css-10ofaaw > div > section > div.css-1p7n6er-Pane.e1svyhwg15 > div > div > div > div > div.css-og1gu8-ContentRatings.e1svyhwg20'
      ).getText();
      if (rating == ' ' || rating == '' || rating == null)
        rating = '평균 ★0.0 (0명)';
    } catch (error) {
      rating = '평균 ★0.0 (0명)';
    }
    console.log('"rating": ' + '"' + rating + '",');

    // #### 작품 상세 정보 ####
    var infoTitle = await find(driver, '.css-wvh1uf-Summary').getText();
    console.log('"infoTitle": ' + '"' + infoTitle + '",');

    // #### 더보기 버튼 클릭 ####
    var showInfo = await find(driver, '.css-1ugqy9j');
    await showInfo.click();

    // 새로운 작품의 경우 작품 내용이 없을 수 있으므로 에러 처리
    try {
      // #### 작품 내용 ####
      var info = await find(driver, '.css-17t919k-SummaryDetail').getText();
    } catch (error) {
      info = '-';
    }
    console.log('"info": ' + '"' + info + '",');
    await new Navigation(driver).back();

    // #### 감상 가능한 곳 ####
    var ottList = [];
    var externalServiceTitles = await driver.findElements(
      By.className('externalServiceTitles')
    );
    for (var i = 0; i < externalServiceTitles.length; i++) {
      ottList.push(
        await externalServiceTitles[i].findElement(By.css('div')).getText()
      );
    }
    // 빈 문자열 제거
    ottList = ottList.filter(function (element) {
      return element !== '';
    });
    console.log('"ottList": ' + ottList);
  } finally {
    // 가상 브라우저 종료
    await driver.quit();
  }
})();
