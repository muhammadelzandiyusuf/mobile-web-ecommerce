import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Video } from './video';
import { VideoPlaylist } from './video-playlist';
import { Globals } from '../../service/global';
import { MessageService } from './../../service/message.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/x-www-form-urlencoded'
    // 'x-api-key': 'b47b05789a68a8b223b8643f4704346d'
  })
};

@Injectable()
export class VideoService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private globals: Globals
  ) { }

  apiUrl = this.globals.apiUrl;

  /** GET video playlist from the server */
  getVideoPlaylist (sidx: any, sort: any, limit: any, start: any): Observable<VideoPlaylist[]> {
    let videoUrl = this.apiUrl + 'video/list?sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start;
    return this.http.get<VideoPlaylist[]>(videoUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getVideoPlaylist', []))
      );
  }

  /** GET video by playlist from the server */
  getVideoByPlaylist (url: any): Observable<Video[]> {
    let videoUrl = this.apiUrl + 'video/video_list?url=' + url;
    return this.http.get<Video[]>(videoUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getVideoByPlaylist', []))
      );
  }

  /** GET video playlist from the server */
  getVideoPlaylistScrool (url: any, sidx: any, sort: any, limit: any, start: any): Observable<VideoPlaylist[]> {
    let videoUrl = this.apiUrl + 'video/video_list?url=' + url + 'sidx=' + sidx + '&sort=' + sort + '&limit=' + limit + '&start=' + start;
    return this.http.get<VideoPlaylist[]>(videoUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getVideoPlaylistScrool', []))
      );
  }

  /** GET video detail from the server */
  getVideoDetail (id: any): Observable<Video[]> {
    let videoUrl = this.apiUrl + 'video/detail?id=' + id;
    return this.http.get<Video[]>(videoUrl, httpOptions)
      .pipe(
        catchError(this.handleError('getVideoDetail', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
 
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead
 
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
 
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('ArchitectService: ' + message);
  }

}
