import { schema, normalize } from "normalizr";

const NormalizeCallerData = (data) => {
  const notes = new schema.Entity("notes", {}, { idAttribute: "phoneNumber" });
  const flag = new schema.Entity("flags", {}, { idAttribute: "phonenumber" });
  const address = new schema.Entity("address");
  const callerdata = new schema.Entity(
    "callerdata",
    {
      notes: notes,
      flags: flag,
      addresses: [address],
    },
    { idAttribute: "phoneNumber" }
  );
  const normalizedCallerdata = normalize(data, callerdata);
  return {
    callerdetails: normalizedCallerdata.entities.callerdata,
    flags: normalizedCallerdata.entities.flags,
    notes: normalizedCallerdata.entities.notes,
    address: normalizedCallerdata.entities.address,
  };
};

export default NormalizeCallerData;
