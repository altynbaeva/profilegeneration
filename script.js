"use strict";
class RandommerAdapted {
    baseUrl = "https://randommer.io/api";
    getRandomName() {
        let url = `${this.baseUrl}/Name?nameType=fullname&quantity=1`;
        return fetch(url, {
            headers: {
                "X-Api-Key": "568b267ac7eb4b26a718ff57f517fb26"
            }
        }).then(function (response) {
            return response.json();
        });
    }
    getRandomPhoneNumber() {
        let url = `${this.baseUrl}/Phone/Generate?CountryCode=ru&Quantity=1`;
        return fetch(url, {
            headers: {
                "X-Api-Key": "568b267ac7eb4b26a718ff57f517fb26"
            }
        }).then(function (response) {
            return response.json();
        });
    }
}
let api = new RandommerAdapted();
api.getRandomName().then(function (value) {
    console.log(value);
});
api.getRandomPhoneNumber().then(function (value) {
    console.log(value);
});
//# sourceMappingURL=script.js.map