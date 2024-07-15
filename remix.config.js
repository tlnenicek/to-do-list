/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/*.css"],
  browserNodeBuiltinsPolyfill: {
    modules: {
      util: true, // Provide a JSPM polyfill
      stream: true, // Provide an empty polyfill
      https: true, // Provide an empty polyfill
      url: true, // Provide an empty polyfill
      os: true, // Provide an empty polyfill
      buffer: true, // Provide a JSPM polyfill
      fs: "empty", // Provide an empty polyfill
      path: true,
      events: true
    },
    globals: {
      Buffer: true,
    }
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
}};
