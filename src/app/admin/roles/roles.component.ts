import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { TranslateService } from "@ngx-translate/core"
import { GeneralService } from "src/app/services/general/general.service"

@Component({
	selector: "roles-template",
	templateUrl: "./roles.component.html",
	styleUrls: ["./roles.component.scss"]
})
export class RolesComponent implements OnInit {
	params: any
	isSettingMenu: boolean = false

	status: boolean = false
	activeMenu: string = ""
	sideMenu: any
	menus: any
	an_menus: any
	currentMenu: number = 0
	items = []
	isLoading: boolean = true
	isSchemaCreated: boolean = false
	constructor(
		private activeRoute: ActivatedRoute,
		private generalService: GeneralService,
		public translate: TranslateService
	) {}

	ngOnInit(): void {
		this.activeRoute.params.subscribe((params) => {
			this.params = params

			if (params.hasOwnProperty("page") && params.page)
				// this.activeMenu = params.page;
				console.log({ params })
		})

		this.generalService.getData("/Schema").subscribe(
			(res) => {
				this.readSchema(res)
			},
			(err) => {
				this.items = []
				this.isLoading = false
			}
		)
	}

	readSchema(res) {
		for (let i = 0; i < res.length; i++) {
			if (typeof res[i].schema == "string") {
				res[i].schema = JSON.parse(res[i].schema)
				this.isSchemaCreated = true

				if (
					!res[i].schema.hasOwnProperty("isRefSchema") &&
					!res[i].schema.isRefSchema
				) {
					this.items.push(res[i])
				}

				this.isLoading = false
			}
		}
	}

	clickEvent() {
		this.status = !this.status
	}
}
