// Importajte Axios ili drugu biblioteku za slanje HTTP zahtjeva
import axios from 'axios';

// Definirajte funkciju za registraciju korisnika
async function registracija(ime, prezime, email, lozinka, adresa) {
  try {
    // Slanje HTTP zahtjeva na backend API za registraciju korisnika
    const response = await axios.post('/api/registracija', {
      ime: ime,
      prezime: prezime,
      email: email,
      lozinka: lozinka,
      adresa: adresa // Dodano polje adresa
    });

    // Ovdje možete dodati logiku za obradu odgovora ako je registracija uspješna
    console.log('Registracija uspješna:', response.data);
    return response.data; // Možete vratiti podatke o registriranom korisniku ili neki drugi odgovor ako je potrebno
  } catch (error) {
    // Ovdje možete dodati logiku za obradu grešaka tijekom registracije
    console.error('Greška prilikom registracije:', error);
    throw error; // Možete proslijediti grešku radi daljnje obrade u komponenti koja poziva funkciju registracija()
  }
}

// Izvoz funkcije registracije kako bi bila dostupna drugim dijelovima vaše aplikacije
export default registracija;

