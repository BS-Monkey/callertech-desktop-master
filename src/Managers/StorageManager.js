import { changeUserData } from "../redux/settings/settings.actions";
import { userDataSelector } from "../redux/settings/settings.selector";
import store from "../redux/store";

const storage = window.ejstorage;

function getPersisted(name) {
  return new Promise((resolve, reject) => {
    try {
      storage.get(name, (error, data) => {
        if (error) {
          return reject(error);
        }
        resolve(data);
      });
    } catch (e) {
      console.error(e);
      return reject(e);
    }
  });
}

function setPersisted(name, value) {
  storage.set(name, value);
}

function getLocal(name) {
  return localStorage.getItem(name);
}

function setLocal(name, value) {
  localStorage.setItem(name, value);
}

function remove(name) {
  if (storage) {
    storage.remove(name);
  } else localStorage.removeItem(name);
}

export async function get(name) {
  if (storage) {
    return await getPersisted(name);
  } else {
    return JSON.parse(getLocal(name));
  }
}
export async function set(name, value) {
  if (storage) {
    return setPersisted(name, value);
  } else {
    return setLocal(name, JSON.stringify(value));
  }
}

export function getUserdata(dispatch) {
  get("userdata")
    .then((data) => {
      if (data) dispatch(changeUserData(JSON.parse(data)));
    })
    .catch((e) => {
      saveUserdata({});
    });
}
export const saveUserdata = (state = null) => {
  if (!state) {
    state = userDataSelector(store.getState());
  }
  if (state.token) {
    set("userdata", state);
  } else {
    remove("userdata");
  }
};

export default { get, set, remove, saveUserdata, getUserdata };
