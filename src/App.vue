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
                <v-form>
                  <v-text-field
                    v-model="inputBuid"
                    :label="cantFetchCalendar ? '输入你的b站uid来定制追番日历' : '请确认你的b站昵称'"
                    name="buid"
                    prepend-icon="mdi-account"
                    type="text"
                    color="secondary"
                    :rules="[buidInputErrorMsg]"
                    :disabled="loadingBuidStats || !cantFetchCalendar"
                  >
                    <!-- <template #prepend-inner
                      ><v-avatar v-if="!cantFetchCalendar">
                        <img
                          :src="buidStats.userInfo.data.face"
                          :alt="buidStats.userInfo.data.name"
                        /> </v-avatar
                    ></template> -->
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions
                ><v-btn
                  v-if="!cantFetchCalendar"
                  color="secondary"
                  text
                  @click="clearStats"
                  >上一步</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn
                  v-if="cantFetchCalendar"
                  color="secondary"
                  :disabled="!isBUIDvalid"
                  :loading="loadingBuidStats"
                  @click="loadBuidStats"
                  >下一步</v-btn
                >
                <v-btn
                  v-if="!cantFetchCalendar"
                  color="primary"
                  outlined
                  v-clipboard:copy="
                    'https://calendars.hi94740.workers.dev/bilibili/bangumi.ics?uid=' +
                      buid
                  "
                  >拷贝ics链接</v-btn
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
      buid: "",
      fakeLoading: false,
      buidStats: null,
      loadingBuidStats: false
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
        return this.buidStats?.userInfo?.data?.mid == buid
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
        this.loadingBuidStats = true
        const buid = this.buid
        this.buidStats = await (
          await fetch(
            "https://calendars.hi94740.workers.dev/bilibili/uid/validate?uid=" +
              buid
          )
        ).json()
        this.buid = ""
        this.$nextTick(() => (this.buid = buid))
        this.loadingBuidStats = false
      },
      clearStats() {
        this.buid = ''
        this.buidStats = null
      }
    }
  }
</script>
