import json
import os
import errno

jurisdictions = {"AL" : "Albania",
					"ME" : "Montenegro",
					"MK" : "North Macedonia",
					"RS" : "Serbia",
					"BA" : " Bosnia Herzegovina",
					"XK" : "Kosovo",
					"LI" : "Lichtenstein",
					"NO" : "Norway",
					"CH" : "Switzerland",
					"IS" : "Iceland ",
					"GB" : "United Kingdom",
					"AT" : "Austria",
					"BE" : "Belgium",
					"BG" : "Bulgaria",
					"HR" : "Croatia",
					"CY" : "Cyprus",
					"CZ" : "Czech Republic",
					"DK" : "Denmark",
					"EE" : "Estonia",
					"FI" : "Finland",
					"FR" : "France",
					"DE" : "Germany",
					"GR" : "Greece",
					"HU" : "Hungary",
					"IE" : "Ireland",
					"IT" : "Italy",
					"LV" : "Latvia",
					"LT" : "Lithuania",
					"LU" : "Luxembourg",
					"MT" : "Malta",
					"NL" : "the Netherlands",
					"PL" : "Poland",
					"PT" : "Portugal",
					"RO" : "Romania",
					"SK" : "Slovakia",
					"SI" : "Slovenia",
					"ES" : "Spain",
					"SE" : "Sweden"}

exceptions = {"info51" : "Temporary acts of reproduction (Art. 5.1 InfoSoc)",
				"info52a" : "Photocopying/photo-reproduction (Art. 5.2(a) InfoSoc)",
				"info52b" : "Private copying (Art. 5.2(b) InfoSoc)",
				"info52c" : "Reproductions by Libraries, Archives & Museums (Art. 5.2(c) InfoSoc)",
				"info52d" : "Ephemeral recordings made by broadcasters (Art. 5.2(d) InfoSoc)",
				"info52e" : "Reproduction of broadcasts by social institutions (Art. 5.2(e) InfoSoc)",
				"info53a" : "Illustration for teaching or scientific research (Art. 5.3(a) InfoSoc)",
				"info53b" : "Use for the benefit of people with a disability (Art. 5.3(b) InfoSoc)",
				"info53c-1" : "Reporting by the press on current events (Art. 5.3(c) 1st part InfoSoc)",
				"info53c-2" : "Reporting by the press on current events (Art. 5.3(c) 2nd part InfoSoc)",
				"info53d" : "Quotation for criticism or review (Art. 5.3(d) InfoSoc)",
				"info53e" : "Use for public security purposes (Art. 5.3(e) InfoSoc)",
				"info53f" : "Use of public speeches and public lectures (Art. 5.3(f) InfoSoc)",
				"info53g" : "Use during religious or official celebrations (Art. 5.3(g) InfoSoc)",
				"info53h" : "Use of works of architecture or sculptures in public spaces (Art. 5.3(h) InfoSoc)",
				"info53i" : "Incidental inclusion (Art. 5.3(i) InfoSoc)",
				"info53j" : "Use for advertising the exhibition or sale of works of art (Art. 5.3(j) InfoSoc)",
				"info53k" : "Use for the purpose of caricature, parody or pastiche (Art. 5.3(k) InfoSoc)",
				"info53l" : "Use for the purpose of reconstructing a building (Art. 5.3(m) InfoSoc)",
				"info53m" : "Use for the purpose of research or private study (Art. 5.3(n) InfoSoc)",
				"info53o" : "Pre-existing exceptions of minor importance (Art. 5.3(o) InfoSoc)",
				"dsm3" : "Text and data mining for scientific research (Art. 3 DSM)",
				"dsm4" : "Exception or limitation for text and data mining (Art. 4 DSM)",
				"dsm5" : "Use in digital and cross-border teaching activities (Art. 5 DSM)",
				"dsm6" : "Preservation of cultural heritage (Art. 6 DSM)",
				"dsm8" : "Use of out-of-commerce works by cultural heritage institutions (Art. 8 DSM)",
				"owd" : "Permitted uses of orphan works (Art. 6 OWD)",
				"mkd" : "Make and disseminate accessible format copies of works (Art. 4 MKD)"}


def createCountryMDs () :
	for jurisdiction in jurisdictions:
		for exception in exceptions:
			path = "content/jurisdictions/" + jurisdiction + "/_index.md"
			print(path)
			if (not proefdraaien):
				if not os.path.exists(os.path.dirname(path)):
					try:
						os.makedirs(os.path.dirname(path))
					except OSError as exc: # Guard against race condition
						if exc.errno != errno.EEXIST:
							raise

				#---
				#name: "" 
				#<!--- REQUIRED: full name of the jusridiction -->
				#legalarrangement: ""
				#<!--- REQUIRED: Short description of the overall legal arrangement in the member states = no more than 400 characters -->
				#---

				f = open(path, "w+")
				f.write("---\n")
				f.write("name: \"" + jurisdictions[jurisdiction] + "\" \n")
				f.write("<!--- REQUIRED: full name of the jusridiction -->\n")
				f.write("legalarrangement: \"\"\n")
				f.write("<!--- REQUIRED: Short description of the overall legal arrangement in the member states = no more than 400 characters -->\n")
				f.write("---\n")
				f.close()

def createExceptionMDs () :
	

	for exception in exceptions:
		path = "content/exceptions/" + exception + "/_index.md"
		print(path)
		if (not proefdraaien):
			if not os.path.exists(os.path.dirname(path)):
				try:
					os.makedirs(os.path.dirname(path))
				except OSError as exc: # Guard against race condition
					if exc.errno != errno.EEXIST:
						raise


			#---
			#draft: true
			#title: ""
			#<!--- REQUIRED: title of the exception as used in the list of exception on the homepage --->
			#short: ""
			#<!--- REQUIRED: short code of the exception --->
			#summary: ""
			#<!--- REQUIRED: summary of the the excption - no more than 400 characters--->
			#linklaw: ""
			#<!--- OPTIONAL: link to the exception on eur-lex ---> 
			#---

			f = open(path, "w+")
			f.write("---\n")
			f.write("draft: \"false\"\n")
			f.write("title: \"" + exceptions[exception] + "\"\n")
			f.write("<!--- REQUIRED: title of the exception as used in the list of exception on the homepage --->\n")
			f.write("short: \"" + exception + "\"\n")
			f.write("<!--- REQUIRED: short code of the exception --->\n")
			f.write("summary: \"\"\n")
			f.write("<!--- REQUIRED: summary of the the excption - no more than 400 characters--->\n")
			f.write("linklaw: \"\"\n")
			f.write("<!--- OPTIONAL: link to the exception on eur-lex ---> \n")
			f.write("---")
			f.close()


def createImplementationsMDs ():
	
	for jurisdiction in jurisdictions:
		for exception in exceptions:
			path = "content/implementations/" + jurisdiction + "/" + exception + ".md"
			print(path)
			if (not proefdraaien):
				if not os.path.exists(os.path.dirname(path)):
					try:
						os.makedirs(os.path.dirname(path))
					except OSError as exc: # Guard against race condition
						if exc.errno != errno.EEXIST:
							raise
	
	
				#---
				#draft: false
				#<!--- REQUIRED/PRE-FILLED ("true"): publication status: is set to true by default (as long as it is "true" the map will show "no information available" Set to "false" once the information has been cleared for publication --> 
				#title: ""
				#<!--- REQUIRED: full name of the exception in the local language (if in a non roman script include ENsummary in (brackets)) -->
				#date: 
				#<!--- REQUIRED/PRE-FILLED: date of adoption, or last change of the exception. if unavailable use date of data entry --->
				#exceptions:
				#- 
				#<!--- REQUIRED/PRE-FILLED: short code of the exception --> 
				#memberstates:
				#- 
				#<!--- REQUIRED/PRE FILLED: short code of the jurisdiction --->
				#score: 
				#<!--- REQUIRED: implementation score from 0 (not implemented) to 3 (fully implemented) -->
				#description: "The national exceptions are similar to the EU exception with regards to who can benefit from the exception and the materials that can be used. The national exceptions are more restrictive than the EU exception with regards to the type of activities that can be done and the purposes of the activities. The national exceptions require attribution and do not require the payment of compensation for most uses. The national exceptions have further restrictions." 
				#<!--- REQUIRED: short summary of the national exception. no more than 400 characters. should focus on structure of implementation, allowed acts, beneficiaries and relevant restrictions --->
				#beneficiaries:
				#- 
				#<!--- OPTIONAL: list of types of beneficiaries. if not specified then use "Any user" --->
				#purposes: 
				#- 
				#<!--- OPTIONAL: list of purposes covered by the exception. if not specified use "Any purpose" --->
				#usage:
				#- 
				#<!--- OPTIONAL: list of types of use covered by the excepotion. if not specified use "Any usage" ---> 
				#subjectmatter:
				#- 
				#<!--- OPTIONAL: list of types of subjectmatter that can be used under the exception ---> 
				#compensation: 
				#<!--- OPTIONAL: "yes"/"no" or a description of the types of uses that are compensated ---> 
				#attribution: 
				#<!--- OPTIONAL: "yes"/"no" or a more precise decription of the attribution requirement ---> 
				#otherConditions: 
				#- 
				#<!--- OPTIONAL: list of other conditions for the excercise of the exception ---> 
				#remarks: 
				#<!--- OPTIONAL: Remarks on the specific implementation that are relevant for the public and that do not fit into any of the above fileds. Can be as long as necessary. You can iclude mminimal formatting in here "<br /><br />" for a line break, "<strong></strong>" for bold.  --->  
				#link: ""
				#<!--- OPTIONAL: link to the national implementation law --->
				#---

				f = open(path, "w+")
				f.write("---")
				f.write("draft: false\n")
				f.write("<!--- REQUIRED/PRE-FILLED (\"true\"): publication status is set to true by default (as long as it is \"true\" the map will show \"no information available\" Set to \"false\" once the information has been cleared for publication --> \n")
				f.write("title: \"\"\n")
				f.write("<!--- REQUIRED: full name of the exception in the local language (if in a non roman script include ENsummary in (brackets)) -->\n")
				f.write("date: \n")
				f.write("<!--- REQUIRED/PRE-FILLED: date of adoption, or last change of the exception. if unavailable use date of data entry --->\n")
				f.write("exceptions:\n")
				f.write("- \n")
				f.write("<!--- REQUIRED/PRE-FILLED: short code of the exception --> \n")
				f.write("memberstates:\n")
				f.write("- \n")
				f.write("<!--- REQUIRED/PRE FILLED: short code of the jurisdiction --->\n")
				f.write("score: \n")
				f.write("<!--- REQUIRED: implementation score from 0 (not implemented) to 3 (fully implemented) -->\n")
				f.write("description: \"\" \n")
				f.write("<!--- REQUIRED: short summary of the national exception. no more than 400 characters. should focus on structure of implementation, allowed acts, beneficiaries and relevant restrictions --->\n")
				f.write("beneficiaries:\n")
				f.write("- \n")
				f.write("<!--- OPTIONAL: list of types of beneficiaries. if not specified then use \"Any user\" --->\n")
				f.write("purposes: \n")
				f.write("- \n")
				f.write("<!--- OPTIONAL: list of purposes covered by the exception. if not specified use \"Any purpose\" --->\n")
				f.write("usage:\n")
				f.write("- \n")
				f.write("<!--- OPTIONAL: list of types of use covered by the excepotion. if not specified use \"Any usage\" ---> \n")
				f.write("subjectmatter:\n")
				f.write("- \n")
				f.write("<!--- OPTIONAL: list of types of subjectmatter that can be used under the exception ---> \n")
				f.write("compensation: \"\"\n")
				f.write("<!--- OPTIONAL: yes/no or a description of the types of uses that are compensated ---> \n")
				f.write("attribution: \"\"\n")
				f.write("<!--- OPTIONAL: yes/no or a more precise decription of the attribution requirement ---> \n")
				f.write("otherConditions: \n")
				f.write("- \n")
				f.write("<!--- OPTIONAL: list of other conditions for the excercise of the exception ---> \n")
				f.write("remarks: \"\"\n")
				f.write("<!--- OPTIONAL: Remarks on the specific implementation that are relevant for the public and that do not fit into any of the above fileds. Can be as long as necessary. You can iclude mminimal formatting in here \"<br /><br />\" for a line break, \"<strong></strong>\" for bold.  --->  \n")
				f.write("link: \"\"\n")
				f.write("<!--- OPTIONAL: link to the national implementation law --->\n")
				f.write("---")
				f.close()

proefdraaien = False
createImplementationsMDs()
createExceptionMDs()
#createCountryMDs()
				
				
				
				
				
				
				
				
				