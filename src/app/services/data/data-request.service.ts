import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of as observableOf, throwError as observableThrowError, Observable, Subscriber } from 'rxjs';
import { HttpOptions } from '../../interfaces/httpOptions.interface';
import { mergeMap, switchMap } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { environment} from '../../../environments/environment';
import { KeycloakService } from 'keycloak-angular';


@Injectable({
  providedIn: 'root'
})
export class DataService {
/**
 * Contains base Url for api end points
 */
 baseUrl: string;
 token : any;
 isLoogedIn;
  constructor(
    private http: HttpClient,
    public keycloak: KeycloakService) {

      this.token = this.keycloak.getToken();
      if(!this.token)
      {
        this.token = localStorage.getItem('token');
      }
  }

/**
 * for preparing headers
 */
  private getHeader(headers?: HttpOptions['headers']): HttpOptions['headers'] {


    this.keycloak.isLoggedIn().then((res)=>{
      console.log(res);
      this.isLoogedIn = res;
    })

    if(this.isLoogedIn){
      let default_headers = {
        Accept: 'application/json',
         Authorization: 'Bearer ' +  this.token
      };

      return default_headers;

    }else
    {
      let default_headers = {
        Accept: 'application/json'
      };
      
      return default_headers;

    }
   

  }

/**
 * for making post api calls
 * @param RequestParam param
 */
  post(requestParam): Observable<any> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? this.getHeader(requestParam.header) : this.getHeader(),
      params: requestParam.param
    };

    return this.http.post(requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: any) => {
        if (data.responseCode && data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
  }


/**
 * for making get api calls
 *
 * @param requestParam param
 */
  get(requestParam): Observable<any> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? requestParam.header : this.getHeader(),
      params: requestParam.param
    };

    return this.http.get(requestParam.url, httpOptions).pipe(
      mergeMap((data: any) => {

        return observableOf(data);
      }));

  }

  getDocument(url: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
        let objectUrl: string = null;

        this.http
            .get(url, {
                headers: this.getHeader(),
                responseType: 'blob'
            })
            .subscribe(m => {
                objectUrl = URL.createObjectURL(m);
                observer.next(objectUrl);
            });

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
                objectUrl = null;
            }
        };
    });
}


/**
* for making post api calls
* @param RequestParam param
*/
  put(requestParam): Observable<any> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? this.getHeader(requestParam.header) : this.getHeader(),
      params: requestParam.param
    };
    return this.http.put(requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: any) => {
        if (data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
  }


  /**
 * for making get api calls
 *
 * @param requestParam param
 */
   delete(requestParam): Observable<any> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? requestParam.header : this.getHeader(),
      params: requestParam.param
    };

    return this.http.delete(requestParam.url, httpOptions).pipe(
      mergeMap((data: any) => {

        return observableOf(data);
      }));

  }


  /**
 * for making get api calls
 *
 * @param requestParam param
 */
   getText(requestParam): Observable<any> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? requestParam.header : this.getHeader(),
      params: requestParam.param
    };

    return this.http.get(requestParam.url, {
      responseType: 'text'
    }).pipe(
      switchMap((data: any) => {

        return observableOf(data);
      }));
  }

}


