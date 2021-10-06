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
      <q-list>
        <q-item-label header>
          Points
        </q-item-label>

        <EssentialLink
          v-for="(item, index) in $store.state.map.points"
          :key="`marker-${index}`"
          v-bind="item"
          :coordinates="item.center"
        />

        <q-separator />

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

        <q-item>
          <q-item-section>
            <q-file
              clearable
              borderless
              v-model="file"
              label="Import points"
            >
              <template #before>
                <q-icon name="share_location" />
              </template>
              <template #after>
                <q-btn
                  round
                  color="primary"
                  icon="send"
                  @click="importPoints"
                />
              </template>
            </q-file>
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
import { importOV2 } from '../utils/ov2';

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false);

    return {
      file: ref(null),
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      }
    };
  },
  methods: {
    addPoint() {
      this.$store.dispatch('map/push', {
        id: uid(),
        title: 'Nuovo punto',
      });
    },
    importPoints() {
      const reader = new FileReader();
      const importStatus = this.$q.notify({
        type: 'primary',
        message: 'Importazione avviata...',
        group: false,
        timeout: 0,
        spinner: true,
      });

      reader.onload = (event) => {
        importOV2(event.target.result)
          .then((records) => {
            return new Promise((resolve) => {
              const points = [];
              const errors = [];

              importStatus({
                message: 'Caricamento record...',
                caption: '0%'
              });

              for (const record of records) {
                if (record.lng && record.lat) {
                  if (!record.info) {
                    record.info = this.file.name.replace(/\.[^/.]+$/, '');
                  }

                  points.push({
                    id: uid(),
                    title: record.info,
                    center: [record.lat, record.lng]
                  });
                } else {
                  errors.push(`The record "${record}" misses properties!`);
                }

                importStatus({
                  caption: `${Math.floor(record * 100 / records.length)}%`
                });
              }

              resolve(points);
            });
          })
          .then((points) => {
            return new Promise((resolve) => {
              let i = 0;
              const step = 100;

              importStatus({
                message: 'Registrazione punti...',
                caption: '0%'
              });

              const interval = setInterval(() => {
                const min = i * step;
                const max = Math.min((i + 1) * step, points.length);

                if (max >= points.length) {
                  clearInterval(interval);
                  resolve();
                }

                importStatus({
                  caption: `${Math.floor(max * 100 / points.length)}%`
                });

                this.$store.dispatch(
                  'map/pushMultiple',
                  points.slice(min, max)
                );
                ++i;
              }, 500);
            });
          })
          .catch((error) => {
            this.$q.notify({
              type: 'negative',
              message: error.message,
              timeout: 2500,
              progress: true
            });
          })
          .then(() => {
            importStatus({
              icon: 'done',
              spinner: false,
              message: 'Importazione terminata!',
              timeout: 2500,
              progress: true
            });
          });
      };

      reader.readAsArrayBuffer(this.file);
    }
  }
});
</script>
