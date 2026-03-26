const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeDeepData() {
    try {
        const res = await axios.get('https://m.christuniversity.in/dept/faculty-details/ODYzNg==/NjI=');
        const $ = cheerio.load(res.data);
        const results = {};

        $('.accordion').each((idx, acc) => {
            // Find the associated tab id
            const sectionHeader = $(acc).closest('.tab-pane').attr('id') || 'Section-' + idx;
            const items = [];

            $(acc).find('.card').each((i, card) => {
                const title = $(card).find('.card-header').text().replace(/\s+/g, ' ').trim();
                const details = {};

                $(card).find('.card-body p').each((j, p) => {
                    const text = $(p).text().replace(/\s+/g, ' ').trim();
                    if (text) {
                        const parts = text.split(':');
                        if (parts.length > 1) {
                            const key = parts.shift().trim();
                            details[key] = parts.join(':').trim();
                        } else {
                            details['info'] = text;
                        }
                    }
                });

                if (title) items.push({ title, details });
            });

            results[sectionHeader] = items;
        });

        fs.writeFileSync('scrape_output.json', JSON.stringify(results, null, 2));
        console.log("Scraping complete. Generated scrape_output.json.");
    } catch (err) {
        console.error(err.message);
    }
}
scrapeDeepData();
