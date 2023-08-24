export default class GamePlay {
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

    this.container.addEventListener('contextmenu', (event) => event.preventDefault()); // отключаем правую кнопку

    this.hitEl = this.container.querySelector('[data-id=hit] span'); // элемент попаданий
    this.missesEl = this.container.querySelector('[data-id=misses] span'); // элемент промахов
    this.gameOver = this.container.querySelector('[data-id=gameOver]'); // элемент поражения

    // события для кнопки "новая игра"
    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.newGameEl.addEventListener('mousedown', (event) => this.onNewGameClick(event));

    this.boardEl = this.container.querySelector('[data-id=board]'); // элемент игровое поля

    // добавляем ячейки игрового поля
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div'); // создаём див
      cellEl.classList.add('cell'); // добавляем класс div-у
      cellEl.addEventListener('mousedown', (event) => this.onCellClick(event)); // событие клика
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

  onNewGameClick(event) { // клик новая игра
    event.preventDefault();
    this.newGameListeners.forEach((o) => o.call(null));
  }

  onCellClick(event) { // клик по ячейке
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellClickListeners.forEach((o) => o.call(null, index));
  }

  cellActiveAdd(index) { // добавление гоблина
    const cell = this.cells[index];
    if (!cell) { return; }
    cell.classList.add('active');
  }

  cellActiveRemove(index) { // удаление гоблина
    const cell = this.cells[index];
    if (!cell) { return; }
    cell.classList.remove('active');
  }

  changeHit(points) { // изменение кол-ва попаданий
    this.hitEl.textContent = points;
  }

  changeMisses(points) { // изменение кол-ва промахов
    this.missesEl.textContent = points;
  }

  endGame() { // показывает табличку "проиграл"
    this.gameOver.style.display = 'flex';
  }

  startGame() { // убирает табличку "проиграл"
    this.gameOver.style.display = 'none';
  }

  clearHTML() { // очищаем container в DOM
    this.container.classList.remove('task');
    this.container.innerHTML = '';
  }
}
