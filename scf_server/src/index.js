'use strict';
const puppeteer = require('puppeteer');
const userNumber = 1;
const userstart = 0;
const loadUrl = 'https://bqq.gtimg.com/ccsdk_gray/static/webrtc-agentbar-sip.html';

exports.main_handler = async (event,context,callback) => {
    console.dir(event);
    if(null == event['KeepAliveduration'] || null == event['RegistrationAddress'] || null == event['VoipAccountInstances'])
    {
        return "event.para erro, need KeepAliveduration RegistrationAddress and VoipAccountInstances";
    }

    let KeepAliveduration = event['KeepAliveduration'];
    let VoipAccountInstances = event['VoipAccountInstances'];
    let RegistrationAddress  = event['RegistrationAddress'];
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--use-fake-device-for-media-stream',   // should comment this in non headless mode
            '--use-fake-ui-for-media-stream',    // should comment this in non headless mode
            '--allow-hidden-media-playback',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--alsa-input-device',
        ],
        executablePath:'/opt/google/chrome/chrome',
        defaultViewport: null
    })
    console.log("KeepAliveduration:"+KeepAliveduration);
    console.log("RegistrationAddress:"+RegistrationAddress);

    for(var index in VoipAccountInstances){
        console.log("==========开始登录==========");
        console.log("voipnumber:"+VoipAccountInstances[index].VoipAccount);
        console.log("passwd:"+VoipAccountInstances[index].VoipPassword);
        const page = await browser.newPage();
        await page.goto(loadUrl);
        await page.waitForTimeout(1000);
        await page.click('#inject');
        await page.$eval('#voipNumber', el => el.value = '');
        await page.focus('#voipNumber');
        await page.keyboard.type(String(VoipAccountInstances[index].VoipAccount));
        await page.$eval('#voipPassword', el => el.value = '');
        await page.focus('#voipPassword');
        await page.keyboard.type(String(VoipAccountInstances[index].VoipPassword));
        await page.$eval('#url', el => el.value = '');
        await page.focus('#url');
        await page.keyboard.type(String(RegistrationAddress));
        await page.waitForSelector('#config');
        await page.click('#config');

        console.log("==========登录成功==========");
    }
 
    console.log("====================全部登录成功====================");

    setTimeout(() => {
        browser.close();
        },KeepAliveduration);



    return "Ok";
};

