            const btn1 = document.getElementById('btnDo1');
            const btn2 = document.getElementById('btnDo2');
            const btn3 = document.getElementById('btnDo3');

            const btnClearAll = document.getElementById('btnClearAll');
            
            const btnDel1 = document.getElementById('btnDel1');
            const btnDel2 = document.getElementById('btnDel2');
            const btnDel3 = document.getElementById('btnDel3');

            const input1 = document.getElementById('taskInput1');
            const input2 = document.getElementById('taskInput2');
            const input3 = document.getElementById('taskInput3');
            
            const todoContainer = document.getElementById('todoList');
            const processContainer = document.getElementById('processList');
            const doneContainer = document.getElementById('doneList')

            const containers = document.querySelectorAll('.task-list');
            const items = document.querySelectorAll('.task-item');
            
            const tasks = [];
            const tasks1 = [];
            const tasks2 = [];

            const all = document.getElementById('boardForm');
            
            function generateId() {
                return 'task-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
            };

            function addTaskToBoard(text, container) {
                let newTask = document.createElement('li');
                let textSpan = document.createElement('span');
                let newButton = document.createElement('button');
                
                // Текст задачи
                textSpan.textContent = text;
                textSpan.classList.add('task-text');
                
                textSpan.addEventListener('dblclick', (e) => {
                    e.stopPropagation;
                    makeEditable(textSpan, container);
                })

                // Кнопка удаления
                newButton.textContent = '❌';
                newButton.classList.add('del-btn-list');
                newButton.setAttribute('draggable', 'false');
                newButton.setAttribute('contenteditable', 'false')
                newButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    newTask.remove();
                    // Обновляем все три списка в localStorage
                    saveList(todoContainer);
                    saveList(processContainer);
                    saveList(doneContainer);
                });
                
                // Собираем задачу
                newTask.classList.add('task-item');
                newTask.setAttribute('draggable', 'true');
                newTask.id = generateId();
                newTask.appendChild(textSpan);
                newTask.appendChild(newButton);
                
                newTask.style.display = 'flex';
                newTask.style.justifyContent = 'space-between';
                newTask.style.alignItems = 'center';

                // Drag & Drop
                newTask.addEventListener('dragstart', handleDragStart);
                newTask.addEventListener('dragend', handleDragEnd);
                
                container.append(newTask);
            }

            function makeEditable(textSpan, container) {
                const currentText = textSpan.textContent;
                
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentText;
                input.classList.add('edit-input');
                
                textSpan.replaceWith(input);
                input.focus();
                
                // Удаляем все старые обработчики перед добавлением новых
                const blurHandler = () => {
                    saveEdit();
                };
                
                const keyHandler = (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        input.removeEventListener('blur', blurHandler); // Удаляем обработчик blur
                        saveEdit();
                    }
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        input.removeEventListener('blur', blurHandler); // Удаляем обработчик blur
                        cancelEdit();
                    }
                };
                
                function saveEdit() {
                    const newText = input.value.trim();
                    if (newText) {
                        const newSpan = document.createElement('span');
                        newSpan.textContent = newText;
                        newSpan.classList.add('task-text');
                        newSpan.addEventListener('dblclick', (e) => {
                            e.stopPropagation();
                            makeEditable(newSpan, container);
                        });
                        
                        // Проверяем, что input ещё в DOM
                        if (input.parentNode) {
                            input.replaceWith(newSpan);
                        }
                        
                        // Сохраняем изменения в localStorage
                        saveList(todoContainer);
                        saveList(processContainer);
                        saveList(doneContainer);
                    } else {
                        alert('Текст задачи не может быть пустым');
                        input.focus();
                    }
                }
    
    function cancelEdit() {
        const newSpan = document.createElement('span');
        newSpan.textContent = currentText;
        newSpan.classList.add('task-text');
        newSpan.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            makeEditable(newSpan, container);
        });
        
        // Проверяем, что input ещё в DOM
        if (input.parentNode) {
            input.replaceWith(newSpan);
        }
    }
    
    input.addEventListener('blur', blurHandler);
    input.addEventListener('keydown', keyHandler);
}

            function handleDragStart(e) {
                e.dataTransfer.setData('text/plain', e.target.id);
                e.target.style.opacity = '0.5';
            };

            function handleDragEnd(e) {
                e.target.style.opacity = '1';
            };

            function saveList(container) {
                if (container == todoContainer){
                    
                    tasks.length = 0;
                    container.querySelectorAll('.task-item .task-text').forEach(item => {
                        tasks.push(item.textContent);
                    });
                    localStorage.setItem('task-todo', JSON.stringify(tasks));
                
                }else if (container == processContainer){
                    
                    tasks1.length = 0;
                    container.querySelectorAll('.task-item .task-text').forEach(item => {
                        tasks1.push(item.textContent);
                    });
                    localStorage.setItem('task-process', JSON.stringify(tasks1));
                
                }else if (container == doneContainer){
                    
                    tasks2.length = 0;
                    container.querySelectorAll('.task-item .task-text').forEach(item => {
                        tasks2.push(item.textContent);
                    });
                    localStorage.setItem('task-done', JSON.stringify(tasks2));
                
                }else {
                    console.log("Контейнер не тот")
                }
            };

            function delList(container, index){
                
                if(container == all){

                    todoContainer.querySelectorAll('.task-item').forEach(item => item.remove());
                    processContainer.querySelectorAll('.task-item').forEach(item => item.remove());
                    doneContainer.querySelectorAll('.task-item').forEach(item => item.remove());
                    
                    localStorage.removeItem('task-todo');
                    localStorage.removeItem('task-process');
                    localStorage.removeItem('task-done');
                    return;
                };

                container.querySelectorAll('.task-item').forEach(item => item.remove());

                    if (container === todoContainer) {
                        localStorage.removeItem('task-todo');
                    } else if (container === processContainer) {
                        localStorage.removeItem('task-process');
                    } else if (container === doneContainer) {
                        localStorage.removeItem('task-done');
                    };
            };

            document.addEventListener('DOMContentLoaded', () => {
                
                const savedTasks1 = JSON.parse(localStorage.getItem('task-todo')) || [];
                const savedTasks2 = JSON.parse(localStorage.getItem('task-process')) || [];
                const savedTasks3 = JSON.parse(localStorage.getItem('task-done')) || [];
                
                savedTasks1.forEach(taskText => {
                    addTaskToBoard(taskText, todoContainer)
                });
                savedTasks2.forEach(taskText => {
                    addTaskToBoard(taskText, processContainer)
                });
                savedTasks3.forEach(taskText => {
                    addTaskToBoard(taskText, doneContainer)
                });
            });

            containers.forEach(container => {
                container.addEventListener('dragover', (e) => {
                    e.preventDefault(); // Разрешаем сброс
                });

                container.addEventListener('drop', (e) => {
                    e.preventDefault();
                    
                    // 1. Достаем ID перетаскиваемого элемента
                    const id = e.dataTransfer.getData('text/plain');
                    const draggedElement = document.getElementById(id);
                    
                    // 2. Проверяем, что элемент нашелся и контейнер - это действительно UL
                    if (draggedElement && e.currentTarget.tagName === 'UL') {
                        // 3. Перемещаем элемент
                        e.currentTarget.appendChild(draggedElement);
                        
                        // 4. ВАЖНО: После перемещения нужно пересохранить ВСЕ ТРИ колонки,
                        // потому что задачи поменяли свое местоположение.
                        saveList(todoContainer);
                        saveList(processContainer);
                        saveList(doneContainer);
                    }
                });
            });

            btn1.addEventListener('click', () => {
                const textTask1 = input1.value.trim();
                if (textTask1 !== '') {
                    addTaskToBoard(textTask1, todoContainer); // Добавили на экран
                    saveList(todoContainer);             // Сохранили в localStorage
                    input1.value = '';                       // Очистили поле
                } else {
                    alert('Ошибка, вы хотите добавить пустую задачу');
                }
            });
            btn2.addEventListener('click', () => {
                const textTask2 = input2.value.trim();
                if (textTask2 !== '') {
                    addTaskToBoard(textTask2, processContainer)
                    saveList(processContainer);
                    input2.value = '';
                }else{
                    alert('Ошибка, вы хотите добавить пустую задачу');
                }
            });
            btn3.addEventListener('click', () => {
                const textTask3 = input3.value.trim();
                if (textTask3 !== '') {
                    addTaskToBoard(textTask3, doneContainer)
                    saveList(doneContainer);
                    input3.value = '';
                }else{
                    alert('Ошибка, вы хотите добавить пустую задачу');
                }
            });
            
            btnClearAll.addEventListener('click', () => {
                if(confirm("Точно все удалить?")){
                    delList(all);
                }
            });
            
            btnDel1.addEventListener('click', () => {
                if (confirm("Точно удалить ВСЕ задачи из колонки 'Надо сделать'?")) {
                    delList(todoContainer);
                }
            });

            btnDel2.addEventListener('click', () => {
                if (confirm("Точно удалить ВСЕ задачи из колонки 'В работе'?")) {
                    delList(processContainer);
                }
            });

            btnDel3.addEventListener('click', () => {
                if (confirm("Точно удалить ВСЕ задачи из колонки 'Готово'?")) {
                    delList(doneContainer);
                }
            });

            items.forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    // Сохраняем ID элемента, который мы начали тащить
                    e.dataTransfer.setData('text/plain', e.target.id);
                    // Убираем стандартный полупрозрачный образ перетаскивания (опционально)
                    e.target.style.opacity = '0.5';
                });

                item.addEventListener('dragend', (e) => {
                    // Возвращаем прозрачность в норму, когда отпустили (даже если не попали)
                    e.target.style.opacity = '1';
                });
            });




