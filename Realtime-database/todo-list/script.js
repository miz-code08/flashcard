// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getDatabase,
  set,
  ref,
  update,
  onValue,
  get,
  remove,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5X99chT6OvJ2rDLfqFL1MrKh8uMNMFa8",
  authDomain: "learn-firebase-52523.firebaseapp.com",
  databaseURL: "https://learn-firebase-52523-default-rtdb.firebaseio.com",
  projectId: "learn-firebase-52523",
  storageBucket: "learn-firebase-52523.appspot.com",
  messagingSenderId: "561012229632",
  appId: "1:561012229632:web:be2ddd92496633d009bae5",
  measurementId: "G-PLLLT1QC70",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

const randomId = () => {
  return Math.random().toString(36).substring(2, 10);
};

// Load item
const getData = async () => {
  try{
    const starCountRef = ref(db, "TodoList");
    const snapshot = await get(starCountRef);
    console.log("Data got Subccessfully")
    return snapshot.val(); 
  }
  catch(error) {
    console.log("Error getting data:", error.message);
  }
};


const loadData = async () => {
  const data = await getData();
  for (let [key, value] of Object.entries(data)) {
    const newTodo = document.createElement("li");
    const completed = value.completed ? " completed" : "";
    newTodo.innerHTML = `
          <div class="task${completed}" id="${key}">${value.data}</div>
          <a href="#" class="delete-btn">&#10006;</a>
          <i class="fas fa-edit edit-btn"></i>
        `;
    todoList.querySelector("ul").appendChild(newTodo);
  }
};

loadData();

// Add new todo item
const addData = async (id, data, completed) => {
  try {
    await set(ref(db, `TodoList/${id}`), {
      data: data,
      completed: completed,
    });
    console.log("Data added successfully");
  } catch (error) {
    console.log("Error adding data:", error.message);
  }
};

const addTask = () => {
  if (todoInput.value.trim() !== "") {
    const newTodo = document.createElement("li");
    const id = randomId();
    newTodo.innerHTML = `
          <div class="task" id="${id}">${todoInput.value}</div>
          <a href="#" class="delete-btn">&#10006;</a>
          <i class="fas fa-edit edit-btn"></i>
        `;
    todoList.querySelector("ul").appendChild(newTodo);
    addData(id, todoInput.value, false);
    todoInput.value = "";
  }
};

addBtn.addEventListener("click", () => {
  addTask();
});
var checkSelected = false;
document.addEventListener(
  "focus",
  (event) => {
    if (event.target.tagName.toLowerCase() === "input") {
      const selectedInput = event.target;
      checkSelected = true;
    }
  },
  true
);

document.addEventListener(
  "blur",
  (event) => {
    if (event.target.tagName.toLowerCase() === "input") {
      const selectedInput = event.target;
      checkSelected = false;
    }
  },
  true
);

document.addEventListener(
  "keypress",
  (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      if (checkSelected) addTask();
    }
  },
  true
);

// Delete todo item
const deleteData = async (id) => {
  remove(ref(db, "TodoList/" + id))
    .then(() => {
      console.log("Data deleted Subccessfully");
    })
    .catch((error) => {
      console.log("Error deleting data: ", error.message);
    });
};

todoList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const elementToDelete = event.target.parentElement;
    deleteData(elementToDelete.querySelector("div").id);
    elementToDelete.remove();
  }
  if (event.target.classList.contains("task")) {
    const todoItem = event.target.parentElement;
    console.log("ok");
    event.target.classList.toggle("completed");
    const elementToUpdate = event.target.parentElement;
    var completed = event.target.classList.contains("completed");
    updateData(
      elementToUpdate.querySelector("div").id,
      todoItem.querySelector("div").textContent,
      completed
    );
  }
});

// Edit todo item
const updateData = async (id, data, completed) => {
  update(ref(db, "TodoList/" + id), {
    data: data,
    completed: completed,
  })
    .then(() => {
      console.log("Data updated Subccessfully");
    })
    .catch((error) => {
      console.log("Error updating data: ", error.message);
    });
};

todoList.addEventListener("click", (event) => {
  if (event.target.classList.contains("edit-btn")) {
    const todoItem = event.target.parentElement;
    const todoText = todoItem.querySelector("div").textContent;
    const newTodoText = prompt("Edit todo: ", todoText);
    if (newTodoText !== null && newTodoText.trim() !== "") {
      todoItem.querySelector("div").textContent = newTodoText;
      const elementToUpdate = event.target.parentElement;
      const completed = elementToUpdate.classList.contains("completed");
      updateData(
        elementToUpdate.querySelector("div").id,
        newTodoText,
        completed
      );
      console.log(completed);
    }
  }
});