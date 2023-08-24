import randomСondition from './randomСondition';

export default class GameController {
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
    if (!this.gameStarted || !this.turn) { return; }
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
