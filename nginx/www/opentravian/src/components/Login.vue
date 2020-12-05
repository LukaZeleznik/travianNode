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
import { apiRequestMixins } from '@/mixins/apiRequestMixins' 
    export default {
        data() {
            return {
            }
        },

        mixins: [apiRequestMixins],

        created(){
            this.checkIfLoggedIn()
        },

        methods: {
            async login() {
                let inputEmail  = document.querySelector('#inputEmail').value;
                let inputPassword  = document.querySelector('#inputPassword').value;

                if(!inputEmail || !inputPassword) return;

                let loginApiUrl = 'http://localhost:8080/api/' + "login?email=" + inputEmail + "&password=" + inputPassword;

                let token = await(await(await fetch(loginApiUrl,{method: "POST"})).json()).token;
                if(token){
                    document.cookie = "jwt=" + token + ";path=/";
                    this.$router.push({ name: 'resources' });
                }
            },
            checkIfLoggedIn(){
                if(this.getCookie("jwt")){
                    this.$router.push({ name: 'resources' });
                }
            },
            getCookie(name) {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
            }
        }
    }

</script>
