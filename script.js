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
        }).then(function (json) {
            if (!Array.isArray(json)) {
                throw new Error("failed to parse /Name response, is not array: " + JSON.stringify(json));
            }
            if (json.length == 0) {
                throw new Error("failed to parse /Name response, array len is 0: " + JSON.stringify(json));
            }
            let name = json[0];
            if (typeof name !== "string") {
                throw new Error("failed to parse /Name response, first elem is not string: " + JSON.stringify(json));
            }
            return name;
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
        }).then(function (json) {
            if (!Array.isArray(json)) {
                throw new Error("failed to parse /Number response, is not array: " + JSON.stringify(json));
            }
            if (json.length == 0) {
                throw new Error("failed to parse /Number response, array len is 0: " + JSON.stringify(json));
            }
            let number = json[0];
            if (typeof number !== "string") {
                throw new Error("failed to parse /Number response, first elem is not string: " + JSON.stringify(json));
            }
            return number;
        });
    }
}
class GenderizeAdapter {
    baseUrl = "https://api.genderize.io?";
    getGender(name) {
        let url = `${this.baseUrl}name=${name}`;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (json) {
            const resp = new GenderizeResponseBody(json);
            return resp.gender;
        });
    }
}
class GenderizeResponseBody {
    gender;
    constructor(obj) {
        this.gender = obj.gender;
    }
}
let api = new RandommerAdapted();
api.getRandomName().then(function (value) {
    let a = new GenderizeAdapter();
    a.getGender(value).then(function (value) {
        console.log(value);
    });
});
api.getRandomPhoneNumber().then(function (value) {
    console.log(value);
});
//# sourceMappingURL=script.js.map