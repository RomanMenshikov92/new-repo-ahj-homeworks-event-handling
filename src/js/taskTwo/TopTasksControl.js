import searchTask from './searchTask';
import checkStatus from './checkStatus';
import checkTask from './checkTask';

export default class TopTasksControl {
  constructor(topTasksPlay) {
    this.topTasksPlay = topTasksPlay; // класс который управляет DOM
    this.tasks = [
      { name: 'Сделать зарядку', pinned: false, show: true },
      { name: 'Приготовить завтрак', pinned: true, show: true },
      { name: 'Купить мороженное', pinned: false, show: true },
      { name: 'Сходить в парк', pinned: false, show: true },
      { name: 'Покататься на велике', pinned: false, show: true },
      { name: 'Сходить в кино', pinned: false, show: true },
      { name: 'Приготовить ужин', pinned: false, show: true },
    ];
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
    if (index !== -1) { this.tasks[index].pinned = !this.tasks[index].pinned; }

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
      this.tasks.push({ name: textValue, pinned: false, show: true });
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
      const { name, pinned, show } = this.tasks[i];

      let btnContent = ''; // кнопка задачи пустая
      if (pinned) { btnContent = '\u{2714}'; } // если задача pinned true, то кнопка V

      // вставка задач со статусом pinned true
      if (pinned) { this.topTasksPlay.htmlTask(name, btnContent, 'pinnedEl'); }

      // вставка задач со статусом pinned false
      if (!pinned && show) { this.topTasksPlay.htmlTask(name, btnContent, 'allTaskEl'); }

      this.renderEmpty(); // вставка текста в пустые поля
    }
  }

  // вставляем текст в пустые блоки pinned или all Task
  renderEmpty() {
    const pinnedEmpty = checkStatus(this.tasks, 'pinned', true);
    const allTaskEmpty = checkStatus(this.tasks, 'pinned', false);
    const showEmpty = checkStatus(this.tasks, 'show', true);

    if (!pinnedEmpty) { this.topTasksPlay.pinnedEmpty(); }
    if (!allTaskEmpty) { this.topTasksPlay.allTaskEmpty(); }
    if (!showEmpty) { this.topTasksPlay.allTaskEmpty('No tasks found'); }
  }
}
