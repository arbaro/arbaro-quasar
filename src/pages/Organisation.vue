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
            <div class="text-h6">About {{ symbolName }}{{ precision }}</div>
          </q-card-section>
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>

        <q-list bordered padding class="rounded-borders text-primary">
          <q-item
            clickable
            v-ripple
            :active="this.link === 'inbox'"
            @click="link = 'inbox'"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="inbox" />
            </q-item-section>

            <q-item-section>Inbox</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="link === 'outbox'"
            @click="link = 'outbox'"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="send" />
            </q-item-section>

            <q-item-section>Outbox</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="link === 'trash'"
            @click="link = 'trash'"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="delete" />
            </q-item-section>

            <q-item-section>Trash</q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item
            clickable
            v-ripple
            :active="link === 'settings'"
            @click="link = 'settings'"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>

            <q-item-section>Settings</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="link === 'help'"
            @click="link = 'help'"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon name="help" />
            </q-item-section>

            <q-item-section>Help</q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <div class="row flex-center q-col-gutter-xl">
      <div class="col-xs-12 col-sm-4 flex flex-center">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">{{ friendlyname }}</div>
          </q-card-section>
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-4 ">
        <q-list bordered separator>
          <q-item-label header>Recent Activity</q-item-label>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>Contoso</q-item-label>
              <q-item-label caption>{{ lorem }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
              1 min ago
              <q-badge color="teal" label="10k" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<style lang="stylus">
.my-menu-link
  color white
  background #F2C037
</style>

<script>
export default {
  name: "PageIndex",
  data: function() {
    return {
      lorem: `Lorem ipsum dolor sit, amet consectetur
          adipisicing elit. Aperiam nulla laboriosam iure nisi mollitia nesciunt
          deserunt quaerat adipisci, optio laborum iste odit, illum dignissimos
          blanditiis eligendi perferendis facere vitae possimus.`,
      url: "https://johnwilliamson.io/images/avatar.jpg",
      friendlyname: "John Williamson",
      tokenContract: "",
      symbolName: "",
      precision: null,
      link: "inbox"
    };
  },
  created: function() {
    console.log(this.$route.params);
    this.refresh();
  },
  methods: {
    async refresh() {
      await this.fetchOrganisation(this.$route.params.account);
    },
    async fetchOrganisation(orgName) {
      const tableResult = await this.$eos.getTable("orgs");
      const org = tableResult.rows.filter(org => org.key === orgName)[0];
      const [precision, symbolName] = org.symbol.split(",");
      this.precision = precision;
      this.symbolName = symbolName;
    }
  }
};
</script>
