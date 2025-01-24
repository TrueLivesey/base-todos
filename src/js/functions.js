// Функция создания задачи
function createTask(task) {
  const taskEl = document.createElement('li');

  taskEl.classList.add('todos__item');
  const taskInner = `
    <span class="task">
      <input type="checkbox" name="tasks" id=${task.id} ${task.isCompleted ? 'checked' : ''} class="task__check" />
      <span contenteditable="true" ${!task.isCompleted ? 'contenteditable' : ''} class="task__text ${task.isCompleted ? 'line-through' : ''}">${task.name}</span>
    </span>

    <button class="todos__remove">
      <svg width="12" height="11" viewBox="0 0 12 11" xmlns="http://www.w3.org/2000/svg" class="todos__icon">
        <path
          d="M2.28015 0.219999C2.13798 0.0875188 1.94993 0.0153959 1.75563 0.0188241C1.56133 0.0222523 1.37594 0.100964 1.23853 0.238377C1.10112 0.37579 1.02241 0.561175 1.01898 0.755476C1.01555 0.949778 1.08767 1.13782 1.22015 1.28L4.94015 5L1.22015 8.72C1.14647 8.78866 1.08736 8.87146 1.04637 8.96346C1.00538 9.05546 0.983339 9.15477 0.981562 9.25548C0.979785 9.35618 0.99831 9.45621 1.03603 9.5496C1.07375 9.64298 1.1299 9.72782 1.20112 9.79904C1.27233 9.87026 1.35717 9.9264 1.45056 9.96412C1.54394 10.0018 1.64397 10.0204 1.74468 10.0186C1.84538 10.0168 1.94469 9.99477 2.03669 9.95378C2.12869 9.91279 2.21149 9.85369 2.28015 9.78L6.00015 6.06L9.72015 9.78C9.78882 9.85369 9.87162 9.91279 9.96362 9.95378C10.0556 9.99477 10.1549 10.0168 10.2556 10.0186C10.3563 10.0204 10.4564 10.0018 10.5498 9.96412C10.6431 9.9264 10.728 9.87026 10.7992 9.79904C10.8704 9.72782 10.9266 9.64298 10.9643 9.5496C11.002 9.45621 11.0205 9.35618 11.0187 9.25548C11.017 9.15477 10.9949 9.05546 10.9539 8.96346C10.9129 8.87146 10.8538 8.78866 10.7802 8.72L7.06015 5L10.7802 1.28C10.9126 1.13782 10.9848 0.949778 10.9813 0.755476C10.9779 0.561175 10.8992 0.37579 10.7618 0.238377C10.6244 0.100964 10.439 0.0222523 10.2447 0.0188241C10.0504 0.0153959 9.86233 0.0875188 9.72015 0.219999L6.00015 3.94L2.28015 0.219999Z"
          fill="black"
        />
      </svg>
    </button>
  `;

  taskEl.dataset.id = task.id;
  taskEl.innerHTML = taskInner;

  // Добавляем галочки в чекбоксах и зачеркивание текста
  if (task.isCompleted) {
    const taskText = taskEl.querySelector('.task__text');
    taskText.classList.add('line-through');
    taskText.parentElement.querySelector('.task__check').checked = true;
  }

  return taskEl;
}

// Функция удаления задачи
function removeTask(taskEl, taskID) {
  const id = taskID.toString();
  taskEl.remove();
  changeStorage(id, 'tasks', 'delete');
}

// Функция изменения tasks в localStorage в зависимости от мода
function changeStorage(elID, keyStore, mode, name = null) {
  let storageTasks = JSON.parse(localStorage.getItem(keyStore));

  if (storageTasks) {
    // Удаление элемента
    if (mode === 'delete') {
      storageTasks = storageTasks.filter((el) => el.id.toString() !== elID);
      // Обновление элемента
    } else if (mode === 'change') {
      for (let task of storageTasks) {
        const storageID = task.id.toString();

        if (storageID === elID) {
          const start = storageTasks.indexOf(task);

          task.name = name;
          storageTasks.splice(start, 0, task);
          storageTasks.splice(start, 1);

          break;
        }
      }
    } else if (mode === 'change-check') {
      // storageTasks = JSON.parse(localStorage.getItem(keyStore));
      for (let task of storageTasks) {
        const storageID = task.id.toString();

        if (storageID === elID) {
          const start = storageTasks.indexOf(task);

          task.isCompleted ? (task.isCompleted = false) : (task.isCompleted = true);
          storageTasks.splice(start, 0, task);
          storageTasks.splice(start, 1);

          break;
        }
      }
    }
    localStorage.setItem('tasks', JSON.stringify(storageTasks));
  }
}

// Функция изменения объекта stat (статистика задач)
function changeStat(mode, stat, remaining, completed, total, check = null) {
  if (mode === 'check') {
    if (check) {
      stat.remaining -= 1;
      stat.completed += 1;
    } else {
      stat.remaining += 1;
      stat.completed -= 1;
    }
  } else if (mode === 'add') {
    stat.remaining += 1;
    stat.total += 1;
  } else if (mode === 'remove') {
    if (check) {
      stat.completed -= 1;
      stat.total -= 1;
    } else {
      stat.remaining -= 1;
      stat.total -= 1;
    }
  }

  remaining.innerHTML = stat.remaining;
  completed.innerHTML = stat.completed;
  total.innerHTML = stat.total;
}

// Функция, создающая ошибку
function createError(text, id) {
  const error = document.createElement('div');
  error.id = id;
  error.classList.add('error');
  error.textContent = text;

  return error;
}

export { createTask, removeTask, changeStorage, changeStat, createError };
