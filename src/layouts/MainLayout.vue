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

const Buffer = require('buffer/').Buffer;

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

      const ascii2utf8 = function(buffer) {
        let c;
        let i;
        let j;

        // New buffer with utf8 string:
        const utf8 = Buffer.alloc(buffer.length * 2);

        // Convert:
        j = 0;
        for (i = 0; i < buffer.length; i++) {
          c = buffer.readUInt8(i, 1);

          if (c < 0x80) {
            utf8.writeUInt8(buffer.readUInt8(i, 1), j += 1);
          } else if (c < 0xc0) {
            utf8.writeUInt8(0xc2, j += 1);
            utf8.writeUInt8(buffer.readUInt8(i, 1), j += 1);
          } else {
            utf8.writeUInt8(0xc3, j += 1);
            utf8.writeUInt8(buffer.readUInt8(i, 1) - 0x40, j += 1);
          }
        }

        return utf8.toString('utf8', 0, j);
      };

      reader.onload = (event) => {
        const ov2 = Buffer.from(event.target.result);
        const records = [];

        let type;
        let rlength;

        let record = 0;
        let i = 0;

        record = 0;
        i = 0;

        try {
          do {
            type = ov2.readUInt8(i + 0);
            rlength = ov2.readUInt32LE(i + 1);

            switch (type) {
            // Deleted record:
            case 0:
              throw new Error(`The type "${type}" is not yet decoded!`);

            // Skipper Record:
            case 1:
              throw new Error(`The type "${type}" is not yet decoded!`);
              // records[record] = {
              //   record,
              //   type,
              //   bytes: rlength,
              //   λwest: ov2.readInt32LE(i + 5) / 100000,
              //   φsouth: ov2.readInt32LE(i + 9) / 100000,
              //   λeast: ov2.readInt32LE(i + 13) / 100000,
              //   φnorth: ov2.readInt32LE(i + 17) / 100000,
              // };

              // i += 21;
              // record += 1;
              // break;

            // Simple POI Record:
            case 2:
              records[record] = {
                record,
                type,
                length: rlength,
                lng: ov2.readInt32LE(i + 5) / 100000,
                lat: ov2.readInt32LE(i + 9) / 100000,
                info: ascii2utf8(ov2.slice(i + 13, i + (rlength)))
                  .replace(/\0/g, ''),
              };

              if (records[record].lng && records[record].lat) {
                if (!records[record].info) {
                  records[record].info = 'Nuovo punto';
                }
                this.$store.dispatch('map/push', {
                  id: uid(),
                  title: records[record].info,
                  center: [records[record].lat, records[record].lng]
                });
              } else {
                throw new Error(`The record "${record}" misses properties!`);
              }

              i += ov2.readUInt32LE(i + 1);
              record += 1;
              break;

            // Extended POI Record:
            case 3:
              throw new Error(`The type "${type}" is not yet decoded!`);

            default:
              throw new Error(`The type "${type}" is unknown!`);
            }
          } while (i < ov2.length);
        } catch (error) {
          console.error(error);
        }
      };

      reader.readAsArrayBuffer(this.file);
    }
  }
});
</script>
