// находит индекс по названию
export default function checkTask(tasks, taskName) {
  if (!Array.isArray(tasks)) {
    throw new Error('not an array passed to checkTask');
  }

  const index = tasks.findIndex((item) => item.name === taskName);
  return index;
}
