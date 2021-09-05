export function getPoint(state) {
  return (id) => {
    return state.points.find((item) => {
      return item.id === id;
    });
  };
}
