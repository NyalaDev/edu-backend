/**
 * Store all app settings here till figure out strapi
 */
class Settings {
  constructor() {
    if (Settings.instance instanceof Settings) {
      return Settings.instance;
    }
    this.appSettings = {
      youtubeApiKey: '',
    };

    Object.freeze(this);

    Settings.instance = this;
  }

  get(key) {
    return this.appSettings[key];
  }

  set(key, value) {
    this.appSettings[key] = value;
  }
}

module.exports = Settings;
