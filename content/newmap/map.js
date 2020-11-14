var selected_exception = "Art. 5.1";
var selected_exception_short = "Art51";
var lat, lng;

// REDO This
article_to_short = {'Art. 5.1': 'Art51',
'Art. 5.2(a)': 'Art52a',
'Art. 5.2(b)': 'Art52b',
'Art. 5.2(c)': 'Art52c',
'Art. 5.2(d)': 'Art52d',
'Art. 5.2(e)': 'Art52e',
'Art. 5.3(a)': 'Art53a',
'Art. 5.3(b)': 'Art53b',
'Art. 5.3(c)': 'Art53c',
'Art. 5.3(d)': 'Art53d',
'Art. 5.3(e)': 'Art53e',
'Art. 5.3(f)': 'Art53f',
'Art. 5.3(g)': 'Art53g',
'Art. 5.3(h)': 'Art53h',
'Art. 5.3(i)': 'Art53i',
'Art. 5.3(j)': 'Art53j',
'Art. 5.3(k)': 'Art53k',
'Art. 5.3(l)': 'Art53l',
'Art. 5.3(m)': 'Art53m',
'Art. 5.3(n)': 'Art53n',
'Art. 5.3(o)': 'Art53o',
'Orphan Works': 'Orphan'};

var color_legenda = '<div id=legenda><div class=legenda-row><div class=legenda-box><div class=legenda-box-color style=background-color:#aee300></div> Implemented </div><div class=legenda-box><div class=legenda-box-color style=background-color:#f80000></div> Not Implemented </div></div>' +
					'<div class=legenda-row><div class=legenda-box><div class=legenda-box-color style=background-color:#ff9100></div> Partly Implemented </div><div class=legenda-box><div class=legenda-box-color style=background-color:#DDD></div> Unknown </div></div>'

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
			console.log(feature.properties);
			if (feature.properties.exceptions.hasOwnProperty(selected_exception)) {
				console.log("color: " + feature.properties.exceptions[selected_exception].Implemented);
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
	return d == '1' ? 'red' :
		   d == '2' ? 'green' :
		   d == '3' ? 'blue' :
		   d == '4'	? 'orange'	:
		   d == '5'	? 'yellow'	:
					  '#DDDDDD';
}

// Converts YYYY/MM/DD to DD-MM-YYYY
function convertDate (date) {
	if ((date.match(/\//g) || []).length == 2) {
		date = date.split("/");
		return date[2] + "-" + date[1] + "-" + date[0];
	}
	return date;
}

function displayActLinks(info) {
	result = "";
	if (info['Link to article (URL)'] != '' && info['Link to WIPO LEX (URL)'] != '') {
		result = '<p>&nbsp;</p><p><a href="' + encodeURI(info['Link to article (URL)'].replace(/"/g, '&quot;')) + '">Local act</a>  |  <a href="' + encodeURI(info['Link to WIPO LEX (URL)'].replace(/"/g, '&quot;')) + '">WIPO Lex</a></p>';
	} else if (info['Link to article (URL)'] != '') {
		result = '<p>&nbsp;</p><p><a href="' + encodeURI(info['Link to article (URL)'].replace(/"/g, '&quot;')) + '">Local act</a></p>';
	} 
	return result;
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
		if (Object.keys(article_to_short).indexOf(hash) != -1) {
			selected_exception = hash;
			selected_exception_short = article_to_short[hash];
			changeException(selected_exception);  
			highlight(selected_exception_short); 
		} else if (hash == 'table') { // Additionally check if table view is requested
			switchView(hash);
		} else {
			console.log(hash + " not found.");
			selected_exception = "Art. 5.1";
			selected_exception_short = "Art51";
			changeException(selected_exception);  
			highlight(selected_exception_short); 
		}
		
		
	} else {
		selected_exception = "Art. 5.1";
		selected_exception_short = "Art51";
		changeException(selected_exception);  
		highlight(selected_exception_short); 
	}
}

function loadTable(data, names) {
	var result = [];
	var countries = []; 
	exceptions_names = [];
	// Create list with exceptions
	exceptions = Object.keys(names);
	exceptions.sort(); 	
  	

	for (var i = 0; i < exceptions.length; i++) {
		exceptions_names[i] = '<p><span class="exception">' + exceptions[i] + '</span></p>';
	}
  	
  	$.each( data['features'], function( key, val ) {
		countries[val['properties']['iso']] = val['properties']['name'].replace(/[ ]/g, "-");
		hashtags = [];
		country = val['properties']['iso'];
		if ('exceptions' in val['properties']) {
			result[country] = [];
			$.each( val['properties']['exceptions'], function( exception, val ) {
				if ('Implemented' in val) {
					result[country][exception] = val['Implemented'];
					hashtags[exception] = val['short_code'];
				}
			});
		}
	});
  
	var table = $("<table/>").addClass('data-table');
	var row = $("<tr/>").addClass( "table_header" );
	row.append($("<th/>").text(''));
	for (var country in result) {
		cell = $("<th/>");
		cell.attr('title', countries[country]);
		$('<a>'+ country +'</a>').attr({'href': '/project/' + countries[country]}).appendTo(cell);
		row.append(cell);
	};
	table.append(row);
	
	$.each (exceptions, function( key, exception ) {
		var row = $("<tr/>");
		cell = $("<td/>");
		cell.html(exceptions_names[0]);
		row.append(cell);
		exceptions_names.shift();
		for (var country in result) {
			cell = $("<td/>").css("background-color", getColor(result[country][exception]));
			$('<a></a>').attr({'href': '/project/' + countries[country] + '/#' + hashtags[exception] }).appendTo(cell);
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
table = loadTable(mapdata, exceptionsNames)
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
	
	this._div.innerHTML += "<span class=country-name>" + props.name + '</span>';
	table = 	"<table><tr><td>Implemented: </td><td>" + props.exceptions[selected_exception].Implemented + '</td></tr>';
	if (props.exceptions[selected_exception]['Time in effect (YYYY-MM-DD)'] != "") {
		table += 	"<tr><td>Implemented on: </td><td>" + convertDate(props.exceptions[selected_exception]['Time in effect (YYYY-MM-DD)']) + '</td></tr>';
	}
	if (props.exceptions[selected_exception].Remuneration != "") {
		table += 	"<tr><td>Remuneration: </td><td>" + props.exceptions[selected_exception].Remuneration + '</td></tr>';
	}
	table += 	'</table>';
	this._div.innerHTML += table;
	this._div.innerHTML += 	"<p>&nbsp;</p>";
	if (props.exceptions[selected_exception]['Article Number in local act (TEXT)'] != '') {
		this._div.innerHTML += 	"<p>Article Number in local act: </p><p><span>" + props.exceptions[selected_exception]['Article Number in local act (TEXT)'] +  '</span></p>';
		this._div.innerHTML += 	displayActLinks(props.exceptions[selected_exception]);
		this._div.innerHTML += 	"<p>&nbsp;</p>";
	}
	if (props.exceptions[selected_exception].Remarks != "") {
		this._div.innerHTML += 	"<p>Remarks: </p><p><span>" + props.exceptions[selected_exception].Remarks +  '</span></p>';
		this._div.innerHTML += 	"<p>&nbsp;</p>";
	}
	this._div.innerHTML += "<p><a href='/feedback' style=text-decoration:none><span class=info_button> FEEDBACK</span></a></p>";
	this._div.innerHTML += "<p><a href='/project/" + props.name.replace(/[ ]/g, "-") + "/' style=text-decoration:none><span class=info_button style=\"margin-bottom:6px;\">SEE ALL EXCEPTIONS</span></a> <a href='javascript:info.clear()' id=closeinfo style=text-decoration:none><span class=info_button>X</span></a></p>";

	this._div.firstChild.onmousedown = this._div.firstChild.ondblclick = L.DomEvent.stopPropagation;
};

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
  $( ".exception" ).css( "background", "url('')" ); 
  $( ".exception" ).css( "background-color", "rgba(242,242,242,0.7)"); 
  $( ".exception" ).css( "color", "#494949");
  info.clear();
  selected_exception = value;
  window.parent.location.hash = selected_exception
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
	$( ".exception" + "." + excep ).css( "background-color", "red"); 
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
	  $('#' + exceptionsNames[index]["short"]).click( createClickAction( exceptionsNames[index]["short"] ));
	}  
});

for(index in exceptionsNames) {
  $('#' + exceptionsNames[index]["short"]).click( function(){
    changeException(exceptionsNames[index]["short"]);  
    highlight(exceptionsNames[index]["short"]); 
  });
}

// EXAMPLE $('#Art51').click(function(){ changeException('Art. 5.1');  highlight('Art51'); return false;});
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