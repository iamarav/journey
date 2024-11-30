window.__defaultConfig = Object.freeze({
  widgets: {
    clocks: {
      timezones: [
        {
          slug: "ist",
          timezone: "Asia/Kolkata",
          name: "IST",
        },
        {
          slug: "est",
          timezone: "America/New_York",
          name: "New York",
        },
        {
          slug: "pst",
          timezone: "America/Los_Angeles",
          name: "California",
        },
        {
          slug: "utc",
          timezone: "UTC",
          name: "UTC",
        },
        {
          slug: "tokyo",
          timezone: "Asia/Tokyo",
          name: "Tokyo",
        },
      ],
      refresh: {
        refreshTime: 1000,
        refreshDate: 60 * 60 * 100,
      },
    },
    greeting: {
      greetings: {
        MORNING: "Good morning",
        AFTERNOON: "Good afternoon",
        EVENING: "Good evening",
        NIGHT: "Good night",
        DAY: "Good day",
        NOON: "Good noon",
      },
    },
    bookmarks: {
      urlToFetchFavicon: "http://www.google.com/s2/favicons?domain={domain}",
      sections: [
        {
          title: "Bookmarks",
          links: [
            {
              name: "Google",
              url: "https://www.google.com",
            },
            {
              name: "Youtube",
              url: "https://www.youtube.com",
            },
            {
              name: "Youtube Music",
              url: "https://music.youtube.com",
            },
            {
              name: "GitHub",
              url: "https://www.github.com",
            },
            {
              name: "LinkedIn",
              url: "https://www.linkedin.com",
            },
          ],
        },
      ],
    },
  },
  bgImg: {
    url: "https://picsum.photos/1280/768",
  },
});

window.__magicKeys = Object.freeze({
  SEARCH: "/",
  OPEN_CONFIG: "|",
});

window.__lsKeys = Object.freeze({
  CONFIG: "journey_config",
  NAME: "journey_uname",
  BG_IMG: "journey_bgimg",
});
