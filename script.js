"use strict";
class RandommerAdapted {
    baseUrl = "'https://randommer.io/api/";
    getRandomName() {
        let url = `${this.baseUrl}Name?nameType=fullname&quantity=1`;
        return fetch(url, {
            headers: {
                "X-Api-Key": "568b267ac7eb4b26a718ff57f517fb26"
            }
        }).then(function (response) {
            return response;
        });
    }
    getRandomPhoneNumber() {
        let url = `${this.baseUrl}Phone/Generate?CountryCode=ru&Quantity=1`;
        return fetch(url, {
            headers: {
                "X-Api-Key": "568b267ac7eb4b26a718ff57f517fb26"
            }
        }).then(function (response) {
            return response;
        });
    }
}
let api = new RandommerAdapted();
let name = api.getRandomName();
let number = api.getRandomPhoneNumber();
console.log(name, number);
//# sourceMappingURL=script.js.map