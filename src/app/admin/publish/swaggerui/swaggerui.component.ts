import { Component, OnInit } from "@angular/core";
import { SwaggerUIBundle } from "swagger-ui-dist";

@Component({
  selector: "app-swaggerui",
  templateUrl: "./swaggerui.component.html",
})
export class SwaggeruiComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const ui = SwaggerUIBundle({
      url: "https://demo-admin-portal.xiv.in/registry/api/docs/swagger.json",
      domNode: document.getElementById("swagger-ui-item"),
      deepLinking: true,
      layout: "BaseLayout",
    });
  }
}
