const fs = require('fs');                                                                                                                                                                                                                                                     
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    'headless': true,
    'args': ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://www.xicidaili.com/nn');
  await page.waitFor(2000);
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
	await save_ip(arr);
  await browser.close();
})();

async function save_ip (ip_list) {
  await fs.writeFile('ip_ports.txt', JSON.stringify(ip_list, null, 2) + ',\n', { flag: 'a+' }, err => {
    if (err) {
        return console.error(err);
    }
    console.log("数据写入成功！");
    console.log("--------我是分割线-------------")
    console.log("读取写入的数据！");
    fs.readFile('ip_ports.txt', function (err, data) {
       if (err) {
          return console.error(err);
       }
       console.log("异步读取文件数据: \n" + data.toString());
    });
  });
}
