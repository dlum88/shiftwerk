import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { WerkerHomeComponent } from './werker/werker-home/werker-home.component';
import { WerkerSearchComponent } from './werker/werker-search/werker-search.component';
import { WerkerNotificationsComponent } from './werker/werker-notifications/werker-notifications.component';
import { WerkerProfileComponent } from './werker/werker-profile/werker-profile.component';
import { WerkerSettingsComponent } from './werker/werker-settings/werker-settings.component';
import { WerkerHistoryComponent } from './werker/werker-history/werker-history.component';
import { WerkerScheduleComponent } from './werker/werker-schedule/werker-schedule.component';
import { MakerHomeComponent } from './maker/maker-home/maker-home.component';
import { MakerSearchComponent } from './maker/maker-search/maker-search.component';
import { MakerProfileComponent } from './maker/maker-profile/maker-profile.component';
import { MakerSettingsComponent } from './maker/maker-settings/maker-settings.component';
import { MakerUnfilledShiftsComponent } from './maker/maker-unfilled-shifts/maker-unfilled-shifts.component';
import { MakerCreateShiftComponent } from './maker/maker-create-shift/maker-create-shift.component';
import { MakerPositionsComponent } from './maker/maker-positions/maker-positions.component';
import { UserNavbarComponent } from './user/user-navbar/user-navbar.component';
import { ShiftDetailsComponent } from './user/shift-details/shift-details.component';
import { HistoryComponent } from './user/history/history.component';
import { PendingshiftsComponent } from './user/pendingshifts/pendingshifts.component';
import { NotificationsComponent } from './user/notifications/notifications.component';
import { ScheduleComponent } from './user/schedule/schedule.component';

@NgModule({
  declarations: [
    AppComponent,
    WerkerHomeComponent,
    WerkerSearchComponent,
    WerkerNotificationsComponent,
    WerkerProfileComponent,
    WerkerSettingsComponent,
    WerkerHistoryComponent,
    WerkerScheduleComponent,
    MakerHomeComponent,
    MakerSearchComponent,
    MakerProfileComponent,
    MakerSettingsComponent,
    MakerUnfilledShiftsComponent,
    MakerCreateShiftComponent,
    MakerPositionsComponent,
    UserNavbarComponent,
    ShiftDetailsComponent,
    HistoryComponent,
    PendingshiftsComponent,
    NotificationsComponent,
    ScheduleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
