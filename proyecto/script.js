document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const taskCounter = document.getElementById('task-counter');
    let taskCount = 0;
  
    // Función para agregar una nueva tarea
    const addTask = () => {
      const taskText = taskInput.value.trim();
      if (taskText !== '') {
        taskCount++;
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
  
        taskItem.innerHTML = `
          ${taskText}
          <button class="delete-btn">Eliminar</button>
        `;
  
        // Agregar la tarea a la lista
        taskList.appendChild(taskItem);
  
        // Actualizar el contador de tareas
        taskCounter.textContent = taskCount;
  
        // Limpiar el input
        taskInput.value = '';
  
        // Agregar evento de eliminación a la tarea
        taskItem.querySelector('.delete-btn').addEventListener('click', () => {
          taskItem.remove();
          taskCount--;
          taskCounter.textContent = taskCount;
        });
      }
    };
  
    // Agregar tarea al hacer click en el botón
    addTaskButton.addEventListener('click', addTask);
  
    // Agregar tarea también al presionar "Enter"
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addTask();
      }
    });
  });