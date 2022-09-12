const axios = require('axios').default;

const shuffle = arr => arr.sort(() => 0.5 - Math.random());

const models = ['MQ883CH/A', 'MQ8E3CH/A', 'MQ873CH/A', 'MQ8D3CH/A'];
const storeIds = ['R471', 'R532'];

const itemMap = {
    'MQ883CH/A': 'iPhone 14 Pro Max 256GB 银色',
    'MQ8E3CH/A': 'iPhone 14 Pro Max 512GB 银色',
    'MQ873CH/A': 'iPhone 14 Pro Max 256GB 黑色',
    'MQ8D3CH/A': 'iPhone 14 Pro Max 512GB 黑色',
    'R471': 'Apple西湖',
    'R532': 'Apple万象城'
};

function sleep(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

async function run() {
    for (let storeId of storeIds) {
        for (let model of models) {
            const dateTimeStr = new Date().toLocaleString();
            try {
                let response = await axios.get(`https://www.apple.com.cn/shop/fulfillment-messages?pl=true&mt=compact&parts.0=${model}&searchNearby=true&store=${storeId}`);
                if (response.status !== 200) {
                    continue;
                }
                response = response.data;
                if (response.body.content.pickupMessage.stores?.length > 0) {
                    let storeData = response.body.content.pickupMessage.stores.filter((v) => v.storeNumber == storeId)[0] || {};
                    let canBuy = storeData.partsAvailability[model].pickupDisplay === 'available';
                    if (canBuy) {
                        console.log(`[${dateTimeStr}] 🎉🎉🎉${itemMap[model]}在 ${itemMap[storeId]} 有货了🎉🎉🎉`);
                    } else {
                        console.log(`[${dateTimeStr}] 😭😭😭${itemMap[model]}在 ${itemMap[storeId]} 暂时无货😭😭😭`);
                    }
                    await sleep(3000);
                } else {
                    console.error(`[${dateTimeStr}] ❌❌❌请求失败, 120s后恢复轮训请求❌❌❌`);
                    await sleep(120000);
                }
            } catch {}
        }
    }
}

async function main() {
    let i = 1;
    while (true) {
        shuffle(models);
        shuffle(storeIds);
        console.log(`------------------------------ 第${i}轮开始 ------------------------------`);
        await run();
        console.log(`------------------------------ 第${i}轮结束 ------------------------------`);
        i += 1;
    }
}

main();