/***************************Index******************************* */
let btn1 = document.getElementById("btn1");
let nextPage = () => {
  window.location.href = "./pages/signup.html";
};
if (btn1) {
  btn1.addEventListener("click", nextPage);
}


// *****************************firebase**************************
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getDatabase, ref as ref_database, set, onValue, child, get } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { getStorage, ref as ref_storage, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyBTbhbHuoaE3cwf9E0cmsAu2vTcpVBLASM",
  authDomain: "e-commerce-dc184.firebaseapp.com",
  databaseURL: "https://e-commerce-dc184-default-rtdb.firebaseio.com",
  projectId: "e-commerce-dc184",
  storageBucket: "e-commerce-dc184.appspot.com",
  messagingSenderId: "866835081660",
  appId: "1:866835081660:web:91f1333624e460c9a5e3b9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

//*************************************signup****************************** */
let sign_up = document.getElementById("sign_up");

let signup = () => {
  let username = document.getElementById("name");
  let contact = document.getElementById("contact");
  let password = document.getElementById("password");
  let email = document.getElementById("email");
  let role = document.getElementsByName("role");
  let fillFields = false;
  let userData = {
    username: username.value,
    contact: contact.value,
    password: password.value,
    email: email.value,
  };

  if (username.value == "" && contact.value == "" && password.value == "" && email.value == "") {
    let p4 = document.getElementById("p4");
    p4.innerText = "Fill out all fields!!";
    username.style.borderColor = "red";
    contact.style.borderColor = "red";
    password.style.borderColor = "red";
    email.style.borderColor = "red";
  }
  else if (username.value == "") {
    username.style.borderColor = "red";
  }
  else if (contact.value == "") {
    contact.style.borderColor = "red";
  }
  else if (password.value == "") {
    password.style.borderColor = "red";
  }
  else if (email.value == "") {
    email.style.borderColor = "red";
  }
  else {
    for (let i = 0; i < role.length; i++) {
      if (role[i].checked) {
        if (role[i].value == "user") {
          var roleVal = role[i].value;
          userData.role = roleVal;
          fillFields = true;
          console.log("userr login");
          break;

        }
        else if (role[i].value == "admin") {
          var roleVal = role[i].value;
          userData.role = roleVal;
          fillFields = true;
          console.log("admin login");
          break;
        }
      }
      else {
        console.log("Select your role");
      }
    };
    if (fillFields) {
      createUserWithEmailAndPassword(auth, userData.email, userData.password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("user", user);
          userData.uid = user.uid;

          const userRef = ref_database(database, 'users/' + user.uid);
          set(userRef, userData)

            .then(() => {
              console.log("User data written to the database");
              window.location.href = './signin.html';
            })
            .catch((error) => {
              console.error("Error writing user data to the database: ", error);
            });
        })

        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("ErrorCode :", errorCode);
          console.log("ErrorMessage", errorMessage);
        });
    }
  }
};

if (sign_up) {
  sign_up.addEventListener("click", signup);
}



// *******************************signIn******************************

let sign_in = document.getElementById("sign_in");
let signin = () => {
  let password = document.getElementById("password").value;
  let email = document.getElementById("email").value;
  let userRole;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(email);
      console.log(user);
      onValue(ref_database(database, 'users/' + user.uid), (snapshot) => {
        const user_role = (snapshot.val() && snapshot.val().role) || 'Anonymous';
        userRole = user_role;
        if (userRole == "user") {
          window.location.href = './ui_1.html';
        }
        else if (userRole == "admin") {
          window.location.href = '../admin/admin_ui1.html';
        }
      });
      console.log("Logged in successfully...");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("ErrorCode :", errorCode);
      console.log("ErrorMessage", errorMessage);
    });
};
if (sign_in) {
  sign_in.addEventListener("click", signin);
}



//////////////////////////////Storage////////////////////////////////////

// let upload = document.getElementById("upload");
// const uploadFile = (file) => {
//   return new Promise((resolve, reject) => {
//     const imagesRef = ref_storage(storage, `images/adminData/${file.name}`);
//     const uploadTask = uploadBytesResumable(imagesRef, file);
//     uploadTask.on('state_changed',
//       (snapshot) => {
//         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log('Upload is ' + progress + '% done');
//         switch (snapshot.state) {
//           case 'paused':
//             console.log('Upload is paused');
//             break;
//           case 'running':
//             console.log('Upload is running');
//             break;
//         }
//       },
//       (error) => {
//         reject(error)
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//           resolve(downloadURL);
//         });
//       });
//   });
// };
// if (upload) {
//   upload.addEventListener("click", async () => {
//     try {
//       let file = document.getElementById("file");
//       const res = await uploadFile(file.files[0]);
//       console.log("res --> ", res);
//     }
//     catch (err) {
//       console.log("err --> ", err);
//     }
//   });
// }
// *****************************get data*********************************

// **********************************admin_ui_1********************************


let upload = document.getElementById("upload");
let productDetail;
let idz = 0;
const uploadFile = (file) => {
  let itemName = document.getElementById("item_name");
  let category = document.getElementById("cate");
  var text = category.options[category.selectedIndex].text;
  let description = document.getElementById("descript");
  let unit = document.getElementById("unit");
  let price = document.getElementById("price");
  productDetail = {
    itemName: itemName.value,
    category: text,
    description: description.value,
    unit: unit.value,
    price: price.value,
    productId: idz++
  }
  // const dataRef = ref_database(database, `products/details/${productDetail.itemName}`);
  // set(dataRef, productDetail)

  return new Promise((resolve, reject) => {
    const imagesRef = ref_storage(storage, `images/adminData/${file.name}`);
    const uploadTask = uploadBytesResumable(imagesRef, file);
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        reject(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
          let image = downloadURL;
          console.log("utlllll", image);
        });
      });
  });
};
if (upload) {
  upload.addEventListener("click", async () => {
    try {
      let file = document.getElementById("file");
      const res = await uploadFile(file.files[0]);
      console.log("res --> ", res);
      let imageURL = res;
      productDetail.URLimage = imageURL;
      const productDetailRef = ref_database(database, `products/details/` + `${productDetail.productId}`);
      set(productDetailRef, productDetail);
    }
    catch (err) {
      console.log("err --> ", err);
    }
  });
}

// **********************************ui_1********************************
let addImg = document.getElementById("");
let addProductName = document.getElementById("addProductName");
let addPrice = document.getElementById("addPrice");
const dataRef = ref_database(database, 'products/details/');
const getProduct = () => {
 
  const userId = auth.currentUser.uid;
  return onValue(ref(db, '/users/' + userId), (snapshot) => {
    const username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    // ...
  }, {
    onlyOnce: true
  });
  // get(child(dataRef, `products/details/`)).then((snapshot) => {
  //   if (snapshot.exists()) {
  //     console.log(snapshot.val());
  //   } else {
  //     console.log("No data available");
  //   }
  // }).catch((error) => {
  //   console.error(error);
  // });
     };
      getProduct();
  
  
  

