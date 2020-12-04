<template>
    <div class="container text-center">
        <form class="form-group w-50 m-auto" id="loginForm" action="#" onsubmit="return false">
            <h2 class="form-signin-heading" >Login</h2>
            <input type="text" id="inputEmail" name="username" class="form-control w-100 my-2 username-field input-lg" placeholder="test@test.com" required autofocus>
            <input type="password" id="inputPassword" name="password" class="form-control w-100 mb-2" placeholder="Password" required>
            <button class="btn btn-lg btn-primary btn-block" v-on:click="login()">Login</button>
            <a class="btn btn-lg btn-primary btn-block" href="/register">Register</a>
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

        methods: {
            async login() {
                let inputEmail  = document.querySelector('#inputEmail').value;
                let inputPassword  = document.querySelector('#inputPassword').value;
                let loginApiUrl = 'http://localhost/api/' + "login?email=" + inputEmail + "&password=" + inputPassword;

                let token = await(await(await fetch(loginApiUrl,{method: "POST"})).json()).token;
                console.log("token:", token);

                document.cookie = "jwt=" + token + ";path=/";
            }
        }
    }

</script>
