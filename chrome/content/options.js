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

function onCancel() {
	return true; 
}
function onLoad() {
	// not used at the moment
}

window.addEventListener("load", function() {
	try {
		var bcgs = com.BlankCanvas.GmailSignatures;
		bcgs.init();
		document.title += ' v' + bcgs.getVersion();
		
		// load language
		document.getElementById('generalTab').label = bcgs.getText('general');
		document.getElementById('labelMostOptions').value = bcgs.getText('mostOptions');
		document.getElementById('linksTab').label = bcgs.getText('usefulLinks');
		document.getElementById('labelHomePage').value = bcgs.getText('projectHomePage');
		document.getElementById('labelFacebookPage').value = bcgs.getText('facebookPage');
		document.getElementById('labelGetSupport').value = bcgs.getText('getSupportHere');
		document.getElementById('debugTab').label = bcgs.getText('debug');
		document.getElementById('labelDebugMode').value = bcgs.getText('debugMode');
		document.getElementById('debugModeOptionNone').label = bcgs.getText('debugModeNone');
		document.getElementById('debugModeOptionAlert').label = bcgs.getText('debugModeJavascriptAlerts');
		document.getElementById('debugModeOption').selectedIndex = bcgs.getPref('debugMode') == 'alert' ? 1 : 0;
		
		window.addEventListener("unload", function() {
			bcgs.setCharPref('debugMode', document.getElementById('debugModeOption').value);
		}, true);		
		
	} catch(e) {
		if(bcgs.getPref('debugMode') == 'alert') alert("Error in Bc Gmail Sigs Options Dialog:\n\n" + e);
	}
}, true);