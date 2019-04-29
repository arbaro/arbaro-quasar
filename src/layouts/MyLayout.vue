<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round @click="$router.push('/')" aria-label="Menu">
          <q-icon v-bind:name="iconName" />
        </q-btn>

        <q-toolbar-title>Arbaro </q-toolbar-title>

        <div class="row q-col-gutter-md">
          <div
            clickable
            v-if="$eosio.data.authed"
            @click="$router.push('/editprofile')"
          >
            <q-avatar>
              <img :src="picUrl" />
            </q-avatar>
            {{ friendlyName }}
          </div>

          <eosio-button></eosio-button>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from "quasar";

export default {
  name: "MyLayout",
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      friendlyName: "Name not entered!",
      picUrl: "https://cdn.quasar-framework.org/img/boy-avatar.png"
    };
  },
  methods: {
    openURL,
    fetchProfile: async function(accountName) {
      const { friendly, pic } = await this.$api.getProfile(accountName);
      if (!friendly && !pic) return;
      this.picUrl = pic;
      this.friendlyName = friendly;
    }
  },
  created() {
    this.iconName =
      this.$router.app._route.fullPath === "/" ? "home" : "arrow_back";
  },
  watch: {
    $route(to) {
      console.log("Setting home to", to.path === "/");
      this.iconName = to.path === "/" ? "home" : "arrow_back";
    },
    "$eosio.data.authed": function(authed) {
      if (authed) {
        this.fetchProfile(this.$eosio.data.accountName);
      }
    }
  }
};
</script>

<style></style>
