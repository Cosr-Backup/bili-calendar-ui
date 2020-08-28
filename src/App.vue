<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>bilibili追番日历</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{on}">
                    <v-btn href="" icon large target="_blank" v-on="on">
                      <v-icon>mdi-code-tags</v-icon>
                    </v-btn>
                  </template>
                  <span>以后还会增加更多功能！</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="buid"
                    label="输入你的b站uid来定制追番日历"
                    name="buid"
                    prepend-icon="mdi-account"
                    type="text"
                    :rules="[validateBUID]"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  :disabled="!isBUIDvalid"
                  outlined
                  v-clipboard:copy="
                    'https://calendars.hi94740.workers.dev/bilibili/bangumi.ics?uid=' +
                      buid
                  "
                  >拷贝ics链接</v-btn
                >
                <v-btn
                  color="primary"
                  :disabled="!isBUIDvalid"
                  :href="
                    'webcal://calendars.hi94740.workers.dev/bilibili/bangumi.ics?uid=' +
                      buid
                  "
                  >订阅日历</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    name: "App",

    data: () => ({
      buid: ""
    }),

    computed: {
      isBUIDvalid() {
        return /^[1-9]\d*$/.test(this.buid) && parseInt(this.buid) > 0
      }
    },

    methods: {
      validateBUID() {
        return this.isBUIDvalid || "uid必须是数字！"
      }
    }
  }
</script>
