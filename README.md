# Bring Me My Fire Truck (the New Jerusalam?) 2019 - 2020

[BMMFT](http://culture.theodi.org/firetruck/) is an artwork by Mr Gee. It is one of a series of commissioned works from the ODI's latest curatorial theme: [Copy That? Surplus Data in an Age of Repetitive Duplication](http://culture.theodi.org/category/exhibition/copythat/).

This is the new online version which includes Lost Luggage and Baggage Reclaim.

## About the artwork

An animation of William Blake’s Jerusalem running through the 24 official languages of the European Union with Welsh and Scots Gaelic via Google Translate
Commissioned by Data as Culture at the ODI.
 
William Blake's Jerusalem is considered the defining narrative of this ‘green and pleasant land’. Mr Gee explores the poem through the 24 official languages of the European Union as well as Welsh and Scots Gaelic, via Google Translate’s AI system. Using the visual metaphor of an airport arrivals board, incoming ‘planes’ bring the free movement of people, language, and interpretation. Old meanings deteriorate as new ideas emerge according to algorithmic assumptions and corruptions. 
 
In this interactive online version, you are invited to maneouver your way through the ‘airport’ to decide where you want the poem to take you. In ‘Arrivals’, you can watch the animation cycle before moving on to the interactive sections: ‘Baggage Reclaim’ and ‘Lost Luggage’. 
 
In ‘Baggage Reclaim’, you select luggage from across the EU to access videos of native speakers reciting the mistranslations. New meanings are found and old sentiments deteriorate as the poem moves between different voices, languages and dialects. 
 
In ‘Lost Luggage’ random verses from each translation are combined together to form an aggregate poem of multiple voices and mistranslations which changes upon each playing. The original poem’s point of view shifts between the sinister, the banal, the hilarious and the absurd.


## About the artist

[Mr Gee](http://culture.theodi.org/mr-gee/) (UK) is a veteran of the UK's spoken word scene and a BBC radio presenter. Gee champions promoting unheard voices in society, in part through his extensive rehabilitation work in prisons. He has delivered TEDx talks, starred in West End shows and is known as "Poet Laureate" on Russell Brand's SONY award-winning radio show. His published and performed works are regularly featured across UK mainstream media. 

## Technical specifications

The animation is written in javascript. It is designed to run in real-time through a fullscreen browser window using local files, and it optimised for large external screens 1920x1080 (16:9).

The original translations were created using the Google Translate online service in July 2019, at which point a snapshot was taken. The process began with the original English by William Blake and moves through each European language with a return to the English language inbetween. For example, Original English to French, French to English, French translated English to Bulgarian, Bulgarian to English, Bulgarian translated English from French translated English to German, and so on. Through this process we see the mistranslation of language occuring through the machine learning algorithms of Google Translate. As these algorithms are constantly learning we chose to snapshot our translations to capture a moment in time when these systems are far from perfect. It may be that in 3 years time, this work would lose it's charm as the systems becomes increasingly accurate.

The translated texts are all in a single file, which could be carefully edited if any spelling errors are noticed at a future date: jerusalem/fire_truck/data/translations.js

The animation uses Google's Roboto font.

## Installation requirements
The animation is written in JavaScript. It is a webpage which should be displayed in a full screen window on a screen resolution of 1920x1080. Python3 is required to mimic the webpage being served (see below), this will ensure that P5.js can load locally installed fonts in the browser.

## Install procedure
Download the firetruck folder in this master repo

Unless already installed, install Python3 using the command line (use alternative method if you don't have Homebrew installed): 

```
$ brew install python3
```

This serves the files to the browser rather than running them directly, and is required as the browser can't open the font files directly:

```
$ cd <install folder>
$ python3 -m http.server
```
  
Open browser at http://0.0.0.0:8000

Set window to full screen



## Credits
Mr Gee
Bring Me My Firetruck (the New Jerusalem?)  2019 - 2020
Animation of William Blake’s Jerusalem running through the 24 official languages of the European Union with Welsh and Scots Gaelic via Google Translate

The work was commissioned by ODI's [Data as Culture](culture.theodi.org) programme for the curatorial theme: Copy That? Surplus Data in an Age of Repetitive Duplication curated by Hannah Redler Hawes, Julie Freeman and Anna Scott.

Producer: Julie Freeman [Translating Nature](translatingnature.org)
Technical: Stephen Wolff [Maxgate Digital](maxgatedigital.com)

Country flags via flag-icon-css.lip.is
Split-flap animation adapted from Flapper
Icons from Noun Project contributors: Daniela Baptista, Denis Sazhin, Luis Prado, Saee Vaze, Stanislav Levin, iconsmind.com, Tommy Lau, icon 54, Eugene So, Mike Rowe, Ralf Schmitzer, Rudy Jaspers, Shmidt Sergey, Aldric Rodríguez, Mahmure Alp, Adrien Coquet, Yeoul Kwon, Strokeicon, glyph.faisalovers.



