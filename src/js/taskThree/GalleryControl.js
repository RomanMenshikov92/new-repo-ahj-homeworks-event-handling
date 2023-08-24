import checkUrl from './checkUrl';
import verificationUrl from './verificationUrl';

export default class GalleryControl {
  constructor(galleryPlay) {
    this.galleryPlay = galleryPlay; // класс который управляет DOM
    this.imgs = [
      {
        name: 'Хакер',
        url: 'https://cdn.pixabay.com/photo/2020/08/08/02/56/hacker-5471975_960_720.png',
      },
      {
        name: 'Разработка',
        url: 'https://cdn.pixabay.com/photo/2021/08/05/12/36/software-development-6523979_960_720.jpg',
      },
      {
        name: 'Матрица',
        url: 'https://cdn.pixabay.com/photo/2018/02/11/09/37/matrix-full-3145364_960_720.jpg',
      },
    ];
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

    if (index !== -1) { // если такой url есть, то текст с ошибкой
      this.galleryPlay.message('galleryUrl', 'Такая ссылка уже есть в галерее');
      this.galleryPlay.errorInputAdd('galleryUrl');
    }

    if (!validUrl && url.length !== 0) { // если url не картинка
      this.galleryPlay.message('galleryUrl', 'Ссылка не является картинкой');
      this.galleryPlay.errorInputAdd('galleryUrl');
    }

    // вставка объекта задачи в массив
    if (index === -1 && name.length > 0 && url.length > 0 && validUrl) {
      this.imgs.push({ name, url });
      this.galleryPlay.onFocusClear('galleryName');
      this.galleryPlay.onFocusClear('galleryUrl');

      this.renderingTask(); // отрисовка галереи
    }
  }

  onBtnImg(url) {
    const index = checkUrl(this.imgs, url); // проверка есть ли уже такой url
    if (index !== -1) { this.imgs.splice(index, 1); } // удаления фотографии из архива

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
