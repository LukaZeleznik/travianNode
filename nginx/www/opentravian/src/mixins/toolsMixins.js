export const toolsMixins = {

    data() {
        return {
           villageName: this.$store.getters.getActiveVillageName,
        };
    },

    watch: {
        '$store.getters.getActiveVillageName': function() { this.villageName = this.$store.getters.getActiveVillageName },
    },

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
        async doApiRequest(path, method, data, jsonf) {
            let response;
            console.log('http://' + process.env.VUE_APP_BASE_URL + ':8080/api/' + path);
            if (jsonf){
                response = await fetch('http://' + process.env.VUE_APP_BASE_URL + ':8080/api/' + path, {
                    method: method,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
            } else {
                response = await fetch('http://' + process.env.VUE_APP_BASE_URL + ':8080/api/' + path, { method: method, credentials: 'include' });
            }
            return response;
        },
        async getActiveVillageName(){
            this.villageName = await(await(await this.doApiRequest("villages/" + localStorage.getItem('activeVillageId'),"GET","",false)).json()).data.name;
            this.$store.commit('setActiveVillageName', this.villageName);
        },
        async getTribeFromIdVillage(idVillage){
            const villageOwner = await(await(await this.doApiRequest("villages/" + idVillage, "GET", "", false)).json()).data.owner;
            const userTribe = await(await(await this.doApiRequest("users/" + villageOwner, "GET", "", false)).json()).data.tribe;
            return userTribe;
        },
        async getUser(userId){
            return await(await(await this.doApiRequest("users/" + userId, "GET", "", false)).json()).data;
        },
        getResearchedTroops(villageBuildingType){
            for (let troop of this.troopInfoLookup[this.userTribe]){
                if (troop['buildingId'] == villageBuildingType){
                    if (troop['id'] == 1 || troop['id'] == 10) {
                        this.researchedTroops.push(troop);
                    } else if (this.researchesCompleted['troop' + troop['id']]){
                        this.researchedTroops.push(troop);
                    } 
                }
            }
        },
        async getVillageData(idVillage){
            return await(await(await this.doApiRequest("villages/" + idVillage, "GET", "", false)).json()).data;
        }
    }
}