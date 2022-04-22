import { fbAccessTokenSelector } from "../redux/settings/settings.selector";
import store from "../redux/store";
import settings from "../settings";
import RestClient from "./RestClient";

export const LOGIN_FACEBOOK = "LOGIN_FACEBOOK";

/**
 * Facebook Manager
 * Wrappers for FB SDK
 */
export class FacebookManager extends RestClient {
  constructor() {
    super();
    this.init = false;
  }

  /**
   * Fetch the profile picture of a user
   * @param {string} userId Facebook User ID to fetch the profile picture of
   * @returns {Promise<string>} Profile Picture URL or null
   */
  async fetchProfilePicture(userId) {
    // #TODO Fetch from the callertech apis
    return this.fetchProfilePictureFromFb(userId);
    // #TODO Save to the callertech apis
  }

  /**
   * Fetches the profile picture from FB
   * @param {string} userId Facebook User ID to fetch the profile picture of
   * @returns {Promise<string>} Profile Picture URL or null
   */
  async fetchProfilePictureFromFb(userId) {
    try {
      if (!this.init) {
        await this.initFacebookSdk();
      }
      const profileResponse = await this.fbAPI(`/${userId}/picture`);
      console.log("fetchProfilePicture Response:", profileResponse);
      if (
        !profileResponse ||
        !profileResponse.data ||
        profileResponse.data.is_silhouette
      ) {
        throw new Error("Profile Picture Not Found");
      }
      return profileResponse.data.url;
    } catch (e) {
      console.error("fetchProfilePicture", e);
      return null;
    }
  }

  /**
   * Makes an API call using the current access token
   * @param {string} url
   * @returns {Promise<>}
   */
  fbAPI(url) {
    if (!this.accessToken) return Promise.reject("Not Logged In");
    return new Promise((resolve) =>
      window.FB.api(
        url,
        {
          access_token: this.accessToken,
        },
        resolve
      )
    );
  }

  /** Current Access Token */
  get accessToken() {
    return fbAccessTokenSelector(store.getState());
  }

  /**
   * Initliazes Facebook SDK
   * @returns {Promise} Resolves when FB is initialized
   */
  initFacebookSdk() {
    return new Promise((resolve) => {
      // wait for facebook sdk to initialize before starting the react app
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: settings.fbAppId,
          cookie: true,
          xfbml: true,
          version: "v8.0",
        });
        resolve();
      };

      // load facebook sdk script
      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    });
  }
}

export default new FacebookManager();
