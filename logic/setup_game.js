var player_board
var enemy_board
var player_cells
var enemy_cells
var player_cells_divs
var enemy_cells_divs

var ships_amount = {4:1, 3:2, 2:3, 1:4} //for example: one 4-fieleds wide ship, two 3-fields wide ships...

function setupGame(){
    console.log("Initializing")
    createBoards()
    createChoosingMenu()
    prepareChooseMenu()
    preparePlayButton()
}


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


function createChoosingMenu(){
    let choose_container = document.getElementById("choose_container")
    
    for(let i=4; i>=1; i--){
        for(let j=0; j<ships_amount[i]; j++){
            let menu_ship = document.createElement("div")
            menu_ship.setAttribute("class", "menu_ship")
            choose_container.appendChild(menu_ship)

            for(let cell=i; cell>0; cell--){
                let ship_cell = document.createElement("div")
                ship_cell.setAttribute("class", "cell")
                menu_ship.appendChild(ship_cell)
            }
        }
    }
}



function prepareChooseMenu(){
    let first_menu_element = document.querySelector(".menu_ship")
    let choose_container = document.getElementById("choose_container")
    all_ships = choose_container.querySelectorAll(".menu_ship")
    chooseShip(0)

    function addListeners(){
        for(let i=0; i<all_ships.length; i++){
            all_ships[i].addEventListener("click", function(){
                chooseShip(i)
            })
            all_ships[i].addEventListener("mouseover", function(){
                let cells = all_ships[i].querySelectorAll(".cell")
                if(chosen != this){
                    for(cell of cells){
                        cell.style.backgroundColor = "red"
                    }
                }
            })
            all_ships[i].addEventListener("mouseout", function(){
                let cells = all_ships[i].querySelectorAll(".cell")
                if(chosen != this){
                    for(cell of cells){
                        cell.style.backgroundColor = "white"
                    }
                }
            })
          
        }
    }

    addListeners()
    preparePlayerBoard()
}


function preparePlayerBoard(){
    var can_place

    for(let i=0; i<10; i++){
        for(let j=0; j<10; j++){
            player_cells_divs[i][j].addEventListener("mouseenter", function(){
                if(chosen != null){
                    can_place = checkShipAvailability(i+1, j+1, chosen.childElementCount, ship_orientation, player_cells)
                    showPlacingAvailability(i, j,  chosen.childElementCount, ship_orientation, can_place)
                } 
            })

            player_cells_divs[i][j].addEventListener("mouseout", function(){
                if(chosen != null){
                    hidePlacingAvailability(i, j,  chosen.childElementCount, ship_orientation)
                }
            })

            player_cells_divs[i][j].addEventListener("contextmenu", function(){
                event.preventDefault()
                if(chosen != null){
                    if(ship_orientation){
                        hidePlacingAvailability(i, j,  chosen.childElementCount, ship_orientation)
                        ship_orientation = 0
                        can_place = checkShipAvailability(i+1, j+1, chosen.childElementCount, ship_orientation, player_cells)
                        showPlacingAvailability(i, j,  chosen.childElementCount, ship_orientation, can_place)
                    } 
                    else {
                        hidePlacingAvailability(i, j,  chosen.childElementCount, ship_orientation)
                        ship_orientation = 1
                        can_place = checkShipAvailability(i+1, j+1, chosen.childElementCount, ship_orientation, player_cells)
                        showPlacingAvailability(i, j,  chosen.childElementCount, ship_orientation, can_place)
                    }
                }
            })

            player_cells_divs[i][j].addEventListener("click", function(){
                if(chosen != null){
                    if(can_place) placeShip(i, j)
                }
            })
        }
    }
}


function preparePlayButton(){
    let button = document.getElementById("play_button")
    
    button.addEventListener("click", function(){
        start_game()
        this.style.visibility = "hidden"
    })

}