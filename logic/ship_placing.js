var chosen = null
var all_ships = null
var ship_orientation = 0  //0 - horizontal, 1 - vertical


function checkShipAvailability(x, y, size, orientation, board_cells){

    function scanHorziontally(){
        for(let r=0; r<parseInt(size)+2; r++){
            for(let c=0; c<3; c++){
                if((x + r-1) <= 11 && (y + c-1) <= 11){
                    //console.log("for x: " + (x + r - 1) + ", y: " + (y + c -1) + ", output: " + board_cells[x + r-1][y + c-1])
                    if(board_cells[x + r-1][y + c-1] != 0) return false   
                }
                else return false
            }
        }
        return true
    }

    function scanVertically(){
        for(let r=0; r<3; r++){
            for(let c=0; c<parseInt(size)+2; c++){
                if((x + r-1) <= 11 && (y + c-1) <= 11){
                    if(board_cells[x + r-1][y + c-1] != 0) return false
                }
                else return false
            }
        }
        return true
    }

    if(board_cells[x][y] == 0){
        var can_place
        switch(orientation){
            case 0:
                if(board_cells == player_cells){
                    let out_board = (x + size -1) - 10
                    if(out_board > 0) x = x - out_board
                }
                can_place = scanHorziontally()
                break;

            case 1:
                if(board_cells == player_cells){
                    let out_board = (y + size -1) - 10
                    if(out_board > 0) y = y - out_board
                }
                can_place = scanVertically()
                break;
        }
        if(can_place) return true
        else return false
    }
}

function chooseShip(index){
    while(all_ships[index].parentNode == null && index < all_ships.length-1)
        index += 1

    function unselectShip(){
        let previous_ship = chosen
        let cells = previous_ship.querySelectorAll(".cell")
        for(cell of cells){
            cell.style.backgroundColor = "white"
        }
    }

    function selectShip(){
        let cells = all_ships[index].querySelectorAll(".cell")
        for(cell of cells){
            cell.style.backgroundColor = "blue"
        }
        chosen = all_ships[index]
    }

    if(chosen != null){
        unselectShip()
    }
    selectShip()
}

function showPlacingAvailability(x, y, size, orientation, can_place){
    let out_board = 0
    switch(orientation){
        case 0:
            out_board = (x + size -1) - 9
            if(out_board > 0) x = x - out_board

            for(let i=x; i<parseInt(x) + parseInt(size); i++){
                if(i<=9){
                    if(can_place) player_cells_divs[i][y].style.backgroundColor = "green"
                    else player_cells_divs[i][y].style.backgroundColor = "red"
                }
                else{
                    if(can_place) player_cells_divs[i][y].style.backgroundColor = "green"
                    else player_cells_divs[i][y].style.backgroundColor = "red"
                }
            }
            break;

        case 1:
            out_board = (y + size -1) - 9
            if(out_board > 0) y = y - out_board

            for(let i=y; i<parseInt(y) + parseInt(size); i++){
                if(i<=9){
                    if(can_place) player_cells_divs[x][i].style.backgroundColor = "green"
                    else player_cells_divs[x][i].style.backgroundColor = "red"
                }
                else{
                    if(can_place) player_cells_divs[x][i].style.backgroundColor = "green"
                    else player_cells_divs[x][i].style.backgroundColor = "red"
                }
            }
            break;
                
    }
}

function hidePlacingAvailability(x, y, size, orientation){
    let out_board
    switch(orientation){
        case 0:
            out_board = (x + size - 1) - 9
            if(out_board > 0) x = x - out_board

            for(let i=x; i<parseInt(x) + parseInt(size); i++){
                if(player_cells[i+1][y+1] == 0) player_cells_divs[i][y].style.backgroundColor = "white"
                else player_cells_divs[i][y].style.backgroundColor = "blue"
            }
            break;

        case 1:
            out_board = (y + size - 1) - 9
            if(out_board > 0) y = y - out_board

            for(let i=y; i<parseInt(y) + parseInt(size); i++){
                if(player_cells[x+1][i+1] == 0) player_cells_divs[x][i].style.backgroundColor = "white"
                else player_cells_divs[x][i].style.backgroundColor = "blue"
            }
            break;
    }
}


function placeShip(x, y){
    let out_board
    let size = chosen.childElementCount
    switch(ship_orientation){
        case 0:
            out_board = (x + size - 1) - 9
            if(out_board > 0) x = x - out_board

            for(let i=x; i<parseInt(x) + parseInt(size); i++){
                player_cells_divs[i][y].style.backgroundColor = "blue"
                player_cells[i+1][y+1] = 1
            }
            break;

        case 1:
            out_board = (y + size - 1) - 9
            if(out_board > 0) y = y - out_board

            for(let i=y; i<parseInt(y) + parseInt(size); i++){
                player_cells_divs[x][i].style.backgroundColor = "blue"
                player_cells[x+1][i+1] = 1
            }
            break;
    }
    
    for(let i=0; i<all_ships.length; i++){
        if(all_ships[i] == chosen){
            all_ships[i].remove()
        }
    }
    chosen.remove()

    if(document.getElementById("choose_container").childElementCount > 0) chooseShip(0)

    else {
        chosen = null
        document.getElementById("play_button").style.visibility = "visible"
    }
}



//Generate random ships' positions for enemy (COMPUTER)
function generateEnemyShips(){
    
    function getRandomPosition(){
        let cords = [Math.round(Math.random() * 9) + 1, Math.round(Math.random() * 9) + 1] //1 - 10
        return cords
    }

    function getRandomOrientation(){
        let orientation = Math.round(Math.random()) //0 - horizontal, 1 - vertical
        return orientation
    }

    
    //Iterate over every possible ship and generate random position which will satisfy the rules (min. 1 field between ships and they cant overlap)
    for(let i=4; i>=1; i--){
        for(let j=0; j<ships_amount[i]; j++){
            let is_found = false
            let found_coordinates
            let found_orientation

            while(is_found != true){
                let start_cords = getRandomPosition()
                let orientation = getRandomOrientation()
                is_found = checkShipAvailability(start_cords[0], start_cords[1], Object.keys(ships_amount)[i-1], orientation, enemy_cells)

                if(is_found){
                    found_coordinates = start_cords
                    found_orientation = orientation
                }
            }

            //Fill enemy_cells with 1 and set color for fields with ship after finding position
            switch(found_orientation){
                case 0:
                    for(let r=found_coordinates[0]; r < parseInt(found_coordinates[0]) + parseInt(Object.keys(ships_amount)[i-1]); r++){
                        enemy_cells[r][found_coordinates[1]] = 1
                        //enemy_cells_divs[r-1][found_coordinates[1]-1].style.backgroundColor = "black"
                    }
                    break;

                case 1:
                    for(let c=found_coordinates[1]; c < parseInt(found_coordinates[1]) + parseInt(Object.keys(ships_amount)[i-1]); c++){
                        enemy_cells[found_coordinates[0]][c] = 1
                        //enemy_cells_divs[found_coordinates[0]-1][c-1].style.backgroundColor = "black"
                    }
                    break;
            }

        }
    }
}

