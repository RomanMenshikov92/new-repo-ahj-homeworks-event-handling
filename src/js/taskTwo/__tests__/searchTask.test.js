import searchTask from '../searchTask';

test('test searchTask ARR Throw', () => {
  const expected = 'not an array passed to searchTask';
  const received = () => {
    searchTask('');
  };

  expect(received).toThrow(expected);
});

test('test searchTask', () => {
  const tasks = [
    { name: 'Сделать зарядку', pinned: false, show: false },
    { name: 'Приготовить завтрак', pinned: true, show: true },
  ];

  const expected = [
    { name: 'Сделать зарядку', pinned: false, show: true },
    { name: 'Приготовить завтрак', pinned: true, show: false },
  ];

  const resived = searchTask(tasks, 'Сделать зарядку');

  expect(resived).toEqual(expected);
});
