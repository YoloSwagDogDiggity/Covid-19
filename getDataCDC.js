var rp = require('request-promise');
var fs = require('fs');
const chalk = require('chalk');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;



function usStatsCacher() {
  rp('https://www.worldometers.info/coronavirus/country/us/')
  .then(function (nice) {
    const dom = new JSDOM(nice);
    let jsonArr = [];
    let table = dom.window.document.getElementById("usa_table_countries_today").tBodies.item(0).rows;
    for (let i = 0; i < table.length; i++) {
      let cells = table[i].cells;
      let JSONbuilder2 = {
        "state": cells[0].textContent.trim(),
        "cases": cells[1].textContent.trim(),
        "newcases": cells[2].textContent.trim(),
        "deaths": cells[3].textContent.trim(), //deaths number has strange trailing whitespace, so it's trimmed here
        "newdeaths": cells[4].textContent.trim(),
        "activecases": cells[5].textContent.trim()
      }
      jsonArr.push(JSONbuilder2);
    }
    fs.writeFile("USstats.json", JSON.stringify(jsonArr), function (err) {
      if (err)
        return console.log(err);
    });
    console.log(chalk.magenta("Successfully cached US data!!"));
  })
  .catch(function (err) {
    console.log(chalk.red("US cache retrieval error: ") + err)
  });
}


function worldMetersCacher(){
  rp('https://www.worldometers.info/coronavirus/')
  .then(function (nice) {
    const dom = new JSDOM(nice);
    let jsonArr = [];
    let totalCases = dom.window.document.getElementsByClassName("maincounter-number")[0].textContent.trim();
    let totalDeaths = dom.window.document.getElementsByClassName("maincounter-number")[1].textContent.trim();
    let totalRecovered = dom.window.document.getElementsByClassName("maincounter-number")[2].textContent.trim();
    let totalActiveCases = dom.window.document.getElementsByClassName("number-table-main")[0].textContent.trim();
    let JSONbuilder = {
      "totalCases": totalCases,
      "totalDeaths": totalDeaths,
      "totalRecovered": totalRecovered,
      "totalActiveCases": totalActiveCases
    }
    jsonArr.push(JSONbuilder);
    let table = dom.window.document.getElementById("main_table_countries_today").tBodies.item(0).rows;
    for (let i = 0; i < table.length; i++) {
      let cells = table[i].cells;
      let JSONbuilder2 = {
        "country": cells[0].textContent,
        "cases": cells[1].textContent,
        "newcases": cells[2].textContent,
        "deaths": cells[3].textContent.trim(), //deaths number has strange trailing whitespace, so it's trimmed here
        "newdeaths": cells[4].textContent,
        "recovered": cells[5].textContent,
        "activecases": cells[6].textContent,
        "criticalcases": cells[7].textContent
      }
      jsonArr.push(JSONbuilder2);
    }
    fs.writeFile("WorldStats.json", JSON.stringify(jsonArr), function (err) {
      if (err)
        return console.log(err);
    });
    console.log(chalk.magenta("Successfully cached world data!!"));
  })
  .catch(function (err) {
    console.log(chalk.red("World cache retrieval error: ") + err)
  });
}

exports.worldCache = worldMetersCacher;
exports.update = usStatsCacher;