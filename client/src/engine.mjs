const std_drink_grams = 14.0;
const K_L_ON = 8.0 / 60 / 60;
const alpha_bs = 0.006
const minDrinkWaitTime =  5 * 60;


export function calc_K_BS_MAX(food) {
  let K_BS_MAX = null;
  switch(food) {
    case 0:
      K_BS_MAX = std_drink_grams / 10 / 60;
      break;
    case 1:
      K_BS_MAX = std_drink_grams / 20 / 60;
      break;
    case 2:
      K_BS_MAX = std_drink_grams / 30 / 60;
      break;
    default:
      K_BS_MAX = std_drink_grams / 20 / 60;
  }
  return K_BS_MAX;
}


export function nextControl(goal, state, gender, weight, dt) {
  let b = 0.08 / goal / 100
  let DISCRETE_K_BS = alpha_bs * dt;
  let g1 = DISCRETE_K_BS - 1;
  let g2 = (g1 / DISCRETE_K_BS) - 1;
  let p = mgFromBAC(goal, gender, weight) / DISCRETE_K_BS;
  let x = p + g1*state[0] + g2*state[1]
  return x * b;
}


export function nextControlPID(goal, state, totBacErr, gender, weight, dt) {
  let DISCRETE_K_BS = alpha_bs * dt;
  let currBac = bac(state[1], gender, weight);
  let bacErr = goal - currBac;
  totBacErr += bacErr;

  let k_p = 15;
  let k_i = 0.07;
  let k_d = 0.0;

  let x = (k_p * bacErr) + (k_i * totBacErr) + (-0.02 * state[0]);
  return [Math.max(x, 0), totBacErr];
}


export function next (x, q_st, q_bs, K_BS_MAX, dt) {
  let K_L = (q_bs <= 0) ? 0 : K_L_ON;
  let K_BS = Math.max(Math.min(alpha_bs*q_st, K_BS_MAX), 0);

  let delta_q_st = (-K_BS)*dt + x;
  let delta_q_bs = (K_BS - K_L)*dt

  q_st = Math.max(q_st+delta_q_st, 0);
  q_bs = Math.max(q_bs+delta_q_bs, 0);
  return [q_st, q_bs];
}


export function bac (q_bs, gender, weight) {
  let bloodL = (gender === 'M' ? 75 : 65) * weight / 2.2 / 1000.0;
  return 0.01 * q_bs / bloodL;
}


export function mgFromBAC (bac, gender, weight) {
  let bloodL = (gender === 'M' ? 75 : 65) * weight / 2.2 /1000.0;
  return bac *  bloodL / 0.01;
}


export function getControlSchedule(
    initial_q_st,
    initial_q_bs,
    drinkTimes,
    gender,
    weight,
    food,
    startTime,
    currentTime,
    endTime,
    dt,
    goal) {

    let controlStartTime = currentTime + minDrinkWaitTime;
    if (drinkTimes.length > 0) {
      controlStartTime = drinkTimes[drinkTimes.length-1] + minDrinkWaitTime;
    }
    let pastSeries = getBacSeries(
    initial_q_st,
    initial_q_bs,
    drinkTimes,
    gender,
    weight,
    food,
    startTime,
    controlStartTime,
    dt);

  let state = pastSeries[2];
  let x = 0;
  let K_BS_MAX = calc_K_BS_MAX(food);
  let schedule = [currentTime];
  let totX = 0;
  let xSeries = [];

  let totBacErr = 0.0;
  for (var t=controlStartTime; t<endTime; t+=dt) {
    [x, totBacErr] = nextControlPID(goal, state, totBacErr, gender, weight, dt);
    totX += x;
    if (totX >= 1.0*std_drink_grams) {
      schedule.push(Math.floor(0.6*t+0.4*schedule[schedule.length-1]));
      totX -= std_drink_grams;
    }
    state = next(x, state[0], state[1], K_BS_MAX, dt);
  }
  return schedule.slice(1);
}


export function getIdealControlSeries(
    initial_q_st,
    initial_q_bs,
    drinkTimes,
    gender,
    weight,
    food,
    startTime,
    currentTime,
    endTime,
    dt,
    goal) {

  let controlStartTime = currentTime + minDrinkWaitTime;
  if (drinkTimes.length > 0) {
    controlStartTime = drinkTimes[drinkTimes.length-1] + minDrinkWaitTime;
  }

  let pastSeries = getBacSeries(
    initial_q_st,
    initial_q_bs,
    drinkTimes,
    gender,
    weight,
    food,
    startTime,
    controlStartTime,
    dt);

  let times = pastSeries[0];
  let series = pastSeries[1];
  let state = pastSeries[2];
  let x = 0;
  let K_BS_MAX = calc_K_BS_MAX(food);

  let xSeries = [];
  let totBacErr = 0.0;
  for (var t=controlStartTime; t<endTime; t+=dt) {
    [x, totBacErr] = nextControlPID(goal, state, totBacErr, gender, weight, dt);
    xSeries.push(x);
    times.push(t);
    series.push(bac(state[1], gender, weight));
    state = next(x, state[0], state[1], K_BS_MAX, dt);
  }
  console.log(xSeries);
  return [times, series, state];
}


export function getBacSeries(
    initial_q_st,
    initial_q_bs,
    drinkTimes,
    gender,
    weight,
    food,
    startTime,
    endTime,
    dt) {

  let K_BS_MAX = calc_K_BS_MAX(food);
  let times = [];
  let series = [];
  let c = 0;
  let state = [initial_q_st, initial_q_bs];
  let x = 0;

  for (var t=startTime; t<endTime; t+=dt) {
    x = 0;

    while (c < drinkTimes.length && t >= drinkTimes[c]) {
      x += std_drink_grams;
      c += 1;
    }
    times.push(t);
    series.push(bac(state[1], gender, weight));
    state = next(x, state[0], state[1], K_BS_MAX, dt);

  }

  return [times, series, state];

}
