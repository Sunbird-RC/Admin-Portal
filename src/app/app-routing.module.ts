import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormsComponent } from "./forms/forms.component";
import { LayoutsComponent } from "./layouts/layouts.component";
import { PanelsComponent } from "./layouts/modal/panels/panels.component";
import { EditPanelComponent } from "./layouts/modal/panels/edit-panel/edit-panel.component";
import { AddPanelComponent } from "./layouts/modal/panels/add-panel/add-panel.component";
import { TablesComponent } from "./tables/tables.component";
import { AttestationComponent } from "./tables/attestation/attestation.component";
import { AuthGuard } from "./utility/app.guard";
import { DocViewComponent } from "./layouts/doc-view/doc-view.component";
import { InstallComponent } from "./install/install.component";
import { HomeComponent } from "./home/home.component";
import { KeycloakloginComponent } from "./authentication/login/keycloaklogin.component";
import { LogoutComponent } from "./authentication/logout/logout.component";
import { SearchComponent } from "./discovery/search/search.component";
import { DocumentsComponent } from "./documents/documents.component";
import { AddDocumentComponent } from "./documents/add-document/add-document.component";
import { ScanQrCodeComponent } from "./documents/scan-qr-code/scan-qr-code.component";
import { BrowseDocumentsComponent } from "./documents/browse-documents/browse-documents.component";
// import { PagesComponent } from './pages/pages.component';
import { DocDetailViewComponent } from "./documents/doc-detail-view/doc-detail-view.component";
import { GetStartedComponent } from "./admin/get-started/get-started.component";
import { CreateEntityComponent } from "../app/admin/create-entity/create-entity.component";
import { ConfigWorkflowComponent } from "./admin/config-workflow/config-workflow.component";
import { CreateVcTemplateComponent } from "./admin/create-vc-template/create-vc-template.component";
import { OwnershipComponent } from "./admin/ownership/ownership.component";
import { SidemenuComponent } from "./admin/sidemenu/sidemenu.component";
import { DashboardComponent } from "./admin/dashboard/dashboard.component";
import { AddTemplateComponent } from "./admin/add-template/add-template.component";
import { TestAndLaunchComponent } from "./admin/test-and-launch/test-and-launch.component";
import { TestAndVerifyComponent } from "./admin/test-and-verify/test-and-verify.component";
import { ConfigurationsComponent } from "./admin/configurations/configurations.component";
import { EditTemplateComponent } from "./admin/edit-template/edit-template.component";
import { DloginComponent } from "./admin/dlogin/dlogin.component";
import { PublishComponent } from "./admin/publish/publish.component";
import { SwaggeruiComponent } from "./admin/publish/swaggerui/swaggerui.component";

// import { FaqComponent } from './custom-components/faq/faq.component';
const routes: Routes = [
  // Home
  //{ path: '', component: SidemenuComponent },
  { path: "", component: KeycloakloginComponent, canActivate: [AuthGuard] },

  {
    path: "setting/:page",
    component: SidemenuComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "started/:page",
    component: SidemenuComponent,
    canActivate: [AuthGuard],
  },

  // Auth
  {
    path: "login",
    component: KeycloakloginComponent,
    canActivate: [AuthGuard],
  },
  { path: "logout", component: LogoutComponent },

  // Forms
  { path: "form/:form", component: FormsComponent },
  {
    path: "form/:form/:id",
    component: FormsComponent,
    canActivate: [AuthGuard],
  },

  // Layouts
  // { path: ':layout', component: LayoutsComponent, canActivate: [AuthGuard] },
  {
    path: "profile/:layout",
    component: LayoutsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "edit",
        component: PanelsComponent,
        outlet: "claim",
        children: [
          {
            path: ":form",
            component: EditPanelComponent,
          },
          {
            path: ":form/:id",
            component: EditPanelComponent,
          },
        ],
      },
      {
        path: "add",
        component: PanelsComponent,
        outlet: "claim",
        children: [
          {
            path: ":form",
            component: AddPanelComponent,
          },
        ],
      },
    ],
  },

  // Pages
  // { path: 'page/:page', component: PagesComponent },

  // Tables
  {
    path: ":entity/attestation/:table",
    component: TablesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ":entity/attestation/:table/:id",
    component: AttestationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ":entity/documents",
    component: DocumentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ":entity/documents/detail/view/:type/:id",
    component: DocDetailViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ":entity/documents/view/:type/:id",
    component: DocViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ":entity/documents/browse",
    component: BrowseDocumentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ":entity/documents/:type/add/:id",
    component: AddDocumentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ":entity/documents/add/:type",
    component: AddDocumentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ":entity/documents/add/:type/:id",
    component: AddDocumentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ":entity/documents/scan/vc",
    component: ScanQrCodeComponent,
    canActivate: [AuthGuard],
  },
  // { path: 'document/detail', component: DocDetailViewComponent, canActivate: [AuthGuard] },
  // { path: 'document/view/:id', component: DocViewComponent, canActivate: [AuthGuard] },
  { path: "discovery", component: SearchComponent },
  // Installation
  { path: "install", component: InstallComponent },

  // Custom
  // { path: 'faq', component: FaqComponent },

  //admin component
  {
    path: "get-started",
    component: GetStartedComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "create-entity",
    component: CreateEntityComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "create/:usecase",
    component: CreateEntityComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "create/:step/:usecase/:entity",
    component: CreateEntityComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "schema",
    component: CreateEntityComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "config-workflow",
    component: ConfigWorkflowComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "create-vc",
    component: CreateVcTemplateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "ownership",
    component: OwnershipComponent,
    canActivate: [AuthGuard],
  },
  { path: "home", component: SidemenuComponent, canActivate: [AuthGuard] },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "add-template",
    component: AddTemplateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit-template",
    component: EditTemplateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "add-template/:usecase/:entity",
    component: AddTemplateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit-template/:usecase/:entity",
    component: EditTemplateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "test-and-launch",
    component: TestAndLaunchComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "test-and-verify",
    component: TestAndVerifyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "configurations",
    component: ConfigurationsComponent,
    canActivate: [AuthGuard],
  },
  { path: "dlogin", component: DloginComponent, canActivate: [AuthGuard] },
  { path: "publish", component: PublishComponent },
  { path: "explore-api", component: SwaggeruiComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
