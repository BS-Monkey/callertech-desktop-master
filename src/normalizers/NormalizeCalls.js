import { schema, normalize } from "normalizr";

const NormalizeCalls = data => {
  const recording = new schema.Entity(
    "recording",
    {},
    { idAttribute: "RecordingSid" }
  );
  const voicemail = new schema.Entity(
    "voicemail",
    {},
    { idAttribute: "CallSid" }
  );
  const call = new schema.Entity(
    "call",
    {
      call_recording: recording
    },
    { idAttribute: "CallSid" }
  );
  const normalizedCalls = normalize(data, [call]);
  return {
    calls: normalizedCalls.entities.call,
    recordings: normalizedCalls.entities.recording,
    call_sids: normalizedCalls.result
  };
};

export default NormalizeCalls;
