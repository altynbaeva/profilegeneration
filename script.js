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
    getText() {
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
        const self = this;
        let map = new Map();
        return Promise.all([this.randommerAdapter.getRandomName(),
            this.randommerAdapter.getRandomPhoneNumber(),
            this.loremIpsumAdapter.getText()
        ]).then(function (value) {
            map.set("name", value[0]);
            map.set("number", value[1]);
            map.set("text", value[2]);
            return map;
        })
            .then(function (value) {
            let name;
            if (value.has("name")) {
                name = value.get("name");
            }
            return Promise.all([
                self.genderizeAdapter.getGender(name),
                self.diceBearAdapter.getAvatarUrl(name)
            ]);
        })
            .then(function (value) {
            map.set("gender", value[0]);
            map.set("avatar", value[1]);
            let profile = new Profile(map.get("name"), map.get("number"), map.get("gender"), map.get("avatar"), map.get("text"));
            console.log(profile);
            return profile;
        });
    }
}
class Profile {
    name;
    number;
    gender;
    avatar;
    text;
    constructor(name, number, gender, avatar, text) {
        this.name = name;
        this.number = number;
        this.gender = gender;
        this.avatar = avatar;
        this.text = text;
    }
}
let adapter1 = new RandommerAdapter();
let adapter2 = new GenderizeAdapter();
let adapter3 = new DiceBearAdapter();
let adapter4 = new LoremIpsumAdapter();
let profile = new ProfileGenerator(adapter1, adapter2, adapter3, adapter4);
profile.generateProfile();
//# sourceMappingURL=script.js.map