<template>
  <q-page padding>
    <div
      v-if="$eosio.data.authed"
      class="column flex-center q-col-gutter-xl fixed-center"
    >
      <h3>Edit Profile</h3>
      <q-spinner v-if="loading" color="primary" />
      <div v-else>
        <q-input v-model="friendlyName" label="Name" />
        <q-input v-model="about" label="About" />
        <q-input v-model="picUrl" label="Picture URL" />
        <q-input v-model="gitUrl" label="GitHub URL" />
        <q-btn @click="saveProfile" color="primary" label="Save" />
      </div>
    </div>
    <div v-else class="column flex-center q-col-gutter-xl fixed-center">
      <h5>Please login to authenticate your EOS account.</h5>
    </div>
  </q-page>
</template>

<style></style>
<script>
export default {
  name: "PageIndex",
  data: function() {
    return {
      friendlyName: "",
      about: "",
      picUrl: "",
      gitUrl: "",
      loading: true
    };
  },
  created: function() {
    if (this.$eosio.data.accountName) {
      this.fetchProfile(this.$eosio.data.accountName);
    }
  },
  methods: {
    async fetchProfile(accountName) {
      try {
        const profile = await this.$api.getProfile(accountName);
        const { about, friendly, pic, git } = profile;
        this.friendlyName = friendly;
        this.about = about;
        this.picUrl = pic;
        this.gitUrl = git;
      } catch (e) {
        this.$q.notify(`Error fetching profile ${e.message}`);
      }
      this.loading = false;
    },
    async saveProfile() {
      try {
        await this.$eos.tx("upsertprof", {
          prof: this.$eosio.data.accountName,
          friendly: this.friendlyName,
          about: this.about,
          pic: this.picUrl,
          git: this.gitUrl
        });
        this.$router.push("/");
        this.$q.notify(
          "Profiled successfully updated, refresh page to reflect changes"
        );
      } catch (e) {
        console.log("error", e);
      }
    }
  },
  watch: {
    "$eosio.data.authed": function(authed) {
      if (authed) {
        this.fetchProfile(this.$eosio.data.accountName);
      }
    }
  }
};
</script>
