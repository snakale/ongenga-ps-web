import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

declare var window;

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;

  constructor(private router: Router) { 

    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');

      this.ipcRenderer.on('app-navigate', (event, location) => this.router.navigate([`/${location}`]) );
    }  
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }
}
