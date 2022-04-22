export const randomString = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getPhoneNumber = (num) => {
  const national_regex =
    /^(\([0-9]{3}\) |[0-9]{3}-|\([0-9]{3}\))[0-9]{3}-[0-9]{4}$/m;
  const int_regex = /^(\+[0-9]{2})([0-9]{10})$/m;
  const full_regex = /^(\+1)([0-9]{10})$/m;
  const full_regex2 = /^(1)([0-9]{10})$/m;
  const unformatted_regex = /^([0-9]{10})$/m;
  const full_seperated = /^1-([0-9]{3}-)[0-9]{3}-[0-9]{4}$/m;
  let number = false;
  if (national_regex.test(num)) {
    number = num.replace(/[-,(,), ]/g, "");
    number = "+1" + number;
  } else if (full_regex.test(num)) {
    number = num;
  } else if (full_regex2.test(num)) {
    number = "+" + num;
  } else if (unformatted_regex.test(num)) {
    number = "+1" + num;
  } else if (full_seperated.test(num)) {
    number = num.replace(/[(,),-, ]/, "");
    number = "+" + number;
  } else if (int_regex.test(num)) {
    number = num;
  }
  return number;
};

export const formatNational = (num) => {
  const full = getPhoneNumber(num);
  if (full)
    return `${full.substring(2, 5)}-${full.substring(5, 8)}-${full.substring(
      8
    )}`;
  return false;
};
export const initials = (name) => {
  let initials = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  return initials;
};

export const getFilename = (filename) => {
  const regex = /(.*)\.([a-zA-z]*)/gm;
  let m = regex.exec(filename);
  if (!m || m.length < 3) {
    return "";
  }
  return m[1].replace(/[-,_,\.]/g, " ").toUpperCase();
};

const Utils = {
  getPhoneNumber,
  formatNational,
  initials,
  getFilename,
};
window._Utils = Utils;
export default Utils;
