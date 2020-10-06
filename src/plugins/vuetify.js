import Vue from "vue"
import Vuetify from "vuetify/lib"

import colors from "vuetify/lib/util/colors"

Vue.use(Vuetify)

const mql = window.matchMedia("(prefers-color-scheme: dark)")

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.pink.lighten2,
        secondary: colors.pink.lighten1,
        accent: colors.pink.accent1,
        error: colors.yellow.darken3
      },
      dark: {
        primary: colors.cyan,
        secondary: colors.cyan.darken1,
        accent: colors.cyan.accent3
      }
    },
    dark: mql.matches
  }
})

const darkModeListener = ({matches}) => {
  vuetify.framework.theme.dark = matches
  document.body.style.backgroundColor = matches ? "#121212" : "#FFF"
}
darkModeListener(mql)
if (mql.addEventListener) mql.addEventListener("change", darkModeListener)
else mql.addListener(darkModeListener)

export default vuetify
