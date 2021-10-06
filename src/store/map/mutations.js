export function updateCenter(state, center) {
  state.center = center;
}

export function push(state, point) {
  state.points.push(point);
}

export function pushMultiple(state, points) {
  state.points = state.points.concat(points);
}

export function update(state, { point, data }) {
  const index = state.points.indexOf(point);

  state.points[index] = {
    ...state.points[index],
    ...data
  };
}

export function remove(state, point) {
  const index = state.points.indexOf(point);

  state.points.splice(index, 1);
}
