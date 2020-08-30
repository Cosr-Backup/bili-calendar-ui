<template>
  <v-app id="inspire" v-wechat-title="pageTitle">
    <v-snackbar app top multi-line v-model="showError" color="error"
      ><v-icon left>{{ errorIcon }}</v-icon
      >{{ errorTitle }}<br />{{ errorMsg }}</v-snackbar
    >

    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>bilibili追番日历 _(:з」∠)_</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <template v-slot:activator="{on}">
                    <v-btn href="" icon large target="_blank" v-on="on">
                      <v-icon>mdi-help-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>
                    b站uid在哪找？
                    <br />
                    在b站app【我的】-【空间】-【编辑资料】页面可以找到
                    <br />
                    网页端可以在【个人空间】右侧栏下面找到
                  </span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form onsubmit="return false">
                  <v-text-field
                    v-model="inputBuid"
                    :label="
                      cantFetchCalendar
                        ? '输入你的b站uid来定制追番日历'
                        : '请确认你的账号信息'
                    "
                    name="buid"
                    :prepend-icon="
                      cantFetchCalendar ? 'mdi-account' : undefined
                    "
                    type="text"
                    color="secondary"
                    :rules="[buidInputErrorMsg]"
                    :disabled="loadingBuidStats"
                    :readonly="!cantFetchCalendar"
                    :loading="loadingBuidStats"
                    :clearable="Boolean(cantFetchCalendar)"
                    @keydown.enter="loadBuidStats"
                  >
                    <template #prepend-inner
                      ><v-avatar
                        v-if="!cantFetchCalendar"
                        size="24"
                        left
                        style="margin-right:5px"
                      >
                        <img
                          :src="buidStats.userInfo.data.face"
                          :alt="buidStats.userInfo.data.name"
                        /> </v-avatar
                    ></template>
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions
                ><v-btn
                  v-if="!cantFetchCalendar"
                  color="secondary"
                  icon
                  @click="clearStats"
                  ><v-icon large>mdi-chevron-left</v-icon></v-btn
                >
                <v-spacer></v-spacer>
                <v-btn
                  v-if="cantFetchCalendar"
                  rounded
                  color="secondary"
                  :disabled="!isBUIDvalid"
                  :loading="loadingBuidStats"
                  @click="loadBuidStats"
                  >下一步<v-icon right>mdi-arrow-right</v-icon></v-btn
                >
                <v-btn
                  v-if="!cantFetchCalendar"
                  color="primary"
                  outlined
                  v-clipboard:copy="
                    'https://calendars.hi94740.workers.dev/bilibili/bangumi.ics?uid=' +
                      buid
                  "
                  ><v-icon left>mdi-link-variant</v-icon>拷贝ics链接</v-btn
                >
                <v-btn
                  v-if="!cantFetchCalendar"
                  color="secondary"
                  :href="
                    'webcal://calendars.hi94740.workers.dev/bilibili/bangumi.ics?uid=' +
                      buid
                  "
                  :loading="fakeLoading"
                  @click="fakeLoad"
                  ><v-icon left>mdi-calendar-heart</v-icon>订阅日历</v-btn
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
      pageTitle: "bilibili追番日历 by hi94740",
      buid: "",
      fakeLoading: false,
      buidStats: null,
      loadingBuidStats: false,
      errorTitle: "出错了QAQ",
      errorMsg: "骗你的嘿嘿😋",
      errorIcon: "mdi-sync-alert",
      showError: false
    }),

    computed: {
      isBUIDvalid() {
        return /^[1-9]\d*$/.test(this.buid) && parseInt(this.buid) > 0
      },
      cantFetchCalendar() {
        if (this.buidStats) {
          if (this.buidStats.userInfo.code != 0)
            return this.buidStats.userInfo.message
          else if (this.buidStats.bangumiFollow.code != 0)
            return this.buidStats.bangumiFollow.message
          else if (this.buidStats.bangumiFollow.data.list.length === 0)
            return "你还没订阅番剧呢！"
          else return false
        } else return true
      },
      inputBuid: {
        get() {
          return this.cantFetchCalendar
            ? this.buid
            : this.buidStats.userInfo.data.name
        },
        set(buid) {
          this.buid = buid
        }
      }
    },

    watch: {
      buid(buid) {
        if (buid.startsWith("uid:")) this.buid = buid.replace("uid:", "")
      }
    },

    methods: {
      buidInputErrorMsg(buid) {
        return this.buidStats?.buid == buid
          ? typeof this.cantFetchCalendar == "string"
            ? this.cantFetchCalendar
            : true
          : buid === "" || this.isBUIDvalid || "uid必须是数字！"
      },
      fakeLoad() {
        this.fakeLoading = true
        setTimeout(() => (this.fakeLoading = false), 2000)
      },
      async loadBuidStats() {
        if (this.isBUIDvalid) {
          this.loadingBuidStats = true
          const buid = this.buid
          try {
            const res = await fetch(
              process.env.VUE_APP_HOST + "bilibili/uid/validate?uid=" + buid
            )
            if (!res.ok) {
              this.errorMsg = res.status + "：" + res.statusText
              this.showError = true
            }
            const stats = await res.json()
            stats.buid = buid
            this.buidStats = stats
          } catch (e) {
            console.error(e)
            this.errorMsg = e.toString()
            this.showError = true
          }
          this.buid = ""
          this.$nextTick(() => (this.buid = buid))
          this.loadingBuidStats = false
        }
      },
      clearStats() {
        this.buid = ""
        this.buidStats = null
      }
    }
  }
</script>
