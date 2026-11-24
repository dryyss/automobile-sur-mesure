// Charge js/data.js dans un bac à sable Node avec un faux localStorage.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');

function fakeStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
    clear: () => m.clear(),
    _map: m
  };
}

function loadASM(storage) {
  const localStorage = storage || fakeStorage();
  const window = {};
  const ctx = vm.createContext({ window, localStorage, JSON, Date, Math, String, Object });
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', 'data.js'), 'utf8'), ctx, { filename: 'data.js' });
  return { ASM: window.ASM, localStorage };
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

module.exports = { ROOT, loadASM, fakeStorage, read };
