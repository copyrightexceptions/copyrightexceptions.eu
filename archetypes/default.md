---
title: "{{ with .File }}{{ replace .Dir "/" " "}}{{ end }}{{ replace .Name "-" " "}}"
date: {{ .Date }}
draft: true
exceptions:
- {{ replace .Name "-" " "}}
memberstates:
- {{ with .File }}{{ replace .Dir "/" " "}}{{ end }}
score: 0
url: 
remuneration:
description: "Short description of the exception here" 
---


