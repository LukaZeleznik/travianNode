export const toolsMixins = {
    methods: {
        secondsToTimeCompleted(seconds) {
            return new Date(seconds).toLocaleTimeString('sl-SI');
        },
        secondsToTimeRemaining(seconds) {
            return new Date(seconds).toISOString().substr(11, 8);
        },
        getCookie(name) {
            const value = `; ${document.cookie}`;
            console.log(document.cookie)
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }
    }
  }