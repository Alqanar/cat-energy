/*находим в разметке блок меню, которое нам нужно скрыть, если работает js, записывам его в переменную*/
var mainMenu = document.querySelector(".main-header__main-menu");
/*находим в разметке кнопку, клик по которой покажет меню, записывам её в переменную*/
var sandwichButton = document.querySelector(".sandwich-button");
var myMap;
var defaultCenter = [59.9386,30.3231];
var defaultZoom = 17;

/*функция для того, чтобы при изменении размера вьюпорта карта менялась не множество раз, а один раз при окончательном изменении ширины окна*/
function debounce(f, ms) {
  var timer = null;

  return function () {
    var args = arguments;

    const onComplete = function() {
      f.apply(this, args);
      timer = null;
    };

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(onComplete, ms);
  };
}

/*функция для изменения отображения карты (центра и зума) при изменении ширины вьюпорта*/
function handleResize() {
  var width = window.innerWidth;

  if (width < 768) {
    myMap.setZoom(defaultZoom);
    myMap.setCenter(defaultCenter);
  }
  else if (width < 1300) {
    myMap.setZoom(18);
    myMap.setCenter(defaultCenter);
  }
  else {
    myMap.setZoom(defaultZoom);
    myMap.setCenter([59.9391,30.3193]);
  }
}

var handleResizeDebounced = debounce(handleResize, 1000);

function initMap() {
  myMap = new ymaps.Map("map", {
    center: defaultCenter,
    zoom: defaultZoom,
    controls: []
  });
  var myPlacemark = new ymaps.Placemark([59.9386,30.3231], {
    hintContent: "Cat-Energy",
  });
  myMap.geoObjects.add(myPlacemark);
  handleResize();
}

/*если js работает, то навешивается класс для сокрытия менюшки*/
mainMenu.classList.add("main-menu--javascript-work");

/*ловим клик (событие) по кнопке открытия меню, которую мы записали ранее в переменную sandwichButton*/
sandwichButton.addEventListener("click", function (evt) {
  /*отменяем стандартное действие при нажатии на кнопку*/
  evt.preventDefault();
  /*с помощью метода classList.toggle добавляем новый класс к менюшке по клику на кнопку и удаляем по второму клику*/
  mainMenu.classList.toggle("main-menu--show");
});

/*это событие срабатывает, только когда загрузятся все DOM-элементы*/
document.addEventListener("DOMContentLoaded", function(evt) {
  ymaps.ready(initMap);
  /*слушаем изменение размера окна, при изменении применяем переменную handleResizeDebounced*/
  window.addEventListener("resize", handleResizeDebounced);
});
