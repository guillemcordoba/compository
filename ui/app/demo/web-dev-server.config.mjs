import plugins from '../web-dev.plugins.mjs';

export default {
  port: 8082,
  watch: true,
  nodeResolve: {
    browser: true,
  },
  rootDir: '../../',
  appIndex: 'app/demo/index.html',
  open: true,
  plugins,
};
