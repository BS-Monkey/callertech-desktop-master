import Axios from "axios";
import store from "../redux/store";
import logout from "../redux/actionCreators/thunk/logout";
import { enqueueSnackbar } from "../redux/actionCreators/notify";
import { internalOnlySelector } from "../redux/selectors/did.selector";
import { userDataSelector } from "../redux/settings/settings.selector";
import settings from "../settings";
class APImanager {
  constructor() {
    this.axios = Axios.create({
      baseURL: settings.base_url + "/client_api",
      maxContentLength: Infinity,
    });
    window._axios = this.axios;
  }

  async lifelife(info = {}) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let data = { ...info, token: userdata.token };
    let response;
    try {
      response = await this.axios.post("lifeline", data);
    } catch (e) {
      console.log(e);
      return false;
    }
    if (response && response.data) return response.data;
    return false;
  }
  async getVersion() {
    let response;
    const l = new Date();
    response = await Axios.get(
      `${window.location.origin}/version.json?t=${l.getTime()}`
    );
    if (!response || !response.data) {
      return;
    }
    return response.data.version;
  }
  async login(username, password) {
    let data = {};
    let response;
    const headers = {
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 
      'Access-Control-Allow-Headers': '*', 
      'Access-Control-Max-Age': '1728000', 
      'Content-Type': 'text/plain', 
    }
    console.log(headers)
    try {
      ({ data } = await this.axios.post("/subaccount_login", {
        username,
        password,
      }, {
        headers: headers
      }));
    } catch (e) {
      console.log('error', e)
      response = {
        userdata: null,
        error:
          "Couldn't login. Please check your internet connection or try again.",
      };
    }
    if (!response) {
      response = {
        userdata: data.data,
        error: data.message,
      };
      if (data.status == "success") {
        response.error = "";
      }
    }
    // console.log(response);
    return response;
  }

  async togglePhoneRouting({ forwarding_number, phonenumber }) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let data = { phonenumber, token: userdata.token };
    if (forwarding_number) {
      data.no_toggle = true;
      data.forwarding_number = forwarding_number;
    }
    let response;
    try {
      response = await this.axios.post("toggle_sip", data);
    } catch (e) {
      this.handleError(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async saveScheduledCall(time, phonenumber, notes, edit = null) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let data = { phonenumber, time, notes, token: userdata.token };
    let response;
    try {
      let url = "schedule";
      if (edit) {
        url += "/" + edit;
        response = await this.axios.put(url, data);
      } else {
        console.log(data);
        response = await this.axios.post(url, data);
      }
    } catch (e) {
      console.log(e);
      this.handleError(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async deleteScheduledCall(id) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let data = { token: userdata.token };
    console.log(data);
    let response;
    try {
      let url = "schedule/" + id + "?token=" + userdata.token;
      response = await this.axios.delete(url, {
        params: data,
      });
    } catch (e) {
      console.log(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async getScheduledCalls() {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      response = await this.axios.get("schedule", {
        params: { token: userdata.token },
      });
    } catch (e) {
      this.handleError(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async readVoicemail(id) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      response = await this.axios.get("voicemail_read", {
        params: { uuid: id, token: userdata.token },
      });
    } catch (e) {
      this.handleError(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async getCampaigns() {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      response = await this.axios.get("campaigns", {
        params: { token: userdata.token },
      });
    } catch (e) {
      this.handleError(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async deleteVoicemail(sid) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let data = { sid, token: userdata.token };
    let response;
    try {
      response = await this.axios.post("delete_voicemail", data);
    } catch (e) {
      this.handleError(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async toggleVoicemail(phonenumber, option) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let data = { phonenumber, option, token: userdata.token };
    let response;
    try {
      response = await this.axios.post("toggle_voicemail", data);
    } catch (e) {
      this.handleError(e);
    }
    if (response && response.data) return response.data;
    return null;
  }
  async callStatus(data) {
    // const userdata = userDataSelector(store.getState());
    // if (!userdata || !userdata.token) return;
    // let response;
    // try {
    //   response = await this.axios.post("call_status", {
    //     ...data,
    //     token: userdata.token,
    //   });
    // } catch (e) {
    //   console.log(e);
    // }
    // if (response && response.data) return response.data;
    // return null;
  }

  async recentCalls(did, remote) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      const data = {
        phonenumber: did,
        remote,
        token: userdata.token,
      };
      response = await this.axios.post("recent_calls", data);
    } catch (e) {
      console.log(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async toggleDNC(phonenumber) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      const data = {
        phonenumber,
        token: userdata.token,
      };
      response = await this.axios.post("campaigns/dnc", data);
    } catch (e) {
      console.log(e);
      return { status: "error" };
    }
    if (response && response.data) return response.data;
    return null;
  }

  async log(stack) {
    const userdata = userDataSelector(store.getState());
    let data = { ...stack };
    if (userdata && userdata.token) {
      data.token = userdata.token;
    }
    return await this.axios.post("log", data);
  }

  async contacts_list(page) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      const data = {
        page: 1,
        token: userdata.token,
      };
      console.log("contacts_list777 data", data);
      response = await this.axios.post("contacts_list", data).catch((err) => {
        console.log("contacts_list err", err);
      });
      console.log("contacts_list2", response);
    } catch (e) {
      console.log(e);
    }
    if (response && response.data) return response.data;
    return null;
  }
  async callLogs(phonenumber, page) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      const data = {
        phonenumber,
        page,
        token: userdata.token,
      };
      response = await this.axios.post("call_logs", data);
    } catch (e) {
      console.log(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async fetchVoicemail() {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      const data = {
        token: userdata.token,
      };
      response = await this.axios.post("get_voicemail", data);
    } catch (e) {
      console.log(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async fetchAgents() {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      const params = {
        token: userdata.token,
      };
      response = await this.axios.get("fetch_agents", { params });
    } catch (e) {
      console.log(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async fetchConferences() {
    // const userdata = userDataSelector(store.getState());
    // if (!userdata || !userdata.token) return;
    // let response;
    // try {
    //   const params = {
    //     token: userdata.token,
    //   };
    //   response = await this.axios.get("conferences", { params });
    // } catch (e) {
    //   console.log(e);
    // }
    // if (response && response.data) return response.data;
    return null;
  }

  async fetchConference() {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      const params = {
        token: userdata.token,
      };
      response = await this.axios.get("conferences/fetch", { params });
    } catch (e) {
      console.log(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async fetchQueues() {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      const params = {
        token: userdata.token,
      };
      response = await this.axios.get("queues", { params });
    } catch (e) {
      console.log(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async updateDemographics(data) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      response = await this.axios.post("update_demographics", {
        ...data,
        token: userdata.token,
      });
    } catch (e) {
      console.log(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async exportData(phonenumber) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      response = await this.axios.get("export", {
        params: {
          phonenumber,
          token: userdata.token,
        },
      });
    } catch (e) {
      console.log(e);
    }
    if (response?.data?.status === "success") {
      return response?.data?.message;
    }
    return null;
  }

  async uploadRecoring(sid, data) {
    // const form_data = new FormData();
    // form_data.append("file", data);
    // form_data.set("sid", sid);
    // let response;
    // const url = settings.base_url + "/client_api/upload_recording";
    // try {
    //   response = await fetch(url, {
    //     method: "POST",
    //     body: form_data
    //   });
    // } catch (e) {
    //   console.log(e);
    // }
  }

  async uploadFile({ shortname, file, text }) {
    let response;
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    try {
      let formData = new FormData();
      formData.append("token", userdata.token);
      formData.append("shortname", shortname);

      if (file) {
        formData.append("file", file);
      }
      if (text) {
        formData.append("text", text);
      }
      response = await this.axios.post("upload_file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (e) {
      console.log(e.response ? e.response : e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async createAutodetection({ shortname, file, text, keywords }) {
    let response;
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    try {
      let formData = new FormData();
      formData.append("token", userdata.token);
      formData.append("shortname", shortname);
      formData.append("keywords", keywords);

      if (file) {
        formData.append("file", file);
      }
      if (text) {
        formData.append("text", text);
      }
      response = await this.axios.post("autodetection", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (e) {
      console.log(e.response ? e.response : e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async getHotFiles() {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      response = await this.axios.post("get_hotfile", {
        token: userdata.token,
      });
    } catch (e) {
      if (e.response) this.handleError(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async getAutodetection() {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      response = await this.axios.get("autodetection", {
        params: {
          token: userdata.token,
        },
      });
    } catch (e) {
      if (e.response) this.handleError(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async sendSms(from, to, message) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      response = await this.axios.post("send_sms", {
        token: userdata.token,
        from,
        to,
        msg: message,
      });
    } catch (e) {
      if (e.response) this.handleError(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async deleteFile(id) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;

    try {
      response = await this.axios.post("delete_file", {
        token: userdata.token,
        id,
      });
    } catch (e) {
      console.log(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async deleteAutodetection(id) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;

    try {
      response = await this.axios.delete("autodetection", {
        data: {
          token: userdata.token,
          id,
        },
      });
    } catch (e) {
      console.log(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async deleteConference(id) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;

    try {
      const data = {
        token: userdata.token,
        id: id,
      };
      response = await this.axios.delete("conferences", {
        data,
      });
    } catch (e) {
      console.log(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async createConference(name = null) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      let data = {
        token: userdata.token,
      };
      if (name) {
        data.name = name;
      }
      response = await this.axios.post("conferences", data);
    } catch (e) {
      console.log(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  async getDemographics(
    searchParam,
    fetch = true,
    localOnly = false,
    type = "phonenumber"
  ) {
    const internalOnly = internalOnlySelector(store.getState());

    if (internalOnly) {
      return null;
    }
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    let response;
    try {
      response = await this.axios.get("get_demographics", {
        params: {
          searchParam,
          type,
          fetch,
          localOnly,
          token: userdata.token,
        },
      });
    } catch (e) {
      if (e.response) this.handleError(e);
    }
    if (response && response.data) return response.data;
    return null;
  }

  handleError(error) {
    if (error.response) {
      console.log(error.response);
      switch (error.response.status) {
        case 401:
          store.dispatch(logout());
          break;
        default:
          store.dispatch(
            enqueueSnackbar({
              message: "Couldn't connect to server. Please try again.",
              options: {
                key: new Date().getTime() + Math.random(),
                variant: "danger",
              },
            })
          );
      }
    }
  }

  async saveNotes(phonenumber, notes) {
    let response;
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    try {
      response = await this.axios.post("save_notes", {
        token: userdata.token,
        phonenumber,
        notes,
      });
    } catch (e) {
      this.handleError(e);
    }
    return response && response.data && response.data.status == "success";
  }

  async saveFlags(phonenumber, type) {
    let response;
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    try {
      response = await this.axios.post("save_flags", {
        token: userdata.token,
        phonenumber,
        type,
      });
    } catch (e) {
      this.handleError(e);
    }
    return response && response.data && response.data.status == "success";
  }

  async saveEmail(phonenumber, email) {
    let response;
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    try {
      response = await this.axios.post("save_email", {
        token: userdata.token,
        phonenumber,
        email,
      });
    } catch (e) {
      this.handleError(e);
    }
    return response && response.data && response.data.status == "success";
  }

  async sendDemographics(phonenumber, email) {
    let response;
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    try {
      response = await this.axios.post("send_demographics", {
        token: userdata.token,
        phonenumber,
        email,
      });
    } catch (e) {
      this.handleError(e);
    }
    return response && response.data && response.data.status == "success";
  }

  async saveSettings(data) {
    let response;
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    try {
      response = await this.axios.patch("user", {
        token: userdata.token,
        ...data,
      });
    } catch (e) {
      this.handleError(e);
    }
    return response && response.data && response.data.status == "success";
  }

  async getSip() {
    let response;
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    try {
      response = await this.axios.get("get_sip", {
        params: { token: userdata.token },
      });
    } catch (e) {
      this.handleError(e);
    }
    if (!response.data || response.data.status == "error") {
      store.dispatch(logout());
    }
    if (response) return response.data;
  }
  async postNewCall(obj) {
    // const userdata = userDataSelector(store.getState());
    // if (!userdata || !userdata.token) return;
    // try {
    //   const response = await this.axios.post("lookup_number", {
    //     ...obj,
    //     token: userdata.token
    //   });
    // } catch (e) {
    //   console.log(e);
    //   // this.handleError(e);
    // }
  }

  async sendSMS(data) {
    let response;
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    try {
      data.token = userdata.token;
      response = await this.axios.post("send_sms", data);
    } catch (e) {
      this.handleError(e);
    }
    if (response && response.data.status == "success") {
      return true;
    }
    return false;
  }

  async readSMS(phonenumber = null) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    try {
      let params = {
        token: userdata.token,
      };
      if (phonenumber) {
        params.phonenumber = phonenumber;
      }
      await this.axios.post("read_sms", params);
    } catch (e) {
      this.handleError(e);
      return;
    }
  }

  async setCNAME(phonenumber, name) {
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    try {
      let params = {
        token: userdata.token,
        phonenumber,
        name,
      };
      await this.axios.post("setCNAME", params);
    } catch (e) {
      this.handleError(e);
      return;
    }
  }

  async getSMS(did = null, phonenumber = null, latestSmsId = 0) {
    let response;
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    try {
      let params = {
        token: userdata.token,
      };
      if (did) {
        params.did = did;
      }
      if (phonenumber) {
        params.phonenumber = phonenumber;
      }
      if (latestSmsId) {
        params.latestSmsId = latestSmsId;
      }
      response = await this.axios.post("fetch_sms", params);
    } catch (e) {
      this.handleError(e);
      return;
    }
    const data = response.data;
    if (data.status == "success" && data.count > 0) {
      return {
        ...data,
        messages: JSON.parse(data.data),
      };
    }
    // fetchSMS
    return [];
  }

  async uploadMMS(file) {
    let response;
    const userdata = userDataSelector(store.getState());
    if (!userdata || !userdata.token) return;
    try {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("token", userdata.token);
      response = await this.axios.post("upload_mms", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (e) {
      this.handleError(e);
      return;
    }
    const data = response.data;
    if (data.status == "success") {
      return data.data;
    }
    return false;
  }
}

const APIManager = new APImanager();
window.APIManager = APIManager;
export default APIManager;
