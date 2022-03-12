"use strict";

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

    const deadLine = '2022-05-11'; //Установил дату окончания акции

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

    modal.addEventListener('click', (e) => { //Событие для закрытия модельного окна при нажатии на подложку
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });
    //Событие для закрытия модельного окна при нажатии Esc.
    document.addEventListener('keydown', (e) => { //У объекта event есть свойство code, с ним можно отслеживать код нажатой клавиши.
        if (e.code === "Escape" && modal.classList.contains('show')) { //Если нажат Esc и модельное окно активно, будет вызвана функция закрытия окна.
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000); //Переменная с таймером.

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
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 71;
            this.changeToUAH();
        }

        changeToUAH() {         //метод для перевода валюты
            this.price = this.price * this.transfer;
        }

        render() {                                         //Метод для создания карточки
            const element = document.createElement('div'); //Создаётся переменная с дивом

            if (this.classes.length == 0) {                //Проверкка, передавались-ли классы клиентом.
                this.element = 'menu__item';               //Назначение класса по умолчанию.
                element.classList.add(this.element);       //Добавление класса по умолчанию к элементу.
            } else {
                this.classes.forEach(className => element.classList.add(className)); //Если клиент ввёл классы, добавление этих классов.
            }
            
            element.innerHTML = ` 
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
                `; //Вставляется шаблон

            this.parent.append(element); //Добавление дива на страницу
        }
    }


    const getResource = async (url) => {              //Создаём переменную с функцией, которая будет отвечать за получение данных из БД. Async перед аргументами используется в паре с await, что бы наш асинхронный код обязательно дождался загрузки другого кода. await указываем в коде, который нужно дождаться.
        const res = await fetch(url);                 //Поскольку мы только получаем данные из БД, найтройки запроса можно не указывать, url достаточно.

        if (!res.ok) {                                                        //Проверка, для устранения бага, когда fetch не фиксирует ошибку.
            throw new Error(`Could not fetch ${url}, status: ${res.status}`); //throw позволяет генерировать исключения, определяемые пользователем. Конструктор Error создаёт объект ошибки. Экземпляры объекта Error выбрасываются при возникновении ошибок во время выполнения. Объект Error также может использоваться в качестве базового для пользовательских исключений. 
        }

        return await res.json();                      //Возвращаем данные res в формате json
    };

    getResource('http://localhost:3000/menu')             //Вызываем созданную функцию, для выгрузки данных из БД на страницу
        .then(data => {                                   //Назначаем обработку
            data.forEach(({img, altimg, title, descr, price}) => {               //Перебераем свойства массива и деструктуризируем его по отдельным частям
                new MenuCard(img, altimg, title, descr, price, ".menu .container").render();         //Конструктор new MenuCard() создаёт новую карточку на странице с переданными свойствами и при помощи метода render выкладываем товары на сайт. Последним аргументом у MenuCard указывается родитель, куда будем постить новую карточку
            });
        });

/*         //альтернативный вариант функции, которая будет постить данные
        getResource('http://localhost:3000/menu')
            .then(data => {
                createCard(data);
            });
        function createCard(data) {
            data.forEach(({img, altimg, title, descr, price}) => {
                const element = document.createElement('div');
                element.classList.add('menu__item');
                element.innerHTML = ` 
                    <img src=${img} alt=${altimg}>
                    <h3 class="menu__item-subtitle">${title}</h3>
                    <div class="menu__item-descr">${descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${price}</span> руб/день</div>
                    </div>
                `;

                document.querySelector('.menu .container').append(element);
            });
        } */

    //Код для отправки информации из форм на сервер (php)
    const forms = document.querySelectorAll('form'); //Получаем все формы по тегу form

    const message = { //Создаём объект который будет содержать различные фразы для клиента
        loading: 'img/form/spinner.svg',
        success: 'Спасибо, скоро мы с Вами свяжемся',
        fail: 'Что-то пошло не так'
    };

    forms.forEach(item => { //при помощи цикла применяем функцию postData к каждой форме
        bindPostData(item);
    });

    //Fetch API предоставляет интерфейс JS для работы с запросами и ответами HTTP. Он также предоставляет глобальный метод fetch() (en-US), который позволяет легко и логично получать ресурсы по сети асинхронно.
    //Сам fetch запрос. FETCH работает на промисах (Promise)

    const postData = async (url, data) => {                //Создаём переменную с функцией, которая будет отвечать за постинг данных. Async перед аргументами используется в паре с await, что бы наш асинхронный код обязательно дождался загрузки другого кода. await указываем в коде, который нужно дождаться.
        const res = await fetch(url, {                     //Создал переменную, в которую поместиться Promise от метода fetch, который посылает запрос на сервер
            method: 'POST',                                //Метод POST или GET
            body: data,                                    //Body. Указали, что отправляем.
            headers: {                                     //Headers. Заголовки желательно тоже всегда указывать, что бы было понятно, что мы отправляем.
                'Content-type': 'application/json'
            }
        });
        return await res.json();                           //Возвращаем данные res в формате json
    };

    //Функция отвечающая за постинг данных
    function bindPostData(form) {
        form.addEventListener('submit', (e) => { 
            e.preventDefault();                                 //используем событие, что бы отменить стандарное поведение браузера

            const statusMessage = document.createElement('img');//Создаём переменную, в которую будет помещёна картинка spinner.svg
            statusMessage.src = message.loading;                //Добавляем src атрибут.
            //Добавляем CSS стили, для корректного отображения svg файла со спиннером
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage); //Метод insertAdjacentElement позволяет вставить элемент в любое место страницы. первое свойство - куда вставляем, второе - что вставляем.         

            const formData = new FormData(form);    //Создаём перемунную, в которой будут данные форм. FormData - это специальный объект, который позволяет собрать все данные с определённой формы, которую заполнил пользователь.

            const json  = JSON.stringify(Object.fromEntries(formData.entries())); //Переменная для хранения и обработки данных с форм. Для дальгейшей передачи в БД
            //formData.entries() - превращает данные в массив с массивами
            //Object.fromEntries - превращает в классический объект
            //JSON.stringify - превращает в JSON формат

            //Вызываем функцию созданную в строке 233
            postData('http://localhost:3000/requests', json)   //url и body json(Куда и что отправляем)                      
            //Дальше начинаем обработку данных при помощи метода then, так как fetch возвращает Promise
            .then(data => {                                  //Действия при удачно выполненном запросе
                console.log(data);
                showThaksModal(message.success);             //Выводим сообщение о успехе
                statusMessage.remove();                      //Удаление сообщения
            }).catch(() => {                                 //Действия при неудачном запросе
                showThaksModal(message.fail);                //Выводим сообщение о ошибке
            }).finally(() => {                               //Действия в самом конце.
                form.reset();                                //Метод reset очищяет форму
            });
        });
    }
    
    //Функция для создания нового окна, вместо окна modal__dialog, с сообщением и картинкой для пользователя.
    function showThaksModal(message) {
        //Код для скрытия старого контента
        const prevModalDialog = document.querySelector('.modal__dialog'); //Создаём переменную в которую помещяем существующий modal__dialog.

        prevModalDialog.classList.add('hide');  //Добавил класс hide со свойством display: none, для скрытия окна modal__dialog.
        openModal(); //Функция openModal отвечает за открытие модельных окон

        //Код для создания нового контента
        const thanksModal = document.createElement('div'); //Создал новый блок
        thanksModal.classList.add('modal__dialog');        //Присвоил ему класс
        //Создаём шаблон для блока.
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal); //Добавляем созданный блок на страницу
        //Код для скрытия окна с благодарностью и активации изначального кона modal__dialog на случай, если клиент захочет вернуть на пару шагов и заполнить форму ещё раз
        setTimeout(() => {
            thanksModal.remove();                       //Удаляем блок с благодарностью
            prevModalDialog.classList.add('show');      //Добавляем класс show со свойством display: block.
            prevModalDialog.classList.remove('hide');   //Удаляем класс hide со свойством display: none.
            closeModal();                               //Закрытие окна с формой ввода контактов, что бы клиент увидел после блока с благодаоностью стартовую страницу, а не снова форму ввода.
        }, 4000);
    }

/* slick Слайдер */
    let slideIndex = 1; //Переменная для счётчика слайдов
    const slides = document.querySelectorAll('.offer__slide'),      //Переменная со всеми слайдами
            prev = document.querySelector('.offer__slider-prev'),   //Стрелка назад
            next = document.querySelector('.offer__slider-next'),   //Стрелка вперёд
            total = document.querySelector('#total'),               //Счётчик, показывает сколько всего слайдов
            current = document.querySelector('#current');           //Счётчик, показывает номер текущего слайда

    //Проверка, для установки максимального кол-ва слайдов
    if (slides.length < 10) {
        total.textContent = `0${slides.length}`; //для установки 0 перед числами, меньше 10
    } else {
        total.textContent = slides.length;
    }
     
    //Функция для показа слайдов
    function showSlides(n) {
        if (n > slides.length) {        //Если текущий номер слайда больше кол-ва самих фото
            slideIndex = 1;             //Включаем первый слайд
        }
        if (n < 1) {                    //Если текущий номер слайда принял отрицательное значение
            slideIndex = slides.length; //включаем последний слайд
        }

        slides.forEach(item => item.style.display = 'none'); //Перебором меняем инлайн стиль у каждого слайда, что бы их все скрыть.
        
        slides[slideIndex - 1].style.display = 'block'; //Включаем нужный слайд

        //Проверка, для установки номера текущего слайда
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }

    showSlides(slideIndex);

    function plusSlides(n) {        //Функция - счётчик слайдов. 
        showSlides(slideIndex += n);
    }

    prev.addEventListener('click', () => { //Событие для стрелки назад
        plusSlides(-1);                    //вызов функции с аргументом -1. В итоге уменьшит slideIndex на 1 и функцция showSlides покажет нужный слайд
    })

    next.addEventListener('click', () => { //Событие для стрелки вперёд
        plusSlides(1);                     //вызов функции с аргументом 1. В итоге увеличит slideIndex на 1 и функцция showSlides покажет нужный слайд
    })
});