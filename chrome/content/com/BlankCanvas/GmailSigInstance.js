/* Blank Canvas Gmail Signatures [http://blankcanvas.me/gmailsignatures/]
 * Copyright (c) 2009, 2010 Jerome Dane <http://blankcanvas.me/contact/>  
 * 
 * This file is part of the Blank Canvas Gmail Signatures. Please see /readme.md for
 * more information, credits, and author requests. 
 * 
 * BC Gmail Signatures is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

if(!com) { var com = {}; }
if(!com.BlankCanvas) { com.BlankCanvas = {}; }

com.BlankCanvas.GmailSigInstance = function(gmailInstance){
	this.debug = function(str) {
		if(bcgs.getPref('debugMode') == 'alert') {
			alert("com.BlankCanvas.GmailSigInstance:\n\n" + str);
		} else {
			throw new Error("com.BlankCanvas.GmailSigInstance:\n\n" + str);
		}
	}
	try {
		this.$ = gmailInstance.$;
		
		this.gmail = gmailInstance;
		this.wrappers = {};
		var sigInst = this;
		sigInst.gmail.unsafeWin.addEventListener('unload', function() {
			sigInst = null;
			delete sigInst;
		}, true);
		
		var bcgs = com.BlankCanvas.GmailSignatures;
		//----------------------- View Change ---------------------
		this.viewChange = function() {
			switch(sigInst.gmail.getActiveViewType()) {
				case 'co':
					sigInst.gmail.registerMessageBoxHandler(sigInst.composeContext);
					break;
				case 'cv':
					sigInst.gmail.registerMessageBoxHandler(sigInst.conversationContext);
					break;
			}
		}
		//----------------------- Compose Context -----------------
		this.composeContext = function() {
			try {
				if (sigInst.gmail.isTearOut) 
					sigInst.conversationContext();
				else {
					sigInst.selectedSigType = {}; // reset selected signature type to default
					var fromSelector = sigInst.gmail.getFromSelect();
					if (fromSelector) 
						fromSelector.addEventListener('change', sigInst.insertSignatureAndUpdateTools, true);
					sigInst.drawToolsForActiveView();
					sigInst.insertSignature();
				}
			} catch(e) { sigInst.debug("composeContext()\n\n" + e); } 
		}
		//----------------------- Compose Context -----------------
		this.conversationContext = function() {
			try {
				sigInst.drawToolsForActiveView();
				// insert sig
				sigInst.insertSignature(sigInst.gmail.getFromAddress());
				// listen for message box gone
				sigInst.gmail.registerMessageBoxGoneHandler(sigInst.viewChange);
				// listen for from select
				sigInst.gmail.registerFromSelectHandler(function(fromSelect) {
					sigInst.selectedSigType = {};	// reset selected signature type to default
					sigInst.insertSignatureAndUpdateTools();
					sigInst.gmail.getFromSelect().addEventListener('change', sigInst.insertSignatureAndUpdateTools, false);
				});
			} catch(e) { sigInst.debug("conversationContext()\n\n" + e); } 
		}
		//----------------------- drawToolsAfter -----------------
		this.drawToolsAfter = function(elem) {
			try {
				sigInst.getCurrentSignature(function(currentSig) {
					sigInst.selectedSigType = typeof(sigInst.selectedSigType) == 'undefined' ? {} : sigInst.selectedSigType;
					sigInst.wrappers.tools = typeof(sigInst.wrappers.tools) == 'undefined' ? sigInst.gmail.createElement('span') : sigInst.wrappers.tools;
					sigInst.wrappers.tools.innerHTML = '';	// reset tools
					sigInst.wrappers.tools.setAttribute('style', 'margin-left:.5em;');
					// signature type
					var sigSelect = sigInst.gmail.createElement('select');
					sigSelect.id = 'bcGmailSigsSigTypeSelector';
					sigSelect.setAttribute('style', 'font-size:80%');
					sigSelect.addEventListener('change', function() {
						sigInst.selectedSigType[sigInst.gmail.getFromAddress()] = this.selectedIndex;
						sigInst.insertSignatureAndUpdateTools();
					}, true);
					var optionsHtml = '';
					for(var i = 1; i < 5; i++) {
						var selectedTypeIndex = typeof(sigInst.selectedSigType[sigInst.gmail.getFromAddress()]) != 'undefined' ? sigInst.selectedSigType[sigInst.gmail.getFromAddress()] : 0;
						optionsHtml += '<option' + (i == selectedTypeIndex + 1 ? ' selected="selected"' : '') + '>' + unescape(bcgs.getPref('label' + i)) + '</option>';
					}
					sigSelect.innerHTML = optionsHtml;	
					sigInst.$(sigInst.wrappers.tools).append(sigSelect);
					// create/edit button
					var createEdit = bcgs.formatIconButton(sigInst.gmail.createElement('img'));
					createEdit.addEventListener('click', sigInst.showSignatureEdit, true);
					createEdit.src = currentSig == '' ? bcgs.icons.signatureCreate : bcgs.icons.signatureEdit;
					createEdit.title = currentSig == '' ? bcgs.getText('createSignature') : bcgs.getText('editSignature');
					sigInst.$(sigInst.wrappers.tools).append(createEdit);
					// reinsertButton
					if(bcgs.getPref('showReinsert') == 'true') {
						var reinsertButton = bcgs.formatIconButton(sigInst.gmail.createElement('img'));
						reinsertButton.src = bcgs.icons.signatureReinsert;
						reinsertButton.title = bcgs.getText('reinsertTitle');
						sigInst.$(reinsertButton).click(sigInst.insertSignature);
						sigInst.$(sigInst.wrappers.tools).append(reinsertButton);
					}
					// remove button
					if(bcgs.getPref('showRemove') == 'true') {
						var removeButton = bcgs.formatIconButton(sigInst.gmail.createElement('img'));
						removeButton.src = bcgs.icons.signatureRemove;
						removeButton.title = bcgs.getText('removeButtonTitle');
						sigInst.$(removeButton).click(sigInst.removeSignature);
						sigInst.$(sigInst.wrappers.tools).append(removeButton);
					}
					// options button
					var button = bcgs.formatIconButton(sigInst.gmail.createElement('img'));
					button.src = bcgs.icons.signatureOptions;
					button.title = "Blank Canvas Gmail Signatures - " + bcgs.getText('options');
					sigInst.$(button).click(sigInst.showSignatureOptions);
					sigInst.$(sigInst.wrappers.tools).append(button);
					sigInst.$(elem).after(sigInst.wrappers.tools);
				});
			} catch(e) {
				sigInst.debug("drawToolsAfter()\n\n" + e); 
			}
		}
		//----------------------- drawToolsForCompose ------------
		this.drawToolsForActiveView = function() {
			try {
				var fromSelect = sigInst.gmail.getFromSelect();
				var discardButton = null;
				function getTargetWhenNoSelector() {
					discardButton = sigInst.gmail.getDiscardButton();
					return com.BlankCanvas.BrowserDetect.browser == 'Chrome' ?
						sigInst.$(discardButton).parent() :
						discardButton;
				}
				switch(sigInst.gmail.getActiveViewType()) {
					case 'co':
						var elem = fromSelect ? fromSelect : getTargetWhenNoSelector();
						sigInst.drawToolsAfter(elem);
						break;
					case 'cv':
						if(fromSelect)
							sigInst.drawToolsAfter(fromSelect);
						else {
							var fromHiddenInput = sigInst.$('input[name="from"]', sigInst.gmail.getActiveElement());
							var elem = fromHiddenInput.size() == 1 ? fromHiddenInput : getTargetWhenNoSelector();
							sigInst.drawToolsAfter(elem);
						}
						break;
				}
				// implement fix for Chrome selector not expanding bug
				if(discardButton && com.BlankCanvas.BrowserDetect.browser == 'Chrome') {
					var wrapper = sigInst.$('#bcGmailSigsSigTypeSelector').parent();
					wrapper.css('position', 'absolute');
					//alert(sigInst.$(discardButton).position().left);
					wrapper.css('top', (sigInst.$(discardButton).position().top + 2) + 'px');
					wrapper.css('left', (sigInst.$(discardButton).position().left + sigInst.$(discardButton).width() + 10) + 'px');
				}
			} catch(e) {
				sigInst.debug("drawToolsForActiveView()\n\n" + e); 
			}
		}
		//---------------------- getCurrentSignature -------------
		this.getCurrentSignature = function(callback) {
			try {
				bcgs.getSignature(sigInst.getCurrentSignatureKey(), function(sig) {
					callback(sig);
				});				
			} catch(e) {
				sigInst.debug("drawToolsForActiveView()\n\n" + e); 
			}
		}
		//---------------------- getCurrentSignature -------------
		this.getCurrentSignatureKey = function() {
			try {
				var selector = sigInst.$('#bcGmailSigsSigTypeSelector', sigInst.gmail.getActiveElement());
				var index = selector.size() == 1 ? selector[0].selectedIndex : 0;
				var sigVersion = index == 0 ? '' : index + 1;
				return sigInst.gmail.getFromAddress() + sigVersion.toString();
			} catch(e) { sigInst.debug("getCurrentSignatureKey()\n\n" + e); }
		}
		//---------------------- hideSignatureEdit -------------
		this.hideDonationBox = function() {
			try {
				var activeElement = sigInst.gmail.getActiveElement();
				sigInst.$('#bcGmailSigsDonateWrapper', activeElement).remove();
			} catch(e) { sigInst.debug("hideDonationBox()\n\n" + e); }
		}
		//---------------------- hideSignatureEdit -------------
		this.hideSignatureEdit = function() {
			try {
				var activeElement = sigInst.gmail.getActiveElement();
				sigInst.$('#bcGmailSigsEditWrapper', activeElement).remove();
			} catch(e) { sigInst.debug("hideSignatureEdit()\n\n" + e); }
		}
		//---------------------- hideSignatureOptions -------------
		this.hideSignatureOptions = function() {
			try {
				var activeElement = sigInst.gmail.getActiveElement();
				sigInst.$('#bcGmailSigsOptionsWrapper', activeElement).remove();
				sigInst.hideDonationBox();
			} catch(e) { sigInst.debug("hideSignatureOptions()\n\n" + e); }
		}
		//---------------------- insertSignature -----------------
		this.insertSignatureAndUpdateTools = function() {
			sigInst.drawToolsForActiveView();
			sigInst.insertSignature();
			sigInst.updateSignatureEditBox();
		}
		//---------------------- insertSignature -----------------
		this.insertSignature = function() {
			try {
				// create wrapper
				var messageIframe = sigInst.gmail.getMessageIframe(); 
				if (messageIframe) {
					sigInst.getCurrentSignature(function(sigHtml) {
						var key = com.BlankCanvas.md5(sigInst.gmail.getPrimaryEmailAddress()).match(/^.{10}/)[0];
						var messageElement = messageIframe.contentDocument.body;
						var existingSig = sigInst.$('div[name=sig_' + key + ']', messageElement);
						var newSig = existingSig.size() > 0 ? existingSig[0] : messageIframe.contentDocument.createElement('div');
						newSig.innerHTML = sigHtml;
						newSig.setAttribute('name', 'sig_' + key);
						newSig.style.margin = sigHtml == '' ? '0pt' : '2em 0pt';
						var quoteElement = sigInst.$('div.gmail_quote', messageElement);
						if (quoteElement.size() > 0) {
							if(bcgs.getPref('sigPosition') == 'below') sigInst.$(quoteElement[0]).after(newSig);
							else sigInst.$(quoteElement[0]).before(newSig);
						} else if (existingSig.size() == 0) sigInst.$(messageElement).append(newSig);	
					});
				}
			} catch(e) { sigInst.debug("insertSignature()\n\n" + e); }
		}
		//---------------------- insertSignature -----------------
		this.removeSignature = function() {
			try {
				var messageIframe = sigInst.gmail.getMessageIframe(); 
				var messageElement = messageIframe.contentWindow.document.body;
				var key = com.BlankCanvas.md5(sigInst.gmail.getPrimaryEmailAddress()).match(/^.{10}/)[0];
				var existingSig = sigInst.$('div[name=sig_' + key + ']', messageElement);
				if(existingSig.size() > 0)
					existingSig.remove();
			} catch(e) { sigInst.debug("removeSignature()\n\n" + e); }
		}
		//---------------------- saveOptions ------------------
		this.saveOptions = function() {
			try {			
				var activeElement = sigInst.gmail.getActiveElement();
				var oldPosition = bcgs.getPref('sigPosition');
				var newPosition = sigInst.$('#bcGmailSigsSigPositionOption', activeElement).attr('value'); 
				bcgs.setCharPref('sigPosition', newPosition);
				if(oldPosition != newPosition) sigInst.insertSignature(true);
				bcgs.setCharPref('label1', escape(sigInst.$('#bcGmailSigsLabel1Option', activeElement).attr('value')));
				bcgs.setCharPref('label2', escape(sigInst.$('#bcGmailSigsLabel2Option', activeElement).attr('value')));
				bcgs.setCharPref('label3', escape(sigInst.$('#bcGmailSigsLabel3Option', activeElement).attr('value')));
				bcgs.setCharPref('label4', escape(sigInst.$('#bcGmailSigsLabel4Option', activeElement).attr('value')));
				bcgs.setCharPref('showReinsert', sigInst.$('#bcGmailSigsReinsertButtonOption', activeElement)[0].checked ? 'true' : 'false');
				bcgs.setCharPref('showRemove', sigInst.$('#bcGmailSigsRemoveButtonOption', activeElement)[0].checked ? 'true' : 'false');
				bcgs.setCharPref('storageMethod', sigInst.$('#bcGmailSigsStorageModeOption', activeElement).attr('value'));
				bcgs.setCharPref('debugMode', sigInst.$('#bcGmailSigsDebugModeOption', activeElement).attr('value'));
				this.insertSignature();
			} catch(e) { sigInst.debug("saveOptions()\n\n" + e); }
		}
		//---------------------- saveSignature -----------------
		this.saveSignature = function() {
			try {
				var activeElement = sigInst.gmail.getActiveElement();
				bcgs.saveSignature(sigInst.getCurrentSignatureKey(), sigInst.$('#bcGmailSigsEditSig', activeElement).attr('value'), function() {
					sigInst.hideSignatureEdit();
					sigInst.insertSignatureAndUpdateTools();
				});
			} catch(e) { sigInst.debug("saveSignature()\n\n" + e); }
		}
		//---------------------- showDonateBox ------------------
		this.showDonateBox = function() {
			try {
				var wrapper = sigInst.gmail.createElement('div')
				wrapper.id = 'bcGmailSigsDonateWrapper';
				wrapper.setAttribute('style', 'z-index:3000; position:fixed; top:50px; left:0; width:100%;');
				wrapper.innerHTML ='\
					<style type="text/css">\
						#bcGmailSigsDonateForm a { text-decoration:none;  }\
						#bcGmailSigsDonateForm a:hover { text-decoration:underline;  }\
						#bcGmailSigsDonateForm li { padding-bottom:.5em;  }\
					</style>\
					<form id="bcGmailSigsDonateForm" method="GET" action="https://addons.mozilla.org/en-US/firefox/addons/contribute/7757" target="_blank" style="background-color:#fff; width:500px; margin:auto; margin-top:10px; -moz-box-shadow:0 0 15px rgba(0, 0, 0, 0.5); -moz-border-radius:10px; border:1px solid black; padding:1em; font-size:small;">\
						<input type="hidden" value="addon-detail" name="source">\
						<h3 style="margin-top:0;">' + bcgs.getText('makeAContribution') + '</h3>\
						<p>' + bcgs.getText('helpSupportDetails') + '</p>\
						<h4>' + bcgs.getText('howMuchToContribute') + '</h4>\
						<ul style="list-style-type:none;">\
							<li onclick="document.getElementById(\'contrib-suggested\').checked = true;"><input type="radio" checked="checked" id="contrib-suggested" value="suggested" name="type">\
								<label for="contrib-suggested">' + bcgs.getText('oneTimeDefault') + ' $5.00</label></li>\
							<li onclick="document.getElementById(\'contrib-onetime\').checked = true; document.getElementById(\'onetime-amount-input\').focus()"><input type="radio" id="contrib-onetime" value="onetime" name="type">\
								<label>' + bcgs.getText('oneTimeAmount') + ' $ <input type="text" value="" name="onetime-amount" id="onetime-amount-input" style="width:4em;"></label></li>\
							<li onclick="document.getElementById(\'contrib-monthly\').checked = true; document.getElementById(\'monthly-amount-input\').focus();"><input type="radio" id="contrib-monthly" value="monthly" name="type">\
								<label for="contrib-monthly">' + bcgs.getText('monthlyContribution') + ' $ <input type="text" value="" name="monthly-amount" id="monthly-amount-input" style="width:4em;"></label></li>\
						</ul>\
						<label for="contrib-comment">' + bcgs.getText('leaveComment') + '</label> <span style="margin-left:2em;">(' + bcgs.getText('optional') + ')</span>\
						<textarea id="contrib-comment" name="comment" style="width:90%; margin:.5em 0; height:6em;"></textarea>\
						<input class="bcGmailSigsCommunityButton" type="submit" id="bcGmailSigsDonateSubmitButton" value="' + bcgs.getText('makeContribution') + '"/>\
						<a href="javascript:void(0)" id="bcGmailSigsCancelDonationButton" style="margin-left:5em;">' + bcgs.getText('noThanks') + '</a>\
					</form>';
				var activeElement = sigInst.gmail.getActiveElement();
				sigInst.$(activeElement).append(wrapper);
				sigInst.$('#bcGmailSigsCancelDonationButton', activeElement).click(sigInst.hideDonationBox);
				sigInst.$('#bcGmailSigsDonateForm', activeElement).submit(function() {
					setTimeout(sigInst.hideDonationBox, 1000);
				});
			} catch(e) { sigInst.debug("showDonateBox()\n\n" + e); }
		}
		//---------------------- showSignatureEdit -------------
		this.showSignatureEdit = function() {
			function getButtonHtml(id, text) {
				return '<div id="' + id + '" class="J-Zh-I J-J5-Ji Bq L3" tabindex="1" style="-webkit-user-select: none; font-size:12px;">' + text + '</div>';
			}
			//var sigInst = this;
			try {
				sigInst.getCurrentSignature(function(currentSig) {
					sigInst.hideSignatureEdit();
					sigInst.hideSignatureOptions();
					var activeElement = sigInst.gmail.getActiveElement();
					var editWrapper = sigInst.gmail.createElement('tr');
					editWrapper.id = "bcGmailSigsEditWrapper";
					for(var i = 0; i < 3; i++) {
						var td = sigInst.gmail.createElement('td');
						if(i != 1)
							td.innerHTML = '&nbsp;';
						else {
							td.setAttribute('style', 'padding:1em 0 .5em 0; font-size:12px;');
							var html = '<strong>' + bcgs.getText('signatureHtmlCode') + ':</strong> &nbsp;&nbsp; (' + bcgs.getText('dontKnowHtml') + ' <a href="http://blankcanvas.me/pages/detail/id_12/n_html_tutorials/" target="_blank">' + bcgs.getText('clickHereForTutorial') + '</a>)\
									<textarea id="bcGmailSigsEditSig" style="width:100%; height:200px; padding:.2em; font:small Arial,sans-serif; border:1px solid #979797; margin-top:.2em;"></textarea>\
									<div style="margin:.5em 0; text-align:right;">' +
										getButtonHtml("bcGmailSigsSaveSigButton", bcgs.getText('saveSignature')) +
										(currentSig != '' ? getButtonHtml("bcGmailSigsDeleteSigButton", bcgs.getText('deleteSignature')) : '') +
										getButtonHtml("bcGmailSigsCancelSigEditButton", bcgs.getText('cancelChanges')) +
									'</div>\
									<div style="margin-top:-2em;"><strong>' + bcgs.getText('signaturePreview') + ':</strong></div>\
									<iframe id="bcGmailSigsPreviewFrame" style="border:none; width:100%; height:125px; padding:0; background-color:inherit;"/>';
							td.innerHTML = html;
						}
						sigInst.$(editWrapper).append(td);
					}
					sigInst.$('form table tr:eq(0)', activeElement).after(editWrapper);
					sigInst.$('#bcGmailSigsEditSig', activeElement).keyup(sigInst.updateSignaturePreview);
					sigInst.$('#bcGmailSigsCancelSigEditButton', activeElement).click(sigInst.hideSignatureEdit);
					sigInst.$('#bcGmailSigsDeleteSigButton', activeElement).click(function() {
						if(confirm(bcgs.getText('deleteSignatureConfirmation'))) {
							var editBox = sigInst.$('#bcGmailSigsEditSig', activeElement);
							if(editBox.size() == 1) editBox[0].innerHTML = '';
							sigInst.saveSignature();
						}			
					});
					sigInst.$('#bcGmailSigsSaveSigButton', activeElement).click(sigInst.saveSignature);
					sigInst.$('#bcGmailSigsPreviewFrame', activeElement).load(sigInst.updateSignaturePreview);
					sigInst.updateSignatureEditBox();
				});
			} catch(e) { sigInst.debug("showSignatureEdit()\n\n" + e); }
		}
		//---------------------- showSignatureOptions -------------
		this.showSignatureOptions = function() {
			try {
				var extensionPageUrl = "";
				var browser = com.BlankCanvas.BrowserDetect.browser;
				switch(browser) {
					case 'Firefox': extensionPageUrl = "https://addons.mozilla.org/en-US/firefox/addon/7757"; break;
					case 'Chrome': extensionPageUrl = "https://chrome.google.com/extensions/detail/ijdoblggemelaimffjccmdbmodlppofd"; break;
				}
				sigInst.hideSignatureEdit();
				sigInst.hideSignatureOptions();
				var activeElement = sigInst.gmail.getActiveElement();
				var optionsWrapper = sigInst.gmail.createElement('tr');
				optionsWrapper.id = "bcGmailSigsOptionsWrapper";
				for(var i = 0; i < 3; i++) {
					var td = sigInst.gmail.createElement('td');
					if(i != 1)
						td.innerHTML = '&nbsp;';
					else {
						td.setAttribute('style', 'padding:1em 0 .5em 0; font-size:12px;');
						td.innerHTML = '<div style="border:1px solid ; padding:1em; background-color:#fff;">\
							<style type="text/css">\
								.bcGmailSigsCommunityButton { -moz-border-radius:16px; margin-left:.5em; padding:.5em .8em .5em .5em; font-weight:bold; color:#fff; text-decoration:none; line-height:2em; background-image:url(' + bcgs.images.contributeButtonBg + '); border:1px solid #3493FE; text-shadow:-1px -1px 1px #196CF2; cursor:pointer; }\
								.bcGmailSigsCommunityButton img { margin-right:.5em; border:none; vertical-align:middle; }\
								#bcGmailSigLabelOptionsWrapper input { width:6em; }\
							</style>\
							<div style="width:300px; float:right; text-align:right;">\
      							<span class="bcGmailSigsCommunityButton" id="bcGmailSigsDonateButton" title="' + bcgs.getText('donateTitle') + '">\
							       <nobr><img src="' + bcgs.images.whiteHeart + '">' + bcgs.getText('donate') + '</nobr></span>\
								<a href="http://www.facebook.com/pages/Blank-Canvas-Gmail-Signatures/254402756442" style="margin-left:1em;" target="_blank" title="' + bcgs.getText('followBcgsOnFacebook') + '"><img src="' + bcgs.images.facebookPage + '" style="border:none; vertical-align:middle; height:30px;"/></a>\
							</div>\
							<a href="http://blankcanvas.me/gmailsignatures/" target="_blank">\
								<img src="' + bcgs.images.bcLogo + '" align="absmiddle" style="border:none; float:left; margin-right:1em;" />\
							</a>\
							<div style="margin-top:10px; font-size:16px;"><strong>Blank Canvas Gmail Signatures</strong></div>\
							<span style="font-size:11px; font-weight:normal;">' + bcgs.getText('developedBy') + ' Jerome Dane</span>\
							<div style="width:220px; float:right; clear:left; padding-left:20px;">\
								<p><strong>' + bcgs.getText('usefulLinks') + '</strong></p>\
								<ul id="bcGmailSigsLinks" style="padding-left:20px;">\
									<li><a href="http://blankcanvas.me/gmailsignatures/" target="_blank">' + bcgs.getText('projectHomePage') + '</a></li>\
									<li><a href="http://blankcanvas.me/pages/detail/id_15/n_getting_started/" target="_blank">' + bcgs.getText('gettingStartedGuide') + '</a></li>\
									<li><a href="http://blankcanvas.me/pages/detail/id_14/n_faq/" target="_blank">' + bcgs.getText('frequentlyAskedQuestions') + '</a></li>\
									<li><a href="http://blankcanvas.me/pages/detail/id_12/n_html_tutorials/" target="_blank">' + bcgs.getText('htmlTutorial') + '</a></li>\
									<li><a href="http://blankcanvas.me/pages/detail/id_13/n_templates/" target="_blank">' + bcgs.getText('signatureTemplates') + '</a></li>\
									<li><a href="http://blankcanvas.me/forums/id_1/n_bc_gmail_signatures/" target="_blank">' + bcgs.getText('forums') + '</a></li>\
									<li><a href="http://blankcanvas.me/pages/detail/id_11/n_known_bugs/" target="_blank">' + bcgs.getText('knownBugs') + '</a></li>\
									<li><a href="http://blankcanvas.me/pages/detail/id_10/n_version_history/" target="_blank">' + bcgs.getText('versionHistory') + '</a></li>\
									<li><a href="http://blankcanvas.me/pages/detail/id_43/n_license_eula/" target="_blank">' + bcgs.getText('licenseAndUserAgreement') + '</a></li>\
									<li><a href="http://blankcanvas.me/pages/detail/id_47/n_project_contributors/" target="_blank">' + bcgs.getText('projectContributors') + '</a></li>\
								</ul>\
							</div>\
							<div style="margin:3em;">\
								<p><strong>' + bcgs.getText('signaturePosition') + '</strong>\
									<select id="bcGmailSigsSigPositionOption">\
										<option value="above">' + bcgs.getText('aboveQuotedText') +'</option>\
										<option value="below"' + (bcgs.getPref('sigPosition') == 'below' ? ' selected="Selected"' : '') + '>' + bcgs.getText('belowQuotedText') +'</option>\
									</select>\
								</p>\
								<p id="bcGmailSigLabelOptionsWrapper"><strong>' + bcgs.getText('signatureLabels') + '</strong>\
									<input type="text" id="bcGmailSigsLabel1Option" value="' + unescape(bcgs.getPref('label1')) + '"/>\
									<input type="text" id="bcGmailSigsLabel2Option" value="' + unescape(bcgs.getPref('label2')) + '"/>\
									<input type="text" id="bcGmailSigsLabel3Option" value="' + unescape(bcgs.getPref('label3')) + '"/>\
									<input type="text" id="bcGmailSigsLabel4Option" value="' + unescape(bcgs.getPref('label4')) + '"/>\
								</p>\
								<p><strong>' + bcgs.getText('showReinsertButton') + '</strong> <input type="checkbox" id="bcGmailSigsReinsertButtonOption"' +
									(bcgs.getPref('showReinsert') == 'true' ? ' checked="checked"' : '') +
								'/> - ' + bcgs.getText('showReinsertDesc') + '</p>\
								<p><strong>' + bcgs.getText('showRemoveButton') + '</strong> <input type="checkbox" id="bcGmailSigsRemoveButtonOption"' +
									(bcgs.getPref('showRemove') == 'true' ? ' checked="checked"' : '') +
								'/> - ' + bcgs.getText('showRemoveDesc') + '</p>\
								<p><strong>' + bcgs.getText('storageMethod') + '</strong> <select id="bcGmailSigsStorageModeOption">\
										<option value="" title="' + bcgs.getText('storageMethodLocalDesc') + '">' + bcgs.getText('storageMethodLocal') + '</option>\
										<option value="bookmark"' + (bcgs.getPref('storageMethod') == 'bookmark' ? ' selected="selected"' : '') + ' title="' + bcgs.getText('storageMethodBrookmarkDesc') + '">' + bcgs.getText('storageMethodBrookmark') + '</option>\
									</select> - ' + bcgs.getText('storageMethodDesc') + '\
								</p>\
								<p><strong>' + bcgs.getText('debugMode') + '</strong> <select id="bcGmailSigsDebugModeOption">\
										<option value="none">' + bcgs.getText('debugModeNone') + '</option>\
										<option value="alert"' + (bcgs.getPref('debugMode') == 'alert' ? ' selected="selected"' : '') + '>' + bcgs.getText('debugModeJavascriptAlerts') + '</option>\
									</select>\
								</p>\
								<p align="right" style="width:500px;">\
									<input type="button" value="' + bcgs.getText('saveOptions') + '" id="bcGmailSigsSaveOptionsButton"/> &nbsp;\
									<input type="button" value="' + bcgs.getText('cancel') + '" id="bcGmailSigsSaveCancelButton"/>\
								</p>\
							</div>\
							<style type="text/css">\
								#bcGmailSigsLinks li { margin-bottom:.4em; }\
								#bcGmailSigsLinks li a { text-decoration:underline; color:#0033CC; }\
								#bcGmailSigsLinks li a:hover { text-decoration:none; }\
							</style>\
							<p><span style="font-size:14px; font-weight:bold">' + bcgs.getText('promoteAndSupport') + '</span></p>\
							<p>' + bcgs.getText('promoteAndSupportIntro') + '</p>\
							<p><strong>' + bcgs.getText('spreadTheWord') + '</strong> - ' + bcgs.getText('spreadTheWordDetails') + ' \
								<a href="http://blankcanvas.me/gmailsignatures/" target="_blank" style="color:#0033CC">' + bcgs.getText('projectsHomePage') + '</a>\
									' + bcgs.getText('wheneverPossible') + '. \
							</p>\
							<p><strong>' + bcgs.getText('writeAReview') + '</strong> - ' + bcgs.getText('writingAReviewOnThe') + ' \
								<a href="' + extensionPageUrl + '" target="_blank" style="color:#0033CC">' + bcgs.getText('firefoxAddonPage') + '</a> \
								' + bcgs.getText('helpsLetOthersKnow') + '.\
							</p>\
							<p><strong><a href="http://blankcanvas.me/pages/id_133/n_donate/" target="_blank">' + bcgs.getText('makeADonation') + '</a></strong> - ' + bcgs.getText('makeADonationDetails') + '</p>\
						</div>';
					}
					sigInst.$(optionsWrapper).append(td);
				}
				sigInst.$('form table tr:eq(0)', activeElement).after(optionsWrapper);
				sigInst.$('#bcGmailSigsDonateButton', activeElement).click(sigInst.showDonateBox);
				sigInst.$('#bcGmailSigsSaveCancelButton', activeElement).click(sigInst.hideSignatureOptions);
				sigInst.$('#bcGmailSigsSaveOptionsButton', activeElement).click(function(){
					sigInst.saveOptions();
					sigInst.hideSignatureOptions();
					sigInst.drawToolsForActiveView();
				});
				// hide storage options if not in Firefox
				/*
				if (com.BlankCanvas.BrowserDetect.browser != 'Firefox')	
					sigInst.$('#bcGmailSigsStorageModeOption').parent().hide();
				*/
			} catch(e) { sigInst.debug("showSignatureOptions()\n\n" + e); }
		}
		//---------------------- updateSignatureEditBox -------------
		this.updateSignatureEditBox = function() {
			try {
				var activeElement = sigInst.gmail.getActiveElement();
				var editBox = sigInst.$('#bcGmailSigsEditSig', activeElement);
				if(editBox.size() == 1) {
					sigInst.getCurrentSignature(function(sig) {
						switch(com.BlankCanvas.BrowserDetect.browser) {
							case 'Firefox':
								editBox[0].innerHTML = sig;
								break;
							case 'Chrome':
								editBox[0].innerHTML = sig;
								editBox[0].value = sig;
								break;
						}
						sigInst.updateSignaturePreview();
					});		
				}
			} catch(e) { sigInst.debug("updateSignatureEditBox()\n\n" + e); }
		}
		//---------------------- updateSignaturePreview -------------
		this.updateSignaturePreview = function() {
			try {
				var activeElement = sigInst.gmail.getActiveElement();
				var html = sigInst.$('#bcGmailSigsEditSig', activeElement).attr('value');
				var iframe = sigInst.$('#bcGmailSigsPreviewFrame', activeElement);
				if(iframe.size() == 1) {
					var iframeBody = iframe[0].contentDocument.body; 
					iframeBody.setAttribute('style', 'font-family:Arial,sans-serif; font-size:small; padding:.75em 0 0;');
					iframeBody.innerHTML = html;
				}
			} catch(e) { sigInst.debug("updateSignaturePreview()\n\n" + e); }
		}
		// register view change handler
		this.gmail.registerViewChangeCallback(sigInst.viewChange);
	} catch(e) { this.debug(e); }
}