<template>
    <div class="container text-center">
        <form class="form-group w-50 m-auto" method="POST">
            <h2 class="form-signin-heading" >Login</h2>
            <input type="text" name="username" class="form-control w-100 my-2 username-field input-lg" placeholder="Username" required autofocus>
            <input type="password" name="password" id="inputPassword" class="form-control w-100 mb-2" placeholder="Password" required>
            <button class="btn btn-lg btn-primary btn-block" type="submit">Login</button>
            <a class="btn btn-lg btn-primary btn-block" href="/register">Register</a>
        </form>
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log('Login mounted.')
        }
    }
</script>