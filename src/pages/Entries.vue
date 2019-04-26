<template>
  <q-page padding>
    <q-dialog v-model="timePrompt" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Create time entry</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="decHours" type="number" label="Dec hours" />
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
        <q-markup-table wrap-cells>
          <thead>
            <tr>
              <th class="text-left">Worker</th>
              <th class="text-left">Hours</th>
              <th class="text-left">Awarded</th>
              <th class="text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left">thekellygang</td>
              <td class="text-left">2 hours</td>
              <td class="text-left">200.0000 ABC</td>
              <td class="text-left">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Molestiae adipisci veritatis eius commodi nisi animi inventore
                porro a asperiores? Vitae perspiciatis voluptatibus ex
                voluptates sequi quo ratione laboriosam laborum iusto?
              </td>
            </tr>
            <tr>
              <td class="text-left">thekellygang</td>
              <td class="text-left">2 hours</td>
              <td class="text-left">200.0000 ABC</td>
              <td class="text-left">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Molestiae adipisci veritatis eius commodi nisi animi inventore
                porro a asperiores? Vitae perspiciatis voluptatibus ex
                voluptates sequi quo ratione laboriosam laborum iusto?
              </td>
            </tr>
            <tr>
              <td class="text-left">thekellygang</td>
              <td class="text-left">2 hours</td>
              <td class="text-left">200.0000 ABC</td>
              <td class="text-left">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Molestiae adipisci veritatis eius commodi nisi animi inventore
                porro a asperiores? Vitae perspiciatis voluptatibus ex
                voluptates sequi quo ratione laboriosam laborum iusto?
              </td>
            </tr>
          </tbody>
        </q-markup-table>
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
export default {
  name: "PageIndex",
  data: function() {
    return {
      timePrompt: false,
      notes: "",
      decHours: ""
    };
  },
  methods: {
    createTimeEntry: async function() {
      await this.$eos.tx("claimtime", {
        role: "dev",
        dechours: this.decHours,
        notes: this.notes
      });
    }
  }
};
</script>
