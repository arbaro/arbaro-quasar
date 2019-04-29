<template>
  <q-page padding>
    <div class="row flex-center q-col-gutter-xl">
      <div class="col-xs-12 col-sm-4 flex flex-center">
        <q-img
          :src="url"
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
            {{ about }}
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row flex-center q-col-gutter-xl">
      <div class="col-xs-12 col-sm-4 flex flex-center column">
        <div class="text-h6">{{ friendlyname }}</div>
        <q-card class="my-card">
          <q-card-section>
            h
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-4 ">
        <q-list bordered separator>
          <q-item-label header>Recent Activity</q-item-label>

          <q-item v-for="entrie in entries" :key="entrie.transactionId">
            <q-item-section>
              <q-item-label>{{ entrie.orgFriendly }}</q-item-label>
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

export default {
  name: "PageIndex",
  data: function() {
    return {
      entries: [],
      about: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit dicta, maiores, quod sapiente nam error accusantium id blanditiis temporibus nihil ipsam minima excepturi vitae. Officiis in id omnis necessitatibus soluta.`,
      url: "https://johnwilliamson.io/images/avatar.jpg",
      friendlyname: "John Williamson"
    };
  },
  created: function() {
    this.refresh();
  },
  methods: {
    async refresh() {
      await this.fetchProfile();
    },
    async fetchProfile() {
      const result = await this.$api.getProfile(this.$route.params.account);
      this.friendlyname = result.friendly;
      this.url = result.pic;
      this.about = result.about;

      this.entries = result.entries.map(entry => ({
        ...entry,
        when: moment
          .utc(entry.blockTime)
          .local()
          .fromNow(),
        timeSpent: moment.duration(entry.minutes, "minutes").humanize()
      }));
    }
  }
};
</script>
