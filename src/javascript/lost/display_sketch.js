import FireTruckChar from '../fire_truck_char';


let displays_sketch = function (p) {
    let offscreenCanvasYellow;
    let offscreenCanvasWhite;
    let font,
        fontsize = 20,
        arial_font;
    let width = 1890;
    let height = 690;
    let previousCharString = "";
    let uniqueCharString = "";

    let gapX = 30.5, gapY = 35.5;
    let marginX = 10, marginY = 9;

    // offscreen characters
    let charPositionsYellow = new Map();
    let characterArrayYellow = [];
    let numCols = 60;
    let numRows = 19;
    let updateOffscreenBuffer = true;

    // onscreen characters
    let fireTruckCharacters = [];

    let timing = 150,
        min_timing = 15,
        max_timing = 250,
        threshold = 100;
    let currentFlight = null;
    let highlightedVerse = 0; // -1 means no highlighted verse
    let pauseUpdate = false;

    p.preload = function() {
        // Ensure the .ttf or .otf font stored in the assets directory
        // is loaded before setup() and draw() are called
        font = p.loadFont('fonts/pt-mono/PTM55FT.ttf');
        arial_font = p.loadFont('https://fire-truck.maxgatedigital.com/fonts/arial/ArialUnicode.ttf')
        //fonts/arial/ArialUnicode.ttf')
    };

    p.setup = function(){
        p.createCanvas(width, height);
        offscreenCanvasYellow = p.createGraphics(width, height);
        offscreenCanvasYellow.background(17, 17, 17);
        offscreenCanvasYellow.textStyle(p.BOLD);
        offscreenCanvasYellow.textFont(font);
        offscreenCanvasYellow.textSize(fontsize);
        offscreenCanvasYellow.textAlign(p.LEFT, p.TOP);
        offscreenCanvasYellow.noStroke();
        // Set the gap between letters and the left and top margin
        offscreenCanvasYellow.translate(marginX, marginY);

        offscreenCanvasWhite = p.createGraphics(width, height);
        offscreenCanvasWhite.background(17, 17, 17);
        offscreenCanvasWhite.textStyle(p.BOLD);
        offscreenCanvasWhite.textFont(font);
        offscreenCanvasWhite.textSize(fontsize);
        offscreenCanvasWhite.textAlign(p.LEFT, p.TOP);
        offscreenCanvasWhite.noStroke();
        // Set the gap between letters and the left and top margin
        offscreenCanvasWhite.translate(marginX, marginY);

    };

    p.draw = function(){


        /**
         * 1. only update character set if split flap is 'settled'
         *
         * 2. this is when all 'target' characters have been reached -
         *
         *
         * 3. could set a flag when this process starts, and when it finishes,
         *
         * 4. could save up character set changes, and board character changes if a change is already in process
         *
         *
         *
         *
         *
         */



        /**
         * if offscreen buffer needs updating (for additional characters as they appear, then this
         * section is triggered)
         */
        if (updateOffscreenBuffer) {
            updateOffscreenCanvas(0); // yellow
            updateOffscreenCanvas(1); // white
            updateOffscreenBuffer = false;
        }

        if (!pauseUpdate) {
            /**
             * draw current state of the letters to the screen
             * if split-flap in operation, each cell of grid will have a current and target character
             */
            for (let i = 0; i <= numRows; i++) {
                let lineTranslations = [];
                if (fireTruckCharacters[i] === undefined) {
                    fireTruckCharacters[i] = [];
                }

                let rowNumber = i;

                // blank row?
                if (i === 4 || i === 9 || i === 14) {
                    // i = i - 1;
                } else {
                    if (i > 4 && i < 9) {
                        rowNumber = rowNumber - 1;
                    }
                    if (i > 9 && i < 14) {
                        rowNumber = rowNumber - 2;
                    }
                    if (i > 14 && i < numRows) {
                        rowNumber = rowNumber - 3;
                    }
                    lineTranslations = currentFlight.poemLines[rowNumber];
                }

                let offscreenCanvas = offscreenCanvasWhite;

                if (highlightedVerse !== -1) {

                    // do we know row?
                    let minRow = highlightedVerse * 4;
                    let maxRow = minRow + 3;

                    if (rowNumber >= minRow && rowNumber <= maxRow) {
                        offscreenCanvas = offscreenCanvasYellow;
                    } else {
                        offscreenCanvas = offscreenCanvasWhite;
                    }
                }


                for (let j = 0; j < numCols; j++) {
                    if (fireTruckCharacters[i][j] === undefined) {
                        fireTruckCharacters[i][j] = new FireTruckChar(" ", " ", timing, min_timing, max_timing, threshold, i + 1);
                    }

                    if (lineTranslations !== undefined) {
                        let testinginging = " ";

                        if (j < lineTranslations.length) {
                            testinginging = lineTranslations[j];
                        }
                        if (testinginging !== 'ß') {
                            testinginging = testinginging.toUpperCase();
                        }
                        fireTruckCharacters[i][j].setTargetCharacter(testinginging);
                        if (fireTruckCharacters[i][j].getCurrentCharacter() === undefined) {
                            fireTruckCharacters[i][j].setCurrentCharacter(" ");
                        }
                        if (fireTruckCharacters[i][j].getPreviousCharacter() === undefined) {
                            fireTruckCharacters[i][j].setPreviousCharacter(" ");
                        }
                        if (fireTruckCharacters[i][j].getNextCharacter() === undefined) {
                            fireTruckCharacters[i][j].setNextCharacter(" ");
                        }

                        let col = j + 1;
                        let row = i;
                        let onscreenX = getScreenX(col);
                        let onscreenY = getScreenY(row);

                        // need to update the cell?
                        if (fireTruckCharacters[i][j].getCurrentCharacter() !== testinginging ) {
                            if(!fireTruckCharacters[i][j].getAnimating()) {
                                fireTruckCharacters[i][j].setCharacterArray(characterArrayYellow);
                                fireTruckCharacters[i][j].setAnimating(true);
                            }
                            // get cell character top and bottom
                            // if top != bottom then update both separately
                            // else update both together
                            // increment cell (cell handles timing)
                            fireTruckCharacters[i][j].updateTimings();
                            let currentCharacter = fireTruckCharacters[i][j].getPreviousCharacter();
                            // if (currentCharacter === undefined) {
                            //     currentCharacter = " ";
                            // }
    //                        console.log('i = ' + i + ', j = ' + j + ', currentCharacter = ' + currentCharacter);

                            let currentCharToDrawInfo = charPositionsYellow.get(currentCharacter);
                            if (currentCharToDrawInfo === undefined) {
//                                 console.log ('currentCharToDrawInfo (charPositionsYellow) is undefined');
                            } else {

                                let currentOffscreenX = currentCharToDrawInfo.x;
                                let currentOffscreenY = currentCharToDrawInfo.y;

                                let frontTopVisible = fireTruckCharacters[i][j].getFrontTopVisible();
                                let frontBottomVisible = fireTruckCharacters[i][j].getFrontBottomVisible();
                                let backTopVisible = fireTruckCharacters[i][j].getBackTopVisible();
                                let backBottomVisible = fireTruckCharacters[i][j].getBackBottomVisible();
                                let nextCharacter = fireTruckCharacters[i][j].getNextCharacter();

                                let nextCharToDrawInfo = charPositionsYellow.get(nextCharacter);

                                let nextOffscreenX = 0;
                                let nextOffscreenY = 0;
                                if (nextCharToDrawInfo !== undefined) {
                                    nextOffscreenX = nextCharToDrawInfo.x;
                                    nextOffscreenY = nextCharToDrawInfo.y;
                                }

                                if (frontTopVisible && frontBottomVisible) {
                                    // show current on top
                                    p.image(offscreenCanvas, onscreenX, onscreenY, gapX, gapY / 2, currentOffscreenX + 2, currentOffscreenY, gapX, gapY / 2);
                                    // show next on bottom
                                    p.image(offscreenCanvas, onscreenX, onscreenY + gapY / 2, gapX, gapY / 2, nextOffscreenX + 2, nextOffscreenY + gapY / 2, gapX, gapY / 2);
                                } else if (frontTopVisible && backBottomVisible) {
                                    // show current
                                    p.image(offscreenCanvas, onscreenX, onscreenY, gapX, gapY, currentOffscreenX + 2, currentOffscreenY, gapX, gapY);
                                } else if (backTopVisible && backBottomVisible) {
                                    // show next on top
                                    p.image(offscreenCanvas, onscreenX, onscreenY, gapX, gapY / 2, nextOffscreenX + 2, nextOffscreenY, gapX, gapY / 2);
                                    // show current on bottom
                                    p.image(offscreenCanvas, onscreenX, onscreenY + gapY / 2, gapX, gapY / 2, currentOffscreenX + 2, currentOffscreenY + gapY / 2, gapX, gapY / 2);
                                } else if (backTopVisible && frontBottomVisible) {
                                    // show next
                                    p.image(offscreenCanvas, onscreenX, onscreenY, gapX, gapY, nextOffscreenX + 2, nextOffscreenY, gapX, gapY);
                                }
                            }
                        } else {
                            let currentCharacter = fireTruckCharacters[i][j].getPreviousCharacter();
                            let currentCharToDrawInfo = charPositionsYellow.get(currentCharacter);
                            let currentOffscreenX = currentCharToDrawInfo.x;
                            let currentOffscreenY = currentCharToDrawInfo.y;

                            p.image(offscreenCanvas, onscreenX, onscreenY, gapX, gapY, currentOffscreenX + 2, currentOffscreenY, gapX, gapY);
                            fireTruckCharacters[i][j].setAnimating(false);
                        }
                    }
                }
            }
        }
    };

    p.updateCharacterSet = function (uf) {
        // flight has four_countries
        let existingCharString = previousCharString;
        previousCharString = uf.getUniqueCharacters();
        currentFlight = uf;
        uniqueCharString = existingCharString + previousCharString;
        updateOffscreenBuffer = true;
    };

    p.setHighlightedVerse = function(v) {
        highlightedVerse = v;
    }

    p.setPauseUpdate = function(p) {
        pauseUpdate = p;
    }

    function getScreenY (row) {
        return (row * gapY) + marginY;
    }

    function getScreenX (col) {
        return (col * gapX);
    }

    function updateOffscreenCanvas(colour) {
        let allDone = false;
        let numChars = 0;
        let lastX = 0, lastY = 0;

        // reset - for 2 colours
        charPositionsYellow = new Map();
        characterArrayYellow = [];

        // Loop as long as there are letters left
        for (let y = 0; y < height - (gapY * 2); y += gapY) {
            if (allDone) {
                break;
            }
            // noinspection PointlessBooleanExpressionJS
            for (let x = 0; x < width - (gapX *3); x += gapX) {
                if (allDone){
                    characterArrayYellow = Array.from(charPositionsYellow, ([key, value]) => key);
                    break;
                }
                // if we've not got to an empty bit of offscreen canvas, keep going until we get there
                if (x <= lastX && y <= lastY) {
                    break;
                }

                // find next char to draw now we're at a free spot
                let letter = uniqueCharString.substring(numChars, numChars+1);
                let charToDrawInfo = charPositionsYellow.get(letter);

                // check current charPositions to see if all uniqueCharString has been drawn
                while (charToDrawInfo !== undefined) {
                    charToDrawInfo = undefined;
                    letter = undefined;
                    numChars++;
                    if (numChars === uniqueCharString.length) {
                        allDone = true;
                    } else {
                        letter = uniqueCharString.substring(numChars, numChars+1);
                        charToDrawInfo = charPositionsYellow.get(letter);
                    }
                }

                // draw letter if defined, and we don't have any info about where it is drawn
                // noinspection PointlessBooleanExpressionJS
                if (letter !== undefined && charToDrawInfo === undefined) {

                    let charWidth = gapX - marginX;
                    let charHeight = gapY - marginY;

                    if (colour === 0) {
                        offscreenCanvasYellow.fill(51, 51, 51);
                        offscreenCanvasYellow.rect(x, y, charWidth, charHeight, 2);
                        offscreenCanvasYellow.fill(248, 225, 6);
                        offscreenCanvasYellow.textFont(font);
                        offscreenCanvasYellow.textSize(fontsize);

                        // Draw the letter to the offscreen graphics
                        offscreenCanvasYellow.text(letter, x + 5, y + 3);
                    } else {
                        offscreenCanvasWhite.fill(51, 51, 51);
                        offscreenCanvasWhite.rect(x, y, charWidth, charHeight, 2);
                        offscreenCanvasWhite.fill(225, 225, 225);
                        offscreenCanvasWhite.textFont(font);
                        offscreenCanvasWhite.textSize(fontsize);

                        // Draw the letter to the offscreen graphics
                        offscreenCanvasWhite.text(letter, x + 5, y + 3);
                    }
                    // store position of letter
                    charPositionsYellow.set(letter, {x: x, y: y, width: charWidth, height: charHeight});

                    // set new lastX and lastY
                    lastX = x;
                    lastY = y;
                }
            }
        }
    }
};


export default displays_sketch;
