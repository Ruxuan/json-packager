var fs      = require('fs');
var path    = require('path');
var sass    = require('node-sass');
var cheerio = require('cheerio');

module.exports = function(dirList, target) {
	var jsonArray   = dirList.map(compileFile);
	var stringified = JSON.stringify(jsonArray);

	fs.writeFile(target, stringified, function(err) {
		if(err) {
      console.log(err.message);
    } else {
			console.log("Successfully wrote json package");
		}
	});
}

function compileFile(dir) {
	// Get Path information
	var noExt = path.dirname(dir) + "/" + path.basename(dir, ".json");

	// Get .json Meta Data file
	var pData = fs.readFileSync(dir);

	// Initialize with Meta Data
	var jsonData = JSON.parse(pData);

	// Get cheerio of html file
	var $     = cheerio.load(fs.readFileSync(noExt + ".html", "utf-8"));
  var steps = [];
  $("#impress-base > div").each(function(i, el) {
    // Get id attr of div as its title
    var title;
    if (cheerio(el).attr('id') !== undefined) {
      title = cheerio(el).attr('id');
    } else {
      title = null;
    }

    steps.push({
      slideIndex: i,
      title: title,
      html: cheerio.load(el).html()
    });
  });

	// Get css file
	var pScss = fs.readFileSync(noExt + ".scss", "utf-8");
	if (pScss == "") {
		pCss = "";
	} else {
		var render = sass.renderSync({
      data: pScss
		});
		var pCss   = render.css.toString('utf-8');
	}

	// Add files to json
  jsonData.presentation        = {};
  jsonData.presentation.steps  = steps;
	jsonData.presentation.css    = pCss;
	jsonData.presentation.length = steps.length;

	// Return JSON
	return jsonData;
}
