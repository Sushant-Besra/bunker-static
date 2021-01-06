const googlein = document.getElementById("sign-in-google");
const enterotp = document.getElementById("enterotp");
const sendotp = document.getElementById("getotp");
const loginbuton = document.getElementById("login-button");
//
const signenterotp = document.getElementById("sign_enterotp");
const signgetotp = document.getElementById("sign_getotp");
var token;
var email;
const auth = firebase.auth();
var user = auth.currentuser;
auth.useDeviceLanguage();
//--> google sign in --
const signinwithgoogle = () => {
  const googleprovider = new firebase.auth.GoogleAuthProvider();

  auth
    .signInWithPopup(googleprovider)
    .then((result) => {
      console.log(result);
      var credential = result.credential;
      token = credential.accessToken;
      user = result.user;
      console.log("logged in");
    })
    .catch((error) => {
      console.log(error);
    });
};
googlein.addEventListener("click", signinwithgoogle);
//-- google sign in <--

//--> phone no sign in --

recaptchasetup = () => {
  console.log("captcha verifier function");
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("captcha", {
    size: "invisible",
    callback: function (response) {
      console.log("created captcha");
      return;
    },
  });
};

onSignInSubmit = () => {
  const phoneNumber = document.getElementById("phone_no").value;
  console.log(phoneNumber);
  recaptchasetup();
  const appVerifier = window.recaptchaVerifier;
  auth
    .signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      // ...
      console.log("code sent");
    })
    .catch((error) => {
      // Error; SMS not sent
      // ...
      console.log(error);
    });
};

onOtpCheck = () => {
  const code = document.getElementById("otp_code").value;
  console.log(code);
  var credential = firebase.auth.PhoneAuthProvider.credential(
    confirmationResult.verificationId,
    code
  );
  auth
    .signInWithCredential(credential)
    .then((result) => {
      if (result.user.email === null) {
        console.log("Account not Found.. Please Register");
        auth.signOut();
        return;
      }
      user = result.user;
      console.log("user", user);
    })
    .catch((error) => {
      console.log(error);
    });
};

sendotp.addEventListener("click", onSignInSubmit);
enterotp.addEventListener("click", onOtpCheck);

// Sign up form
var actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: "http://localhost:5000/emailverification.html",
  // This must be true.
  handleCodeInApp: true,
};

signrecaptcha = () => {
  console.log("captcha verifier function");

  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "sign_captcha",
    {
      size: "invisible",
      callback: function (response) {
        console.log("created captcha");
        return;
      },
    }
  );
};

OnSignUpSubmit = () => {
  email = document.getElementById("sign_email_id").value;
  const phone_no = document.getElementById("sign_phone_no").value;
  signrecaptcha();
  const appVerifier = window.recaptchaVerifier;
  auth
    .signInWithPhoneNumber(phone_no, appVerifier)
    .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      // ...
      firebase
        .auth()
        .sendSignInLinkToEmail(email, actionCodeSettings)
        .then(() => {
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          window.localStorage.setItem("emailForSignIn", email);
          console.log("verification email has been sent")
          // ...
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);

          // ...
        });
      console.log(window.confirmationResult);
    })
    .catch((error) => {
      // Error; SMS not sent
      // ...
      console.log(error);
    });
};
onSignOtpCheck = async () => {
  const code = document.getElementById("sign_otp_code").value;
  console.log(code);
  var credential = firebase.auth.PhoneAuthProvider.credential(
    confirmationResult.verificationId,
    code
  );
  await auth
    .signInWithCredential(credential)
    .then((result) => {
      user = result.user;

      //setting email

     
      
      console.log("user", user);
    })
    .catch((error) => {
      console.log(error);
    });
};

signgetotp.addEventListener("click", OnSignUpSubmit);
signenterotp.addEventListener("click", onSignOtpCheck);

signout = () => {
  auth
    .signOut()
    .then(() => console.log("signed out"))
    .catch((error) => console.log(error));
};
auth.onAuthStateChanged((firebaseUser) => {
  if (firebaseUser) {
    user = firebaseUser;
    console.log(firebaseUser);
  } else {
    console.log("no user");
  }
});
