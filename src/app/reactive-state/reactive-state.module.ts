import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveStateRoutingModule } from './reactive-state-routing.module';
import { CandidateListComponent } from './components/candidate-list/candidate-list.component';
import { SingleCandidateComponent } from './components/single-candidate/single-candidate.component';
import { CandidatesService } from './services/candidates.service';
import { share } from 'rxjs';
import { SharedModule } from '../shared/shared.module';
import { ParentComponent } from './components/parent/parent.component';
import { EnfantComponent } from './components/parent/enfant/enfant.component';


@NgModule({
  declarations: [
    CandidateListComponent,
    SingleCandidateComponent,
    ParentComponent,
    EnfantComponent
  ],
  imports: [
    CommonModule,
    ReactiveStateRoutingModule,
    SharedModule
  ],
  providers: [CandidatesService]
})
export class ReactiveStateModule { }
