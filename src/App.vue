<template>
  <v-app id="inspire" v-wechat-title="pageTitle">
    <v-banner
      v-if="isWechatWebview"
      app
      single-line
      dark
      sticky
      color="warning"
    >
      <v-icon slot="icon" large color="white">
        mdi-alert
      </v-icon>
      请在浏览器中打开
      <v-avatar slot="actions" color="deep-purple accent-4" size="40">
        <v-icon color="white" class="jump-animation">
          mdi-arrow-up-bold
        </v-icon>
      </v-avatar>
    </v-banner>
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
                <v-spacer />
                <v-bottom-sheet v-model="showQA" inset scrollable>
                  <template #activator="{on, attrs}">
                    <v-btn icon large v-bind="attrs" v-on="on">
                      <v-icon>mdi-help-circle-outline</v-icon>
                    </v-btn>
                  </template>
                  <v-card class="rounded-b-0">
                    <v-toolbar :flat="!raiseQAtitle" color="transparent">
                      <v-toolbar-title>Q&A</v-toolbar-title>
                      <v-spacer />
                      <v-btn icon @click="showQA = false">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-card-text @scroll.passive="QAscrolling">
                      <h3>
                        不会用怎么办？<v-icon color="accent"
                          >mdi-open-in-new</v-icon
                        ><a href="https://b23.tv/Biv1Jg" target="_blank"
                          >查看视频教程</a
                        >
                      </h3>
                      <br />
                      <h3><b>Q：</b>b站uid在哪找？<br /></h3>
                      <v-divider />
                      app：【我的】-【空间】-【编辑资料】<br />
                      网页：可以在【个人空间】右侧栏下面找到<br />
                      <br />
                      <h3><b>Q：</b>提示“用户隐私设置未公开”怎么办？<br /></h3>
                      <v-divider />
                      app：【我的】-【空间】- 右上角三个点 - 【空间设置】-
                      开启【公开显示订阅的番剧】<br />
                      网页：【个人空间】-【设置】-【隐私设置】-
                      开启【追番追剧】<br />
                      <br />
                      <h3><b>Q：</b>为什么要输入uid和公开追番？<br /></h3>
                      <v-divider />
                      <b>A：</b
                      >因为要用来获取你的追番列表，以免在你的日历里显示你不看的番<br />
                      <br />
                      <h3>
                        <b>Q：</b>为什么点了【订阅日历】以后没有反应？<br />
                      </h3>
                      <v-divider />
                      <b>①</b>
                      请检查是否是在微信等 app
                      中打开本网页，请尽量使用系统自带浏览器打开
                      <br />
                      <b>②</b> iOS
                      设备请耐心等待一会，系统需要一些时间验证日历是否有效<br />
                      <b>③</b>
                      如果在系统浏览器中也无法订阅，可能是你的系统日历不支持
                      webcal，请拷贝 ICS 链接后使用微软 Outlook 或者 Google
                      日历等支持 webcal 订阅的日历软件添加订阅<br />
                      <br />
                      <v-icon left>mdi-email-send-outline</v-icon>联系作者：<a
                        href="mailto:hi94740@qq.com"
                        >hi94740@qq.com</a
                      >
                    </v-card-text>
                  </v-card>
                </v-bottom-sheet>
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent>
                  <v-text-field
                    v-model="inputBuid"
                    :label="
                      cantFetchCalendar
                        ? '输入你的b站uid来定制追番日历'
                        : copySuccess
                        ? '请确认你的账号信息'
                        : '请手动选择并复制链接'
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
                    @keydown="clickInput"
                    @keydown.backspace="!cantFetchCalendar && clearStats()"
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
                  <v-spacer />
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
                  <v-spacer />
                  <v-tooltip
                    top
                    v-model="showCopyMsg"
                    :color="copySuccess ? 'success' : 'error'"
                    :transition="
                      copySuccess
                        ? 'scroll-y-reverse-transition'
                        : 'slide-y-reverse-transition'
                    "
                    :open-on-click="false"
                    :open-on-focus="false"
                    :open-on-hover="false"
                  >
                    <template #activator="{on}">
                      <v-btn
                        color="primary"
                        outlined
                        v-clipboard:copy="copyText"
                        v-clipboard:success="copied"
                        v-clipboard:error="copyError"
                        ><v-icon left>mdi-link-variant</v-icon
                        >拷贝ics链接</v-btn
                      ><span v-on="on" />
                    </template>
                    <div>
                      <v-icon left color="white">{{
                        copySuccess
                          ? "mdi-clipboard-check-multiple"
                          : "mdi-clipboard-alert-outline"
                      }}</v-icon
                      >{{ copySuccess ? "拷贝成功！" : "拷贝失败！" }}
                    </div>
                  </v-tooltip>
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
  import {debounce} from "lodash-es"
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
      raiseQAtitle: false,
      lastClickedReadonlyInput: 0,
      showBackHint: false,
      copySuccess: true,
      showCopyMsg: false,
      isWechatWebview: navigator.userAgent
        .toLowerCase()
        .includes("micromessenger")
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
            : this.copySuccess
            ? this.buidStats.userInfo.data.name
            : this.copyText
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
      },
      copyText() {
        return (
          "https://calendars.hi94740.workers.dev/bilibili/bangumi.ics?uid=" +
          this.buid
        )
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
        setTimeout(() => (this.fakeLoading = false), 4000)
      },
      async loadBuidStats() {
        if (this.isBUIDvalid && this.cantFetchCalendar) {
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
        this.copySuccess = true
      },
      closeQA() {
        this.showQA = false
      },
      clickInput() {
        if (!this.cantFetchCalendar && !this.copySuccess)
          setTimeout(() => {
            document.execCommand("selectall", null, false)
          })
        else if (!this.cantFetchCalendar) {
          const now = Date.now()
          if (now - this.lastClickedReadonlyInput < 3000)
            this.showBackHint = true
          this.lastClickedReadonlyInput = now
        }
      },
      blurInput() {
        this.showBackHint = false
      },
      copyFeedback() {
        this.showCopyMsg = true
        this.copyFeedbackTrailing()
      },
      copyFeedbackTrailing: debounce(function() {
        this.showCopyMsg = false
      }, 1500),
      copied() {
        this.copySuccess = true
        this.copyFeedback()
      },
      copyError() {
        this.copySuccess = false
        this.copyFeedback()
      },
      QAscrolling: debounce(function(e) {
        this.raiseQAtitle = e.target.scrollTop > 0
      }, 100)
    }
  }
</script>

<style scoped>
  .jump-animation {
    animation-name: jump;
    animation-duration: 1.5s;
    animation-timing-function: ease;
    animation-delay: 0s;
    animation-iteration-count: infinite;
    animation-direction: normal;
    animation-fill-mode: none;
  }
  @keyframes jump {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
    20% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
    40% {
      -webkit-transform: translateY(-30px);
      transform: translateY(-30px);
    }
    50% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
    60% {
      -webkit-transform: translateY(-15px);
      transform: translateY(-15px);
    }
    80% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
    100% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
  }
</style>
