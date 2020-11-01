

function selection(choices, number) {
  // return selection 'number' of (unique) samples from choices

  if (number >= choices.length) {
    throw "not enough choices";
  }

  let chosen = 0;
  let selected = [];

  while(chosen < number) {
    let select = sample(choices);
    let already_picked = false;

    for (let sel in selected) {
      let preSelected = selected[sel];
      if (preSelected === select) {
        already_picked = true;
      }
    }
    if (already_picked === false) {
      selected.push(select);
      chosen++;
    }
  }

  return selected;
}


function sample(choices) {
  let index = Math.floor(Math.random() * choices.length);
  // console.log(index);
  return choices[index];
}


function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}


export {
  selection,
  clamp
}
