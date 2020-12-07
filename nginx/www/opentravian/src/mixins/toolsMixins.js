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
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return false;
        },
        checkIfLoggedIn(redirectf){
            if(this.getCookie("jwt")){
                if(this.$route.name == "login" || this.$route.name == "register"){
                    if(redirectf) this.$router.push({ name: 'resources' });
                }
                return true;
            }
            else {
                if(this.$route.name != "login" && this.$route.name != "register"){
                    if(redirectf) this.$router.push({ name: 'login' });
                } 
                return false;
            }
        },
        async mapTileIdToIdVillage(mapTileId){
            return await(await(await this.doApiRequest("villages/" + mapTileId,"GET","",false)).json()).data._id;
        },
    }
}