<template>
  <q-page padding>
    <q-dialog v-model="donationPrompt" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            Make a donation to {{ $route.params.account }}
          </div>
          <div class="text">
            Your donation will be sent directly to contributors of the
            {{ $route.params.account }}
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
          <q-btn flat label="Donate" @click="donate" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editOrgPrompt" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            Edit Organisation {{ $route.params.account }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="tokensym" :lazy-rules="true" label="Symbol" />
          <q-input
            v-model="precisionField"
            :lazy-rules="true"
            label="Precision"
          />
          <q-input v-model="tokenContractField" label="Token Contract" />
          <q-input v-model="friendlyField" label="Friendly name" />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save" @click="upsertOrg" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
            <div class="text-h5 flex flex-center">
              {{ friendlyname || $route.params.account }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-icon
              @click="open(gitUrl)"
              v-if="gitUrl"
              name="fab fa-github"
              style="font-size: 2rem;"
            />
            <q-icon
              @click="open(`https://eosq.app/account/${$route.params.account}`)"
              v-if="gitUrl"
              name="account_balance_wallet"
              style="font-size: 2rem;"
            />
            <q-btn
              v-if="$eosio.data.accountName == $route.params.account"
              label="Edit Profile"
              color="primary"
              @click="$router.push(`/editprofile`)"
            />
            <q-space />
            <q-btn
              v-if="$eosio.data.accountName == $route.params.account"
              label="Edit Organisation"
              color="primary"
              @click="editOrg"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6">
        <q-card v-if="arbaroTokenEnabled">
          <q-card-section>
            <div class="text-h6">Arbaro Token Enabled</div>
          </q-card-section>
          <q-card-section>
            <q-btn
              label="Donate"
              @click="donateTrigger"
              color="primary"
              :disable="!$eosio.data.authed"
            />
          </q-card-section>
        </q-card>
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
      url: "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
      friendlyname: "",
      tokenContract: "",
      symbolName: "",
      gitUrl: "",
      about: "",
      precision: null,
      donationPrompt: false,
      editOrgPrompt: false,
      donationAmount: "",
      tokensym: "",
      precisionField: "",
      tokenContractField: "",
      friendlyField: "",
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
    async donateTrigger() {
      this.donationPrompt = true;
    },
    async editOrg() {
      this.editOrgPrompt = true;
    },
    async upsertOrg() {
      await this.$eos.tx("upsertorg", {
        owner: this.$eosio.data.accountName,
        tokensym: `${this.precisionField},${this.tokensym}`,
        tokencon: this.tokenContractField,
        friendlyname: this.friendlyField
      });
      const tableResult = await this.$eos.getTable(
        "roles",
        this.$route.params.account
      );

      for (var i = 0; i < tableResult.rows.length; i++) {
        await this.$eos.tx("upsertrole", {
          org: this.$route.params.account,
          worker: tableResult.rows[i].key,
          payrate: `${tableResult.rows[i].payrate.split(" ")[0]} ${
            this.tokensym
          }`,
          active: Boolean(tableResult.rows[i].active)
        });
      }
    },
    async donate() {
      this.$eos.transfer(
        process.env.ARBARO_TOKEN_CONTRACT,
        `${Number(this.donationAmount).toFixed(4)} EOS`,
        `${this.symbolName}:${this.precision}`
      );
    },
    async refresh() {
      this.fetchOrganisation(this.$route.params.account);
      this.fetchProfile(this.$route.params.account);
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
      this.arbaroTokenEnabled = tokencon == process.env.ARBARO_TOKEN_CONTRACT;
    }
  }
};
</script>
