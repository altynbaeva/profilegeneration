class RandommerAdapter {
    private baseUrl = "https://randommer.io/api"

    private validateArrayResponse(json: unknown): string {
        if (!Array.isArray(json)) throw new Error("Не массив");
        if (json.length === 0) throw new Error("Пустой массив");
        if (typeof json[0] !== 'string') throw new Error("Не строка");
        return json[0];
    }

    public async getRandomName(): Promise<string> {
        const url = `${this.baseUrl}/Name?nameType=fullname&quantity=1`;
        const response = await fetch(url, {
            headers: {
                "X-Api-Key": "568b267ac7eb4b26a718ff57f517fb26"
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();
        this.validateArrayResponse(json);
        
        return json[0];
    }
    
    public async getRandomPhoneNumber(): Promise<string> {
        const url = `${this.baseUrl}/Phone/Generate?CountryCode=ru&Quantity=1`;
        const response = await fetch(url, {
            headers: {
                "X-Api-Key": "568b267ac7eb4b26a718ff57f517fb26"
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();
        this.validateArrayResponse(json);

        return json[0];
    }
}

class GenderizeAdapter {
    private baseUrl = "https://api.genderize.io?"

    public async getGender(name: string): Promise<string> {
        const url = `${this.baseUrl}name=${name}`
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    
        const json = await response.json() as GenderizeResponse;
        if (typeof json !== 'object' || json === null || typeof json.gender !== 'string') {
            throw new Error('Invalid Genderize response');
        }
        return json.gender;

    }
}


interface GenderizeResponse {
    gender: string;
}

class DiceBearAdapter {
    private baseUrl = "https://api.dicebear.com/9.x/adventurer/svg?"

    public getAvatarUrl(seed: string): string {
        let url = `${this.baseUrl}seed=${seed}`
        return url;
    }
}

class LoremIpsumAdapter {
    private baseUrl = "https://api.api-ninjas.com/v1/loremipsum"

    public async getText(): Promise<string> {
        const response = await fetch(this.baseUrl, {
            headers: {
            "X-Api-Key": "YbAFdWgbd1EHAepF2TSRcdUjV075pdVcGToX1EI7"
            }
        })
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const json = await response.json() as LoremResponse;
        if (typeof json !== 'object' || json === null || typeof json.text !== 'string') {
            throw new Error('Invalid Lorem response');
        }
        return json.text;
        
    }
}

interface LoremResponse {
    text: string;
}

class ProfileGenerator {
    constructor(
        private randommerAdapter: RandommerAdapter,
        private genderizeAdapter: GenderizeAdapter,
        private diceBearAdapter: DiceBearAdapter,
        private loremIpsumAdapter: LoremIpsumAdapter
    ) {}

    public async generateProfile() : Promise<Profile> {
        const [name, number, text] = await Promise.all([
                                this.randommerAdapter.getRandomName(),
                                this.randommerAdapter.getRandomPhoneNumber(),
                                this.loremIpsumAdapter.getText()]);

        const avatarUrl = this.diceBearAdapter.getAvatarUrl(name);
        const gender = await this.genderizeAdapter.getGender(name);

        return new Profile(name, number, gender, avatarUrl, text);
    }
}

class Profile {
    public name: string;
    public number: string;
    public gender: string;
    public avatar: string;
    public text: string;

    constructor (name: string, number: string, gender: string, avatar: string, text: string) {
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
}

async function buildProfile() {
    try {
        const randommerAdapter = new RandommerAdapter();
        const genderizeAdapter = new GenderizeAdapter();
        const diceBearAdapter = new DiceBearAdapter();
        const loremIpsumAdapter = new LoremIpsumAdapter();

        const profileGenerator = new ProfileGenerator(randommerAdapter, genderizeAdapter, diceBearAdapter, loremIpsumAdapter);
        const profile = await profileGenerator.generateProfile();

        switchToProfileScreen();
        drawProfile(profile);
    } catch (error) {
        console.error('Ошибка при создании профиля:', error);
        alert('Не удалось создать профиль. Попробуйте позже.');
    }
    
}

function switchToProfileScreen () {
    const homeScreen = document.getElementById("home-screen");
    const profileScreen = document.getElementById("profile-screen");
    if (profileScreen) {
        profileScreen.classList.add("visible");
    }
    if (homeScreen) {
        homeScreen.classList.add("hidden");
    }
}

function drawProfile (profile: Profile) {
    let profileScreen = document.getElementById("profile-screen");
    if (!profileScreen) {
        return
    }
    const oldImage = profileScreen?.querySelector(".avatar-url");
    if (oldImage) {
        oldImage.remove();
    }
    const imageElement = document.createElement("img");
    imageElement.className = "avatar-url";
    profileScreen.append(imageElement);
    imageElement.alt = "avatar-url";
    imageElement.src = profile.avatar;

    const nameElement = document.getElementById("profile-name");
    if (nameElement) {
        nameElement.textContent = profile.name;
    }

    const numberElement = document.getElementById("profile-number");
    if (numberElement) {
        numberElement.textContent = profile.number;
    }

    const genderElement = document.getElementById("profile-gender");
    if (genderElement) {
        genderElement.textContent = profile.gender;
    }

    const textElement = document.getElementById("profile-text");
    if (textElement) {
        textElement.textContent = profile.text;
    }
}