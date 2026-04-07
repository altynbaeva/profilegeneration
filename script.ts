class RandommerAdapted {
    private baseUrl = "https://randommer.io/api"

    public getRandomName(): Promise<string> {
        let url = `${this.baseUrl}/Name?nameType=fullname&quantity=1`;
        return fetch(url, {
            headers: {
                "X-Api-Key": "568b267ac7eb4b26a718ff57f517fb26"
            }
        }).then(function(response: Response) {
            return response.json();
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
        });
    }
}

let api = new RandommerAdapted();
api.getRandomName().then(function(value) {
    console.log(value);
})
api.getRandomPhoneNumber().then(function(value) {
    console.log(value);
})