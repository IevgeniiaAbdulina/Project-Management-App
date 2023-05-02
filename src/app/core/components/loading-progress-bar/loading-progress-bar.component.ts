import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {ProgressBarMode} from '@angular/material/progress-bar';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-loading-progress-bar',
  templateUrl: './loading-progress-bar.component.html',
  styleUrls: ['./loading-progress-bar.component.scss'],
})
export class LoadingProgressBarComponent implements OnInit {
  color: ThemePalette = 'warn';
  mode: ProgressBarMode = 'buffer';
  value = 100;
  bufferValue = 100;

  constructor(public router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationStart) {
        this.value = 100;
      }

      if(event instanceof NavigationEnd) {
        this.value = 0;
      }
    })
  }
}
