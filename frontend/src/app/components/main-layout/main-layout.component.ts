import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  isMobile = false;
  activeView: 'form' | 'dashboard' = 'form';
  menuOpen = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.checkScreenSize();
    
    this.route.queryParams.subscribe(params => {
      const view = params['view'] as 'form' | 'dashboard';
      if (view === 'form' || view === 'dashboard') {
        this.activeView = view;
      }
    });
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
    
    this.router.navigate([], {
      queryParams: { view },
      queryParamsHandling: 'merge'
    });
  }
}
