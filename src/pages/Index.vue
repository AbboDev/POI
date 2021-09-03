<template>
  <q-page class="flex items-stretch">
    <l-map
      ref="map"
      :zoom="zoom"
      :center="center"
      style="height: auto;"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      />
    </l-map>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';

export default defineComponent({
  components: {
    LMap, LTileLayer
  },
  name: 'PageIndex',
  data() {
    return {
      zoom: 10,
      center: [47.41322, 10.219482]
    };
  },
});
</script>
