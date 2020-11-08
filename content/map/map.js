var selected_exception = "Art. 5.1";
var selected_exception_short = "Art51";
var lat, lng;


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


var legenda = '<div id="logo">' + '<a href="/"><img src="/v2dev/images/copyright_exceptions_logo.svg"/></a>' + '</div>' + 
				'<p><span class="exception Art51"><href id="Art51">5.1 Temporary acts of reproduction</href></span></p>' + 
				'<p><span class="exception Art52a"><href id="Art52a">5.2(a) Photocopying/photo-reproduction</href></span></p>' + 
				'<p><href id="Art52b"><span class="exception Art52b">5.2(b) Private copying</span></href></p>' + 
				'<p><href id="Art52c"><span class="exception Art52c">5.2(c) Reproductions by Libraries, Archives & Museums</span></href></p>' + 
				'<p><href id="Art52d"><span class="exception Art52d">5.2(d) Ephemeral recordings made by broadcasters</span></href></p>' + 
				'<p><href id="Art52e"><span class="exception Art52e">5.2(e) Reproduction of broadcasts by social institutions</span></href></p>' + 
				'<p><href id="Art53a"><span class="exception Art53a">5.3(a) Illustration for teaching or scientific research</span></href></p>' + 
				'<p><href id="Art53b"><span class="exception Art53b">5.3(b) Use for the benefit of people with a disability</span></href></p>' + 
				'<p><href id="Art53c"><span class="exception Art53c">5.3(c) Reporting by the press on current events</span></href></p>' + 
				'<p><href id="Art53d"><span class="exception Art53d">5.3(d) Quotation for criticism or review</span></href></p>' + 
				'<p><href id="Art53e"><span class="exception Art53e">5.3(e) Use for public security purposes</span></href></p>' + 
				'<p><href id="Art53f"><span class="exception Art53f">5.3(f) Use of public speeches and public lectures</span></href></p>' + 
				'<p><href id="Art53g"><span class="exception Art53g">5.3(g) Use during religious or official celebrations</span></href></p>' + 
				'<p><href id="Art53h"><span class="exception Art53h">5.3(h) Use of works of architecture or sculptures in public spaces</span></href></p>' + 
				'<p><href id="Art53i"><span class="exception Art53i">5.3(i) Incidental inclusion</span></href></p>' + 
				'<p><href id="Art53j"><span class="exception Art53j">5.3(j) Use for advertising the exhibition or sale of works of art</span></href></p>' + 
				'<p><href id="Art53k"><span class="exception Art53k">5.3(k) Use for the purpose of caricature, parody or pastiche</span></href></p>' + 
				'<p><href id="Art53l"><span class="exception Art53l">5.3(l) Use for the demonstration or repair of equipment</span></href></p>' + 
				'<p><href id="Art53m"><span class="exception Art53m">5.3(m) Use for the purpose of reconstructing a building</span></href></p>' + 
				'<p><href id="Art53n"><span class="exception Art53n">5.3(n) Use for the purpose of research or private study</span></href></p>' + 
				'<p><href id="Art53o"><span class="exception Art53o">5.3(o) Pre-existing exceptions of minor importance</span></href></p>' +
				'<p><href id="Orphan"><span class="exception Orphan">Reproducing and making available of orphan works</span></href></p>' +
				color_legenda;
				
var exceptionsTable = [];

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
		/* popup.on('mouseover', function (e) {
            this.openPopup();
            console.log(popup);
        });
        popup.on('mouseout', function (e) {
            this.closePopup();
        });
		*/

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
			color =  getColor(feature.properties.exceptions[selected_exception].Implemented);
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
	return d == 'Yes' 		? '#aee300' :
		   d == 'No'  		? '#f80000' :
		   d == 'Unknown'  	? '#DDDDDD' :
		   d == 'Partly'	? '#ff9100'	:
		   d == 'n/a'		? '#000000'	:
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
	} else if (info['Link to WIPO LEX (URL)'] != '') {
		result = '<p>&nbsp;</p><p><a href="' + encodeURI(info['Link to WIPO LEX (URL)'].replace(/"/g, '&quot;')) + '">WIPO Lex</a></p>';
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

function loadTable(data) {
	var result = [];
	var countries = [];
  	
  	exceptions_names = ['<p><span class="exception">5.1 Temporary acts of reproduction</span></p>',
						'<p><span class="exception">5.2(a) Photocopying/photo-reproduction</span></p>',
						'<p><span class="exception">5.2(b) Private copying</span></p>',
						'<p><span class="exception">5.2(c) Reproductions by Libraries, Archives & Museums</span></p>',
						'<p><span class="exception">5.2(d) Ephemeral recordings made by broadcasters</span></p>', 
						'<p><span class="exception">5.2(e) Reproduction of broadcasts by social institutions </span></p>', 
						'<p><span class="exception">5.3(a) Illustration for teaching or scientific research</span></p>', 
						'<p><span class="exception">5.3(b) Use for the benefit of people with a disability</span></p>', 
						'<p><span class="exception">5.3(c) Reporting by the press on current events</span></p>', 
						'<p><span class="exception">5.3(d) Quotation for criticism or review</span></p>', 
						'<p><span class="exception">5.3(e) Use for public security purposes</span></p>', 
						'<p><span class="exception">5.3(f) Use of public speeches and public lectures </span></p>', 
						'<p><span class="exception">5.3(g) Use during religious or official celebrations</span></p>', 
						'<p><span class="exception">5.3(h) Use of works of architecture or sculptures in public spaces</span></p>', 
						'<p><span class="exception">5.3(i) Incidental inclusion</span></p>', 
						'<p><span class="exception">5.3(j) Use for advertising the exhibition or sale of works of art</span></p>', 
						'<p><span class="exception">5.3(k) Use for the purpose of caricature, parody or pastiche</span></p>', 
						'<p><span class="exception">5.3(l) Use for the demonstration or repair of equipment</span></p>', 
						'<p><span class="exception">5.3(m) Use for the purpose of reconstructing a building</span></p>', 
						'<p><span class="exception">5.3(n) Use for the purpose of research or private study</span></p>', 
						'<p><span class="exception">5.3(o) Pre-existing exceptions of minor importance</span></p>',
						'<p><span class="exception">Reproducing and making available of orphan works</span></p>'];
  	
  	
  	$.each( data['features'], function( key, val ) {
		// countries[<iso>] = <name>
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
	exceptions = Object.keys(result['DE']);
	exceptions.sort();
	
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
    

    container.onclick = function(){
      console.log('buttonClicked');
    }

    return container;
  }
});

var map = L.map('map', {preferCanvas: true, zoomControl: false, minZoom:3, maxZoom:60, attributionControl: false, closePopupOnClick: false, scrollWheelZoom: false, sleepOpacity: 1, sleepNote: false}).setView([55, 10], 4);

map.addControl(new viewControl());
L.control.zoom({position:'topright'}).addTo(map);


map.once('focus', function() { map.scrollWheelZoom.enable(); });

map.fitBounds(map.getBounds(), {padding: [0, 0]});

var myGeoJSONPath = '/v2dev/testdata/result.json';
var exceptionsTable = [];

// Load data
$.getJSON(myGeoJSONPath,function(data){
	L.geoJson(data, {
		clickable: true,
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);
	table = loadTable(data)
	$("#table").html('<div id="logo">' + '<a href="/"><img src="/v2dev/images/copyright_exceptions_logo.svg"/></a>' + '</div>' +  table[0].outerHTML + color_legenda + '<div id=switch><a href="/" class="SwitchTABLE">SHOW MAP</href></div>');
})

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

$('#Art51').click(function(){ changeException('Art. 5.1');  highlight('Art51'); return false;});
$('#Art52a').click(function(){ changeException('Art. 5.2(a)');  highlight('Art52a'); return false;});
$('#Art52b').click(function(){ changeException('Art. 5.2(b)');  highlight('Art52b'); return false;});
$('#Art52c').click(function(){ changeException('Art. 5.2(c)');  highlight('Art52c'); return false;});
$('#Art52d').click(function(){ changeException('Art. 5.2(d)');  highlight('Art52d'); return false;});
$('#Art52e').click(function(){ changeException('Art. 5.2(e)');  highlight('Art52e'); return false;});
$('#Art53a').click(function(){ changeException('Art. 5.3(a)');  highlight('Art53a'); return false;});
$('#Art53b').click(function(){ changeException('Art. 5.3(b)');  highlight('Art53b'); return false;});
$('#Art53c').click(function(){ changeException('Art. 5.3(c)');  highlight('Art53c'); return false;});
$('#Art53d').click(function(){ changeException('Art. 5.3(d)');  highlight('Art53d'); return false;});
$('#Art53e').click(function(){ changeException('Art. 5.3(e)');  highlight('Art53e'); return false;});
$('#Art53f').click(function(){ changeException('Art. 5.3(f)');  highlight('Art53f'); return false;});
$('#Art53g').click(function(){ changeException('Art. 5.3(g)');  highlight('Art53g'); return false;});
$('#Art53h').click(function(){ changeException('Art. 5.3(h)');  highlight('Art53h'); return false;});
$('#Art53i').click(function(){ changeException('Art. 5.3(i)');  highlight('Art53i'); return false;});
$('#Art53j').click(function(){ changeException('Art. 5.3(j)');  highlight('Art53j'); return false;});
$('#Art53k').click(function(){ changeException('Art. 5.3(k)');  highlight('Art53k'); return false;});
$('#Art53l').click(function(){ changeException('Art. 5.3(l)');  highlight('Art53l'); return false;});
$('#Art53m').click(function(){ changeException('Art. 5.3(m)');  highlight('Art53m'); return false;});
$('#Art53n').click(function(){ changeException('Art. 5.3(n)');  highlight('Art53n'); return false;});
$('#Art53o').click(function(){ changeException('Art. 5.3(o)');  highlight('Art53o'); return false;});
$('#Orphan').click(function(){ changeException('Orphan Works');  highlight('Orphan'); return false;});
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