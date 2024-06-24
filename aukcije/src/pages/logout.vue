<template>
    <div class="logout-container">
      <q-card class="q-pa-md q-gutter-md" bordered>
        <q-card-section>
          <div class="text-h6 text-center">Odjavljeni ste.</div>
        </q-card-section>
        <q-card-section class="text-center">
          <q-btn label="Povratak na početnu" color="primary" @click="goToHome" />
        </q-card-section>
      </q-card>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      goToHome() {
        this.$router.push('/');
      }
    }
  }
  </script>
  
  <style scoped>
  .logout-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
  }
  </style>