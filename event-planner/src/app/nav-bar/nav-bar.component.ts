import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../authservice.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isLoggedIn = false;
  user: { id: string; name: string; token: string; role: string } | null = null;

  // da l su dropdown-ovi otvoreni
  productsOpen = false;
  eventsOpen = false;
  servicesOpen = false;

  // privremeno onemogucava hover
  hoverSuppressed = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // zatvaranje dropdowna nakon navigacije
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this.closeAll();
          this.hoverSuppressed = false;
          try { this.cdr.detectChanges(); } catch (e) { /* ignore */ }
        }, 0);
      });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.isLoggedIn = !!user;
      try { this.cdr.detectChanges(); } catch (e) { /* ignore */ }
    });
  }

  logout() {
    this.authService.clearUser();
    this.router.navigate(['/login']);
    this.closeAll();
    this.hoverSuppressed = false;
  }

  toggleProducts(event?: Event) {
    if (event) event.stopPropagation();
    this.productsOpen = !this.productsOpen;
    if (this.productsOpen) {
      this.eventsOpen = false;
      this.servicesOpen = false;
    }
  }

  toggleEvents(event?: Event) {
    if (event) event.stopPropagation();
    this.eventsOpen = !this.eventsOpen;
    if (this.eventsOpen) {
      this.productsOpen = false;
      this.servicesOpen = false;
    }
  }

  toggleServices(event?: Event) {
    if (event) event.stopPropagation();
    this.servicesOpen = !this.servicesOpen;
    if (this.servicesOpen) {
      this.productsOpen = false;
      this.eventsOpen = false;
    }
  }

  closeAll() {
    this.productsOpen = false;
    this.eventsOpen = false;
    this.servicesOpen = false;
  }

  navigateAndClose(path: string) {
    this.hoverSuppressed = true;
    this.closeAll();
    try { this.cdr.detectChanges(); } catch (e) { /* ignore */ }

    setTimeout(() => {
      this.router.navigate([path]).then(() => {
        setTimeout(() => {
          this.hoverSuppressed = false;
          try { this.cdr.detectChanges(); } catch (e) { /* ignore */ }
        }, 200);
      });
    }, 10);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.closeAll();
      this.hoverSuppressed = false;
    }
  }

  get productsItems() {
    const items: { path: string; label: string }[] = [
      { path: '/all-products', label: 'All Products' }
    ];
    if (this.user?.role === 'SPProvider') {
      items.push({ path: '/my-products', label: 'My Products' });
    }
    return items;
  }

  get productsSingleItem() {
    const items = this.productsItems;
    return items.length === 1 ? items[0] : null;
  }

  // All Services + My Services (ako je SPProvider)
  get servicesItems() {
    const items: { path: string; label: string }[] = [
      { path: '/all-services', label: 'All Services' }
    ];
    if (this.user?.role === 'SPProvider') {
      items.push({ path: '/services', label: 'My Services' });
    }
    return items;
  }

  get servicesSingleItem() {
    const items = this.servicesItems;
    return items.length === 1 ? items[0] : null;
  }
}
