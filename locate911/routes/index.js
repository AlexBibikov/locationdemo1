var express = require('express');
var router = express.Router();
var needLocation = [];
var ID = 1;
var locations = [{ id: 2, phone: 2145970489}];
var timerId;

function getRecordById(id) {
    return locations.filter(function (d) {
        return d.id == id;
    });
}

function getRecordByPhone(phone) {
    return locations.filter(function (d) {
        return d.phone == phone;
    });
}

router.get('/locations', function (req, res) {
    var p = req.query.p;
    if (p) {
        try {
            var record = getRecordByPhone(+p);
            if (record.length) {
                needLocation.push(record[0].id);
                res.json(record[0]);
            }
            else {
                res.json({ found: "none" });
            }
        } catch (e) {
            res.json(e);
        }
    }
    else {
        res.json(locations);
    }
});

router.post('/location/:id', function (req, res) {
    var record = getRecordById(req.params.id);
    if (record.length) {
        record[0].coord = req.body;
        res.json(record[0]);
    }
    else {
        res.json({ 'not': 'found' });
    }
});

router.get('/register/:phone', function (req, res) {
    ID += 1;
    var record = { id: ID, phone: req.params.phone };
    res.send("OK, " + ID);
});


router.get('/stream', function (req, res) {
    console.log('stream');

    req.setTimeout(9999999999999);
    
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    res.write('\n');
    
    req.on("close", function () {
        clearInterval(timerId);
        console.log("clearInterval(" + timerId + ");");
    });
    
    timerId = setInterval(function () {
        while (needLocation.length > 0) {
            console.log("needLocation[0] is " + needLocation[0]);
            res.write("data: " + needLocation[0] + "\n\n");
            needLocation.shift();
        }
    }, 1000);
    
    console.log("setInterval() returns " + timerId);
});

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Location' });
});

module.exports = router;