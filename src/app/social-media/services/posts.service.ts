import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Post } from '../models/post.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PostsService {
  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiUrl}/posts`);
  }
  addNewComment(postsComment:{ comment: string, postId: number }) {
    console.log(postsComment);
  }
}