export function updateCenter({ commit }, center) {
  if (Array.isArray(center)
    && center.length === 2
    && !isNaN(center[0])
    && !isNaN(center[1])
  ) {
    commit('updateCenter', center);
  }
}

export function push({ commit, state }, point) {
  if (typeof point.center === 'undefined') {
    point.center = state.center;
  }

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
