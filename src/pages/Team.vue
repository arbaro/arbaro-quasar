<template>
  <q-page padding>
    <q-dialog v-model="workPrompt" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Invite Team Member</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="eosAccountField"
            :rules="[this.$eos.isName]"
            label="EOS Account"
          />
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="payRateField"
            :suffix="symbolName"
            label="Pay Rate"
            placeholder="Tokens awarded per minute"
          />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Record" @click="inviteTeamMember" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="row flex q-col-gutter-xl">
      <div class="col-xs-12 col-sm-9">
        <q-markup-table wrap-cells v-if="roles.length">
          <thead>
            <tr>
              <th class="text-left">Worker</th>
              <th class="text-left">Pay Rate Per Minute</th>
              <th class="text-left">Shares Earned</th>
              <th class="text-left">Active</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.key">
              <td class="text-left">
                <q-chip clickable @click="$router.push(`/profile/${role.key}`)">
                  {{ role.key }}
                </q-chip>
              </td>
              <td class="text-left">{{ role.payrate }}</td>
              <td class="text-left">{{ role.earned }}</td>
              <td class="text-left">
                <q-btn
                  color="primary"
                  v-if="$eosio.data.accountName == role.key"
                  :label="role.active ? 'Resign' : 'Accept'"
                  @click="toggleRole(role.key)"
                />
                <q-icon name="done" v-else-if="role.active" />
                <q-icon name="clear" v-else />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
        <q-card class="my-card" v-else>
          <q-card-section>
            <div class="text-h6">No team members!</div>
          </q-card-section>
          <q-card-section>Press the plus icon to add one. </q-card-section>
        </q-card>
      </div>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        :disable="!$eosio.data.authed"
        fab
        icon="add"
        color="primary"
        @click="workPrompt = true"
      />
    </q-page-sticky>
  </q-page>
</template>

<style></style>

<script>
import wait from "waait";

export default {
  name: "PageIndex",
  data: function() {
    return {
      eosAccountField: "",
      payRateField: "",
      workPrompt: false,
      symbolName: null,
      symbolPrecision: null,
      roles: []
    };
  },
  created: async function() {
    this.refresh();
  },
  methods: {
    refresh: async function(delay = 0) {
      this.$q.loadingBar.start();
      await wait(delay);
      await this.fetchTeamMembers();
      await this.fetchOrg();
      this.$q.loadingBar.stop();
    },
    fetchOrg: async function() {
      const result = await this.$eos.getTable("orgs");
      const org = result.rows.filter(
        x => x.key === this.$route.params.account
      )[0];
      if (!org) this.$q.notify("Failed to find org");
      console.log(org);
      this.symbolName = org.symbol.split(",")[1];
      this.symbolPrecision = org.symbol.split(",")[0];
    },
    roleIdDoesNotExit: async function(input) {
      const result = await this.$eos.getTable("roles");
      const foundNames = result.rows.filter(role => role.key == input);
      if (foundNames.length > 0) {
        return "ID already exists";
      } else {
        return true;
      }
    },
    toggleRole: async function(worker) {
      const role = this.roles.filter(role => role.key === worker)[0];
      await this.$eos.tx("upsertrole", {
        org: this.$route.params.account,
        worker,
        payrate: role.payrate,
        active: !role.active
      });
      await this.refresh(1000);
    },
    inviteTeamMember: async function() {
      await this.$eos.tx("upsertrole", {
        org: this.$route.params.account,
        worker: this.eosAccountField,
        payrate: `${Number(this.payRateField).toFixed(4)} ${this.symbolName}`,
        active: false
      });
      await this.refresh(1000);
    },
    fetchTeamMembers: async function() {
      const tableResult = await this.$eos.getTable(
        "roles",
        this.$route.params.account
      );
      this.roles = tableResult.rows;
    }
  }
};
</script>
