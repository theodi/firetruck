class Flight {
    constructor(poemLines, uniqueCharacters, four_countries, four_countries_indexes) {
        this.four_countries = four_countries;
        this.four_countries_indexes = four_countries_indexes;

        this.poemLines = poemLines;
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

    getFourCountries() {
        return this.four_countries;
    }
    getFourCountriesIndexes() {
        return this.four_countries_indexes;
    }
}

export default Flight;
