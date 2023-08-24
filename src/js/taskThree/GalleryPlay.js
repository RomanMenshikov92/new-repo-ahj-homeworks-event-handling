export default class GalleryPlay {
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

    this.gallery.addEventListener('submit', (event) => this.onSubmit(event));
    this.galleryExampleUrl.addEventListener('click', (event) => this.onExampleUrl(event));

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
    figure.querySelector('div').addEventListener('click', (event) => this.onBtnImg(event));

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
    this.submitListeners.forEach((o) => o.call(null, name, url));
    this.galleryName.value = '';
    this.galleryUrl.value = '';
  }

  onBtnImg(event) {
    event.preventDefault();
    const btn = event.currentTarget;
    const { src } = btn.parentNode.querySelector('img');
    this.btnAddListeners.forEach((o) => o.call(null, src));
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

  clearHTML() { // очищаем container в DOM
    this.container.classList.remove('task');
    this.container.innerHTML = '';
  }
}
