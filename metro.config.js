const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add resolver and transformer options to prevent hanging
config.resolver = {
  ...config.resolver,
  assetExts: [...(config.resolver?.assetExts || [])],
  sourceExts: [...(config.resolver?.sourceExts || []), 'jsx', 'js', 'ts', 'tsx', 'json'],
};

config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
  minifierPath: require.resolve('metro-minify-terser'),
  minifierConfig: {
    ecma: 8,
    keep_classnames: true,
    keep_fnames: true,
    module: true,
    mangle: {
      module: true,
      keep_classnames: true,
      keep_fnames: true,
    },
  },
};

// Increase max workers to prevent hanging
config.maxWorkers = 2;

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
