import { Component, OnInit } from "@angular/core";
import { DataService } from "../data.service";
import { RestApiService } from "../rest-api.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  btnDisabled = false;
  currentSettings: any;
  url = environment.base_url;
  constructor(private data: DataService, private rest: RestApiService) {}

  async ngOnInit() {
    try {
      if (!this.data.user) {
        //check if the user profile is loaded
        await this.data.getProfile(); //if not wait the user profile finish loading
      }
      this.currentSettings = Object.assign(
        {
          newPwd: "",
          pwdConfirm: "",
        },
        this.data.user
      );
    } catch (error) {
      this.data.error(error);
    }
  }

  validate(settings) {
    if (settings["name"]) {
      if (settings["email"]) {
        if (settings["newPwd"]) {
          if (settings["pwdConfirm"]) {
            if (settings["newPwd"] === settings["pwdConfirm"]) {
              return true;
            } else {
              this.data.error("Passwords do not match");
            }
          } else {
            this.data.error("Please enter confirmation Password");
          }
        } else {
          if (!settings["pwdConfirm"]) {
            return true;
          } else {
            this.data.error("Please enter new Password");
          }
        }
      } else {
        this.data.error("Please enter your email");
      }
    } else {
      this.data.error("Please enter your name");
    }
  }

  async update() {
    this.btnDisabled = true;
    try {
      if (this.validate(this.currentSettings)) {
        const data = await this.rest.post(
          this.url+"/accounts/profile",
          {
            name: this.currentSettings["name"],
            email: this.currentSettings["email"],
            password: this.currentSettings["newPwd"],
            isSeller: this.currentSettings["isSeller"],
          }
        );
        data["success"]
          ? (this.data.getProfile(), this.data.success(data["message"]))
          : this.data.error(data["message"]);
      }
    } catch (error) {
      this.data.error(error["message"]);
    }
    this.btnDisabled = false;
  }
}
