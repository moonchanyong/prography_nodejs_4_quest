const express = require('express');
const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const router = express.Router();
const crawLink = "http://www.kyobobook.co.kr/search/SearchCommonMain.jsp?vPstrCategory=TOT&vPstrKeyWord=node.js&vPplace=top";
const filePath = "./";

/* GET home page. */
router.get('/', async (req, res, next) => {
    let tryCount = 0;
    while (tryCount < 5) {
        const browser = await puppeteer.launch()
        try {
            
            const pages = [];
            let result = [];
            const goList = (page, x) => new Promise((r, v) => {
                page.evaluate(`golist("${x * 20}")`).then(r);
            });

            for(let i = 0; i < 5; ++i ) pages.push(await browser.newPage());
            await Promise.all(
                pages.map((_) => _.goto(crawLink))
            );
            let pageNum = 0;
            await Promise.all(
                pages.map((_) => goList(_, pageNum++))
            )
            // TODO: page load 되었는지 확인 하는부분 필요 
            await pages[0].waitFor(5000);
            result = await Promise.all(
                pages.map(
                    _ =>  _.evaluate(() => {
                        const result = [];
                        const item = $('#container > div:nth-child(19) > form > table > tbody  > tr');
                        item.each((idx, el) =>{
                            const url =  el.querySelector("a>img").src;
                            const point = el.querySelector(".klover") && el.querySelector(".klover").querySelector("a") ? el.querySelector(".klover").querySelector("a").innerText : "";
                            const title = el.querySelector("div.title") ? el.querySelector("div.title").firstElementChild.innerText : "";
                            const price = el.querySelector("div.sell_price")? el.querySelector("div.sell_price").innerText.split('원')[0].trim().concat('원') : "";
                            
                            result.push({
                                url,
                                point,
                                title,
                                price
                            });
                        });
                        return Promise.resolve(result);
                    })
                )
            )
            console.log("checker6");
            result = result.reduce((a, b) => [...a, ...b]);
            await browser.close();
            await save(result, () => { tryCount = 7;res.send('success crawl')});
        } catch(e) {
            tryCount++;
            await browser.close();
            console.log(e);
        }
    }
});

function save(data, callback) {
    console.debug("crawldData :", data);
    return new Promise((r, v) => {
        const csvWriter = createCsvWriter({
            // TODO: Delimiter monkeypatch
            fieldDelimiter: ";",
            path: `./csv/${filePath}${Date.now()}.csv`,
            header: [
                {id: 'title', title: '제목'},
                {id: 'price', title: '가격'},
                {id: 'point', title: '평점'},
                {id: 'url', title: '이미지'}
            ]
        });
        csvWriter.writeRecords(data)       // returns a promise
            .then(() => {callback();r();});
    })
}

module.exports = router;