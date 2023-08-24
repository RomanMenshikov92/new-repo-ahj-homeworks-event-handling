// возвращает массив изменяя условие показа
// если задачи удовлетворяют поиск, то имеют статус показа
export default function searchTask(tasks, search) {
  const condition = Array.isArray(tasks);
  if (!condition) {
    throw new Error('not an array passed to searchTask');
  }

  const newArr = tasks;
  const searchText = search.toLowerCase();

  for (let i = 0; i < newArr.length; i += 1) {
    const nameText = newArr[i].name.toLowerCase();
    const coincidence = nameText.includes(searchText);

    if (coincidence) { newArr[i].show = true; }
    if (!coincidence) { newArr[i].show = false; }
  }

  return newArr;
}
