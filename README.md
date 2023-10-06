 Here are the steps to set up the frontend for the Sunbird RC Admin Portal:

1. **Clone the Repository**:
   Clone the repository to your local machine using Git by running the following command in your terminal:

   ```bash
   git clone https://github.com/Sunbird-RC/Admin-Portal
   ```

2. **Navigate to the Root Folder**:
   Change your working directory to the root folder of the cloned repository:

   ```bash
   cd Admin-Portal
   ```

3. **Install Dependencies**:
   Install the required project dependencies using either Yarn or npm. You can choose either of the following commands:

   Using Yarn:

   ```bash
   yarn
   ```

   Using npm:

   ```bash
   npm install
   ```

   This command will download and install all the necessary dependencies specified in the project's `package.json` file.

4. **Configure Application Settings**:
   Inside the `admin-portal/src/assets/config` directory, you will find a `config.json` file. Open this file and update it with the configuration settings specific to your environment. This typically includes settings like the Keycloak configuration, base URLs, and any other environment-specific values.

   Example `config.json` file:

   ```json
   {
    "appType": "issuer",
    "keycloak": {
         "url": "https://domain/auth",
        "realm": "sunbird-rc",
        "clientId": "registry-frontend"
    },
    "baseUrl": "http://localhost:4200/registry/api/v1",
    "domainName": "https://domain",
    "footerText": "Issuance Portal",
    
   }
   ```

   Ensure that you replace `"your-realm-name"`, `"your-keycloak-url"`, `"your-client-id"`, `"your-api-base-url"`, and any other relevant values with your actual configuration.

5. **Run the Application**:
   After configuring the `config.json` file, you can start the application using Angular's development server. Run the following command:

   ```bash
   ng serve
   ```

   This command will compile and build the application and start a development server. You should see output indicating that the server is running.

6. **Access the Application**:
   Once the development server is running, you can access the Sunbird RC Admin Portal in your web browser by navigating to:

   ```
   http://localhost:4200/
   ```

  
