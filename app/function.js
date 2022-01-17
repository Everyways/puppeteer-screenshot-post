
const { parse } = require('querystring');
const unlinkSync = require('fs');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const _filePath = __dirname + '/files/';

async function doScreenshot(url, imageName, res) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.emulateMediaType('screen');
    await page.goto(url,
        {
            waitUntil: 'load',
            timeout: 0
        });

    await page.screenshot({
        fullPage: true,
        type: 'png'
        //  encoding: 'base64'
    })
    .then(async (result) => {
        deleteFilePath();
        console.log(url + ' got some results.');
        await saveFile(imageName, result);
        const $bas64Img = await getFile(imageName)
            .then((data) => {
                return data;
            });

            res.send($bas64Img);
    })
    .catch(e => {
        console.error(url + ' Error in screenshooting => ', e);
        return false;
    });

    await browser.close();
}

const saveFile = (imgNam, myImage) => {
    return new Promise((resolve, reject) => {
        console.log('sauvegarde ' + _filePath + imgNam);
        fs.writeFile(_filePath + imgNam, myImage, function (err) {
            if (err) return console.log('erreur sauvegarde' + err);
            resolve();
        });

    });
}

function deleteFilePath() {
    fs.readdir(_filePath, function (err, files) {
        if (err) throw err;
        if (files) {
            files.forEach(function (file) {
                console.log('delete file ' + file);
                fs.unlink(_filePath + file, function (err) {
                    if (err) throw err;
                });
            });
        }
    });
}

const getFile = (myFile) => {
    return new Promise((resolve, reject) => {
        console.log('get file ' + _filePath + myFile);
        fs.readFile(_filePath + myFile, { encoding: 'base64' }, (err, data) => {
            if (err) {
                reject(err)  // calling `reject` will cause the promise to fail with or without the error passed as an argument
                return        // and we don't want to go any further
            }
            resolve(data)
        })
    })
}


function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if (request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}


module.exports = { doScreenshot, saveFile, getFile, deleteFilePath, collectRequestData };