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

        render() {              //Метод для создания карточки
            const element = document.createElement('div'); //Создаётся переменная с дивом

            if (this.classes.length == 0) {         //Проверкка, передавались-ли классы клиентом.
                this.element = 'menu__item';        //Назначение класса по умолчанию.
                element.classList.add(this.element);//Добавление класса по умолчанию к элементу.
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

    //Применяем созданный класс
    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        `.menu .container`,
        /* 'menu__item' */
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        14,
        `.menu .container`,
        'menu__item'
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        21,
        `.menu .container`,
        'menu__item',
        'big'
    ).render();

    //Код для отправки информации из форм на сервер (php)
    const forms = document.querySelectorAll('form'); //Получаем все формы по тегу form

    const message = { //Создаём объект который будет содержать различные фразы для клиента
        loading: 'img/form/spinner.svg',
        success: 'Спасибо, скоро мы с Вами свяжемся',
        fail: 'Что-то пошло не так'
    };

    forms.forEach(item => { //при помощи цикла применяем функцию postData к каждой форме
        postData(item);
    });

    //Функция отвечающая за постинг данных
    function postData(form) {
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

            const formData = new FormData(form);    //Создаём перемунную, в которую помещяем конструктор FormData. FormData - это специальный объект, который позволяет собрать все данные с определённой формы, которую заполнил пользователь.

            const object = {};                      //Создаём объект, в который будем помещать полученные данные для дальнейшей конвертации в формат JSON
            formData.forEach(function(value, key){  //Перебираем formData
                object[key] = value;                //Обращаемся к пустому объекту object и передаём в него данные. В итоге получается обычный объект, который можно свободно конвертировать в JSON
            });

            //Fetch API предоставляет интерфейс JS для работы с запросами и ответами HTTP. Он также предоставляет глобальный метод fetch() (en-US), который позволяет легко и логично получать ресурсы по сети асинхронно.
            //Сам fetch запрос. FETCH работает на промисах (Promise)
            fetch('server.php', { //Настройки запроса указываются в объекте после URL. В этом объекте должно быть минимум 2 свойства. Method и Body
                method: 'POST',                                   //Метод POST или GET
                body: JSON.stringify(object),                     //Body. Указали, что отправляем.
                headers: {                                     //Headers. Заголовки желательно тоже всегда указывать, что бы было понятно, что мы отправляем.
                    'Content-type': 'application/json'
                }
            })
            .then(data => data.text())
            .then(data => { //Действия при удачно выполненном запросе
                console.log(data);
                showThaksModal(message.success);             //Выводим сообщение о успехе
                statusMessage.remove();                      //Удаление сообщения
            }).catch(() => { //Действия при неудачном запросе
                showThaksModal(message.fail);                //Выводим сообщение о ошибке
            }).finally(() => { //Действия в самом конце.
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

    fetch('db.json')                    //Обращаемся к файлу с БД
        .then(data => data.json())      //Переводим в обычный js объект
        .then(res => console.log(res)); //Получаем объект с данными, которые уже можно получить и использовать

});