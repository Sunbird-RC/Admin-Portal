import { Component, OnInit } from "@angular/core";
import { SwaggerUIBundle } from "swagger-ui-dist";
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: "app-swaggerui",
  templateUrl: "./swaggerui.component.html",
})
export class SwaggeruiComponent implements OnInit {
  token: string;

  constructor(private generalService: GeneralService) { }

  ngOnInit(): void {
    this.openSwaggerUi();
  }

  openSwaggerUi() {
    this.generalService.getToken().then((res) => {
      this.token = res;
      let self = this;

      const ui = SwaggerUIBundle({
        domNode: document.getElementById("swagger-ui-item"),
        deepLinking: true,
        layout: "BaseLayout",
        url: "https://demo-admin-portal.sunbirdrc.dev/registry/api/docs/user/swagger.json",

        'responseInterceptor':
          function (response: any) {
            if (response.obj.access_token) {
              const token = response.obj.access_token;
              self.token;
            }
            return response;
          },
        requestInterceptor:
          function (request) {
            request.headers.Authorization = "Bearer " + self.token;
            return request;
          }
      });
    })
  }

}
