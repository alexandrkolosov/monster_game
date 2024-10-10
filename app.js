function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
    data() {
        return {
          playerHealth: 100,
          monsterHealth: 100,
          logMessages: [],
          currentRound: 0,
            winner: null
        };
    },
    computed: {
        monsterBarStyle() {
            if (this.monsterHealth < 0) {
                return {width: '0%'};
            }
            return { width: this.monsterHealth + '%'};
        },
        playerBarStyle() {
            if (this.playerHealth < 0) {
                return {width: '0%'};
            }
            return { width: this.playerHealth + '%' };
        },
        mayUseSpecialAttack() {
            return this.currentRound % 3 !== 0;
        },
        mayUseHealing() {
            return this.currentRound % 4 !== 0;
        }
    },

    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                // A draw
                this.winner = 'draw';
            } else if (value <= 0) {
                //Player lost
                this.winner = 'monster';
            }
        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                // A draw
                this.winner = 'draw';
            } else if (value <= 0) {
                // Monster lost
                this.winner = 'player';
            }
        }
    },

    methods: {
        attackMonster() {
            this.currentRound++;
            const attackValue = getRandomValue(5, 12);
            this.monsterHealth = this.monsterHealth - attackValue;
            this.addLogMessage('player', 'attack', attackValue);
            this.attackPlayer();
        },

        restartGame() {
          this.monsterHealth = 100;
          this.playerHealth = 100;
          this.currentRound = 0;
          this.winner = null;
          this.logMessages = [];
        },

        attackPlayer() {
            const attackValue = getRandomValue(8, 20);
            this.playerHealth = this.playerHealth - attackValue;
            this.addLogMessage('monster', 'attack', attackValue);
        },
      specialAttack() {
          this.currentRound++;
          const attackValue = getRandomValue(1, 50);
          this.monsterHealth = this.monsterHealth - attackValue;
          this.addLogMessage('monster', 'special-attack', attackValue)
          this.attackPlayer();
      },
      surrender(){
          this.winner = 'monster';
      },
        healPlayer() {
            this.currentRound++;
            const healValue = getRandomValue(20, 30);
            if (this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth = this.playerHealth + healValue;
            }
            this.addLogMessage('player', 'heal', healValue);
        },
        addLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            })
        }
    },
});

app.mount('#game');