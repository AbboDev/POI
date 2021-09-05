export function push(state, point) {
  state.points.push(point);
}

export function update(state, { point, data }) {
  const index = state.points.indexOf(point);

  state.points[index] = {
    ...state.points[index],
    ...data
  };
}
