SharePoint ONLYOFFICE integration solution

	This solution enables users to edit office documents from SharePoint using ONLYOFFICE Document Server. Currently the following document formats can be edited: DOCX, XLSX, PPTX, TXT. The above mentioned formats are also available for viewing together with PDF.

	The solution will create a new Edit in ONLYOFFICE menu option within the context menu of the file and the ribbon for Office documents. This allows multiple users to collaborate in real time and to save back those changes to SharePoint.

Deploying SharePoint ONLYOFFICE integration solution

	Upload *.wsp package and script Install.ps1 
	Deploying an package to SharePoint using the script 
		
		.\Install.ps1 
	
Configuring SharePoint ONLYOFFICE integration solution
	
	In SharePoint open the ~/_layouts/15/Onlyoffice/Settings.aspx page with administrative settings. Enter the following address to connect ONLYOFFICE Document Server:
		
		https://<documentserver>/
	
	Where the documentserver is the name of the server with the ONLYOFFICE Document Server installed. The address must be accessible for the user browser and from the SharePoint server. The SharePoint server address must also be accessible from ONLYOFFICE Document Server for correct work.
	
How it works
	
	User navigates to a document within SharePoint and selects the Edit in ONLYOFFICE action on context menu or ribbon.
	
	SharePoint ONLYOFFICE solution makes a request to the editor page(URL of the form: /_layouts/15/Onlyoffice/editorPage.aspx?SPListItemId={SelectedItemId}&SPListId={SelectedListId}&SPSource={Source}&SPListURLDir={ListUrlDir})
	
	SharePoint ONLYOFFICE solution prepares a JSON object with the following properties:
		url - the URL that ONLYOFFICE Document Server uses to download the document;
		callback - the URL that ONLYOFFICE Document Server informs about status of the document editing;
		documentServerUrl - the URL that the client needs to reply to ONLYOFFICE Document Server (can be set at the settings page);
		key - user id from SharePoint;
		fileName - the document Title (name);
		userId - the identification of the user;
		userName - the name of the user.
	
	SharePoint ONLYOFFICE solution constructs a page, filling in all of those values so that the client browser can load up the editor.
	
	The client browser makes a request for the javascript library from ONLYOFFICE Document Server and sends ONLYOFFICE Document Server the DocEditor configuration with the above properties.
	
	Then ONLYOFFICE Document Server downloads the document from SharePoint and the user begins editing.
	
	When all users and client browsers are done with editing, they close the editing window.
	
	After 10 seconds of inactivity, ONLYOFFICE Document Server sends a POST to the callback URL letting SharePoint ONLYOFFICE solution know that the clients have finished editing the document and closed it.
	
	SharePoint ONLYOFFICE solution downloads the new version of the document, replacing the old one.
	
