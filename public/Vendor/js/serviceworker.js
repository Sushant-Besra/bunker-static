if ("serviceWorker" in navigator) {
    console.log(" trying registering service worker");
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("service worker registered",reg))
      .catch((err) => console.log("service worker not registered",err));
  }