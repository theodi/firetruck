class Flight {
    constructor(country, country_code, code, capital, nextDate, transferDate, poemLines, poemLinesTranslated, flightIndex, uniqueCharacters, uniqueCharactersEnglish) {

        this.country = country;
        this.country_code = country_code;
        this.code = code;
        this.capital = capital;
        this.poemLines = poemLines;
        this.flightIndex = flightIndex;
        this.uniqueCharacters = uniqueCharacters;
    }

    getFlightIndex() {
        return this.flightIndex;
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

    getUniqueCharacters() {
        return this.uniqueCharacters.join('');
    }
}

export default Flight;
