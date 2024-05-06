import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})

export class LocalStorageService {
  constructor() {}

  setData(key:string, data:any) {
    localStorage.setItem(key, JSON.stringify(data))
  }

  getData(key: string){
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }

  removeData(key: string){
    localStorage.removeItem(key)
  }
}
