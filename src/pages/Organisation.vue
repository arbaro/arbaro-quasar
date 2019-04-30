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

      <div class="col-xs-12 col-sm-6">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">About</div>
          </q-card-section>
          <q-card-section>
            {{ about || "An organisation has no profile." }}
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row flex-center q-col-gutter-xl">
      <div class="col-xs-12 col-sm-4 ">
        <q-card class="my-card flex column" flat>
          <q-card-section>
            <div class="text-h5">
              {{ friendlyname || $route.params.account }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-icon
              @click="open(gitUrl)"
              v-if="gitUrl"
              name="ion-logo-github"
              style="font-size: 2rem;"
            />
            <q-btn
              v-if="$eosio.data.accountName == $route.params.account"
              label="Edit Profile"
              color="primary"
              @click="$router.push(`/editprofile`)"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6">
        <!-- <q-card v-if="arbaroTokenEnabled">
          <q-card-section>
            <div class="text-h6">Arbaro Token Enabled</div>
          </q-card-section>
          <q-card-section>
            <q-btn label="Donate" @click="donateTrigger" color="primary" />
          </q-card-section>
          <q-card-section>
            <q-list>
              <q-item>Hello</q-item>
            </q-list>
          </q-card-section>
        </q-card> -->
      </div>
    </div>
  </q-page>
</template>

<style></style>
<script>
import { openURL } from "quasar";
export default {
  name: "PageIndex",
  data: function() {
    return {
      lorem: `Lorem ipsum dolor sit, amet consectetur
          adipisicing elit. Aperiam nulla laboriosam iure nisi mollitia nesciunt
          deserunt quaerat adipisci, optio laborum iste odit, illum dignissimos
          blanditiis eligendi perferendis facere vitae possimus.`,
      url: "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
      friendlyname: "",
      tokenContract: "",
      symbolName: "",
      gitUrl: "",
      about: "",
      precision: null,
      link: "inbox",
      arbaroTokenEnabled: false
    };
  },
  created: function() {
    console.log(this.$route.params);
    this.refresh();
  },
  methods: {
    open(url) {
      openURL(url);
    },
    async refresh() {
      this.fetchOrganisation(this.$route.params.account);
      this.fetchProfile(this.$route.params.account);
    },
    async donateTrigger() {
      console.log("f");
    },
    async fetchProfile(profileName) {
      const { git, pic, about, friendly } = await this.$api.getProfile(
        profileName
      );
      console.log({ git, pic, about, friendly }, "is result");
      this.gitUrl = git;
      this.url = pic;
      this.about = about;
      this.friendlyname = friendly;
    },
    async fetchOrganisation(orgName) {
      const tableResult = await this.$eos.getTable("orgs");
      const org = tableResult.rows.filter(org => org.key === orgName)[0];
      const [precision, symbolName] = org.symbol.split(",");
      const tokencon = org.tokencon;
      this.precision = precision;
      this.symbolName = symbolName;
      this.tokenContract = tokencon;
      this.arbaroTokenEnabled =
        tokencon == "arbtoken" || tokencon == "arbarotokenn";
    }
  }
};
</script>
