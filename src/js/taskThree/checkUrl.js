// находит индекс по названию
export default function checkUrl(imgs, imgUrl) {
  if (!Array.isArray(imgs)) {
    throw new Error('not an array passed to checkTask');
  }

  const index = imgs.findIndex((item) => item.url === imgUrl);
  return index;
}
