var str = "2[3[aq]2[b]3[2[ac]4[ad]]]";

function repeat(str) {
  const stack1 = []; // 数字栈
  const stack2 = []; // 字符串栈
  const regNum = /^([0-9])\[/;
  const regStr = /^(\w+)\]/;

  let idx = 0;

  while (idx < str.length - 1) {
    let res;
    const curStr = str.substring(idx);
    if ((res = curStr.match(regNum))) {
      stack1.push(parseInt(res[1]));
      stack2.push("");

      idx += res[0].length;
    } else if ((res = curStr.match(regStr))) {
      stack2[stack2.length - 1] = res[1];

      idx += res[1].length;
    } else if (curStr[0] === "]") {
      const repeatStr = stack2.pop().repeat(stack1.pop());

      stack2[stack2.length - 1] += repeatStr;

      idx++;
    } else {
      idx++;
    }
  }

  return stack2[0];
}

console.log(repeat(str));
