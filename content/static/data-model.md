---
title: "Data model"
date: 2020-12-09T11:39:27+02:00 
draft: false
---
# Copyrightexceptions.eu data model

The information about the national implementations is stored in the header section of [markdown](https://www.markdownguide.org) files. Each markdown file represents one implementation. These files can be found in the content directory of the website. Inside the content directories there is a folder for each jurisdiction (Member State) covered by our map. Each of these folders contains a a series of markdown files (one for each generic exception).

## 

The header section of the markdown files is formatted in [toml](https://toml.io/en/). When editing these files the structure should be left unchanged. Editing should be limited to the following fields of each file: 

* **title:** The name of the Article implementing the exception in English (enclosed by double quotes)
* **date:** The date of adoption, or last change of the exception. if unavailable use date of data entry (formatted as YYYY-MM-DD)
* **draft:** publication status. This is set to 'true' by default (as long as it is 'true' the map will show 'no information available'). Set to 'false' once the information is ready for publication 
* **score:** Implementation score expressed as a numerical value between 0 and 3 (0 = not implemented, 1 = very restrictive implementation, 2 = restrictive implementation, 3 = broad implementation).
* **description:** Short description of the national exception. No more than 500 characters. Should focus on structure of implementation, allowed acts, beneficiaries and relevant restrictions (enclosed by double quotes)
* **beneficiaries:** List of beneficiaries of the national exception. If not specified  use 'Any user'. (Each entry musy be preceded by '- ' and start on a new line. Remove all instances of '- ' to leave empty)
* **purposes:** List of purposes covered by the exception. If not specified use 'Any purpose' (Each entry musy be preceded by '- ' and start on a new line. Remove all instances of '- ' to leave empty)
* **usage:** List of types of use allowed by the excepotion. If not specified use 'Any usage'. (Each entry musy be preceded by '- ' and start on a new line. Remove all instances of '- ' to leave empty)
* **subjectmatter:** List of types of subjectmatter that can be used under the exception (Each entry musy be preceded by '- ' and start on a new line. Remove all instances of '- ' to leave empty)
* **compensation:** 'Yes'/'No' or a description of the types of uses that are compensated (Each entry musy be preceded by '- ' and start on a new line. Remove all instances of '- ' to leave empty)
* **attribution:** 'Yes'/'No' or a more precise decription of the attribution requirement (Each entry musy be preceded by '- ' and start on a new line. Remove all instances of '- ' to leave empty)
* **otherConditions:** List of other conditions for the excercise of the exception (Each entry musy be preceded by '- ' and start on a new line. Remove all instances of '- ' to leave empty)
* **remarks:** Remarks on the specific implementation that are relevant for the public and that do not fit into any of the above fileds. Can be as long as necessary. Can iclude minimal formatting in here "<br /><br />" for a line break, "<strong></strong>" for bold.
* **link:** Link to the national implementation law (enclosed by double quotes)

## Example data 

The following is an example of the header section of the [the markdown file for the Belgian implementation of Article 5(2)a of the InfoSoc directive](https://github.com/copyrightexceptions/copyrightexceptions.eu/edit/master/content/implementations/BE/info52a.md):

```
---
title: "Article XI.190, 5°of the Code of Economic Law (CEL)"
date: 2017-03-10
draft: false
weight: 40
exceptions:
- info52a
jurisdictions:
- BE
score: 1
description: "This exception allows for the reproduction in part or in whole of articles or works of fine art or of short fragments of other works, fixed on paper or any similar medium, with the exception of sheet music, where such reproduction is effected on paper or any similar medium, by the use of any kind of photographic technique or by some other process having similar effects, either by a legal person for internal use, or by a natural person for internal use in the context of their business activities, and provided that this does not prejudice the normal exploitation of the work." 
beneficiaries:
- any user
purposes: 
- internal use by legal persons
- internal use by natural persons in the context of their business activities
usage:
- reproduction (analogue)
subjectmatter:
- articles 
- works of fine art 
- short fragments of other works (except for sheet music)
- databases
compensation:
- fair compensation required
attribution: 
- no attribution required
otherConditions: 
- the work used must be lawfully divulged
- the work used must be fixed on paper or any similar medium
- the use must not prejudice the normal exploitation of the work
remarks: "The Belgian reprography exception was amended in 2016 to comply with the findings of the Court of Justice of the EU in the Reprobel case (C-572/13).<br /><br />The exception is applicable to databases (Art. XI.191 § 1, 1° CEL)."
link: http://www.ejustice.just.fgov.be/cgi_loi/loi_a1.pl
---
```

Note that the information in the **weight**, **exceptions** and **jurisdictions** fields should not be edited and left unchanged.
