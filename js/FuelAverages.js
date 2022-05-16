// JavaScript source code

class FuelAverages {

    // This needs to change to actual URL for release on server.
    // static baseUrl = 'http://localhost:52152';
    static baseUrl = 'https://truckmiles.com';

    static async GetStateAverages() {

        var response = await fetch(`${this.baseUrl}/FuelPriceAPI/api/FuelAverage`, { method: 'GET'});
        var responseObject = await response.json();
        return responseObject;
    }

    static ParseStateAverages(stateAverages) {

        var averages = [];

        for (var i = 0; i < stateAverages.length; i++) {
            var result = {
                date: undefined,
                averages: {}
            };
            for (var j = 0; j < stateAverages[i].length; j++) {
                var sa = stateAverages[i][j];
                var state = sa.state;
                var average = sa.average;
                var date = sa.priceDates;

                if (result.averages[state] == undefined)
                    result.averages[state] = {};
                if (result.date == undefined)
                    result.date = this.FormatDateMMddyyyy(new Date(sa.priceDate));
                result.averages[state] = average;
            }
            averages.push(result)
        }

        return this.AggregateAverages(averages);
    }

    static AggregateAverages(averages) {

        var result = {
            dates: { current: averages[0].date, previous: averages[1].date },
            averages: {}
        };

        var mostRecentDay = averages[0];
        var nextDay = averages[1];

        for (var i = 0; i < this.stateCodes.length; i++) {
            var key = this.stateCodes[i];

            result.averages[key] = {};
            result.averages[key].current = mostRecentDay.averages[key] || 0;
            result.averages[key].previous = nextDay.averages[key] || 0;
            result.averages[key].diff = (result.averages[key].current - result.averages[key].previous).toFixed(2);
        }

        return result;
    }

    static FormatDate(date) {
        var mm = date.getMonth() + 1;
        var dd = date.getDate();

        return [date.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
        ].join('');
    }

    static FormatDateMMddyyyy(date) {
        var mm = date.getMonth() + 1;
        var dd = date.getDate();

        return [
            (mm > 9 ? '' : '0') + mm,
            (dd > 9 ? '' : '0') + dd,
            date.getFullYear()
        ].join('-');
    }

    static AddDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
}



