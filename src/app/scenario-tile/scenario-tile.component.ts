import { Component, Input, OnInit } from '@angular/core';
import { Scenario } from '../project';

@Component({
  selector: 'app-scenario-tile',
  templateUrl: './scenario-tile.component.html',
  styleUrls: ['./scenario-tile.component.css'],
})
export class ScenarioTileComponent implements OnInit {
  @Input('scenario') scenario: Scenario;

  constructor() { }

  ngOnInit() {
  }

}
