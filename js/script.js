"use stricth";

window.addEventListener('DOMContentLoaded', () => {
    
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
});