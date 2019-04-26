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
            label="Pay Rate"
            placeholder="Tokens awarded per hour"
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
        <q-markup-table wrap-cells>
          <thead>
            <tr>
              <th class="text-left">Worker</th>
              <th class="text-left">Pay Rate</th>
              <th class="text-left">Shares Earned</th>
              <th class="text-left">Role Accepted</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.key">
              <td class="text-left">{{ role.key }}</td>
              <td class="text-left">{{ role.payrate }}</td>
              <td class="text-left">{{ role.earned }}</td>
              <td class="text-left">
                <q-btn
                  color="primary"
                  label="Accept"
                  v-if="!role.roleaccepted"
                  @click="acceptRole(role.key)"
                />
                <q-icon name="done" v-else />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
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
    <q-btn @click="go" label="Go" />
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
      roles: []
    };
  },
  created: async function() {
    this.refresh();
  },
  methods: {
    go: async function() {
      console.log("go hit");

      const response = await this.$dfuse.searchTransactions(
        "account:labelaarbar1 action:claimtime",
        { limit: 10 }
      );
      console.log(response, "was response.");

      // this.$dfuse
      //   .streamActionTraces(
      //     { accounts: "labelaarbar1", action_names: "ct" },
      //     message => {
      //       if (message.type === "action_trace") {
      //         console.log(message.data.trace.act.data);
      //         // const { from, to, quantity, memo } = message.data.trace.act.data;
      //         // console.log(`Transfer [${from} -> ${to}, ${quantity}] (${memo})`);
      //         // this.roles.push({
      //         //   key: from,
      //         //   worker: to
      //         // });
      //       }
      //     }
      //   )
      //   .catch(error => {
      //     console.log("An error occurred.", error);
      //   });
    },
    refresh: async function(delay = 0) {
      await wait(delay);
      await this.fetchTeamMembers();
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
    acceptRole: async function(worker) {
      await this.$eos.tx("acceptrole", {
        org: this.$route.params.account,
        worker
      });
      await this.refresh(1000);
    },
    inviteTeamMember: async function() {
      await this.$eos.tx("createrole", {
        org: this.$route.params.account,
        worker: this.eosAccountField,
        payrate: this.payRateField
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
