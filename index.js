var fs   = require('fs');
var path = require('path');
var sass = require('node-sass');

module.exports = function(dir) {
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
	jsonData.presentation.html = pHtml;
	jsonData.presentation.css  = pCss;

	// Return JSON
	return jsonData;
}