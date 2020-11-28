var selected_exception = "dummy";
var lat, lng;

var color_legenda = '<div id=legenda><div class=legenda-row><div class=legenda-box><div class=legenda-box-color style=background-color:#f46d43></div> No implementation</div></div><div class=legenda-row><div class=legenda-box><div class=legenda-box-color style=background-color:#fee08b></div> Very restrictive implementation</div></div><div class=legenda-row><div class=legenda-box><div class=legenda-box-color style=background-color:#a6d96a></div> Restrictive implementation</div></div><div class=legenda-row><div class=legenda-box><div class=legenda-box-color style=background-color:#1a9850></div> Broad implementation </div></div></div>'
// LOAD ALL IMPLEMENTATIONS FROM THE HUGO TAXONOMY
var implementations;
$.ajax({
  url: "/v2dev/index.json",
  dataType: 'json',
  async: false,
  success: function(data) {
    implementations = data.implementations;
  }
});

// LOAD ALL MAP FROM MAPDATA FOLDER
var mapdata;
$.ajax({
  url: "/v2dev/mapdata/map.json",
  dataType: 'json',
  async: false,
  success: function(data) {
    mapdata = data;
  }
});

// MERGE
$.each(mapdata.features, function(key,value) {
  country_code = value.properties.iso_a2;
  if (country_code in implementations) {
  	value.properties["exceptions"] = implementations[country_code];
  }
  else {
  	delete mapdata.features[key];
  }
}); 

if (typeof JSON.clone !== "function") {
    JSON.clone = function(obj) {
        return JSON.parse(JSON.stringify(obj));
    };
}

mapdataTMP = JSON.clone(mapdata)
mapdata.features = [];
index = 0
$.each(mapdataTMP.features, function(key,value) {
	console.log()
	if (value != null) {	
		mapdata.features[index] = value;
		index += 1;
	}
}); 

// LOAD ALL EXCEPTIONS FROM THE HUGO TAXONOMY
var exceptionsNames;
$.ajax({
  url: "/v2dev/exceptions/index.json",
  dataType: 'json',
  async: false,
  success: function(data) {
    exceptionsNames = data;
  }
});

// BUILD LEGENDA
var legenda = '<div id="logo">' + '<a href="/"><img src="/v2dev/images/copyright_exceptions_logo.svg"/></a>' + '</div>';
jQuery.each(exceptionsNames, function() {
  legenda = legenda + '<p><href id="' + this.short + '"><span class="exception ' + this.short + '">' + this.title + '</span></href></p>';
});
legenda = legenda + color_legenda;
				
var exceptionsTable = [];

/* FUNCTIONS */

function resetHighlight(e) {
	var layer = e.target;

	
	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}
}

function highlightFeature(e) {
	var layer = e.target;		

	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}
}


function onEachFeature(feature, layer) {
	layer.on({
		click : registerClick,
		mouseout: resetHighlight,
	});
	if(layer.hasOwnProperty("feature")){
		layer.setStyle(style(layer.feature))
		popup = layer.bindPopup('<div style="text-align:center;">' + layer.feature.properties.name + '</div>', {closeButton:false});
	 }
}

function registerClick(e) {
	var layer = e.target;
	map.closePopup();
	info.update(layer.feature.properties);
}

// Style each feature
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

function showValue (name, value, row) {
	if (row === undefined) {
		row = false;
	}
	result = (value != '' ? '#aee300' : "");
	if (row) {
		result = '<tr><td>'
	}
	else {
		return value != '' ? '#aee300' : "";
	}
}

function getColor(d) { 
	return d == '0' ? '#f46d43':
		   d == '1' ? '#fee08b':
		   d == '2' ? '#a6d96a':
		   d == '3' ? '#1a9850':
					  '#DDDDDD';
}

function getStatus(s) {
	return s == '0' ? 'The EU exception is not implemented':
		   s == '1' ? 'The national exception is much more restrictive than the EU exception':
		   s == '2' ? 'The national exception is slightly more restrictive than the EU exception':
		   s == '3' ? 'The national exception closely resembles the EU exception':
					  'Copyrightexceptions.eu does not know the implementation status of this exception';
					  
}

// Converts YYYY/MM/DD to DD-MM-YYYY
function convertDate (date) {
	if ((date.match(/\//g) || []).length == 2) {
		date = date.split("/");
		return date[2] + "-" + date[1] + "-" + date[0];
	}
	return date;
}

function switchView (setView) {
	if (setView === undefined) {
		setView = 'auto';
	}
	switch(setView) {
		case 'auto':
				if ($("#table").css("z-index") > $("#map").css("z-index")) {
					$("#table").css("z-index", "0");
					$("#map").css("z-index", "1");
					window.parent.location.hash = selected_exception
				} else {
					window.parent.location.hash = 'table'
					$("#table").css("z-index", "1");
					$("#map").css("z-index", "0");
				}
			break;
		case 'table':
			window.parent.location.hash = 'table'
			$("#table").css("z-index", "1");
			$("#map").css("z-index", "0");
			break;
		case 'map':
			window.parent.location.hash = selected_exception
			$("#table").css("z-index", "0");
			$("#map").css("z-index", "1");
			break;
	}
	map.setView([55, 10], 4);	
}

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
		selected_exception = "dummy";
		changeException(selected_exception);  
		highlight(selected_exception); 
	}
}

function loadTable(data, names, implementations) {
	var result = [];
	var countries = []; 

  
	var table = $("<table/>").addClass('data-table');
	var row = $("<tr/>").addClass( "table_header" );
	row.append($("<th/>").text(''));
	for (country in implementations) {
		cell = $("<th/>");
		cell.attr('title', country);
		$('<a>'+ country +'</a>').attr({'href': '/v2dev/memberstates/' + country.toLowerCase()}).appendTo(cell);
		row.append(cell);
	};
	table.append(row);
	
	$.each (names, function( key, exception ) {
		var row = $("<tr/>");
		cell = $("<td/>");
		cell.html(names[key].title);
		short_name = names[key].short;
		row.append(cell);
		for (var country in implementations) {
			if ( implementations[country].hasOwnProperty(short_name)) {
				cell = $("<td/>").css("background-color", getColor(implementations[country][short_name].Implemented));
				$('<a></a>').attr({'href': '/v2dev/implementations/' + country.toLowerCase() + '/' + short_name + '/'}).appendTo(cell);
			}
			else {
				cell = $("<td/>").css("background-color", getColor(''));
			}
			row.append(cell);
		};
		table.append(row);
	});
	return table;
}

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

var map = L.map('map', {preferCanvas: true, zoomControl: false, minZoom:3, maxZoom:60, attributionControl: false, closePopupOnClick: false, scrollWheelZoom: false, sleepOpacity: 1, sleepNote: false}).setView([55, 10], 4);

map.addControl(new viewControl());
L.control.zoom({position:'topright'}).addTo(map);

map.once('focus', function() { map.scrollWheelZoom.enable(); });

map.fitBounds(map.getBounds(), {padding: [0, 0]});

var exceptionsTable = [];

// LOAD DATA
L.geoJson(mapdata, {
	clickable: true,
	style: style,
	onEachFeature: onEachFeature
}).addTo(map);
table = loadTable(mapdata, exceptionsNames, implementations)
$("#table").html('<div id="logo">' + '<a href="/"><img src="/v2dev/images/copyright_exceptions_logo.svg"/></a>' + '</div>' +  table[0].outerHTML + color_legenda + '<div id=switch><a href="/" class="SwitchTABLE">SHOW MAP</href></div>');

map.addEventListener('mousemove', function(ev) {
   lat = ev.latlng.lat;
   lng = ev.latlng.lng;
});

// INFORMATION pane

// control that shows info on click
var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	return this._div;
};

info.update = function (props) {
	this._div.style = "visibility: visible;"	
	this._div.innerHTML = ""
	if (("exceptions" in props) && (selected_exception in props.exceptions)) {
		this._div.innerHTML += "<span class=country-name>" + props.name + '</span>';
		table = 	"<table><tr><td>Implemented: </td><td>" + getStatus(props.exceptions[selected_exception].Implemented) + '</td></tr>';
		
		if (props.exceptions[selected_exception]['Time in effect (YYYY-MM-DD)'] != "") {
			table += 	"<tr><td>Implemented on: </td><td>" + convertDate(props.exceptions[selected_exception]['Time in effect (YYYY-MM-DD)']) + '</td></tr>';
		}
		
		table += 	'</table>';
		
		this._div.innerHTML += table;
		this._div.innerHTML += 	"<p>&nbsp;</p>";
		
		if (props.exceptions[selected_exception]['Article Number in local act (TEXT)'] != '') {
			this._div.innerHTML += 	"<p>Article Number in local act: </p><p><span>" + props.exceptions[selected_exception]['Article Number in local act (TEXT)'] +  '</span></p>';
			this._div.innerHTML += 	"<p>&nbsp;</p>";
		}
		
		if (props.exceptions[selected_exception]['Link to article (URL)'] != '') {
			this._div.innerHTML += '<p>&nbsp;</p><p><a href="' + encodeURI(props.exceptions[selected_exception]['Link to article (URL)'].replace(/"/g, '&quot;')) + props.exceptions[selected_exception]['Article Number in local act (TEXT)'] + '"></a></p>';
		} 
		
		if (props.exceptions[selected_exception].Remarks != "") {
			this._div.innerHTML += 	"<p>Remarks: </p><p><span>" + props.exceptions[selected_exception].Remarks +  '</span></p>';
			this._div.innerHTML += 	"<p>&nbsp;</p>";
		}
		
		this._div.innerHTML += "<p><a href='/feedback' style=text-decoration:none><span class=info_button> FEEDBACK</span></a></p>";
		this._div.innerHTML += "<p><a href='/v2dev/implementations/" + props.iso_a2.toLowerCase() + "/" + selected_exception + "/' style=text-decoration:none><span class=info_button style=\"margin-bottom:6px;\">MORE DETAILS ON THIS EXCEPTION</span></a>";
		this._div.innerHTML += "<p><a href='/v2dev/memberstates/" + props.iso_a2.toLowerCase() + "/' style=text-decoration:none><span class=info_button style=\"margin-bottom:6px;\">SEE ALL EXCEPTIONS OF " + props.name.toUpperCase() +"</span></a> <a href='javascript:info.clear()' id=closeinfo style=text-decoration:none><span class=info_button>X</span></a></p>";
	
		this._div.firstChild.onmousedown = this._div.firstChild.ondblclick = L.DomEvent.stopPropagation;
	}
};

info.showExceptionDetails = function (value) {
	this._div.style = "visibility: visible;"
	this._div.innerHTML = ""
	for(var i = 0; i < exceptionsNames.length; i++) {
		var obj = exceptionsNames[i];
		if (obj.short == value) {
			this._div.innerHTML += "<span class=country-name>" + obj.title + '</span>';
			this._div.innerHTML += 	"<p>&nbsp;</p>";
			this._div.innerHTML += 	"<p>Summary: </p><p><span>" + obj.summary +  '</span></p>';
			this._div.innerHTML += '<p>&nbsp;</p><p><a href="' + encodeURI(obj.linklaw.replace(/"/g, '&quot;')) + '">Link to Article</a></p>';
			return;
		}
	}
}

info.clear = function () {
	this._div.style = "visibility: hidden;"	
	map.closePopup();
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
	info.clear();
	
	// Show new exception details in info box
	info.showExceptionDetails(value);

	// Update hash for easy linking
	selected_exception = value;
	window.parent.location.hash = selected_exception

	// Update map
	map.eachLayer(function (layer) {
		if(layer.hasOwnProperty("feature")){
			layer.setStyle(style(layer.feature))
		}
   
	})
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
console.log("setting exception " + window.parent.location.hash.substring(1));

window.parent.onhashchange = function(e) {
	e.preventDefault();
	hash = unescape(window.parent.location.hash.substring(1));
	if (selected_exception != hash) {
	    changeSelected_Exception(hash);
	}
}    

function createClickAction( exceptionName ){
  return function(){
    changeException(exceptionName);  
	highlight(exceptionName); 
  }
}

$(document).ready(function(){
	for(index in exceptionsNames) {
	  if (exceptionsNames[index]["short"] != "") {
	 	 $('#' + exceptionsNames[index]["short"]).click( createClickAction( exceptionsNames[index]["short"] ));
		}
	}  
});

for(index in exceptionsNames) {
	if (exceptionsNames[index]["short"] != "") {
		$('#' + exceptionsNames[index]["short"]).click( function(){
			changeException(exceptionsNames[index]["short"]);  
			highlight(exceptionsNames[index]["short"]); 
		});
	}else {
		console.log("No short for: " + exceptionsNames[index]["title"])
	}
}
$('.SwitchMAP').click(function(){ switchView(); return false;});
$('.SwitchTABLE').click(function(){ switchView(); return false;});
$('#closeinfo').click(function(){ switchView(); return false;});
$( ".info" )
  .mouseover(function() {
   	map.scrollWheelZoom.disable()
  })
  .mouseout(function() {
    map.scrollWheelZoom.enable()
  });
  
$( ".exceptions" )
  .mouseover(function() {
   	map.scrollWheelZoom.disable()
  })
  .mouseout(function() {
    map.scrollWheelZoom.enable()
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