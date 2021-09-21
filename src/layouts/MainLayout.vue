<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list separator>
        <q-item-label header>
          Points
        </q-item-label>

        <EssentialLink
          v-for="(item, index) in $store.state.map.points"
          :key="`marker-${index}`"
          v-bind="item"
          :coordinates="item.center"
        />

        <q-item
          clickable
          v-ripple
          @click="addPoint"
        >
          <q-item-section avatar>
            <q-icon name="add_location_alt" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Add point</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { uid } from 'quasar';
import EssentialLink from 'components/EssentialLink.vue';
import { defineComponent, ref } from 'vue';

const linksList = [];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      }
    };
  },
  methods: {
    addPoint() {
      const id = uid();
      this.$store.dispatch('map/push', {
        id,
        title: 'Nuovo punto',
      });
    }
  }
});
</script>
