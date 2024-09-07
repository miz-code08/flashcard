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

const textBoxInput = document.getElementById("inputform");
const wordListContent = document.getElementById("wordList");
const submitButton = document.getElementById("submit")
// Array to store the added words and their meanings
var wordList = [];

const randomId = () => {
  return Math.random().toString(36).substring(2, 10);
};

const getData = async () => {
  try {
    const starCountRef = ref(db, "FlashCard");
    const snapshot = await get(starCountRef);
    console.log("Data got Subccessfully");
    return snapshot.val();
  } catch (error) {
    console.log("Error getting data:", error.message);
  }
};

const loadData = async () => {
  const data = await getData();
  if (data == null) wordList = []
  else{
    for (let [key, value] of Object.entries(data)) {
      const id = key;
      const word = value.word;
      const partOfSpeech = value.partOfSpeech;
      const meaning = value.meaning;
      wordList.push({ id, word, partOfSpeech, meaning });
    }
  }
  updateTable();
};
loadData();

const standardizePartOfSpeech = (partOfSpeech) => {
  partOfSpeech = partOfSpeech.trim();
  const partOfSpeechList = ['danh từ', 'động từ', 'tính từ', 'trạng từ', 'giới từ', 'liên từ', 'đại từ', 'thán từ'];
  if (partOfSpeechList.includes(partOfSpeech.toLowerCase())) return partOfSpeech.charAt(0).toUpperCase() + partOfSpeech.slice(1).toLowerCase();
  const partOfSpeechMap = {
    'n': 'Danh từ',
    'v': 'Động từ',
    'adj': 'Tính từ',
    'adv': 'Trạng từ',
    'prep': 'Giới từ',
    'conj': 'Liên từ',
    'pron': 'Đại từ',
    'int': 'Thán từ'
  };

  if (partOfSpeechMap[partOfSpeech.toLowerCase().trim()]) {
    return partOfSpeechMap[partOfSpeech.toLowerCase().trim()];
  } else {
    alert(`không tồn tại loại từ ${partOfSpeech}`);
    return '';
  }
};

const addAllWord = () => {
  const word = textBoxInput.value;
  const ListTemp = word.split("\n");
  ListTemp.forEach((item, index) => {
    const listItem = item.split(".")
    if (listItem.length == 0) {alert(`dòng thứ ${index} không có dữ liệu`); return;}
    if (listItem.length != 3) {alert(`Sai định dạng ở dòng ${item}`); return;}
    const word = listItem[0];
    const partOfSpeech = standardizePartOfSpeech(listItem[1]);
    const meaning = listItem[2];
    addWord(word, partOfSpeech, meaning);
  })
}
// Add new word item
const addData = async (id, word, partOfSpeech, meaning) => {
  try {
    await set(ref(db, `FlashCard/${id}`), {
      word: word,
      partOfSpeech: partOfSpeech,
      meaning: meaning,
    });
    console.log("Data added successfully");
  } catch (error) {
    console.log("Error adding data:", error.message);
  }
};

const addWord = (word, partOfSpeech, meaning) => {
  const id = randomId();

  // Check if the word already exists in the list
  const existingWord = wordList.find(
    (item) => item.word === word && item.partOfSpeech === partOfSpeech
  );
  if (existingWord) {
    alert(`Từ vựng ${word} là ${partOfSpeech} đã tồn tại trong danh sách`);
    return;
  }
  wordList.push({ id, word, partOfSpeech, meaning });
  updateTable();
  addData(id, word, partOfSpeech, meaning);
};

const updateTable = () => {
  console.log(wordList);
  if (wordList.length == 0) {
    wordListContent.innerHTML = "<h2>chưa có từ vựng nào</h2>";
    return;
  }
  wordListContent.innerHTML = `
    <h2>Từ vựng đã thêm</h2>
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>Từ</th>
              <th>Loại từ</th>
              <th>Nghĩa</th>
            </tr>
          </thead>
        <tbody id="wordTable"></tbody>
    </table>`;
  const wordTable = document.getElementById("wordTable");
  wordList.forEach((item, index) => {
    const row = document.createElement("tr");

    const wordCell = document.createElement("td");
    wordCell.textContent = item.word;
    row.appendChild(wordCell);

    const partOfSpeechCell = document.createElement("td");
    partOfSpeechCell.textContent = item.partOfSpeech;
    row.appendChild(partOfSpeechCell);

    const meaningCell = document.createElement("td");
    meaningCell.textContent = item.meaning;
    row.appendChild(meaningCell);

    const idCell = document.createElement("td");
    idCell.textContent = item.id;
    idCell.style.display = "none";
    row.appendChild(idCell);

    // Thêm cột chức năng
    const actionCell = document.createElement("td");
    const actionIcons = document.createElement("div");
    actionIcons.classList.add("action-icons");

    // Thêm biểu tượng sửa
    const editIcon = document.createElement("i");
    editIcon.classList.add("fas", "bi");
    editIcon.classList.add("fas", "bi-pencil-square");
    editIcon.addEventListener("click", () => editWord(index));
    actionIcons.appendChild(editIcon);

    // Thêm biểu tượng xóa
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "bi");
    deleteIcon.classList.add("fas", "bi-trash3-fill");
    deleteIcon.addEventListener("click", () => deleteWord(index));
    actionIcons.appendChild(deleteIcon);

    actionCell.appendChild(actionIcons);
    row.appendChild(actionCell);
    wordTable.appendChild(row);
  });
  console.log(wordList);
};

// Edit todo item
const updateData = async (id, word, partOfSpeech, meaning) => {
  update(ref(db, "FlashCard/" + id), {
    word: word,
    partOfSpeech: partOfSpeech,
    meaning: meaning,
  })
    .then(() => {
      console.log("Data updated Subccessfully");
    })
    .catch((error) => {
      console.log("Error updating data: ", error.message);
    });
};

const options = ['Danh', 'Động', 'Tính', 'Trạng', 'Giới', 'Liên', 'Đại từ', 'Thán'];
const optionString = options
  .map((option, index) => `${index + 1}. ${option} từ`)
  .join("\n");

const editWord = (index) => {
  const wordToEdit = wordList[index];

  // Lấy giá trị mới cho word
  const newWordValue = prompt("Enter new word:");

  // Lấy giá trị mới cho partOfSpeech
  let newPartOfSpeechValue;
  do {
    newPartOfSpeechValue = prompt(
      `Please select an option:\n\n${optionString}`
    );
  } while (!options.includes(newPartOfSpeechValue.split(" ")[0]));

  // Lấy giá trị mới cho meaning
  const newMeaningValue = prompt("Enter new meaning:");

  // Cập nhật giá trị trong wordList
  wordToEdit.word = newWordValue;
  wordToEdit.partOfSpeech = newPartOfSpeechValue;
  wordToEdit.meaning = newMeaningValue;
  if (newWordValue == "" || newMeaningValue == "" || newPartOfSpeechValue == "")
    return;
  // Cập nhật bảng
  updateTable();
  updateData(
    wordToEdit.id,
    newWordValue,
    newPartOfSpeechValue,
    newMeaningValue
  );
};

const deleteData = async (id) => {
  remove(ref(db, "FlashCard/" + id))
    .then(() => {
      console.log("Data deleted Subccessfully");
    })
    .catch((error) => {
      console.log("Error deleting data: ", error.message);
    });
};

// Function to delete a word
const deleteWord = (index) => {
  // Remove the word from the list
  const wordToDelete = wordList[index];
  console.log(wordToDelete.id);
  deleteData(wordToDelete.id);
  wordList.splice(index, 1);
  updateTable();
};

updateTable();
submitButton.addEventListener("click", addAllWord);

const btnClearAll = document.getElementById("clear");

btnClearAll.addEventListener("click", () => {
  remove(ref(db, "FlashCard"))
    .then(() => {
      console.log("All data deleted Subccessfully");
      wordList = [];
      updateTable();
    })
    .catch((error) => {
      console.log("Error deleting all data: ", error.message);
    });
})
