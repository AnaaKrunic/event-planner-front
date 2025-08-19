import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { EventService } from '../event.service';
import { Router } from '@angular/router';
import { EventTypeService } from '../event-type.service';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {

  eventTypes: any[] = [];
  suggestedCategories: any[] = [];

  event: any = {
    eventTypeId: null,
    categoryId: null,
    name: '',
    description: '',
    maxParticipants: null,
    isPublic: true,
    locationId: null,
    startDate: '',
    endDate: ''
  };

  agenda: any[] = [];

  private map!: L.Map;
  private marker!: L.Marker;

  constructor(
  private eventService: EventService,
  private eventTypeService: EventTypeService,
  private locationService: LocationService,
  private router: Router
) {}


  ngOnInit(): void {
    this.eventTypeService.getAll().subscribe(data => {
      this.eventTypes = data;
    });

    this.initMap();
  }

  onEventTypeChange(event: any) {
    const selectedId = event.target.value;
    const selectedType = this.eventTypes.find(t => t.id == selectedId);
    this.suggestedCategories = selectedType ? selectedType.suggestedCategories : [];
  }

  togglePrivacy() {
    this.event.isPublic = !this.event.isPublic;
  }

  addActivity() {
    this.agenda.push({
      name: '',
      description: '',
      startTime: '',
      endTime: '',
      location: ''
    });
  }

  removeActivity(index: number) {
    this.agenda.splice(index, 1);
  }

  onSubmit() {
    if (!this.event.location) {
      console.error('No location selected!');
      return;
    }

    const locationPayload = {
      name: this.event.name,
      address: this.event.address || '',
      latitude: this.event.location.lat,
      longitude: this.event.location.lng
    };
    
    const startDateTime = this.event.date ? this.event.date + 'T00:00:00' : null;
    const mappedAgenda = this.agenda.map((a) => {
      return {
        eventId: null,
        name: a.name,
        description: a.description,
        startTime: this.event.date && a.startTime ? this.event.date + 'T' + a.startTime : null,
        endTime: this.event.date && a.endTime ? this.event.date + 'T' + a.endTime : null,
        location: a.location
      };
    });

    this.locationService.createLocation(locationPayload).subscribe({
      next: (createdLocation) => {
        const payload = {
          name: this.event.name,
          description: this.event.description,
          participants: this.event.maxParticipants || 0,
          isPublic: this.event.isPublic,            
          startDate: startDateTime,
          endDate: startDateTime,
          locationId: createdLocation.id,
          eventTypeId: this.event.eventTypeId === 'all' ? null : this.event.eventTypeId,
          agenda: mappedAgenda
        };

        this.eventService.create(payload).subscribe({
          next: (res) => {
            console.log('Event successfully created:', res);
            this.router.navigate(['/all-events']); // preusmeravam na listu dogadjaja
          },
          error: (err) => {
            console.error('Error with creating event', err);
          }
        });
      },
      error: (err) => console.error('Error creating location', err)
    }); 
  }

  private initMap() {
    this.map = L.map('map').setView([44.8176, 20.4569], 13);

    const redPinIcon = L.icon({
      iconUrl: 'assets/images/location-pin.png',
      iconSize: [35, 40]
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      this.event.location = { lat, lng };

      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker([lat, lng], { icon: redPinIcon }).addTo(this.map);

      this.locationService.getAddress(lat, lng).subscribe({
        next: (res) => {
          this.event.address = res.display_name;
          console.log('Address: ', this.event.address)
        },
        error: (err) => console.error('Error fetching address', err)
      })
    });
  }
}
