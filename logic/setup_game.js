var player_board
var enemy_board
var player_cells
var enemy_cells
var player_cells_divs
var enemy_cells_divs

var ships_amount = {4:1, 3:2, 2:3, 1:4} //for example: one 4-fieleds wide ship, two 3-fields wide ships...

//Define all variables and fill arrays 
function createBoards(){
    player_board = document.getElementById("player_board")
    enemy_board = document.getElementById("enemy_board")

    player_cells = new Array(12).fill(0)
    enemy_cells = new Array(12).fill(0)
    player_cells_divs = new Array(10) //cells have additional 1 square in every direction to avoid errors while scanning area around ship
    enemy_cells_divs = new Array(10)

    for(let i=0; i<12; i++){
        player_cells[i] = new Array(12).fill(0)
        enemy_cells[i] = new Array(12).fill(0)

        if(i<10){
            player_cells_divs[i] = new Array(10)
            enemy_cells_divs[i] = new Array(10)
        }
    }

    initBoards()
}

//Create boards' fields (divs)
function initBoards(){
    for(let i=0; i<10; i++){
        for(let j=0; j<10; j++){
            player_cells_divs[i][j] = document.createElement("div")
            player_cells_divs[i][j].setAttribute("class", "cell")
            player_board.appendChild(player_cells_divs[i][j])

            enemy_cells_divs[i][j] = document.createElement("div")
            enemy_cells_divs[i][j].setAttribute("class", "cell")
            enemy_board.appendChild(enemy_cells_divs[i][j])
        }
    }

    generateEnemyShips()
}

//Generate random ships' positions for enemy (COMPUTER)
function generateEnemyShips(){
    
    function getRandomPosition(){
        let cords = [Math.floor(Math.random() * 9) + 1, Math.round(Math.random() * 9) + 1] //1 - 10
        return cords
    }

    function getRandomOrientation(){
        let orientation = Math.round(Math.random()) //0 - horizontal, 1 - vertical
        return orientation
    }

    function checkAvailability(cords, size, orientation){

        function scanHorziontally(){
            for(let r=0; r<parseInt(size)+parseInt(2); r++){
                for(let c=0; c<3; c++){
                    if((parseInt(cords[0]) + r-1) <= 11 && (parseInt(cords[1]) + c-1) <= 11){
                        if(enemy_cells[parseInt(cords[0]) + r-1][parseInt(cords[1]) + c-1] != 0) return false   
                    }
                    else return false
                }
            }
            return true
        }

        function scanVertically(){
            for(let r=0; r<3; r++){
                for(let c=0; c<parseInt(size)+parseInt(2); c++){
                    if((parseInt(cords[0]) + r-1) <= 11 && (parseInt(cords[1]) + c-1) <= 11){
                        if(enemy_cells[parseInt(cords[0]) + r-1][parseInt(cords[1]) + c-1] != 0) return false
                    }
                    else return false
                }
            }
            return true
        }

        //begin scanning (scanning area depends on orientation)
        if(enemy_cells[cords[0]][cords[1]] == 0){
            var can_place
            switch(orientation){
                case 0:
                    can_place = scanHorziontally()
                    break;

                case 1:
                    can_place = scanVertically()
                    break;
            }
            if(can_place) return true
            else return false
        }
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
                is_found = checkAvailability(start_cords, Object.keys(ships_amount)[i-1], orientation)

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
                        enemy_cells_divs[r-1][found_coordinates[1]-1].style.backgroundColor = "black"
                    }
                    break;

                case 1:
                    for(let c=found_coordinates[1]; c < parseInt(found_coordinates[1]) + parseInt(Object.keys(ships_amount)[i-1]); c++){
                        enemy_cells[found_coordinates[0]][c] = 1
                        enemy_cells_divs[found_coordinates[0]-1][c-1].style.backgroundColor = "black"
                    }
                    break;
            }

        }
    }
}


