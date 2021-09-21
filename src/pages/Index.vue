<template>
  <q-page class="flex items-stretch">
    <l-map
      :tap="false"
      ref="map"
      :zoom="zoom"
      :center="center"
      style="height: auto;"
      @click="addMarker"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      />

      <l-marker
        v-for="(item, index) in $store.state.map.points"
        :key="`marker-${index}`"
        :lat-lng="item.center"
        draggable
        @add="add($event, item)"
        @dragend="drag"
      >
        <l-popup>
          {{ item.title }}
        </l-popup>
      </l-marker>
    </l-map>
  </q-page>
</template>

<script>
import { uid } from 'quasar';
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
    addMarker(event) {
      if (event.latlng) {
        const id = uid();
        const position = Object.values(event.latlng).map((coordinate) => {
          return parseFloat(coordinate.toFixed(8));
        });

        this.$store.dispatch('map/push', {
          id,
          title: 'Nuovo punto',
          center: position,
        });
      }
    },
    add(event, item) {
      event.target.id = item.id;
    },
    drag(event) {
      const marker = event.target;
      const position = Object.values(marker.getLatLng()).map((coordinate) => {
        return parseFloat(coordinate.toFixed(8));
      });

      this.$store.dispatch('map/update', {
        id: marker.id,
        data: {
          center: position
        }
      });
    },
  },
});
</script>
