import { Injectable } from '@angular/core';

@Injectable()
export class LogicService {

  rows:number = 55;
  cols:number = 85;

  numFood = 12;
  numEnemies = 10;

  board:any[] = [];

  user = {
    health: 100,
    weapon: "Bare hands",
    attack: 10,
    level: 1, 
    exp: 1
  }

  enemyStrengh = 10;
  bossStrength = 30;

  pos = [];

  darkness = true;

  constructor() { 
    this.setupGame();
  }

  setupGame(){
    this.buildBoard();
    this.placeUser();
    this.placeFood();
    this.placeEnemies();
    this.placeBoss();
    this.placeWeapon();

    this.user = {
      health: 100,
      weapon: "Bare hands",
      attack: 10,
      level: 1,
      exp: 1
    }
  }

  placeWeapon(){
    let availablePlace;
    do{
      let x = Math.floor(Math.random()*this.cols);
      let y = Math.floor(Math.random()*this.rows);

      availablePlace = (!this.board[y][x].wall && !this.board[y][x].food && !this.board[y][x].user && !this.board[y][x].enemy && !this.board[y][x].boss);
      if(availablePlace){
        this.board[y][x].weapon = true;
      }

    }while(!availablePlace)    
  }

  placeUser(){
    let availablePlace;
    do{
      let x = Math.floor(Math.random()*this.cols);
      let y = Math.floor(Math.random()*this.rows);

      availablePlace = (!this.board[y][x].wall);
      if(availablePlace){
        this.board[y][x].user = true;
        this.pos = [y, x];
      }

    }while(!availablePlace)

    for(let i = -6; i < 7; i++){
      for(let j = -6; j < 7; j++){
        if((this.pos[0] +i) >= 0 && (this.pos[1] +j) >= 0 && (this.pos[0] +i) < this.rows && (this.pos[1] +j) < this.cols){
          if((Math.abs(i) + Math.abs(j) -1) < 8){
            this.board[this.pos[0] + i][this.pos[1] + j].hidden = false;
          }
        }
      }
    }

  }

  placeFood(){
    for(let i = 0; i < this.numFood; i++){
      let availablePlace;
      do{
        let x = Math.floor(Math.random()*this.cols);
        let y = Math.floor(Math.random()*this.rows);

        availablePlace = (!this.board[y][x].wall && !(x == this.pos[1] && y == this.pos[0]));
        if(availablePlace){
          this.board[y][x].food = true;
        }

      }while(!availablePlace)
    }
  }

  placeEnemies(){
    for(let i = 0; i < this.numEnemies; i++){
      let availablePlace;
      do{
        let x = Math.floor(Math.random()*this.cols);
        let y = Math.floor(Math.random()*this.rows);

        availablePlace = (!this.board[y][x].wall && !this.board[y][x].food && !this.board[y][x].user);
        if(availablePlace){
          this.board[y][x].enemy = true;
          this.board[y][x].health = 50;
        }

      }while(!availablePlace)
    }
  }

  placeBoss(){
    let availablePlace;
    do{
      let x = Math.floor(Math.random()*this.cols);
      let y = Math.floor(Math.random()*this.rows);

      availablePlace = (!this.board[y][x].wall && !this.board[y][x].food && !this.board[y][x].user && !this.board[y][x].enemy);
      if(availablePlace){
        this.board[y][x].boss = true;
        this.board[y][x].health = 200;
      }

    }while(!availablePlace)
  }

  moveUser(code){
    let _pos = [];
    _pos[0] = this.pos[0];
    _pos[1] = this.pos[1];

    if(code == "ArrowLeft"){
      _pos[1]--;
    }else if(code == "ArrowRight"){
      _pos[1]++;
    }else if(code == "ArrowUp"){
      _pos[0]--;
    }else if(code == "ArrowDown"){
      _pos[0]++;
    }

    // Wall check
    if(this.board[_pos[0]][_pos[1]].wall){
      return false;
    }

    // Healt item check
    if(this.board[_pos[0]][_pos[1]].food){
      this.user.health += 20;
      this.board[_pos[0]][_pos[1]].food = false;
    }

    // Enemy check
    if(this.board[_pos[0]][_pos[1]].enemy){
      
      this.board[_pos[0]][_pos[1]].health -= Math.floor(Math.random()*3)-1 + this.user.attack * this.user.level;
      this.user.health -= Math.floor(Math.random()*3)-1 + this.enemyStrengh;

      if(this.user.health <= 0){
        this.user.health = 0;
        let self = this;
        setTimeout(function(){
          alert("Game over");
          self.setupGame();
        },0);
        
      }
      if(this.board[_pos[0]][_pos[1]].health <= 0){
        this.board[_pos[0]][_pos[1]].enemy = false;
        this.user.exp++;
        if(this.user.exp == 3){
          this.user.exp = 1;
          this.user.level++;
        }
      }else{
        return false;
      }

    }

    // Boss check
    if(this.board[_pos[0]][_pos[1]].boss){
      
      this.board[_pos[0]][_pos[1]].health -= Math.floor(Math.random()*3)-1 + this.user.attack * this.user.level;
      this.user.health -= Math.floor(Math.random()*3)-1 + this.bossStrength;

      if(this.user.health <= 0){
        this.user.health = 0;
        let self = this;
        setTimeout(function(){
          alert("Game over");
          self.setupGame();
        },0);
        return false;
      }
      if(this.board[_pos[0]][_pos[1]].health <= 0){
        this.board[_pos[0]][_pos[1]].boss = false;
        let self = this;
        setTimeout(function(){
          alert("You won!");
          self.setupGame();
        },0);
      }else{
        return false;
      }

    }

    // Weapon check
    if(this.board[_pos[0]][_pos[1]].weapon){
      this.user.attack = 20;
      this.user.weapon = "Shot gun";
      this.board[_pos[0]][_pos[1]].weapon = false;
    }


    
    if(this.darkness){
      // Make everything hidden again
      for(let i = -7; i < 9; i++){
        for(let j = -7; j < 9; j++){
          if((this.pos[0] +i) >= 0 && (this.pos[1] +j) >= 0 && (this.pos[0] +i) < this.rows && (this.pos[1] +j) < this.cols){
            this.board[this.pos[0] + i][this.pos[1] + j].hidden = true;
          }
        }
      }
      // Make some parts visible again
      for(let i = -6; i < 7; i++){
        for(let j = -6; j < 7; j++){
          if((_pos[0] +i) >= 0 && (_pos[1] +j) >= 0 && (_pos[0] +i) < this.rows && (_pos[1] +j) < this.cols){
            if((Math.abs(i) + Math.abs(j) -1) < 8){
              this.board[_pos[0] + i][_pos[1] + j].hidden = false;
            }
          }
        }
      }
    }
    

    this.board[this.pos[0]][this.pos[1]].user = false;
    this.board[_pos[0]][_pos[1]].user = true;

    this.pos = _pos;
  }

  toggleDarkness(){
    if(this.darkness){
      this.darkness = false;
      for(let i = 0; i < this.rows; i++){
        for(let j = 0; j < this.cols; j++){
          this.board[i][j].hidden = false;
        }
      }
    }else{
      this.darkness = true;
      for(let i = 0; i < this.rows; i++){
        for(let j = 0; j < this.cols; j++){
          this.board[i][j].hidden = true;
        }
      }

      for(let i = -6; i < 7; i++){
        for(let j = -6; j < 7; j++){
          if((this.pos[0] +i) >= 0 && (this.pos[1] +j) >= 0){
            if((Math.abs(i) + Math.abs(j) -1) < 8){
              this.board[this.pos[0] + i][this.pos[1] + j].hidden = false;
            }
          }
        }
      }
    } 
  }

  buildBoard(){
    // Complicated way to create dungeon...
    let openInRing = [[2,10],[2,40],];

    this.board = new Array(this.rows);
    for(let i = 0; i < this.rows; i++){
      this.board[i] = new Array(this.cols);
      for(let j = 0; j < this.cols; j++){
        this.board[i][j] = {wall: true};
        this.board[i][j].hidden = true;

        // Outer ring:
        if(i == 1 || i == this.rows-2 || j == 1 || j == this.cols-2){
          if(!(i == 0 || i == this.rows-1 || j == 0 || j == this.cols-1)){
            this.board[i][j].wall = false;
          }
        }

        // Inner block:
        if((i > 2 && i < 20) && (j > 2 && j < 20)){
          this.board[i][j].wall = false;
        }
        if(i == 2 && j == 10){
          this.board[i][j].wall = false;
        }
        if(i == 17 && j == 2){
          this.board[i][j].wall = false;
        }

        // Inner block:
        if((i > 2 && i < 26) && (j > 20 && j < 82)){
          this.board[i][j].wall = false;
        }
        if(i == 2 && j == 70){
          this.board[i][j].wall = false;
        }
        if(i == 24 && j == 82){
          this.board[i][j].wall = false;
        }
        if(i == 10 && j == 20){
          this.board[i][j].wall = false;
        }

        // Inner block:
        if((i > 20 && i < 52) && (j > 2 && j < 20)){
          this.board[i][j].wall = false;
        }
        if(i == 2 && j == 70){
          this.board[i][j].wall = false;
        }
        if(i == 23 && j == 2){
          this.board[i][j].wall = false;
        }
        if(i == 23 && j == 20){
          this.board[i][j].wall = false;
        }

        // Inner block:
        if((i > 31 && i < 52) && (j > 31 && j < 82)){
          this.board[i][j].wall = false;
        }
        if(i == 40 && j == 31){
          this.board[i][j].wall = false;
        }
        if(i == 31 && j == 72){
          this.board[i][j].wall = false;
        }

        // Inner paths:
        if((i == 30) && (j > 19 && j < 83)){
          this.board[i][j].wall = false;
        }
        if((j == 30) && (i > 25 && i < 53)){
          this.board[i][j].wall = false;
        }

      }
    }
  }

}
