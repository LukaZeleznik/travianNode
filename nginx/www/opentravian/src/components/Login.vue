<template>
    <div class="container text-center">
        <form class="form-group w-50 m-auto" id="loginForm" action="#" onsubmit="return false">
            <h2 class="form-signin-heading" >Login</h2>
            <input type="email" id="inputEmail" name="email" class="form-control w-100 my-2 username-field input-lg" placeholder="test@test.com" required autofocus>
            <input type="password" id="inputPassword" name="password" class="form-control w-100 mb-2" placeholder="Password" required>
            <button class="btn btn-lg btn-primary btn-block" v-on:click="login()">Login</button>
            <router-link class="btn btn-lg btn-primary btn-block" :to="{ name: 'register' }">Register</router-link>
        </form>
        
    </div>
</template>

<script>
 
import { toolsMixins } from '@/mixins/toolsMixins' 
import { fetchMixins } from '@/mixins/fetchMixins' 

    export default {
        data() {
            return {
            }
        },

        mixins: [toolsMixins,fetchMixins],

        created(){
            this.checkIfLoggedIn(true);
        },

        methods: {
            async login() {
                let inputEmail  = document.querySelector('#inputEmail').value;
                let inputPassword  = document.querySelector('#inputPassword').value;

                if(!inputEmail || !inputPassword) return;

                let loginApiUrl = 'http://' + process.env.VUE_APP_BASE_URL + ':8080/api/' + "login?email=" + inputEmail + "&password=" + inputPassword;

                let response = await(await(await fetch(loginApiUrl,{method: "POST", credentials: 'include'})).json());

                if(response.token && response.capital){
                    document.cookie = "jwt=" + response.token + ";path=/";
                    document.cookie = "userId=" + response.userId + ";path=/";
                    
                    localStorage.setItem('activeVillageId', response.capital);
                    localStorage.setItem('userTribe', response.userTribe);

                    this.$store.commit('setActiveVillageId', response.capital);
                    this.$store.commit('setUserTribe', response.userTribe);
                    this.loadMethods();
                    this.$router.push({ name: 'resources' });
                }
            },
            loadMethods() {
                this.fetchReportNotifications();
            }
        }
    }

</script>
