<template>
  <section>
      <h1>Signup</h1>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
      </div>
      <form @submit.prevent="signup">
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
              Username must be 6-20 characters consisting of letters, numbers, and underscores.
          </small>
          </div>
          <div class="form-row">
              <div class="form-group col-md-6">
                  <label for="password">Password</label>
                  <input
                      v-model="user.password"
                      type="password"
                      class="form-control"
                      id="password"
                      aria-describedby="passwordHelp"
                      placeholder="Password" required>
                  <small id="passwordHelp" class="form-text text-muted">
                      Password must be 6 or more characters long.
                  </small>
              </div>
              <div class="form-group col-md-6">
                  <label for="confirmPassword">Confirm Password</label>
                  <input
                      v-model="user.confirmPassword"
                      type="password"
                      class="form-control"
                      id="confirmPassword"
                      aria-describedby="confirmPasswordHelp"
                      placeholder="Confirm Password" required>
                  <small id="confirmPasswordHelp" class="form-text text-muted">
                      Password must be 6 or more characters long.
                  </small>
              </div>
          </div>
      <button type="submit" class="btn btn-primary">Sign up</button>
      </form>
  </section>
</template>

<script>
import Joi from '@hapi/joi';

const SIGNUP_URL = 'http://localhost:5000/auth/signup';

const schema = Joi.object({
  username: Joi.string()
    .regex(/^[A-Za-z0-9_]+$/)
    .min(6)
    .max(20)
    .required(),
  password: Joi.string().trim().min(6).required(),
  confirmPassword: Joi.string().trim().min(6).required(),
});

export default {
  data: () => ({
    errorMessage: '',
    user: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  methods: {
    signup() {
      if (this.validUser()) {
        const body = {
          username: this.user.username,
          password: this.user.password,
        };

        fetch(SIGNUP_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }).then((result) => {
          localStorage.token = result.token;
          this.$router.push('/dashboard');
        }).catch((error) => {
          this.errorMessage = error.message;
        });
      }
    },
    validUser() {
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return false;
      }
      const result = schema.validate(this.user);
      if (result.error === undefined) {
        return true;
      }
      if (result.error.message.includes('username')) {
        this.errorMessage = 'The given username is invalid. 🐶';
      } else {
        this.errorMessage = 'The given password is invalid. 🦊';
      }
      return false;
    },
  },
};
</script>
