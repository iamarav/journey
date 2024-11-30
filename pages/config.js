function Config() {
  const lsKeys = window.__lsKeys;

  const form = document.querySelector("form#config-update");

  const configName = form.querySelector("#jname"),
    configValue = form.querySelector("#jconfig");

  configName.value = localStorage.getItem(lsKeys.NAME);
  configValue.value = JSON.stringify(
    JSON.parse(localStorage.getItem(lsKeys.CONFIG)),
    null,
    4
  );

  form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    localStorage.setItem(lsKeys.NAME, configName.value);
    localStorage.setItem(lsKeys.CONFIG, configValue.value);

    alert("Config saved successfully!");
  });

  const utilities = document.querySelector("#utilities");

  const clearStorage = utilities.querySelector("button#clear");
  clearStorage.addEventListener("click", () => {
    const confirmed = confirm("CLEAR STORAGE! \nAre you sure?");

    if (!confirmed) return;
    localStorage.clear();
  });

  const restoreConfig = utilities.querySelector("button#restore");
  restoreConfig.addEventListener("click", () => {
    const confirmed = confirm("RESTORE CONFIG? \nAre you sure?");

    if (!confirmed) return;
    localStorage.clear();
    localStorage.setItem(lsKeys.CONFIG, JSON.stringify(__defaultConfig));

    window.location.reload();
  });

  const help = document.querySelector("#help");

  help.innerHTML = Object.entries(__magicKeys)
    .map(([key, value]) => {
      return `${key}: ${value}`;
    })
    .join(`<br />`);
}

Config();
