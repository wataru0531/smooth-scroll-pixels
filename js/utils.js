


// 線形補間 t...補完係数
function lerp(start, end, t, limit = .001) {
  let current = start * (1 - t) + end * t;

  // end と currentの中間値の値が.001未満になれば、endを返す(要調整)
  if (Math.abs(end - current) < limit) current = end;

  return current;
}
// console.log(lerp(10, 15, 0.9991));


// transformを付与。_elはDOM
function setTransform(_el, _transform) {
  _el.style.transform = _transform;
}


export {
  lerp,
  setTransform,
}