<template>
  <q-page padding>
    <q-dialog v-model="donationPrompt" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Make a donation</div>
          <div class="text">
            Your donation will be sent directly to contributors of the Arbaro
            project based on their time spent in developing the project!
          </div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="donationAmount"
            :lazy-rules="true"
            type="number"
            suffix="EOS"
            label="Donation Amount"
          />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Donate" @click="donateTrigger" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="aboutPrompt" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">About</div>
        </q-card-section>
        <q-card-section>
          <div class="text">
            Arbaro is a platform which allows small Open Source projects to
            award contributors Brownie Points issuing whatever token specified.
          </div>
          <div class="text">
            Combined with the Arbaro Token contract in particular, contributors
            can automatically receive dividends from donations.
          </div>
          <div class="text flex justify-around">
            <q-icon
              @click="open('https://github.com/arbaro')"
              name="fab fa-github"
              style="font-size: 2rem;"
            />
            <q-icon
              @click="open('https://t.me/arbarowork')"
              name="fab fa-telegram"
              style="font-size: 2rem;"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="row flex-center q-col-gutter-xl">
      <div class="col-xs-12 col-sm-4 flex flex-center">
        <q-card class="my-card bg-primary text-white col">
          <q-card-section>
            <div class="text-h6">Arbaro</div>
            <div class="text-subtitle2">by John Williamson</div>
          </q-card-section>
          <q-card-section>
            {{ about }}
          </q-card-section>

          <q-separator dark />

          <q-card-actions>
            <q-btn flat @click="aboutPrompt = true">About</q-btn>
            <q-btn
              :disable="!$eosio.data.authed"
              flat
              @click="donationPrompt = true"
              >Donate</q-btn
            >
            <q-btn flat @click="refresh">Refresh</q-btn>
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-4 m q-gutter-lg">
        <q-list bordered separator>
          <q-item-label header>Organisations</q-item-label>
          <q-item
            v-for="org in orgs"
            :key="org.key"
            clickable
            @click="$router.push(`organisation/${org.key}`)"
            v-ripple
          >
            <q-item-section>
              <q-item-label>{{ org.key }}</q-item-label>
              <!-- <q-item-label caption>{{ lorem }}</q-item-label> -->
            </q-item-section>
            <!-- <q-item-section side top> -->
            <!-- 1 min ago -->
            <!-- <q-badge color="teal" label="10k" /> -->
            <!-- </q-item-section> -->
          </q-item>
        </q-list>
        <q-list bordered separator>
          <q-item-label header>Profiles</q-item-label>
          <q-item
            v-for="profile in profiles"
            :key="profile.prof"
            clickable
            @click="$router.push(`profile/${profile.prof}`)"
            v-ripple
          >
            <q-item-section>
              <q-chip color="white">
                <q-avatar v-if="profile.pic">
                  <img :src="profile.pic" />
                </q-avatar>
                {{ profile.friendly || profile.prof }}
              </q-chip>

              <!-- <q-item-label caption>{{ lorem }}</q-item-label> -->
            </q-item-section>
            <!-- <q-item-section side top> -->
            <!-- 1 min ago -->
            <!-- <q-badge color="teal" label="10k" /> -->
            <!-- </q-item-section> -->
          </q-item>
        </q-list>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        :disable="!$eosio.data.authed"
        fab
        icon="add"
        color="primary"
        @click="$router.push(`new`)"
      />
    </q-page-sticky>
  </q-page>
</template>

<style></style>

<script>
import { openURL } from "quasar";
export default {
  name: "PageIndex",
  data: function() {
    return {
      url: "https://johnwilliamson.io/images/avatar.jpg",
      about: "Award contributors brownie points based on their minutes worked.",
      friendlyname: "John Williamson",
      donationPrompt: false,
      donationAmount: "",
      orgs: [],
      aboutPrompt: false,
      profiles: []
    };
  },
  created: async function() {
    this.refresh();
  },
  methods: {
    open(url) {
      openURL(url);
    },
    async donateTrigger() {
      await this.$eos.transfer(
        "johnn.y",
        `${Number(this.donationAmount).toFixed(4)} EOS`,
        "ty"
      );
    },
    async refresh() {
      await this.fetchOrgs();
      await this.fetchProfiles();
    },
    async fetchOrgs() {
      const result = await this.$eos.getTable("orgs");
      this.orgs = result.rows;
    },
    async fetchProfiles() {
      const result = await this.$api.getProfiles();
      this.profiles = result;
      // this.orgs = result.rows;
    }
  }
};
</script>
