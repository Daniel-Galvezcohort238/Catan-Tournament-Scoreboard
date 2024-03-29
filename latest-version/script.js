class Tournament {
    constructor() {
        this._playersList = [];
        this._columnsTables = [1,[]]; // the first index is which column to add the next table in, the second index is an array containing all displayed tables in order.
        this._openTable = 0;    // this is which table is displayed and has room for another player. One is displayed in the initialization, and this variable is incremented.
        this._tables = document.querySelector('.tables')
        this.addBtn = document.getElementById('add-btn');
        this.textBox = document.getElementById('add-input');
        

        this.loadEventListeners();
    }

    loadEventListeners() {
        this.addBtn.addEventListener('click', this.addPlayer.bind(this));
        this._tables.addEventListener('click', this.editPlayer.bind(this))
    }

    addPlayer() {
        if(this._columnsTables[1].length == 18 && this._columnsTables[1][this._columnsTables[1].length - 1]
            .players.length == 4) {
            alert('Tournament is full');
            return;
        }

        const newPlayer = new Player(this.textBox.value);
        newPlayer.set(this._columnsTables[0], this._columnsTables[1][this._columnsTables[1].length - 1]); 
        this._playersList.push(newPlayer);
        const openTable = this._columnsTables[1][this._columnsTables[1].length - 1];
            //this variable is initialized as the 
            //...document element with the id of the table the newly created
            //..player object was assigned

        let i = document.createElement('i');                    //creates div to print player name as well as the
        i.className = 'fa-regular fa-square-minus remove-item'; i.style.color = 'black'        // minus button(i element) to remove player if need
        i.addEventListener('mouseover', () => {
            i.className = 'fa-solid fa-square-minus remove-item';
        })
        i.addEventListener('mouseout', () => {
            i.className = 'fa-regular fa-square-minus remove-item';
        })
        let name = document.createTextNode(`${this.textBox.value}`); //^
        let playerName = document.createElement('div'); playerName.className = 'player-name'        //^
        playerName.appendChild(i);                              //^
        playerName.appendChild(name);                           //^
        
        
        let player = document.createElement('div');             //creates div to hold player and flex box it to conventional format
        player.className = 'player';                            //^
        player.appendChild(playerName);                         //^    
        let score = document.createTextNode('0');               // also creates text node to print score within player element
        player.appendChild(score);                              //^
           
        // console.log(openTableElement);
        openTable._actualTableEle.appendChild(player);                   //prints player element inside the open table
        
        
        this._columnsTables[1][this._columnsTables[1].length - 1].players.push(newPlayer);
        
        
        
        if (openTable.players.length == 4) {        
        
            if (this._openTable % 3 == 0) {
                this._columnsTables[0]++;

                if (this._columnsTables[0] >= 6) {
                } else {
                }
            }
        
            if(this._columnsTables[1].length < 18) {
                this.createTable();
            }

        }
            
        this.textBox.value = '';
        
        // console.log(playersList[playersList.length - 1]);
        
    }

    
    createTable() {
        const table = new Table(this._openTable)
        this._columnsTables[1].push(table);
        this._openTable++;
    }

    editPlayer(e) {
        if (e.target.classList.value == 'player') {
            let selectedPlayer = e.target;
            e.target.lastChild.remove();
    
    
            let newScoreInput = document.createElement('input'); newScoreInput.className = 'score-input';
            newScoreInput.style.width = '3rem'; newScoreInput.style.fontSize = '3rem'; newScoreInput.name = 'score-input'; newScoreInput.style.fontWeight = 'bold';
            let editBtn = document.createElement('button'); editBtn.className = 'fa-solid fa-pen';
            let editDiv = document.createElement('div'); editDiv.appendChild(newScoreInput); editDiv.appendChild(editBtn);
    
    
             e.target.appendChild(editDiv);
    
    
            editBtn.addEventListener('click', this.editPoints.bind(this, selectedPlayer, newScoreInput, editDiv));
    
    
        } else if (e.target.classList.value.includes('remove-item')) {
           this.removePlayer(e);
        }
    }

    editPoints(selectedPlayer, newScoreInput, editDiv) {
            let pointsToAdd = Number(newScoreInput.value);
            editDiv.remove();



            for (let i = 0; i < this._playersList.length; i++) {
                if (this._playersList[i].playerName == selectedPlayer.firstChild.lastChild.nodeValue) {
                    this._playersList[i].addPoints(pointsToAdd);


                    let score = document.createTextNode(`${this._playersList[i].playerScore}`);
                    selectedPlayer.appendChild(score);
                }
            }

            this._sortPlayers();

    }

    removePlayer(e) {
        const clickedElement = e.target;
    
        for (let i = 0 ; i < this._playersList.length; i++) {
            console.log(this._playersList[i].playerName)
            if (this._playersList[i].playerName == clickedElement.nextSibling.nodeValue) {
                console.log(this._playersList[i]);                    
                this._playersList.splice(i, 1);
                console.log(this._playersList);
            }                
        }

        const tableList = this._columnsTables[1];
        for (let i = 0; i < tableList.length; i++) {
            for (let j = 0; j < tableList[i].players.length; j++) {
                if (tableList[i].players[j].playerName == clickedElement.nextSibling.nodeValue) {   //not working
                    tableList[i].players.splice(j, 1);
                    break;
                }
            }
        }

        console.log(clickedElement.parentElement.parentElement);
        clickedElement.parentElement.parentElement.remove();

        

    }

    _sortPlayers() {
        //Sorting Player List
        const newPlayersList = [];

        for (let j = 0; j < this._playersList.length; j++ ) {



            let biggest = this._playersList[0]
            let index = 0;
    
            for (let i = 0; i < this._playersList.length; i++) {
                if (this._playersList[i].playerScore > biggest.playerScore) {
                    biggest = this._playersList[i];
                    index = i;
                }
            }

            newPlayersList.push(biggest);

            this._playersList.splice(index, 1);
            j--;
        }

        this._playersList = newPlayersList;

        //Displaying Players
        
        for (let j = 1; j <= 6; j++) {
            for (let t = document.getElementById(`column${j}`).childNodes.length; t > 1; t--) {
                document.getElementById(`column${j}`).lastChild.remove();
            }
        }
        this._openTable = 0;
        this._columnsTables[1] = [];
        this._columnsTables[0] = 1;
        this.createTable();

        for (let j = 0; j < this._playersList.length; j++) {
            const openTable = this._columnsTables[1][this._columnsTables[1].length - 1];
            const nextPlayer = this._playersList[j]
            this._columnsTables[1][this._columnsTables[1].length - 1].players.push(nextPlayer);



            let i = document.createElement('i');                    //creates div to print player name as well as the
            i.className = 'fa-regular fa-square-minus remove-item'; i.style.color = 'black';         // x button(i element) to remove player if need
            i.addEventListener('mouseover', () => {
                i.className = 'fa-solid fa-square-minus remove-item';
            })
            i.addEventListener('mouseout', () => {
                i.className = 'fa-regular fa-square-minus remove-item';
            })
            let name = document.createTextNode(`${nextPlayer.playerName}`); //^
            let playerName = document.createElement('div');         //^
            playerName.appendChild(i);                              //^
            playerName.appendChild(name);                           //^
            
            
            let player = document.createElement('div');             //creates div to hold player and flex box it to conventional format
            player.className = 'player';                            //^
            player.appendChild(playerName);                         //^    
            let score = document.createTextNode(`${nextPlayer.playerScore}`);               // also creates text node to print score within player element
            player.appendChild(score);                              //^
               
            // console.log(openTableElement);
            openTable._actualTableEle.appendChild(player);                   //prints player element inside the open table
            
            if (openTable.players.length == 4) {        
        
                if (this._openTable % 3 == 0) {
                    this._columnsTables[0]++;
                }
            
                if(this._columnsTables[1].length < 18) {
                    this.createTable();
                }
    
            }
                
        }
    }
}





class Player {
    constructor (name) {
        this.playerName = name;
        this.playerScore = 0;
    }


    addPoints (newPoints) {
        this.playerScore += newPoints;
    }


    set (column, table) {
        this.column = column;
        this.table = table;
    }
}






class Table {
    constructor(tableNumber) {
        this.tableNumber = tableNumber;
        this.players = [];
        this._maxPlayers = 4;
        this._actualTableEle;

        this.displayTable();
    }

    displayTable() {
        let tableNumber = document.createTextNode(`table ${tournament._openTable + 1}`)
        let tableName = document.createElement('div'); tableName.className = 'table-name'; 
        tableName.appendChild(tableNumber);
        this._actualTableEle = document.createElement('div'); this._actualTableEle.className = 'actual-table';
        let gameTableEle = document.createElement('div'); gameTableEle.className = 'game-table'; 
        gameTableEle.id = `table${tournament._columnsTables[1]}`; gameTableEle.appendChild(tableName); 
        gameTableEle.appendChild(this._actualTableEle);
    
        document.getElementById(`column${tournament._columnsTables[0]}`).appendChild(gameTableEle);
        
        tableName.addEventListener('click', this.editTable.bind(this));
    }

    editTable() {
        if(this._maxPlayers == 4) {
            this._actualTableEle.style.height = '30rem'
            this._maxPlayers = 6;
        } else {
            this._actualTableEle.style.height = '21.5rem'
            this._maxPlayers = 4;
        }

        this.alignTables();

            

    }

    alignTables() {
        let row1HasExpansion = false;
        let row2HasExpansion = false;
        let row3HasExpansion = false;

        for (let i = 1; i <= tournament._columnsTables[0]; i++) {
            if(tournament._columnsTables[1][0 + ((i - 1) * 3)]._maxPlayers == 6) {
                row1HasExpansion = true;
            }

            if (i == tournament._columnsTables[0] && tournament._openTable % 3 == 2 
                && tournament._columnsTables[1][tournament._columnsTables[1].length - 1]._maxPlayers == 6) {
                    row2HasExpansion = true;
                } else if (tournament._columnsTables[1][1 + ((i - 1) * 3)]._maxPlayers == 6) {
                    row2HasExpansion = true;
                }

                console.log(tournament._columnsTables[1][tournament._columnsTables[1].length - 1]);
            if (i == tournament._columnsTables[0] && tournament._openTable % 3 == 0 
                && tournament._columnsTables[1][tournament._columnsTables[1].length - 1]._maxPlayers == 6) {
                    row3HasExpansion = true;
                } else if (tournament._columnsTables[1][2 + ((i - 1) * 3)]._maxPlayers == 6) {
                    row3HasExpansion = true;
                }
        }

        if (row1HasExpansion) {
            for (let i = 1; i <= tournament._columnsTables[0]; i++) {
                tournament._columnsTables[1][0 + ((i - 1) * 3)]._actualTableEle.style.height = '30rem'
            }
        }

        if (row2HasExpansion) {
            for (let i = 1; i <= tournament._columnsTables[0]; i++) {
                tournament._columnsTables[1][1 + ((i - 1) * 3)]._actualTableEle.style.height = '30rem'
            }
        }
        
        if (row3HasExpansion) {
            for (let i = 1; i <= tournament._columnsTables[0]; i++) {
                tournament._columnsTables[1][2 + ((i - 1) * 3)]._actualTableEle.style.height = '30rem'
            }
        }

    }
}

const tournament = new Tournament(); tournament.createTable()

// Timer Functionality~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class Timer {
    constructor() {
        this.startBtn = document.getElementById('start');
        this.timer = document.getElementById('timer');
        this._timeHour = 1;     //hour variable to print in the hours place of the timer
        this._timeMinute = 0;   //minutes variable to print in the minutes place of the timer
        this._timeSecond = 0;   //seconds variable to print in the seconds place of the timer
        this.timeInterval;      //this variable needs to be global scope so it can be both set
                                //...and cleared in either case of the startTimer if statement

        this.loadEventListeners();
    }

    loadEventListeners() {
        this.startBtn.addEventListener('click', this.startTimer.bind(this));

        this.startBtn.addEventListener('mousedown', this._startBtnInset.bind(this));

        this.startBtn.addEventListener('mouseup', this._startBtnOutset.bind(this));
    }

    startTimer() {
        this.timer.style.backgroundColor = 'rgba(156, 24, 24, 0.36)';
        this.timer.style.color = '#ffea48';


        if (this._timeHour < 1) {          
            this._timeHour = 1; this._timeMinute = 0; this._timeSecond = 0;               // reset timer variables
            this.timer.innerText = 'Time: 1:00:00';                          // reset timer html text
            this.timer.style.backgroundColor = 'rgba(156, 24, 24, 0.26)';  // reset timer styles
            this.timer.style.color = '#ffea48a6';                            // reset timer styles
            clearInterval(this.timeInterval);                                // reset timer
        } else {                                                        // else
            this.timeInterval = setInterval(this._timeInterval.bind(this), 1000);
        }
    }

    _timeInterval() {
        if (this._timeSecond == 0 && this._timeMinute == 0 && this._timeHour == 0) {      //if timer reaches 0, reset timer
            this._timeHour = 1; this._timeMinute = 0; this._timeSecond = 0;
            this.timer.innerText = 'Time: 1:00:00';
            this.timer.style.backgroundColor = 'rgba(156, 24, 24, 0.26)';
            this.timer.style.color = '#ffea48a6';
            clearInterval(this.timeInterval);
        } else if (this._timeHour == 1) {                                     // if timer barely starts subtract 1 second
            this._timeHour = 0; this._timeMinute = 59; this._timeSecond = 59;
            this.timer.innerText = `Time: 0:${this._timeMinute}:${this._timeSecond}`;
        } else if (this._timeSecond == 0) {          
                                     // if 60 seconds pass, decrement minutes by 1
            this._timeMinute --; this._timeSecond = 59;
            this.timer.innerText = `Time: 0:${this._timeMinute}:${this._timeSecond}`;
        } else {               
            this._timeSecond --;
            this.timer.innerText = `Time: 0:${this._timeMinute}:${this._timeSecond}`;
        }
    }

    _startBtnInset() {
        this.startBtn.style.borderStyle = 'inset';
    }

    _startBtnOutset() {
        this.startBtn.style.borderStyle = 'outset';
    }
}

const timer = new Timer();
