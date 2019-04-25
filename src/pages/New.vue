<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-stepper v-model="step" ref="stepper" color="primary" animated>
        <q-step
          :name="1"
          title="Create an organisation"
          icon="settings"
          :done="step > 1"
        >
          Arbaro allows team members to mint the tokens project, if you don't
          have one create one at https://token.arbaro.work
          <q-input
            v-model="issuerField"
            :rules="[this.$eos.isName]"
            :lazy-rules="true"
            label="Issuer"
            hint="EOS account which has authority to mint new tokens"
          />
          <q-input
            v-model="symbolField"
            label="Symbol"
            hint="Symbol name of token, e.g. EOS or KARMA"
          />
          <q-input
            v-model="precisionField"
            label="Precision"
            hint="Typically 4"
          />
          <q-input
            v-model="tokenContractField"
            label="Token Contract"
            hint="Contract which runs the token"
          />
          <q-input
            v-model="friendlyField"
            label="Friendly Name"
            placeholder="Contoso Enterprises Ltd"
          />
          <q-btn
            label="Create organisation"
            color="primary"
            @click="createOrganisation"
          />
        </q-step>

        <q-step
          :name="2"
          title="Grant Permission"
          icon="create_new_folder"
          :done="step > 2"
        >
          <p>
            In order to mint new tokens the Arbaro contract must have permission
            to mint new tokens as the issuer.
          </p>
          <q-btn
            label="Grant Permission"
            color="primary"
            @click="grantPermission"
          />
        </q-step>

        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              @click="$refs.stepper.next()"
              color="primary"
              :label="step === 4 ? 'Finish' : 'Continue'"
            />
            <q-btn
              v-if="step > 1"
              flat
              color="primary"
              @click="$refs.stepper.previous()"
              label="Back"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </div>
  </q-page>
</template>

<style></style>

<script>
export default {
  name: "PageIndex",
  data: function() {
    return {
      step: 1,
      tokenContractField: "arbarotokenn",
      issuerField: "",
      symbolField: "",
      precisionField: "",
      friendlyField: ""
    };
  },
  methods: {
    async createOrganisation() {
      await this.$eos.tx("createorg", {
        owner: this.issuerField,
        tokensym: `${this.precisionField},${this.symbolField}`,
        tokencon: this.tokenContractField,
        friendlyname: this.friendlyField
      });
    },
    async grantPermission() {
      try {
        const tokenIssuerAccount = await this.$rpc.get_account(
          this.issuerField
        );
        const activePermissions = tokenIssuerAccount.permissions.find(
          permission => permission.perm_name === "active"
        ).required_auth;

        if (
          activePermissions.accounts.find(
            permission => permission.permission.actor === process.env.CONTRACT
          )
        ) {
          this.$q.notify({
            message: "Permission already granted",
            color: "warning"
          });
          return;
        }

        const data = {
          account: this.issuerField,
          permission: "active",
          auth: {
            ...activePermissions,
            accounts: [
              ...activePermissions.accounts,
              {
                permission: {
                  actor: process.env.CONTRACT,
                  permission: `active`
                },
                weight: 1
              }
            ]
          },
          parent: "owner"
        };

        await this.$eosio.tx({
          actions: [
            {
              account: "eosio",
              name: "updateauth",
              authorization: [
                {
                  actor: this.issuerField,
                  permission: "active"
                }
              ],
              data
            }
          ]
        });
      } catch (e) {
        this.$q.notify({
          message: `Failed to lookup account ${this.issuerField}`,
          color: "negative"
        });
      }
    }
  }
};
</script>
