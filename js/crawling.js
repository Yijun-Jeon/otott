const { Builder, By, Key, until } = require('selenium-webdriver'); //모듈 불러오기
const { Navigation } = require('selenium-webdriver/lib/webdriver');
const chrome = require('selenium-webdriver/chrome');
const productsJson = require('../data/products.json');
const chartJson = require('../data/chart.json');
const fs = require('fs'); // JSON 파일 작성 모듕

const url = 'https://m.kinolights.com/ranking/kino';
const watcha = 'https://pedia.watcha.com/ko-KR';

// 시스템 잠시 멈추는 함수
function wait(sec) {
  let start = Date.now(),
    now = start;
  while (now - start < sec * 1000) {
    now = Date.now();
  }
}

// 해당 요소를 찾을 때까지 기다렸다가 반환
function findEle(driver, css) {
  return driver.wait(until.elementLocated(By.css(css)));
}
// 해당 요소를 모두 찾을 때까지 기다렸다가 반환
function findEleAll(driver, css) {
  return driver.wait(until.elementsLocated(By.css(css)));
}

async function crawlProductInfo(driver, title) {
  await driver.get(watcha);

  // #### 검색바 ####
  var search = await driver.findElement(By.name('searchKeyword'));
  await search.sendKeys(title);
  await search.submit();

  // #### 검색한 첫 번째 작품 ####
  var product = findEle(
    driver,
    '#root > div > div.css-1xm32e0 > section > section > div.css-ipmqep-StyledTabContentContainer.e1szkzar3 > div.css-12hxjcc-StyledHideableBlock.e1pww8ij0 > section > section.css-1s4ow07 > div > div.css-awu20a > div > ul > li:nth-child(1)'
  );
  await product.click();

  // #### 작품 상단 제목 ####
  var title = await findEle(
    driver,
    '#root > div > div.css-1xm32e0 > section > div > div.css-10ofaaw > div > section > div.css-1p7n6er-Pane.e1svyhwg15 > div > div > div > div > h1'
  ).getText();

  // #### 작품 이미지 url ####
  var imgSrc = await findEle(driver, '.css-qhzw1o-StyledImg').getAttribute(
    'src'
  );

  // #### 작품 상단 정보 ####
  var detail = await findEle(
    driver,
    '#root > div > div.css-1xm32e0 > section > div > div.css-10ofaaw > div > section > div.css-1p7n6er-Pane.e1svyhwg15 > div > div > div > div > div.css-11h0kfd-Detail.e1svyhwg18'
  ).getText();

  // #### 작품 상단 평점 ####
  var rating = await findEle(
    driver,
    '#root > div > div.css-1xm32e0 > section > div > div.css-10ofaaw > div > section > div.css-1p7n6er-Pane.e1svyhwg15 > div > div > div > div > div.css-og1gu8-ContentRatings.e1svyhwg20'
  ).getText();

  // #### 작품 상세 정보 ####
  var infoTitle = await findEle(driver, '.css-wvh1uf-Summary').getText();

  // #### 더보기 버튼 클릭 ####
  var showInfo = await findEle(driver, '.css-1ugqy9j');
  await showInfo.click();

  // #### 작품 내용 ####
  var info = await findEle(driver, '.css-17t919k-SummaryDetail').getText();
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

  return {
    title: title,
    imgSrc: imgSrc,
    detail: detail,
    rating: rating,
    infoTitle: infoTitle,
    info: info,
    ottList: ottList,
  };
}

let newProductsJson = [];
let newChartJson = [];
(async function myFunction() {
  let driver = await new Builder().forBrowser('chrome').build(); //가상 브라우저 빌드
  try {
    await driver.get(url);

    // 왓챠피디아 이중 크롤링을 위한 새로운 탭
    await driver.executeScript('window.open()');
    // 탭리스트 가져오기
    var tabs = await driver.getAllWindowHandles();
    // 인기차트 크롤링 시작
    await driver.switchTo().window(tabs[0]);

    // lazy load 방지 하단 스크롤
    await driver.executeScript(
      'window.scrollTo(0, document.body.scrollHeight);'
    );
    // 1~20위 차트 li 목록
    var products = await driver.findElements(By.className('rank'));
    console.log(products.length);

    for (i = 0; i < products.length; i++) {
      var imgTag = await products[i].findElement(By.tagName('img'));
      var titleTag = await products[i].findElement(By.className('title-text'));

      var imgSrc = await imgTag.getAttribute('src');
      var titleTxt = await titleTag.getText();

      var temp = productsJson.find((e) => e.title == titleTxt);
      // 기존 데이터에 없던 작품일 경우
      if (temp === undefined) {
        // 두 번째 탭으로 이동
        await driver.switchTo().window(tabs[1]);
        // 작품 정보 이중 크롤링 후 기록
        var product = await crawlProductInfo(
          driver,
          titleTxt.replace('시즌', '')
        );
        await newProductsJson.push(product);
        // 키노라이츠 탭으로 다시 이동
        await driver.switchTo().window(tabs[0]);
        // 기존 데이터에 있던 작품일 경우
      } else {
        newProductsJson.push(temp);
      }
      // 순위 기록
      newChartJson.push({
        title: titleTxt,
        imgSrc: imgSrc,
      });
    }

    // 추출한 차트 목록 json으로 작성
    fs.writeFile(
      './data/chart.json',
      JSON.stringify(newChartJson),
      function (err) {
        console.log('실시간 통합 차트 json 파일 생성 완료');
      }
    );
    // 변경한 작품 목록 json으로 작성
    fs.writeFile(
      './data/products.json',
      JSON.stringify(newProductsJson),
      function (err) {
        console.log('작품 목록 json 파일 변경 완료');
      }
    );
  } finally {
    // 가상 브라우저 종료
    await driver.quit();
  }
})();
