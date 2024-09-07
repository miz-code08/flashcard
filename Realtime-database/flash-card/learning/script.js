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

// Array to store the added words and their meanings

const randint = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var Score = 0;
var maxScore = 0;
var check = 0;
var randword = [];
var randomIndex = 0;

const btnCheck = document.getElementById("submit");

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
  var wordList = [];
  for (let [key, value] of Object.entries(data)) {
    const id = key;
    const word = value.word;
    const partOfSpeech = value.partOfSpeech;
    const meaning = value.meaning;
    wordList.push({ id, word, partOfSpeech, meaning });
  }
  return wordList;
};

var wordListWord = await loadData();
var wordListMeaning = wordListWord.slice();
const size = wordListWord.length * 2;

const updateCard = (randWord) => {
  const flip_card_front = document.getElementById("flip-card-front");
  const flip_card_back = document.getElementById("flip-card-back");
  const inputAns = document.getElementById("inputAns");
  randword = randWord;
  if (check) {
    flip_card_front.innerHTML = `<p class="title">${randWord.word}</p> <p>${randWord.partOfSpeech}</p>`;
    flip_card_back.innerHTML = `<p class="title">${randWord.meaning}</p>`;
    inputAns.innerHTML = `<input type="text" placeholder="Nhập nghĩa của từ trên thẻ" id="answer" autocomplete="off">`;
  } else {
    flip_card_front.innerHTML = `<p class="title">${randWord.meaning}</p> <p>${randWord.partOfSpeech}</p>`;
    flip_card_back.innerHTML = `<p class="title">${randWord.word}</p>`;
    inputAns.innerHTML = `<input type="text" placeholder="Nhập từ bằng tiếng anh có nghĩa trên thẻ" id="answer" autocomplete="off">`;
  }
};

const randWord = () => {
  console.log(wordListWord, wordListMeaning);

  // Kiểm tra độ dài của cả hai mảng
  if (wordListWord.length > 0 && wordListMeaning.length > 0) {
    // Chọn ngẫu nhiên một trong hai mảng
    check = randint(0, 1);
    const randomArray = check ? wordListWord : wordListMeaning;
    const randomIndex = randint(0, randomArray.length - 1);
    updateCard(randomArray[randomIndex]);
    return randomIndex;
  } else if (wordListWord.length > 0) {
    check = 1;
    const randomIndex = randint(0, wordListWord.length - 1);
    updateCard(wordListWord[randomIndex]);
    return randomIndex;
  } else if (wordListMeaning.length > 0) {
    check = 0;
    const randomIndex = randint(0, wordListMeaning.length - 1);
    updateCard(wordListMeaning[randomIndex]);
    return randomIndex;
  } else {
    // Cả hai mảng đều trống, không thể lấy random
    return -1;
  }
};

randomIndex = randWord(wordListWord);
var clickCheck = 1;
const CheckAns = () => {
  clickCheck = 0;
  const answerInput = document.getElementById("answer").value;
  const { word, meaning } = randword;
  const meanings = meaning.split(",").map((m) => m.trim().toLowerCase());
  const scoreValue = document.getElementById("score-value");
  const scoreProgress = document.getElementById("score-progress");
  const flip_card_back = document.getElementById("flip-card-back");
  const flip_card_inner = document.getElementById("flip-card-inner");

  let isCorrect = false;

  if (check) {
    if (meanings.includes(answerInput.toLowerCase())) {
      isCorrect = true;
      wordListWord.splice(randomIndex, 1);
    }
  } else {
    if (answerInput.trim().toLowerCase() === word.trim().toLowerCase()) {
      isCorrect = true;
      wordListMeaning.splice(randomIndex, 1);
    }
  }
  if (isCorrect) {
    Score += 1;
    scoreProgress.style.width = `${(Score / size) * 100}%`;
    scoreValue.innerHTML = Score; 
    maxScore = Math.max(maxScore, Score);
    flip_card_back.style.backgroundColor = `green`;
    flip_card_inner.style.transform = `rotateY(180deg)`;
    flip_card_back.addEventListener("click", () => {
      flip_card_back.style.visibility = 'hidden';
      flip_card_inner.style.transform = `rotateY(0deg)`;
      randomIndex = randWord();
      setTimeout(() => {
      flip_card_back.style.visibility = 'visible';
      }, 800);
      clickCheck = 1;
    });
    flip_card_back.innerHTML += `<p>Bấm vào thẻ để làm từ tiếp theo</p>`;
    setTimeout(() => {
      if (wordListWord.length === 0 && wordListMeaning.length === 0) {
        const continueLearn = confirm(`Bạn đã hoàn thành hết các từ vựng với chuỗi đúng dài nhất là ${maxScore} từ \n Bạn có muốn làm lại không `);
        if (continueLearn) location.reload();
        else window.location = "../home/index.html";
      }
      }, 2000);
  } else {
    Score = 0;
    scoreProgress.style.width = `${(Score / size) * 100}%`;
    scoreValue.innerHTML = Score
    scoreProgress.style.color = `red`;
    flip_card_back.innerHTML += `<p><del>${answerInput}</del></p>`;
    flip_card_back.innerHTML += `<p>Bấm vào thẻ để làm từ tiếp theo</p>`;
    flip_card_back.style.backgroundColor = `red`;
    flip_card_inner.style.transform = `rotateY(180deg)`;

    flip_card_back.addEventListener("click", () => {
      flip_card_back.style.visibility = 'hidden';
      flip_card_inner.style.transform = `rotateY(0deg)`;
      randomIndex = randWord();
      setTimeout(() => {
      flip_card_back.style.visibility = 'visible';
      }, 800);
      clickCheck = 1;
    });
  }
};

btnCheck.addEventListener("click", () => {
  if (clickCheck) CheckAns();
}); 
