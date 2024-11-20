import { Component, OnInit } from '@angular/core';

export interface Service {
  name: string;
  price: number;
  category: string;
  serviceEventType: string[];
  availability: boolean;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})

export class ServicesComponent implements OnInit {
  selectedCategory: string = '';
  selectedEventType: string = '';
  // selectedPrice: number = 15000;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchTerm: string = ''
  selectedAvailable: boolean = false;
  selectedNotAvailable: boolean = false;
  selectedMinPrice = 0;
  selectedMaxPrice = 15000;
  thumbsize = 14;
  
  allServices: Service[] = [
    {
      name: 'Service 1',
      price: 1250,
      category: 'Entertainment',
      serviceEventType: ['Wedding', 'Birthday'],
      availability: true,
    },
    {
      name: 'Service 2',
      price: 3200,
      category: 'Catering',
      serviceEventType: ['Wedding'],
      availability: false,
    },
    {
      name: 'Service 3',
      price: 500,
      category: 'Entertainment',
      serviceEventType: ['Birthday'],
      availability: false,
    },
    {
      name: 'Service 4',
      price: 3000,
      category: 'Catering',
      serviceEventType: ['Wedding', 'Birthday'],
      availability: true,
    },
    {
      name: 'Service 5',
      price: 6000,
      category: 'Catering',
      serviceEventType: ['Wedding'],
      availability: false,
    },
    {
      name: 'Service 6',
      price: 8000,
      category: 'Entertainment',
      serviceEventType: ['Birthday'],
      availability: false,
    },
    {
      name: 'Service 7',
      price: 2000,
      category: 'Catering',
      serviceEventType: ['Wedding'],
      availability: false,
    },
    {
      name: 'Service 8',
      price: 7500,
      category: 'Catering',
      serviceEventType: ['Wedding', 'Birthday'],
      availability: true,
    },
    {
      name: 'Service 9',
      price: 3000,
      category: 'Entertainment',
      serviceEventType: ['Birthday'],
      availability: false,
    },
    {
      name: 'Service 12',
      price: 3000,
      category: 'Catering',
      serviceEventType: ['Wedding'],
      availability: false,
    },
    {
      name: 'Service 10',
      price: 1200,
      category: 'Catering',
      serviceEventType: ['Birthday'],
      availability: true,
    },
    {
      name: 'Service 11',
      price: 200,
      category: 'Entertainment',
      serviceEventType: ['Wedding'],
      availability: false,
    }
  ];

  displayedServices: Service[] = [];

  ngOnInit(): void {
    this.filterAndSearch();
  }

  filterAndSearch(): void {
    let filteredServices = this.allServices;
  
    if (this.selectedCategory) {
      filteredServices = filteredServices.filter(
        (service) => service.category === this.selectedCategory
      );
    }
  
    if (this.selectedEventType) {
      filteredServices = filteredServices.filter((service) =>
        service.serviceEventType.includes(this.selectedEventType)
      );
    }
  
    // Filtriranje na osnovu dostupnosti
    if (this.selectedAvailable && !this.selectedNotAvailable) {
      filteredServices = filteredServices.filter((service) => service.availability === true);
    }
  
    if (this.selectedNotAvailable && !this.selectedAvailable) {
      filteredServices = filteredServices.filter((service) => service.availability === false);
    }
  
    // Ako su oba checkbox-a označena, biće filtrirani samo dostupni i nedostupni servisi
    if (this.selectedAvailable && this.selectedNotAvailable) {
      filteredServices = filteredServices.filter(
        (service) => service.availability === true || service.availability === false
      );
    }
  
    filteredServices = filteredServices.filter(
      (service) => service.price <= this.selectedMaxPrice
    );

  
  
    filteredServices = filteredServices.filter(
      (service) => service.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedServices = filteredServices.slice(start, start + this.itemsPerPage);
  }
  

  changePage(page: number): void {
    this.currentPage = page;
    this.filterAndSearch();
  }

  get totalPages(): number[] {
    return Array.from({ length: Math.ceil(this.allServices.length / this.itemsPerPage) }, (_, i) => i + 1);
  }

  toggleAvailability(): void {
    this.filterAndSearch(); // Ponovno filtriranje nakon promene
  }  


  

  draw(slider: HTMLElement, splitValue: number): void {
    /* set function vars */
    const min = slider.querySelector<HTMLInputElement>('.min')!;
    const max = slider.querySelector<HTMLInputElement>('.max')!;
    const lower = slider.querySelector<HTMLSpanElement>('.lower')!;
    const upper = slider.querySelector<HTMLSpanElement>('.upper')!;
    const legend = slider.querySelector<HTMLDivElement>('.legend')!;
    const thumbSize = parseInt(slider.getAttribute('data-thumbsize') || '0', 10);
    const rangeWidth = parseInt(slider.getAttribute('data-rangewidth') || '0', 10);
    const rangeMin = parseInt(slider.getAttribute('data-rangemin') || '0', 10);
    const rangeMax = parseInt(slider.getAttribute('data-rangemax') || '0', 10);
  
    /* set min and max attributes */
    min.setAttribute('max', splitValue.toString());
    max.setAttribute('min', splitValue.toString());
  
    /* set css */
    const minWidth =
      thumbSize + ((splitValue - rangeMin) / (rangeMax - rangeMin)) * (rangeWidth - 2 * thumbSize);
    const maxWidth =
      thumbSize + ((rangeMax - splitValue) / (rangeMax - rangeMin)) * (rangeWidth - 2 * thumbSize);
  
    min.style.width = `${minWidth}px`;
    max.style.width = `${maxWidth}px`;
    min.style.left = '0px';
    max.style.left = `${minWidth}px`;
    min.style.top = `${lower.offsetHeight}px`;
    max.style.top = `${lower.offsetHeight}px`;
    legend.style.marginTop = `${min.offsetHeight}px`;
    slider.style.height = `${lower.offsetHeight + min.offsetHeight + legend.offsetHeight}px`;
  
    /* correct for 1 off at the end */
    if (parseInt(max.value, 10) > rangeMax - 1) {
      max.setAttribute('data-value', rangeMax.toString());
    }
  
    /* write value and labels */
    max.value = max.getAttribute('data-value')!;
    min.value = min.getAttribute('data-value')!;
    lower.innerHTML = min.getAttribute('data-value')!;
    upper.innerHTML = max.getAttribute('data-value')!;
  }
  
  init(slider: HTMLElement): void {
    /* set function vars */
    const min = slider.querySelector<HTMLInputElement>('.min')!;
    const max = slider.querySelector<HTMLInputElement>('.max')!;
    const rangeMin = parseInt(min.getAttribute('min') || '0', 10);
    const rangeMax = parseInt(max.getAttribute('max') || '0', 10);
    const avgValue = (rangeMin + rangeMax) / 2;
    const legendNum = parseInt(slider.getAttribute('data-legendnum') || '0', 10);
    const thumbSize = parseInt(slider.getAttribute('data-thumbsize') || '0', 10);
    const rangeSlider = document.querySelectorAll<HTMLElement>('.min-max-slider');
  
    /* set data-values */
    min.setAttribute('data-value', rangeMin.toString());
    max.setAttribute('data-value', rangeMax.toString());
  
    /* set data vars */
    slider.setAttribute('data-rangemin', rangeMin.toString());
    slider.setAttribute('data-rangemax', rangeMax.toString());
    slider.setAttribute('data-thumbsize', thumbSize.toString());
    slider.setAttribute('data-rangewidth', slider.offsetWidth.toString());
  
    /* write labels */
    const lower = document.createElement('span');
    const upper = document.createElement('span');
    lower.classList.add('lower', 'value');
    upper.classList.add('upper', 'value');
    lower.textContent = rangeMin.toString();
    upper.textContent = rangeMax.toString();
    slider.insertBefore(lower, min.previousElementSibling);
    slider.insertBefore(upper, min.previousElementSibling);
  
    /* write legend */
    const legend = document.createElement('div');
    legend.classList.add('legend');
    for (let i = 0; i < legendNum; i++) {
      const legendValue = document.createElement('div');
      const val = Math.round(rangeMin + (i / (legendNum - 1)) * (rangeMax - rangeMin));
      legendValue.textContent = val.toString();
      legend.appendChild(legendValue);
    }
    slider.appendChild(legend);
  
    /* draw */
    this.draw(slider, avgValue);
  
    /* events */
    min.addEventListener('input', () => this.update(min));
    max.addEventListener('input', () => this.update(max));
  }
  
  update(el: HTMLInputElement): void {
    /* set function vars */
    const slider = el.closest('.min-max-slider')! as HTMLElement
    const min = slider.querySelector<HTMLInputElement>('.min')!;
    const max = slider.querySelector<HTMLInputElement>('.max')!;
    const minValue = Math.floor(parseInt(min.value, 10));
    const maxValue = Math.floor(parseInt(max.value, 10));
  
    /* set inactive values before draw */
    min.setAttribute('data-value', minValue.toString());
    max.setAttribute('data-value', maxValue.toString());
  
    const avgValue = (minValue + maxValue) / 2;
  
    /* draw */
    this.draw(slider, avgValue);
  }
  
  // rangeSlider: any.forEach((s: HTMLElement): void => {
  //   init(s);
  // });
}
