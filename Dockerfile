# Usa una versione di Node.js (LTS consigliata)
FROM node:18

# Imposta la cartella di lavoro nel container
WORKDIR /usr/src/app

# Copia solo i file package.json e package-lock.json per installare le dipendenze
COPY package*.json ./

# Installa solo le dipendenze necessarie
RUN npm install

# Copia tutto il codice sorgente nel container
COPY . .

# Espone la porta 3000 (o quella che usi nel server)
EXPOSE 8080

# Comando per avviare l'app
CMD ["npm", "start"]
