
var localeStrings = [
	"editSignature",
	"editSignatureTitle",
	"createSignature",
	"createSignatureTitle",
	"options",
	"reinsert",
	"reinsertTitle",
	"removeButtonTitle",
	"default",
	"business",
	"family",
	"friends",
	"signatureHtmlCode",
	"dontKnowHtml",
	"clickHereForTutorial",
	"saveSignature",
	"deleteSignature",
	"deleteSignatureConfirmation",
	"cancelChanges",
	"signaturePreview",
	"general",
	"mostOptions",
	"debug",
	"donate",
	"donateTitle",
	"followBcgsOnFacebook",
	"developedBy",
	"signaturePosition",
	"aboveQuotedText",
	"belowQuotedText",
	"signatureLabels",
	"showReinsertButton",
	"showReinsertDesc",
	"showRemoveButton",
	"showRemoveDesc",
	"debugMode",
	"updateCheck",
	"updateCheckDesc",
	"debugModeNone",
	"debugModeJavascriptAlerts",
	"saveOptions",
	"storageMethod",
	"storageMethodDesc",
	"storageMethodLocalDesc",
	"storageMethodLocal",
	"storageMethodBrookmarkDesc",
	"storageMethodBrookmark",
	"cancel",
	"getSupportHere",
	"makeAContribution",
	"helpSupportDetails",
	"howMuchToContribute",
	"oneTimeDefault",
	"oneTimeAmount",
	"monthlyContribution",
	"leaveComment",
	"optional",
	"makeContribution",
	"noThanks",
	"usefulLinks",
	"projectHomePage",
	"gettingStartedGuide",
	"frequentlyAskedQuestions",
	"htmlTutorial",
	"signatureTemplates",
	"forums",
	"knownBugs",
	"versionHistory",
	"licenseAndUserAgreement",
	"projectContributors",
	"facebookPage",
	"promoteAndSupport",
	"promoteAndSupportIntro",
	"spreadTheWord",
	"spreadTheWordDetails",
	"projectsHomePage",
	"wheneverPossible",
	"writeAReview",
	"writingAReviewOnThe",
	"firefoxAddonPage",
	"helpsLetOthersKnow",
	"shareIt",
	"shareItDetails",
	"submitThisAddonTo",
	"makeADonation",
	"makeADonationDetails"
];

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	switch(request.name) {
		case "loadLocaleText":
			var localeText = {};
			for(var i = 0; i < localeStrings.length; i++) {
				var key = localeStrings[i];
				localeText[key] = chrome.i18n.getMessage(key); 	
			}			
			sendResponse(localeText);
			break;
		case "openGettingStarted":
			chrome.tabs.create({
				"url":"http://blankcanvasweb.com/pages/id_15/n_getting_started/"
			});
			break;
		case "getBookmarkFromStr":
			chrome.bookmarks.search(request.search, function(result) {
				if(result.length > 0)
					sendResponse(result[0]);
				else 
					sendResponse(false);
			});
			break;
		case "updateBookmark":
			chrome.bookmarks.update(request.id, {
				title:request.title
			}, function() {
				sendResponse();
			});
			break;
		case "createBookmark":
			chrome.bookmarks.create({
				parentId:'2',
				title:request.title,
				url:request.url
			}, function() {
				sendResponse();
			});
			break;
		default: sendResponse({}); // snub them.
	}
});
