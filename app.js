var request = require('request');
var cheerio = require('cheerio');
var url     = require('url');

function scrape(event, context, callback) {
  console.log('Scraping parking.ucf.edu...');
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
      data[name] = {};
      data[name].free = parseInt(rows[i].children[2].children[0].next.children[0].data);
      data[name].total = parseInt(rows[i].children[2].children[0].next.next.data.slice(1).trim());
      data[name].percentage = (data[name].total - data[name].free) / data[name].total;

      console.log('Reading ' + name + ': ' + data[name].free + '/' + data[name].total);
    }

    console.log("----------------------------");
    console.log(data);

  });
}

scrape();
