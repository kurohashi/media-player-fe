import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiMap } from "./api-map";

@Injectable({
  providedIn: 'root'
})
export class ApiHandlerService {
  constructor(
    private http: HttpClient,
  ) { }

  callHttp(topic: string, method: string, query?: any, data?: any, slug?: any): Observable<any | undefined | null> {
    method = method.toLowerCase();
    var url: string = this.getUrls(topic, query, slug);
    let resp: any;
    switch (method) {
      case "get":
        resp = this.http.get<Observable<any>>(url);
        break;
      case "post":
        resp = this.http.post<Observable<any>>(url, data);
        break;
      case "delete":
        resp = this.http.delete<Observable<any>>(url)
        break;
      case "put":
        resp = this.http.put<Observable<any>>(url, data)
        break;
      case "export":
        resp = this.http.post(url, data, { responseType: 'arraybuffer' });
        break;
      case "upload":
        resp = this.http.post(url, data, { reportProgress: true, observe: "events" });
        break;
    }
    return resp;
  }

  private getUrls(topic: string, query?: any, slug?: any): string {
    try {
      let url: string = apiMap[topic];
      if (!url)
        return '';
      if (slug && slug.length > 0) {
        if (url.indexOf('{') >= 0) {
          url = url.replace(/[^{\}]+(?=})/g, slug).replace('{', '').replace('}', '');
        } else {
          url = url + '/' + slug;
        }
      }
      url = eval('`' + url + '`');
      let count = false;
      for (let i in query) {
        if (!query[i])
          continue;
        if (!count) {
          url += "?";
          count = true;
        } else {
          url += "&";
        }
        url += `${i}=${query[i]}`;
      }
      url = encodeURI(url);
      return url;
    } catch (e) {
      console.log(e);
      return '';
    };
  }
};