// 1) 좌우 스크롤 기능
function scrollLeft(subclass) {
  var width = $('.ranking-box').width(); // window 창 변경될 때마다 이동되는 범위 조절을 위한 변수
  var container = $(`#${subclass}`).find('.ranking-listitem');
  var scrollPosition = container.scrollLeft();
  container.animate({ scrollLeft: scrollPosition - width }, 500);
}

function scrollRight(subclass) {
  var width = $('.ranking-box').width();
  var container = $(`#${subclass}`).find('.ranking-listitem');
  var scrollPosition = container.scrollLeft();
  container.animate({ scrollLeft: scrollPosition + width }, 500);
}

$(document).ready(function () {
  $('.btn-scroll-left').hover(
    function () {
      $(this).css('background-color', 'rgb(170, 137, 213)');
      $('.left').css('border-color', 'white');
    },
    function () {
      $(this).css('background-color', '');
      $('.left').css('border-color', '');
    }
  );

  $('.btn-scroll-right').hover(
    function () {
      $(this).css('background-color', 'rgb(170, 137, 213)');
      $('.right').css('border-color', 'white');
    },
    function () {
      $(this).css('background-color', '');
      $('.right').css('border-color', '');
    }
  );

  $('.btn-scroll-left').on('click', function () {
    var subclass = $(this).parent().attr('id');
    scrollLeft(subclass);
  });

  $('.btn-scroll-right').on('click', function () {
    var subclass = $(this).parent().attr('id');
    scrollRight(subclass);
  });
});

//-------------------------------------------------------------//
// function scrollDown() {
//   const windowHeight = $(window).height();
//   $("html, body").animate({ scrollTop: "+=" + windowHeight }, 500);
// }

function scrollDown(sectionId) {
  const sectionOffset = $(sectionId).offset().top;
  $('html, body').animate({ scrollTop: sectionOffset }, 500);
}

$(document).ready(function () {
  $('.btn-scroll-down').on('click', function () {
    scrollDown('#main-section1');
  });

  $('.btn-scroll-down').hover(
    function () {
      $(this).css('cursor', 'pointer');
    },
    function () {
      $(this).css('cursor', '');
    }
  );
});

$(document).ready(function () {
  $('#all-chart').on('click', function () {
    scrollDown('#main-section2');
  });
});

//-------------------------------------------------------------//
// 3) Top Button 기능
$(document).ready(function () {
  const $topBtn = document.getElementById('moveTopBtn');

  // 버튼 클릭 시 맨 위로 이동
  document.getElementById('moveTopBtn').onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
});

//-------------------------------------------------------------//

// 4) 하위바 펼치기 기능

// 줄바꿈 이벤트 감지(white-space: normal 속성으로 줄바꿈 발생 이벤트 감지 어려움)
// 대상 요소 크기 변경 감지
// 'ResizeObserver': DOM 요소 크기 변경 감지 API 사용> 비동기적으로 감지 콜백 함수 실행

let resizeObserver; // 전역변수로 설정
let lis; // li 요소들을 담을 변수

function initSubmenu() {
  const lineElement = document.querySelector('.submenu-list');
  try {
    lis = lineElement.querySelectorAll('li');
  } catch (error) {
    return;
  }

  resizeObserver = new ResizeObserver(() => {
    let nextLineFlag = false;

    for (let i = 0; i < lis.length - 1; i++) {
      const li = lis[i];
      const nextLi = lis[i + 1];

      if (li.offsetTop !== nextLi.offsetTop) {
        nextLineFlag = true;
      }

      if (nextLineFlag) {
        nextLi.classList.add('hide');
      }
    }
  });

  resizeObserver.observe(lineElement);
}

function openSubmenu() {
  const submenu = $('.submenu-list').find('li.hide');

  if (submenu.css('display') === 'none') {
    submenu.slideDown(500);
    $('#openSubmenu').text('▲');
  } else {
    submenu.slideUp(500);
    $('#openSubmenu').text('▼');
  }
}

$(document).ready(function () {
  initSubmenu();
  $(window).resize(function () {
    for (const li of lis) {
      li.classList.remove('hide');
    }
    initSubmenu();
  });
});
