export const apiRequestMixins = {
    methods: {
        async doApiRequest(path, method, data) {
            let response = await fetch('http://localhost/api/' + path, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return response;
        },
    }
  }