// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getDatabase,
  set,
  ref,
  update,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5X99chT6OvJ2rDLfqFL1MrKh8uMNMFa8",
  authDomain: "learn-firebase-52523.firebaseapp.com",
  projectId: "learn-firebase-52523",
  storageBucket: "learn-firebase-52523.appspot.com",
  messagingSenderId: "561012229632",
  appId: "1:561012229632:web:e6ce6d34a5e03f8409bae5",
  measurementId: "G-F57SXYMZGJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth();

// Get the signup and signin containers
const signupContainer = document.getElementById("signup-container");
const signinContainer = document.getElementById("signin-container");

// Get the toggle links
const signupTosigninLink = document.getElementById("signup-to-signin");
const signinTosignupLink = document.getElementById("signin-to-signup");

// Get the signup and signin buttons
const signupButton = document.getElementById("btn-signup");
const signinButton = document.getElementById("btn-signin");

signupTosigninLink.addEventListener("click", (e) => {
  signupContainer.style.display = "none";
  signinContainer.style.display = "block";
});

signinTosignupLink.addEventListener("click", (e) => {
  signupContainer.style.display = "block";
  signinContainer.style.display = "none";
});

const validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(username);
};

const validateEmail = (email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const username = document.getElementById("signup-username");
const email = document.getElementById("signup-email");
const password = document.getElementById("signup-password");
const repassword = document.getElementById("signup-repassword");

var checkUsername = false;
var checkEmail = false;
var checkPassword = false;
var checkRepassword = false;

username.addEventListener("click", (e) => {
  checkUsername = true;
});

email.addEventListener("click", (e) => {
  checkEmail = true;
});

const checkValidate = () => {
  const errolUsername = document.getElementById("errol-username");
  const errolEmail = document.getElementById("errol-email");
  const errolPassword = document.getElementById("errol-password");
  const errolRepassword = document.getElementById("errol-repassword");

  if (
    !validateUsername(username.value) &&
    checkUsername &&
    username.value != ""
  )
    errolUsername.textContent = "Tên không được chứa kí tự đặt biệt";
  if (username.value === "" && checkUsername)
    errolUsername.textContent = "Tên không được để trống";
  if (validateUsername(username.value) && username.value != "")
    errolUsername.textContent = "";

  if (!validateEmail(email.value) && checkEmail && email.value != "")
    errolEmail.textContent = "Email không hợp lệ";
  if (email.value === "" && checkEmail)
    errolEmail.textContent = "Email không được để trống";
  if (validateEmail(email.value) && email.value != "")
    errolEmail.textContent = "";

  if (
    !validatePassword(password.value) &&
    checkPassword &&
    password.value != ""
  )
    errolPassword.textContent = "Mật khẩu phải có ít nhât 8 kí tự";
  else errolPassword.textContent = "";

  if (password.value != repassword.value && checkRepassword)
    errolRepassword.textContent = "Mật khẩu không trùng khớp";
  else errolRepassword.textContent = "";
};

setInterval(checkValidate, 1000);

document.getElementById("signup-password").addEventListener("click", (e) => {
  document.querySelector("#signup-container .eye").style.display = "block";
});

document.getElementById("signin-password").addEventListener("click", (e) => {
  document.querySelector("#signin-container .eye").style.display = "block";
});

const checkEye = (query) => {
  const eyeIcon = document.querySelector(`#${query}-container .bi-eye-fill`);
  const eyeSlashIcon = document.querySelector(
    `#${query}-container .bi-eye-slash-fill`
  );

  if (eyeIcon.style.display !== "none") {
    eyeIcon.style.display = "none";
    eyeSlashIcon.style.display = "inline-block";
    document.getElementById(`${query}-password`).type = "text";
  } else {
    eyeIcon.style.display = "inline-block";
    eyeSlashIcon.style.display = "none";
    document.getElementById(`${query}-password`).type = "password";
  }
};
document
  .querySelector("#signup-container .eye")
  .addEventListener("click", (e) => {
    checkEye("signup");
  });
document
  .querySelector("#signin-container .eye")
  .addEventListener("click", (e) => {
    checkEye("signin");
  });

signupButton.addEventListener("click", (e) => {
  var username = document.getElementById("signup-username").value;
  var email = document.getElementById("signup-email").value;
  var password = document.getElementById("signup-password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // sign up
      const user = userCredential.user;
      alert(`user ${username} created`);
      set(ref(database, "users/" + user.uid), {
        username: username,
        email: email,
      });
      signupContainer.style.display = "none";
      signinContainer.style.display = "block";
    })
    .catch((error) => {
      alert(error.message);
    });
});

signinButton.addEventListener("click", (e) => {
  const email = document.getElementById("signin-email").value;
  const password = document.getElementById("signin-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // signed in
      const user = userCredential.user;
      // ...
      const now = new Date();
      update(ref(database, "users/" + user.uid), {
        last_login: now,
      });
      alert(`user ${email} signed in!`);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(error.message);
    });
});
