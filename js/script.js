"use stricth";

window.addEventListener('DOMContentLoaded', () => {
    //Табы

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');


    function hideTabContent() { //функция для удаления контента в табе и смене класса
        tabsContent.forEach(item => {
            item.classList.add('hide');                     //добавил класс hide
            item.classList.remove('show', 'fade');          //убрал класс show
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active'); //убрал инлайн класс active.
        });
    }

    function showTabContent(i = 0) { //Если указать аргументом i = 0, тогда можно будет вызывать функцию уже без указания аргумента.
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent(); //Удалил контент всех табов.
    showTabContent();//Сделал активным только первый таб. Если бы в функции showTabContent не было бы прописанно i = 0, нужно было бы указывать 0 при вызове функции.

    //Создание события с делигированием, для переключения табов.
    tabsParent.addEventListener('click', (event) => {
        const target = event.target; //Для удобства event.target помещён в переменную. Так можно сэкономить время, при многократном использовании event.target
        if (target && target.classList.contains('tabheader__item')) { //Проверка, точно ли был клик на таб
            tabs.forEach((item, i) => { //перебор всех элементов
                if (target == item) {   //Если цель является перебераемым элементом
                    hideTabContent();   //Спрятать все табы
                    showTabContent(i);  //Показать таб, который совпал с целью клика.
                }
            });
        } 
    });

    //Таймер

    const deadLine = '2022-02-11'; //Установил дату окончания акции

    function getTimeRemaining(endTime) { //выясняем, сколько осталось времени
        const t = Date.parse(endTime) - Date.parse(new Date()); //Date.parse(endTime) - переводит установленную дату в миллисекунды. - Date.parse(new Date()) - узнаёт текущее время в миллисекундах и отнимает их от изначальной даты.
        const days = Math.floor(t / (1000 * 60 * 60 * 24)); //Деление t(разница в миллисекундах) на время одних суток. Так будет понятно, сколько прошло суток. Math.floor округляет полученное значение.
        const hours = Math.floor((t / (1000 * 60 * 60) % 24)); //Сколько прошло часов
        const minutes = Math.floor((t / 1000 / 60) % 60);       //Сколько прошло минут
        const seconds = Math.floor((t / 1000) % 60);            //Сколько прошло секунд

        return { //Полученные данные возвращаем в виде объекта, что бы они были доступны вне своей функции.
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) { //Функция для добавления 0 перед числами, которые меньше 10
        if (num >=0 && num <10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endTime) { //Функция для устанавления оставшегося времени на странице
        const timer = document.querySelector(selector),     //Переменная с родителем
              days = timer.querySelector('#days'),          //Переменная с днями 
              hours = timer.querySelector('#hours'),        //Переменная часами
              minutes = timer.querySelector('#minutes'),    //Переменная минутами
              seconds = timer.querySelector('#seconds'),    //Переменная секундами
              timeInterval = setInterval(updateClock, 1000);//Переменная для обновления часов каждые 1000 мс.

            updateClock(); //Эта функция сработает до timeInterval она только установит текущую дату. Добавленно для фикса бага. (при обновлении страницы на 1 сек видна дата установленная в вёрстке)

        function updateClock() { //Вложенная функция для обновления таймера
            const t = getTimeRemaining(endTime); //Получили разницу во времени

            days.innerHTML = getZero(t.days);        //Установили полученные дни в блок с ID days. Значение переданно вместе с функцией getZero, что бы для чисел меньше 10 подставились 0.
            hours.innerHTML = getZero(t.hours);      //Установили полученные часы в блок с ID hours.
            minutes.innerHTML = getZero(t.minutes);  //Установили полученные минуты в блок с ID minutes.
            seconds.innerHTML = getZero(t.seconds);  //Установили полученные секунды в блок с ID seconds.

            if (t.total <= 0) { //Проверка, если полученно время меньше или равно 0, интервал обновления будет отключён.
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadLine);

    //Modal window
    /* переменные */
    const modalTrigger = document.querySelectorAll('[data-modal]'), //2 кнопки "Связаться с нами"
          modalClose = document.querySelector('[data-close]'), //Закрывающий крестик
          modal = document.querySelector('.modal'); //Само модельное окно

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';//выключает прокрутку экрана
        clearInterval(modalTimerId);            //Отключение отсчёта до автоматического открытия модельного окна.
    }
    //Событие для появлени модельного окна
    modalTrigger.forEach(item => { //С помощью цикла forEach назначили событие на каждый элемент
        item.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = ''; //включает прокрутку экрана.
    }
    //Событие закрытия модельного окна
    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => { //Событие для закрытия модельного окна при нажатии на подложку
        if (e.target === modal) {
            closeModal();
        }
    });
    //Событие для закрытия модельного окна при нажатии Esc.
    document.addEventListener('keydown', (e) => { //У объекта event есть свойство code, с ним можно отслеживать код нажатой клавиши.
        if (e.code === "Escape" && modal.classList.contains('show')) { //Если нажат Esc и модельное окно активно, будет вызвана функция закрытия окна.
            closeModal();
        }
    });

   /*  const modalTimerId = setTimeout(openModal, 5000); */ //Переменная с таймером на 30 сек, через 30 сек откроется модельное окно для связи.

    //Код для открытия модельного окна при прокрутке до нижнего конца экрана.
    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) { //в конце условия добавлен -1 пиксель, для избежания бага, когда страница прокручена до конца, но окно не появилось
            openModal();
            window.removeEventListener('scroll', showModalByScroll); //Удаление события, что бы окно вылезло при прокрутке только 1 раз.
        }
    }
    window.addEventListener('scroll', showModalByScroll); //Назначение события открытия окна при полной прокрутке

    //Используем классы для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 71;
            this.changeToUAH();
        }

        changeToUAH() {         //метод для перевода валюты
            this.price = this.price * this.transfer;
        }

        render() {              //Метод для создания карточки
            const element = document.createElement('div'); //Создаётся переменная с дивом
            element.innerHTML = ` 
            <div class="menu__item">
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
            </div>
            `; //Вставляется шаблон

            this.parent.append(element); //Добавление дива на страницу
        }
    }

    //Применяем созданный класс
    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        `.menu .container`
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        14,
        `.menu .container`
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        21,
        `.menu .container`
    ).render();
});