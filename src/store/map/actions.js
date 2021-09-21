export function push({ commit }, point) {
  commit('push', point);
}

export function update({ commit, getters }, { id, data }) {
  const point = getters.getPoint(id);

  if (point) {
    commit('update', { point, data });
  }
}

export function remove({ commit, getters }, id) {
  const point = getters.getPoint(id);

  if (point) {
    commit('remove', point);
  }
}
