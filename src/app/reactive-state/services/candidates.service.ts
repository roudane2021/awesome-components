import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, delay, filter, map, switchMap, take, tap } from "rxjs";
import { Candidate } from "../models/candidate.model";
import { HttpClient } from "@angular/common/http";
import { environment} from "../../../environments/environment";


@Injectable()
export class CandidatesService {

    private _loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _candidates$: BehaviorSubject<Candidate[]> = new BehaviorSubject<Candidate[]>([]);
    private lastCandidatesLoad = 0;

    constructor(private httpClient: HttpClient){}

    get loading$():Observable<boolean> {
     return this._loading$.asObservable();
    }
    get candidate$(): Observable<Candidate[]> {

        return this._candidates$.asObservable();
    }

    private setLoadingStatus (loading:boolean) {
        this._loading$.next(loading);
    }

    getCandidatesFromServer() {
        if(Date.now() - this.lastCandidatesLoad <= 300000) {
            return;
        }
        this.setLoadingStatus(true);
        this.httpClient.get<Candidate[]>(`${environment.apiUrl}/candidates`)
                 .pipe(
                    delay(500),
                    tap(candidates => {
                    this._candidates$.next(candidates);
                    this.setLoadingStatus(false);
                    this.lastCandidatesLoad = Date.now();
                    })
                    ).subscribe();
    }
    getCandidateBy (id: number):Observable<Candidate> {
        if (!this.lastCandidatesLoad) {
            this.getCandidatesFromServer();
        }
        return this._candidates$.pipe(
            map(candidates => candidates.filter(candidate => candidate.id === id)[0])
        )
    }

    refuseCandidate(id: number): void {
        this.setLoadingStatus(true);
        this.httpClient.delete(`${environment.apiUrl}/candidates/${id}`).pipe(
            delay(1000),
            switchMap(() => this.candidate$),
            take(1),
            map(candidates => candidates.filter(candidate => candidate.id !== id)),
            tap(candidates => {
                this._candidates$.next(candidates);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    hireCandidate(id: number): void {
        this.candidate$.pipe(
            take(1),
            map(candidates => candidates
                .map(candidate => candidate.id === id ?
                    { ...candidate, company: 'Snapface Ltd' } :
                    candidate
                )
            ),
            tap(updatedCandidates => this._candidates$.next(updatedCandidates)),
            switchMap(updatedCandidates =>
                this.httpClient.patch(`${environment.apiUrl}/candidates/${id}`,
                updatedCandidates.find(candidate => candidate.id === id))
            )
        ).subscribe();
    }

}