<?php 
$_POST = json_decode(file_get_contents("php://input"), true);   //Конструкция для декодирования всего, что приходит от клиента из JSON. (При работе с PHP кодом)
echo var_dump($_POST); //var_dump — Выводит информацию о переменной в виде строки