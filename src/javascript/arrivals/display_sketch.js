import translations from '../data/translations';
import FireTruckChar from '../fire_truck_char';

let displays_sketch = function (p) {
    let offscreenCanvas;
    let font,
        fontsize = 20,
        arial_font,
        arial_fontsize = 20;
    let width = 1890;
    let height = 690;
    let uniqueCharString = "";

    let gapX = 30.5, gapY = 35.5;
    let marginX = 10, marginY = 9;
    let lastX = 0, lastY = 0;
    // offscreen characters
    let charPositions = new Map();
    let characterArray = [];
    let numChars = 0;
    let numCols = 60;
    let numRows = 19;
    let updateOffscreenBuffer = true;

    // onscreen characters
    let fireTruckCharacters = [];
    let currentTranslation = 1;
    let currentCountry = "";
    let timing = 150,
        min_timing = 15,
        max_timing = 250,
        threshold = 100;
    // let pauseWhileTimeUpdating = false;


    p.preload = function() {
        // Ensure the .ttf or .otf font stored in the assets directory
        // is loaded before setup() and draw() are called
        font = p.loadFont('fonts/pt-mono/PTM55FT.ttf');
        arial_font = p.loadFont('https://fire-truck.maxgatedigital.com/fonts/arial/ArialUnicode.ttf')
        //fonts/arial/ArialUnicode.ttf')
    };

    p.setup = function(){
        p.createCanvas(width, height);
        offscreenCanvas = p.createGraphics(width, height);
        offscreenCanvas.background(17, 17, 17);
        offscreenCanvas.textStyle(p.BOLD);
        offscreenCanvas.textFont(font);
        offscreenCanvas.textSize(fontsize);
        offscreenCanvas.textAlign(p.LEFT, p.TOP);
        offscreenCanvas.noStroke();

        // Set the gap between letters and the left and top margin
        offscreenCanvas.translate(marginX, marginY);
    };

    p.draw = function(){
        /**
         * if offscreen buffer needs updating (for additional characters as they appear, then this
         * section is triggered
         */
        if (updateOffscreenBuffer) {
            let allDone = false;

            // Loop as long as there are letters left
            for (let y = 0; y < height - (gapY * 2); y += gapY) {
                if (allDone) {
                    break;
                }
                for (let x = 0; x < width - (gapX *3); x += gapX) {
                    if (allDone){
                        characterArray = Array.from(charPositions, ([key, value]) => key);
                        break;
                    }
                    // if we've not got to an empty bit of offscreen canvas, keep going until we get there
                    if (x <= lastX && y <= lastY) {
                        break;
                    }

                    // find next char to draw now we're at a free spot
                    let letter = uniqueCharString.substring(numChars, numChars+1);
                    let charToDrawInfo = charPositions.get(letter);

                    // check current charPositions to see if all uniqueCharString has been drawn
                    while (charToDrawInfo !== undefined) {
                        charToDrawInfo = undefined;
                        letter = undefined;
                        numChars++;
                        if (numChars === uniqueCharString.length) {
                            allDone = true;
                        } else {
                            letter = uniqueCharString.substring(numChars, numChars+1);
                            charToDrawInfo = charPositions.get(letter);
                        }
                    }

                    // draw letter if defined, and we don't have any info about where it is drawn
                    if (letter !== undefined && charToDrawInfo === undefined) {

                        let charWidth = gapX - marginX;
                        let charHeight = gapY - marginY;
                        offscreenCanvas.fill(51, 51, 51);
                        offscreenCanvas.rect(x, y, charWidth, charHeight, 2);
                        offscreenCanvas.fill(248, 225, 6);

                        if (currentCountry === 'Greek' || currentCountry === 'Maltese') {
                            offscreenCanvas.textFont(arial_font);
                            offscreenCanvas.textSize(arial_fontsize);
                            // Draw the letter to the offscreen graphics
                            offscreenCanvas.text(letter, x + 4, y );
                        } else {
                            offscreenCanvas.textFont(font);
                            offscreenCanvas.textSize(fontsize);
                            // Draw the letter to the offscreen graphics
                            offscreenCanvas.text(letter, x + 5, y + 3);
                        }

                        // console.log(currentCountry, letter);
                        // store position of letter
                        charPositions.set(letter, {x: x, y: y, width: charWidth, height: charHeight});
                        // set new lastX and lastY
                        lastX = x;
                        lastY = y;
                    }
                }
            }
            updateOffscreenBuffer = false;
        }

        /**
         * draw current state of the letters to the screen
         * if split-flap in operation, each cell of grid will have a current and target character
         */
        for (let i = 0; i <= numRows; i++) {
            let lineTranslations = ["", ];
            if (fireTruckCharacters[i] === undefined) {
                fireTruckCharacters[i] = [];
            }

            if (i === 4 || i === 9 || i === 14) {
                // i = i - 1;
            } else {
                let rowNumber = i;
                if (i > 4 && i < 9) {
                    rowNumber = rowNumber - 1;
                }
                if (i > 9 && i < 14) {
                    rowNumber = rowNumber - 2;
                }
                if (i > 14 && i < numRows) {
                    rowNumber = rowNumber - 3;
                }
                lineTranslations = translations[rowNumber + 1];
            }

            for (let j = 0; j < numCols; j++) {
                if (fireTruckCharacters[i][j] === undefined) {
                    fireTruckCharacters[i][j] = new FireTruckChar(" ", " ", timing, min_timing, max_timing, threshold, i + 1);
                }

                let charIndexToDraw = j;
                let testinginging = " ";
                if (lineTranslations !== undefined) {

                    if (currentTranslation >= lineTranslations.length || j >= lineTranslations[currentTranslation].length) {
                        testinginging = " ";
                    } else {
                        testinginging = lineTranslations[currentTranslation][charIndexToDraw];
                    }
                    if (testinginging !== 'ß') {
                        testinginging = testinginging.toUpperCase();
                    }
                    fireTruckCharacters[i][j].setTargetCharacter(testinginging);
                    if (fireTruckCharacters[i][j].getCurrentCharacter() === undefined) {
                        fireTruckCharacters[i][j].setCurrentCharacter(" ");
                    }

                    let col = j + 1;
                    let row = i;
                    let onscreenX = getScreenX(col);
                    let onscreenY = getScreenY(row);

                    // need to update the cell?
                    if (fireTruckCharacters[i][j].getCurrentCharacter() !== testinginging ) {
                        if(!fireTruckCharacters[i][j].getAnimating()) {
                            fireTruckCharacters[i][j].setCharacterArray(characterArray);
                            fireTruckCharacters[i][j].setAnimating(true);
                        }
                        // get cell character top and bottom
                        // if top != bottom then update both separately
                        // else update both together
                        // increment cell (cell handles timing)
                        fireTruckCharacters[i][j].updateTimings();
                        let currentCharacter = fireTruckCharacters[i][j].getPreviousCharacter();


                        let currentCharToDrawInfo = charPositions.get(currentCharacter);
                        let currentOffscreenX = currentCharToDrawInfo.x;
                        let currentOffscreenY = currentCharToDrawInfo.y;

                        let frontTopVisible = fireTruckCharacters[i][j].getFrontTopVisible();
                        let frontBottomVisible = fireTruckCharacters[i][j].getFrontBottomVisible();
                        let backTopVisible = fireTruckCharacters[i][j].getBackTopVisible();
                        let backBottomVisible = fireTruckCharacters[i][j].getBackBottomVisible();
                        let nextCharacter = fireTruckCharacters[i][j].getNextCharacter();

                        let nextCharToDrawInfo = charPositions.get(nextCharacter);
                        let nextOffscreenX = nextCharToDrawInfo.x;
                        let nextOffscreenY = nextCharToDrawInfo.y;

                        if (frontTopVisible && frontBottomVisible) {
                            // show current on top
                            p.image(offscreenCanvas, onscreenX, onscreenY, gapX, gapY/2, currentOffscreenX + 2, currentOffscreenY, gapX, gapY/2);
                            // show next on bottom
                            p.image(offscreenCanvas, onscreenX, onscreenY+gapY/2, gapX, gapY/2, nextOffscreenX + 2, nextOffscreenY+gapY/2, gapX, gapY/2);
                        } else if (frontTopVisible && backBottomVisible) {
                            // show current
                            p.image(offscreenCanvas, onscreenX, onscreenY, gapX, gapY, currentOffscreenX + 2, currentOffscreenY, gapX, gapY);
                        } else if (backTopVisible && backBottomVisible) {
                            // show next on top
                            p.image(offscreenCanvas, onscreenX, onscreenY, gapX, gapY/2, nextOffscreenX + 2, nextOffscreenY, gapX, gapY/2);
                            // show current on bottom
                            p.image(offscreenCanvas, onscreenX, onscreenY+gapY/2, gapX, gapY/2, currentOffscreenX + 2, currentOffscreenY+gapY/2, gapX, gapY/2);
                        } else if (backTopVisible && frontBottomVisible) {
                            // show next
                            p.image(offscreenCanvas, onscreenX, onscreenY, gapX, gapY, nextOffscreenX + 2, nextOffscreenY, gapX, gapY);
                        }

                    } else {
                        let currentCharacter = fireTruckCharacters[i][j].getPreviousCharacter();
                        let currentCharToDrawInfo = charPositions.get(currentCharacter);
                        let currentOffscreenX = currentCharToDrawInfo.x;
                        let currentOffscreenY = currentCharToDrawInfo.y;

                        p.image(offscreenCanvas, onscreenX, onscreenY, gapX, gapY, currentOffscreenX + 2, currentOffscreenY, gapX, gapY);
                        fireTruckCharacters[i][j].setAnimating(false);
                    }

                } else {

                }

            }
        }
    };

    p.updateCharacterSet = function (uc, ct, cc) {
        uniqueCharString = uc;
        numChars = 0;
        updateOffscreenBuffer = true;
        currentTranslation = ct;
        currentCountry = cc;
    };

    function getScreenY (row) {
        return (row * gapY) + marginY;
    }

    function getScreenX (col) {
        return (col * gapX);
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

};


export default displays_sketch;
