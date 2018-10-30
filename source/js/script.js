/*находим в разметке блок меню, которое нам нужно скрыть, если работает js, записывам его в переменную*/
var mainMenu = document.querySelector(".main-menu");
/*находим в разметке кнопку, клик по которой покажет меню, записывам её в переменную*/
var sandwichButton = document.querySelector(".sandwich-button");
var myMap;
var defaultCenter = [59.9386,30.3231];
var defaultZoom = 17;
var buttonsOrder = document.querySelectorAll(".product__button--order");
var buttonAllProducts = document.querySelector(".button--gray");
var additionalOrder = document.querySelectorAll(".additional-item__button");
var sandwich = document.querySelector(".sandwich-button__ham");

function onOrderClick (evt) {
  evt.preventDefault();
  console.log("open modal window: make the order");
}

/*функция для того, чтобы при изменении размера вьюпорта карта менялась не множество раз, а один раз при окончательном изменении ширины окна*/
function debounce(f, ms) {
  var timer = null;

  return function () {
    var args = arguments;

    var onComplete = function() {
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

/*пришлось это прописывать, так как у svg нет classList в ie11*/
function switchSvgClass(element) {
  var activeClass = "sandwich-button__ham--active";
  var className = element.getAttribute("class");
  var toSet = "sandwich-button__ham";
  /*если нет активного класса --active, то дополнить toSet еще одним классом под переменной activeClass*/
  if (!className.match(activeClass)) {
    toSet += " " + activeClass;
  }
  element.setAttribute("class", toSet);
}

/*если js работает, то навешивается класс для сокрытия менюшки*/
mainMenu.classList.add("main-menu--javascript-work");

/*если js работает, то навешивается класс для показа сэндвич-кнопки*/
sandwichButton.classList.add("sandwichButton--javascript-work");

/*ловим клик (событие) по кнопке открытия меню, которую мы записали ранее в переменную sandwichButton*/
sandwichButton.addEventListener("click", function (evt) {
  /*отменяем стандартное действие при нажатии на кнопку*/
  evt.preventDefault();
  /*добавляем сэндвичу класс, чтобы осуществить превращение в крестик*/
  switchSvgClass(sandwich);
  /*с помощью метода classList.toggle добавляем новый класс к менюшке по клику на кнопку и удаляем по второму клику*/
  mainMenu.classList.toggle("main-menu--show");
});

/*если у нас есть эта переменная на странице, то делать функцию*/
if (buttonAllProducts) {
  buttonAllProducts.addEventListener("click", function (evt) {
    evt.preventDefault();
    console.log("show all products");
  });
}

/*это событие срабатывает, только когда загрузятся все DOM-элементы*/
document.addEventListener("DOMContentLoaded", function(evt) {
  ymaps.ready(initMap);
  /*слушаем изменение размера окна, при изменении применяем переменную handleResizeDebounced*/
  window.addEventListener("resize", handleResizeDebounced);

  /*так как у нас несколько кнопок по которым должно открываться одинаковое модальное окно, то делаем цикл, в котором устанавливаем переменную i, которая изначально у нас = 0, условие цикла: пока i не станет меньше buttonsOrder, прогресс: i увеличивается на 1*/
  for (var i = 0; i < buttonsOrder.length; i++) {
    buttonsOrder[i].addEventListener("click", onOrderClick);
  };

  for (var i = 0; i < additionalOrder.length; i++) {
    additionalOrder[i].addEventListener("click", onOrderClick);
  };
});
