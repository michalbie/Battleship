var turn = -1  //-1 - player's turn, 1 - computer's turn
var enemys_board_shots = []
var players_board_shots = []
var player_hits = 0
var enemy_hits = 0
var shot_func
var game_active = false
var first_moves = true


function start_game(){
    prepareEnemyBoard()
    alert("Ruch gracza")
}

function prepareEnemyBoard(){

    function scanIfAlreadyTried(x, y){
        for(let i=0; i<enemys_board_shots.length; i++){
            if(enemys_board_shots[i][0] == x && enemys_board_shots[i][1] == y) return true
        }
        return false
    }

    function setEnemyBoardListeners(){
        for(let i=0; i<10; i++){
            for(let j=0; j<10; j++){
                //console.log("i: " + i + ", j: " + j + " includes: " + scanIfAlreadyTried(i, j))
                if(!scanIfAlreadyTried(i, j)){
                    enemy_cells_divs[i][j].addEventListener("click", shot_func = function(){
                        if(game_active == true){
                            shot(i, j, enemy_cells_divs)
                            enemy_cells_divs[i][j].removeEventListener("click", arguments.callee)
                            removeEnemyBoardListeners()
                            setTimeout(enemyShot, 1000)
                        } 
                    })
                }
            }
        }
    }
    
    function removeEnemyBoardListeners(){ //basically cloning whole board (to remove all listeners at once)
        var old_element = enemy_board
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
        enemy_board = document.getElementById("enemy_board")

        let enemy_board_children = enemy_board.querySelectorAll(".cell")
        let iterator = 0
        for(let i=0; i<10; i++){
            for(let j=0; j<10; j++){
                enemy_cells_divs[i][j] = enemy_board_children[iterator]
                iterator += 1
            }
        }
    }

    setEnemyBoardListeners()
    game_active = true
}

function shot(x, y, board_cells){
    let img = document.createElement("img")
    console.log("shot")

    switch(board_cells){
        case enemy_cells_divs:
            if(enemy_cells[x+1][y+1] == 1){
                img.src = "assets/hit.png"
                enemy_cells_divs[x][y].appendChild(img)
                enemys_board_shots.push([x, y])
                player_hits += 1
            }
            else{
                img.src = "assets/miss.png"
                enemy_cells_divs[x][y].appendChild(img)
                enemys_board_shots.push([x, y])
            }
            turn = 1
            break;
        
        case player_cells_divs:
            if(player_cells[x+1][y+1] == 1){
                img.src = "assets/hit.png"
                player_cells_divs[x][y].appendChild(img)
                players_board_shots.push([x, y])
                enemy_hits += 1
            }
            else{
                img.src = "assets/miss.png"
                player_cells_divs[x][y].appendChild(img)
                players_board_shots.push([x, y])
            }
            turn = -1
            prepareEnemyBoard()
            break;
    }

    checkWinConditions()
}

function enemyShot(){
    if(first_moves) alert("Ruch komputera")
    first_moves = false

    if(game_active){
        let found_free = false
        while(!found_free){
            var random_cords = [(Math.round(Math.random() * 9) + 1), (Math.round(Math.random() * 9) + 1)] //1-10
            console.log(random_cords)
            if(player_cells_divs[random_cords[0]-1][random_cords[1]-1].childElementCount == 0){
                shot(random_cords[0]-1, random_cords[1]-1, player_cells_divs)
                found_free = true
            }
        }

    }  
}

function checkWinConditions(){
    if(player_hits == 20 && game_active == true){
        let is_rematch = confirm("Wygrałeś! Kliknij OK celem rewanżu")
        game_active = false
        if(is_rematch) location.reload()
    }

    else if(enemy_hits == 20 && game_active == true){
        let is_rematch = confirm("Przegrałeś! Kliknij OK celem rewanżu")
        game_active = false
        if(is_rematch) location.reload()
    }
}