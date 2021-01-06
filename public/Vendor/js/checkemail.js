const auth = firebase.auth();
var email = window.localStorage.getItem("emailForSignIn");
if(!email)
email = window.prompt("Provide your email address")
var credentialemail = firebase.auth.EmailAuthProvider.credentialWithLink(
  email,
  window.location.href
);

auth.currentUser
  .linkWithCredential(credentialemail)
  .then((usercred) => {
    console.log("successfully linked", usercred);
  console.log("Logged In")})
  .catch((error) => {
    console.log("error - Sign Up")
    console.log(error);
  });
