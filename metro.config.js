const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Block the web-only @phosphor-icons/react from being resolved
config.resolver = {
  ...config.resolver,
  blockList: [/node_modules\/@phosphor-icons\/react\/.*/],
};

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
