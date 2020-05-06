import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem("token")) { //check if the user is logged in
      return state.url.startsWith("/profile")
        ? true
        : (this.router.navigate(["/"]), false); //block access to login and register page
    } else {
      return state.url.startsWith("/profile") //if the user in not logged in
        ? (this.router.navigate(["/"]), false)
        : true; // allow access to login and register page
    }
  }
}
