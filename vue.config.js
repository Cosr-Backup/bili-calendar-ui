// const resolve = (...args) => require("path").resolve(__dirname, ...args)

module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath:
    process.env.NODE_ENV === "production" ? "/calendar-feeds-ui/" : "/",
  // configureWebpack: {
  //   plugins: [
  //     new (require("favicons-webpack-plugin"))(resolve("./src/assets/logo.png"))
  //   ]
  // },
  // chainWebpack: config => {
  //   config.plugin("favicon").use(require("favicons-webpack-plugin"), [
  //     {
  //       logo: resolve("./src/assets/logo.png"),
  //       inject: false,
  //       outputPath: "/",
  //       favicons: {
  //         icons: {
  //           // Platform Options:
  //           // - offset - offset in percentage
  //           // - background:
  //           //   * false - use default
  //           //   * true - force use default, e.g. set background for Android icons
  //           //   * color - set background for the specified icons
  //           //   * mask - apply mask in order to create circle icon (applied by default for firefox). `boolean`
  //           //   * overlayGlow - apply glow effect after mask has been applied (applied by default for firefox). `boolean`
  //           //   * overlayShadow - apply drop shadow after mask has been applied .`boolean`
  //           //
  //           android: true, // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
  //           appleIcon: true, // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
  //           appleStartup: true, // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
  //           coast: true, // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
  //           favicons: true, // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
  //           firefox: true, // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
  //           windows: true, // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
  //           yandex: true // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
  //         }
  //       }
  //     }
  //   ])
  // }
}
