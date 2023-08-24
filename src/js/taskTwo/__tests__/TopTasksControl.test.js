/* eslint-disable no-console */
import TopTasksControl from '../TopTasksControl';
import TopTasksPlay from '../TopTasksPlay';

jest.mock('../TopTasksPlay');
beforeEach(() => { jest.resetAllMocks(); });

const topTasksPlay = new TopTasksPlay();
// иммитация методов класса TopTasksPlay
topTasksPlay.addBtnPinnedListeners.mockReturnValue(console.log('вызван .topTasksPlay.addBtnPinnedListeners'));
topTasksPlay.addSubmitListeners.mockReturnValue(console.log('вызван .topTasksPlay.addSubmitListeners'));
topTasksPlay.addValueListeners.mockReturnValue(console.log('вызван .topTasksPlay.addValueListeners'));
topTasksPlay.message.mockReturnValue(console.log('вызван .topTasksPlay.message'));
topTasksPlay.errorInputAdd.mockReturnValue(console.log('вызван .topTasksPlay.errorInputAdd'));
topTasksPlay.onFocusClear.mockReturnValue(console.log('вызван .topTasksPlay.onFocusClear'));
topTasksPlay.clearTask.mockReturnValue(console.log('вызван .topTasksPlay.clearTask'));

test('TopTasksControl', () => {
  const topTasksControl = new TopTasksControl('test');
  const expected = {
    topTasksPlay: 'test',
    tasks: [
      { name: 'Сделать зарядку', pinned: false, show: true },
      { name: 'Приготовить завтрак', pinned: true, show: true },
      { name: 'Купить мороженное', pinned: false, show: true },
      { name: 'Сходить в парк', pinned: false, show: true },
      { name: 'Покататься на велике', pinned: false, show: true },
      { name: 'Сходить в кино', pinned: false, show: true },
      { name: 'Приготовить ужин', pinned: false, show: true },
    ],
  };

  const resived = {
    topTasksPlay: topTasksControl.topTasksPlay,
    tasks: topTasksControl.tasks,
  };

  expect(resived).toEqual(expected);
});

// test('TopTasksControl renderingTask() pinned false', () => {
//   const topTasksControl = new TopTasksControl(topTasksPlay);
//   const expected = undefined;

//   topTasksControl.tasks = [
//     { name: 'Сделать зарядку', pinned: false, show: true },
//     { name: 'Пойти в гости', pinned: false, show: true },
//   ];

//   const resived = topTasksControl.renderingTask();

//   expect(resived).toEqual(expected);
// });

test('TopTasksControl renderingTask()', () => {
  const topTasksControl = new TopTasksControl(topTasksPlay);
  const expected = undefined;

  const resived = topTasksControl.renderingTask();

  expect(resived).toEqual(expected);
});

test('TopTasksControl init()', () => {
  const topTasksControl = new TopTasksControl(topTasksPlay);
  const expected = undefined;

  const resived = topTasksControl.init();

  expect(resived).toEqual(expected);
});

test('TopTasksControl onBtnPinned()', () => {
  const topTasksControl = new TopTasksControl(topTasksPlay);
  const expected = true;

  topTasksControl.tasks[5].pinned = false;
  topTasksControl.onBtnPinned('Сходить в кино');

  const resived = topTasksControl.tasks[5].pinned;

  expect(resived).toEqual(expected);
});

test('TopTasksControl onBtnPinned() false', () => {
  const topTasksControl = new TopTasksControl(topTasksPlay);
  const expected = undefined;

  const resived = topTasksControl.onBtnPinned('false');

  expect(resived).toEqual(expected);
});

test('TopTasksControl onValue()', () => {
  const topTasksControl = new TopTasksControl(topTasksPlay);
  const expected = undefined;

  const resived = topTasksControl.onValue('Сходить в кино');

  expect(resived).toEqual(expected);
});

test('TopTasksControl onSubmit() value.length === 0', () => {
  const topTasksControl = new TopTasksControl(topTasksPlay);
  const expected = undefined;

  const resived = topTasksControl.onSubmit('');

  expect(resived).toEqual(expected);
});

test('TopTasksControl onSubmit() dabl task', () => {
  const topTasksControl = new TopTasksControl(topTasksPlay);
  const expected = undefined;

  const resived = topTasksControl.onSubmit('Сделать зарядку');

  expect(resived).toEqual(expected);
});

test('TopTasksControl onSubmit() true', () => {
  const topTasksControl = new TopTasksControl(topTasksPlay);
  const expected = [
    { name: 'Сделать зарядку', pinned: false, show: true },
    { name: 'Пойти в гости', pinned: false, show: true },
  ];

  topTasksControl.tasks = [
    { name: 'Сделать зарядку', pinned: false, show: true },
  ];
  topTasksControl.onSubmit('Пойти в гости');

  const resived = topTasksControl.tasks;

  expect(resived).toEqual(expected);
});

test('TopTasksControl onSubmit() true RegExp', () => {
  const topTasksControl = new TopTasksControl(topTasksPlay);
  const expected = [
    { name: 'Сделать зарядку', pinned: false, show: true },
    { name: 'Пойти в гости', pinned: false, show: true },
  ];

  topTasksControl.tasks = [
    { name: 'Сделать зарядку', pinned: false, show: true },
  ];
  topTasksControl.onSubmit('<div class="test">Пойти в гости</div>');

  const resived = topTasksControl.tasks;

  expect(resived).toEqual(expected);
});

test('TopTasksControl renderEmpty() pinned true', () => {
  const topTasksControl = new TopTasksControl(topTasksPlay);
  const expected = undefined;

  topTasksControl.tasks = [
    { name: 'Сделать зарядку', pinned: true, show: true },
    { name: 'Пойти в гости', pinned: true, show: true },
  ];

  const resived = topTasksControl.renderEmpty();

  expect(resived).toEqual(expected);
});

test('TopTasksControl renderEmpty() pinned false', () => {
  const topTasksControl = new TopTasksControl(topTasksPlay);
  const expected = undefined;

  topTasksControl.tasks = [
    { name: 'Сделать зарядку', pinned: false, show: true },
    { name: 'Пойти в гости', pinned: false, show: true },
  ];

  const resived = topTasksControl.renderEmpty();

  expect(resived).toEqual(expected);
});

test('TopTasksControl renderEmpty() show false', () => {
  const topTasksControl = new TopTasksControl(topTasksPlay);
  const expected = undefined;

  topTasksControl.tasks = [
    { name: 'Сделать зарядку', pinned: true, show: false },
    { name: 'Пойти в гости', pinned: false, show: false },
  ];

  const resived = topTasksControl.renderEmpty();

  expect(resived).toEqual(expected);
});
