import { createTask, changeStat, changeStorage, removeTask, createError } from './functions';

export default function runTodoApp() {
  const todos = document.querySelector('#js-todos');
  const mainInput = document.querySelector('#js-task-name');
  const todoForm = document.querySelector('#js-todo-form');
  const remainingTasks = document.querySelector('#remaining-tasks');
  const completedTasks = document.querySelector('#completed-tasks');
  const totalTasks = document.querySelector('#total-tasks');
  const taskInput = document.querySelector('#js-task-name');
  let tasksCheck = [];
  let stat = {
    remaining: 0,
    completed: 0,
    total: 0,
  };
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Добавление задач при загрузке страницы из localStorage
  if (tasks) {
    tasks.forEach((task) => {
      const taskEl = createTask(task, stat, remainingTasks, completedTasks, totalTasks);

      !task.isCompleted ? (stat.remaining += 1) : (stat.completed += 1);
      stat.total += 1;

      remainingTasks.innerHTML = stat.remaining;
      completedTasks.innerHTML = stat.completed;
      totalTasks.innerHTML = stat.total;
      tasksCheck.push(taskEl.querySelector('.task__check'));
      todos.appendChild(taskEl);
    });
  }

  let btnsArr = document.querySelectorAll('.todos__remove');
  let textsArr = document.querySelectorAll('.task__text');

  if (btnsArr) {
    // Удаление задачи со страницы и из localStorage
    for (let btn of btnsArr) {
      btn.addEventListener('click', (e) => {
        let id = btn.parentElement.dataset.id.toString();
        const taskCheck = btn.parentElement.querySelector('.task__check');

        // console.log(taskCheck.checked);

        taskCheck.checked
          ? changeStat('remove', stat, remainingTasks, completedTasks, totalTasks, true)
          : changeStat('remove', stat, remainingTasks, completedTasks, totalTasks, false);
        removeTask(btn.parentElement, id);
      });
    }

    // Обновление задачи на странице и в localStorage
    for (let text of textsArr) {
      text.addEventListener('focusout', () => {
        const id = text.parentElement.parentElement.dataset.id;

        changeStorage(id, 'tasks', 'change', text.innerHTML.toString());
      });
    }
  }

  // Удаляем ошибку пустоты, если вводим любой символ в инпут
  taskInput.addEventListener('input', () => {
    if (document.querySelector('#header-error')) {
      document.querySelector('#header-error').remove();
    }
  });

  // Обработчик главной формы (добавить задачу)
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Проверяем на пустоту главный инпут
    if (!taskInput || taskInput.value === '') {
      if (!document.querySelector('#header-error')) {
        const error = createError('Введите задачу', 'header-error');

        taskInput.parentElement.after(error);
      }
    } else {
      // Если он не пустой, создаем задачу и накидываем на нее обработчики
      const task = {
        id: new Date().getTime(),
        name: taskInput.value,
        isCompleted: false,
      };
      const taskEl = createTask(task, stat, remainingTasks, completedTasks, totalTasks);
      const taskBtn = taskEl.querySelector('.todos__remove');
      const taskCheck = taskEl.querySelector('.task__check');

      // Обработчик удаления задачи
      taskBtn.addEventListener('click', () => {
        removeTask(taskEl, task.id);
        taskCheck.checked
          ? changeStat('remove', stat, remainingTasks, completedTasks, totalTasks, true)
          : changeStat('remove', stat, remainingTasks, completedTasks, totalTasks, false);
      });

      // Обработчик чекбокса на задаче
      taskCheck.addEventListener('change', () => {
        const item = taskCheck.parentElement.querySelector('.task__text');

        changeCheck(taskCheck, item);
      });

      tasks = JSON.parse(localStorage.getItem('tasks')) || [];

      if (taskInput.value === '') return;

      tasks.push(task);

      changeStat('add', stat, remainingTasks, completedTasks, totalTasks);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      todos.appendChild(taskEl);

      todoForm.reset();
      mainInput.focus();
    }
  });

  // Обработчик чекбоксов
  tasksCheck.forEach((taskCheck) => {
    taskCheck.addEventListener('change', () => {
      const item = taskCheck.parentElement.querySelector('.task__text');

      changeCheck(taskCheck, item);
    });
  });

  // Функция изменения isCompleted для задачи. Изменяет зачеркивание текста
  // на стороне клиента и добавляет свойство isCompleted в localStorage
  function changeCheck(taskCheck, item) {
    if (taskCheck.checked) {
      changeStat('check', stat, remainingTasks, completedTasks, totalTasks, true);
      item.classList.add('line-through');
      tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      changeStorage(taskCheck.id, 'tasks', 'change-check'); // Обновляем localStorage
    } else {
      changeStat('check', stat, remainingTasks, completedTasks, totalTasks, false);
      item.classList.remove('line-through');
      changeStorage(taskCheck.id, 'tasks', 'change-check'); // Обновляем localStorage
    }
  }
}
