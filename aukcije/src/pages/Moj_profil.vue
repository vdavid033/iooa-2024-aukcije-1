<template>
  <div>
    <q-card :expand="false"></q-card>
    <!-- podaci o korisniku -->
    <div class="user-info">
      <div class="user-info-header">
        <div class="row">
          <h5 ref="h_korisnik" class="text-h3 text-blue q-my-md">Korisnik {{ korisnik_trenutno.ime_korisnika }} {{
            korisnik_trenutno.prezime_korisnika }}</h5>
        </div>
        <div>
          <p>Trenutno ime: {{ korisnik_trenutno.ime_korisnika }}</p>
          <p>Trenutno prezime: {{ korisnik_trenutno.prezime_korisnika }}</p>
          <p>Trenutni email: {{ korisnik_trenutno.email }}</p>
          <p>Trenutna adresa: {{ korisnik_trenutno.adresa_korisnika }}</p>
        </div>
       
      </div>
      <div class="user-info-image">
        <img src="~assets\profilna.png" alt="Profilna slika">
      </div>
    </div>
   

 <!-- Moje aukcije -->
 <h3>Vaši predmeti na aukciji</h3>
<p ref="nema_predmete"></p>
<div class="q-pa-sm row flex flex-center">
  <div v-for="predmet in vlastitiPredmeti" :key="predmet.id_predmeta" class="q-pa-md" style="width: 400px">
    <q-card>
      <q-item-section @click="pregledPredmeta(predmet.id_predmeta)">
        <q-img v-if="predmet.slika" :src="predmet.slika" no-native-menu />
        <q-item class="q-pa-sm text-bold text-blue-7">{{ predmet.naziv_predmeta }}</q-item>
        <q-item>Početna cijena: {{ predmet.pocetna_cijena }}$</q-item>
        <q-item>Vrijeme pocetka: {{ formattedDate(predmet.vrijeme_pocetka) }}</q-item>
        <q-item>Vrijeme zavrsetka: {{ formattedDate(predmet.vrijeme_zavrsetka) }}</q-item>
        <q-item>Preostalo vrijeme aukcije: {{ predmet.preostalo_vrijeme }} h</q-item>
        <q-item>Trenutna cijena: {{ predmet.trenutna_cijena }}$</q-item>
      </q-item-section>
      <q-separator dark />
      <q-card-actions>
        
      </q-card-actions>
    </q-card>
  </div>
</div>

    
  </div>
</template>

<style scoped>
.user-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #fefdff;
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
}

.user-info-header {
  margin-bottom: 20px;
}

.user-info-header h2 {
  font-size: 24px;
  margin-bottom: 5px;
}

.user-info-header p {
  font-size: 16px;
  margin-bottom: 5px;
}

.user-info-image img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 300px;
  height: 400px;
  margin: 10px;
  border-radius: 15px;
  border: 1px solid #ccc;
  overflow: hidden;
  transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
  cursor: pointer;
}
</style>


<script>
import axios from "axios";

export default {
  data() {
    return {
      currentUser: {}, // Korisnički podaci
      userBids: [], // Predmeti na koje je korisnik postavio bid
      korisnik_trenutno: {
        ime_korisnika: "",
        prezime_korisnika: "",
        email_korisnika: "",
        adresa_korisnika: ""
      },
      vlastitiPredmeti: [],
    }
  },

  async mounted() {
  try {
    const token = localStorage.getItem("token");
    const userId = this.getUserIdFromToken(token);
    const userData = await this.fetchUserData(userId);
    this.korisnik_trenutno = userData;
    const headers = { Authorization: `Bearer ${token}` };
    await this.dohvatPredmeta(userId, headers);
  } catch (error) {
    console.error("Greška kod dohvaćanja vlastitih predmeta:", error);
  }
},


  methods: {
    async dohvatPredmeta(userId, headers) {
  try {
    const response = await axios.get(`http://localhost:3000/api/user-auctions`, { headers });

    if (response.data.length === 0) {
      this.$refs.nema_predmete.textContent = "Nemate niti jedan predmet koji je ili je bio na aukciji!";
    } else {
      this.vlastitiPredmeti = response.data;
    }
  } catch (error) {
    console.error("Error fetching user auctions:", error);
  }
},

  getUserIdFromToken(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload).id;
  },


    formattedDate(dateString) {
      return new Date(dateString).toLocaleString("hr-HR").replace(",", "");
    },
    pregledPredmeta(id_predmeta) {
      this.$router.push({ path: "prikaz", query: { id_predmeta } });
    },
    izmijeniPredmet(id_predmeta) {

    },
    async obrisiPredmet(id_predmeta) { //bilo bi dobro imat uvjet da se ne mogu brisat izvedene ili aukcije u tijeku
      const token = localStorage.getItem("token");
      const userId = this.getUserIdFromToken(token);
      const headers = { Authorization: `Bearer ${token}` };
      if (window.confirm('Jeste li sigurni da želite obrisati predmet?')) {
        try {
          const response = await axios.delete("http://localhost:3000/api/brisanjePredmeta/" + id_predmeta, { headers });

          this.$q.notify({
            color: "positive",
            position: "top",
            message: "Brisanje podataka uspješno!",
          });

          this.dohvatPredmeta(userId, headers);
        } catch (error) {
          console.log("Greška pri brisanju predmeta: " + error);
        }
      }
    },
    editBid(bid) {
      // Funkcija za uređivanje bid-a na aukciji
    },
    deleteBid(bid) {
      // Funkcija za brisanje bid-a na aukciji
    },

    async fetchUserData(userId) {
      try {
        const response = await axios.get(`http://localhost:3000/api/korisnikinfo1/${userId}`);
        return response.data[0];
      } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
      }
    }
  }
}

</script>

<style>

/* Stilizacija podataka o korisniku */


.user-info-header {
  flex: 1;
  margin-right: 20px;
}

.user-info-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info-image img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
}

/* Stilizacija kartica */
.predmet-card {
  width: 300px;
  margin: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}

.predmet-card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.3);
}

.predmet-image {
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

/* Stilizacija za sekcije */
.section-title {
  margin-top: 20px;
  font-size: 24px;
  color: #1976d2;
  text-align: center;
  
}
/* Grupiranje kartica */
.card-group {
  display: flex;
  justify-content: center;
}

.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.card-title {
  font-size: 20px;
}

.card-description {
  font-size: 16px;
}

.card-actions {
  text-align: center;
}
</style>

