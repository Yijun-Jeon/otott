// 인기차트와 작품 정보를 크롤링 하는 역할

const { Builder, By, Key, until } = require('selenium-webdriver'); //모듈 불러오기
const { Navigation } = require('selenium-webdriver/lib/webdriver');
const chrome = require('selenium-webdriver/chrome');
const productsJson = require('../data/products.json');
const fs = require('fs'); // JSON 파일 작성 모듈

const kino = 'https://m.kinolights.com/ranking/kino';
const google = 'https://www.google.com';
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
  return driver.wait(until.elementLocated(By.css(css)), 10000);
}
// 해당 요소를 모두 찾을 때까지 기다렸다가 반환
function findEleAll(driver, css) {
  return driver.wait(until.elementsLocated(By.css(css)));
}

// 구글 검색을 통한 크롤링에 실패한 예외 작품 핸들링
async function findProductException(driver, title) {
  // 왓챠피디아 메인 사이트로 직접 이동
  await driver.get(watcha);

  // #### 검색바 ####
  var search = await driver.findElement(By.name('searchKeyword'));
  await search.sendKeys(title);
  await search.submit();

  // #### 검색한 첫 번째 작품 ####
  var product = await findEle(
    driver,
    '#root > div > div.css-1xm32e0 > section > section > div.css-ipmqep-StyledTabContentContainer.e1szkzar3 > div.css-12hxjcc-StyledHideableBlock.e1pww8ij0 > section > section.css-1s4ow07 > div > div.css-awu20a > div > ul > li:nth-child(1)'
  );
  await product.click();

  // #### 작품 상단 제목 ####
  var searchTitle = await findEle(
    driver,
    '#root > div > div.css-1xm32e0 > section > div > div.css-10ofaaw > div > section > div.css-1p7n6er-Pane.e1svyhwg15 > div > div > div > div > h1'
  ).getText();
  return searchTitle;
}

async function crawlProductInfo(driver, title) {
  var isError = false;
  await driver.get(google);

  // #### 구글 검색바 ####
  var search = await driver.findElement(By.id('APjFqb'));
  await search.sendKeys(title + ' - 왓챠피디아');
  await search.submit();

  // 모든 검색 결과 a 태그 추출
  var searchResults = await findEleAll(
    driver,
    'div.Z26q7c.UK95Uc.jGGQ5e > div > a'
  );
  var aTagCnt = 0;
  // 상위 3개의 검색 결과까지 검사
  for (; aTagCnt < 3; aTagCnt++) {
    var aHref = await searchResults[aTagCnt].getAttribute('href');
    // 왓챠피디아의 url을 가지지 않으면 pass
    if (aHref.indexOf('pedia.watcha.com') !== -1) {
      await searchResults[aTagCnt].click();
      break;
    }
  }

  var searchTitle;
  // 정상적으로 왓챠피디아의 결과를 찾음
  if (aTagCnt < 3) {
    // #### 작품 상단 제목 ####
    try {
      searchTitle = await findEle(
        driver,
        '#root > div > div.css-1xm32e0 > section > div > div.css-10ofaaw > div > section > div.css-1p7n6er-Pane.e1svyhwg15 > div > div > div > div > h1'
      ).getText();
      // 왓챠피디아의 url이지만 잘못된 사이트일 경우
    } catch (error) {
      isError = true;
    }
  }

  // 왓챠피디아 url의 검색 결과가 없음
  if (isError || aTagCnt == 3) {
    try {
      // 왓챠피디아에서 직접 검색
      searchTitle = await findProductException(driver, title);
    } catch (error) {
      // 왓챠피디아에서도 없는 작품일 경우 임시 데이터 지정
      searchTitle = 'crawlingFail';
    }
  }

  // 왓챠피디아 검색으로도 없는 작품일 경우 실패 데이터 반환
  if (searchTitle == 'crawlingFail') {
    console.log('failed to crawl the product of ', title);
    return {
      title: title,
      imgSrc: 'http://localhost:8080/images/footer/disney.png',
      detail: 'crawlingFail',
      rating: '평균 ★0.0 (0명)',
      infoTitle: 'crawlingFail',
      info: 'crawlingFail',
      ottList: [],
    };
  }

  try {
    // #### 작품 이미지 url ####
    var imgSrc = await findEle(driver, '.css-qhzw1o-StyledImg').getAttribute(
      'src'
    );
  } catch (error) {
    imgSrc = 'http://via.placeholder.com/640x480';
  }

  try {
    // #### 작품 상단 정보 ####
    var detail = await findEle(
      driver,
      '#root > div > div.css-1xm32e0 > section > div > div.css-10ofaaw > div > section > div.css-1p7n6er-Pane.e1svyhwg15 > div > div > div > div > div.css-11h0kfd-Detail.e1svyhwg18'
    ).getText();
  } catch (error) {
    detail = 'crawlingFail';
  }

  // 개봉 예정 작품의 경우 평점이 없을 수 있으므로 에러 처리
  try {
    // #### 작품 상단 평점 ####
    var rating = await findEle(
      driver,
      '#root > div > div.css-1xm32e0 > section > div > div.css-10ofaaw > div > section > div.css-1p7n6er-Pane.e1svyhwg15 > div > div > div > div > div.css-og1gu8-ContentRatings.e1svyhwg20'
    ).getText();
    if (rating == ' ' || rating == '' || rating == null)
      rating = '평균 ★0.0 (0명)';
  } catch (error) {
    rating = '평균 ★0.0 (0명)';
  }

  try {
    // #### 작품 상세 정보 ####
    var infoTitle = await findEle(driver, '.css-wvh1uf-Summary').getText();
  } catch (error) {
    infoTitle = 'crawlingFail';
  }

  // #### 더보기 버튼 클릭 ####
  var showInfo = await findEle(driver, '.css-1ugqy9j');
  await showInfo.click();

  // 새로운 작품의 경우 작품 내용이 없을 수 있으므로 에러 처리
  try {
    // #### 작품 내용 ####
    var info = await findEle(driver, '.css-17t919k-SummaryDetail').getText();
    await new Navigation(driver).back();
  } catch (error) {
    info = '-';
  }

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
    title: searchTitle,
    imgSrc: imgSrc,
    detail: detail,
    rating: rating,
    infoTitle: infoTitle,
    info: info,
    ottList: ottList,
  };
}

let newProductsJson = productsJson;
let newChartJson = [];

async function addToNewProductsJson(product, title) {
  // 왓챠피디아의 작품명으로 2차 기존 데이터 검사
  var temp = newProductsJson.find((e) => e.title == title);
  if (temp === undefined) {
    newProductsJson.push(product);
    console.log(title);
  } else console.log(title, ' existing!');
}

async function crawlChartInfo(driver, tabs, domain) {
  // 인기차트 크롤링 시작
  await driver.switchTo().window(tabs[0]);

  // lazy load 방지 하단 스크롤
  await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');

  // 1~20위 차트 li 목록
  var products = await findEleAll(driver, '.rank');
  console.log(products.length);

  for (i = 0; i < products.length; i++) {
    var imgTag = await products[i].findElement(By.tagName('img'));
    var titleTag = await products[i].findElement(By.className('title-text'));

    var imgSrc = await imgTag.getAttribute('src');
    var titleTxt = await titleTag.getText();

    var product;
    // 인기차트 상의 작품명으로 1차 기존 데이터 검사
    var temp = newProductsJson.find((e) => e.title == titleTxt);
    // 기존 데이터에 없던 작품일 경우
    if (temp === undefined) {
      // 두 번째 탭으로 이동
      await driver.switchTo().window(tabs[1]);
      // 작품 정보 이중 크롤링
      product = await crawlProductInfo(driver, titleTxt);
      // 작품 정보 기록
      await addToNewProductsJson(product, product.title);
      // 키노라이츠 탭으로 다시 이동
      await driver.switchTo().window(tabs[0]);
    } else if (temp.detail == 'crawlingFail') {
      // 기존 데이터에서 크롤링에 실패했던 작품일 경우
      await driver.switchTo().window(tabs[1]);
      product = await crawlProductInfo(driver, titleTxt);
      await addToNewProductsJson(product, product.title);
      await driver.switchTo().window(tabs[0]);
      console.log(titleTxt, ' re-crawling!');
    }
    // 기존 데이터에 있던 작품일 경우
    else {
      product = temp;
      console.log(titleTxt, ' existing!');
    }

    // 순위 기록
    newChartJson.push({
      domain: domain,
      title: product.title,
      imgSrc: imgSrc,
    });
  }
}

(async function myFunction() {
  let driver = await new Builder().forBrowser('chrome').build(); //가상 브라우저 빌드
  try {
    await driver.get(kino);

    // 왓챠피디아 이중 크롤링을 위한 새로운 탭
    await driver.executeScript('window.open()');
    // 탭리스트 가져오기
    var tabs = await driver.getAllWindowHandles();
    let domainList = [
      'total',
      'netflix',
      'tving',
      'wavve',
      'disney',
      'coupang',
      'watcha',
    ];
    for (var i = 1; i <= 7; i++) {
      console.log(domainList[i - 1], ' chart crawling start!!');
      let buttonSelector = `#contents > div.header-wrap > div.editor-wrap > div > button:nth-child(${i})`;
      let button = await findEle(driver, buttonSelector);
      await button.click();
      wait(1);
      await crawlChartInfo(driver, tabs, domainList[i - 1]);
      console.log(domainList[i - 1], ' chart crawling End!!');
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
