import Axios from "axios";
import settings from "../settings";

export default class RestClient {
  constructor() {
    this.axios = Axios.create({
      baseURL: settings.base_url + "/client_api",
      maxContentLength: Infinity,
    });
    window._axios = this.axios;
  }
}
