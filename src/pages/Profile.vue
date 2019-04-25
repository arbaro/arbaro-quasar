<template>
  <q-page padding>
    <div class="row flex-center q-col-gutter-xl">
      <div class="col-xs-12 col-sm-4 flex flex-center">
        <q-img
          :src="url"
          spinner-color="white"
          style="height: 140px; max-width: 150px"
        />
      </div>

      <div class="col-xs-12 col-sm-4">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">About</div>
          </q-card-section>
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row flex-center q-col-gutter-xl">
      <div class="col-xs-12 col-sm-4 flex flex-center">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">{{ friendlyname }}</div>
          </q-card-section>
          <q-card-section>
            {{ lorem }}
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-4 ">
        <q-list bordered separator>
          <q-item-label header>Recent Activity</q-item-label>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>Contoso</q-item-label>
              <q-item-label caption>{{ lorem }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
              1 min ago
              <q-badge color="teal" label="10k" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<style></style>

<script>
export default {
  name: "PageIndex",
  data: function() {
    return {
      lorem: `Lorem ipsum dolor sit, amet consectetur
          adipisicing elit. Aperiam nulla laboriosam iure nisi mollitia nesciunt
          deserunt quaerat adipisci, optio laborum iste odit, illum dignissimos
          blanditiis eligendi perferendis facere vitae possimus.`,
      url: "https://johnwilliamson.io/images/avatar.jpg",
      friendlyname: "John Williamson"
    };
  }
};
</script>
