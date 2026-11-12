// Дополнительные языки: TypeScript (30 уроков, с исправленным синтаксисом)
if (typeof LANGS !== 'undefined') {
  LANGS.push(
    {id:'typescript',name:'TypeScript',color:'#3178c6',on:'#fff',tag:'JavaScript с защитой типов',about:'Строгий суперсет JavaScript от Microsoft. Ошибки ловятся еще до запуска программы.',note:'Запуск: ts-node файл.ts',file:['main.ts'],
     lessons:[
       ['Привет, мир','const msg: string = "Привет, мир!";\nconsole.log(msg);','Обычный JavaScript, но с жестким указанием типов данных.'],
       ['Комментарии','// Однострочный\n/* Многострочный */\nconsole.log("Код");','Обычные пояснения для кода.'],
       ['Базовые типы','const name: string = "Аня";\nconst age: number = 20;\nconst isOnline: boolean = true;\nconsole.log(name, age, isOnline);','Основные примитивные типы данных в TS.'],
       ['Массивы и кортежи','const nums: number[] = [1, 2, 3];\nconst user: [string, number] = ["Аня", 20];\nconsole.log(nums, user[0]);','Массивы однотипных данных и фиксированные кортежи (tuple).'],
       ['Интерфейсы (Interfaces)','interface User {\n    name: string;\n    age: number;\n    city?: string;\n}\nconst u: User = { name: "Аня", age: 20 };\nconsole.log(u.name);','Интерфейсы описывают форму и структуру объектов.'],
       ['Типы (Type Aliases)','type ID = string | number;\nconst userId: ID = "abc-123";\nconsole.log(userId);','Создание собственных имен для типов или объединений.'],
       ['Объединения (Union Types)','function printId(id: number | string) {\n    console.log(`ID: ${id}`);\n}\nprintId(101);\nprintId("A-5");','Параметр может принимать несколько разных типов данных.'],
       ['Функции и типы','function add(a: number, b: number): number {\n    return a + b;\n}\nconst res = add(5, 10);','Явное указание типов параметров и возвращаемого значения функции.'],
       ['Стрелочные функции','const multiply = (x: number, y: number): number => x * y;\nconsole.log(multiply(3, 4));','Короткий синтаксис функций со строгой типизацией.'],
       ['Условия if и сужение','function process(val: string | number) {\n    if (typeof val === "string") {\n        console.log(val.toUpperCase());\n    } else {\n        console.log(val.toFixed(2));\n    }\n}','TS автоматически понимает тип после проверки (Type Narrowing).'],
       ['Перечисления Enum','enum Direction { Up, Down, Left, Right }\nconst move: Direction = Direction.Up;\nconsole.log(move);','Набор именованных числовых или строковых констант.'],
       ['Классы','class Animal {\n    constructor(public name: string) {}\n    move(distance: number = 0) {\n        console.log(`${this.name} прошел ${distance}м.`);\n    }\n}\nnew Animal("Пес").move(10);','ООП в TS с сокращенным объявлением полей через конструктор.'],
       ['Модификаторы доступа','class Car {\n    private speed: number = 0;\n    public accelerate() { this.speed += 10; }\n}\nnew Car().accelerate();','Управление видимостью свойств (public, private, protected).'],
       ['Генерики (Generics)','function identity<T>(arg: T): T {\n    return arg;\n}\nconst output = identity<string>("строка");\nconsole.log(output);','Создание универсальных компонентов, работающих с любыми типами.'],
       ['Утверждения типов (Type Assertion)','const input = document.getElementById("input") as HTMLInputElement;\ninput.value = "Привет";','Явное указание компилятору точного типа элемента.'],
       ['Утилитарные типы: Partial','interface Todo {\n    title: string;\n    desc: string;\n}\nconst updateTodo = (todo: Partial<Todo>) => {};\nupdateTodo({ title: "Новый заголовок" });','Partial делает все поля интерфейса необязательными.'],
       ['Утилитарные типы: Readonly','interface User {\n    readonly id: number;\n    name: string;\n}\nconst u: User = { id: 1, name: "Иван" };','Защита полей объекта от случайного изменения.'],
       ['Опциональная цепочка (?.)','interface Profile { address?: { city?: string } }\nconst p: Profile = {};\nconsole.log(p.address?.city);','Безопасный доступ к вложенным свойствам без падений.'],
       ['Оператор нулевого слияния (??)','const input: string | null = null;\nconst name: string = input ?? "Гость";\nconsole.log(name);','Подстановка значения по умолчанию, если слева null или undefined.'],
       ['Тип Any и Unknown','let a: any = 4;\na = "теперь строка";\nlet u: unknown = 5;','any отключает проверку типов, unknown требует предварительной проверки.'],
       ['Never и Void','function fail(msg: string): never {\n    throw new Error(msg);\n}\nfunction logMsg(): void {\n    console.log("Лог");\n}','void означает отсутствие возврата, never — что функция никогда не завершится нормально.'],
       ['Тип Record','const scores: Record<string, number> = {\n    "Аня": 95,\n    "Иван": 88\n};\nconsole.log(scores["Аня"]);','Удобная типизация словарей с фиксированными типами ключей и значений.'],
       ['Mapped Types','type OptionsFlags<T> = { [Property in keyof T]: boolean };\ninterface Features { darkMode: boolean; }\nconst f: OptionsFlags<Features> = { darkMode: true };','Создание новых типов на основе трансформации существующих.'],
       ['Пространства имен','namespace Tools {\n    export function log(msg: string) { console.log(msg); }\n}\nTools.log("Привет");','Группировка логически связанных функций и типов.'],
       ['Работа с DOM','const btn = document.querySelector("button")!;\nbtn.addEventListener("click", (e: MouseEvent) => {\n    console.log(e.clientX);\n});','Типизированная работа с элементами веб-страницы.'],
       ['Асинхронность (Promise)','const fetchUser = async (id: number): Promise<{name: string}> => {\n    return { name: "Аня" };\n};\nfetchUser(1).then(u => console.log(u.name));','Строгая типизация асинхронных функций и промисов.'],
       ['Типизация модулей','export interface Item { id: number }\nconst item: Item = { id: 1 };','Разделение кода на файлы с экспортом и импортом типов.'],
       ['Перегрузка функций','function makeDate(timestamp: number): Date;\nfunction makeDate(m: number, d: number, y: number): Date;\nfunction makeDate(mOrTs: number, d?: number, y?: number) {\n    return new Date();\n}','Задание нескольких вариантов сигнатур для одной функции.'],
       ['Кастомные Type Guards','function isString(val: any): val is string {\n    return typeof val === "string";\n}\nconst x: unknown = "тест";\nif (isString(x)) console.log(x.toUpperCase());','Создание собственных функций проверки типов для компилятора.'],
       ['Мини-проект: Менеджер задач','interface Task { id: number; title: string; done: boolean; }\nconst tasks: Task[] = [{ id: 1, title: "Изучить TS", done: false }];\nconst addTask = (title: string) => tasks.push({ id: tasks.length + 1, title, done: false });\naddTask("Сделать проект");\nconsole.log(tasks);','Полноценная мини-структура приложения с интерфейсами и типизацией коллекций.']
     ]}
  );
}