const fs = require('fs');                                                                                                                                                                                                                                                     
const inquirer = require('inquirer');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    'headless': true,
    'args': ['--no-sandbox']
  });
  const page = await browser.newPage();
  const url = 'http://www.xicidaili.com/nn';
	await fetch_url(page, url, 10);
  await browser.close();
})();

async function fetch_url (page, url, pageLimit = 10) {
  await page.goto(url);
  console.log(`Opened url: ${url}`);
  let arr = await page.evaluate(() => {
    let unfiltered_list = [...document.querySelectorAll('#ip_list tr')];
    unfiltered_list.shift();
    return unfiltered_list.map(item => {
      return {
        ip: item.querySelector('td:nth-of-type(2)').innerText,
        port: item.querySelector('td:nth-of-type(3)').innerText,
        addr: item.querySelector('td:nth-of-type(4)').innerText
      }
    })
  });
  arr = await filter_ip(arr);
  await save_ip(arr);
  if (!url.endsWith(pageLimit)) {
    await fetch_url(page, url.replace(/^(.*?)(\d+)?$/, (str, ...match) => match[0] + ((parseInt(match[1], 10) + 1) || '/1')));
  }
}

async function filter_ip (ip_list) {
  let input = await inquirer.prompt({
    type: 'input',
    name: 'perc',
    message: 'Input pass percentage: (0-100)'
  });
  let perc = +input.perc;
  ip_list = ip_list.filter(ip => {
    return Math.random() * 100 < perc;
  })
  return ip_list;
}

async function save_ip (ip_list) {
  await fs.writeFile('output/ip_ports.txt', JSON.stringify(ip_list, null, 2) + ',\n', { flag: 'a+' }, err => {
    if (err) {
        return console.error(err);
    }
    console.log("数据写入成功！");
//    console.log("--------我是分割线-------------")
//    console.log("读取写入的数据！");
//    fs.readFile('output/ip_ports.txt', function (err, data) {
//       if (err) {
//          return console.error(err);
//       }
//       console.log("异步读取文件数据: \n" + data.toString());
//    });
  });
}
