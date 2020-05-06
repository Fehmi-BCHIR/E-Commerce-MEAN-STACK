import { Component, OnInit } from "@angular/core";
import { DataService } from "../data.service";
import { RestApiService } from "../rest-api.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
})
export class CategoriesComponent implements OnInit {
  categories: any;
  url = environment.base_url;
  newCategory = "";
  btnDisabled = false;

  constructor(private data: DataService, private rest: RestApiService) {}

  async ngOnInit() {
    try {
      const data = await this.rest.get(this.url + "/categories");
      data["success"]
        ? (this.categories = data["categories"])
        : this.data.error(data["message"]);
    } catch (error) {
      this.data.error(error["message"]);
    }
  }

  async addCategory() {
    this.btnDisabled = true;
    try {
      const data = await this.rest.post(this.url + "/categories", {
        category: this.newCategory,
      });
      data["success"]
        ? this.data.success(data["message"])
        : this.data.error(data["message"]);
    } catch (error) {
      this.data.error(error["message"]);
    }
    this.btnDisabled = false;
  }
}
