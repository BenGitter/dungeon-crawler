import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { GameInfoComponent } from './game-info/game-info.component';

import { LogicService } from './logic.service';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    GameInfoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [LogicService],
  bootstrap: [AppComponent]
})
export class AppModule { }
