import checkTask from '../checkTask';

test('test checkTask ARR Throw', () => {
  const expected = 'not an array passed to checkTask';
  const received = () => {
    checkTask('');
  };

  expect(received).toThrow(expected);
});

test('test checkStatus result true', () => {
  const expected = 1;
  const tasks = [
    { name: 'Сделать зарядку', pinned: false, show: true },
    { name: 'Приготовить завтрак', pinned: true, show: true },
  ];
  const received = checkTask(tasks, 'Приготовить завтрак');

  expect(received).toEqual(expected);
});

test('test checkStatus result -1', () => {
  const expected = -1;
  const tasks = [
    { name: 'Сделать зарядку', pinned: false, show: true },
    { name: 'Приготовить завтрак', pinned: true, show: true },
  ];
  const received = checkTask(tasks, 'test');

  expect(received).toEqual(expected);
});
