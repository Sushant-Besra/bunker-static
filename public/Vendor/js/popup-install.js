const btnAdd = document.getElementById("stick");
const btninstall = document.getElementById("install-button");
const btnclose = document.getElementById("close-pop")
console.log("in the insatll");
var deferredPrompt;
let closeclicked = false;

window.addEventListener("beforeinstallprompt", (e) => {
  try {
    deferredPrompt = e;
    console.log(deferredPrompt);
    if (window.matchMedia("(display-mode: standalone)").matches || closeclicked) {
      console.log("Already installed");
    } else btnAdd.style.display = "flex";
  } catch (error) {
    console.log(error);
  }
});

btninstall.addEventListener("click", () => {
  try {
    btnAdd.style.display = "none";
    closeclicked = true;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      }
      deferredPrompt = null;
    });
  } catch (error) {
    console.log("error", error);
  }
});
window.addEventListener("appinstalled", (evt) => {
  app.logEvent("installed").catch((e) => app.logEvent(e));
});

btnclose.addEventListener("click",()=>{
    btnAdd.style.display="none";
    closeclicked = true;

})