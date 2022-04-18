const daysToMilliseconds = 24 * 60 * 60 * 1000;

function getDate(deltaInDays = 0) {
  const epoch = new Date().getTime();
  const date = new Date(epoch + deltaInDays * daysToMilliseconds);

  return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
}

export { getDate };
