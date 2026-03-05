const _logs = [];

export function log(type, data) {
  data = data || {};
  const entry = Object.assign({ timestamp: new Date().toISOString(), type: type }, data);
  _logs.push(entry);
  return entry;
}

export function getLogs() { return _logs.slice(); }
export function clearLogs() { _logs.length = 0; }