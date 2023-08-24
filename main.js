/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/taskOne/GamePlay.js
class GamePlay {
  constructor() {
    this.boardSize = 4; // размер поля
    this.container = null; // для контейнера в DOM
    this.cells = []; // массив ячеек
    this.newGameListeners = [];
    this.cellClickListeners = [];
  }

  // присваиваем классу контейнер
  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  // проверка на наличие контейнера
  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }

  // отрисовка HTML
  drawUI() {
    this.checkBinding();
    this.container.innerHTML = `
      <H2>
        Игра с гоблинами
      </H2>
      <div class="goblin-img"></div>
      <div class="points">
        <div data-id="hit" class="point">Попаданий: <span>0</span></div>
        <div data-id="misses" class="point">Пропущено: <span>0</span></div>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
        <div data-id="gameOver" class="gameOver">Поражение! Вы пропустили слишком много гномов.</div>
      </div>
      <div class="controls">
        <button data-id="action-restart" class="btn">Новая игра</button>
      </div>
    `;
    this.container.classList.add('task');
    this.container.addEventListener('contextmenu', event => event.preventDefault()); // отключаем правую кнопку

    this.hitEl = this.container.querySelector('[data-id=hit] span'); // элемент попаданий
    this.missesEl = this.container.querySelector('[data-id=misses] span'); // элемент промахов
    this.gameOver = this.container.querySelector('[data-id=gameOver]'); // элемент поражения

    // события для кнопки "новая игра"
    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.newGameEl.addEventListener('mousedown', event => this.onNewGameClick(event));
    this.boardEl = this.container.querySelector('[data-id=board]'); // элемент игровое поля

    // добавляем ячейки игрового поля
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div'); // создаём див
      cellEl.classList.add('cell'); // добавляем класс div-у
      cellEl.addEventListener('mousedown', event => this.onCellClick(event)); // событие клика
      this.boardEl.appendChild(cellEl); // вставляем ячейку в дом
    }

    this.cells = Array.from(this.boardEl.children); // массив ячеек
  }

  // Add listener to "New Game" button click
  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

  // Add listener to mouse click for cell
  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }
  onNewGameClick(event) {
    // клик новая игра
    event.preventDefault();
    this.newGameListeners.forEach(o => o.call(null));
  }
  onCellClick(event) {
    // клик по ячейке
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellClickListeners.forEach(o => o.call(null, index));
  }
  cellActiveAdd(index) {
    // добавление гоблина
    const cell = this.cells[index];
    if (!cell) {
      return;
    }
    cell.classList.add('active');
  }
  cellActiveRemove(index) {
    // удаление гоблина
    const cell = this.cells[index];
    if (!cell) {
      return;
    }
    cell.classList.remove('active');
  }
  changeHit(points) {
    // изменение кол-ва попаданий
    this.hitEl.textContent = points;
  }
  changeMisses(points) {
    // изменение кол-ва промахов
    this.missesEl.textContent = points;
  }
  endGame() {
    // показывает табличку "проиграл"
    this.gameOver.style.display = 'flex';
  }
  startGame() {
    // убирает табличку "проиграл"
    this.gameOver.style.display = 'none';
  }
  clearHTML() {
    // очищаем container в DOM
    this.container.classList.remove('task');
    this.container.innerHTML = '';
  }
}
;// CONCATENATED MODULE: ./src/js/taskOne/randomСondition.js
/**
 *
 * @param lastCell последняя ячейка гоблина
 * @param boardSize размер игрового поля
 * @returns возвращает рандомный индекс для ячейки
 */
function randomСondition(lastCell, boardSize) {
  const rand = () => {
    // наугад число от 0 до максимально допустимого
    const random = Math.floor(Math.random() * boardSize ** 2);

    // если рандом совпадает с последней ячейкой, то перезапускаем rand
    if (random === lastCell) {
      return rand();
    }
    // возвращаем число в rand не равное lastCell
    return random;
  };
  // возвращаем новое рандомно допустимое число
  return rand();
}
;// CONCATENATED MODULE: ./src/js/taskOne/GameController.js

class GameController {
  constructor(gamePlay) {
    this.gamePlay = gamePlay; // класс который управляет DOM
    this.gameStarted = false; // индикатор начата игра или нет
    this.turn = true; // разрешён удар по гоблину или нет
  }

  init() {
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this)); // клик по кнопке новая игра
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this)); // клик по ячейкам
  }

  // кнопка новая игра
  onNewGameClick() {
    this.gamePlay.startGame(); // удалям окошко конца игры
    this.gamePlay.cellActiveRemove(this.lastCell); // удаляем гоблина
    this.lastCell = false; // последняя ячейка гоблина
    this.hits = 0; // кол-во попаданий по гоблину
    this.goblinPassed = 0; // кол-во появления гоблинов
    this.gameStarted = true; // идёт игра или нет

    this.gamePlay.changeHit(this.hits); // изменяем счётчик попаданий в DOM
    this.gamePlay.changeMisses(this.goblinPassed); // изменяем счётчик промахов в DOM

    this.interval(); // запускаем интервал
  }

  // клик по ячейкам
  onCellClick(index) {
    if (!this.gameStarted || !this.turn) {
      return;
    }
    if (this.lastCell === index) {
      this.hits += 1; // увеличиваем счётчик попаданий
      this.goblinPassed -= 1; // уменьшаем счётчик кол-во появления гоблинов
      this.gamePlay.changeHit(this.hits); // изменяем счётчик попаданий в DOM
      this.gamePlay.cellActiveRemove(this.lastCell); // удаляем гоблина
    }

    this.turn = false; // запрещаем удар по гному
  }

  // наугад появление гоблина
  goblinAppeared() {
    this.gameOver(); // проверка на поражение

    this.gamePlay.changeMisses(this.goblinPassed); // изменяем счётчик промахов в DOM
    this.goblinPassed += 1; // увеличиваем счётчик кол-во появления гоблинов

    this.gamePlay.cellActiveRemove(this.lastCell); // удаляем гоблина
    this.lastCell = randomСondition(this.lastCell, this.gamePlay.boardSize); // новая ячейка
    this.gamePlay.cellActiveAdd(this.lastCell); // добавляем гоблина

    this.turn = true; // разрешаем удар по гоблину
  }

  // интервальное появление гоблина
  interval() {
    clearInterval(this.timerID); // очищаем интервал
    this.timerID = setInterval(this.goblinAppeared.bind(this), 1000); // запускам интервал
  }

  // проверка на поражение
  gameOver() {
    if (this.goblinPassed >= 5 && this.gameStarted) {
      this.gamePlay.endGame();
      this.gameStarted = false;
      clearInterval(this.timerID); // очищаем интервал
    }
  }
}
;// CONCATENATED MODULE: ./src/js/taskTwo/TopTasksPlay.js
class TopTasksPlay {
  constructor() {
    this.container = null; // для контейнера в DOM
    this.btnPinnedListeners = [];
    this.submitListeners = [];
    this.valueListeners = [];
  }

  // присваиваем классу контейнер
  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  // проверка на наличие контейнера
  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }

  // отрисовка HTML
  drawUI() {
    this.checkBinding();
    this.container.innerHTML = `
      <H2>
        TOP Tasks
      </H2>
      <div class="top-tasks-container">
        <div class="top-tasks-container__header">TOP Tasks</div>
        <form data-id="filter" class="form">
          <input data-id="filter-text" class="field" name="filter-text" autocomplete="off">
          <button data-id="filter-text-add" class="filter-btn-add"></button>
        </form>
        <div class="top-tasks-container__header">Pinned</div>
        <div data-id="pinned" class="pinned">
        
        </div>
        <div class="top-tasks-container__header">All Task</div>
        <div data-id="all-task" class="pinned">

        </div>
      </div>
    `;
    this.container.classList.add('task');
    this.filter = this.container.querySelector('[data-id=filter]'); // элемент filter
    this.filterText = this.container.querySelector('[data-id=filter-text]'); // элемент filter-text
    this.pinnedEl = this.container.querySelector('[data-id=pinned]'); // элемент pinned
    this.allTaskEl = this.container.querySelector('[data-id=all-task]'); // элемент all-task

    this.filter.addEventListener('submit', event => this.onSubmit(event));
    this.filterText.addEventListener('input', event => this.onValue(event));
    this.filterText.addEventListener('focus', event => this.onFocusClear(event));
  }
  htmlTask(taskName, btnContent, element) {
    const div = document.createElement('div'); // создаём див
    div.innerHTML = `
      <div class="task-element-name">${taskName}</div>
      <button data-id="pinned-add" class="btn-pinned">${btnContent}</button>
    `;
    div.classList.add('task-element');
    div.querySelector('.btn-pinned').addEventListener('click', event => this.onBtnPinned(event));

    // return div;
    this[element].appendChild(div);
  }

  // Add listener to mouse click for cell
  addBtnPinnedListeners(callback) {
    this.btnPinnedListeners.push(callback);
  }

  // Add listener to mouse click for cell
  addSubmitListeners(callback) {
    this.submitListeners.push(callback);
  }

  // Add listener to mouse click for cell
  addValueListeners(callback) {
    this.valueListeners.push(callback);
  }

  // клик по btn-pinned
  onBtnPinned(event) {
    event.preventDefault();
    const btn = event.currentTarget;
    const {
      textContent
    } = btn.parentNode.querySelector('.task-element-name');
    this.btnPinnedListeners.forEach(o => o.call(null, textContent));
  }

  // отправка формы с текстом
  onSubmit(event) {
    event.preventDefault();
    const input = event.currentTarget.querySelector('[data-id=filter-text]');
    this.submitListeners.forEach(o => o.call(null, input.value));
    input.value = '';
  }

  // вводимый текст в инпут
  onValue(event) {
    event.preventDefault();
    const {
      value
    } = event.currentTarget;
    this.valueListeners.forEach(o => o.call(null, value));
  }

  // событие фокуса очищает текст и удаляет класс
  onFocusClear() {
    this.message('');
    this.errorInputRemove();
  }

  // очистка pinned и all-task
  clearTask() {
    this.pinnedEl.innerHTML = ''; // очистка pinned
    this.allTaskEl.innerHTML = ''; // очистка all-task
  }

  // вставка теста в pinned
  pinnedEmpty() {
    this.pinnedEl.innerHTML = `
      <div class="task-element-name">No pinned tasks</div>
    `;
  }

  // вставка теста в all Task
  allTaskEmpty() {
    let content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'No tasks';
    this.allTaskEl.innerHTML = `
      <div class="task-element-name"></div>
    `;
    this.allTaskEl.textContent = content;
  }

  // текст в инпуте с ошибкой
  message(text) {
    this.filterText.placeholder = text;
  }

  // добавляем инпуту класс ошибки
  errorInputAdd() {
    this.filterText.classList.add('error-add');
  }

  // удаляем инпуту класс ошибки
  errorInputRemove() {
    this.filterText.classList.remove('error-add');
  }
  clearHTML() {
    // очищаем container в DOM
    this.container.classList.remove('task');
    this.container.innerHTML = '';
  }
}
;// CONCATENATED MODULE: ./src/js/taskTwo/searchTask.js
// возвращает массив изменяя условие показа
// если задачи удовлетворяют поиск, то имеют статус показа
function searchTask(tasks, search) {
  const condition = Array.isArray(tasks);
  if (!condition) {
    throw new Error('not an array passed to searchTask');
  }
  const newArr = tasks;
  const searchText = search.toLowerCase();
  for (let i = 0; i < newArr.length; i += 1) {
    const nameText = newArr[i].name.toLowerCase();
    const coincidence = nameText.includes(searchText);
    if (coincidence) {
      newArr[i].show = true;
    }
    if (!coincidence) {
      newArr[i].show = false;
    }
  }
  return newArr;
}
;// CONCATENATED MODULE: ./src/js/taskTwo/checkStatus.js
// проверяет все ли задачи c одним статусом
function checkStatus(tasks, key, condition) {
  if (!Array.isArray(tasks)) {
    throw new Error('not an array passed to checkEmpty');
  }
  if (typeof condition !== 'boolean') {
    throw new Error('not an boolean passed to checkEmpty');
  }

  // если есть хотябы один статус pinned === condition, то истина
  for (let i = 0; i < tasks.length; i += 1) {
    if (tasks[i][key] === condition) {
      return true;
    }
  }
  return false; // если нет задач с pinned статусом === condition, то ложь
}
;// CONCATENATED MODULE: ./src/js/taskTwo/checkTask.js
// находит индекс по названию
function checkTask(tasks, taskName) {
  if (!Array.isArray(tasks)) {
    throw new Error('not an array passed to checkTask');
  }
  const index = tasks.findIndex(item => item.name === taskName);
  return index;
}
;// CONCATENATED MODULE: ./src/js/taskTwo/TopTasksControl.js



class TopTasksControl {
  constructor(topTasksPlay) {
    this.topTasksPlay = topTasksPlay; // класс который управляет DOM
    this.tasks = [{
      name: 'Сделать зарядку',
      pinned: false,
      show: true
    }, {
      name: 'Приготовить завтрак',
      pinned: true,
      show: true
    }, {
      name: 'Купить мороженное',
      pinned: false,
      show: true
    }, {
      name: 'Сходить в парк',
      pinned: false,
      show: true
    }, {
      name: 'Покататься на велике',
      pinned: false,
      show: true
    }, {
      name: 'Сходить в кино',
      pinned: false,
      show: true
    }, {
      name: 'Приготовить ужин',
      pinned: false,
      show: true
    }];
  }
  init() {
    this.topTasksPlay.addBtnPinnedListeners(this.onBtnPinned.bind(this)); // клик по btn-pinned
    this.topTasksPlay.addSubmitListeners(this.onSubmit.bind(this)); // клик по btn-pinned
    this.topTasksPlay.addValueListeners(this.onValue.bind(this)); // ввод текста в поле

    this.renderingTask(); // отрисовка задач
  }

  // клик по кнопке btn-pinned
  onBtnPinned(taskName) {
    const index = checkTask(this.tasks, taskName);

    // меняет статус закрепления pinned
    if (index !== -1) {
      this.tasks[index].pinned = !this.tasks[index].pinned;
    }
    this.renderingTask(); // перерисовка задач
  }

  onSubmit(value) {
    const textValue = value.replace(/<[^>]*>/g, '');
    if (value.length === 0) {
      this.topTasksPlay.message('Нельзя добавить пустую задачу');
      this.topTasksPlay.errorInputAdd();
    }
    const index = checkTask(this.tasks, textValue);
    if (index !== -1) {
      this.topTasksPlay.message('Нельзя добавить задачу повторно');
      this.topTasksPlay.errorInputAdd();
    }

    // вставка объекта задачи в массив
    if (index === -1 && value.length > 0) {
      this.tasks.push({
        name: textValue,
        pinned: false,
        show: true
      });
      this.topTasksPlay.onFocusClear();
    }
    this.tasks = searchTask(this.tasks, ''); // разрешаем показать все задачи
    this.renderingTask(); // перерисовка задач
  }

  // поиск задач по введёному тексту
  onValue(value) {
    this.tasks = searchTask(this.tasks, value); // поиск задачи
    this.renderingTask(); // перерисовка задач
  }

  // отрисовка задач
  renderingTask() {
    this.topTasksPlay.clearTask();
    for (let i = 0; i < this.tasks.length; i += 1) {
      // сохраняем переменные, что бы укоротить их))
      const {
        name,
        pinned,
        show
      } = this.tasks[i];
      let btnContent = ''; // кнопка задачи пустая
      if (pinned) {
        btnContent = '\u{2714}';
      } // если задача pinned true, то кнопка V

      // вставка задач со статусом pinned true
      if (pinned) {
        this.topTasksPlay.htmlTask(name, btnContent, 'pinnedEl');
      }

      // вставка задач со статусом pinned false
      if (!pinned && show) {
        this.topTasksPlay.htmlTask(name, btnContent, 'allTaskEl');
      }
      this.renderEmpty(); // вставка текста в пустые поля
    }
  }

  // вставляем текст в пустые блоки pinned или all Task
  renderEmpty() {
    const pinnedEmpty = checkStatus(this.tasks, 'pinned', true);
    const allTaskEmpty = checkStatus(this.tasks, 'pinned', false);
    const showEmpty = checkStatus(this.tasks, 'show', true);
    if (!pinnedEmpty) {
      this.topTasksPlay.pinnedEmpty();
    }
    if (!allTaskEmpty) {
      this.topTasksPlay.allTaskEmpty();
    }
    if (!showEmpty) {
      this.topTasksPlay.allTaskEmpty('No tasks found');
    }
  }
}
;// CONCATENATED MODULE: ./src/js/taskThree/GalleryPlay.js
class GalleryPlay {
  constructor() {
    this.container = null; // для контейнера в DOM
    this.submitListeners = [];
    this.btnAddListeners = [];
  }

  // присваиваем классу контейнер
  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  // проверка на наличие контейнера
  checkBinding() {
    if (this.container === null) {
      throw new Error('GalleryPlay not bind to DOM');
    }
  }

  // отрисовка HTML
  drawUI() {
    this.checkBinding();
    this.container.innerHTML = `
      <H2>
        Галерея изображений с проверкой URL
      </H2>
      <div class="top-tasks-container">
        <form data-id="gallery" class="form wrapper">
          <div class="gallery-group-label">
            <input data-id="gallery-name" class="field field-galery" type="text" name="gallery-name">
            <label class="text-field__label">Название</label>
          </div>
          <div class="gallery-group-label">
            <input data-id="gallery-url" class="field field-galery" type="text" name="gallery-url">
            <label class="text-field__label">Ссылка на изображение</label>
            <div class="url-example">Пример ссылки: https://netology.ru/apple-touch-icon.png</div>
          </div>
          <button data-id="gallery-img-add" class="btn img-btn">Добавить</button>
        </form>
        <div class="top-tasks-container__header">Галерея фотографий</div>
        <div data-id="galery-container" class="container-galery-img">

        </div>
      </div>
    `;
    this.container.classList.add('task');

    // элементы DOM
    this.gallery = this.container.querySelector('[data-id=gallery]');
    this.galleryName = this.container.querySelector('[data-id=gallery-name]');
    this.galleryUrl = this.container.querySelector('[data-id=gallery-url]');
    this.galleryExampleUrl = this.container.querySelector('.url-example');
    this.galeryContainer = this.container.querySelector('[data-id=galery-container]');
    this.gallery.addEventListener('submit', event => this.onSubmit(event));
    this.galleryExampleUrl.addEventListener('click', event => this.onExampleUrl(event));
    this.galleryName.addEventListener('focus', () => this.onFocusClear('galleryName'));
    this.galleryUrl.addEventListener('focus', () => this.onFocusClear('galleryUrl'));
  }
  htmlImg(name, url) {
    const figure = document.createElement('figure'); // создаём див
    figure.innerHTML = `
      <img class="galery-img" src="${url}" alt="${name}">
      <figcaption>${name}</figcaption>
      <div>X</div>
    `;
    figure.classList.add('galery-figure');
    figure.querySelector('div').addEventListener('click', event => this.onBtnImg(event));

    // return div;
    this.galeryContainer.appendChild(figure);
  }

  // Add listener to mouse click for cell
  addSubmitListeners(callback) {
    this.submitListeners.push(callback);
  }

  // Add listener to mouse click for cell
  addBtnImgListeners(callback) {
    this.btnAddListeners.push(callback);
  }

  // отправка формы с текстом
  onSubmit(event) {
    event.preventDefault();
    const name = this.galleryName.value;
    const url = this.galleryUrl.value;
    this.submitListeners.forEach(o => o.call(null, name, url));
    this.galleryName.value = '';
    this.galleryUrl.value = '';
  }
  onBtnImg(event) {
    event.preventDefault();
    const btn = event.currentTarget;
    const {
      src
    } = btn.parentNode.querySelector('img');
    this.btnAddListeners.forEach(o => o.call(null, src));
  }
  onExampleUrl(event) {
    event.preventDefault();
    this.galleryUrl.value = 'https://netology.ru/apple-touch-icon.png';
  }
  onFocusClear(input) {
    this.message(input, '');
    this.errorInputRemove(input);
  }

  // проверка на наличие переменной в классе
  checkVariable(input) {
    if (this[input] === undefined) {
      throw new Error('the variable does not exist');
    }
  }

  // текст в инпуте с ошибкой
  message(input, text) {
    this.checkVariable(input);
    this[input].placeholder = text;
  }

  // добавляем инпуту класс ошибки
  errorInputAdd(input) {
    this.checkVariable(input);
    this[input].classList.add('error-add');
  }

  // удаляем инпуту класс ошибки
  errorInputRemove(input) {
    this.checkVariable(input);
    this[input].classList.remove('error-add');
  }

  // очистка pinned и all-task
  clearImgs() {
    this.galeryContainer.innerHTML = ''; // очистка
  }

  clearHTML() {
    // очищаем container в DOM
    this.container.classList.remove('task');
    this.container.innerHTML = '';
  }
}
;// CONCATENATED MODULE: ./src/js/taskThree/checkUrl.js
// находит индекс по названию
function checkUrl(imgs, imgUrl) {
  if (!Array.isArray(imgs)) {
    throw new Error('not an array passed to checkTask');
  }
  const index = imgs.findIndex(item => item.url === imgUrl);
  return index;
}
;// CONCATENATED MODULE: ./src/js/taskThree/verificationUrl.js
/* eslint-disable no-console */
async function verificationUrl(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}
;// CONCATENATED MODULE: ./src/js/taskThree/GalleryControl.js


class GalleryControl {
  constructor(galleryPlay) {
    this.galleryPlay = galleryPlay; // класс который управляет DOM
    this.imgs = [{
      name: 'Хакер',
      url: 'https://cdn.pixabay.com/photo/2020/08/08/02/56/hacker-5471975_960_720.png'
    }, {
      name: 'Разработка',
      url: 'https://cdn.pixabay.com/photo/2021/08/05/12/36/software-development-6523979_960_720.jpg'
    }, {
      name: 'Матрица',
      url: 'https://cdn.pixabay.com/photo/2018/02/11/09/37/matrix-full-3145364_960_720.jpg'
    }];
  }
  init() {
    this.galleryPlay.addSubmitListeners(this.onSubmit.bind(this)); // клик по btn-pinned
    this.galleryPlay.addBtnImgListeners(this.onBtnImg.bind(this)); // клик по btn-pinned

    this.renderingTask(); // отрисовка фоток
  }

  async onSubmit(name, url) {
    if (name.length === 0) {
      this.galleryPlay.message('galleryName', 'Требуется заполнить Название');
      this.galleryPlay.errorInputAdd('galleryName');
    }
    if (url.length === 0) {
      this.galleryPlay.message('galleryUrl', 'Требуется заполнить ссылку');
      this.galleryPlay.errorInputAdd('galleryUrl');
    }
    const validUrl = await verificationUrl(url); // проверка url на картинку
    const index = checkUrl(this.imgs, url); // проверка есть ли уже такой url в базе

    if (index !== -1) {
      // если такой url есть, то текст с ошибкой
      this.galleryPlay.message('galleryUrl', 'Такая ссылка уже есть в галерее');
      this.galleryPlay.errorInputAdd('galleryUrl');
    }
    if (!validUrl && url.length !== 0) {
      // если url не картинка
      this.galleryPlay.message('galleryUrl', 'Ссылка не является картинкой');
      this.galleryPlay.errorInputAdd('galleryUrl');
    }

    // вставка объекта задачи в массив
    if (index === -1 && name.length > 0 && url.length > 0 && validUrl) {
      this.imgs.push({
        name,
        url
      });
      this.galleryPlay.onFocusClear('galleryName');
      this.galleryPlay.onFocusClear('galleryUrl');
      this.renderingTask(); // отрисовка галереи
    }
  }

  onBtnImg(url) {
    const index = checkUrl(this.imgs, url); // проверка есть ли уже такой url
    if (index !== -1) {
      this.imgs.splice(index, 1);
    } // удаления фотографии из архива

    this.renderingTask(); // отрисовка галереи
  }

  // отрисовка галереи
  renderingTask() {
    this.galleryPlay.clearImgs(); // очистка галереи

    const arr = this.imgs;
    for (let i = 0; i < arr.length; i += 1) {
      this.galleryPlay.htmlImg(arr[i].name, arr[i].url);
    }
  }
}
;// CONCATENATED MODULE: ./src/js/HomeWorkMenu.js
// import TaskOne from './taskOne/TaskOne';






class HomeWorkMenu {
  constructor() {
    this.container = null; // для контейнера в DOM
    this.taskOneInited = false;
    this.taskTwoInited = false;
    this.taskThreeInited = false;
  }
  static checkContainer(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
  }

  // присваиваем классу контейнер
  bindToDOM(container) {
    HomeWorkMenu.checkContainer(container);
    this.container = container;
  }
  bindTaskOneToDOM(container) {
    HomeWorkMenu.checkContainer(container);
    this.containerTaskOne = container;
  }
  bindTaskTwoToDOM(container) {
    HomeWorkMenu.checkContainer(container);
    this.containerTaskTwo = container;
  }
  bindTaskThreeToDOM(container) {
    HomeWorkMenu.checkContainer(container);
    this.containerTaskThree = container;
  }

  // проверка на наличие контейнера
  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }

  // отрисовка HTML
  drawUI() {
    this.checkBinding();
    this.container.innerHTML = `
      <div class="controls">
        <button data-id="taskOne" class="btn">Задача № 1</button>
        <button data-id="taskTwo" class="btn">Задача № 2</button>
        <button data-id="taskThree" class="btn">Задача № 3</button>
      </div>
    `;
    this.taskOne = this.container.querySelector('[data-id=taskOne]'); // элемент Задача № 1
    this.taskTwo = this.container.querySelector('[data-id=taskTwo]'); // элемент Задача № 2
    this.taskThree = this.container.querySelector('[data-id=taskThree]'); // элемент Задача № 3

    this.taskOne.addEventListener('click', event => this.onTaskOneClick(event));
    this.taskTwo.addEventListener('click', event => this.onTaskTwoClick(event));
    this.taskThree.addEventListener('click', event => this.onTaskThreeClick(event));
  }

  // клик Задача № 1
  onTaskOneClick(event) {
    event.preventDefault();
    this.taskRemover(); // удаление задач

    if (!this.taskOneInited) {
      this.taskOneInit();
    } // инициализация Задачи № 1

    this.taskOneInited = !this.taskOneInited; // состояние задачи № 1
    this.taskTwoInited = false; // состояние задачи № 2
    this.taskThreeInited = false; // состояние задачи № 3
  }

  // клик Задача № 2
  onTaskTwoClick(event) {
    event.preventDefault();
    this.taskRemover(); // удаление задач

    if (!this.taskTwoInited) {
      this.taskTwoInit();
    } // инициализация Задачи № 2

    this.taskOneInited = false; // состояние задачи № 1
    this.taskTwoInited = !this.taskTwoInited; // состояние задачи № 2
    this.taskThreeInited = false; // состояние задачи № 3
  }

  // клик Задача № 3
  onTaskThreeClick(event) {
    event.preventDefault();
    this.taskRemover(); // удаление задач

    if (!this.taskThreeInited) {
      this.taskThreeInit();
    } // инициализация Задачи № 3

    this.taskOneInited = false; // состояние задачи № 1
    this.taskTwoInited = false; // состояние задачи № 2
    this.taskThreeInited = !this.taskThreeInited; // состояние задачи № 3
  }

  // удаляет все запущенные задачи
  taskRemover() {
    if (this.taskOneInited) {
      this.taskOneRemove();
    } // удаление Задачи № 1
    if (this.taskTwoInited) {
      this.taskTwoRemove();
    } // удаление Задачи № 2
    if (this.taskThreeInited) {
      this.taskThreeRemove();
    } // удаление Задачи № 3
  }

  // создание Задачи № 1
  taskOneInit() {
    this.gamePlay = new GamePlay(); // создаём класс управления DOM
    this.gamePlay.bindToDOM(this.containerTaskOne); // присваеваем ему div taskOne из DOM
    this.gamePlay.drawUI(); // отрисовываем HTML в DOM

    this.gameController = new GameController(this.gamePlay); // создаём класс логики
    this.gameController.init(); // инициализируем класс логики
  }

  // создание Задачи № 2
  taskTwoInit() {
    this.topTasksPlay = new TopTasksPlay(); // создаём класс управления DOM
    this.topTasksPlay.bindToDOM(this.containerTaskTwo); // присваеваем ему div taskTwo из DOM
    this.topTasksPlay.drawUI(); // отрисовываем HTML в DOM

    this.topTasksControl = new TopTasksControl(this.topTasksPlay); // создаём класс логики
    this.topTasksControl.init(); // инициализируем класс логики
  }

  // создание Задачи № 3
  taskThreeInit() {
    this.galleryPlay = new GalleryPlay(); // создаём класс управления DOM
    this.galleryPlay.bindToDOM(this.containerTaskThree); // присваеваем ему div taskThree из DOM
    this.galleryPlay.drawUI(); // отрисовываем HTML в DOM

    this.galleryControl = new GalleryControl(this.galleryPlay); // создаём класс логики
    this.galleryControl.init(); // инициализируем класс логики
  }

  // удаление Задачи № 1
  taskOneRemove() {
    this.gameController.gamePlay.clearHTML();
    this.gamePlay = '';
    this.gameController = '';
  }

  // удаление Задачи № 2
  taskTwoRemove() {
    this.topTasksControl.topTasksPlay.clearHTML();
    this.topTasksPlay = '';
    this.topTasksControl = '';
  }

  // удаление Задачи № 3
  taskThreeRemove() {
    this.galleryControl.galleryPlay.clearHTML();
    this.galleryPlay = '';
    this.galleryControl = '';
  }
}
;// CONCATENATED MODULE: ./src/js/app.js
/* eslint-disable no-console */

const containerNav = document.getElementById('nav');
const containerTaskOne = document.getElementById('taskOne');
const containerTaskTwo = document.getElementById('taskTwo');
const containerTaskThree = document.getElementById('taskThree');
const homeWorkMenu = new HomeWorkMenu();
homeWorkMenu.bindToDOM(containerNav);
homeWorkMenu.bindTaskOneToDOM(containerTaskOne);
homeWorkMenu.bindTaskTwoToDOM(containerTaskTwo);
homeWorkMenu.bindTaskThreeToDOM(containerTaskThree);
homeWorkMenu.drawUI();
console.log('app started');
;// CONCATENATED MODULE: ./src/index.js



// TODO: write your code in app.js
/******/ })()
;