<template>
  <q-page padding>
    <q-dialog v-model="timePrompt" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Create time entry</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="minutes" type="number" label="Minutes worked" />
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="notes"
            type="textarea"
            label="Notes"
            placeholder="Did this and that"
          />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Record" @click="createTimeEntry" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="row flex-center q-col-gutter-xl">
      <div class="col-xs-12 col-sm-8">
        <q-markup-table wrap-cells v-if="entries.length">
          <thead>
            <tr>
              <th class="text-left">Worker</th>
              <th class="text-left">Time</th>
              <th class="text-left">Awarded</th>
              <th class="text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entrie in entries" :key="entrie.transactionId">
              <td class="text-left">{{ entrie.worker }}</td>
              <td class="text-left">{{ entrie.time }}</td>
              <td class="text-left">
                {{ Number(entrie.reward.amount) }} {{ entrie.reward.symbol }}
              </td>
              <td class="text-left">
                {{ entrie.notes }}
              </td>
            </tr>
          </tbody>
        </q-markup-table>
        <q-card class="my-card" v-else>
          <q-card-section>
            <div class="text-h6">No work entries!</div>
          </q-card-section>
          <q-card-section>Press the plus icon to add one. </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-4">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Entries</div>
          </q-card-section>
          <q-card-section>Enter time put towards the project </q-card-section>
        </q-card>
      </div>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        :disable="!$eosio.data.authed"
        fab
        icon="add"
        color="primary"
        @click="timePrompt = true"
      />
    </q-page-sticky>
  </q-page>
</template>

<style></style>

<script>
import wait from "waait";
import moment from "moment";

export default {
  name: "PageIndex",
  data: function() {
    return {
      timePrompt: false,
      notes: "",
      minutes: "",
      entries: []
    };
  },
  created: function() {
    this.refresh();
  },

  methods: {
    refresh: async function(delay) {
      if (delay) await wait(delay);
      await this.fetchWorkEntries();
    },
    fetchWorkEntries: async function() {
      const entries = await this.$api.getWorkEntries(
        this.$route.params.account
      );

      this.entries = entries.map(entry => ({
        ...entry,
        time: moment.duration(entry.minutes, "minutes").humanize()
      }));
    },
    createTimeEntry: async function() {
      await this.$eos.tx("claimtime", {
        worker: this.$eosio.data.accountName,
        org: this.$route.params.account,
        minutes: this.minutes,
        notes: this.notes
      });
      await this.refresh(2000);
    }
  }
};
</script>
