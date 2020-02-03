# Bring Me My Fire Truck  

[BMMFT](http://culture.theodi.org/firetruck/) is an artwork by Mr Gee. It is one of a series of commissioned works from the ODI's latest curatorial theme: [Copy That? Surplus Data in an Age of Repetitive Duplication](http://culture.theodi.org/category/exhibition/copythat/)

## About the artwork

William Blake's poem Jerusalem has been hailed as the unofficial English anthem, the defining narrative of this ‘green and pleasant land’. But, by subjecting Blake's mastery of language to the forces of Google Translator, which uses Artificial Intelligence to translate a chosen language into another, other tales of England begin to emerge. In Bring Me My Firetruck, poet Mr Gee explores the ‘soul of Brexit’ through combining Blake’s poem with the visual metaphor of an airport arrivals board. As we stare at the board, incoming planes are landing from countries of the European Union, bringing with them the free movement of people, the free movement of language, and the free movement of interpretation. By translating the English poem through the 23 other official languages of the European Union and Welsh, Mr Gee reveals a rib-tickling series of new versions: ‘O Clouds unfold’ becomes ‘Get my bed’ and ‘Bring me my Chariot of fire!’ is transformed into the title of this new piece, ‘Bring Me My Fire Truck’. Old meanings deteriorate and new ideas emerge according to algorithmic assumptions and corruptions. The poem’s point of view shifts between the sinister, the banal, and the absurd, raising a few wry smiles along the way.

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

The work was commissioned by ODI's [Data as Culture](culture.theodi.org) programme for the latest curatorial theme: Copy That? Surplus Data in an Age of Repetitive Duplication curated by Hannah Redler Hawes, Julie Freeman and Anna Scott. Exhibition runs Feb 2020 to Dec 2020.

The work has been produced by Julie Freeman and Stephen Wolff of [Translating Nature Ltd](translatingnature.org)

Arrival icon by [Daniela Baptista from the Noun Project](https://thenounproject.com/daniela.baptista/)

Plane icons by [Denis Sazhin from the Noun Project](https://thenounproject.com/iconka/)

Country flags via http://flag-icon-css.lip.is

Split-flap animation adapted from Flapper
