const todos = Array.from(JSON.parse(localStorage.getItem("todos")) || []);

const list = document.getElementById("list");
const createItem = (text, completed, after) => {
  const item = document.createElement("li");
  item.className = "item";
  item.id = localStorage.length + 1;

  // filling inner paragraph with input
  const innerText = document.createElement("p");
  innerText.className = "text";
  innerText.innerText = text;
  // text expands on hover
  innerText.addEventListener("mouseout", () => {
    innerText.style.maxHeight = "3em";
  });
  innerText.addEventListener("mouseover", () => {
    innerText.style.maxHeight = "100vh";
  });
  item.appendChild(innerText);

  const btnBox = document.createElement("div");
  btnBox.className = "btn-box";
  item.appendChild(btnBox);

  // creating "complete" button and respect its status if item exists
  const completeBtn = document.createElement("button");
  if (completed) {
    completeBtn.innerText = "Completed!";
    completeBtn.style.backgroundColor = "#499F68";
    completeBtn.style.color = "white";
  } else {
    completeBtn.innerText = "Complete";
  }
  completeBtn.className = "complete";

  const completedCallback = () => {
    // a callback to mark entry as completed
    list.appendChild(item);
    completeBtn.innerText = "Completed!";
    completeBtn.style.backgroundColor = "#499F68";
    completeBtn.style.color = "white";

    // searching for element and moving it to end
    let ix = todos.map((el) => el.text).indexOf(item.firstChild.innerText);
    todos[ix].completed = true;
    todos.push(todos.splice(ix, 1)[0]);
    localStorage.setItem("todos", JSON.stringify(todos));
    completeBtn.removeEventListener("click", completedCallback);
  };
  if (!completed) {
    // if not completed, add an option to complete
    completeBtn.addEventListener("click", completedCallback);
  }
  btnBox.appendChild(completeBtn);

  // setting up "delete" button
  const delBtn = document.createElement("button");
  delBtn.innerText = "Delete";
  delBtn.className = "delete";
  delBtn.addEventListener("click", () => {
    // TODO: send delete request to storage
    delBtn.parentElement.parentElement.remove();
    let ix = todos.map((el) => el.text).indexOf(item.firstChild.innerText);
    todos.splice(ix, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
  });
  btnBox.appendChild(delBtn);
  const inputBox = document.getElementById("input-box");
  const texts = todos.map((el) => el.text);
  // apply changes
  if (after) {
    inputBox.after(item);
  } else {
    list.appendChild(item);
  }

  // update list of todos if needed
  if (texts.indexOf(text) == -1 && after) {
    todos.unshift({ text: text, completed: completed });
  } else if (texts.indexOf(text) == -1 && !after) {
    todos.push({ text: text, completed: completed });
  }

  localStorage.setItem("todos", JSON.stringify(todos));
};

const submitBtn = document.querySelector("#submit");
submitBtn.addEventListener("click", () => {
  // do not apply task if it already exists
  const input = document.getElementById("create-task").value;
  if (todos.map((el) => el.text).indexOf(input) != -1) {
    alert("This task already exists!");
    return;
  }
  createItem(input, false, true);
});

const changeByParity = (parity, color) => {
  const items = list.children;
  for (let i = 2 - parity; i < items.length; i += 2) {
    let initbg = items.item(i).style.backgroundColor;
    items.item(i).style.backgroundColor = color;
    setTimeout(() => {
      items.item(i).style.backgroundColor = initbg;
    }, 1000);
  }
};

const oddBtn = document.querySelector("#odd");
oddBtn.addEventListener("click", () => {
  changeByParity(true, "#752f20");
});

const evenBtn = document.querySelector("#even");
evenBtn.addEventListener("click", () => {
  changeByParity(false, "#e06c9f");
});

const removeFirstBtn = document.querySelector("#remove-first");
removeFirstBtn.addEventListener("click", () => {
  list.removeChild(list.children[1]);
  todos.shift();
  localStorage.setItem("todos", JSON.stringify(todos));
});

const removeLastBtn = document.querySelector("#remove-last");
removeLastBtn.addEventListener("click", () => {
  list.removeChild(list.children[list.children.length - 1]);
  todos.pop();
  localStorage.setItem("todos", JSON.stringify(todos));
});

// load stored todos
window.onload = todos.forEach((item) => {
  createItem(item.text, item.completed, false);
});
