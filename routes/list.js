const express = require('express');
const router = express.Router();
const fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {
    fs.readdir('./csv', (err, _) => {
      const fileName = _.filter(_ => _.lastIndexOf(".csv") >= 0)
      .map(_ => _.split(".csv")[0])
      .reduce((a, b) => a > Number(b)? a :Number(b), 0);
      fs.readFile(`./csv/${fileName}.csv`, 'utf8', (err, data) => {
        if (err) throw err;
        const lines = data.split("\n");
        const [title, price, point, image] = lines[0].split(';');
        const rsp = {};
        
        // 헤더 버림
        lines.shift();
        
        const key = [title, price, point, image];
        
        rsp.data = lines.map(_ => {
          let i = 0;
          console.log(_);
          return _.split(';').reduce((a, b) =>{
            a[key[i++]] = b;
            return a;
          }, {});
        })
        console.log(lines[0]);
        res.send(rsp);
      });
    });
  
});

module.exports = router;
