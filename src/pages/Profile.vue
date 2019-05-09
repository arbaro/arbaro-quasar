<template>
  <q-page padding>
    <div class="row flex-center q-col-gutter-xl">
      <div class="col-xs-12 col-sm-4 flex flex-center">
        <q-img
          :src="
            url ||
              `https://clinicforspecialchildren.org/wp-content/uploads/2016/08/avatar-placeholder-480x480.gif`
          "
          spinner-color="white"
          style="height: 140px; max-width: 150px"
        />
      </div>

      <div class="col-xs-12 col-sm-4">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">About</div>
          </q-card-section>
          <q-card-section>
            {{ about || "User has not entered profile information yet!" }}
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row flex-center q-col-gutter-xl">
      <div class="col-xs-12 col-sm-4  column">
        <div class="text-h6 flex flex-center">
          {{ friendlyname || "A profile has no name." }}
        </div>
        <q-card class="my-card flex flex-center" flat>
          <q-card-section>
            <q-icon
              @click="open(gitUrl)"
              v-if="gitUrl"
              name="ion-logo-github"
              style="font-size: 2rem;"
            />
          </q-card-section>
        </q-card>
        <q-list bordered separator>
          <q-item-label header>Organisations Joined</q-item-label>

          <q-item v-for="org in orgs" :key="org._id">
            <q-item-section>
              <q-item-label>{{ org.friendlyname || org.owner }}</q-item-label>
              <q-item-label caption
                >Balance {{ org.balance }}
                {{ org.tokensym.split(",")[1] }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="col-xs-12 col-sm-4 ">
        <q-list bordered separator>
          <q-item-label header>Recent Activity</q-item-label>

          <q-item v-for="entrie in entries" :key="entrie.transactionId">
            <q-item-section>
              <q-item-label>{{ entrie.org.friendlyname }}</q-item-label>
              <q-item-label caption> {{ entrie.notes }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
              {{ entrie.when }}
              <q-badge color="primary" :label="entrie.timeSpent" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<style></style>

<script>
import moment from "moment";
import { openURL } from "quasar";

export default {
  name: "PageIndex",
  data: function() {
    return {
      entries: [],
      about: ``,
      url: "",
      friendlyname: "",
      orgs: [],
      gitUrl: ""
    };
  },
  created: function() {
    this.refresh();
  },
  methods: {
    open(url) {
      openURL(url);
    },
    async refresh() {
      this.$q.loadingBar.start();
      await this.fetchProfile();
      await this.fetchTokenBalances();
      this.$q.loadingBar.stop();
    },
    async fetchProfile() {
      const result = await this.$api.getProfile(this.$route.params.account);
      this.friendlyname = result.friendly;
      this.url = result.pic;
      this.about = result.about;
      this.teams = result.orgs;
      this.gitUrl = result.git;
      this.orgs = result.orgs;
      console.log(this.orgs);
      this.entries = result.entries.map(entry => ({
        ...entry,
        when: moment
          .utc(entry.blockTime)
          .local()
          .fromNow(),
        timeSpent: moment.duration(entry.minutes, "minutes").humanize()
      }));
    },

    async fetchTokenBalances() {
      if (this.orgs.length < 1) return;
      const orgs = this.orgs;

      for (var i = 0; i < orgs.length; i++) {
        console.log(orgs[i], orgs[i].tokensym, orgs[i].tokencon);
        const balance = await this.$eos.getBalance(
          this.$route.params.account,
          orgs[i].tokensym.split(",")[1],
          orgs[i].tokencon
        );
        this.orgs = this.orgs.map(org => ({ ...org, balance }));
      }
    }
  }
};
</script>
