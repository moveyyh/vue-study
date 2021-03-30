const str = `
<div class="box" id="root">
    <h1 class="title">ATS</h1>

    <ul>
      <li>1段</li>
      <li>1段</li>
      <li>2段</li>
    </ul>

    结束语

    <p>完成</p>
</div>
`;

function parseHtml(template) {
  let idx = 0;
  const startTagRegExp = /^\<([a-z]+[1-6]?)(\s[^\<]+)?>/;
  const endTagRegExp = /^\<\/([a-z]+[1-6]?)\>/;
  const textRegExp = /^([^\<]+)\<\/[a-z]+[1-6]?\>/;
  const textRegExp2 = /^([^\<]+)\<[a-z]+[1-6]?\>/;
  const isEmptyWord = /^\s+$/;

  const stack1 = []; // 标签栈
  const stack2 = []; // 空数组栈

  while (idx < template.length - 1) {
    const curTemplate = template.substring(idx);

    let res;

    if ((res = curTemplate.match(startTagRegExp))) {
      // console.log(`开始标记${res[1]}`);

      stack1.push(res[1]);
      stack2.push({
        nodeName: res[1],
        attr: parseAttrString(res[2]),
        type: 1,
        children: [],
      });

      idx += res[0].length;
    } else if ((res = curTemplate.match(endTagRegExp))) {
      const popTag = stack1.pop();
      const popNode = stack2.pop();
      const lastNode = stack2[stack2.length - 1];

      if (popTag !== res[1]) {
        throw new Error(`模板语法错误：${res[1]}没有封闭`);
      }

      if (lastNode) {
        lastNode.children.push(popNode);
      } else {
        stack2.push(popNode);
      }

      idx += res[0].length;
    } else if (
      (res = curTemplate.match(textRegExp) || curTemplate.match(textRegExp2))
    ) {
      if (!isEmptyWord.test(res[1])) {
        stack2[stack2.length - 1].children.push({
          type: 3,
          word: res[1],
        });
      }
      idx += res[1].length;
    } else {
      idx++;
    }
  }

  return stack2[0];
}

function parseAttrString(attrString) {
  let res = [];

  if (!attrString) return res;

  let isInQuotation = false;
  let preIdx = 0;

  let idx = 0;
  while (idx < attrString.length) {
    const chart = attrString[idx];

    if (chart === '"') {
      isInQuotation != isInQuotation;
      idx++;
    } else if (chart === " " && !isInQuotation) {
      res.push(attrString.substring(preIdx, idx).trim());
      preIdx = idx;
      idx++;
    } else {
      idx++;
    }
  }

  if (idx !== preIdx) {
    res.push(attrString.substring(preIdx));
  }

  res = res
    .filter((itemStr) => itemStr.length)
    .map((itemStr) => {
      const res = itemStr.match(/^([^=]+)="(.+)"$/);
      return {
        key: res[1].trim(),
        value: res[2],
      };
    });

  return res;
}

console.log(parseHtml(str));
