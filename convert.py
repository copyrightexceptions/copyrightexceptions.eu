import json
import os
import errno
from datetime import datetime
now = datetime.now()
print("now =", now)

def convertImplemented(status):
	if (status == "Yes"):
		return "3"
	elif (status == "Partly"):
		return "1"
	elif (status == "Unknown"):
		return ""
	elif (status == "No"):
		return "0"
	print ("unknown status:" + status)
		
def convertRemuneration(status):
	if (status == "Yes"):
		return "Compensated"
	elif (status == "No"):
		return "No compensation"
	elif (status == "No "):
		return "No compensation"
	elif (status == "Partly"):
		return "Partly compensated"
	elif (status == ""):
		return ""
	print ("unknown status:" + status)
	return ""

def createImplementationMD(location, file_name, country_code, exception):
	if not os.path.exists(os.path.dirname(full_path)):
		try:
			os.makedirs(os.path.dirname(full_path))
		except OSError as exc: # Guard against race condition
			if exc.errno != errno.EEXIST:
				raise
	
	
	# EXAMPLE DATA FROM JSON
	#"Art. 5.3(o)": {
	#	DONE "Article Number in local act (TEXT)": "",
	#	DONE "Implemented": "No",
	#	NOT USED "Last updated": "",
	#	NOT USED "Link to WIPO LEX (URL)": "",
	#	DONE "Link to article (URL)": "",
	#	DONE "Remarks": "",
	#	DONE "Remuneration": "",
	#	NOT USED "Time in effect (YYYY-MM-DD)": "",
	#	NOT USED "long_name": "Art. 5.3(o)",
	#	NOT USED "short_code": "Art53o"
	#}

	
	#COMMENTS BELOW ARE FIELDS IN MD THAT ARE NOT USED IN THE CONVERTATION
	f = open(full_path, "w+")
	f.write("---\n")
	f.write('title: "' + exception["Article Number in local act (TEXT)"] + '"\n')
	#date: 2020-09-06T17:14:20+02:00
	f.write("draft: false\n")
	f.write("exceptions:\n")
	f.write("- " + file_name + "\n")
	f.write("memberstates:\n")
	f.write("- " + country_code + "\n")
	f.write("score: " + exception["Implemented"] + "\n")
	#description: "The reuse of articles on current economic, political and religious topics is allowed only by reproduction and by mass media only. The exception does not extend to the rights of performers,  phonograms producers, film producers, and broadcasting organisations. The author’s opt-out option is very broadly interpreted." 
	#benficiaries:
	#- Mass media only
	#purposes: 
	#usage:
	#- Reproduction only
	#subjectmatter:
	#- Articles on current economic, political and religious topics already made available to the public
	f.write("compensation:\n")
	f.write("- " + information["Remuneration"] + "\n")
	#attribution: 
	#- Yes. Indicating the source and the name of the author, unless impossible
	#otherConditions: 
	#- Authors can explicitly forbid free use (opt-out option)
	f.write('remarks: |\n ' + information["Remarks"] + '\n\n\n')
	f.write('link: "' + exception["Link to article (URL)"] + '"\n')
	f.write("---")
	f.close()

def createExceptionsMD (full_path, short):
	mapping = {
	"info51" :  "InfoSoc Directive, Article 5.1 Temporary acts of reproduction",
	"info52a" : "InfoSoc Directive, Article 5.2(a) Photocopying/photo-reproduction",
	"info52b" : "InfoSoc Directive, Article 5.2(b) Private copying" ,
	"info52c" : "InfoSoc Directive, Article 5.2(c) Reproductions by Libraries, Archives & Museums" ,
	"info52d" : "InfoSoc Directive, Article 5.2(d) Ephemeral recordings made by broadcasters" ,
	"info52e" : "InfoSoc Directive, Article 5.2(e) Reproduction of broadcasts by social institutions" ,
	"info53a" : "InfoSoc Directive, Article 5.3(a) Illustration for teaching or scientific research" ,
	"info53b" : "InfoSoc Directive, Article 5.3(b) Use for the benefit of people with a disability" ,
	"info53c" : "InfoSoc Directive, Article 5.3(c) Reporting by the press on current events" ,
	"info53d" : "InfoSoc Directive, Article 5.3(d) Quotation for criticism or review" ,
	"info53e" : "InfoSoc Directive, Article 5.3(e) Use for public security purposes" ,
	"info53f" : "InfoSoc Directive, Article 5.3(f) Use of public speeches and public lectures" ,
	"info53g" : "InfoSoc Directive, Article 5.3(g) Use during religious or official celebrations" ,
	"info53h" : "InfoSoc Directive, Article 5.3(h) Use of works of architecture or sculptures in public spaces" ,
	"info53i" : "InfoSoc Directive, Article 5.3(i) Incidental inclusion" ,
	"info53j" : "InfoSoc Directive, Article 5.3(j) Use for advertising the exhibition or sale of works of art" ,
	"info53k" : "InfoSoc Directive, Article 5.3(k) Use for the purpose of caricature, parody or pastiche" ,
	"info53l" : "InfoSoc Directive, Article 5.3(l) Use for the demonstration or repair of equipment" ,
	"info53m" : "InfoSoc Directive, Article 5.3(m) Use for the purpose of reconstructing a building" ,
	"info53n" : "InfoSoc Directive, Article 5.3(n) Use for the purpose of research or private study" ,
	"info53o" : "InfoSoc Directive, Article 5.3(o) Pre-existing exceptions of minor importance"
	}
	
	if not os.path.exists(os.path.dirname(full_path)):
		try:
			os.makedirs(os.path.dirname(full_path))
		except OSError as exc: # Guard against race condition
			if exc.errno != errno.EEXIST:
				raise
	
	longName = short	
	if short in mapping:
		longName = mapping[short]

	f = open(full_path, "w+")
	f.write("---\n")
	f.write('title: "' + longName + '"\n')
	f.write('short: "' + short + '"\n')
	f.write('summary: ""\n')
	f.write('linklaw: ""\n')
	f.write("---\n")
	f.close()
	#---
	#title: "Art 5(2)c InfoSoc"
	#short: "info52c"
	#summary: ""
	#linklaw: ""
	#---


with open('static/testdata/result.json') as f:
  data = json.load(f)
data = data['features']

#print(json.dumps(feature['properties'], indent = 4, sort_keys=True))

for feature in data:
	if 'properties' in feature:
		country_code = feature['properties']['iso']
		location = "content/implementations/" + country_code + "/"
		if 'exceptions' in feature['properties']:
			for exception in feature['properties']['exceptions']:
				file_name = exception.replace('Art. ','info').replace('(','').replace(')','').replace('.','')
				directory = os.path.dirname(os.path.realpath(__file__))
				full_path = directory + '/' + location + file_name + ".md"
				information = feature['properties']['exceptions'][exception]
				information["Implemented"] = convertImplemented(information["Implemented"])
				information["Remuneration"] = convertRemuneration(information["Remuneration"])
				information["Remarks"] = information["Remarks"].replace('"','\\"').replace('\n','\n ')
				createImplementationMD(location, file_name, country_code, information)
				
				location_exception = directory + '/content/exceptions/' + file_name + "/_index.md"
				print(location_exception)
				createExceptionsMD(location_exception, file_name)
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				