/* Blank Canvas Signatures for Gmail [http://blankcanvas.me/gmailsignatures/]
 * Copyright (c) 2009, 2010 Jerome Dane <http://blankcanvas.me/contact/>  
 * 
 * This file is part of the Blank Canvas Signatures for Gmail. Please see /readme.md for
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

/* This is the bootstrap file for Google Chrome */

if(!com) { var com = {} }
if(!com.BlankCanvas) { com.BlankCanvas = {} }

$ = getJqueryInstance();

window.addEventListener("load", function() {
	com.BlankCanvas.GmailSignatures.init(function() { 
		// console.log('com.BlankCanvas.GmailSignatures.init executed');
		function gmailResult(gmailInstance) {
			console.log('com.BlankCanvas.GmailAPI.registerGmailHandler() completed');
			var sigInstance = new com.BlankCanvas.GmailSigInstance(gmailInstance);
		}
		com.BlankCanvas.GmailAPI.registerGmailHandler(gmailResult);
	});
}, false);

