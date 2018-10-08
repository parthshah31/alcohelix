

export function next (x, q_st, q_bs, k_bs_max, k_l, dt) {
  if (q_bs <= 0) {
    k_l = 0;
  }

  let k_bs = Math.max(Math.min(0.006*q_st, k_bs_max), 0);

  let delta_q_st = (-k_bs)*dt + x;
  let delta_q_bs = (k_bs - k_l)*dt

  q_st = Math.max(q_st+delta_q_st, 0);
  q_bs = Math.max(q_bs+delta_q_bs, 0);
  return [q_st, q_bs];
}

export function bac (q_bs, gender, weight) {
  let bloodL = (gender === 'M' ? 75 : 65) * weight / 1000.0;
  return 0.01 * q_bs / bloodL;
}

export function bacSeries(
    drinkTimes,
    gender,
    weight,
    food,
    startTime,
    endTime,
    dt) {

  let stdDrinkGrams = 14.0;

  let k_bs_max = null;
  switch(food) {
    case 0:
      k_bs_max = stdDrinkGrams / 10 / 60;
      break;
    case 1:
      k_bs_max = stdDrinkGrams / 20 / 60;
      break;
    case 2:
      k_bs_max = stdDrinkGrams / 30 / 60;
      break;
    default:
      k_bs_max = stdDrinkGrams / 20 / 60;
  }

  let k_l = 8.0 / 60 / 60;

  let times = [];
  let series = [];
  let c = 0;
  let state = [0.0, 0.0];
  let x = 0;

  for (var t=startTime; t<endTime; t+=dt) {
    if (c < drinkTimes.length && t >= drinkTimes[c]) {
      x = stdDrinkGrams;
      c += 1;
    } else {
      x = 0;
    }

    state = next(x, state[0], state[1], k_bs_max, k_l, dt / 1000);
    times.push(t);
    series.push(bac(state[1], gender, weight));
  }

  return [times, series];

}
