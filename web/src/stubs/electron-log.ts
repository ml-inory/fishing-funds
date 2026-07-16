const noop = () => {};
const noopLogger = {
  functions: {
    log: noop, info: noop, warn: noop, error: noop, debug: noop, verbose: noop, silly: noop,
  },
  log: noop, info: noop, warn: noop, error: noop, debug: noop, verbose: noop, silly: noop,
  transports: { console: { level: 'info' }, file: { level: 'info' } },
};
export default noopLogger;
export { noopLogger as log };
