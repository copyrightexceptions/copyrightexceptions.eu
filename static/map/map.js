/* SET VARIABLES */
var base_url = "/v2dev/"

/* pre-load an exception that you want to highlight, use the short of that exception (e.g. DSM6) */
var selected_exception = "";

/* BUILD LEGENDA */

/* Create legenda for under map and table */
var color_legenda = '<div id=legenda>' + 
					'<div class=legenda-row><div class=legenda-box><div class=legenda-box-color style=background-color:#DDD></div> No information</div></div>' + 
					'<div class=legenda-row><div class=legenda-box><div class=legenda-box-color style=background-color:#f46d43></div> No implementation</div></div>' + 
					'<div class=legenda-row><div class=legenda-box><div class=legenda-box-color style=background-color:#fee08b></div> Very restrictive implementation</div></div>' + 
					'<div class=legenda-row><div class=legenda-box><div class=legenda-box-color style=background-color:#a6d96a></div> Restrictive implementation</div></div>' + 
					'<div class=legenda-row><div class=legenda-box><div class=legenda-box-color style=background-color:#1a9850></div> Broad implementation </div></div>' + 
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

/* Create legenda */
var legenda = '';
jQuery.each(exceptionsNames, function() {
  legenda = legenda + '<p><href id="' + this.short + '"><span class="exception ' + this.short + '">' + this.title + '</span></href></p>';
});
legenda = legenda + color_legenda;

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
				color =  getColor(feature.properties.exceptions[selected_exception].Implemented);
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

/* Switch between table view and map view */
function switchView (setView) {
	if (setView === undefined) {
		setView = 'auto';
	}
	switch(setView) {
		// auto detects whether map or table is currently active and switches to the other.
		case 'auto':
				if ($("#table").css("z-index") > $("#map").css("z-index")) {
					$("#table").css("z-index", "0");
					$("#map").css("z-index", "1");
					window.parent.location.hash = selected_exception;
				} else {
					window.parent.location.hash = 'table';
					$("#table").css("z-index", "1");
					$("#map").css("z-index", "0");
				}
			break;
		case 'table':
			window.parent.location.hash = 'table';
			$("#table").css("z-index", "1");
			$("#map").css("z-index", "0");
			break;
		case 'map':
			window.parent.location.hash = selected_exception;
			$("#table").css("z-index", "0");
			$("#map").css("z-index", "1");
			break;
	}
	map.setView([55, 10], 4);	
}

/* Change selected exception, using the hash of the URL, in case people link to a specific implementation*/
function changeSelected_Exception (hash) {
	hash = unescape(hash);
	if (hash != '') {
		if (hash == 'table') { // Additionally check if table view is requested
			switchView(hash);
		} else {
			selected_exception = hash;
			changeException(selected_exception);  
			highlight(selected_exception); 
		}
	} else {
		selected_exception = "";
	}
}

/* Generates the table view of the data. */
function loadTable(data, names, implementations) {  
	var table = $("<table/>").addClass('data-table');
	var row = $("<tr/>").addClass( "table_header" );
	row.append($("<th/>").text(''));
	for (var country in implementations) {
		cell = $("<th/>");
		cell.attr('title', country);
		$('<a>'+ country +'</a>').attr({'href': '/jurisdictions/' + country.toLowerCase()}).appendTo(cell);
		row.append(cell);
	}
	table.append(row);
	
	$.each (names, function( key, exception ) {
		var row = $("<tr/>");
		cell = $("<td/>");
		cell.html("<span class=exception>" + names[key].title + "</span>");
		short_name = names[key].short;
		row.append(cell);
		for (var country in implementations) {
			if ( implementations[country].hasOwnProperty(short_name)) {
				cell = $("<td/>").css("background-color", getColor(implementations[country][short_name].Implemented));
				$('<a></a>').attr({'href': '/implementations/' + country.toLowerCase() + '/' + short_name + '/'}).appendTo(cell);
			}
			else {
				cell = $("<td/>").css("background-color", getColor(''));
			}
			row.append(cell);
		}
		table.append(row);
	});
	return table;
}

/* Create interface for map */
var viewControl =  L.Control.extend({
  options: {
    position: 'topright'
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-switch');

    container.style.backgroundColor = '';     
    container.innerHTML= '<a href="#table" class="SwitchMAP">SHOW TABLE</href>';

    return container;
  }
});

// * set up map */
var map = L.map('map', {preferCanvas: true, zoomControl: false, minZoom:3, maxZoom:60, attributionControl: false, closePopupOnClick: false, scrollWheelZoom: false, sleepOpacity: 1, sleepNote: false}).setView([55, 10], 4);

map.addControl(new viewControl());
L.control.zoom({position:'topright'}).addTo(map);
map.once('focus', function() { map.scrollWheelZoom.enable(); });
map.fitBounds(map.getBounds(), {padding: [0, 0]});

/* ADD LOGO */
var mapControlsContainer = document.getElementsByClassName("leaflet-top leaflet-right")[0];
var logoContainer = document.createElement("div");
logoContainer.setAttribute("id", "logo");
logoContainer.innerHTML ='<a href="' + base_url + '"><img src="' + base_url + 'images/copyright_exceptions_logo.svg"/></a>';
mapControlsContainer.insertBefore(logoContainer, mapControlsContainer.firstChild);

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
table = loadTable(mapdata, exceptionsNames, implementations);
tableLogo = '<div id=tablelogo><a href="' + base_url + '"><img src="' + base_url + 'images/copyright_exceptions_logo.svg"/></a></div>'
tableSwitch = '<div id=switch><a href="' + base_url + '" class="SwitchTABLE">SHOW MAP</a></div>'
$("#table").html(tableLogo + tableSwitch + table[0].outerHTML + color_legenda);



/* Functions pertaining to Information pane */

// control that shows info on click
var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this._div.style = "display: none;";
	return this._div;
};

info.update = function (props) {
	this._div.innerHTML = "";
	if (selected_exception == "" || typeof(selected_exception) == 'undefined') {
		this._div.style = "display: none;";
	} else {
		if (("exceptions" in props) && (selected_exception in props.exceptions)) {
			this._div.style = "display: inherit;";
			this._div.innerHTML += "<span class=country-name>" + props.name + "<a href=\"javascript:info.clear('" + selected_exception + "')\" id=closeinfo style=text-decoration:none><span class=info_button>X</a></span>";	
			this._div.innerHTML += 	"<p>&nbsp;</p>";
		
			if (props.exceptions[selected_exception].Implemented != "") {
				this._div.innerHTML += 	"<p>Implementation status: </p><p><span>" + getStatus(props.exceptions[selected_exception].Implemented) +  '</span></p>';
				this._div.innerHTML += 	"<p>&nbsp;</p>";
			}
		
			if (props.exceptions[selected_exception]['Article Number in local act (TEXT)'] != '') {
				this._div.innerHTML += 	"<p>Article Number in local act: </p><p><span>" + props.exceptions[selected_exception]['Article Number in local act (TEXT)'] +  '</span></p>';
				this._div.innerHTML += 	"<p>&nbsp;</p>";
			}
		
			if (props.exceptions[selected_exception].Description != "") {
				this._div.innerHTML += 	"<p>Description: </p><p><span>" + props.exceptions[selected_exception].Description +  '</span></p>';
				this._div.innerHTML += 	"<p>&nbsp;</p>";
			}
		
			this._div.innerHTML += "<p><a href='/feedback' style=text-decoration:none><span class=info_button> FEEDBACK</span></a></p>";
			this._div.innerHTML += "<p><a href='" + base_url + "implementations/" + props.iso_a2.toLowerCase() + "/" + selected_exception + "/' style=text-decoration:none><span class=info_button style=\"margin-bottom:6px;\">MORE DETAILS ON THIS EXCEPTION</span></a></p>";
			this._div.innerHTML += "<p><a href='" + base_url +  "jurisdictions/" + props.iso_a2.toLowerCase() + "/' style=text-decoration:none><span class=info_button style=\"margin-bottom:6px;\">SEE ALL EXCEPTIONS OF " + props.name.toUpperCase() + "</span></a>";
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
		this._div.style = "display: inherit;";
		for(var i = 0; i < exceptionsNames.length; i++) {
			var obj = exceptionsNames[i];
			if (obj.short == value) {
				found = true;
				this._div.innerHTML += "<span class=country-name>" + obj.title + "<a href='javascript:info.clear()' id=closeinfo style=text-decoration:none><span class=info_button>X</a></span>" + '</span>';
				this._div.innerHTML += 	"<p>&nbsp;</p>";
				this._div.innerHTML += 	"<p>Summary: </p><p><span>" + obj.summary +  '</span></p>';
				this._div.innerHTML += '<p>&nbsp;</p><p><a href="' + base_url + 'exceptions/' + obj.short + '/">Overview of implementations</a></p>';
				return;
			}
		}
		
		if (!found) {
			this._div.style = "display: none;";
		}
	}
};

info.clear = function (exception) {
	if (exception == "" || typeof(exception) == 'undefined') {
		this._div.style = "display: none;";
		this._div.innerHTML = "";
		map.closePopup();
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
	$( ".exception" + "." + excep ).css( "color", "#feffff");
	$( ".exception" + "." + excep ).css( "background", "url('')"); 
	$( ".exception" + "." + excep ).css( "background-color", "#494949"); 
}


function showMap () {
	legend.update(legenda);
}

// SET exception (based on hash)
changeSelected_Exception(window.parent.location.hash.substring(1));

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
$('.SwitchMAP').click(function(){ switchView(); return false;});
$('.SwitchTABLE').click(function(){ switchView(); return false;});
$('#closeinfo').click(function(){ switchView(); return false;});
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

$(document).on('mouseenter mouseleave', '.data-table td', function () {
	var i = $(this).index(),
	col = $(this);
	if (i > 0) {
		th = col.closest('table').find('th').eq(i);
		th.toggleClass('data-table-hightlight');
		th.children().toggleClass('data-table-hightlight');
		
		first = col.closest('tr').find('td').eq(0);
		first.children().toggleClass('table-name-hover');
	}
});

$(document).on('click', '.SwitchTABLE', function(e){
    e.preventDefault(); // stop default action
    switchView(); 
    return false;
});