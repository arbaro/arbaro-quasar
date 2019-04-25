<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round @click="$router.push('/')" aria-label="Menu">
          <q-icon v-bind:name="iconName" />
        </q-btn>

        <q-toolbar-title>
          Arbaro
        </q-toolbar-title>

        <eosio-button></eosio-button>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="row ">
        <div class="offset-sm-1 col-2 ">
          <q-list bordered padding class="rounded-borders text-primary">
            <q-item
              clickable
              v-ripple
              :active="this.link === 'home'"
              @click="nav('home', '')"
              active-class="my-menu-link"
            >
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>

              <q-item-section>Home</q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :active="link === 'team'"
              @click="nav('team', 'team')"
              active-class="my-menu-link"
            >
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>

              <q-item-section>Team</q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :active="link === 'entries'"
              @click="nav('entries', 'entries')"
              active-class="my-menu-link"
            >
              <q-item-section avatar>
                <q-icon name="delete" />
              </q-item-section>

              <q-item-section>Work Entries</q-item-section>
            </q-item>
          </q-list>
        </div>
        <div class="col-9">
          <router-view />
        </div>
      </div>
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
      link: "home"
    };
  },
  methods: {
    openURL,
    nav: function(label, path) {
      this.link = label;
      this.$router.push(`/organisation/${this.$route.params.account}/${path}`);
    }
  },
  created() {
    const parts = this.$router.app._route.fullPath.split("/").reverse();

    switch (parts[0]) {
      case "team":
        this.nav("team", "team");
        break;
      case "entries":
        this.nav("entries", "entries");
        break;
    }

    this.iconName =
      this.$router.app._route.fullPath === "/" ? "home" : "arrow_back";
  },
  watch: {
    $route(to) {
      this.iconName = to.path === "/" ? "home" : "arrow_back";
    }
  }
};
</script>
<style lang="stylus">
.my-menu-link
  color white
  background #027be3
</style>
