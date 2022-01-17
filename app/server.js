

const express = require("express");
const bodyParser = require("body-parser");

const tools = require('./function');
const router = express.Router();
const app = express();

app.use("/", router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/', (req, res) => {
    res.end("Started on PORT " + (typeof process.env.PORT !== 'undefined' ? process.env.PORT : '5000'));
});

router.post('/screenshot', (req, res) => {
    if (req.method === 'POST') {
        tools.collectRequestData(req, result => {
            let _token = null;
            let _url = null;

            if (typeof result.token !== 'undefined' && result.token === 'montoken') {
                _token = result.token;
            }
            if (typeof result.url !== 'undefined' && result.url) {
                _url = result.url;
            }

            if (_token !== null && _url !== null) {
                let _imageName = _url.replace(/(^\w+:|^)\/\/(www.)?/, '') + '.png';
                (async () => {
                    await tools.doScreenshot(_url, _imageName, res)
                        .then((base64) => { 
                            console.log('ok'); 
                            });
                })();
               
            }
        });
    }
});


app.listen(process.env.PORT || 5000, () => {
    console.log("Started on PORT " + (typeof process.env.PORT !== 'undefined' ? process.env.PORT : '5000'));
})