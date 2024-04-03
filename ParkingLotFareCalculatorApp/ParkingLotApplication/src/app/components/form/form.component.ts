import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnDestroy {
  @Input() sectionName!: string;
  @Output() fareCalculated: EventEmitter<number> = new EventEmitter<number>();

  public time: string = '';
  public selectedVehicle: string = '';
  public carNumber: string = '';
  public parkingFare: number = 0;
  public displayParkingFare: boolean = false;
  public timeValid: boolean = true;

  private sub: Subject<void> = new Subject<void>();

  constructor(private readonly apiService: ApiService) {}

  ngOnDestroy(): void {
    this.sub.next();
    this.sub.complete();
  }

  public submitForm() {
    this.validateTime();
    if (!this.timeValid) {
      alert('Please enter a valid time in "hh:mm" format.');
      return;
    }
    if (this.sectionName === 'Check-In Section') {
      this.sendCheckInRequest();
    } else if (this.sectionName === 'Check-Out Section') {
      this.sendCheckOutRequest();
    }
  }

  public getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    this.time = `${hours}:${minutes}`;
  }

  private validateTime() {
    const timePattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]/;
    this.timeValid = timePattern.test(this.time);
  }

  private sendCheckInRequest() {
    const checkInData = {
      checkInTime: this.time,
      vehicleType: this.selectedVehicle,
      vehicleNumber: this.carNumber,
    };
    this.apiService
      .saveCheckInStatus(checkInData)
      .pipe(takeUntil(this.sub))
      .subscribe((status) => {
        console.log('Check In API Status: ', status);
      });
  }

  private sendCheckOutRequest() {
    const checkOutData = {
      checkOutTime: this.time,
      vehicleNumber: this.carNumber,
    };
    this.apiService
      .getParkingFare(checkOutData)
      .pipe(takeUntil(this.sub))
      .subscribe((fare: number) => {
        this.fareCalculated.emit(fare);
      });
  }
}
