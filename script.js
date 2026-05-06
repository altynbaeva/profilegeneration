"use strict";
class RandommerAdapter {
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
class DiceBearAdapter {
    baseUrl = "https://api.dicebear.com/9.x/adventurer/svg?";
    getAvatarUrl(seed) {
        let url = `${this.baseUrl}seed=${seed}`;
        return url;
    }
}
class LoremIpsumAdapter {
    baseUrl = "https://api.api-ninjas.com/v1/loremipsum";
    getText(seed) {
        return fetch(this.baseUrl, {
            headers: {
                "X-Api-Key": "YbAFdWgbd1EHAepF2TSRcdUjV075pdVcGToX1EI7"
            }
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            const resp = new LoremResponseBody(json);
            return resp.text;
        });
    }
}
class LoremResponseBody {
    text;
    constructor(obj) {
        this.text = obj.text;
    }
}
let api = new RandommerAdapter();
let a = api.getRandomName;
console.log(a);
class ProfileGenerator {
    randommerAdapter;
    genderizeAdapter;
    diceBearAdapter;
    loremIpsumAdapter;
    constructor(randommerAdapter, genderizeAdapter, diceBearAdapter, loremIpsumAdapter) {
        this.randommerAdapter = randommerAdapter;
        this.genderizeAdapter = genderizeAdapter;
        this.diceBearAdapter = diceBearAdapter;
        this.loremIpsumAdapter = loremIpsumAdapter;
    }
    generateProfile() {
        let name = this.randommerAdapter.getRandomName();
        this.randommerAdapter.getRandomPhoneNumber();
    }
}
//# sourceMappingURL=script.js.map