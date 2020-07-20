<template>
  <section>
      <h1>Login</h1>
      <div v-if="this.errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            v-model="user.username"
            type="text"
            class="form-control"
            id="username"
            aria-describedby="usernameHelp"
            placeholder="Enter username" required>
            <small id="usernameHelp" class="form-text text-muted">
              Enter username:
            </small>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="user.password"
            type="password"
            class="form-control"
            id="password"
            aria-describedby="passwordHelp"
            placeholder="Enter password" required>
            <small id="passwordHelp" class="form-text text-muted">
              Enter password:
            </small>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
  </section>
</template>

<script>
import Joi from '@hapi/joi';

const LOGIN_URL = 'http://localhost:5000/auth/login';
const schema = Joi.object({
  username: Joi.string()
    .regex(/^[A-Za-z0-9_]+$/)
    .min(6)
    .max(20)
    .required(),
  password: Joi.string().trim().min(6).required(),
});

export default {
  data: () => ({
    errorMessage: '',
    user: {
      username: '',
      password: '',
    },
  }),
  methods: {
    login() {
      this.errorMessage = '';
      if (this.validUser()) {
        const body = {
          username: this.user.username,
          password: this.user.password,
        };
        fetch(LOGIN_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(body),
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }).then((result) => {
          localStorage.token = result.token;
          setTimeout(() => {
            this.$router.push('/dashboard');
          }, 1000);
        }).catch((error) => {
          this.errorMessage = error.message;
        });
      }
    },
    validUser() {
      const result = schema.validate(this.user);
      if (result.error === undefined) {
        return true;
      }
      this.errorMessage = 'Unable to log in.';
      return false;
    },
  },
};

</script>

<style scoped>

</style>
