var moment = require('moment');
moment().format();

class FireTruckChar {
    constructor(currentCharacter, targetCharacter, timing, min_timing, max_timing, threshold, row_number) {
        let now = moment();
        // timing
        this.nextIncrement = now;
        this.nextHideFrontTop = now;
        this.speed1 = 0.0;
        this.speed2 = 0.0;
        this.timing = timing;
        this.min_timing = min_timing;
        this.max_timing = max_timing;
        this.threshold = threshold;
        this.row_number = row_number;

        // characters
        this.pos = -1;
        this.currentCharacter = currentCharacter;
        this.targetCharacter = targetCharacter;
        this.previousCharacter = currentCharacter;
        this.nextCharacter = currentCharacter;
        this.distance = 0;
        this.animating = false;

        // flaps
        this.frontTopVisible = true;
        this.frontBottomVisible = true;
        this.backTopVisible = true;
        this.backBottomVisible = true;
    }

    setCurrentCharacter(cc) {
        this.currentCharacter = cc;
    }
    setCharacterArray(charArray) {
        this.characterArray = charArray;
        this.pos = this.characterArray.indexOf(this.currentCharacter);
    }

    getCurrentCharacter() {
        return this.currentCharacter;
    }

    setTargetCharacter(tc) {
        this.targetCharacter = tc;
    }

    getTargetCharacter() {
        return this.targetCharacter;
    }

    getPreviousCharacter() {
        return this.previousCharacter;
    }

    setPreviousCharacter(pc) {
        this.previousCharacter = pc;
    }

    getNextCharacter() {
        return this.nextCharacter;
    }

    setAnimating(animate) {
        this.animating = animate;
    }

    getAnimating() {
        return this.animating;
    }

    getFrontTopVisible() {
        return this.frontTopVisible;
    }

    getFrontBottomVisible() {
        return this.frontBottomVisible;
    }

    getBackTopVisible() {
        return this.backTopVisible;
    }

    getBackBottomVisible() {
        return this.backBottomVisible;
    }

    updateTimings() {
        let now = moment();
        if (this.nextIncrement === undefined || this.nextIncrement < now) {

            this.targetPos = this.characterArray.indexOf(this.targetCharacter);
            this.distance = this.targetPos - this.pos;
            if (this.distance < 0) {
                this.distance += this.characterArray.length;
            }
            this.duration = Math.floor(
                (this.timing - this.min_timing)
                / this.distance + this.min_timing
            ) * (this.row_number / 2);
            if (this.duration > this.max_timing) {
                this.duration = this.max_timing;
            }
            if (this.duration < this.min_timing) {
                this.duration = this.min_timing;
            }

            this.increment();
            this.nextIncrement = now + this.duration;
        }


        if (this.nextHideFrontTop === undefined || this.nextHideFrontTop < now) {
            this.speed1 = Math.floor(Math.random() * this.duration * .4 + this.duration * .3) * (this.row_number / 3.0);
            this.frontTopVisible = false;
            this.nextHideFrontTop = now + this.speed1;
        }

        if (this.nextShowFrontBottom === undefined || this.nextShowFrontBottom < now) {
            this.speed2 = Math.floor(Math.random() * this.duration * .1 + this.duration * .2) * (this.row_number / 3.0);
            this.frontBottomVisible = false;
            this.nextShowFrontBottom = now + this.speed2;
        }
    }

    increment() {
        //let maxDistance = this.characterArray.length;
        let inc = 1;
        //if (maxDistance > 30 && this.distance > 20) {
        //    inc = 2;
        //}

        let next = this.pos + inc;
        if (next >= this.characterArray.length) {
            next = 0;
        }

        // show front top and back bottom
        // this.$prev.html(this.options.chars[this.pos]).show();
        this.previousCharacter = this.characterArray[this.pos];
        this.frontTopVisible = true;
        this.backBottomVisible = true;

        // hide front bottom
        // this.$front_bottom.hide();
        this.frontBottomVisible = false;
        // set back top and front bottom to next character
        // this.$next.html(this.options.chars[next]);
        this.nextCharacter = this.characterArray[next];
        this.currentCharacter = this.previousCharacter;
        this.pos = next;
    }
}

export default FireTruckChar;
