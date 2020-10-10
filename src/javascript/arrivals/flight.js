class Flight {
    constructor(country, country_code, code, capital, nextDate, transferDate, poemLines, poemLinesTranslated, flightIndex, uniqueCharacters, uniqueCharactersEnglish) {

        this.country = country;
        this.country_code = country_code;
        this.code = code;
        this.capital = capital;
        this.nextDate = nextDate;
        this.transferDate = transferDate;
        this.poemLines = poemLines;
        this.poemLinesTranslated = poemLinesTranslated;
        this.flightIndex = flightIndex;
        this.uniqueCharacters = uniqueCharacters;
        this.uniqueCharactersEnglish = uniqueCharactersEnglish;
    }

    getNextDate() {
        return this.nextDate;
    }

    getFlightIndex() {
        return this.flightIndex;
    }

    setNextDate(value) {
        this.nextDate = value;
    }

    getTransferDate() {
        return this.transferDate;
    }

    setTransferDate(value) {
        this.transferDate = value;
    }

    getDisplayLines(poemLines) {
        let lines = [];
        let i = 0;
        for (let line in poemLines) {
            if (i !== 0) {
                lines.push(poemLines[line].toUpperCase());
                if (i % 4 === 0) {
                    lines.push("");
                }
            }
            i++;

        }
        return lines;
    }
    getPoemLines() {
        return this.getDisplayLines(this.poemLines);
    }

    getPoemLinesTranslated() {
        return this.getDisplayLines(this.poemLinesTranslated);
    }

    getUniqueCharacters(english) {
        if (english===true) {
            return this.uniqueCharactersEnglish.join('');
        } else {
            return this.uniqueCharacters.join('');
        }
    }
}

export default Flight;
