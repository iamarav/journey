{
  /**
   * Journey DOM Objects
   * @typedef {Record<string, HTMLElement | null>} JourneyDom
   */

  /**
   * Widget Params
   * @typedef {Object} WidgetParams
   * @property {Object} config Config Params
   * @property {JourneyDom} dom DOM Elements used.
   * @property {Record<string, string>} lsKeys Local Storage Keys
   */

  const journey = Journey();
  journey.init();
  journey.setWidgets(WidgetSearch, WidgetWelcome, WidgetClock, WidgetBookmarks);
  journey.start();

  /** Journey */
  function Journey() {
    const lsKeys = window.__lsKeys;

    /**
     * DOM Elements
     *
     * @returns {JourneyDom}
     */
    function dom() {
      const journey = document.querySelector("body.journey");

      if (!journey) return;

      return {
        header: journey.querySelector("header"),
        name: journey.querySelector("#name"),
        greetings: journey.querySelector("#greeting"),
        clocks: journey.querySelector("#clocks"),
        bgOverlay: journey.querySelector("#bg-overlay"),
        bookmarks: journey.querySelector("#bookmarks"),
        search: journey.querySelector("#search"),
        searchBox: journey.querySelector("#search-box"),
      };
    }

    function registerEvents() {
      onKeyPress([...__magicKeys.OPEN_CONFIG], () => {
        window.location.href = "./pages/config.html";
      });
    }

    function init() {
      const configExists = localStorage.getItem(lsKeys.CONFIG);

      if (!configExists)
        localStorage.setItem(lsKeys.CONFIG, JSON.stringify(__defaultConfig));

      registerEvents();
    }

    function setWidgets(...widgets) {
      const config = JSON.parse(localStorage.getItem(lsKeys.CONFIG));
      setBackgroundImage({ config, dom, lsKeys });
      setHeader({ config, dom });

      widgets.forEach((widget) => widget({ config, dom, lsKeys }).run());
    }

    function start() {}

    function clearStorage() {
      localStorage.clear();

      window.location.reload();
    }

    return {
      lsKeys,

      init,
      setWidgets,
      start,
      clearStorage,
    };
  }

  /** ++ Widgets ++ **/

  /**
   * Search Widget
   *
   * @param {WidgetParams} widgetParams
   * @returns
   */
  function WidgetSearch({ dom }) {
    function run() {
      let placeholder = "Search anything";

      if (__magicKeys.SEARCH) {
        onKeyPress([...__magicKeys.SEARCH], () => {
          dom().searchBox.focus();
        });

        placeholder += ` or press "${__magicKeys.SEARCH}"`;
      }

      dom().searchBox.placeholder = placeholder;
    }

    return {
      run,
    };
  }

  /**
   * Welcome Widget
   *
   * @param {WidgetParams} widgetParams
   * @returns
   */
  function WidgetWelcome({ config, dom, lsKeys }) {
    const $config = config?.widgets?.greeting;

    function getName(callback) {
      const name = localStorage.getItem(lsKeys.NAME);
      if (name) return callback(name);

      const newName = prompt("Please enter your name");
      if (!newName) return getName(callback);

      localStorage.setItem(lsKeys.NAME, newName);
      callback(newName);
    }

    function getGreetingBasedOnTime() {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const greetings = $config?.greetings;

      if (!greetings) return;

      if (currentHour >= 5 && currentHour < 12) {
        return greetings?.MORNING;
      } else if (currentHour >= 12 && currentHour < 16) {
        return greetings?.AFTERNOON;
      } else if (currentHour >= 16 && currentHour < 20) {
        return greetings?.EVENING;
      } else {
        return greetings?.NIGHT;
      }
    }

    function run() {
      if (!$config) return;
      getName((name) => {
        dom().greetings.innerHTML = getGreetingBasedOnTime() + ",&nbsp;";
        dom().name.innerText = name;
      });
    }

    return { run };
  }

  /**
   * Clock Widget
   *
   * @param {WidgetParams} widgetParams
   * @returns
   */
  function WidgetClock({ config, dom }) {
    const $config = config.widgets.clocks;

    const clocks = {};

    function createCards() {
      if (!$config) return;
      let $html = "";

      $config?.timezones?.forEach((tz) => {
        $html += `<div class="time-card">`;
        $html += `<h2 class="time" id="${tz.slug}-time">Loading...</h2>`;
        $html += `<p class="date" id="${tz.slug}-date">Loading...</p>`;
        $html += `<h2 class="time-zone">${tz.name}</h2>`;
        $html += `</div>`;
      });

      dom().clocks.innerHTML = $html;

      $config?.timezones?.forEach((tz) => {
        clocks[tz.slug] = {
          date: document.getElementById(tz.slug + "-date"),
          time: document.getElementById(tz.slug + "-time"),
          tz,
        };
      });
    }

    function updateTime() {
      const now = new Date();

      for (const el of Object.values(clocks)) {
        el["time"].innerText = now
          .toLocaleString("en-IN", { timeZone: el.tz.timezone })
          .split(", ")[1];
      }
    }

    function updateDate() {
      const now = new Date();

      for (const el of Object.values(clocks)) {
        el["date"].innerText = now
          .toLocaleString("en-IN", { timeZone: el.tz.timezone })
          .split(", ")[0];
      }
    }

    function run() {
      if (!$config) return;
      createCards();

      updateTime();
      updateDate();

      setInterval(updateTime, $config.refresh.refreshTime);
      setInterval(updateTime, $config.refresh.refreshDate);
    }

    return { run };
  }

  /**
   * Bookmarks Widget
   *
   * @param {WidgetParams} widgetParams
   * @returns
   */
  function WidgetBookmarks({ config, dom }) {
    const $config = config?.widgets?.bookmarks;

    function prepareHtml() {
      if (!$config) return;

      const { urlToFetchFavicon } = $config;

      let $html = "";

      $config.sections.forEach((section) => {
        $html += `<h4 class="bs-title text-center">${section.title}</h4>`;
        $html += `<div class="bookmark-container">`;

        section.links.forEach((bm, idx) => {
          const $bmFavicon = urlToFetchFavicon.replace("{domain}", bm.url);

          const size = idx < 3 ? "large" : "small";

          $html += `<a href="${bm.url}" class="bookmark bm-link ${size}">
          <img class="bm-icon" alt="${bm.name}" src="${$bmFavicon}" />
          <span class="bm-name">&nbsp;${bm.name}</span>        
        </a>`;
        });
      });

      $html += `</div>`;

      dom().bookmarks.innerHTML = $html;
    }

    function run() {
      if (!$config) return;
      prepareHtml();
    }

    return { run };
  }

  /** ++ Events ++ **/

  /**
   *
   * @param {Array<string>} keys
   * @param {Function} callback
   */
  function onKeyPress(keys, callback) {
    document.addEventListener("keypress", function (event) {
      if (!Array.isArray(keys)) {
        return console.error("keys must be an array");
      }

      const keyPressed = event.key; // e.g., "/"
      const keyCodePressed = event.which || event.keyCode;

      if (keys.includes(keyCodePressed) || keys.includes(keyPressed)) {
        event.preventDefault();
        return callback(event);
      }
    });
  }

  async function setBackgroundImage({ config, lsKeys, dom }) {
    const storedImage = localStorage.getItem(lsKeys.BG_IMG);
    if (storedImage) {
      dom().bgOverlay.style.backgroundImage = `url(${storedImage})`;
    }

    const response = await fetch(config.bgImg.url);
    const blob = await response.blob();

    const reader = new FileReader();
    reader.readAsDataURL(blob);

    reader.onloadend = () => {
      const base64data = reader.result;

      localStorage.setItem(lsKeys.BG_IMG, base64data);

      // Update the background image with the new one
      if (!storedImage)
        dom().bgOverlay.style.backgroundImage = `url(${base64data})`;
    };
  }

  function isExtensionInstalled() {
    return !location.protocol.includes("http");
  }

  async function setHeader({ dom, config }) {
    dom().header.innerHTML = `
      <a href="${config.githubLink}" target="_blank">GitHub</a>
      | <a href="./pages/config.html" target="_blank">Config</a>
    `;
    if (!isExtensionInstalled()) {
      dom().header.innerHTML += ` | <a target="_blank" href="${config.installLink}">Install</a>`;
    }
  }
}
