/* SET VARIABLES */
var base_url = ""

/* pre-load an exception that you want to highlight, use the short of that exception (e.g. DSM6) */
var selected_exception = "";

/* BUILD LEGENDA */

/* Create legenda for under map */
var color_legenda =	'<div class=legenda-row><div class=legenda-box><div class=legenda-box-color style=background-color:#f46d43></div> No implementation</div></div>' + 
					'<div class=legenda-row><div class=legenda-box><div class=legenda-box-color style=background-color:#fee08b></div> Very restrictive implementation</div></div>' + 
					'<div class=legenda-row><div class=legenda-box><div class=legenda-box-color style=background-color:#a6d96a></div> Restrictive implementation</div></div>' + 
					'<div class=legenda-row><div class=legenda-box><div class=legenda-box-color style=background-color:#1a9850></div> Broad implementation </div></div>' + 
					'<div class=legenda-row><div class=legenda-box><div class=legenda-box-color style=background-color:#e7e7e7></div> No data </div></div>' + 
					'</div>';

/* Load information about exceptions from the Hugo taxonomy */
var exceptionsNames;
$.ajax({
  url: base_url + "/exceptions/index.json",
  dataType: 'json',
  async: false,
  success: function(data) {
    exceptionsNames = data;
  }
});

function getException(shortName) {
	for(var i = 0; i < exceptionsNames.length; i++) {
		var obj = exceptionsNames[i];
		if (obj.short == shortName) {
			return obj;
		}
	}
	return false;
}

/* Load information about jurisdictions from the Hugo taxonomy */
var legalArrangements;
$.ajax({
	url: base_url + "/jurisdictions/index.json",
	dataType: 'json',
	async: false,
	success: function(data) {
	legalArrangements = data;
  }
});

/* Create legenda */
var legenda = '';
jQuery.each(exceptionsNames, function() {
  legenda = legenda + '<p><href id="' + this.short + '"><span class="exception ' + this.short + '">' + this.title + '</span></href></p>';
});
legenda = legenda;

/* FUNCTIONS RELATED TO MAP*/

/* Reset highlight */
function resetHighlight(e) {
	var layer = e.target;
	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}
}

/* On click, close existing infobox and update infobox */
function registerClick(e) {
	var layer = e.target;
	map.closePopup();
	info.update(layer.feature.properties);
}

/* Add click and mouseout features to layers on map */
function onEachFeature(feature, layer) {
	layer.on({
		click : registerClick,
		mouseout: resetHighlight,
	});
	if(layer.hasOwnProperty("feature")){
		layer.setStyle(style(layer.feature));
		popup = layer.bindPopup('<div style="text-align:center;">' + layer.feature.properties.name + '</div>', {closeButton:false});
	 }
}

/* Style each feature */
function style(feature) {
	if (feature.hasOwnProperty('properties')) {
		if (feature.properties.hasOwnProperty('exceptions')) {
			if (feature.properties.exceptions.hasOwnProperty(selected_exception)) {
				color =  getColor(feature.properties.exceptions[selected_exception].score);
			} else {
				color = getColor('n/a');
			}
		} else {
			color = getColor('n/a');
		}
	} else {
		color = '#ff77f8';
	}
	return {	
		fillColor: color,
		weight: 1,
		opacity: 1,
		color: 'black',
		fillOpacity: 0.7
	};
}

/* translate status color code of country to color on map, gray if no code is available */
function getColor(d) { 
	return d == '0' ? '#f46d43':
		   d == '1' ? '#fee08b':
		   d == '2' ? '#a6d96a':
		   d == '3' ? '#1a9850':
					  '#DDDDDD';
}

/* get status text of country to color on map */
function getStatus(s) {
	return s == '0' ? 'The EU exception is not implemented':
		   s == '1' ? 'The national exception is much more restrictive than the EU exception':
		   s == '2' ? 'The national exception is slightly more restrictive than the EU exception':
		   s == '3' ? 'The national exception closely resembles the EU exception':
					  'Copyrightexceptions.eu does not know the implementation status of this exception';
					  
}

/* Change selected exception, using the hash of the URL, in case people link to a specific implementation*/
function changeSelected_Exception (hash) {
	hash = unescape(hash);
	if (hash != '') {
		selected_exception = hash;
		changeException(selected_exception);  
		highlight(selected_exception); 
	} else {
		selected_exception = "";
	}
}

// * set up map */
var map = L.map('map', {preferCanvas: true, zoomControl: false, minZoom:3, maxZoom:60, attributionControl: false, closePopupOnClick: false, scrollWheelZoom: false, sleepOpacity: 1, sleepNote: false}).setView([55, 3], 4);

L.control.zoom({position:'topright'}).addTo(map);
map.once('focus', function() { map.scrollWheelZoom.enable(); });
map.fitBounds(map.getBounds(), {padding: [0, 0]});

/* ADD LOGO */
var mapControlsContainer = document.getElementsByClassName("leaflet-control-zoom leaflet-bar leaflet-control")[0];
var logoContainer = document.createElement("div");
logoContainer.setAttribute("id", "logo");
logoContainer.innerHTML ='<a href="' + base_url + '"><img src="' + base_url + 'images/copyright_exceptions_logo.svg"/></a>';
mapControlsContainer.prepend(logoContainer);

/* LOAD ALL STATIC DATA */

/* Load implementations, generated by hugo */
var implementations;
$.ajax({
  url: base_url + "index.json",
  dataType: 'json',
  async: false,
  success: function(data) {
    implementations = data.implementations;
  }
});

/* Load GEOJSON mapdata, downloaded from https://geojson-maps.ash.ms/ */
var mapdata;
$.ajax({
  url: base_url + "map/mapdata.json",
  dataType: 'json',
  async: false,
  success: function(data) {
    mapdata = data;
  }
});

/* Merge both the GEOSJON mapdata with the country specific JSON */
$.each(mapdata.features, function(key,value) {
  country_code = value.properties.iso_a2;
  if (country_code in implementations) {
  	value.properties["exceptions"] = implementations[country_code];
  }
  else {
  	// remove unwanted countries from map, countries that have no information about them.
  	delete mapdata.features[key];
  }
}); 

/* function to clone a JSON file */
if (typeof JSON.clone !== "function") {
    JSON.clone = function(obj) {
        return JSON.parse(JSON.stringify(obj));
    };
}

/* Clone mapdata, in order to reindex the features map */
mapdataTMP = JSON.clone(mapdata);
mapdata.features = [];
index = 0;
$.each(mapdataTMP.features, function(key,value) {
	if (value != null) {	
		mapdata.features[index] = value;
		index += 1;
	}
}); 

/* Load data in map */
L.geoJson(mapdata, {
	clickable: true,
	style: style,
	onEachFeature: onEachFeature
}).addTo(map);


/* Functions pertaining to Information pane */

// control that shows info on click
var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	return this._div;
};

info.update = function (props) {
	this._div.innerHTML = "";
	if (selected_exception == "" || typeof(selected_exception) == 'undefined') {
		info.showCountryDetails(props.iso_a2)
	} else {
		if (("exceptions" in props) && (selected_exception in props.exceptions)) {
			exceptionDetails = getException(selected_exception);
			this._div.style = "display: inherit;";
			contents = "";
			contents += "<p>";
			contents += "<span class=msname><strong><a href=" + base_url + "jurisdictions/" + props.iso_a2.toLowerCase() + "/ >" + legalArrangements[props.iso_a2]['name'] + "</a></strong></span> ";
			if (props.exceptions[selected_exception].score == 0) {
				contents += "<span class=\"score0\">has not implemented</span> the ";
				contents += "<strong>" + exceptionDetails.title + "</strong>. exception.";
			}
			else {
				contents += "has implemented the ";
				contents += "<a href=" + base_url + "exceptions/" + selected_exception + "/ >" + exceptionDetails.title + "</a> exception ";
				contents += "in <strong>" + props.exceptions[selected_exception]['title'] + "</strong>. ";
				contents += "<span class=score" + props.exceptions[selected_exception].score + ">" + getStatus(props.exceptions[selected_exception].score) + "</span>."
			} 
			
			
			contents += "</p>"
			contents += "<p class=description>" + props.exceptions[selected_exception]['description'] + "</p>"
			contents += "<p class=description><a href='" + base_url + "implementations/" + props.iso_a2.toLowerCase() + "/" + selected_exception + "/' style=text-decoration:none><span class=info_button style=\"margin-bottom:6px;\">More information on this implementation</span></a></p>";

			this._div.innerHTML = contents;
			this._div.firstChild.onmousedown = this._div.firstChild.ondblclick = L.DomEvent.stopPropagation;
		}
		else {// invalid exception
			this._div.style = "display: none;";
		}
		
	}
};

info.showExceptionDetails = function (value) {
	this._div.innerHTML = "";
	if (value == "" || typeof(value) == 'undefined') {
		this._div.style = "display: none;";
	} else {
		found = false
		obj = getException(value);
		if (obj != false) {
			this._div.style = "display: inherit;";
			this._div.innerHTML += "<h2 class=info-name>" + obj.title + '</h2>';
			this._div.innerHTML += "<p class=description>" + obj.summary +  '</p>';
			this._div.innerHTML += '<p class=description><a href="' + base_url + 'exceptions/' + obj.short + '/">See overview of all implementations</a></p>';
			return;
		} else {
			this._div.style = "display: none;";
		}
	}
};

info.showIntroduction = function (value) {
	this._div.innerHTML = "";
	contents = ""
	contents += "<h1>About copyrightexceptions.eu</h1>";
	contents += "<p class=\"description\">This website is a collaborative effort to map user rights in the European Union's copyright framework. To do this copyrightexceptions.eu provides information on the national implementations of the various exceptions and limitations to copyright and related rights foreseen in the EU copyright directives.</p><p class=\"description\"><strong><span class=\"score2\">Use the list of exceptions on the left to see which EU member states have implemented each exception into national legislation.</span></strong></p><p class=\"description\">You can find more information about copyrightexceptions.eu, the methodology behind the site and how you can contribute to this effort on our <a href=\"static/about/\"><strong>about page</strong></a></p>";
	this._div.innerHTML = contents;
}

info.showCountryDetails = function (value) {
	this._div.innerHTML = "";
	contents = "";
	contents += "<h1>" + legalArrangements[value]['name'] + "</h1>";
	contents += "<p>" +  legalArrangements[value]['legalarrangement'] + "</p>";
	contents += '<p><a href="' + base_url + 'jurisdictions/' + value.toLowerCase() + '/">Overview of implementations</a></p>';
	this._div.innerHTML = contents;
}

info.clear = function (exception) {
	if (exception == "" || typeof(exception) == 'undefined') {
		info.showIntroduction()
	} else {
		info.showExceptionDetails(exception);
	}
};

info.addTo(map);

// Disable dragging when user's cursor enters the element
info.getContainer().addEventListener('mouseover', function () {
	map.dragging.disable();
	map.doubleClickZoom.disable();
});

// Re-enable dragging when user's cursor leaves the element
info.getContainer().addEventListener('mouseout', function () {
	map.dragging.enable();
	map.doubleClickZoom.enable();
});


// LEGEND
var legend = L.control({position: 'topleft'});
legend.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'exceptions');
	this._div.innerHTML =  legenda;
    return this._div;
};

legend.update = function (props) {
	this._div.innerHTML = "";
	this._div.innerHTML = props;
};

legend.addTo(map);

//ADD COLOR-LEGENDA 
var ColorLegendaContainer = L.control({position: 'bottomleft'});

ColorLegendaContainer.onAdd = function (map) {
	
	this._div = L.DomUtil.create('div', 'legenda-wrapper');
	this._div.innerHTML =  color_legenda;
    return this._div;
};

ColorLegendaContainer.addTo(map);

function changeException(value) {
	// Clear colors
	$( ".exception" ).css( "background", "url('')" ); 
	$( ".exception" ).css( "background-color", "rgba(242,242,242,0.7)"); 
	$( ".exception" ).css( "color", "#494949");
	
	// clear info box
	info.clear('');
	
	// Show new exception details in info box
	info.showExceptionDetails(value);

	// Update hash for easy linking
	selected_exception = value;
	window.parent.location.hash = selected_exception;

	// Update map
	map.eachLayer(function (layer) {
		if(layer.hasOwnProperty("feature")){
			layer.setStyle(style(layer.feature));
		}
   
	});
	map.closePopup();
}

function highlight(excep) {
	$( ".exception" + "." + excep ).css( "color", "#000000");
	$( ".exception" + "." + excep ).css( "background", "url('')"); 
	$( ".exception" + "." + excep ).css( "background-color", "#CCCCCC"); 
}

// SET exception (based on hash)
if (window.parent.location.hash.substring(1) != "") {
	changeSelected_Exception(window.parent.location.hash.substring(1));
} 

window.parent.onhashchange = function(e) {
	e.preventDefault();
	hash = unescape(window.parent.location.hash.substring(1));
	if (selected_exception != hash) {
	    changeSelected_Exception(hash);
	}
};

function createClickAction( exceptionName ){
  return function(){
    changeException(exceptionName);  
	highlight(exceptionName); 
  };
}

$(document).ready(function(){
	for(var index in exceptionsNames) {
	  if (exceptionsNames[index]["short"] != "") {
	 	 $('#' + exceptionsNames[index]["short"]).click( createClickAction( exceptionsNames[index]["short"] ));
		}
	} 
	if (selected_exception == "" || typeof(selected_exception) == 'undefined') {
		info.showIntroduction();
	}
});

for(var index in exceptionsNames) {
	if (exceptionsNames[index]["short"] != "") {
		$('#' + exceptionsNames[index]["short"]).click( function(){
			changeException(exceptionsNames[index]["short"]);  
			highlight(exceptionsNames[index]["short"]); 
		});
	}else {
		console.log("No short for: " + exceptionsNames[index]["title"]);
	}
}
$( ".info" )
  .mouseover(function() {
   	map.scrollWheelZoom.disable();
  })
  .mouseout(function() {
    map.scrollWheelZoom.enable();
  });
  
$( ".exceptions" )
  .mouseover(function() {
   	map.scrollWheelZoom.disable();
  })
  .mouseout(function() {
    map.scrollWheelZoom.enable();
  });
