import checkUrl from '../checkUrl';

const imgs = [
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

test('checkUrl true', () => {
  const url = 'https://cdn.pixabay.com/photo/2018/02/11/09/37/matrix-full-3145364_960_720.jpg';
  const expected = 2;
  const received = checkUrl(imgs, url);

  expect(received).toEqual(expected);
});

test('checkUrl false', () => {
  const url = 'test';
  const expected = -1;
  const received = checkUrl(imgs, url);

  expect(received).toEqual(expected);
});

test('checkUrl Throw', () => {
  const expected = 'not an array passed to checkTask';
  const received = () => checkUrl('imgs', 'url');

  expect(received).toThrow(expected);
});
