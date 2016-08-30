var request = require('request');
var cheerio = require('cheerio');
var url     = require('url');

// exports.handler = function(event, context, callback) {
function scrape(event, context, callback) {
  console.log('Scraping');
  var host_name = 'http://secure.parking.ucf.edu/GarageCount/iframe.aspx';

  request(host_name, function(error, response, html) {
    if (error) {
      console.log("Error:", error);
      return;
    }

    var $ = cheerio.load(html);

    var data = {};

    var rows = $('.dxgvDataRow_DevEx');
    for (var i = 0; i < rows.length; i += 1) {
      var name = rows[i].children[1].children[0].data;
      var free = rows[i].children[2].children[0].next.children[0].data;
      var total = rows[i].children[2].children[0].next.next.data;
      data[name] = {
        free: parseInt(free),
        total: parseInt(total.slice(1).trim())
      };
      data[name].percentage = (data[name].total - data[name].free) / data[name].total;
    }

    console.log(data);

  });
}

scrape();



// exports = module.exports = app;
