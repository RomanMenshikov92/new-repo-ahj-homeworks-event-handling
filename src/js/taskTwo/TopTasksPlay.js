export default class TopTasksPlay {
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

    this.filter.addEventListener('submit', (event) => this.onSubmit(event));
    this.filterText.addEventListener('input', (event) => this.onValue(event));

    this.filterText.addEventListener('focus', (event) => this.onFocusClear(event));
  }

  htmlTask(taskName, btnContent, element) {
    const div = document.createElement('div'); // создаём див
    div.innerHTML = `
      <div class="task-element-name">${taskName}</div>
      <button data-id="pinned-add" class="btn-pinned">${btnContent}</button>
    `;
    div.classList.add('task-element');
    div.querySelector('.btn-pinned').addEventListener('click', (event) => this.onBtnPinned(event));

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
    const { textContent } = btn.parentNode.querySelector('.task-element-name');
    this.btnPinnedListeners.forEach((o) => o.call(null, textContent));
  }

  // отправка формы с текстом
  onSubmit(event) {
    event.preventDefault();
    const input = event.currentTarget.querySelector('[data-id=filter-text]');
    this.submitListeners.forEach((o) => o.call(null, input.value));
    input.value = '';
  }

  // вводимый текст в инпут
  onValue(event) {
    event.preventDefault();
    const { value } = event.currentTarget;
    this.valueListeners.forEach((o) => o.call(null, value));
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
  allTaskEmpty(content = 'No tasks') {
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

  clearHTML() { // очищаем container в DOM
    this.container.classList.remove('task');
    this.container.innerHTML = '';
  }
}
