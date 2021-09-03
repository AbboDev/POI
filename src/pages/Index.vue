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

      <l-marker
        :lat-lng="center"
        draggable
        @dragend="drag"
      >
        <l-popup>
          {{ center }}
        </l-popup>
      </l-marker>
    </l-map>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import {
  LMap,
  LPopup,
  LMarker,
  LTileLayer
} from '@vue-leaflet/vue-leaflet';

export default defineComponent({
  components: {
    LMap,
    LPopup,
    LMarker,
    LTileLayer
  },
  name: 'PageIndex',
  data() {
    return {
      zoom: 15,
      center: [45.69173591, 9.23902452]
    };
  },
  methods: {
    drag(event) {
      const marker = event.target;
      let position = marker.getLatLng();
      position = {
        ...position,
        lat: position.lat.toFixed(8),
        lng: position.lng.toFixed(8)
      };

      const popup = marker.getPopup();
      popup.setContent(`[ ${position.lat}, ${position.lng} ]`);
    },
  },
});
</script>
