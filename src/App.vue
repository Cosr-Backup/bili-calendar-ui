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
                <v-tooltip
                  v-model="showQA"
                  bottom
                  transition="slide-y-transition"
                  :open-on-click="false"
                  :open-on-focus="false"
                  :open-on-hover="false"
                >
                  <template #activator="{on}">
                    <v-btn
                      icon
                      large
                      target="_blank"
                      @click="showQA = !showQA"
                      v-click-outside="closeQA"
                    >
                      <v-icon>mdi-help-circle-outline</v-icon><span v-on="on" />
                    </v-btn>
                  </template>
                  <span>
                    Q：b站uid在哪找？<br />
                    app：【我的】-【空间】-【编辑资料】<br />
                    网页：可以在【个人空间】右侧栏下面找到<br />
                    <br />
                    Q：提示“用户隐私设置未公开”怎么办？<br />
                    app：【我的】-【空间】- 右上角三个点 - 【空间设置】-
                    开启【公开显示订阅的番剧】<br />
                    网页：【个人空间】-【设置】-【隐私设置】-
                    开启【追番追剧】<br />
                    <br />
                    Q：为什么要输入uid和公开追番？<br />
                    A：因为要用来获取你的追番列表，以免在你的日历里显示你不看的番<br />
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
                    pattern="\d*"
                    inputmode="numeric"
                    color="secondary"
                    :hint="
                      !cantFetchCalendar && showBackHint
                        ? '点击左下角箭头可返回上一步'
                        : undefined
                    "
                    :rules="[buidInputErrorMsg]"
                    :disabled="loadingBuidStats"
                    :readonly="!cantFetchCalendar"
                    :loading="loadingBuidStats"
                    :clearable="Boolean(cantFetchCalendar)"
                    @keydown.enter="loadBuidStats"
                    @click="clickInput"
                    @blur="blurInput"
                  >
                    <template #prepend
                      ><v-avatar
                        v-if="!cantFetchCalendar"
                        size="34"
                        style="left:-5px;top:-5px;margin-right:-5px"
                      >
                        <img
                          :src="buidStats.userInfo.data.face"
                          :alt="buidStats.userInfo.data.name"
                        /> </v-avatar
                    ></template>
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-scroll-x-reverse-transition mode="out-in">
                <v-card-actions v-if="cantFetchCalendar" key="step1actions">
                  <v-spacer></v-spacer>
                  <v-btn
                    rounded
                    color="secondary"
                    :disabled="!isBUIDvalid"
                    :loading="loadingBuidStats"
                    @click="loadBuidStats"
                    >下一步<v-icon right>mdi-arrow-right</v-icon></v-btn
                  >
                </v-card-actions>
                <v-card-actions v-else key="step2actions"
                  ><v-btn color="secondary" icon @click="clearStats"
                    ><v-icon large>mdi-chevron-left</v-icon></v-btn
                  >
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    outlined
                    v-clipboard:copy="
                      'https://calendars.hi94740.workers.dev/bilibili/bangumi.ics?uid=' +
                        buid
                    "
                    ><v-icon left>mdi-link-variant</v-icon>拷贝ics链接</v-btn
                  >
                  <v-btn
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
              </v-scroll-x-reverse-transition>
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
      showError: false,
      showQA: false,
      lastClickedReadonlyInput: 0,
      showBackHint: false
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
          if (typeof buid === "string" && !/^[1-9]\d*$/.test(buid))
            this.$nextTick(
              () =>
                (this.buid =
                  buid
                    ?.match(/\d+/g)
                    ?.join("")
                    ?.match(/[1-9]\d*/g)?.[0] || "")
            )
        }
      }
    },

    watch: {
      // buid(buid) {
      //   if (/^0+$/.test(buid)) this.$nextTick(() => (this.buid = ""))
      // }
    },

    methods: {
      buidInputErrorMsg(buid) {
        return this.buidStats?.buid == buid
          ? typeof this.cantFetchCalendar == "string"
            ? this.cantFetchCalendar
            : true
          : this.buid == "" ||
              this.buid == null ||
              this.isBUIDvalid ||
              "uid必须是数字！"
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
            if (!res.ok) throw res.status + "：" + res.statusText
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
      },
      closeQA() {
        this.showQA = false
      },
      clickInput() {
        if (!this.cantFetchCalendar) {
          const now = Date.now()
          if (now - this.lastClickedReadonlyInput < 3000)
            this.showBackHint = true
          this.lastClickedReadonlyInput = now
        }
      },
      blurInput() {
        this.showBackHint = false
      }
    }
  }
</script>
