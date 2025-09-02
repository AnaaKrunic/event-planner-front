import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../authservice.service';
import { Router } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;

  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    events: [],
    headerToolbar: {
      left: '',
      center: 'title',
      right: 'prev,next',
    },
    dayMaxEventRows: 3,
    eventDisplay: 'block',
    eventContent: (arg: any) => {
      return { html: `<div class="fc-event-title">${arg.event.title}</div>` };
    },
    eventDidMount: (info: any) => {
      info.el.setAttribute('title', info.event.title);
    }
  };

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      console.error("Token doesn't exist - user not logged in.");
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get(`${environment.apiUrl}/profile`, { headers }).subscribe(
    data => {
      this.user = data;

      const BASE_URL = environment.apiUrl;
      if (this.user.imageURLs && Array.isArray(this.user.imageURLs)) {
        this.user.imageURLs = this.user.imageURLs.map((url: string) => {
          if (!url.startsWith('http')) {
            return `${BASE_URL}${url}`;
          }
          return url;
        });
      }

      // DODAJEM RUTU ZA KAD SE KLIKNE NA NEKI EVENT
      this.calendarOptions.eventClick = (clickInfo: any) => {
        const eventId = clickInfo.event.id;
        if (eventId) {
          this.router.navigate(['/event', eventId]);
        }
      };

      this.loadCalendarEvents();
    },
    error => {
      console.error('Error:', error);
    }
  );
  }

  isEditing = false;


  selectedFiles: File[] = [];

  // photos for Event Organizer
  onEOFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFiles = [file]; // only 1 photo for EO
      this.user.imageURLs = [URL.createObjectURL(file)];
    }
  }

  removeEOImage() {
    this.user.imageURLs = ['/assets/images/default-profile.png'];
    this.selectedFiles = [];
  }

  // photos for Service and Product Provider
  onSPPFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let file of Array.from(input.files)) {
        this.selectedFiles.push(file);
        this.user.imageURLs.push(URL.createObjectURL(file));
      }
    }
  }

  currentIndex = 0;

  prevImage() {
    if (this.user.imageURLs.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.user.imageURLs.length) % this.user.imageURLs.length;
    }
  }

  nextImage() {
    if (this.user.imageURLs.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.user.imageURLs.length;
    }
  }

  removeSPPImage(index: number) {
    this.user.imageURLs.splice(index, 1);
    this.selectedFiles.splice(index, 1);

    if (this.user.imageURLs.length === 0) {
      this.currentIndex = 0;
    } else if (this.currentIndex >= this.user.imageURLs.length) {
      this.currentIndex = this.user.imageURLs.length - 1;
    }
  }


  toggleEdit() {
    if (this.isEditing) {
      const token = this.authService.getToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      const formData = new FormData();

      // relative path (for saving on server)
      const cleanedImageURLs = this.user.imageURLs
        .filter((url: string) => url.startsWith('/uploads/'));

      formData.append(
        'dto',
        new Blob(
          [JSON.stringify({
            email: this.user.email,
            address: this.user.address,
            phoneNumber: this.user.phoneNumber,
            name: this.user.name,
            lastName: this.user.lastName,
            description: this.user.description,
            imageURLs: cleanedImageURLs
          })],
          { type: 'application/json' }
        )
      );

      this.selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      this.http.put(`${environment.apiUrl}/profile`, formData, { headers })
        .subscribe({
          next: res => {
            console.log('Profile updated:', res);
          },
          error: err => {
            console.error('Error updating profile:', err);
          }
        });
    }
    this.isEditing = !this.isEditing;
  }

  changePassword() {
    console.log('Change password clicked');
  }

  deactivateProfile() {
    if (!confirm('Are you sure you want to deactivate your account?')) {
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      alert('You must be logged in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.delete(`${environment.apiUrl}/profile`, { headers, observe: 'response' }).subscribe({
      next: response => {
        if (response.status === 204) {
          alert('Account successfully deactivated');
          this.authService.clearUser();
          this.router.navigate(['/login']); 
        } else {
          alert('Account deactivation returned status: ' + response.status);
        }
      },
      error: err => {
        console.error('Error deactivating account:', err);
        alert('Error deactivating account.');
      }
    });
  }

  // ucitavanje Eventova za kalendar
  loadCalendarEvents(): void {
    const userId = this.authService.getUserId();
    const userRole = this.authService.getRole();

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>(`${environment.apiUrl}/favorites/events/${userId}`, { headers })
      .subscribe({
        next: favorites => {
          const favEvents = favorites.map(e => ({
            id: e.id,
            title: e.name,
            start: e.startDate ? new Date(e.startDate) : null,
            color: 'red'
          }));

          if (userRole === 'EventOrganizer') {
            this.http.get<any[]>(`${environment.apiUrl}/events/my-events?organizerId=${userId}`, { headers })
              .subscribe({
                next: myEvents => {
                  const ownEvents = myEvents.map(e => ({
                    id: e.id,
                    title: e.name,
                    start: e.startDate ? new Date(e.startDate) : null,
                    color: 'blue'
                  }));

                  this.calendarOptions.events = [...favEvents, ...ownEvents];
                },
                error: err => console.error('Error fetching my events:', err)
              });
          } else {
            this.calendarOptions.events = favEvents;
          }
        },
        error: err => console.error('Error fetching favorite events:', err)
      });
  }
}
