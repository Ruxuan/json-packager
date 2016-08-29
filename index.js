var fs      = require('fs');
var path    = require('path');
var sass    = require('node-sass');
var cheerio = require('cheerio');

// TODO: check if getElementByTagName is getting nested div's as well

module.exports = function(dirList, target) {
	var jsonArray   = dirList.map(compileFile);
	var stringified = JSON.stringify(jsonArray);

	fs.writeFile(target, stringified, function(err) {
		if(err) {
        	return console.log(err);
    	}
	})
}

function compileFile(dir) {
	// Get Path information
	var pName = path.basename(dir, ".json");
	var pDir  = path.dirname(dir);
	var noExt = pDir + "/" + pName;

	// Get .json Meta Data file
	var pData = fs.readFileSync(dir);

	// Initialize with Meta Data
	var jsonData = JSON.parse(pData);
	jsonData.presentation = {};

	// Get html file
	var pHtml = fs.readFileSync(noExt + ".html", "utf-8");
	// Get number of slides in the slideshow
	var $     = cheerio.load(pHtml);
	var pLen  = $("div").filter(function(index, element) {
    return $(this).hasClass("step");
  }).length;

	// Get css file
	var pScss = fs.readFileSync(noExt + ".scss", "utf-8");
	if (pScss == "") {
		var pCss = "";
	} else {
		var render = sass.renderSync({
	  		data: pScss
		});
		var pCss   = render.css.toString('utf-8');
	}

	// Add files to json
	jsonData.presentation.html   = pHtml;
	jsonData.presentation.css    = pCss;
	jsonData.presentation.length = pLen;

	// Return JSON
	return jsonData;
}
