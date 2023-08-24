import checkStatus from '../checkStatus';

test('test checkStatus ARR Throw', () => {
  const expected = 'not an array passed to checkEmpty';
  const received = () => {
    checkStatus('');
  };

  expect(received).toThrow(expected);
});

test('test checkStatus condition Throw', () => {
  const expected = 'not an boolean passed to checkEmpty';
  const received = () => {
    checkStatus([''], 'test', '');
  };

  expect(received).toThrow(expected);
});

test('test checkStatus result true', () => {
  const expected = true;
  const tasks = [
    { name: 'Сделать зарядку', pinned: false, show: true },
    { name: 'Приготовить завтрак', pinned: true, show: true },
  ];
  const received = checkStatus(tasks, 'pinned', expected);

  expect(received).toEqual(expected);
});

test('test checkStatus result false', () => {
  const expected = false;
  const tasks = [
    { name: 'Сделать зарядку', pinned: false, show: true },
    { name: 'Приготовить завтрак', pinned: true, show: true },
  ];
  const received = checkStatus(tasks, 'test', expected);

  expect(received).toEqual(expected);
});
