const popup = JourneyPopup();

document.addEventListener("DOMContentLoaded", popup.init);

function JourneyPopup() {
  const init = () => {
    const actionsManager = document.querySelectorAll("[data-action]");
    if (actionsManager && actionsManager.length > 0) {
      actionsManager.forEach((a) => a.addEventListener("click", actionManager));
    }
  };

  function actionManager(e) {
    if (!e) return console.log("Invalid Event");

    const action = e?.srcElement?.dataset?.action;
    if (!action) return console.log("No action defined.");
    if (!chrome.runtime) return alert("Extension not installed");

    switch (action) {
      case "config":
      case "configure": {
        chrome.tabs.create({
          url: chrome.runtime.getURL("journey/config.html"),
        });

        break;
      }

      case "clear-storage": {
        const confirmed = confirm("CLEAR STORAGE! \nAre you sure?");

        if (!confirmed) return;
        localStorage.clear();

        break;
      }
    }
  }

  return { init };
}
