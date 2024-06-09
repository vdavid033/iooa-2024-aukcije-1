Projekt iz kolegija IOOA. 
•	Za postaviti aplikaciju na računalo korisnika potrebno je:

-Instalirati Visual Studio Code
-Instalirati GitBash
-Clonirati aplikaciju u folder iz repozitorija, te brancha Produkcija putem linka: 
https://github.com/vdavid033/iooa-2024-aukcije-1.git 
-Najprije kroz gitbash navigirati cd iooa-2024-aukcije-1/
-Potom cd aukcije-server
-U aukcije-server pokrenuti npm install
-Instalirati sve potrebne pakete: 
├── axios@1.6.8
├── bcrypt@5.1.1
├── body-parser@1.20.2
├── cors@2.8.5
├── express-session@1.18.0
├── express@4.19.2
├── jsonwebtoken@9.0.2
├── multer@1.4.5-lts.1
└── mysql@2.18.1
-Pokrenuti server komandom node index.js
-Nakon pokretanja servera ponoviti postupak u novom gitbash terminalu cd iooa-2024-aukcije-1/
-Potom navigirati u front dio sa komandom cd aukcije
-Zatim instalirati sve potrebne pakete:
├── @babel/eslint-parser@7.21.3
├── @quasar/app-webpack@3.12.8
├── @quasar/extras@1.16.1
├── axios@1.6.8
├── body-parser@1.20.2
├── browser-image-compression@2.0.2
├── console@0.7.2
├── core-js@3.29.1
├── cors@2.8.5
├── eslint-config-prettier@8.8.0
├── eslint-plugin-vue@9.10.0
├── eslint-webpack-plugin@3.2.0
├── eslint@8.37.0
├── express@4.19.2
├── jwt-decode@4.0.0
├── mysql@2.18.1
├── prettier@2.8.7
├── quasar@2.15.4
├── vue-axios@3.5.2
├── vue-router@4.1.6
└── vue@3.2.47
-Na kraju treba pokrenuti komandu quasar dev i tada se web aplikacija pokreće. 
