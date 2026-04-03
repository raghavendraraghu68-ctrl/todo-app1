let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function filterTasks(type) {
  currentFilter = type;
  showTasks();
}

function showTasks() {
  let list = document.getElementById("taskList");
  list.innerHTML = "";

  if (tasks.length === 0) {
    list.innerHTML = "<p class='empty'>No tasks yet 🚀</p>";
    return;
  }

  tasks.forEach((taskObj, index) => {
    if (
      (currentFilter === "completed" && !taskObj.completed) ||
      (currentFilter === "pending" && taskObj.completed)
    ) {
      return;
    }

    let li = document.createElement("li");

    let textSpan = document.createElement("span");
    textSpan.textContent = taskObj.text;

    if (taskObj.completed) {
      textSpan.style.textDecoration = "line-through";
    }

    li.onclick = function () {
      taskObj.completed = !taskObj.completed;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      showTasks();
    };

    let actions = document.createElement("div");
    actions.classList.add("actions");

    // EDIT
    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    editBtn.onclick = function (e) {
      e.stopPropagation();

      let input = document.createElement("input");
      input.type = "text";
      input.value = taskObj.text;

      li.replaceChild(input, textSpan);
      input.focus();

      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") saveEdit();
      });

      input.addEventListener("blur", saveEdit);

      function saveEdit() {
        let newText = input.value.trim();

        if (newText !== "") {
          tasks[index].text = newText;
          tasks[index].completed = false;
          localStorage.setItem("tasks", JSON.stringify(tasks));
        }

        showTasks();
      }
    };

    // DELETE
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.onclick = function (e) {
      e.stopPropagation();
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      showTasks();
    };

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(textSpan);
    li.appendChild(actions);

    list.appendChild(li);
  });
} // ✅ THIS WAS MISSING

// ADD TASK
function addTask() {
  let input = document.getElementById("taskInput");
  let task = input.value;

  if (task === "") {
    alert("Enter a task!");
    return;
  }

  tasks.push({ text: task, completed: false });

  localStorage.setItem("tasks", JSON.stringify(tasks));

  input.value = "";
  showTasks();
}

// INITIAL LOAD
showTasks();

// ENTER KEY
document.getElementById("taskInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// CLEAR ALL
let clearBtn = document.getElementById("clearAll");

clearBtn.addEventListener("click", function () {
  tasks = [];
  localStorage.removeItem("tasks");
  showTasks(); // better than manual clearing
});
