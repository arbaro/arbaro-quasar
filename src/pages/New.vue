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
          <q-input
            v-model="friendlyField"
            label="Friendly Name"
            placeholder="Contoso Enterprises Ltd"
          />
          Account "{{ $eosio.data.accountName }}" should represent the
          organisation being created. If not, please login with organisation
          account.
        </q-step>

        <q-step
          :name="2"
          title="Token Minting"
          icon="create_new_folder"
          :done="step > 2"
        >
          <p>
            What token should Arbaro mint for team members?
          </p>
          <q-input
            v-model="$eosio.data.accountName"
            :disable="true"
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
            hint="Contract which hosts the token"
          />
        </q-step>

        <q-step
          :name="3"
          title="Permission"
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
              @click="next"
              color="primary"
              :label="step === 3 ? 'Finish' : 'Continue'"
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
      tokenContractField: process.env.ARBARO_TOKEN_CONTRACT,
      issuerField: "",
      symbolField: "",
      precisionField: "",
      friendlyField: "",
      offerPermission: false
    };
  },
  created: function() {
    if (this.$eosio.data.accountName) {
      this.checkIfOrgExists();
    }
  },
  methods: {
    async checkIfOrgExists() {
      const result = await this.$eos.getTable("orgs");
      const orgExists = result.rows.filter(
        org => org.key === this.$eosio.data.accountName
      )[0];
      if (orgExists) {
        this.step = 3;
        this.$q.notify("Organisation already created for this account.");
      }
    },
    async createOrganisation() {
      await this.$eos.tx("createorg", {
        owner: this.issuerField,
        tokensym: `${this.precisionField},${this.symbolField}`,
        tokencon: this.tokenContractField,
        friendlyname: this.friendlyField
      });
    },
    async next() {
      if (this.step == 2) {
        await this.createOrganisation();
      }
      if (this.step == 3) {
        this.$router.push("/");
        return;
      }
      this.$refs.stepper.next();
    },
    finish() {
      this.$router.push(`/organisation/${this.$eosio.data.accountName}`);
    },
    async grantPermission() {
      try {
        const tokenIssuerAccount = await this.$rpc.get_account(
          this.$eosio.data.accountName
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
          account: this.$eosio.data.accountName,
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
                  actor: this.$eosio.data.accountName,
                  permission: "active"
                }
              ],
              data
            }
          ]
        });
      } catch (e) {
        this.$q.notify({
          message: `Failed to lookup account ${this.$eosio.data.accountName}`,
          color: "negative"
        });
      }
    }
  }
};
</script>
