import { Component, OnInit } from '@angular/core';
import { Personne } from '../../models/candidate.model';
import { Observable, delay, interval, map, take, timer } from 'rxjs';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss']
})
export class ParentComponent implements OnInit{

  personne$!: Observable<Personne>;
  

  ngOnInit(): void {
    this.personne$ = timer(500,500).pipe(
                                     delay(1000),
                                     take(5),
                                     map(x => ({id:x,firstName:'dddddd'}))
                                       )
  }

}
