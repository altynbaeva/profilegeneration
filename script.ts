class RandommerAdapter {
    private baseUrl = "https://randommer.io/api"

    public getRandomName(): Promise<string> {
        let url = `${this.baseUrl}/Name?nameType=fullname&quantity=1`;
        return fetch(url, {
            headers: {
                "X-Api-Key": "568b267ac7eb4b26a718ff57f517fb26"
            }
        }).then(function(response: Response) {
            return response.json(); 
        }).then(function(json: any) {
            if (!Array.isArray(json)) {
                throw new Error("failed to parse /Name response, is not array: "+JSON.stringify(json))
            }
            if (json.length == 0) {
                throw new Error("failed to parse /Name response, array len is 0: "+JSON.stringify(json))
            }
            let name = json[0];
            if (typeof name !== "string") {
                throw new Error("failed to parse /Name response, first elem is not string: "+JSON.stringify(json))
            }
            return name;
        });
    }
    
    public getRandomPhoneNumber(): Promise<string> {
        let url = `${this.baseUrl}/Phone/Generate?CountryCode=ru&Quantity=1`;
        return fetch(url, {
            headers: {
                "X-Api-Key": "568b267ac7eb4b26a718ff57f517fb26"
            }
        }).then(function(response: Response) {
            return response.json();
        }).then(function(json: any) {
            if (!Array.isArray(json)) {
                throw new Error("failed to parse /Number response, is not array: "+JSON.stringify(json))   
            }
            if (json.length == 0) {
                throw new Error("failed to parse /Number response, array len is 0: "+JSON.stringify(json))
            }
            let number = json[0];
            if (typeof number !== "string") {
                throw new Error("failed to parse /Number response, first elem is not string: "+JSON.stringify(json))
            }
            return number;
        })
    }
}

class GenderizeAdapter {
    private baseUrl = "https://api.genderize.io?"

    public getGender(name: string): Promise<string> {
        let url = `${this.baseUrl}name=${name}`
        return fetch(url).then(function(response: Response) {
            return response.json();
        }).then(function(json: any) {
            const resp = new GenderizeResponseBody(json);
            return resp.gender
        });
    }
}

class GenderizeResponseBody {
    public gender: string;
    constructor (obj: any) {
        this.gender = obj.gender
    }
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

    public getText(seed: string): Promise<string> {
        return fetch(this.baseUrl, {
            headers: {
            "X-Api-Key": "YbAFdWgbd1EHAepF2TSRcdUjV075pdVcGToX1EI7"
            }
        }).then(function(response: Response) {
            return response.json();
        }).then(function(json: any) {
            const resp = new LoremResponseBody(json);
            return resp.text;
        })
    }
}

class LoremResponseBody {
    public text: string;
    constructor (obj: any) {
        this.text = obj.text;
    }
}


let api = new RandommerAdapter();
api.getRandomName().then(function(value) {
    let diceBearAdapter = new DiceBearAdapter();
    console.log(diceBearAdapter.getAvatarUrl(value));
    let loremIpumAdapter = new LoremIpsumAdapter();
    loremIpumAdapter.getText(value).then(function(value) {
        console.log(value);
    })
})

api.getRandomPhoneNumber().then(function(value) {
    console.log(value);
})