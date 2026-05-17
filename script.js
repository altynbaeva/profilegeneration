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
        let name;
        let number;
        let text;
        let gender;
        let avatar;
        return Promise.all([this.randommerAdapter.getRandomName(),
            this.randommerAdapter.getRandomPhoneNumber(),
            this.loremIpsumAdapter.getText()
        ]).then(function (value) {
            name = value[0];
            number = value[1];
            text = value[2];
            return name;
        })
            .then(function (value) {
            return Promise.all([
                self.genderizeAdapter.getGender(value),
                self.diceBearAdapter.getAvatarUrl(value)
            ]);
        })
            .then(function (value) {
            gender = value[0];
            avatar = value[1];
            let profile = new Profile(name, number, gender, avatar, text);
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
window.onload = function () {
    const buttonGenerate = document.getElementById("button-generate");
    if (buttonGenerate) {
        buttonGenerate.onclick = buildProfile;
    }
};
function buildProfile() {
    let adapter1 = new RandommerAdapter();
    let adapter2 = new GenderizeAdapter();
    let adapter3 = new DiceBearAdapter();
    let adapter4 = new LoremIpsumAdapter();
    let profileg = new ProfileGenerator(adapter1, adapter2, adapter3, adapter4);
    let a = profileg.generateProfile().then(function (value) {
        hiddenChange();
        drawProfile(value);
    });
}
function hiddenChange() {
    const homeScreen = document.getElementById("home-screen");
    const profileScreen = document.getElementById("profile-screen");
    if (profileScreen) {
        profileScreen.classList.add("visible");
        profileScreen.hidden = false;
    }
    if (homeScreen) {
        homeScreen.hidden = true;
    }
}
function drawProfile(profile) {
    const imageElement = document.createElement("img");
    imageElement.className = "avatar-url";
    let profileScreen = document.getElementById("profile-screen");
    profileScreen?.append(imageElement);
    imageElement.alt = "avatar-url";
    imageElement.src = profile.avatar;
    const nameElement = document.querySelector(".profile-name");
    if (nameElement) {
        nameElement.textContent = `${profile.name}`;
    }
    const numberElement = document.querySelector(".profile-number");
    if (numberElement) {
        numberElement.textContent = `${profile.number}`;
    }
    const genderElement = document.querySelector(".profile-gender");
    if (genderElement) {
        genderElement.textContent = `${profile.gender}`;
    }
    const textElement = document.querySelector(".profile-text");
    if (textElement) {
        textElement.textContent = `${profile.text}`;
    }
}
//# sourceMappingURL=script.js.map