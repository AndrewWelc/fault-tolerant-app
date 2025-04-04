import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  isMobile = false;
  activeView: 'form' | 'dashboard' = 'form';
  menuOpen = false;

  ngOnInit() {
    this.checkScreenSize();
  }

  toggleMenu() {
  this.menuOpen = !this.menuOpen;
}


  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  switchView(view: 'form' | 'dashboard') {
    this.activeView = view;
  }
}
