export const apiRequestMixins = {
    methods: {
        async doApiRequest(path, method, data, jsonf) {
            let response;
            
            if (jsonf){
                response = await fetch('http://localhost:8080/api/' + path, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
            } else {
                response = await fetch('http://localhost:8080/api/' + path, { method: method });
            }
            return response;
        },
    }
  }