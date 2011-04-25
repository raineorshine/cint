/** Contains functions to connect to Wizard's XML services that report Server Status and Daily Events.
*/

/** Request a list of recent Magic Online tournaments from Wizard's XMLListService. Asynchronous.
	@calls onSuccess(data) where data is in the form: [{ Date, Hyperlink, Name }, ...]
*/

function requestTournamentListing(onSuccess, onFailure)
{
	var localProxy = "http://localhost/proxy.php";
	var proxyUrl = "http://www.wizards.com/handlers/XMLListService.ashx";
	var proxyParams = "dir=mtgo&type=XMLFileInfo&start=7";

    new Ajax.Request(
		"{0}?proxy_url={1}".format(localProxy, proxyUrl),
        {
            method: 'post',
            parameters: proxyParams,
            onSuccess: function(transport)
            {
                var json = eval('(' + transport.responseText + ')');
                if(onSuccess) {
					onSuccess(json);
				}
            },
            onFailure: onFailure
		}
    );
}

