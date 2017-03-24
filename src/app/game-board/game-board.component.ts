import { Component, OnInit } from '@angular/core';
import { LogicService } from '../logic.service';

@Component({
  selector: 'dc-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
  host: {
    '(document:keydown)': 'onKeyPress($event)'
  }
})
export class GameBoardComponent implements OnInit {

  constructor(public logic:LogicService) { }

  ngOnInit() {
  }

  onKeyPress(e){
    if(!(e.code == "ArrowLeft" || e.code == "ArrowUp" || e.code == "ArrowRight" || e.code == "ArrowDown")){
      return false;
    }

    e.preventDefault();

    this.logic.moveUser(e.code);
  }

}
