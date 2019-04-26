<template>
  <q-page padding>
    <q-dialog v-model="workPrompt" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Invite Team Member</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="roleIdField"
            :rules="[this.$eos.isName, roleIdDoesNotExit]"
            :lazy-rules="true"
            label="Role ID"
            hint="Acts as unique ID, can be anything"
          />
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
            type="number"
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
              <th class="text-left">Role ID</th>
              <th class="text-left">Pay Rate</th>
              <th class="text-left">Shares Earned</th>
              <th class="text-left">Role Accepted</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.key">
              <td class="text-left">{{ role.worker }}</td>
              <td class="text-left">{{ role.key }}</td>
              <td class="text-left">{{ role.payrate }}</td>
              <td class="text-left">{{ role.shares }}</td>
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
      roleIdField: "",
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
      // this.$dfuse
      //   .streamActionTraces(
      //     { accounts: "eosio.token", action_names: "transfer" },
      //     message => {
      //       if (message.type === "action_trace") {
      //         const { from, to, quantity, memo } = message.data.trace.act.data;
      //         console.log(`Transfer [${from} -> ${to}, ${quantity}] (${memo})`);
      //         this.roles.push({
      //           key: from,
      //           worker: to
      //         });
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
    acceptRole: async function(role) {
      await this.$eos.tx("acceptrole", { role });
      await this.refresh(1000);
    },
    inviteTeamMember: async function() {
      await this.$eos.tx("createrole", {
        org: this.$route.params.account,
        worker: this.eosAccountField,
        role: this.roleIdField,
        payrate: this.payRateField
      });
      await this.refresh(1000);
    },
    fetchTeamMembers: async function() {
      const tableResult = await this.$eos.getTable("roles");
      this.roles = tableResult.rows.filter(
        role => role.org == this.$route.params.account
      );
    }
  }
};
</script>
