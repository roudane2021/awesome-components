import { Component, DoCheck, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Personne } from 'src/app/reactive-state/models/candidate.model';

@Component({
  selector: 'app-enfant',
  templateUrl: './enfant.component.html',
  styleUrls: ['./enfant.component.scss']
})
export class EnfantComponent implements OnChanges,DoCheck{


  @Input() personne!: Personne;

  ngOnChanges(changes: SimpleChanges): void {
    console.table(changes['personne'].currentValue)
  }

  ngDoCheck() {
    console.log('ngDoCheck - Le contenu de l\'objet a peut-être changé');
    // Effectuer des opérations supplémentaires si nécessaire
  }

  

}
