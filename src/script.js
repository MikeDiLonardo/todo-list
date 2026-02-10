// #region - Global Variables
// Theme
const theme = document.querySelector("#theme");

// Todos
let todos = JSON.parse(localStorage.getItem("todos")) ?? [];
let idCount = todos.length > 0 ? todos[todos.length - 1].id : 0;

// Form
const newTodoInput = document.querySelector("#new-todo-text");
const dateWrapper = document.querySelector(".new-todo-dd-wrapper");
const dueDate = document.querySelector("#new-todo-dd");
const dateOverlay = document.querySelector(".date-overlay span");
const addBtn = document.querySelector("#new-todo-add");

// Categories
let categories = JSON.parse(localStorage.getItem("categories")) || [
  { id: 0, name: "None", count: 0, colorClass: "cat0" },
  { id: 1, name: "Work", count: 0, colorClass: "cat1" },
  { id: 2, name: "Personal", count: 0, colorClass: "cat2" },
  { id: 3, name: "Pets", count: 0, colorClass: "cat3" },
  { id: 4, name: "Groceries", count: 0, colorClass: "cat4" },
];
const todoCategories = document.querySelector(".todo-categories");
let currentCategory = "None";
let clickTimeout = null;

// Todo list
const todoListWrapper = document.querySelector(".todo-list-wrapper");
const todoCount = document.querySelector(".todo-count span");
const layoutTodoFooter = document.querySelector(".layout-todo-footer");
const todoFooterActions = document.querySelector(".todo-footer-actions");
const binBtn = document.querySelector(".btn--bin");

// Bin
const bin = document.querySelector(".container-bin");
const binWrapper = document.querySelector(".bin-wrapper");
const binListWrapper = document.querySelector(".bin-list-wrapper");
const restoreBtn = document.querySelector(".btn--restore");
const deleteBtn = document.querySelector(".btn--delete");
const binTodoCount = document.querySelector(".bin-todo-count span");
const deleteAllBtn = document.querySelector(".btn--delete-all");

//#endregion

// #region - Functions

// Save / Render
const saveTodos = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};
const saveCategories = () => {
  localStorage.setItem("categories", JSON.stringify(categories));
};
const renderIcon = () => {
  const isDark = document.documentElement.classList.contains("dk-theme");

  const sunPath =
    "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z";
  const moonPath =
    "M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z";

  theme.innerHTML = `
      <svg aria-label="${isDark ? "Sun Icon" : "Moon Icon"}"
      xmlns="http://www.w3.org/2000/svg" 
      fill="currentColor"
      width="2.5rem"
      height="2.5rem"        
      viewBox="0 0 24 24" 
      stroke-width="${isDark ? "1.5" : "0"}" 
      stroke="currentColor"  
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        d="${isDark ? sunPath : moonPath}" 
      />
    </svg>    
    `;
};
const renderCategories = () => {
  todoCategories.innerHTML = "";

  categories.forEach((category) => {
    if (category.id !== 0) {
      // div that holds the button (category name) and and span (category count)
      // Clicking a category dims the others
      const categoryDiv = document.createElement("div");
      if (currentCategory !== "None" && category.name !== currentCategory) {
        categoryDiv.className = `todo-category btn--dimmed-cat`;
      } else {
        categoryDiv.className = `todo-category btn--${category.colorClass}`;
      }

      // button with category name
      const categoryName = document.createElement("button");
      categoryName.className = `btn ${category.name} category-name`;
      categoryName.textContent = category.name;
      categoryName.dataset.categoryId = category.id;
      categoryName.tabIndex = 0;

      // span with category count
      const categoryCount = document.createElement("span");
      categoryCount.className = "category-count text-md-bold";
      categoryCount.setAttribute("aria-label", "Amount of items in category");
      const count = todos.filter((todo) => category.name === todo.category && todo.cleared === false).length;
      category.count = count;
      categoryCount.textContent = count;

      categoryDiv.append(categoryName, categoryCount);
      todoCategories.appendChild(categoryDiv);
    }
  });

  const categorySelector = document.querySelector(".new-todo-category-wrapper");
  categorySelector.innerHTML = "";

  // Shorten category name if it's too long to not stretch the form
  const shortenCatName = (catName) => {
    return catName.length > 12 ? `${catName.substring(0, 12)}...` : catName;
  };

  // Sync category names in the select dropdown with current categories
  categorySelector.insertAdjacentHTML(
    "afterbegin",
    `
      <select id="new-todo-category" class="new-todo-category" name="new-todo-select" tabindex="0">
        <option value="None">None</option>
        <option value="${categories[1].name}">${shortenCatName(categories[1].name)}</option>
        <option value="${categories[2].name}">${shortenCatName(categories[2].name)}</option>
        <option value="${categories[3].name}">${shortenCatName(categories[3].name)}</option>
        <option value="${categories[4].name}">${shortenCatName(categories[4].name)}</option>
      </select>   
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        width="1.25rem"
        height="1.25rem"
        viewBox="0 0 24 24" 
        stroke-width="1.75" 
        stroke="currentColor"
        aria-hidden="true"                
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          d="m19.5 8.25-7.5 7.5-7.5-7.5" 
        />
      </svg>           
    `,
  );
};
const renderTodos = () => {
  // todos that aren't cleared (in the bin)
  const activeTodos = todos.filter((todo) => todo.cleared === false);

  todoListWrapper.innerHTML = "";

  if (activeTodos.length > 0) {
    // Add ul
    const todoList = document.createElement("ul");
    todoList.className = "todo-list";
    todoListWrapper.classList.remove("todo-list-empty"); // Get rid of placeholder message
    todoListWrapper.appendChild(todoList);

    // Add li
    activeTodos.forEach((todo) => {
      // Show item if currentCategory is "None" or if its the clicked category
      if (currentCategory === "None" || todo.category === currentCategory) {
        const { checkboxIcon, isCompleted } = checkboxHTML(todo);

        // Find the category object with a name that matches todo.category
        const todoCategory = categories.find((category) => category.name === todo.category);

        const dueDateData = getDueDate(todo.dueDate);
        /* prettier-ignore */
        todoList.insertAdjacentHTML(
          "afterbegin",
          `
            <li class="todo-item ${todoCategory.colorClass}" data-id="${todo.id}">
              <div class="checkbox-text">
                ${checkboxIcon}
                <div class="todo-text-wrapper">
                  <span class="todo-text ${isCompleted}" tabindex="0">
                    ${todo.text}
                  </span> 
                ${todo.dueDate ? `
                  <span class="todo-dd text-xs ${dueDateData.class} ${isCompleted}">
                    Due: ${dueDateData.text}
                  </span>
                  `
                  : ""
                }
                </div>
              </div>
              <div class="todo-item-actions">
                <button class="btn btn--clear" aria-label="Clear">
                  <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  width="1.35rem"
                  height="1.35rem"                
                  viewBox="0 0 24 24" 
                  stroke-width="2.5" 
                  stroke="currentColor"
                  aria-hidden="true"
                  >
                    <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    d="M5 12h14" />
                  </svg>
                </button>
              </div>
            </li>
          `,
        );
      }
    });
  } else {
    // Show placeholder message when the list is empty
    todoListWrapper.classList.add("todo-list-empty");
    todoListWrapper.insertAdjacentHTML(
      "afterbegin",
      `
        <div class="todo-list-placeholder">
          <div class="placeholder-title">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              width="2.25rem"
              height="2.25rem"           
              viewBox="0 0 24 24" 
              stroke-width="1.75" 
              stroke="currentColor"
              aria-hidden="true"              
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" 
              />
            </svg>
            <span class="text-lg">
              Start by adding a new todo
            </span>
          </div>   
          <p class="placeholder-instructions text-sm">
            Click categories to toggle filters. </br>
            Double-click the text in categories or todo items to edit.
          </p>
        </div>         
      `,
    );
  }

  todoCount.textContent = activeTodos.length;
};
const renderBin = () => {
  // const binList = document.querySelector(".todo-list--bin");
  let clearedTodos = todos.filter((todo) => todo.cleared);

  binListWrapper.innerHTML = "";

  if (clearedTodos.length > 0) {
    // Add ul
    const binList = document.createElement("ul");
    binList.className = "todo-list bin-list";
    binListWrapper.classList.remove("bin-list-empty"); // Get rid of placeholder message
    binListWrapper.appendChild(binList);

    // Add li
    clearedTodos.forEach((todo) => {
      const { checkboxIcon, isCompleted } = checkboxHTML(todo);
      // Find the category object with a name that matches todo.category
      const todoCategory = categories.find((category) => category.name === todo.category);

      const dueDateData = getDueDate(todo.dueDate);
      /* prettier-ignore */
      binList.insertAdjacentHTML(
        "afterbegin",
        `
        <li class="todo-item todo-item--bin ${todoCategory.colorClass}" data-id="${todo.id}">
          <div class="checkbox-text">
              ${checkboxIcon}
            <div class="todo-text-wrapper">
              <span class="todo-text ${isCompleted}">
                  ${todo.text}
              </span> 
                ${todo.dueDate ? `
                  <span class="todo-dd text-xs ${dueDateData.class} ${isCompleted}">
                    Due: ${dueDateData.text}
                  </span>
                  `
                  : ""
                }
            </div>
          </div>
          <div class="todo-item-actions">
            <button class="btn btn--restore" aria-label="Restore">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                width="1.25rem"
                height="1.25rem"                
                viewBox="0 0 24 24" 
                stroke-width="1.5" 
                stroke="currentColor"
                aria-hidden="true"                
              >
                <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" 
                />
              </svg>
            </button>            
            <button class="btn btn--delete" aria-label="Delete">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                width="1.25rem"
                height="1.25rem"
                viewBox="0 0 24 24" 
                stroke-width="1.5" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  d="M6 18 18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </li>      
      `,
      );
    });
  } else {
    // Show placeholder message when the bin list is empty
    binListWrapper.classList.add("bin-list-empty");
    binListWrapper.insertAdjacentHTML(
      "afterbegin",
      `
        <div class="bin-list-placeholder">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            width="2.5rem"
            height="2.5rem"
            viewBox="0 0 24 24" 
            stroke-width="1.5" 
            stroke="currentColor"
            aria-hidden="true"            
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" 
            />
          </svg>        
          <span class="text-lg">
            Cleared items will be added here
          </span>
        </div>         
      `,
    );
  }

  binTodoCount.textContent = clearedTodos.length;
};
const renderAll = () => {
  renderIcon();
  renderCategories();
  renderTodos();
  renderBin();

  resetDueDate();

  saveTodos();
  saveCategories();
};

// Due Date
const getDueDate = (date) => {
  if (!date) {
    dateOverlay.textContent = "Pick a day";
    return "";
  }

  // "T00:00:00" is to specify current location
  const dueDateConfig = { day: "numeric", month: "short", year: "numeric" };
  const dueDateText = new Date(date + "T00:00:00").toLocaleDateString("en-GB", dueDateConfig);
  dateOverlay.textContent = dueDateText;

  // setHours is zeroed out because we're just focused on the day
  const today = new Date().setHours(0, 0, 0, 0);
  const targetDate = new Date(date + "T00:00:00").setHours(0, 0, 0, 0);

  // Add styling class if past due
  const dueDateClass = targetDate < today ? "past-due" : "";

  return { text: dueDateText, class: dueDateClass };
};
const resetDueDate = () => {
  dueDate.value = ""; // data
  getDueDate(""); // text overlay
};

// Checkbox
const checkboxHTML = (todo) => {
  let checkboxIcon = "";

  if (todo.completed) {
    checkboxIcon = `
      <button class="btn btn--checkbox is-checked" aria-label="Mark as complete" aria-pressed="true">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          height="2rem"
          width="2rem"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="1.25" 
          stroke="currentColor"
          aria-hidden="true"
        >

          <circle cx="12" cy="12" r="9" class="checkbox-bg" />
          
          <path 
            class="checkbox-mark"
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M9 12.75 11.25 15 15 9.75" 
          />
        </svg>               
      </button>`;
  } else {
    checkboxIcon = `
      <button class="btn btn--checkbox" aria-label="Mark as complete" aria-pressed="false">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          height="2rem"
          width="2rem"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke-width="1.25" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
        </svg>
      </button>`;
  }

  const isCompleted = todo.completed ? "is-completed" : "";

  // Return proper checkbox icon and completed styling class
  return { checkboxIcon, isCompleted };
};
const toggleComplete = (todoId) => {
  const toggleTodo = todos.find((todo) => todo.id === todoId);

  if (toggleTodo) {
    toggleTodo.completed = !toggleTodo.completed;

    renderAll();
  }
};

// Add / Edit
const addTodo = () => {
  const category = document.querySelector("#new-todo-category");
  const newTodo = newTodoInput.value.trim();

  if (newTodo !== "") {
    idCount++;

    todos.push({
      id: idCount,
      text: newTodo,
      category: category.value,
      dueDate: dueDate.value,
      completed: false,
      cleared: false,
      deleted: false,
    });

    renderAll();
    newTodoInput.value = "";
    dueDate.value = "";
    getDueDate(""); // Reverts date overlay text to Pick a day
  }
};
const editCategory = (categoryId) => {
  const categoryToEdit = categories.find((category) => category.id === categoryId);

  if (categoryToEdit) {
    // Selects the category that matches the ID the user clicked on and creates an input for editing
    const categoryBtn = document.querySelector(`[data-category-id="${categoryId}"]`);
    const editCategoryInput = document.createElement("input");
    editCategoryInput.classList.add("category-edit");

    // Makes the input have the same dimensions as the original text
    editCategoryInput.style.width = `${categoryBtn.offsetWidth}px`;
    editCategoryInput.style.height = `${categoryBtn.offsetHeight}px`;

    const saveCategoryEdit = () => {
      // If the user leaves it blank, it'll revert back to original text
      if (editCategoryInput.value.trim() === "") {
        editCategoryInput.value = categoryToEdit.name;
        renderAll();
        return;
      }

      // Stores the old name before updating it so we can find and update matching todos later
      const oldName = categoryToEdit.name;
      const newName = editCategoryInput.value.trim();
      categoryToEdit.name = newName; // Updates the name inside the categories array

      if (currentCategory === oldName) {
        currentCategory = newName;
      }

      todos.forEach((todo) => {
        if (todo.category === oldName) {
          todo.category = newName;
        }
      });

      renderAll();
    };

    // Adds original text to input before starting the edit
    // Swaps the button for the input so the user can edit
    editCategoryInput.value = categoryToEdit.name;
    categoryBtn.replaceWith(editCategoryInput);
    editCategoryInput.focus();

    // Pressing enter also causes blur, so once: true is used to avoid saving twice

    editCategoryInput.addEventListener("blur", saveCategoryEdit, { once: true });
    editCategoryInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveCategoryEdit();
      }
    });
  }
};
const editTodo = (todoId) => {
  const todoToEdit = todos.find((todo) => todo.id === todoId);

  if (todoToEdit) {
    // Selects the todo that matches the ID the user clicked on creates a textarea for editing
    const span = document.querySelector(`[data-id="${todoId}"] .todo-text`);
    const editInput = document.createElement("textarea");
    editInput.classList.add("todo-edit");

    // Makes the textarea have the same dimensions as the original text
    editInput.style.width = `${span.offsetWidth}px`;
    editInput.style.height = `${span.offsetHeight}px`;

    const saveTodoEdit = () => {
      // If the user leaves it blank, it'll revert back to original text
      if (editInput.value.trim() === "") {
        editInput.value = todoToEdit.text;
        renderAll();
        return;
      }
      todoToEdit.text = editInput.value.trim();
      renderAll();
    };

    // Adds original text to textarea before starting the edit
    // Swaps the button for the textarea so the user can edit
    editInput.value = todoToEdit.text;
    span.replaceWith(editInput);
    editInput.focus();

    // Pressing enter also causes blur, so once: true is used to avoid saving twice
    editInput.addEventListener("blur", saveTodoEdit, { once: true });
    editInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        saveTodoEdit();
      }
    });
  }
};

// Clear / Restore / Delete
const clearTodo = (todoId) => {
  const todoToClear = todos.find((todo) => todo.id === todoId);

  if (todoToClear) {
    todoToClear.cleared = true;

    renderAll();
  }
};
const clearCompletedTodos = () => {
  const completedTodos = todos.filter((todo) => todo.completed);

  completedTodos.forEach((completedTodo) => {
    completedTodo.cleared = true;
  });

  renderAll();
};
const clearAllTodos = () => {
  todos.forEach((todo) => {
    todo.cleared = true;
  });

  renderAll();
};
const restoreTodo = (todoId) => {
  const todoToRestore = todos.find((todo) => todo.id === todoId);

  if (todoToRestore) {
    todoToRestore.cleared = false;

    renderAll();
  }
};
const restoreAllTodos = () => {
  // Can also be done with todos instead of clearedTodos
  // But targeting clearedTodos assures this is only being applied to items in bin
  const clearedTodos = todos.filter((todo) => todo.cleared);

  clearedTodos.forEach((todo) => {
    todo.cleared = false;
  });

  renderAll();
};
const deleteTodo = (todoId) => {
  const todoToDelete = todos.find((todo) => todo.id === todoId);

  if (todoToDelete) {
    todoToDelete.deleted = true;

    todos = todos.filter((todo) => !todo.deleted);

    renderAll();
  }
};
const deleteAllTodos = () => {
  const clearedTodos = todos.filter((todo) => todo.cleared);

  clearedTodos.forEach((todo) => {
    todo.deleted = true;
  });

  todos = todos.filter((todo) => !todo.deleted);

  renderAll();
};

// Bin
const openBin = () => {
  bin.showModal();
  document.activeElement.blur(); // Prevents iOS/iPad from forcing a focus outline on the first item when the bin opens
};
const closeBin = () => {
  bin.close();
};

// #endregion

// #region - Event Listeners
// Toggle Theme
theme.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dk-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  renderIcon();
});

// Add todo - Add button
addBtn.addEventListener("click", (event) => {
  event.preventDefault();
  addTodo();
});
// Add todo - Enter key
newTodoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addTodo();
  }
});

// Toggle between "None" and clicked category for currentCategory
todoCategories.addEventListener("click", (event) => {
  const clickedCategory = event.target.closest(".todo-category");

  // Ignore clicks that don't land on a category button
  if (!clickedCategory) {
    return;
  }

  // Pevent multiple clicks from stacking up.
  // Add small delay before starting to filter in case user intends to dblClick
  clearTimeout(clickTimeout);
  clickTimeout = setTimeout(() => {
    const name = clickedCategory.querySelector(".category-name").textContent;

    // Update the active filter and refresh the list when a category is clicked
    if (currentCategory === name) {
      currentCategory = "None";
    } else {
      currentCategory = name;
    }

    renderAll();

    console.log("Single click: Filtering...");
  }, 200);
});
// Get categoryId - Double click to edit
todoCategories.addEventListener("dblclick", (event) => {
  // Kill the timer so the single click logic never runs
  clearTimeout(clickTimeout);

  let categoryId = event.target.closest(".category-name")?.dataset.categoryId;

  if (categoryId) {
    categoryId = Number(categoryId);
    editCategory(categoryId);
  }
});
// Prevent text selection when double clicking to edit
todoListWrapper.addEventListener("mousedown", (event) => {
  if (event.detail > 1 && event.target.closest(".todo-text")) {
    event.preventDefault();
  }
});

// Show picker for due date
dateWrapper.addEventListener("click", () => {
  dueDate.showPicker();
});
// Show date instead of "Pick a day"
dueDate.addEventListener("change", (event) => {
  const dueDateValue = event.target.value;
  getDueDate(dueDateValue);
});
// Show "Pick a day" if user clicks away after not choosing date
dueDate.addEventListener("blur", () => {
  if (dueDate.value === "") {
    dateOverlay.textContent = "Pick a day";
  }
});
// Reverts date overlay text to "Pick a day"
// setTimeout moves the code inside from the call stack to the task queue in order for them to be processed after the ghost data
// ghost data in this case = automatically adding the last chosen date by default
window.addEventListener("load", () => {
  setTimeout(() => {
    resetDueDate();
  }, 1);
});

// Get todoId
todoListWrapper.addEventListener("click", (event) => {
  let todoId = event.target.closest(".todo-item")?.dataset.id;

  if (todoId) {
    todoId = Number(todoId);

    if (event.target.closest(".btn--checkbox")) {
      toggleComplete(todoId);
    }

    // Tiny delay prevents "ghost clicks" from focusing the input underneath on mobile
    if (event.target.closest(".btn--clear")) {
      setTimeout(() => {
        clearTodo(todoId);
      }, 10);
    }
  }
});
// Get todoId - Double click to edit
todoListWrapper.addEventListener("dblclick", (event) => {
  let todoId = event.target.closest(".todo-item")?.dataset.id;

  if (todoId) {
    todoId = Number(todoId);

    if (event.target.closest(".todo-text")) {
      editTodo(todoId);
    }
  }
});
todoListWrapper.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    let todoId = event.target.closest(".todo-item")?.dataset.id;

    if (todoId && event.target.classList.contains("todo-text")) {
      todoId = Number(todoId);
      editTodo(todoId);
    }
  }
});

// Clicking on placeholder will focus on the textarea
todoListWrapper.addEventListener("click", (event) => {
  if (todoListWrapper.classList.contains("todo-list-empty")) {
    newTodoInput.focus();
  }
});

// clearAllTodos / clearCompletedTodos
todoFooterActions.addEventListener("click", (event) => {
  if (event.target.closest(".btn--clear-all")) {
    clearAllTodos();
  }

  if (event.target.closest(".btn--clear-completed-todos")) {
    clearCompletedTodos();
  }
});

// Get todoId in Bin
binWrapper.addEventListener("click", (event) => {
  event.stopPropagation();
  let todoId = event.target.closest(".todo-item--bin")?.dataset.id;

  if (todoId) {
    todoId = Number(todoId);

    if (event.target.closest(".btn--checkbox")) {
      toggleComplete(todoId);
    }

    if (event.target.closest(".btn--restore")) {
      restoreTodo(todoId);
    }

    if (event.target.closest(".btn--delete")) {
      deleteTodo(todoId);
    }
  }

  if (event.target.closest(".btn--restore-all")) {
    restoreAllTodos();
  }
  if (event.target.closest(".btn--delete-all")) {
    deleteAllTodos();
  }
});
// Open Bin
layoutTodoFooter.addEventListener("click", (event) => {
  if (event.target.closest(".btn--bin")) {
    openBin();
  }
});
// Close Bin
bin.addEventListener("click", (event) => {
  if (!event.target.closest(".bin-wrapper")) {
    closeBin();
  }
});

// Console log
document.addEventListener("click", (event) => {
  console.log("Clicking on", event.target);
});

// #endregion

renderAll();
