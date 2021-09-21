<template>
  <q-item clickable>
    <q-item-section>
      {{ titleLocal }}
      <q-popup-edit
        v-model="titleLocal"
        auto-save
        v-slot="scope"
        @save="update"
      >
        <q-input
          v-model="scope.value"
          dense
          autofocus
          @keyup.enter="scope.set"
        >
          <template #append>
            <q-icon name="edit" />
          </template>
        </q-input>
      </q-popup-edit>

      <q-item-label caption>
        {{ coordinates }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-btn
        round
        color="primary"
        icon="delete"
        @click="remove"
      />
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },
    coordinates: {
      type: Array,
      default() {
        return [];
      }
    },
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      titleLocal: this.title,
    };
  },
  methods: {
    update(value) {
      this.$store.dispatch('map/update', {
        id: this.id,
        data: {
          title: value
        }
      });
    },
    remove() {
      this.$store.dispatch('map/remove', this.id);
    }
  }
});
</script>
