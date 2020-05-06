import { Injectable } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { RestApiService } from "./rest-api.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class DataService {
  url = environment.base_url;
  message = "";
  messageType = "danger";

  user: any;
  cartItems = 0;

  constructor(private router: Router, private rest: RestApiService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.message = "";
      }
    });
  }

  error(message) {
    this.messageType = "danger";
    this.message = message;
  }

  success(message) {
    this.messageType = "success";
    this.message = message;
  }

  warning(message) {
    this.messageType = "warning";
    this.message = message;
  }

  async getProfile() {
    try {
      if (localStorage.getItem("token")) {
        const data = await this.rest.get(this.url + "/accounts/profile");
        this.user = data["user"];
      }
    } catch (error) {
      this.error(error);
    }
  }

  getCard() {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(item: string) {
    const cart: any = this.getCard();
    if (cart.find((data) => JSON.stringify(data) === JSON.stringify(item))) {
      return false;
    } else {
      cart.push(item);
      this.cartItems++;
      localStorage.setItem("cart", JSON.stringify(cart));
      return true;
    }
  }

  clearCart() {
    this.cartItems = 0;
    localStorage.setItem("cart", "[]");
  }

  removeFromCart(item: string) {
    let cart: any = this.getCard();
    if (cart.find((data) => JSON.stringify(data) === JSON.stringify(item))) {
      cart = cart.filter(
        (data) => JSON.stringify(data) !== JSON.stringify(item)
      );
      this.cartItems--;
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }
}
